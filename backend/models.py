from sqlalchemy import Column, Integer, Numeric, String
from sqlalchemy.dialects.postgresql import UUID
from .database import Base


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Numeric(10, 2), nullable=False)
    category = Column(String(50), nullable=False)
    description = Column(String(100))

    # Supabase authenticated user's ID
    user_id = Column(UUID(as_uuid=True), nullable=False)
