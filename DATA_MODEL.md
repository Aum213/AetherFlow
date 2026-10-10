# AetherFlow data model

The prototype uses static creator records in `src/data.js` and browser `localStorage` for user-authored state. No account, API, or remote database is used.

## Creator (`src/data.js`)

- `id`, `name`, `handle`, `location`, `avatar`, `bio`, `specialty`: creator identity and positioning.
- `skills`, `tools`, `content`: declared matching terms (arrays of strings).
- `formats`, `ratios`: supported delivery formats and aspect ratios.
- `workflow`, `projects`: creator-described process and portfolio samples. A project contains `title`, `description`, `image`, plus the creator's declared `tools`, `workflow`, and `formats` as portfolio context. These are not verified per-project production logs.
- `commercial`, `disclosure`: commercial-use availability and creator-declared terms.
- Trust evidence is presented as creator declarations and demo portfolio evidence; it is not third-party verification.

## Creative brief (`localStorage: af-briefs`)

Each brief has a stable `id`, `updatedAt`, and form fields for title, brand, objective, rough idea, content type, style, audience, skills, tools, aspect ratio, format, deliverables, duration, budget, deadline, license, and instructions. Briefs are editable and reopened from the brief builder or workspace.

## Shortlist (`localStorage: af-shortlist`)

An array of creator IDs. Add/remove actions update the stored array immediately. The workspace and shortlist page derive counts and contents from this state.

## Matching

`match()` in `src/App.jsx` compares a brief with declared creator data using weighted criteria: specialization/content type (25%), skills (25%), tools (15%), output format (8%), aspect ratio (7%), and commercial-use terms (20%). Skills and tools earn proportional points based on direct case-insensitive substring overlap; other criteria match against listed values. An omitted skills/tools or commercial-use constraint is not penalized. The profile breakdown shows criterion points and explanations. Scores indicate overlap only; they are not quality judgments, recommendations backed by outcome data, or endorsements.

## Evidence labels

Tool and workflow labels reflect creator-provided profile data. Portfolio evidence means samples and descriptions are included in the demo; it does not mean they were independently reviewed. The interface explicitly says when independent verification has not occurred. No independent verification state is stored.

## Limitations

Data is local to one browser profile and can be cleared by the user. Portfolio images are externally hosted Unsplash URLs with normal network availability requirements. The “Brief assistant” is a deterministic local drafting helper and does not call an AI model. Matching uses simple string overlap and does not evaluate budgets, deadlines, rights suitability beyond the disclosed commercial flag, or creator availability.
