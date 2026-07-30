# JOURNAL.md — Decision Journal

## 1. Prioritization

- **What I decided to build, in what order, and why:**
  I tackled the core loop (P0) first, starting from the database up. I set up Postgres and Prisma to ensure a solid foundation. Then, I built the API endpoints, followed by the frontend submission form, the dashboard, and finally the wall. Once P0 was rock solid, I tackled P1 (the embeddable widget, pagination, and spam detection), and then prioritized deploying it live via Docker (P2) so reviewers could test it instantly.
- **What I deliberately cut or skip:** 
  I deliberately skipped backend-blocking AI logic. Instead of holding up the user's submission request to generate summaries or sentiments, I implemented the AI Testimonial Summarization (P2) directly on the frontend dashboard using the Google Gemini API and React Query. This ensures a blazing fast submission flow while still providing powerful AI tools for the dashboard admin.

## 2. Key decisions

- **Decision:** The Widget Embed Method
  - **Options:** A simple `<iframe>` pointing to a Next.js route vs. a raw `<script>` tag serving vanilla JS.
  - **Why:** Iframes are easier but often look clunky (fixed heights, scrollbars) on third-party sites. I opted for the harder but more professional route: `GET /api/widget/embed.js`. This script seamlessly injects CSS and HTML directly into the host's DOM and parses `data-accent-color` attributes gracefully.

- **Decision:** Tech Stack
  - **Options:** Next.js full-stack vs. Next.js Frontend + Express Backend.
  - **Why:** I deliberately decoupled the frontend (Next.js) from the backend (Express). This monorepo separation makes it much easier to scale, deploy the API independently, and serve the widget script without mixing concern layers.

- **Decision:** Handling Duplicate/Spam Submissions
  - **Options:** External APIs (like Akismet) vs. internal heuristics.
  - **Why:** To keep the system lightweight and avoid 3rd-party dependencies, I implemented an internal rate limit (checking for submissions by the same email within 30 days) and a keyword-matching filter (`detectSuspiciousContent`). Instead of blocking spam entirely, it flags them with a `flagReason` so the business owner can make the final call in the dashboard.

## 3. Working with AI agents

- **Tools and models used:** Used Claude 4.6 Sonnet.
- **How I split the work:** I acted as the architect, defining the data models, the decoupled repo structure, and the logic flow. I handed off the heavy lifting of writing Tailwind UI components, boilerplate CRUD operations, and formatting to the agent.
- **Your agent setup:** I guided the agent interactively through chat prompts rather than static rule files. I maintained strict oversight over architectural decisions.
- **My 3 most important prompts:**
1. I need to add duplicate/junk submission detection.

  Current: Testimonial table has id, name, email, company, message, rating, photoUrl, status, createdAt.

  I want:
  1. Prisma migration: Add optional 'flagReason' field (string, null if not flagged)
  2. Backend validation: Check if email submitted in last 30 days → add flagReason = "Duplicate submission"
  3. Dashboard UI: Show flagReason badge on SubmissionRow component
  4. Keep normal approve/reject flow but show the reason

  Build in order:
  1. Prisma migration file
  2. testimonials.service.js update (add duplicate check in create handler)
  3. SubmissionRow.tsx update (show flag reason)

2. *"Write an Express route that dynamically generates a vanilla JavaScript IIFE. The script needs to locate its own `document.currentScript` tag, parse `data-accent-color`, and securely inject sanitized HTML/CSS into the host DOM."* -> Scaffolded the complex widget logic without relying on an iframe, solving the hardest technical constraint.


3. *"Implement a duplicate-detection heuristic function in Node.js that checks if an email has submitted within the last 30 days and flags the payload instead of failing the request, returning the reason."* -> Saved time on writing boilerplate date logic and helped implement the spam filtering efficiently.

- **At least one time AI was wrong:** The AI initially assumed I would use an `<iframe>` for the widget and even auto-generated a README highlighting the iframe. I had to correct it, pointing it to the custom `embed.js` route I had actually built. 
- **Something I rejected:** I rejected the AI's initial attempt at writing the `README.md` because it used overly marketing-heavy language ("beautifully styled", "premium user experience"). I explicitly asked it to strip those out for a more objective, engineering-focused tone.

## 4. Verification

- **How I convinced myself the code actually works:** 
  I ran the full E2E flow. I submitted a testimonial using the word "casino" (a spam keyword) on `localhost:3000`. I verified in Prisma Studio that it was saved with a `flagReason`. I logged into `/dashboard`, saw it was isolated in the "Pending" tab, clicked "Approve", and then navigated to both `/wall` and `/widget-demo.html` to confirm it populated successfully.
- **What is still fragile:** The widget CSS injection uses scoped classes (e.g., `.tw-container`), but a third-party site with highly aggressive global CSS (like `!important` tags on `div`s) could potentially bleed into our widget. A Shadow DOM implementation would fix this.

## 5. If I had 5 more hours

1. Wrap the widget output in a **Shadow DOM** to guarantee absolute CSS isolation from third-party host sites.
2. Expand the AI integration to auto-tag sentiment (Positive/Neutral/Negative) directly in the backend `testimonials.service.js` during submission.
3. Write automated unit tests for the spam detection and rate-limiting logic using Jest.
