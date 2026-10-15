import json

while True:
    try:
        with open("expenses.json", "r") as file:
            expenselist = json.load(file)
    except FileNotFoundError:
        expenselist = []
    except json.JSONDecodeError:
        print("Error: expenses.json contains invalid JSON.")
        print("Please check or restore the file.")
        raise SystemExit   

    def save_expenses():
        with open("expenses.json", "w") as file:
            json.dump(expenselist, file, indent=4)     

    print("SMART SPEND".center(50))
    print("What Do You Want To Do :-\n"
    "1. Add expense\n"
    "2. View all expenses\n"
    "3. Show total spending\n"
    "4. Delete an expense\n"
    "5. Edit an expense\n"
    "6. Category-Wise Spending\n"
    "7. Exit")

    while True:
        try:
            choice = int(input("Enter your choice: "))
            break
        except ValueError:
            print("Invalid input! Please enter a valid number")

    if choice == 1:
        print("Add expense selected")

        choice = input("Do you want to add expense (yes/no): ").lower()

        while choice == "yes":
            while True:
                try:
                    amount = int(input("Enter the amount: ₹"))
                    break
                except ValueError:
                    print("Invalid amount! Please enter a valid number")

            expense = {
                "amount": amount,
                "category": input("Enter the category: "),
                "description": input("Enter the description:")
            }

            del amount
            expenselist.append(expense)

            save_expenses()

            choice = input(
                "Do you want to add another expense (yes/no): "
            ).lower()

    elif choice == 2:
        print("View all expenses selected")

        if not expenselist:
            print("No expenses added yet!\nWant To Add?\nPress 1 in choice")
        else:
            for index, item in enumerate(expenselist, start=1):
                print(index, "Category:",item["category"], "\n", "","Description:",item["description"],"\n","","Amount:₹",item["amount"])

    elif choice == 3:
        print("Show total spending selected")

        total = 0
        for i in range(len(expenselist)):
            total += expenselist[i]["amount"]

        print("Total amount:₹", total)

    elif choice == 4:
        print("Delete an expense selected")
        choice = input("Do you want to delete an expense (yes/no): ").lower()
        while choice=="yes":

            if not expenselist:
                print("No expenses added yet!\nWant To Add?\nPress 1 in choice")
                break
            
            for index, item in enumerate(expenselist, start=1):
                print(index, "Category:",item["category"], "\n", "","Description:",item["description"],"\n","","Amount:₹",item["amount"])

            while True:
                try:
                    i = int(input("Enter no. of which expense to be deleted: "))

                    if 1 <= i <= len(expenselist):
                        break
                    else:
                        print(
                            f"Invalid Input! Please enter a number "
                            f"between 1 and {len(expenselist)}."
                        )
                except ValueError:
                    print("Invalid input! Please enter a valid number")

            expenselist.pop(i - 1)

            save_expenses()
            print("Expense removed successfully")
            choice=input("Do you want to delete another expense (yes/no): ").lower()

    elif choice == 5:
        print("Edit an expense selected")

        choice = input(
            "Do you want to edit an expense (yes/no): "
        ).lower()

        while choice == "yes":
            if not expenselist:
                print("No expenses added yet!\nWant To Add?\nPress 1 in choice")
                break

            for index, item in enumerate(expenselist, start=1):
                print(index, "Category:",item["category"], "\n", "","Description:",item["description"],"\n","","Amount:₹",item["amount"])

            while True:
                try:
                    i = int(input("Enter no. of which expense to be edited: "))

                    if 1 <= i <= len(expenselist):
                        break
                    else:
                        print(
                            f"Invalid Input! Please enter a number "
                            f"between 1 and {len(expenselist)}."
                        )
                except ValueError:
                    print("Invalid input! Please enter a valid number")

            while True:
                j = input(
                    "Enter which one to be edited\n"
                    "category\n"
                    "description\n"
                    "amount\n"
                    "Enter: "
                ).lower()

                if j in ["category", "description", "amount"]:
                    break
                else:
                    print(
                        "Invalid input! Please enter one of the "
                        "following given above."
                    )

            if j == "amount":
                while True:
                    try:
                        newelement = int(input("Enter the edited amount: ₹"))
                        break
                    except ValueError:
                        print("Invalid amount! Please enter a valid number")

                expenselist[i - 1][j] = newelement
                save_expenses()

            elif j == "category":
                newelement = input("Enter the edited category: ")
                expenselist[i - 1][j] = newelement
                save_expenses()

            elif j == "description":
                newelement = input("Enter the edited description: ")
                expenselist[i - 1][j] = newelement
                save_expenses()

            choice = input(
                "Do you want to edit another expense (yes/no): "
            ).lower()

    elif choice == 6:
        print("Category-Wise spending selected")
        if not expenselist:
            print("No expenses added yet!")

        else:
            category_totals = {}

            for item in expenselist:
                category = item["category"]
                amount = item["amount"]

                if category in category_totals:
                    category_totals[category] += amount
                else:
                    category_totals[category] = amount

            print("\n===== CATEGORY-WISE SPENDING =====")

            for category, total in category_totals.items():
                print(f"{category}: ₹{total}")

    elif choice == 7:
        print("Exiting SmartSpend")
        break

    else:
        print("Invalid choice")
