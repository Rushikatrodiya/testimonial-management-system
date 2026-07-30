# P1 Tasks (in priority order)  

## Task 1: Embeddable Widget (iframe + script tag)

**Why this first:** It's self-contained, high impact, and makes your product feel complete.

**What to build:**

- **Backend endpoint that returns widget assets (JS + CSS)**
  - `/api/widget/embed.js` — script that injects testimonials into parent page
  - Widget accepts a businessId parameter (hardcode one value for now)
- **Widget React component**
  - Lightweight, self-contained component
  - Fetches approved testimonials from your API
  - Renders them in a carousel or grid
  - Styles isolated (CSS-in-JS or Shadow DOM to prevent parent page interference)
- **Demo HTML page**
  - Plain HTML file in `/public/widget-demo.html`
  - Shows how to embed: `<script src="https://yourapp.com/api/widget/embed.js"></script><div id="testimonial-widget"></div>`
  - Proves it works outside React context

**Key considerations:**

- Widget must not conflict with parent page styles
- Keep script load lightweight (lazy-load testimonials)
- Support CORS (you already have CORS set up in backend)

## Task 2: Widget Customization

**Scope:** Accent color + optional layout variants

**Implementation:**

- **Color customization**
  - Backend: Accept `accentColor` query param in widget embed script
  - Widget: Pass color to component via window variable or data attribute
  - Apply to buttons, rating stars, accents
- **Layout options (pick one)**
  - Grid (current wall layout)
  - Carousel (swipe/arrow navigation)
  - Testimonial ticker (scrolling list)
- Query params the script accepts:
  - `/api/widget/embed.js?accentColor=rgb(16,185,129)&layout=carousel`

## Task 3: Duplicate/Junk Submission Handling

**Why:** Real product feature; shows maturity.

**What to build:**

- **Backend validation**
  - Check for duplicate emails within last 30 days
  - Flag testimonials with suspicious patterns (all caps, spam keywords, very short)
  - Don't reject automatically; flag in dashboard as "SUSPICIOUS" or "DUPLICATE"
- **Dashboard UI**
  - Show flag reason in submission row
  - Allow override (approve anyway) or auto-reject
- **Database schema**
  - Add optional `flagReason` field to testimonial model
  - Add `isDuplicate` boolean check

## Task 4: Pagination/Lazy-Loading

**Why:** Scale gracefully; shows you think about performance.

**What to build:**

- **Wall page:**
  - Implement "Load more" button or infinite scroll
  - Backend: Accept `skip` and `take` query params
  - Load 6-9 testimonials per page initially
- **Widget:**
  - If >10 testimonials, show carousel or "See all" link
  - Or implement pagination within widget
- **Dashboard:**
  - Already shows by status tab; add pagination if many pending
