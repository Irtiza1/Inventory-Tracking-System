# Inventory Tracking System

## Overview
A scalable inventory tracking system for Bazaar Technologies that evolves from a simple single-store model (v1) to a fully distributed, real-time, audited multi-store platform (v3).

## Design Decisions
- **Architecture:** Adopted MVC with Node.js/Express and Sequelize ORM.
- **Database:** PostgreSQL for robust data management.
- **Scalability:** Dockerized deployment, load balancing, read/write DB separation, and caching (Redis).
- **Event-driven Processing:** RabbitMQ for asynchronous stock updates.
- **Security:** JWT/Basic Auth for role-based access control.
- **Audit Logging:** Automatic logging via Sequelize hooks into an AuditLog table.

## Assumptions
- The system starts with a single-store inventory tracker and must scale to support 500+ stores.
- A central product catalog is shared, but each store maintains its own stock.
- The system must support high transaction volumes and provide real-time stock visibility.
- Users have distinct roles: admin, store manager, analytics, and supplier.
- The solution will be containerized and deployed in a cloud environment.

## API Design
### Core Endpoints
| Endpoint                            | Method | Description                                           |
|-------------------------------------|--------|-------------------------------------------------------|
| `/api/products`                     | GET    | Retrieve all products from the central catalog.     |
| `/api/products/:product_code`       | GET    | Get details for a product by product code.          |
| `/api/products`                     | POST   | Create a new product (admin only).                  |
| `/api/stores/:storeId/stock`          | GET    | Retrieve inventory for a specific store.            |
| `/api/stores/:storeId/stock`          | POST   | Add or update stock for a store.                    |
| `/api/stock-movements`               | POST   | Record a stock movement (stock-in, sale, removal).    |
| `/api/reports/sales`                | GET    | Generate sales reports by store and date range.     |

### Authentication & Authorization
- Endpoints are secured via JWT.
- **Roles:**  
  - **Admin:** Full access.  
  - **Store Manager:** Access limited to their own store.  
  - **Analytics:** Read-only access to reports.  
  - **Supplier:** Limited access relevant to supplied products.

## Evolution Rationale (v1 → v3)
### Version 1 (v1): Single-Store Model
- **Scope:** Basic product and stock tracking using local storage.
- **Limitations:** Minimal authentication and no multi-store support.
- **Goal:** Validate core inventory functionalities.

### Version 2 (v2): Multi-Store, Multi-Supplier Model
- **Enhancements:** Migrate to PostgreSQL, add REST APIs for multi-store operations, filtering, and basic authentication.
- **Goal:** Scale to support 500+ stores with a central product catalog and store-specific stock.

### Version 3 (v3): Large-Scale, Audited, Real-Time System
- **Enhancements:**  
  - **Horizontal Scalability:** Dockerized deployment, load balancing.
  - **Event-Driven Architecture:** RabbitMQ/Kafka for asynchronous stock updates.
  - **Caching:** Redis to reduce DB load and speed up reads.
  - **Read/Write Separation:** Primary and replica DBs for optimized performance.
  - **Audit Logs:** Automated audit logging via Sequelize hooks.
  - **Real-Time Stock Sync:** Immediate stock updates across stores.
- **Goal:** Build a robust system that supports thousands of stores, high concurrency, and full auditability.

## How to Run
[Instructions for installing dependencies, running migrations, starting the server, etc.]

## Future Enhancements
- Expanded analytics and reporting features.
- More granular role-based access.
- Additional performance optimizations and monitoring.
