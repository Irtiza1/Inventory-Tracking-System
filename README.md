# Inventory Tracking System

## Overview

Our Inventory Tracking System for Bazaar Technologies starts as a simple, single‑store solution (v1) and evolves into a fully distributed, real‑time, audited multi‑store platform (v3). This journey mirrors Bazaar’s real‑world challenges—ensuring real‑time stock visibility to prevent stockouts and overstocking while scaling to support thousands of stores securely and reliably. Our solution is built using Node.js/Express, Sequelize ORM, and PostgreSQL. As we evolve, we incorporate containerization, event‑driven processing, caching, and robust audit logging to handle high transaction volumes and complex inventory scenarios.

---

## 1. Design Decisions

### The Story Behind Our Choices

#### Version 1 : Single‑Store Model

- **Challenge/Requirement:**  
Bazaar needed a way to track inventory (stock‑in, sales, and manual removals) for a single kiryana store quickly.

- **Our Approach:**  
We built a minimal viable product (MVP) using Node.js/Express with a simple MVC pattern. We used a local storage solution (SQLite) and basic CRUD operations.

- **Key Decisions:**
  - MVC Architecture: Ensures separation of concerns and ease of testing.
  - Local Storage (SQLite): Allows quick validation of core functionality.
  - Basic Authentication: Simple mechanism to secure endpoints even in the MVP.

- **Why It Matters:**
  - Starting small lets us validate our core business logic without over‑engineering. This forms the solid foundation needed to scale later.
  - Simplicity: With only one store, our data model and API design remain straightforward, making it easy to test and iterate.

---

#### Version 2 : Multi‑Store, Multi‑Supplier Model

- **Challenge/Requirement:**  
As Bazaar expanded, the system needed to support 500+ stores, maintain a central product catalog, and track store‑specific inventory while managing multiple suppliers.

- **Our Approach:**  
We migrated from SQLite to PostgreSQL to handle relational data at scale. We expanded our API to include endpoints for managing stores, suppliers, and filtering reports by store and date range. This allows for a central product catalog while maintaining store‑specific stock. Basic authentication was improved and rate limiting introduced.

- **Key Decisions:**
  - PostgreSQL & Sequelize: Provide robust, scalable relational data management.
  - RESTful API Endpoints: Allow centralized product catalog access while enabling store‑specific operations.
  - Filtering & Reporting: Critical for analytics and inventory management.
  - Role‑Based Authentication: Differentiates access among admins, store managers, analytics, and suppliers.

- **Why This Matters:**
  - Scalability: Moving to PostgreSQL and expanding our schema enables support for 500+ stores.
  - Modularity & Security: Role‑based authentication ensures that different users (admin, store manager, analytics, supplier) have appropriate access.
  - Data Integrity: Using a robust relational database supports complex queries and transactions needed for multi‑store operations.

---

#### Version 3 : Large‑Scale, Audited, Real‑Time System

- **Challenge/Requirement:**  
To support thousands of stores with high transaction volumes, we needed a system that provides near‑real‑time stock updates, horizontal scalability, and comprehensive audit logging.

- **Our Approach:**  
We containerized the application using a process manager (PM2) and introduced a load balancer for horizontal scaling. An event‑driven architecture (using RabbitMQ) decouples heavy operations, while Redis caching and read/write database separation optimize performance. Comprehensive audit logging is achieved via Sequelize ORM hooks.

- **Key Decisions:**
  - PM2 & Load Balancing: Ensures the system scales horizontally and remains highly available by managing multiple Node.js processes and distributing traffic efficiently.
  - Event‑Driven Processing: We integrated RabbitMQ to handle asynchronous stock updates, decoupling heavy operations from synchronous API responses.
  - Redis Caching & Read/Write Separation: Redis is used to cache frequently accessed data, and the database is split into primary (for writes) and replicas (for reads) to optimize performance.
  - Audit Logging: Comprehensive audit logs are generated via Sequelize hooks to record every user action, ensuring full traceability.
  - Real‑Time Stock Sync: Using WebSockets to push updates instantly.

- **Why This Matters:**
  - Performance Under Load: As the system scales to thousands of stores, asynchronous processing and caching reduce latency and prevent bottlenecks.
  - Reliability & Compliance: Horizontal scaling and robust audit logging ensure the system remains reliable, secure, and compliant with regulatory standards.
  - Future‑Proofing: Read/write separation and event‑driven design allow the system to evolve further as transaction volumes grow.

## 🧠 Stage 3 Architecture — Design Decisions & Trade-offs

| **Component / Decision**            | **Why It Was Added**                                 | **Benefits**                                               | **Trade-offs**                                                                 |
|------------------------------------|------------------------------------------------------|------------------------------------------------------------|---------------------------------------------------------------------------------|
| **Load Balancer + Horizontal Scaling** | Handle high traffic and distribute load              | High availability, scalability, fault tolerance            | Infrastructure becomes more complex; load balancer adds cost                   |
| **Primary-Replica PostgreSQL**     | Separate reads from writes to optimize DB performance | Improved read performance, reduced write contention        | Need to manage replication lag and consistency                                 |
| **RabbitMQ/Kafka (Message Queue)** | Decouple services and enable asynchronous workflows  | Scalable event-driven system, fault tolerance              | Increases system complexity and eventual consistency delays                    |
| **Redis Cache**                    | Speed up repeated queries and reduce DB load         | Fast response times, reduced latency                       | Cache invalidation can be tricky; adds memory overhead                         |
| **Audit Logging Service**          | Track and store actions securely and independently   | Secure, centralized, and scalable logging                  | More microservices to maintain and monitor                                     |
| **WebSocket Server**               | Enable real-time updates to clients                  | Real-time UI/UX, live sync                                 | Adds stateful connections and deployment complexity                            |
| **Health & Monitoring**            | Detect system failures early and enable observability| Easier debugging, alerts, uptime assurance                 | Setup and tuning required; monitoring tools add overhead                       |


---

## 2. Assumptions

### Business, Technical, and Operational Assumptions

- **Business Assumptions:**
  - The system will start with a single-store model and later scale to 500+ stores, eventually reaching thousands.
  - A central product catalog is maintained, but each store manages its own inventory.
  - Users include admins (full access), store managers (limited to their store), analytics (read‑only), and suppliers (limited access to their supplied products).

- **Technical Assumptions:**
  - The MVP (v1) will validate core inventory functionalities with simple local storage.
  - Scaling requires migration to PostgreSQL, containerization, and asynchronous processing.
  - High transaction volumes and real‑time visibility are critical for operational efficiency.

- **Operational Assumptions:**
  - The system is managed locally using PM2 (Process Manager), enabling multiple instances for improved performance and reliability.
  - Load balancing is implemented to distribute incoming requests evenly across processes.
  - Rate limiting and caching are incorporated to optimize response times and protect the system from excessive load.

---

## 3. API Design

### Core Endpoints & Their Purpose

#### Version 1 (v1): Single-Store API

| Endpoint | Method | Description |
|---------|--------|-------------|
| /products/ | GET | Retrieve all products. |
| /products/ | POST | Create a new product (admin only). |
| /products/:productCode | GET | Retrieve product details by product code. |
| /products/:productCode/stock | GET | Retrieve the current stock level for a specific product. |
| /products/:productCode/:operation | PATCH | Update stock based on the operation (stock-in, manual-remove, or sale). |
| /movements | GET | Retrieve all stock movements. |
| /movements/:productCode | POST | Record a stock movement (e.g., stock-in, sale, removal) for a specific product. |

---

#### Version 2 (v2): Multi-Store API

##### 🔹 Product Routes (/products)

| Endpoint | Method | Description |
|----------|--------|-------------|
| /products/ | POST | Create a new product |
| /products/ | GET | Retrieve all products |
| /products/:product_code | GET | Get product by product code |
| /products/:product_code | PUT | Update product by product code |
| /products/:product_code | DELETE | Delete product by product code |
| /products/:supplier_id | GET | Get products by supplier ID |
| /products/allproductsupplier | GET | View product-supplier mapping list |

##### 🔹 Stock Movement Routes (/stock)

| Endpoint | Method | Description |
|----------|--------|-------------|
| /stock/ | POST | Record a stock movement |
| /stock/ | GET | Get all stock movements |
| /stock/:product_code | GET | Get stock movements by product code |
| /stock/:store_id | GET | Get stock movements by store ID |
| /stock/:product_code | DELETE | Delete stock movement by product code |

##### 🔹 Store Routes (/stores)

| Endpoint | Method | Description |
|----------|--------|-------------|
| /stores/ | POST | Create a new store |
| /stores/ | GET | Get all stores |
| /stores/:idOrName | GET | Get store by ID or Name |
| /stores/:idOrName | PUT | Update store by ID or Name |
| /stores/:idOrName | DELETE | Delete store by ID or Name |

##### 🔹 Store Stock Routes (/store-stock)

| Endpoint | Method | Description |
|----------|--------|-------------|
| /store-stock/ | GET | Get all stock from all stores |
| /store-stock/:storeId/:product_code | GET | Get stock of a specific product in a store |
| /store-stock/:storeId/:product_code | PUT | Update stock of a specific product in a store |
| /store-stock/ | POST | Create new stock entry |
| /store-stock/ | POST | Stock adjustment (shares route with create) |
| /store-stock/:storeId/:product_code | DELETE | Delete store stock by store ID and product code |

##### 🔹 Supplier Routes (/suppliers)

| Endpoint | Method | Description |
|----------|--------|-------------|
| /suppliers/ | POST | Create a new supplier |
| /suppliers/ | GET | Get all suppliers |
| /suppliers/:id | GET | Get supplier by ID |
| /suppliers/:id | PUT | Update supplier by ID |
| /suppliers/:id | DELETE | Delete supplier by ID |

##### 🔹 User Routes (/users)

| Endpoint | Method | Description |
|----------|--------|-------------|
| /users/ | POST | Create a new user |
| /users/ | GET | Get all users |
| /users/:id | GET | Get user by ID |
| /users/:name | GET | Get user by username |
| /users/:id | PUT | Update user by ID |
| /users/:id | DELETE | Delete user by ID |

##### 🔹 Report Routes (/report)

| Endpoint | Method | Description |
|----------|--------|-------------|
| /report/inventory/:storeId | GET | Get store-wise inventory report |
| /report/sales/:storeId | GET | Get store-wise sales report |

---

#### Version 3 : Large‑Scale, Real‑Time API

- **Real‑time Endpoints:**
  - WebSocket channels (or additional endpoints) for immediate stock updates.

- **Enhanced Endpoints:**
  - Endpoints integrate with event queues for asynchronous processing.
  - Caching mechanisms are used to reduce response times.
  - Audit log endpoints be provided for admin review.

### Security & Authorization

- **JWT/Basic Auth:**  
Endpoints are secured via JWT, ensuring that only authenticated users can access resources.

- **Role-Based Access:**
  - **Admin:** Full CRUD and reporting access.
  - **Store Manager:** Can only manage inventory for their store.
  - **Analytics:** Read‑only access to reporting endpoints.
  - **Supplier:** Limited to accessing data relevant to their supplied products.

---

## 4. Evolution Rationale (v1 → v3)

### The Evolution Story

#### Version 1 : Single‑Store Model

- **Requirement:**  
Build a basic inventory tracker for a single kiryana store to validate core functionalities.

- **Approach:**  
We used a simple MVC architecture with Node.js/Express and local storage (SQLite) to implement basic product and stock movement tracking.

- **Outcome:**  
The MVP demonstrates core CRUD operations and basic stock movement tracking. It lays the foundation for future scalability.

---

#### Version 2 : Multi‑Store, Multi‑Supplier Model

- **Requirement:**  
Expand the system to support 500+ stores with a central product catalog and store‑specific stock.

- **Approach:**
  - We migrated to PostgreSQL, which offers robust relational data management. 
  - We extended our RESTFul API to include endpoints for store and supplier management, introduced filtering (by store and date range), and implemented enhanced authentication.

- **Outcome:**  
The system now supports multiple stores, allowing each store to manage its own inventory while sharing a central product catalog. This version sets the stage for further scaling and complexity.

---

#### Version 3 : Large‑Scale, Audited, Real‑Time System

- **Requirement:**  
Evolve the solution to support thousands of stores, enable near‑real‑time stock synchronization, and incorporate audit logging.

- **Approach:**
  - We used PM2 (Process Manager) to run multiple instances of the application for improved scalability and reliability. Instead of Docker, horizontal   scalability was achieved through local load balancing.
  - We adopted an event-driven architecture (using RabbitMQ) to decouple heavy processing tasks, integrated Redis for caching, and configured read/write database separation.
  - Additionally, comprehensive audit logging was implemented via Sequelize hooks to ensure traceability and accountability of all database operations.

- **Outcome:**
The final system is robust, scalable, and capable of handling high concurrency while ensuring real‑time stock updates and full traceability of user actions. This evolution meets Bazaar Technologies’ requirements for performance, reliability, and auditability in a dynamic retail environment.
