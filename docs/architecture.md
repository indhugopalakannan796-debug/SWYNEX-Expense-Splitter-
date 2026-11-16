# SWYNEX – AI-Powered Receipt-Based Expense Splitting Application

## 1. Project Overview

SWYNEX is an AI-powered expense-splitting web application designed to help friends, roommates, families, and groups manage shared expenses efficiently.

The application simplifies expense management by allowing users to upload shopping or restaurant receipts, automatically extract purchased items, and assign individual items to group members through an AI-assisted chat interface.

Based on these assignments, the system calculates individual contributions and generates an optimized settlement plan to minimize the number of transactions required between group members.

The application also provides PayPal Sandbox integration to demonstrate secure digital payment settlement.

## 2. Problem Statement

Splitting shared expenses manually is often time-consuming and confusing, especially when multiple people purchase different items or share expenses unevenly.

Traditional expense-splitting applications generally require users to enter expense details manually and calculate individual contributions themselves.

This process can lead to calculation errors, misunderstandings, and difficulties in tracking outstanding payments.

SWYNEX aims to address these problems through automated receipt processing, AI-assisted item assignment, accurate expense calculations, and optimized payment settlement.

## 3. Proposed Solution

SWYNEX provides an intelligent and user-friendly platform for managing shared expenses.

The proposed application includes the following features:

- Receipt image upload and automatic item extraction.
- AI-assisted receipt understanding using vision-based processing.
- Chat-based item assignment to individual group members.
- Automatic calculation of individual expense shares.
- Debt optimization to minimize settlement transactions.
- PayPal Sandbox payment integration.
- Group expense history and balance tracking.
- User and group management.

The system combines AI-assisted processing with a structured expense management backend to provide a convenient expense-sharing experience.

## 4. Technology Stack

The application follows a modern full-stack architecture using the following technologies.

### 4.1 Frontend

| Technology | Purpose |
|---|---|
| React.js | Component-based user interface |
| Vite | Frontend development and build tool |
| Tailwind CSS | Responsive UI styling |

### 4.2 Backend

| Technology | Purpose |
|---|---|
| Python | Backend programming language |
| FastAPI | REST API development |
| Pydantic | Request validation and data schemas |
| SQLAlchemy | Database ORM and query management |

### 4.3 Database

| Technology | Purpose |
|---|---|
| SQLite | Relational data storage |

### 4.4 AI Processing

| Technology / Approach | Purpose |
|---|---|
| Vision-based receipt extraction | Extract item names, quantities, and prices from receipt images |
| Large Language Model (LLM) | Interpret natural-language item assignment instructions |
| AI-assisted processing | Convert user instructions into structured item assignments |

### 4.5 Payment Integration

| Technology | Purpose |
|---|---|
| PayPal Sandbox | Simulated payment processing |
| PayPal REST APIs | Payment creation and capture |
| PayPal Webhooks | Payment event notifications |

### 4.6 Development Tools

- Git and GitHub – Version control and source code management.
- Postman – REST API testing.
- ngrok – Exposing local services for webhook testing.
- pytest – Backend testing.
- Visual Studio Code – Development environment.

## 5. Main Application Modules

The system is organized into the following functional modules.

### 5.1 User Management

Handles user registration, login, authentication, and profile information.

### 5.2 Group Management

Allows users to create expense-sharing groups, add members, and manage group information.

### 5.3 Receipt Processing

Accepts receipt images, validates uploaded files, and extracts item details using vision-based processing.

### 5.4 AI-Based Item Assignment

Interprets natural-language instructions through an AI-assisted chat interface and maps receipt items to group members.

### 5.5 Expense Splitting Engine

Calculates individual expense shares based on assigned items and their prices.

### 5.6 Debt Optimization Engine

Calculates outstanding balances and generates an optimized settlement plan to reduce the number of payment transactions.

### 5.7 Payment Settlement

Integrates PayPal Sandbox to demonstrate payment creation, capture, and transaction status verification.

### 5.8 Transaction History

Maintains records of group expenses, individual contributions, and payment transactions.

## 6. System Architecture

SWYNEX follows a modular client-server architecture consisting of frontend, backend, database, AI processing, and payment integration layers.

### 6.1 Architecture Components

**1. Presentation Layer**

- Built using React.js, Vite, and Tailwind CSS.
- Provides dashboards, group management, receipt upload, and expense summary screens.
- Communicates with the backend through REST APIs.

**2. Backend Application Layer**

- Developed using Python and FastAPI.
- Handles authentication, group management, expense calculations, and business logic.
- Validates incoming requests using Pydantic.

**3. Database Layer**

- Uses SQLite for persistent data storage.
- SQLAlchemy manages database models and queries.
- Stores users, groups, expenses, receipts, item assignments, and payments.

**4. AI Processing Layer**

- Processes receipt images to extract item information.
- Interprets chat-based assignment instructions.
- Converts AI outputs into structured data for validation by the backend.

**5. Payment Integration Layer**

- Communicates with PayPal Sandbox APIs.
- Creates and captures payment transactions.
- Receives payment notifications through webhooks.

### 6.2 Overall Architecture Flow

React Frontend  
↓  
FastAPI Backend  
↓  
Business Logic and Validation  
↓  
SQLite Database

The backend also communicates with:

- AI Processing Services for receipt extraction and item assignment.
- PayPal Sandbox APIs for payment settlement.

## 7. Database Design

The application uses SQLite as its relational database. SQLAlchemy is used as the Object Relational Mapping (ORM) layer.

The following tables define the proposed database structure.

### 7.1 User Table

Stores registered user information.

| Field | Data Type | Description |
|---|---|---|
| user_id | Integer (PK) | Unique user ID |
| name | String | User name |
| email | String (Unique) | User email |
| password_hash | String | Securely hashed password |
| created_at | DateTime | Registration date |

### 7.2 Group Table

Stores expense-sharing group information.

| Field | Data Type | Description |
|---|---|---|
| group_id | Integer (PK) | Unique group ID |
| group_name | String | Group name |
| created_by | Integer (FK) | User who created the group |
| created_at | DateTime | Group creation date |

### 7.3 Group Member Table

Stores the relationship between users and groups.

| Field | Data Type | Description |
|---|---|---|
| membership_id | Integer (PK) | Unique membership ID |
| group_id | Integer (FK) | Associated group |
| user_id | Integer (FK) | Group member ID |
| joined_at | DateTime | Membership date |

A user can belong to multiple groups, and each group can contain multiple users.

### 7.4 Expense Table

Stores shared expense information.

| Field | Data Type | Description |
|---|---|---|
| expense_id | Integer (PK) | Unique expense ID |
| group_id | Integer (FK) | Associated group |
| paid_by | Integer (FK) | User who paid |
| description | String | Expense description |
| total_amount | Float | Total expense amount |
| created_at | DateTime | Expense creation date |

### 7.5 Receipt Table

Stores uploaded receipt information.

| Field | Data Type | Description |
|---|---|---|
| receipt_id | Integer (PK) | Unique receipt ID |
| expense_id | Integer (FK) | Associated expense |
| image_path | String | Uploaded receipt image location |
| extracted_text | Text | Extracted receipt information |
| uploaded_at | DateTime | Upload date |

### 7.6 Receipt Item Table

Stores individual items extracted from receipts.

| Field | Data Type | Description |
|---|---|---|
| item_id | Integer (PK) | Unique item ID |
| receipt_id | Integer (FK) | Associated receipt |
| item_name | String | Extracted item name |
| quantity | Integer | Item quantity |
| price | Float | Item price |

### 7.7 Item Assignment Table

Stores the assignment of receipt items to individual group members.

| Field | Data Type | Description |
|---|---|---|
| assignment_id | Integer (PK) | Unique assignment ID |
| item_id | Integer (FK) | Associated receipt item |
| user_id | Integer (FK) | Assigned group member |
| assigned_amount | Float | Member's assigned share |

### 7.8 Expense Split Table

Stores the calculated contribution of each member.

| Field | Data Type | Description |
|---|---|---|
| split_id | Integer (PK) | Unique split ID |
| expense_id | Integer (FK) | Associated expense |
| user_id | Integer (FK) | Group member ID |
| amount | Float | Member's expense share |

### 7.9 Payment Table

Stores payment transaction information.

| Field | Data Type | Description |
|---|---|---|
| payment_id | Integer (PK) | Unique payment ID |
| payer_id | Integer (FK) | Payment sender |
| receiver_id | Integer (FK) | Payment receiver |
| amount | Float | Payment amount |
| payment_status | String | Pending, completed, or failed |
| paypal_transaction_id | String | PayPal transaction reference |
| created_at | DateTime | Payment creation date |

## 8. API Design

The backend uses RESTful APIs developed using FastAPI to enable communication between the frontend and backend.

### 8.1 User Management APIs

| HTTP Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/users/register | Register a new user |
| POST | /api/users/login | Authenticate a user |
| GET | /api/users | Retrieve registered users |

### 8.2 Group Management APIs

| HTTP Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/groups | Create a new group |
| GET | /api/groups | Retrieve user groups |
| GET | /api/groups/{group_id} | Retrieve group details |
| POST | /api/groups/{group_id}/members | Add a member to a group |
| GET | /api/groups/{group_id}/members | Retrieve group members |

### 8.3 Receipt Processing APIs

| HTTP Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/receipts/upload | Upload a receipt image |
| POST | /api/receipts/scan | Extract receipt items |
| GET | /api/receipts/{receipt_id} | Retrieve receipt details |
| GET | /api/receipts/{receipt_id}/items | Retrieve extracted items |

### 8.4 Expense Management APIs

| HTTP Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/expenses/assign | Assign receipt items to members |
| POST | /api/expenses/split | Calculate individual expense shares |
| GET | /api/expenses/{expense_id} | Retrieve expense details |
| GET | /api/groups/{group_id}/balances | View group balances |
| GET | /api/groups/{group_id}/expenses | Retrieve group expense history |

### 8.5 Payment APIs

| HTTP Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/payments/create | Create a PayPal payment |
| POST | /api/payments/capture | Capture an approved payment |
| GET | /api/payments/{payment_id} | Retrieve payment status |
| POST | /api/payments/webhook | Receive PayPal webhook events |

## 9. Frontend Screen Design

The React frontend is designed to provide a simple and responsive user experience.

### 9.1 Login and Registration Screen

- User registration using name, email, and password.
- Existing user login.
- Input validation and authentication feedback.

### 9.2 Dashboard Screen

- Overview of total expenses.
- Amount owed by the user.
- Amount to be received.
- Recent transactions.
- Quick access to groups.

### 9.3 Group Management Screen

- Create new expense-sharing groups.
- Add group members.
- View group details.
- Display group expense history.

### 9.4 Receipt Upload Screen

- Upload receipt images.
- Preview uploaded receipts.
- Extract item names, quantities, and prices.
- Review extracted receipt information.

### 9.5 AI-Based Item Assignment Screen

- Display extracted receipt items.
- Provide a chat-based assignment interface.
- Interpret natural-language assignment instructions.
- Assign items to individual group members.
- Review and confirm item assignments.

### 9.6 Expense Summary Screen

- Display individual member contributions.
- Show total group expenses.
- Calculate outstanding balances.
- Display optimized debt settlement suggestions.

### 9.7 Payment Screen

- Display outstanding payment balances.
- Initiate PayPal Sandbox payments.
- Show payment progress and transaction status.
- Display completed and pending payments.

### 9.8 Transaction History Screen

- Display previous group expenses.
- View individual payment records.
- Track completed and pending settlements.

## 10. Application Workflow

The proposed application follows the workflow below.

1. A user registers and logs into the application.
2. The user creates an expense-sharing group.
3. Group members are added to the group.
4. A user uploads a shopping or restaurant receipt.
5. The AI processing layer extracts purchased items, quantities, and prices.
6. Users assign receipt items to group members through the chat interface.
7. The backend validates the assignments and calculates individual expense shares.
8. The debt optimization engine calculates balances and generates an optimized settlement plan.
9. Users initiate payment settlement through PayPal Sandbox.
10. Payment status is verified and transaction history is updated.

## 11. Security Considerations

The application considers the following security practices:

- Passwords are stored using secure password hashing rather than plain-text storage.
- Authentication is required for protected API endpoints.
- Group and expense data access is restricted to authorized members.
- Uploaded receipt files are validated for supported formats and file size.
- API inputs are validated before processing.
- PayPal credentials and sensitive configuration values are stored in environment variables.
- Payment status is verified through server-side PayPal API communication.
- PayPal webhook events are validated before updating transaction records.
- Database operations are handled through SQLAlchemy to support structured data access.

## 12. Expected Outcome

The proposed SWYNEX application aims to simplify shared expense management by combining receipt-based item extraction, AI-assisted assignment, automated expense calculations, and digital payment settlement.

The expected benefits include:

- Reduced manual effort in entering expense details.
- Improved accuracy in individual expense calculations.
- Simplified item assignment among group members.
- Reduced complexity in settling shared expenses.
- Better visibility into group balances and transaction history.
- A convenient and user-friendly expense management experience.

## 13. Future Enhancements

The application can be extended with the following features:

- Multi-currency expense support.
- Advanced receipt recognition and improved OCR accuracy.
- Group expense analytics and spending reports.
- Mobile application support.
- Notifications for pending payments.
- Recurring expense management.
- Additional payment gateway integrations.
- Advanced financial insights and personalized spending summaries.

## 14. Conclusion

SWYNEX proposes an intelligent approach to shared expense management by integrating modern web technologies, AI-assisted receipt processing, automated expense splitting, and digital payment settlement.

Its modular architecture separates frontend presentation, backend business logic, database management, AI processing, and payment integration.

This architecture provides a structured foundation for developing a scalable, maintainable, and user-friendly expense-sharing application.
