from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from sqlalchemy.exc import SQLAlchemyError

from backend.database import SessionLocal
from backend.models import Expense
from backend.schemas import ExpenseCreate, ExpenseResponse

app = FastAPI(title="SmartSpend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],         
    allow_credentials=True,
    allow_methods=["*"],          
    allow_headers=["*"],
)

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/expenses",response_model=ExpenseResponse)
def create_expense(expense:ExpenseCreate,db:Session = Depends(get_db)):
    try:
        new_expense=Expense(
            amount=expense.amount,
            category=expense.category,
            description=expense.description
        )
        db.add(new_expense)  
        db.commit()
        db.refresh(new_expense)  
        return new_expense

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Database error occurred"
        )

@app.get("/expenses",response_model=list[ExpenseResponse])
def get_expenses(db:Session = Depends(get_db)):
    expenses=db.query(Expense).all()
    return expenses    

@app.get("/expenses/{expense_id}",response_model=ExpenseResponse)
def get_expenses(expense_id: int,db:Session = Depends(get_db)):
    expense=db.query(Expense).filter(Expense.id==expense_id).first()
    if expense is None:
        raise HTTPException( 
            status_code=404,
            detail="Expense not found"
        )
    return expense

@app.delete("/expense/{expense_id}")
def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    try:
        expense = db.query(Expense).filter(Expense.id == expense_id).first()

        if expense is None:
            raise HTTPException(status_code=404, detail="Expense not found")

        db.delete(expense)
        db.commit()

        return {"message": "Expense deleted successfully"} 

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Database error occurred"
        )   


@app.put("/expenses/{expense_id}", response_model=ExpenseResponse)
def update_expense(expense_id: int, updated_data: ExpenseCreate, db:Session = Depends(get_db)):
    try:
        expense = db.query(Expense).filter(Expense.id == expense_id).first()

        if expense is None:
            raise HTTPException(status_code=404, detail="Expense not found")

        expense.amount = updated_data.amount
        expense.category = updated_data.category
        expense.description = updated_data.description

        db.commit()
        db.refresh(expense)

        return expense

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Database error occurred"
        )

@app.get("/expenses/summary/total")
def get_total_spending(db: Session = Depends(get_db)):
    total=db.query(func.sum(Expense.amount)).scalar()

    return {"total_spending": total or 0}

@app.get("/expenses/summary/category")
def get_category_spending(db: Session = Depends(get_db)):
    results=(db.query(Expense.category,func.sum(Expense.amount).label("total")).group_by(Expense.category).all())

    return [
        {"category": category , "total_spending": total}
        for category,total in results
    ]

@app.get("/expenses/category/{category}")
def get_expenses_by_category(category : str , db : Session = Depends(get_db)):
    expenses=(db.query(Expense).filter(Expense.category==category).all())

    return expenses


    








