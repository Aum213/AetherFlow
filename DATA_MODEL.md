# AetherFlow data model

The prototype uses static creator records in `src/data.js` and browser `localStorage` for user-authored state. No account, API, or remote database is used.

## Creator (`src/data.js`)

- `id`, `name`, `handle`, `location`, `avatar`, `bio`, `specialty`: creator identity and positioning.
- `skills`, `tools`, `content`: declared matching terms (arrays of strings).
- `formats`, `ratios`: supported delivery formats and aspect ratios.
- `workflow`, `creativeIdentity`, `projects`: creator-described process, creative identity, and fictional demo portfolio samples. A project contains `title`, `description`, `image`, profile-context `tools`, `workflowStages`, `formats`, and `ratios`, plus a `caseStudy` with creative intent, human direction, iterations, final-selection rationale, commercial-use questions, and limited portfolio-focus terms. These notes are fictional, creator-described demo context; they are not project logs or independently verified claims.
- `commercial`, `disclosure`: commercial-use availability and creator-declared terms.
- Trust evidence is presented as creator declarations and demo portfolio evidence; it is not third-party verification.

## Creative brief (`localStorage: af-briefs`)

Each brief has a stable `id`, `updatedAt`, and form fields for title, brand, objective, rough idea, content type, style, audience, skills, tools, aspect ratio, format, deliverables, duration, budget, deadline, license, and instructions. Briefs are editable and reopened from the brief builder or workspace.

## Shortlist (`localStorage: af-shortlist`)

An array of creator IDs. Add/remove actions update the stored array immediately. The workspace and shortlist page derive counts and contents from this state.

## Matching

`match()` in `src/matching.js` compares a brief with creator-profile attributes using weighted criteria: specialization/content type (25%), skills (25%), tools (15%), output format (8%), aspect ratio (7%), and commercial-use terms (20%). Skills and tools earn proportional points based on case-insensitive substring overlap; the other criteria are binary against listed values. Only criteria specified by the brief count in the denominator. The score is the rounded sum of earned points divided by applicable weight, expressed as a percentage; omitted requirements are marked “Not specified” and excluded. `portfolioEvidence()` selects a representative demo project by overlap with its listed focus terms, then describes that evidence separately. It does not affect the score. Scores indicate attribute overlap only, not quality, endorsement, or guaranteed project fit.

## “Behind the Generation” portfolio case file

Selecting a project opens an accessible editorial detail modal with its sample image; creative intent; human direction; workflow stages; iteration and trade-off notes; final-selection rationale; declared toolkit; delivery capabilities; and commercial-use questions. The source data is fictional demo content. Profile tools and delivery capabilities are explicitly labelled as creator-declared context rather than a confirmed project log.

## Evidence labels

Tool and workflow labels reflect creator-provided profile data. Portfolio evidence means samples and descriptions are included in the demo; it does not mean they were independently reviewed. The interface explicitly says when independent verification has not occurred. No independent verification state is stored.

## Limitations

Data is local to one browser profile and can be cleared by the user. Portfolio images are externally hosted Unsplash URLs with normal network availability requirements. The “Brief assistant” is a deterministic local drafting helper and does not call an AI model. Matching uses simple string overlap and does not evaluate budgets, deadlines, rights suitability beyond the disclosed commercial flag, or creator availability.
