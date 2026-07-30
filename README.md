# Testimonial Wall

A full-stack testimonial management platform that allows businesses to collect, moderate, and embed customer testimonials directly onto their websites.

**Live Demos:**
- **Main App:** [https://testimonial.rushikatrodiya.in/](https://testimonial.rushikatrodiya.in/)
- **Widget HTML Embed Demo:** [https://testimonial.rushikatrodiya.in/widget-demo.html](https://testimonial.rushikatrodiya.in/widget-demo.html)
- **Widget Customization Demo (Red Accent):** [https://testimonial.rushikatrodiya.in/widget?accentColor=red](https://testimonial.rushikatrodiya.in/widget?accentColor=red)

## ✨ Features

### 1. The Core Loop (P0 - Completed)
- **Submission Form:** A responsive public page for customers to submit their testimonials (including star rating, company, and optional photo).
- **Robust Backend:** A secure Node.js API built with Express and Prisma, persisting data reliably.
- **Moderation Dashboard:** An intuitive dashboard for business owners to review, approve, or reject submissions with a single click. Includes empty, loading, and error states.
- **Public Wall:** A dedicated public page that displays only approved testimonials. Rejected or pending testimonials are strictly hidden.

### 2. Widget & Enhancements (P1 - Completed)
- **Embeddable Widget:** A dynamic, lightweight widget designed to be embedded on third-party sites.
- **Customization:** The widget supports `accentColor` customization to match any brand's design system.
- **Smart Spam Detection & Duplicate Handling:** 
  - Backend validation automatically flags submissions containing known spam keywords or all-caps text.
  - Rate limiting prevents the same email from submitting multiple testimonials within a 30-day window.
- **Pagination & Optimization:** Fully implemented pagination for the moderation dashboard, ensuring high performance even with thousands of submissions.

### 3. Stretch Goals (P2 - Completed)
- **Live Deployment:** Successfully deployed and hosted live for immediate evaluation.
- **AI Testimonial Summarization:** Integrated Google Gemini AI (`gemini-flash-latest`) to automatically summarize long testimonials (>150 words) on the moderation dashboard. Features graceful error handling, caching via React Query, and a seamless "Read full" toggle.

## 🛠️ Tech Stack

- **Frontend:** React, Next.js (App Router), Tailwind CSS, React Query
- **Backend:** Node.js, Express, Prisma ORM
- **Database:** PostgreSQL
- **Styling:** Tailwind CSS + shadcn/ui

## ⚙️ Environment Variables

### Backend (`/backend/.env`)
```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/testimonials?schema=public
PORT=4000
FRONTEND_URL=http://localhost:3000
```

### Frontend (`/frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_GOOGLE_AI_API_KEY=your_gemini_api_key_here
```

## 🚀 Getting Started Locally

Follow these steps to run the project on your local machine.

### Prerequisites
- Node.js (v18+)
- Docker & Docker Compose
- npm or yarn

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd testimonial-wall
```

### 2. Backend Setup (Dockerized)
The backend is fully containerized with Postgres and Prisma. Ensure you have Docker and Docker Compose installed.

```bash
cd backend

# Start the API and Database containers in the background
docker-compose up -d --build
```
The API will be available at `http://localhost:4000`, and the PostgreSQL database will be accessible on port `5433`. The container will automatically handle Prisma migrations on startup.

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install

# Set up environment variables
# .env.local should contain: 
# NEXT_PUBLIC_API_URL=http://localhost:4000
# NEXT_PUBLIC_GOOGLE_AI_API_KEY=your_gemini_api_key_here

# Start the frontend development server
npm run dev
```
The application will be available at `http://localhost:3000`.

## 🗺️ Routes

**Frontend (`http://localhost:3000`)**
- `/`              -> Submission Form
- `/dashboard`     -> Moderation Dashboard
- `/wall`          -> Public Testimonial Wall
- `/widget`        -> Widget Demo Page

**Backend API (`http://localhost:4000`)**
- `POST /api/testimonials`              -> Submit a new testimonial
- `GET /api/testimonials`               -> List testimonials (Admin/Dashboard)
- `GET /api/testimonials/approved`      -> List approved testimonials (Wall/Widget)
- `PATCH /api/testimonials/:id/approve` -> Approve testimonial
- `PATCH /api/testimonials/:id/reject`  -> Reject testimonial

## 📁 Project Structure

The repository is organized into a monorepo-style structure to keep the frontend and backend decoupled but easily accessible.

- `/frontend`: Next.js application containing the submission form, moderation dashboard, public wall, and widget.
- `/backend`: Node.js/Express REST API handling data persistence, validation, and spam detection.

## 🧩 Widget Usage

To embed the testimonial widget on any third-party site, simply drop in this lightweight `<script>` tag. The script automatically injects the testimonials into the page where the script is placed.

You can fully customize the widget behavior using `data-*` attributes:

```html
<script 
  src="https://testimonial-api.rushikatrodiya.in/api/widget/embed.js" 
  data-wall-url="https://testimonial.rushikatrodiya.in/wall"
  defer>
</script>
```

## 🧪 Verification & Testing

- **End-to-End Flow:** You can submit a testimonial via the frontend (`/`), view it in the moderation dashboard (`/dashboard`), approve it, and immediately see it appear on the public wall (`/wall`) and the widget (`/widget`).
- **Spam Testing:** Try submitting a testimonial with the word "casino" or "buy now" to see the backend flag it appropriately.

## 🤖 Agent Collaboration
*(Please refer to the `JOURNAL.md` and agent instruction files in this repository for detailed insights into how AI coding agents were utilized during development.)*

---
*Built as part of an SDE-1 Take-Home Assignment, focusing on delivering a complete testimonial moderation workflow and embeddable widget.*
