# Auction Platform

A basic MERN stack online auction platform built for a college-level project.

## Folder Structure

```
MERN/
  client/
    src/
      components/
      context/
      pages/
      services/
      styles/
    index.html
    package.json
    vite.config.js
  server/
    config/
    middleware/
    models/
    routes/
    utils/
    package.json
    server.js
```

## Features

- Seller and buyer registration/login
- JWT auth with bcrypt password hashing
- Add, view, and delete auction products
- Manual bidding with highest bid stored in MongoDB
- Countdown timer for every auction item
- Bid history under each product
- Simple dashboards for sellers and buyers

## Backend API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/products`
- `GET /api/products/mine`
- `GET /api/products/:id`
- `POST /api/products`
- `DELETE /api/products/:id`
- `POST /api/bids/:productId`
- `GET /api/bids/:productId`

## Environment Files

Create these files from the examples provided:

- `server/.env`
- `client/.env`

### Server `.env`

```
PORT=5000
MONGO_URI=mongodb+srv://kondamwarakshaya1810_db_user:yRY1nI0QAeO863Mw@auction.afozaio.mongodb.net/auction_platform?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:5173
```

### Client `.env`

```
VITE_API_URL=http://localhost:5000/api
```

## Install Commands

Run these inside each folder:

```bash
cd server
npm install

cd ../client
npm install
```

## Run Project

Open two terminals:

```bash
cd server
npm run dev
```

```bash
cd client
npm run dev
```

## Example Screenshots Description

- Home page: light hero section with auction cards below it.
- Seller dashboard: add-product form at the top and own products in cards below.
- Buyer dashboard: browse cards with bid input, bid button, and history link.
- Product details page: larger image, countdown timer, bid form, and bid history list.
- Login and register pages: centered simple form cards with clean spacing.
