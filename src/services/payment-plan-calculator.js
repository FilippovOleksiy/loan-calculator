import { roundUp, generateArray } from '../utils/utils';

// (Number -> Number -> Number) -> Number
export const calculateFee = (amount, feeMultiplier, maxMonthlyFee) => {
  let monthlyFee = amount * feeMultiplier;
  return monthlyFee > maxMonthlyFee ? maxMonthlyFee : monthlyFee;
};

/**
 * It is a financial function PMT
 * (Number -> Number -> Number) -> Number
 */
export const calculateMonthlyPayment = (amount, interest, loanTerm) =>
  interest / 12 * amount / (1 - Math.pow(1 + (interest / 12), -loanTerm));

// (Nuber -> Number) -> Number
export const calculateDailyInterest = (amount, interest) => amount * interest / 365;

// (Number -> Object -> Number) -> Number
const calculateAmount = (index, payment, monthlyFeeToPay) => {
  let needsToPay = payment.amount;
  if (index !== 0) {
    needsToPay = payment.amount - (payment.monthlyInstallment - payment.monthlyInterest - monthlyFeeToPay);
  }
  return needsToPay;
}

// (Number -> Number) -> (Number -> Object) -> Number
const monthlyInstallmentForMonth = (expectedMonth, monthlyFeeToPay) => (currentMonth, payment) => {
  let newMonthlyInstallment = payment.monthlyInstallment;
  if (currentMonth === expectedMonth) {
    newMonthlyInstallment = payment.amount + payment.monthlyInterest + monthlyFeeToPay;
  }
  return newMonthlyInstallment
}

// Object -> Array
export const calculatePaymentsInformation = ({ amount, monthlyInstallment, interest, monthlyFeeToPay, loanTerm }) => {
  const month = 30;
  const monthlyPayments = generateArray(loanTerm);
  const calculateMonthlyInstallment = monthlyInstallmentForMonth(monthlyPayments.length - 1, monthlyFeeToPay);
  monthlyPayments.reduce((accumulator, currentValue, currentIndex) => {
    Object.assign(currentValue, accumulator);

    currentValue.amount = calculateAmount(currentIndex, accumulator, monthlyFeeToPay);
    currentValue.monthlyInterest = calculateDailyInterest(currentValue.amount, interest) * month;
    currentValue.monthlyInstallment = calculateMonthlyInstallment(currentIndex, currentValue);

    return currentValue;
  }, { amount, monthlyInstallment });

  return monthlyPayments;
};

// Array -> Array
export const calculateCapitalLeft = paymentsInformation => {
  const capitalInformation = [];
  paymentsInformation.reduce((accumulator, currentValue) => {
    const capitalLeft = accumulator + currentValue.monthlyInstallment;
    capitalInformation.push(capitalLeft);
    return capitalLeft;
  }, 0);

  return capitalInformation;
}

// Array -> Number
export const calculateTotalAmount = paymentsInformation => {
  return paymentsInformation.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.monthlyInstallment;
  }, 0);
};

/**
 * This is a main function which helps us to calculate all financial information about payments.
 * Object -> Number -> Object
 */
export default ({ feeMultiplier, maxMonthlyFee, interest, loanTerm }) => amount => {
  const fractionDigits = 2;
  const monthlyFeeToPay = calculateFee(amount, feeMultiplier, maxMonthlyFee);
  const monthlyInstallment = roundUp(calculateMonthlyPayment(amount, interest * 360 / 365, loanTerm), fractionDigits)
    + monthlyFeeToPay;
  const paymentsInformation = calculatePaymentsInformation(
    { amount, monthlyInstallment, interest, monthlyFeeToPay, loanTerm }
  );
  const monthlyCapitalLeft = calculateCapitalLeft(paymentsInformation);
  paymentsInformation.forEach((information, index) => {
    information.capitalLeft = monthlyCapitalLeft[index];
  });

  return {
    loanTerm,
    monthlyInstallment: monthlyInstallment,
    monthlyFeeToPay,
    paymentsInformation,
    totalAmount: calculateTotalAmount(paymentsInformation)
  };
}