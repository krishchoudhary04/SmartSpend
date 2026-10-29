from pydantic import BaseModel,ConfigDict,Field
from decimal import Decimal

class ExpenseCreate(BaseModel):
    amount: Decimal = Field(gt=0, max_digits=10, decimal_places=2)
    category: str = Field(min_length=1, max_length=50)
    description: str | None = Field(default=None, max_length=100)

class ExpenseResponse(BaseModel):
    id: int
    amount: Decimal
    category: str
    description: str | None = None    

model_config = ConfigDict(from_attributes=True)    