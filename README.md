# SWYNEX – AI-Powered Expense Splitter

SWYNEX is a smart expense-sharing application designed to simplify group expense management. Users can create groups, add members, record shared expenses, split costs equally, and track individual balances.

## Features

- **User Registration:** Register users with input validation and secure password hashing.
- **Group Management:** Create and manage expense-sharing groups.
- **Member Management:** Add users to existing groups.
- **Expense Tracking:** Record expenses with titles, amounts, and payer details.
- **Expense Splitting:** Split expenses among group members.
- **Balance Calculation:** Automatically calculate how much each member owes or is owed.
- **Expense History:** View recorded expenses within a group.

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS

### Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic

### Database
- SQLite

### Development Tools
- Visual Studio Code
- Git and GitHub
- GitHub Codespaces

## Project Structure

```text
SWYNEX-Expense-Splitter/
│
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/indhugopalakannan796-debug/SWYNEX-Expense-Splitter-.git
cd SWYNEX-Expense-Splitter-
```

### 2. Start the Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend API: `http://127.0.0.1:8000`

API Documentation: `http://127.0.0.1:8000/docs`

### 3. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`

## API Modules

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/users/register` | Register a user |
| GET | `/api/users` | Retrieve users |
| POST | `/api/groups` | Create a group |
| GET | `/api/groups` | Retrieve groups |
| POST | `/api/groups/{group_id}/members` | Add a group member |
| GET | `/api/groups/{group_id}/members` | Retrieve group members |
| POST | `/api/groups/{group_id}/expenses` | Add an expense |
| GET | `/api/groups/{group_id}/expenses` | View expense history |
| GET | `/api/groups/{group_id}/balances` | View member balances |

## Current Project Status

The user registration, group management, member management, expense recording, expense splitting, and balance calculation workflows have been implemented and tested.

## Future Enhancements

- AI-powered receipt scanning and data extraction.
- Intelligent debt settlement optimization.
- PayPal Sandbox payment integration.

## Author

Developed as a software development project using React, FastAPI, Python, and SQLite.

## Repository

[SWYNEX – GitHub](https://github.com/indhugopalakannan796-debug/SWYNEX-Expense-Splitter-)
