# SmartSpend — Personal Expense Tracker

SmartSpend is a personal expense tracking project that started as a Python command-line application and evolved into a web application with a FastAPI backend, PostgreSQL database, and interactive frontend.

## Features

### Full-Stack Web Application
- Add, view, update, and delete expenses
- Calculate total spending
- View category-wise spending summaries
- Filter expenses by category
- Store expense records in PostgreSQL using Supabase
- Validate input and handle API errors
- Interactive dashboard connected to the backend

### Original CLI Application
- Manage expenses through a terminal menu
- Add, view, edit, and delete expenses
- Calculate total and category-wise spending
- Save and load data using JSON
- Handle invalid user input

## Tech Stack

- **Backend:** Python, FastAPI
- **Database:** PostgreSQL (Supabase)
- **ORM:** SQLAlchemy
- **Validation:** Pydantic
- **Frontend:** HTML, CSS, JavaScript
- **Original CLI Storage:** JSON
- **API Documentation:** FastAPI / Swagger UI

## Project Structure

SmartSpend/
├── backend/
│   ├── api.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   └── test_connection.py
├── frontend/
│   ├── index.html
│   └── app.js
├── cli_version/
│   ├── main.py
│   └── expenses.json
├── .env.example
├── .gitignore
└── README.md


## Getting Started

### 1. Clone the repository

git clone https://github.com/krishchoudhary04/SmartSpend.git
cd SmartSpend


### 2. Install dependencies

Create and activate a virtual environment if desired, then install the Python packages used by the backend:

pip install fastapi "uvicorn[standard]" sqlalchemy psycopg2-binary python-dotenv


Install any additional packages required by your project.

### 3. Configure the database

- Create or configure a PostgreSQL database using Supabase.
- Copy '.env.example' to '.env'.
- Add your own database connection string to '.env'.
- Never commit your '.env' file or expose database credentials.

### 4. Start the backend

Run this command from the project root:


python -m uvicorn backend.api:app --reload


Open the API documentation:

http://127.0.0.1:8000/docs

### 5. Open the frontend

Open 'frontend/index.html' in a browser or serve the frontend using a local development server. Keep the backend running while using the dashboard.

### 6. Run the original CLI version


cd cli_version
python main.py

The CLI application automatically creates 'expenses.json' when expenses are saved, if the file does not already exist. This file stores expense records in JSON format.
 An example 'expenses.json' file is included in the repository to demonstrate the expected data format.

## What I Learned

- Building REST APIs using FastAPI
- Implementing CRUD operations
- Connecting Python applications to PostgreSQL
- Using SQLAlchemy for database queries
- Validating requests with Pydantic
- Connecting a frontend to a backend API
- Handling errors and organizing a multi-folder project
- Practising Python fundamentals through the original CLI application

## Future Improvements

- Deploy the frontend and backend publicly
- Add user authentication
- Improve dashboard analytics and visualizations
- Add automated tests and more robust error handling

---

**Project:** SmartSpend  
**Author:** [krishchoudhary04](https://github.com/krishchoudhary04)

