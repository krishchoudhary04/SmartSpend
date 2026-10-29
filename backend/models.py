from sqlalchemy import Column,Integer,Numeric,String
from .database import Base

class Expense(Base):
    __tablename__="expenses"

    id=Column(Integer,primary_key=True,index=True)
    amount=Column(Numeric(10,2),nullable=False)
    category=Column(String(50),nullable=False)
    description=Column(String(100))