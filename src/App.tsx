import { FormEvent, useMemo, useState } from "react";
import { analyzeSupplement, Mode } from "./analysis";
import { buildDsldSearchUrl, formatDsldSummary, normalizeDsldHits } from "./dsld";

const modes: Array<{
  id: Mode;
  title: string;
  description: string;
  label: string;
  placeholder: string;
}> = [
  {
    id: "product",
    title: "제품 링크 체크",
    description: "제품명, 링크, 성분표로 실제 함량과 목적 적합성을 판단합니다.",
    label: "상품 링크 또는 제품명",
    placeholder: "예: 오메가3 1000mg 또는 https://www.iherb.com/pr/...",
  },
  {
    id: "goal",
    title: "목적 기반 상담",
    description: "먹으려는 이유부터 보고 의미 있는 성분을 가릅니다.",
    label: "목적",
    placeholder: "눈 피로, 간 건강, 수면...",
  },
  {
    id: "ad",
    title: "광고/상품 설명 해석",
    description: "맞지만 의미가 약한 문구와 빠진 맥락을 찾습니다.",
    label: "광고 문구",
    placeholder: "하루 한 캡슐로 온 가족 눈 건강...",
  },
];

const examples = {
  product: {
    primaryInput: "오메가3 1000mg",
    productDetails: "Supplement Facts: Fish Oil 1000 mg, EPA 400 mg, DHA 200 mg. Suggested use: 1 softgel daily.",
    goal: "눈 건조감",
    currentSupplements: "멀티비타민, 비타민 D",
    currentMedicines: "항응고제",
  },
  goal: {
    primaryInput: "눈 피로",
    productDetails: "",
    goal: "",
    currentSupplements: "",
    currentMedicines: "",
  },
  ad: {
    primaryInput: "하루 한 캡슐로 온 가족 눈 건강을 관리하세요",
    productDetails: "",
    goal: "눈 피로",
    currentSupplements: "",
    currentMedicines: "",
  },
};

function App() {
  const [mode, setMode] = useState<Mode>("product");
  const [primaryInput, setPrimaryInput] = useState("");
  const [productDetails, setProductDetails] = useState("");
  const [goal, setGoal] = useState("");
  const [currentSupplements, setCurrentSupplements] = useState("");
  const [currentMedicines, setCurrentMedicines] = useState("");
  const [servingScenario, setServingScenario] = useState("라벨 권장량");
  const [lookupStatus, setLookupStatus] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [expertOpen, setExpertOpen] = useState(false);

  const activeMode = modes.find((item) => item.id === mode)!;
  const result = useMemo(() => {
    if (!submitted) return null;
    return analyzeSupplement({
      mode,
      primaryInput,
      productDetails,
      goal,
      currentSupplements,
      currentMedicines,
      servingScenario,
    });
  }, [currentMedicines, currentSupplements, goal, mode, primaryInput, productDetails, servingScenario, submitted]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    setExpertOpen(false);
  };

  const loadExample = () => {
    const example = examples[mode];
    setPrimaryInput(example.primaryInput);
    setProductDetails(example.productDetails);
    setGoal(example.goal);
    setCurrentSupplements(example.currentSupplements);
    setCurrentMedicines(example.currentMedicines);
    setLookupStatus("");
    setSubmitted(false);
    setExpertOpen(false);
  };

  const switchMode = (nextMode: Mode) => {
    setMode(nextMode);
    setPrimaryInput("");
    setProductDetails("");
    setGoal("");
    setCurrentSupplements("");
    setCurrentMedicines("");
    setServingScenario("라벨 권장량");
    setLookupStatus("");
    setSubmitted(false);
    setExpertOpen(false);
  };

  const lookupDsld = async () => {
    if (!primaryInput.trim()) {
      setLookupStatus("먼저 제품명이나 링크를 입력해 주세요.");
      return;
    }

    setLookupStatus("NIH 라벨 DB에서 비슷한 제품을 찾는 중입니다.");

    try {
      const response = await fetch(buildDsldSearchUrl(primaryInput), {
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error(`DSLD request failed: ${response.status}`);

      const data = (await response.json()) as { hits?: Parameters<typeof normalizeDsldHits>[0] };
      const summaries = normalizeDsldHits(data.hits ?? []);

      if (summaries.length === 0) {
        setLookupStatus("비슷한 라벨을 찾지 못했습니다. 성분표를 직접 붙여넣어 주세요.");
        return;
      }

      setProductDetails((current) =>
        [current, formatDsldSummary(summaries[0])].filter((value) => value.trim()).join("\n\n"),
      );
      setLookupStatus("가장 비슷한 NIH 라벨 후보를 성분표 입력칸에 추가했습니다.");
    } catch {
      setLookupStatus("NIH 라벨 DB 조회에 실패했습니다. 성분표를 직접 붙여넣어도 판단할 수 있습니다.");
    }
  };

  return (
    <main className="app-shell">
      <section className="hero" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">Supplement Check MVP</p>
          <h1 id="page-title">건강 기능식품, 사기 전에 판단하세요.</h1>
          <p className="hero-copy">
            제품명, 링크, 성분표, 광고 문구를 넣으면 함량과 근거, 중복 섭취, 섭취 시점을
            한 화면에서 확인합니다.
          </p>
        </div>
        <div className="status-pill">사용자 테스트용 프로토타입</div>
      </section>

      <section className="mode-grid" aria-label="기능 선택">
        {modes.map((item) => (
          <button
            className={`mode-card ${mode === item.id ? "selected" : ""}`}
            key={item.id}
            onClick={() => switchMode(item.id)}
            type="button"
          >
            <span>{item.title}</span>
            <small>{item.description}</small>
          </button>
        ))}
      </section>

      <section className="workspace">
        <form className="input-panel" onSubmit={onSubmit}>
          <div className="panel-header">
            <div>
              <h2>{activeMode.title}</h2>
              <p>{activeMode.description}</p>
            </div>
            <button className="ghost-button" onClick={loadExample} type="button">
              예시 입력
            </button>
          </div>

          <label className="field">
            <span>{activeMode.label}</span>
            {mode === "ad" ? (
              <textarea
                onChange={(event) => setPrimaryInput(event.target.value)}
                placeholder={activeMode.placeholder}
                required
                rows={5}
                value={primaryInput}
              />
            ) : (
              <input
                onChange={(event) => setPrimaryInput(event.target.value)}
                placeholder={activeMode.placeholder}
                required
                type="text"
                value={primaryInput}
              />
            )}
          </label>

          {mode === "product" && (
            <>
              <div className="lookup-row">
                <button className="ghost-button" onClick={lookupDsld} type="button">
                  NIH 라벨 DB 조회
                </button>
                {lookupStatus && <p>{lookupStatus}</p>}
              </div>

              <label className="field">
                <span>성분표/상품 설명</span>
                <textarea
                  onChange={(event) => setProductDetails(event.target.value)}
                  placeholder="예: Fish Oil 1000 mg, EPA 400 mg, DHA 200 mg. 1 softgel daily."
                  rows={6}
                  value={productDetails}
                />
              </label>
            </>
          )}

          {mode !== "goal" && (
            <label className="field">
              <span>목적 선택 입력</span>
              <input
                onChange={(event) => setGoal(event.target.value)}
                placeholder="예: 눈 피로, 혈행, 수면"
                type="text"
                value={goal}
              />
            </label>
          )}

          <div className="field-row">
            <label className="field">
              <span>현재 먹는 영양제</span>
              <input
                onChange={(event) => setCurrentSupplements(event.target.value)}
                placeholder="예: 멀티비타민, 비타민 D"
                type="text"
                value={currentSupplements}
              />
            </label>
            <label className="field">
              <span>현재 먹는 약</span>
              <input
                onChange={(event) => setCurrentMedicines(event.target.value)}
                placeholder="예: 항응고제, 혈압약"
                type="text"
                value={currentMedicines}
              />
            </label>
          </div>

          <button className="primary-button" type="submit">
            판단 결과 보기
          </button>
        </form>

        {result ? (
          <section className="result-panel" aria-live="polite">
            <div className="result-topline">
              <p>{result.title}</p>
              <span>확신도 {result.confidence}</span>
            </div>
            <h2>{result.conclusion}</h2>
            <div className="tag-list">
              {result.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>

            <ResultSection title="쉬운 설명" body={result.sections.explanation} />
            <ResultSection title="함량과 섭취량" body={result.sections.dose} />

            {result.showServingScenario && (
              <div className="scenario-box">
                <label className="field">
                  <span>섭취량 바꿔보기</span>
                  <select
                    onChange={(event) => setServingScenario(event.target.value)}
                    value={servingScenario}
                  >
                    <option>라벨 권장량</option>
                    <option>하루 2캡슐</option>
                    <option>이틀에 1캡슐</option>
                  </select>
                </label>
              </div>
            )}

            <ResultSection title="중복/상호작용" body={result.sections.interactions} />
            <ResultSection title="섭취 시점" body={result.sections.timing} />
            <ResultSection title="근거" body={result.sections.evidence} />

            <button
              className="expert-toggle"
              onClick={() => setExpertOpen((current) => !current)}
              type="button"
            >
              {expertOpen ? "전문가 보기 닫기" : "전문가 보기 열기"}
            </button>

            {expertOpen && (
              <ul className="expert-list">
                {result.sections.expert.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ) : (
          <section className="empty-panel">
            <h2>결과는 여기에 표시됩니다.</h2>
            <p>제품명이나 링크만으로 부족하면 성분표를 붙여넣어 실제 함량 기준으로 판단할 수 있습니다.</p>
          </section>
        )}
      </section>
    </main>
  );
}

function ResultSection({ title, body }: { title: string; body: string }) {
  return (
    <article className="result-section">
      <h3>{title}</h3>
      <p>{body}</p>
    </article>
  );
}

export default App;
