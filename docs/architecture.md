
# AI-Powered Receipt-Based Expense Splitting Application

## 1. Project Overview

This project is an AI-powered expense splitting web application that helps friends, roommates, and groups divide shared expenses accurately.

Users can upload a receipt, extract purchased items, assign items to individual members through a chat-based interface, calculate individual expenses, and generate an optimized settlement plan.

The application also supports payment settlement through PayPal Sandbox.

## 2. Problem Statement

Splitting shared expenses manually is time-consuming and confusing.

Traditional expense-splitting applications often require users to enter expenses manually and calculate individual contributions.

Our application aims to simplify this process through AI-assisted receipt processing and automated expense calculations.

## 3. Proposed Solution

The application provides the following features:

- Receipt image upload and item extraction.
- AI-assisted receipt understanding.
- Chat-based item assignment to group members.
- Accurate individual expense calculation.
- Automatic debt optimization.
- PayPal Sandbox payment settlement.
- Group expense history and balance tracking.

## 4. Technology Stack

### Frontend
- React.js
- Vite
- Tailwind CSS

### Backend
- Python
- FastAPI

### Database
- SQLite

### AI Processing
- Vision-based receipt extraction
- LLM-assisted item assignment interpretation

### Payment Integration
- PayPal Sandbox
- PayPal Webhooks

### Development Tools
- GitHub
- Postman
- ngrok
- pytest

## 5. Main Application Modules

1. User Management
2. Group Management
3. Receipt Processing
4. AI-Based Item Assignment
5. Expense Splitting Engine
6. Debt Optimization Engine
7. Payment Settlement
8. Transaction History

## 6. Expected Outcome

The application will reduce manual effort in shared expense management, improve calculation accuracy, and provide a simple way for users to settle group expenses.

## 7. Database Design

The application uses SQLite as its relational database.

### 7.1 User Table

Stores registered user information.

| Field | Data Type | Description |
|---|---|---|
| user_id | Integer (PK) | Unique user ID |
| name | String | User name |
| email | String (Unique) | User email |
| password_hash | String | Encrypted password hash |
| created_at | DateTime | Registration date |

### 7.2 Group Table

Stores expense-sharing groups.

| Field | Data Type | Description |
|---|---|---|
| group_id | Integer (PK) | Unique group ID |
| group_name | String | Group name |
| created_by | Integer (FK) | Group creator |
| created_at | DateTime | Creation date |

### 7.3 Expense Table

Stores shared expenses.

| Field | Data Type | Description |
|---|---|---|
| expense_id | Integer (PK) | Unique expense ID |
| group_id | Integer (FK) | Associated group |
| description | String | Expense description |
| total_amount | Float | Total expense |
| created_at | DateTime | Expense date |

### 7.4 Receipt Table

Stores uploaded receipt details.

| Field | Data Type | Description |
|---|---|---|
| receipt_id | Integer (PK) | Unique receipt ID |
| expense_id | Integer (FK) | Associated expense |
| image_path | String | Receipt image location |
| extracted_text | Text | Extracted receipt information |

### 7.5 Expense Split Table

Stores individual member contributions.

| Field | Data Type | Description |
|---|---|---|
| split_id | Integer (PK) | Unique split ID |
| expense_id | Integer (FK) | Associated expense |
| user_id | Integer (FK) | Member ID |
| amount | Float | Member's share |

### 7.6 Payment Table

Stores payment transactions.

| Field | Data Type | Description |
|---|---|---|
| payment_id | Integer (PK) | Unique payment ID |
| payer_id | Integer (FK) | Sender |
| receiver_id | Integer (FK) | Receiver |
| amount | Float | Payment amount |
| payment_status | String | Pending, completed or failed |
| paypal_transaction_id | String | PayPal reference |

## 8. API Design

The backend uses REST APIs developed using FastAPI.

| HTTP Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/users/register | Register a user |
| POST | /api/users/login | User login |
| POST | /api/groups | Create a group |
| GET | /api/groups | List user groups |
| POST | /api/receipts/upload | Upload receipt |
| POST | /api/receipts/scan | Extract receipt items |
| POST | /api/expenses/assign | Assign items to members |
| POST | /api/expenses/split | Calculate expense shares |
| GET | /api/groups/{group_id}/balances | View group balances |
| POST | /api/payments/create | Create PayPal payment |
| GET | /api/payments/{payment_id} | Check payment status |

## 9. Frontend Screen Design

The React frontend contains the following screens.

### 9.1 Login and Registration
- User registration
- Email and password login
- Form validation

### 9.2 Dashboard
- Total expenses
- Amount owed
- Amount to receive
- Recent transactions

### 9.3 Group Management
- Create a group
- Add group members
- View group expenses

### 9.4 Receipt Upload
- Upload receipt images
- Preview uploaded receipt
- Extract item names and prices

### 9.5 AI-Based Item Assignment
- Display extracted receipt items
- Chat-based item assignment
- Assign items to group members
- Review and confirm assignments

### 9.6 Expense Summary
- Individual member shares
- Total group expense
- Optimized debt settlement

### 9.7 Payment Screen
- View outstanding balances
- Initiate PayPal Sandbox payment
- Display payment status

## 10. Application Workflow

1. User registers and logs in.
2. User creates a group and adds members.
3. User uploads a receipt.
4. AI processes the receipt and extracts items.
5. Users assign items to group members through the chat interface.
6. Expense engine calculates individual shares.
7. Debt optimization engine minimizes the number of settlements.
8. Users settle payments using PayPal Sandbox.
9. Transaction history is updated.

## 11. Security Considerations

- Passwords are stored using secure password hashing.
- Authentication is required for protected APIs.
- Uploaded files are validated.
- API inputs are validated before processing.
- PayPal credentials are stored in environment variables.
- Payment status is verified using PayPal server-side verification.

## 12. Future Enhancements

- Multi-currency expense support.
- Group expense analytics.
- Mobile application support.
- Advanced AI-based receipt recognition.
- Notifications for pending payments.

