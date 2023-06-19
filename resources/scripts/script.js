"use strict";
/*.........................BANKIST APP......................*/

/*........................USER DATA.........................*/
const account1 = {
  owner: "Anna Smith",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2,
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2023-06-07T10:51:36.790Z",
    "2023-06-10T17:01:17.194Z",
    "2023-06-11T23:36:17.929Z",
  ],
  currency: "EUR",
  locale: "pt-PT",
};

const account2 = {
  owner: "Jess Jackson",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Mary Jeanne",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2022-04-10T14:43:26.374Z",
    "2022-06-25T18:49:59.371Z",
    "2023-07-26T12:01:20.894Z",
  ],
  currency: "INR",
  locale: "en-GB",
};

const account4 = {
  owner: "Sam Davis",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2022-04-10T14:43:26.374Z",
    "2022-06-25T18:49:59.371Z",
    "2023-07-26T12:01:20.894Z",
  ],
  currency: "EUR",
  locale: "es-ES",
};

const accounts = [account1, account2, account3, account4];

/*.......................DOM ELEMENTS.......................*/

//Labels
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

//Containers
const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

//Buttons
const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");
const btnLogOut = document.querySelector(".btn--logout");

//Inputs
const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/*........................FUNCTIONS........................*/

/*Utility Functions: createUserNames, formatDate, formatCur*/
//Creating usernames for each account in the accounts array
const createUserNames = function (accounts) {
  accounts.forEach(function (account) {
    account.userName = account.owner //Jessica Davis
      .toLowerCase() //jessica davis
      .split(" ") //["jessica","davis"]
      .map((word) => word[0]) //["jessica"=>"j","davis"=>"d"]
      .join(""); //jd
  });
};
createUserNames(accounts);

//Formats date into dd/mm/yyyy format
const formatDate = function (movDate, locale) {
  //Calculates days passed between 2 dates
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));
  const daysPassed = calcDaysPassed(new Date(), movDate);
  if (daysPassed === 0) return "Today";
  else if (daysPassed === 1) return "Yesterday";
  else if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    //Using Internationalization API
    const options = {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };
    return new Intl.DateTimeFormat(locale, options).format(movDate);
  }
};

//Formatting currency based on user's locale
const formatCur = function (value, locale, currency) {
  return `${new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value.toFixed(2))}`;
};

/*....Calculating and Displaying application components....*/

//Displaying account movements data using forEach
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";
  //Creating new array containing movements with their respective movement dates so that movements are sorted along with their dates
  const newMovs = acc.movements.map((mov, i) => {
    return [mov, acc.movementsDates[i]];
  });
  const locale = acc.locale;
  const currency = acc.currency;
  //Sorting array
  const movs = sort ? newMovs.slice().sort((a, b) => a[0] - b[0]) : newMovs;
  //Looping over movs--->[[movement1,movementDate1],[movement2,movementDate2],......]
  //mov[0]--->movement and mov[1]--->movementDate
  movs.forEach(function (mov, i) {
    //Calculating type of movement
    const type = mov[0] > 0 ? "deposit" : "withdrawal";
    //Converting date, currency into formatted date, currency
    const movDate = new Date(mov[1]);
    const displayDate = formatDate(movDate, locale);
    const formattedMov = formatCur(mov[0], locale, currency);

    //Creating customized HTML based on type of movement
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}
        </div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>`;
    //Inserting the customized HTML into our application
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

//Calculating and displaying global account balance
const calcDisplayBalance = function (account) {
  //Creating new property balance in the account object
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(
    account.balance,
    account.locale,
    account.currency
  );
};

//Calculating and displaying Summary
const calcDisplaySummary = function (acc) {
  const inBal = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov);
  labelSumIn.textContent = formatCur(inBal, acc.locale, acc.currency);

  const outBal = Math.abs(
    acc.movements.filter((mov) => mov < 0).reduce((acc, mov) => acc + mov)
  );
  labelSumOut.textContent = `${new Intl.NumberFormat(acc.locale, {
    style: "currency",
    currency: acc.currency,
  }).format(outBal.toFixed(2))}`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

//Displaying and updating user UI
const updateUI = function (account) {
  displayMovements(account);
  calcDisplayBalance(account);
  calcDisplaySummary(account);
};

//Logging out user and Hiding the UI
const logOut = function () {
  currentAccount = null;
  labelWelcome.textContent = `Log in to get started`;
  containerApp.style.opacity = 0;
};

/*.............Implementing Timer functionality.............*/

//Displaying and starting logout timer
const startLogOutTimer = function () {
  //Set timer for 300 seconds i.e user will get logged out after 300 seconds of inactivity
  let time = 300;
  //Call the timer every second
  const timer = setInterval(function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);
    //In each call print remaining time to UI
    labelTimer.textContent = `${min} : ${sec}`;
    //When timer reaches 0 sec, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
      currentAccount = null;
    }
    //Decrease 1s
    time--;
  }, 1000);
  return timer;
};

//Resetting timer when user performs some activity
const resetTimer = function () {
  clearInterval(timer);
  timer = startLogOutTimer();
};

/*......................EVENT LISTENERS.....................*/

//Implementing Login functionality
let currentAccount, timer;
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  //Initializing currentAccount
  currentAccount = accounts.find(
    (account) => account.userName === inputLoginUsername.value
  );
  console.log(currentAccount);
  //Checking if current account exists & input pin=account pin
  if (currentAccount?.pin === +inputLoginPin.value) {
    //Resetting Timer for every log in
    resetTimer();
    //Resetting login form fields to blank after log in
    inputLoginUsername.value = inputLoginPin.value = "";
    //Focussing out of the form fields
    inputLoginPin.blur();
    sorted = false;
    //Displaying UI
    labelWelcome.textContent = `Welcome ${currentAccount.owner.split(" ")[0]}`; //["Jessica","Davis"]=>"Jessica"
    //Displaying date label
    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    updateUI(currentAccount);
    containerApp.style.opacity = 1;
  }
});

//Implementing Transfer functionality
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAccount = accounts.find(
    (acc) => acc.userName === inputTransferTo.value
  );
  //Resetting form fields to blank after reading its values
  inputTransferAmount.value = inputTransferTo.value = "";
  //Checking if amount, user, receiver is valid or not.
  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAccount &&
    receiverAccount?.userName !== currentAccount.userName
  ) {
    //If valid, add new transaction into the movements of both
    currentAccount.movements.push(amount * -1);
    receiverAccount.movements.push(amount);
    //Add movement dates for the transaction done
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());
    //Update the view
    updateUI(currentAccount);
    //Reset timer
    resetTimer();
  }
});

//Implementing Loan functionality
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const loanAmt = Math.floor(inputLoanAmount.value);
  //Resetting the loan field to blank after reading value
  inputLoanAmount.value = "";
  //Checking if the loan amount is valid, and the user has a deposit greater than 10% of the loan amount
  if (
    loanAmt > 0 &&
    currentAccount.movements.some((mov) => mov > 0 && mov >= loanAmt * 0.1)
  ) {
    setTimeout(function () {
      //Add the loan amount to the user's balance
      currentAccount.balance += loanAmt;
      //Add the transaction to the user's movements array
      currentAccount.movements.push(loanAmt);
      //Add transaction date to the user's movementDates array
      currentAccount.movementsDates.push(new Date().toISOString());
      //Update the view
      updateUI(currentAccount);
      //Reset timer
      resetTimer();
    }, 2500);
  }
});

//Implementing Close Account functionality
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  //Checking if user's userName, password matches input values
  if (
    currentAccount.userName === inputCloseUsername.value &&
    currentAccount.pin === +inputClosePin.value
  ) {
    //If true delete user object from the accounts array
    const index = accounts.findIndex(
      (account) => account.userName === inputCloseUsername.value
    );
    accounts.splice(index, 1);
    //Log out and Hide the UI
    logOut();
  }
  //Resetting the field values to blank
  inputCloseUsername.value = inputClosePin.value = "";
});

//Implementing Sort functionality
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
  //Reset timer
  resetTimer();
});

//Implementing Log Out functionality
btnLogOut.addEventListener("click", function () {
  logOut();
});
