# Pricing App Pro

Full-stack pricing application with Node.js, Express, Oracle DB and a frontend UI.

---

## Features

- Product management (create + list)
- Price calculation (promotion + tax)
- REST API (Express)
- Oracle database integration
- Frontend UI (HTML, CSS, JS)
---

## Architecture
Frontend → API (Express) → Controllers → Oracle DB
---
## Backend
- Express.js
- Modular architecture:
  - routes/
  - controllers/
  - db.js
---
## Frontend
- Vanilla JS
- Fetch API
- Simple UI for:
  - adding products
  - calculating price
---
## API Endpoints

### Get all products
GET /products
### Create product
POST /products
### Calculate price
POST /calculate-price

## Example Calculation


Base Price: 200
Promotion: 10%
Tax: 20%
Quantity: 2

Final Price = 432


---

## Environment Variables


PORT=7000
DB_USER=...
DB_PASSWORD=...
DB_CONNECT_STRING=...


---

## Run project

```bash
cd backend
npm install
node server.js
Then open:
http://localhost:7000/index.html
Author Tarak Darza
---
