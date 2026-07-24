# DevSync

A developer collaboration platform where developers build profiles, connect with each other, recruit teammates for projects, and share development updates.

Built as a full-stack MVP using the MERN stack (MongoDB, Express, React, Node.js).

---

## 🌐 Live Demo
[![Frontend](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel)](https://devsync-az.vercel.app/)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)]( https://devsync-api-q09r.onrender.com)

## Features

### Authentication
- Register / Login / Logout
- JWT-based auth stored in **httpOnly cookies** (not localStorage) for XSS protection
- Persistent login — session survives page refresh via a `/auth/me` check on app load
- Protected routes on both frontend (React Router guards) and backend (middleware)

### Developer Profiles
- Bio, skills (tag-based), GitHub username (linked to actual GitHub profile), portfolio URL, location
- Profile picture via image URL (no file upload/storage service used — kept MVP-simple)
- AI-assisted bio generation (see below)

### Developer Discovery
- Search developers by name or username
- Filter by skill
- Debounced search-as-you-type

### Connections
- Send / accept / reject / remove connection requests (mutual, LinkedIn-style — not one-directional following)
- Rejecting a request deletes it rather than permanently blocking future requests
- Real-time status sync across profile views (`not_connected`, `pending_sent`, `pending_received`, `connected`)

### Dev Feed
- Create posts with optional project tag and skill tags
- Like / unlike posts (optimistic UI update)
- Comment on posts, with one level of threaded replies
- Delete posts/comments (author-only, with confirmation dialog for posts)
- Posts can link directly to an actual DevSync project (clickable)

### Project Recruiting
- Post a project with a tech stack and specific roles needed (each with required skills)
- Browse/filter open projects by skill
- Apply to a specific role with an optional message
- Project owners can view applicants, accept (auto-fills the role and auto-rejects other pending applicants for that role) or reject
- Applicants can track their application status (pending / accepted / rejected) in "My Applications"
- Project owners can edit project details or open/close recruiting
- **Skill-match recommendations**: owners can get a ranked list of developers whose profile skills best match a role's required skills

### AI-Assisted Content
- "Generate with AI" button for bios and project descriptions
- Powered by Groq's LLM API (Llama 3.3 70B) — user provides a few keywords, AI drafts text the user can edit before saving
- Server-side prompt construction and character-limit enforcement (never exposes API key to frontend)

---

## Tech Stack

**Frontend:** React (Vite), Tailwind CSS v4, React Router, Context API, Axios
**Backend:** Node.js, Express.js, MongoDB, Mongoose
**Auth:** JWT, bcryptjs, httpOnly cookies
**AI:** Groq API (Llama 3.3 70B Versatile)

---

## Architecture Notes

- **MVC pattern** on the backend: `models/` (Mongoose schemas), `controllers/` (business logic), `routes/` (endpoint definitions)
- **Centralized error handling** via Express middleware (`errorMiddleware.js`) — controllers throw/pass errors to `next()`, one place formats all API error responses
- **Separate collections over embedded arrays** for `Connection` and `Application` — both have their own lifecycle/state (pending/accepted/rejected) and need independent querying (e.g. "all pending requests sent to me"), which embedded arrays on `User`/`Project` would make awkward and error-prone
- **httpOnly cookies over localStorage** for JWT storage — immune to XSS-based token theft; the frontend never directly touches the token, it just relies on the browser sending the cookie automatically (`withCredentials: true` in Axios)
- **AI prompt construction happens server-side only** — the frontend sends a `type` + `keywords`, never a raw prompt, keeping the actual prompt engineering centralized and preventing prompt injection via user input

---

## Project Structure

```
devsync/
├── server/
│   ├── config/          # MongoDB connection
│   ├── controllers/      # Business logic (auth, users, connections, posts, comments, projects, applications, ai)
│   ├── models/           # Mongoose schemas (User, Connection, Post, Comment, Project, Application)
│   ├── routes/           # Express routers
│   ├── middleware/       # Auth protection, centralized error handling
│   ├── utils/            # JWT generation helper
│   └── server.js
│
└── client/
    ├── src/
    │   ├── api/           # Axios instance (baseURL + credentials config)
    │   ├── components/
    │   │   ├── common/    # Reusable UI (Button, Input, cards, forms, etc.)
    │   │   └── layout/    # Navbar
    │   ├── context/       # AuthContext (global auth state)
    │   ├── routes/        # ProtectedRoute wrapper
    │   ├── pages/         # Route-level page components
    │   ├── App.jsx
    │   └── main.jsx
    └── vite.config.js
```

---

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- A MongoDB connection string (local MongoDB or MongoDB Atlas free tier)
- A free Groq API key from [console.groq.com](https://console.groq.com) (only needed for the AI content generation feature)

### Backend

```bash
cd server
npm install
cp .env.example .env   # then fill in your actual values
npm run dev
```

Server runs on `http://localhost:5000` by default.

### Frontend

```bash
cd client
npm install
cp .env.example .env   # then fill in your actual values
npm run dev
```

Frontend runs on `http://localhost:5173` by default.

---

## Environment Variables

See `server/.env.example` and `client/.env.example` for the required variables. Never commit actual `.env` files — they're gitignored.

---

## Known Limitations (by design, for MVP scope)

- Profile pictures are image URLs, not uploaded files (no cloud storage service integrated)
- No real-time notifications — users check pages manually for updates (likes, connection requests, application status)
- No messaging system — once an application is accepted, the applicant's email is revealed to the project owner so they can continue the conversation outside the platform
- Editing a project's roles can orphan existing applications if a role is removed entirely (accepted trade-off; no role-versioning system built)
- No pagination on feed/discover/project lists (capped at 50–100 results) — acceptable at MVP scale

---

## Author

Built as a college placement project to demonstrate full-stack development skills across authentication, database design, REST API architecture, and React frontend development.
