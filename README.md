# SmartSpend — Personal Expense Tracker

SmartSpend is a full-stack personal expense tracking application built to manage expenses securely and visualize spending. It started as a Python command-line application and evolved into a web application powered by FastAPI, PostgreSQL, and an interactive frontend.

**Live Website:** https://smartspend-frontend-0i17.onrender.com  
**Backend API Documentation:** https://smartspend-tswc.onrender.com/docs

## Features

### Full-Stack Web Application
- User signup, login, email verification, and logout
- Secure, account-specific expense management
- Add, view, update, and delete expenses
- Calculate total spending
- View category-wise spending summaries
- Filter expenses by category
- Store expense records in PostgreSQL using Supabase
- Interactive dashboard connected to the backend
- Input validation and API error handling

### Original CLI Application
- Manage expenses through a terminal-based menu
- Add, view, edit, and delete expenses
- Calculate total and category-wise spending
- Save and load data using JSON
- Handle invalid user input

## Tech Stack

| Component | Technologies |
|---|---|
| Backend | Python, FastAPI |
| Database | PostgreSQL, Supabase |
| ORM | SQLAlchemy |
| Validation | Pydantic |
| Authentication | Supabase Auth |
| Frontend | HTML, Tailwind CSS, JavaScript |
| Visualization | Chart.js |
| CLI Storage | JSON |
| Deployment | Render |
| API Documentation | FastAPI / Swagger UI |

## Project Structure

```text
SmartSpend/
├── backend/
│   ├── __init__.py
│   ├── api.py
│   ├── auth.py
│   ├── database.py
│   ├── models.py
│   └── schemas.py
├── frontend/
│   ├── index.html
│   └── app.js
├── cli_version/
├── requirements.txt
├── .env.example
├── .gitignore
└── README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/krishchoudhary04/SmartSpend.git
cd SmartSpend
```

### 2. Install dependencies

Create and activate a virtual environment, then install the backend dependencies:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install the requirements:

```bash
pip install -r requirements.txt
```

### 3. Configure environment variables

- Create or configure a PostgreSQL database using Supabase.
- Copy `.env.example` to `.env`.
- Add the required database and Supabase configuration using the variable names provided in `.env.example`.
- Never commit `.env` or expose secret credentials.

### 4. Start the backend

Run this command from the project root:

```bash
python -m uvicorn backend.api:app --reload
```

Open the API documentation:

http://127.0.0.1:8000/docs

### 5. Run the frontend locally

Open the `frontend` folder using a local development server, such as VS Code Live Server.

Keep the backend running while using the dashboard. Make sure the frontend's Supabase and API configuration is set correctly for your local environment.

## Optional: Run the Original CLI Version

```bash
cd cli_version
python main.py
```

The CLI application automatically creates 'expenses.json' when expenses are saved, if the file does not already exist. This file stores expense records in JSON format.
 An example 'expenses.json' file is included in the repository to demonstrate the expected data format.

## Deployment

SmartSpend is deployed using:

- **Frontend:** Render Static Site
- **Backend:** Render Web Service
- **Database and Authentication:** Supabase

Visit the live application:  
https://smartspend-frontend-0i17.onrender.com

## What I Learned

- Building REST APIs using FastAPI
- Implementing CRUD operations
- Connecting Python applications to PostgreSQL
- Using SQLAlchemy for database operations
- Validating requests with Pydantic
- Implementing authentication and authorization
- Connecting a frontend to a backend API
- Handling user-specific data and API errors
- Deploying a full-stack application
- Organizing a multi-folder project

---

**Project:** SmartSpend  
**Author:** [krishchoudhary04](https://github.com/krishchoudhary04)  
**GitHub Repository:** https://github.com/krishchoudhary04/SmartSpend

