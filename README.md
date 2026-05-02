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
# Pricing App Pro

Full-stack pricing application built with **Node.js, Express, Oracle DB** and a modern frontend UI.

---

## Features

- Full CRUD Product Management (Create, Read, Update, Delete)
- Price calculation (promotion + tax + quantity)
- REST API (Express.js)
- Oracle Database integration
- Structured logging (Winston - Datadog ready)
- Frontend UI (HTML, CSS, JavaScript)

---

##Architecture


Frontend → API (Express) → Controllers → Oracle DB


---

## Backend

- Node.js + Express
- Modular architecture:
  - `routes/`
  - `controllers/`
  - `db.js`
  - `logger.js`

---

## Frontend

- Vanilla JavaScript
- Fetch API
- Modern responsive UI
- Features:
  - Add / Update / Delete product
  - Calculate price
  - Display results dynamically

---

## API Endpoints

### Products

- `GET /products` → Get all products  
- `GET /products/:id` → Get product by ID  
- `POST /products` → Create product  
- `PUT /products/:id` → Update product  
- `DELETE /products/:id` → Delete product  

### Price Calculation

- `POST /calculate-price`

---

## Example Calculation


Base Price: 200
Promotion: 10%
Tax: 20%
Quantity: 2

Final Price = 432


---

## Environment Variables

Create a `.env` file in `/backend`:

```env
PORT=7000
DB_USER=your_user
DB_PASSWORD=your_password
DB_CONNECT_STRING=your_connection_string
LOG_FILE=C:/logs/app.log
NODE_ENV=development

 
 Run the Project

cd backend
npm install
npm start

Then open in browser:

http://localhost:7000

Author : Tarak Darza
---
