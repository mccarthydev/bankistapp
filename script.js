'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerNames = document.querySelector('.accountsNames');
const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

const createAccount = function (accs) {
  accs.forEach(function (acc) {
    acc.user = acc.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};

createAccount(accounts);

const appearBalance = function (movements) {
  containerMovements.innerHTML = '';

  movements.forEach(function (mov, i) {
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${
      mov > 0 ? 'deposit' : 'withdrawal'
    }">${i + 1} deposit</div>
    <div class="movements__date">3 days ago</div>
    <div class="movements__value">${mov}€</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcCurrentBalance = function (movements) {
  const current = movements.reduce((acc, cur) => acc + cur);
  labelBalance.textContent = `${current}€`;
};

const calcDisplaySummary = function (movements) {
  const deposit = movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumIn.textContent = `${deposit}€`;

  const withdrawal = movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumOut.textContent = `${Math.abs(withdrawal)}€`;

  const interest = deposit * 0.012 > 1 ? deposit * 0.012 : 0;

  labelSumInterest.textContent = `${interest}€`;
};

let currentLogin;

const displayInfos = function (currentLogin) {
  //movements history
  appearBalance(currentLogin.movements);
  //current balance
  calcCurrentBalance(currentLogin.movements);
  //diplay
  calcDisplaySummary(currentLogin.movements);
};

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentLogin = accounts.find(acc => acc.user === inputLoginUsername.value);

  if (currentLogin?.pin === Number(inputLoginPin.value)) {
    containerNames.classList.add('displayNone');
    //login title
    labelWelcome.textContent = `Welcome, ${currentLogin.owner.split(' ')[0]}`;

    displayInfos(currentLogin);

    inputLoginUsername.value = inputLoginPin.value = '';

    //opacity
    containerApp.style.opacity = 1;
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const transferToValue = inputTransferTo.value;
  const amount = Number(inputTransferAmount.value);

  currentLogin.movements.push(-amount);

  accounts.find(acct => acct.user === transferToValue).movements.push(amount);

  displayInfos(currentLogin);
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentLogin.user === inputCloseUsername.value &&
    currentLogin.pin === Number(inputClosePin.value)
  ) {
    containerNames.classList.remove('displayNone');
    const index = accounts.findIndex(
      acct => acct.user === inputCloseUsername.value
    );

    //close account
    accounts.splice(index, 1);

    //change opacity
    containerApp.style.opacity = 0;

    inputCloseUsername.value = inputClosePin.value = '';
  }
});
