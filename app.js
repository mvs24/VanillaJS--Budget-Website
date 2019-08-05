document.addEventListener("DOMContentLoaded", () => {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  let indexOfMonth = new Date().getMonth();
  document.querySelector(".budget__title--month").textContent =
    months[indexOfMonth];
});

const incomeList = document.querySelector(".income__list");
const expenseList = document.querySelector(".expenses__list");
const feedback = document.querySelector(".feedback");

let incomes = [];
let expenses = [];
let id = 0;
let budgetValue = 0;
let incomesSum = 0;
let expensesSum = 0;

incomeList.addEventListener("click", e => {
  removeIncome(e);
});

expenseList.addEventListener("click", e => {
  removeExpense(e);
});

document
  .querySelector(".ion-ios-checkmark-outline")
  .addEventListener("click", () => {
    let type = document.querySelector(".add__type").value;
    let description = document.querySelector(".add__description").value;
    let value = document.querySelector(".add__value").value;
    if (type === "inc") {
      addIncome(description, value);
    } else if (type === "exp") {
      addExpense(description, value);
    }
  });

function addIncome(desc, val) {
  let value = val * 1;
  document.querySelector(".ion-ios-checkmark-outline").classList.add("green");
  if (desc === "" || /^[0-9]*$/.test(desc) || desc === null || val <= 0) {
    feedback.classList.add("feedback-error");
    feedback.textContent = `
    Something went wrong!`;
    setTimeout(() => {
      feedback.classList.remove("feedback-error");
      feedback.textContent = "";
    }, 1000);
  } else {
    feedback.classList.add("feedback-success");
    feedback.textContent = "Income added to the list";
    setTimeout(() => {
      feedback.classList.remove("feedback-success");
      feedback.textContent = "";
    }, 1000);
    id = id + 1;
    let income = {
      id,
      desc,
      value
    };

    incomes.push(income);
    insertIncome(incomes);
    changePercentage();
  }
}

function insertIncome(inc) {
  //     <div class="item clearfix" id="income-0">
  let lastIndex = inc.length - 1;

  const div = document.createElement("div");
  div.classList.add("item", "clearfix", `${inc[lastIndex].id}`);
  div.setAttribute("data-id", `${inc[lastIndex].id}`);
  div.innerHTML = `
  <div class="item__description">${inc[lastIndex].desc}</div>
  <div class="right clearfix">
      <div class="item__value">+ ${inc[lastIndex].value.toFixed(2)}</div>
      <div class="item__delete">
          <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
      </div>
  </div>
</div>
`;
  incomeList.appendChild(div);
  addIncomesPrice(inc);
}

function addIncomesPrice(inc) {
  incomesSum = inc.reduce((total, income) => {
    total += income.value;
    return total;
  }, 0);

  document.querySelector(".budget__income--value").textContent =
    "+ " + incomesSum.toFixed(2);
  evaluateBudgetValue(incomes, expenses);
  totalPercentage();
}

function addExpense(desc, val) {
  let value = val * 1;
  document.querySelector(".ion-ios-checkmark-outline").classList.add("red");

  if (desc === "" || /^[0-9]*$/.test(desc) || desc === null || val <= 0) {
    feedback.classList.add("feedback-error");
    feedback.textContent = `
    Something went wrong!`;
    setTimeout(() => {
      document
        .querySelector(".ion-ios-checkmark-outline")
        .classList.remove("red");
      feedback.classList.remove("feedback-error");
      feedback.textContent = "";
    }, 1000);
  } else {
    setTimeout(() => {
      document
        .querySelector(".ion-ios-checkmark-outline")
        .classList.remove("red");
    }, 1000);

    feedback.classList.add("feedback-error");
    feedback.textContent = "Expense added to the list";
    setTimeout(() => {
      feedback.classList.remove("feedback-error");
      feedback.textContent = "";
    }, 1000);
    let expense = {
      id: id++,
      desc,
      value,
      percentage: ((val / incomesSum) * 100).toFixed(2)
    };
    expenses.push(expense);

    insertExpense(expenses);
  }
}

function insertExpense(exp) {
  let lastIndex = exp.length - 1;
  if (incomesSum <= 0) {
    const div = document.createElement("div");
    div.classList.add("item", "clearfix");
    div.setAttribute("data-id", `${exp[lastIndex].id}`);

    div.innerHTML = `
  <div class="item__description">${exp[lastIndex].desc}</div>
  <div class="right clearfix">
      <div class="item__value">- ${exp[lastIndex].value.toFixed(2)}</div>
      <div class="item__percentage perc-${exp[lastIndex].id}">--</div>
      <div class="item__delete">
          <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
      </div>
  </div>
</div>
  `;
    document.querySelector(".expenses__list").appendChild(div);
    addExpensesPrice(exp);
  } else {
    const div = document.createElement("div");
    div.classList.add("item", "clearfix");
    div.setAttribute("data-id", `${exp[lastIndex].id}`);

    div.innerHTML = `
  <div class="item__description">${exp[lastIndex].desc}</div>
  <div class="right clearfix">
      <div class="item__value">- ${exp[lastIndex].value.toFixed(2)}</div>
      <div class="item__percentage perc-${exp[lastIndex].id}"> %${
      exp[lastIndex].percentage
    }</div>
      <div class="item__delete">
          <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
      </div>
  </div>
</div>
  `;
    document.querySelector(".expenses__list").appendChild(div);
    addExpensesPrice(exp);
  }
}

function addExpensesPrice(expns) {
  expensesSum = expns.reduce((total, expense) => {
    total += expense.value;
    return total;
  }, 0);
  document.querySelector(".budget__expenses--value").textContent =
    "- " + expensesSum.toFixed(2);
  evaluateBudgetValue(incomes, expenses);
  totalPercentage();
}

function evaluateBudgetValue(incs, expns) {
  let incomesSum = incs.reduce((total, income) => {
    total += income.value;
    return total;
  }, 0);

  let expensesSum = expns.reduce((total, expense) => {
    total += expense.value;
    return total;
  }, 0);

  budgetValue = incomesSum - expensesSum;
  if (budgetValue > 0) {
    document.querySelector(".budget__value").textContent =
      "+ " + budgetValue.toFixed(2);
  } else {
    document.querySelector(".budget__value").textContent = budgetValue.toFixed(
      2
    );
  }
}

function removeIncome(e) {
  let incomeElement =
    e.target.parentElement.parentElement.parentElement.parentElement;
  let removeId = incomeElement.getAttribute("data-id") * 1;
  //   console.log(removeId);
  incomes.forEach((income, index) => {
    if (income.id === removeId) {
      incomes.splice(index, 1);
    }
  });
  incomeElement.remove();
  evaluateBudgetValue(incomes, expenses);

  addIncomesPrice(incomes);
  changePercentage();
  totalPercentage();
}

function removeExpense(e) {
  let expenseElement =
    e.target.parentElement.parentElement.parentElement.parentElement;
  // console.log(expenseElement);

  let removeId = expenseElement.getAttribute("data-id") * 1;

  expenses.forEach((expense, index) => {
    if (expense.id === removeId) {
      expenses.splice(index, 1);
    }
  });
  expenseElement.remove();
  evaluateBudgetValue(incomes, expenses);
  addExpensesPrice(expenses);
  changePercentage();
  totalPercentage();
}

function changePercentage() {
  //   console.log(incomesSum-expensesSum);

  if (incomesSum < expensesSum) {
    expenses.forEach(expense => {
      document.querySelector(`.perc-${expense.id}`).textContent = "--";
    });
  } else {
    expenses.forEach(expense => {
      expense.percentage = ((expense.value / incomesSum) * 100).toFixed(2);
      document.querySelector(`.perc-${expense.id}`).textContent =
        "% " + expense.percentage;
    });
  }
  totalPercentage();
}

function totalPercentage() {
  //console.log(incomesSum-expensesSum);

  if (incomesSum < expensesSum) {
    document.querySelector(".budget__expenses--percentage").textContent =
      0 + "%";
    return;
  }
  expenses.forEach(expense => {
    expense.percentage = expense.percentage * 1;
  });
  let sum = expenses.reduce((total, expense) => {
    total += expense.percentage;
    return total;
  }, 0);

  document.querySelector(".budget__expenses--percentage").textContent =
    sum + "%";
}
