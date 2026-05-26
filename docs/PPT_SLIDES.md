% Auction Platform — Presentation Slides

---

# Slide 1: Title
- Project: Online Auction Platform
- Team / Author: (Your name)
- Tech: MERN (MongoDB, Express, React, Node)
- Date: 26 May 2026

---

# Slide 2: Motivation & Goal
- Why build: learn MERN and web app flows
- Goal: a simple auction system with seller/buyer dashboards and bidding
- Constraints: no sockets, no payment gateway, simple auth (JWT)

---

# Slide 3: Tech Stack
- Frontend: React, Vite, Axios, CSS
- Backend: Node.js, Express, JWT, bcrypt
- Database: MongoDB Atlas + Mongoose
- Tools: Vite, nodemon

---

# Slide 4: High-Level Architecture
- Browser → React app (client)
- Client ↔ REST API (Express)
- Express ↔ MongoDB (Mongoose)
- JWT for auth, axios interceptor injects token

Speaker notes: show a simple block diagram.

---

# Slide 5: Data Models
- `User`: name, email, passwordHash, role (buyer|seller)
- `Product`: sellerId, title, description, imageUrl, startingBid, currentHighestBid, auctionEndTime, sold, winner info
- `Bid`: productId, bidderName, bidderEmail, amount
- `Notification`: userEmail, message, read

---

# Slide 6: Authentication Flow
- Register -> store hashed password
- Login -> compare hash -> issue JWT
- Client stores JWT in localStorage
- Protected API routes verify JWT (middleware)

---

# Slide 7: Seller Features
- Add auction product (title, image URL, starting bid, end time)
- View own products
- Delete product
- See current highest bid

---

# Slide 8: Buyer Features
- Browse auctions
- Place bids (client-side input) — server validates amount
- View product details and bid history
- Receive notification if you win

---

# Slide 9: Bidding & Timer
- `CountdownTimer` component shows remaining time
- When timer ends, client triggers `POST /api/products/:id/finalize`
- Server marks product sold, stores winner details, creates notification

---

# Slide 10: APIs (Key endpoints)
- `POST /api/auth/register`, `POST /api/auth/login`
- `GET /api/products`, `POST /api/products`, `GET /api/products/:id`
- `POST /api/bids/:productId`, `GET /api/bids/:productId`
- `GET /api/notifications`, `POST /api/notifications/:id/read`

---

# Slide 11: Demo Steps
- Register seller and buyer
- Seller adds product (set end time a minute ahead)
- Buyer places incrementing bids
- Wait for countdown to end (or open product to trigger finalize)
- Winner sees alert notification on next login/refresh

---

# Slide 12: Screenshots (include these in slides)
- Home page hero + product grid
- Seller Dashboard (add form + products)
- Buyer Dashboard (bidding UI)
- Product Details (countdown + history)
- Login/Register form

---

# Slide 13: Limitations & Future Work
- Finalize triggered client-side; use server cron in future
- Replace `window.alert` with a notification center
- Add image upload and validation
- Add unit tests and CI

---

# Slide 14: How to Run (quick)
```bash
# Server
cd server
npm install
npm run dev

# Client
cd client
npm install
npm run dev
```

- Open `http://localhost:5173`

---

# Slide 15: Q&A
- Questions?

---

# Appendix: Generating a PPT
- Option A: Use Marp (Markdown → HTML/PDF)
  - Install: `npm i -g @marp-team/marp-cli`
  - Generate PDF: `marp docs/PPT_SLIDES.md -o presentation.pdf`
- Option B: Use Pandoc to make PPTX
  - `pandoc docs/PPT_SLIDES.md -s -o presentation.pptx`
  - Note: Pandoc PPTX support may need a template and better formatting tweaks.

Speaker notes: If you want, I can create the actual slides (Marp or Pandoc) and include screenshots from the app.
