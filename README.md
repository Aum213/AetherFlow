# AetherFlow

AetherFlow is a hackathon prototype for brands and creative teams looking for AI-native independent creators. It helps a brand describe a campaign, explore creator portfolios, compare declared capabilities with brief requirements, and keep a local shortlist.

## The product

The creator marketplace is designed around process evidence as well as finished visuals. **Behind the Generation** opens an editorial portfolio case file with creative intent, human direction, a creator-described workflow, iteration notes, final-selection rationale, delivery context, and commercial-use questions. This gives a reviewer more to assess than a tool list or a single match number.

The included creators, portfolios, and case studies are fictional demo content. Disclosures and capabilities are sample creator declarations, not real client histories, endorsements, or independently verified claims.

## Technology

- React 18 and Vite 6
- `lucide-react` for interface icons
- Browser `localStorage` for saved briefs and shortlist state
- Static sample creator data; no server, account system, or external API integration

## Run locally

Requirements: Node.js 18+ and npm.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). To create and inspect a production build:

```sh
npm run build
npm run preview
```

The application does not require environment variables or API keys.

## Project map

- `src/App.jsx` — screens, interactions, form state, local persistence, and UI components
- `src/data.js` — fictional creator profiles and portfolio examples
- `src/matching.js` — deterministic creator matching and portfolio evidence selection
- `src/styles.css`, `src/originality.css` — application styling
- `DATA_MODEL.md` — data fields, matching, evidence, and limitations

## Matching and AI behavior

Match scores compare requirements present in a brief with declared creator profile attributes. The weighted criteria are specialization/content type (25), skills (25), tools (15), output format (8), aspect ratio (7), and commercial-use availability (20). Skills and tools use case-insensitive substring overlap; listed format, ratio, content type, and commercial availability are treated as exact or binary matches. Unspecified criteria are excluded from the denominator. The percentage is an overlap aid, not a quality rating or objective recommendation.

Portfolio evidence is selected separately from project title, description, and listed focus terms; it does not contribute to the score. This is a simple demo heuristic, not semantic search. The “Brief assistant” fills suggested fields using local deterministic rules; there is no generative AI call or model integration.

## Trust and evidence

The interface labels profile tools and workflow as creator-declared, portfolio material as fictional demo evidence, and commercial details as creator disclosures. The content has not been independently reviewed or verified. No independent verification status or verification provider is implemented.

## Deployment

The app builds to `dist/` and can be hosted as a static site. A straightforward option is Vercel:

1. Sign in to Vercel and authorize access to the existing private GitHub repository `Aum213/AetherFlow`.
2. Import that repository as a project.
3. Use the Vite defaults: build command `npm run build`, output directory `dist`, and no environment variables.
4. Deploy and open the deployment URL to check the app.

Netlify or Cloudflare Pages can use the same build command and `dist` output. The current UI keeps navigation in React state and has no pathname-based routes, so no SPA rewrite is required for the existing screens. If pathname routes are added later, configure the host to serve `index.html` for app routes. Deployment requires your hosting account authorization; this repository is not deployed by this project setup.

## Limitations and next steps

- Creator, project, case-study, and trust data are fictional seeded examples.
- Briefs and shortlists live only in the current browser profile and can be cleared with its site data; they are not shared or synchronized.
- Portfolio and avatar images come from Unsplash and need network access. Error handlers hide failed images rather than providing a designed fallback asset.
- Matching does not assess budget, deadline, availability, rights suitability beyond a declared commercial flag, or quality. Confirm license scope and campaign requirements directly.
- Add a persistence service and real creator-submitted evidence only if the product needs cross-device accounts; add a real AI integration only with explicit data handling and clear output attribution.
