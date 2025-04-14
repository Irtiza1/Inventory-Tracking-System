# Inventory Tracking System

## Overview

Our **Inventory Tracking System** for Bazaar Technologies starts as a simple, single‑store solution (v1) and evolves into a fully distributed, real‑time, audited multi‑store platform (v3). This journey mirrors Bazaar’s real‑world challenges—ensuring real‑time stock visibility to prevent stockouts and overstocking while scaling to support thousands of stores securely and reliably.

**Tech Stack**:  
- Node.js/Express  
- Sequelize ORM  
- PostgreSQL  

As the platform evolves, we incorporate:
- Containerization with PM2
- Event‑driven architecture (RabbitMQ)
- Redis caching
- Read/Write DB separation
- Comprehensive audit logging

---

## 1. Design Decisions

### Version 1: Single‑Store Model

#### 🧩 Challenge
Track inventory (stock‑in, sales, and manual removals) for a single kiryana store quickly.

#### 💡 Approach
- Built MVP using **Node.js/Express** (MVC pattern)
- Used **SQLite** for local storage
- Basic **CRUD operations**

#### 🔑 Key Decisions
- **MVC Architecture** for separation of concerns  
- **Local SQLite** storage for quick validation  
- **Basic Authentication** for endpoint protection

#### 🚀 Why It Matters
- Simple, fast, and effective foundation for future scaling
- Easy to test and iterate

---

### Version 2: Multi‑Store, Multi‑Supplier Model

#### 🧩 Challenge
Support 500+ stores, a central product catalog, store-specific stock, and multiple suppliers.

#### 💡 Approach
- Migrated to **PostgreSQL**
- Expanded API with stores, suppliers, and reports
- Improved authentication and added rate limiting

#### 🔑 Key Decisions
- **PostgreSQL & Sequelize** for relational scalability  
- **RESTful Endpoints** for centralized and distributed control  
- **Role-Based Access Control**  
- **Advanced Reporting & Filtering**

#### 🚀 Why It Matters
- Scalable and modular
- Ensures data integrity and secure access

---

### Version 3: Large‑Scale, Real‑Time Audited System

#### 🧩 Challenge
Real-time synchronization, high-volume support, and audit compliance across thousands of stores.

#### 💡 Approach
- Containerized with **PM2**
- Introduced **Load Balancing**
- **Event-Driven Architecture** with RabbitMQ
- **Redis Caching** and DB replication (read/write separation)
- **Sequelize Hooks** for audit logs

#### 🔑 Key Decisions
- **WebSockets** for real-time stock sync  
- **Asynchronous Queuing** for decoupled processing  
- **Caching** for performance optimization  
- **Comprehensive Audit Logging**  

#### 🚀 Why It Matters
- High performance, reliability, and traceability
- Designed for compliance and future growth

---

## 2. Assumptions

### 🔹 Business
- Starts with one store, scales to 1000+
- Central product catalog, store-specific inventory
- Users: Admins, Store Managers, Analytics, Suppliers

### 🔹 Technical
- v1 uses local SQLite, v2+ uses PostgreSQL
- Event-driven, containerized, and scalable
- Focus on high throughput and real-time accuracy

### 🔹 Operational
- PM2 for instance management  
- Load balancer for traffic distribution  
- Rate limiting and Redis caching enabled  

---

## 3. API Design

### 📘 Version 1: Single-Store API

| Endpoint                         | Method | Description                                        |
|----------------------------------|--------|----------------------------------------------------|
| `/products/`                     | GET    | Retrieve all products                              |
| `/products/`                     | POST   | Create a new product (admin only)                  |
| `/products/:productCode`        | GET    | Get product details                                |
| `/products/:productCode/stock`  | GET    | Get current stock level                            |
| `/products/:productCode/:op`    | PATCH  | Update stock (stock-in, sale, manual-remove)       |
| `/movements`                    | GET    | Get all stock movements                            |
| `/movements/:productCode`      | POST   | Record a stock movement                            |

---

### 📘 Version 2: Multi-Store API

#### 🔹 Product Routes (`/products`)
| Endpoint                                | Method | Description                            |
|-----------------------------------------|--------|----------------------------------------|
| `/products/`                            | POST   | Create a new product                   |
| `/products/`                            | GET    | Retrieve all products                  |
| `/products/:product_code`              | GET    | Get product by code                    |
| `/products/:product_code`              | PUT    | Update product                         |
| `/products/:product_code`              | DELETE | Delete product                         |
| `/products/:supplier_id`               | GET    | Get products by supplier               |
| `/products/allproductsupplier`         | GET    | View product-supplier mapping list     |

#### 🔹 Stock Movement Routes (`/stock`)
| Endpoint                          | Method | Description                      |
|-----------------------------------|--------|----------------------------------|
| `/stock/`                         | POST   | Record stock movement            |
| `/stock/`                         | GET    | Get all stock movements          |
| `/stock/:product_code`           | GET    | Get movements by product code    |
| `/stock/:store_id`               | GET    | Get movements by store ID        |
| `/stock/:product_code`           | DELETE | Delete movement by product code  |

#### 🔹 Store Routes (`/stores`)
| Endpoint                        | Method | Description                     |
|---------------------------------|--------|---------------------------------|
| `/stores/`                      | POST   | Create new store                |
| `/stores/`                      | GET    | Get all stores                  |
| `/stores/:idOrName`            | GET    | Get store by ID or name         |
| `/stores/:idOrName`            | PUT    | Update store                    |
| `/stores/:idOrName`            | DELETE | Delete store                    |

#### 🔹 Store Stock Routes (`/store-stock`)
| Endpoint                                 | Method | Description                               |
|------------------------------------------|--------|-------------------------------------------|
| `/store-stock/`                          | GET    | Get all stock entries                     |
| `/store-stock/:storeId/:product_code`    | GET    | Get product stock in a store              |
| `/store-stock/:storeId/:product_code`    | PUT    | Update product stock in a store           |
| `/store-stock/`                          | POST   | Create new stock entry / adjustment       |
| `/store-stock/:storeId/:product_code`    | DELETE | Delete store stock by ID & product code   |

#### 🔹 Supplier Routes (`/suppliers`)
| Endpoint              | Method | Description         |
|-----------------------|--------|---------------------|
| `/suppliers/`         | POST   | Create supplier     |
| `/suppliers/`         | GET    | Get all suppliers   |
| `/suppliers/:id`      | GET    | Get supplier by ID  |
| `/suppliers/:id`      | PUT    | Update supplier     |
| `/suppliers/:id`      | DELETE | Delete supplier     |

#### 🔹 User Routes (`/users`)
| Endpoint              | Method | Description         |
|-----------------------|--------|---------------------|
| `/users/`             | POST   | Create user         |
| `/users/`             | GET    | Get all users       |
| `/users/:id`          | GET    | Get user by ID      |
| `/users/:name`        | GET    | Get user by name    |
| `/users/:id`          | PUT    | Update user         |
| `/users/:id`          | DELETE | Delete user         |

#### 🔹 Report Routes (`/report`)
| Endpoint                            | Method | Description                      |
|-------------------------------------|--------|----------------------------------|
| `/report/inventory/:storeId`       | GET    | Store-wise inventory report      |
| `/report/sales/:storeId`           | GET    | Store-wise sales report          |

---

### 📘 Version 3: Real-Time, Large-Scale API

- **WebSocket Channels**: For pushing real-time stock updates.
- **Event Queue Endpoints**: For async stock updates (via RabbitMQ).
- **Audit Endpoints**: Admin-level logs of actions and updates.
- **Caching**: Integrated via Redis.

---

## 4. Security & Authorization

### 🔐 Authentication
- **JWT** or **Basic Auth** for protected routes

### 🔐 Role-Based Access
| Role         | Permissions                                     |
|--------------|-------------------------------------------------|
| Admin        | Full CRUD, reporting, audit access              |
| Store Manager| Limited to their store operations               |
| Analytics    | Read-only access to reports                     |
| Supplier     | Access only to their supplied product data      |

---

## 5. Evolution Rationale (v1 → v3)

### ✅ v1: Single‑Store
- Validated inventory logic
- Minimal system, fast dev cycle

### ✅ v2: Multi‑Store
- Added suppliers, store management
- Improved auth, reporting, PostgreSQL switch

### ✅ v3: Real-Time, Scalable
- Supports 1000s of stores
- Horizontal scaling via PM2 + Load Balancing
- Async events + Redis + Sequelize audit logs

---

## 📌 Future Enhancements
- Docker + Kubernetes support
- CI/CD integration
- Advanced analytics dashboards
- ML for demand prediction

---

## 🧠 Built With
- **Node.js / Express.js**
- **PostgreSQL / Sequelize**
- **RabbitMQ**
- **Redis**
- **PM2**
- **JWT Authentication**

---

## 🛡️ License
MIT License

---

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📫 Contact
**Bazaar Technologies Inventory Team**  
Email: [youremail@bazaar.com](mailto:youremail@bazaar.com)

---
