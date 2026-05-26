# Auction Platform — Detailed Features Documentation

This document describes the features, architecture, APIs, data models, and run instructions for the MERN Auction Platform built in `d:/MERN`.

## Overview
A beginner-to-intermediate MERN (MongoDB, Express, React, Node) project implementing a simple online auction platform with: user registration/login (JWT), seller and buyer dashboards, product listings, manual bidding, countdown timers, bid history, and simple notifications when an auction is finalized and a winner is assigned.

## Tech Stack
- Frontend: React (functional components) + Vite + CSS
- Backend: Node.js + Express
- Database: MongoDB Atlas (Mongoose)
- Auth: JWT + bcrypt
- HTTP client: axios

## Folder layout (key files)
- `server/`
  - `server.js` — express app and route mounting
  - `config/db.js` — mongoose connection
  - `models/` — `User.js`, `Product.js`, `Bid.js`, `Notification.js`
  - `routes/` — `authRoutes.js`, `productRoutes.js`, `bidRoutes.js`, `notificationRoutes.js`
  - `middleware/authMiddleware.js` — `protect` and `sellerOnly`
  - `utils/generateToken.js` — JWT helper
- `client/`
  - `src/App.jsx` — router and route definitions
  - `src/context/AuthContext.jsx` — login state + notification fetcher
  - `src/services/api.js` — axios instance with auth header injection
  - `src/pages/` — `HomePage`, `SellerDashboard`, `BuyerDashboard`, `ProductDetails`, `LoginPage`, `RegisterPage`
  - `src/components/` — `ProductCard`, `CountdownTimer`, `Navbar`, `ProtectedRoute`
  - `src/styles/` — `global.css`, `app.css`

## Core Features (detailed)

### Authentication
- Endpoints:
  - `POST /api/auth/register` — Register with `name`, `email`, `password`, `role` ("buyer" or "seller"). Passwords are hashed with `bcrypt` before saving.
  - `POST /api/auth/login` — Login with `email` and `password`. On success returns a JWT token and basic user info.
- JWT token stored in client `localStorage` (key: `auctionUser`) and sent in `Authorization: Bearer <token>` by axios interceptor (`client/src/services/api.js`).
- `server/.env` contains `JWT_SECRET` used for signing tokens.
- `authMiddleware.protect` verifies the token and attaches decoded user info to `req.user`.
- `sellerOnly` middleware checks `req.user.role` to protect seller routes.

### Products
- Mongoose model `Product` fields (notable):
  - `sellerId`, `sellerName`, `title`, `description`, `imageUrl`, `startingBid`, `currentHighestBid`, `currentHighestBidderName`, `currentHighestBidderEmail`, `auctionEndTime`
  - Added fields for finalization: `sold` (bool), `winnerId`, `winnerName`, `winnerEmail`, `soldPrice`, `soldAt`.
- Endpoints:
  - `GET /api/products` — list all products (used by home and buyer views)
  - `GET /api/products/:id` — get product and its bids
  - `POST /api/products` — create a product (seller-only)
  - `GET /api/products/mine` — list seller's own products (seller-only)
  - `DELETE /api/products/:id` — delete a product (seller-only, removes related bids)
  - `POST /api/products/:id/finalize` — finalize auction after end time (marks sold, assigns winner, creates notification)

### Bids & Bid History
- Mongoose model `Bid` fields: `productId`, `bidderName`, `bidderEmail`, `amount`, timestamps.
- Endpoints:
  - `POST /api/bids/:productId` — place a bid (buyer-only middleware check on server). Server validates:
    - Bid amount is number > current highest
    - Auction has not ended
    - Updates `Product` current highest bid fields and stores `Bid` document.
  - `GET /api/bids/:productId` — get bid history for product
- Bid history shown in product details in descending timestamp order.

### Countdown Timer & Finalization
- `CountdownTimer` component shows time left to `auctionEndTime` and calls an `onEnd` callback when it reaches zero.
- `ProductCard` uses `CountdownTimer` with `onEnd` to request `/api/products/:id/finalize` when client detects the auction ended. This is a simple, beginner-friendly approach without background jobs or sockets.
- `finalize` server logic:
  - Checks auction end time
  - If product has `currentHighestBidderEmail`, records winner and sold price
  - Marks `sold = true` and sets `soldAt`
  - Creates a `Notification` document to inform the winner

### Notifications
- Model `Notification`: `userId`, `userEmail`, `message`, `relatedProductId`, `read`, timestamps.
- Routes:
  - `GET /api/notifications` — returns notifications for authenticated user by email
  - `POST /api/notifications/:id/read` — mark as read
- Client `AuthContext` fetches notifications when a user is present. Unread notifications are displayed with `window.alert` (simple student-style notification). After showing, the client marks them read via `POST /api/notifications/:id/read`.

### UI / Frontend
- Currency: all displays use `₹` (Indian rupee) in product cards, details, and bid histories.
- Pages:
  - `Home` — hero + grid of product cards
  - `Seller Dashboard` — add product form + list of seller products with delete
  - `Buyer Dashboard` — grid with bid inputs and quick place bid buttons
  - `Product Details` — larger image, countdown, bid form, and bid history list
  - `Login / Register` — forms for auth
- Routing: `react-router-dom` with a `ProtectedRoute` wrapper that checks `AuthContext` state and allowed roles.

## API examples (curl)

- Register:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"pass123","role":"buyer"}'
```

- Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"pass123"}'
```

- Add product (seller):
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Vintage Lamp","description":"Good condition","imageUrl":"https://..","startingBid":500,"auctionEndTime":"2026-05-27T15:00:00.000Z"}'
```

- Place bid (buyer):
```bash
curl -X POST http://localhost:5000/api/bids/<PRODUCT_ID> \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"amount":750}'
```

## Running & Development
1. Create `.env` files from examples.
2. Start backend (server port 5000):
```bash
cd server
npm install
npm run dev
```
3. Start frontend (Vite dev server port 5173):
```bash
cd client
npm install
npm run dev
```
4. Open `http://localhost:5173` in the browser.

## Limitations & Notes
- Finalization is client-triggered when countdown reaches zero — not a robust server-side scheduled job. This was chosen to keep the app simple and beginner-friendly.
- Notifications are in-app alerts using `window.alert` (simple). For production use, use a UI notification center or email integration.
- JWT secret is stored in `server/.env` for development. In production, use environment variables managed by the host provider.
- No payments are processed — the auction only records the winner and final price.

## Future Improvements (ideas)
- Improve finalization by running a server-side scheduled job or cron worker.
- Add email notifications with nodemailer.
- Add a notification center in the Navbar (instead of alerts).
- Add image upload (S3) instead of requiring image URLs.
- Add pagination, filtering, and search for products.
- Add unit/integration tests for API endpoints.

---

For a compact slide-ready outline, see `docs/PPT_SLIDES.md`.
