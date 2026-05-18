# 건강 기능식품 판단 MVP

## Summary

Build an MVP that helps consumers decide whether a health functional food or supplement is meaningful for their intended use. The product should reduce harm from exaggerated marketing, mismatched use cases, meaningless dosing, and hidden overlap with supplements or medicines the user already takes.

The MVP starts with three clearly separated entry points:

1. Product link check
2. Goal-based consultation
3. Advertisement or product-description interpretation

Each entry point uses the same judgment engine: ingredient evidence, dose meaning, goal fit, product claims, quality signals, overlap, interactions, and evidence sources.

## Problem

Consumers often buy supplements because a claim sounds plausible, not because the product meaningfully fits their goal or dose. The user called out examples:

- Lutein has evidence around specific eye-health contexts, but is often bought for generic office-worker eye fatigue.
- Olive oil capsules may contain doses too small to matter compared with normal dietary intake.
- Advertisements are often not plainly false, but they can be full of claims that are technically true and weak for purchase decisions.

The MVP should make these weak links visible before purchase.

## Target User Moment

The primary moment is purchase evaluation. The user has a product, claim, goal, or advertisement in front of them and wants to know whether it is worth buying.

The app should answer:

- Does this product make sense for my goal?
- Is the dose meaningful at the labeled serving size?
- Are the advertising claims useful, overstated, or missing context?
- Are there overlapping ingredients or interaction risks with what I already take?
- When does this product make the most sense to take?
- What evidence is this judgment based on?

## Entry Points

### Product Link Check

The user enters a product page link.

Supported targets for MVP:

- Coupang
- iHerb
- Naver Shopping, if feasible

The app extracts or asks the user to supplement:

- Product name
- Supplement facts or nutrition label
- Daily serving recommendation
- Ingredient amounts
- Main advertisement claims
- Source, manufacturer, certification, testing, or raw-material information when visible
- Price when visible

If parsing fails, the app should ask for a screenshot or pasted text instead of treating the product as unsupported.

### Goal-Based Consultation

The user enters a goal such as eye fatigue, liver health, skin, exam preparation, immunity, sleep, or blood circulation.

The app explains:

- Which ingredients have evidence for that goal
- Which ingredients are commonly marketed for that goal with weak or indirect support
- What dose ranges or context matter
- Which safety concerns or interactions commonly affect that goal area

This mode does not require a product link. It should help users avoid buying the wrong category before they choose a product.

### Advertisement Or Product-Description Interpretation

The user pastes ad copy or product-description text.

The app should not frame this as a simple lie detector. Most bad supplement marketing is not obviously false. The useful output is:

- Claims that may be technically true but weak for purchase decisions
- Claims based on a different research context than the user's likely goal
- Claims that omit dose, population, or outcome context
- Disease-treatment implications that should be treated cautiously
- Statements that should be checked against official claims or evidence

## User Inputs

The MVP should avoid login and persistent personal profiles.

Per-check inputs:

- Product link, goal, or ad text depending on entry point
- Optional intended goal
- Optional current supplements
- Optional current medicines
- Optional intended serving adjustment when the app detects low, high, or near-limit dosing

Current supplements and medicines are session-only. They are used for overlap and interaction checks, then discarded unless a future version adds explicit account storage.

## Judgment Model

The judgment target is the product in context, not just the ingredient.

### Ingredient Evidence

Evaluate whether the ingredient has evidence for the user's stated goal or for the product's own advertised claim. For example, the app should distinguish a lutein product's evidence for age-related eye-health contexts from generic eye-fatigue claims.

### Dose Meaning

Evaluate the labeled daily serving first. The app should look at active amounts, not only headline amounts.

Examples:

- Omega-3 should focus on EPA + DHA rather than only total fish oil.
- A product can include a relevant ingredient but at a dose too low to matter.
- A product can have meaningful dose but require caution if the user also takes overlapping nutrients.

### Serving Scenario

The default judgment uses the label's recommended serving.

If the dose appears low, high, or close to an upper limit, the app exposes a serving adjustment control. Examples:

- Two capsules per day
- One capsule every other day
- User-entered serving frequency

The app must not encourage arbitrary dose increases. For nutrients with overdose risk, it should show upper-limit and overlap warnings.

### Intake Timing

After the app reaches a product judgment, it should provide basic intake timing guidance when the product type supports it.

Examples:

- Fat-soluble vitamins or carotenoids may make more sense with a meal that contains fat.
- Magnesium, sleep-related products, or stimulant-like ingredients may have time-of-day considerations.
- Iron, calcium, caffeine, fiber, and some medicines can create spacing concerns.

Timing guidance should be practical and conservative. It should not claim a precise schedule unless the evidence or label supports it. If medicines are involved, the app should frame timing as a check-with-professional item when needed.

### Product Quality Signals

Product judgment may consider:

- Raw-material supplier
- Third-party testing
- Certification
- Heavy-metal or oxidation testing when relevant
- Manufacturer transparency

These signals affect confidence but should not dominate the conclusion by themselves. They are especially useful when comparing products with similar ingredient and dose profiles.

### Overlap And Interactions

The user can enter current supplements and medicines for the session.

The app checks:

- Duplicate ingredients
- Total daily amount across products
- Upper-limit proximity
- Known supplement-medicine interaction cautions

For medicines, the app should avoid treatment or prescription advice. It should use cautious phrasing such as "possible interaction, check with a clinician or pharmacist."

## Result Screen

Use a layered result:

1. One-line conclusion
2. Reason tags
3. Plain-language explanation
4. Dose and serving analysis
5. Overlap and interaction cautions
6. Intake timing guidance
7. Evidence section
8. Expert view

Example conclusion:

> Eye-fatigue use is weakly supported for this product.

Example reason tags:

- Goal mismatch
- Dose context missing
- Ad claim needs context
- Overlap check needed

The result tone is staged:

- Purchase judgment should be direct.
- Evidence strength should show uncertainty clearly.
- Medicine and safety areas should be conservative.

## Expert View

The default explanation should be easy to read. The expert view can expand:

- Official sources used
- Key papers, systematic reviews, or meta-analyses used
- Product-page claims extracted
- Label facts extracted
- Dose calculations
- Interaction warnings and confidence
- Parsing failures or missing data
- Intake timing assumptions
- Why the app reached the conclusion

## Evidence Sources

Source priority:

1. Official sources such as MFDS, NIH Office of Dietary Supplements, NCCIH, and FDA
2. Major guidelines, systematic reviews, and meta-analyses
3. Product page details such as ingredients, label facts, serving size, source, tests, certifications, and claims
4. Brand claims as analysis targets, not as trusted evidence

Initial official source references:

- FDA label claims: https://www.fda.gov/food/labeling-nutrition/label-claims
- NIH Office of Dietary Supplements fact sheets: https://ods.od.nih.gov/factsheets/
- NCCIH herb-drug interaction overview: https://www.nccih.nih.gov/health/providers/digest/herb-drug-interactions

## MVP Scope

Included:

- Three-mode first screen
- Coupang and iHerb link analysis
- Naver Shopping support if feasible
- Fallback screenshot or text input when link parsing fails
- Optional goal input
- Label-serving judgment
- Serving scenario adjustment only when useful
- Session-only supplement and medicine input
- Duplicate ingredient and total amount checks
- Conservative interaction cautions
- Practical intake timing guidance when relevant
- Plain explanation plus expert view
- Official-source and research-backed evidence model
- Ad claim interpretation focused on meaningfulness, not just truth

Excluded:

- Login
- Stored personal supplement profile
- Medical diagnosis
- Treatment advice
- Prescription changes
- Universal shopping-mall parser
- Full product recommendation ranking
- Definitive quality score based only on raw-material supplier or certification
- Any suggestion that users should casually exceed labeled serving size

## Expert Review Notes

### CEO/Product

Concern: A broad supplement app can become a vague health assistant. That would weaken the core user promise.

Recommendation: Lead with the purchase decision. The first version should answer "should I buy this for this reason?" better than a generic chatbot or shopping review site.

Decision: The MVP keeps product link check as a core mode and treats goal consultation and ad interpretation as separate entry points that feed the same judgment engine.

### Design

Concern: If every answer looks like a medical report, users will not understand the result quickly. If every answer looks like a shopping score, users will not trust it.

Recommendation: Use a layered result with a clear conclusion first, then reason tags, then plain explanation, then expert view.

Decision: The result screen is staged so casual users can decide quickly and skeptical users can inspect sources and calculations.

### Engineering

Concern: Link parsing, supplement evidence, dose calculation, and interaction checks are separate problems. If they are mixed into one flow, the MVP will be brittle.

Recommendation: Separate ingestion from judgment. Build parsers as adapters, normalize product facts, then run a shared judgment pipeline.

Decision: The spec defines entry points and product extraction separately from the judgment model. Future implementation should keep parsers, normalized product facts, evidence lookup, and result generation as distinct modules.

## Open Implementation Questions

- Which stack should the MVP use?
- Should link parsing be server-side only?
- What is the minimum reliable data schema for normalized product facts?
- Which ingredient set should be supported first?
- How should Korea-specific functional claims from MFDS be represented?
- How should the app surface uncertainty when a product page cannot be parsed cleanly?

These should be answered in the implementation plan, not by expanding the product scope.
