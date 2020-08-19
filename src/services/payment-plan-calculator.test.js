import calculatePlan, {
  calculateFee,
  calculateMonthlyPayment,
  calculateDailyInterest,
  calculatePaymentsInformation,
  calculateTotalAmount,
  calculateCapitalLeft
} from './payment-plan-calculator';
import { roundUp } from '../utils/utils';

describe('payment-plan-calculator', () => {

  describe('calculateFee', () => {
    test('return correct data', () => {
      expect(calculateFee(1000, 0.05, 91.5)).toBe(50);
    });

    test('return incorrect data', () => {
      expect(calculateFee(1000, 0.05, 91.5)).not.toBe(60);
    });

    test('return max monthly fee', () => {
      const maxMonthlyFee = 91.5;
      expect(calculateFee(1000, 0.2, maxMonthlyFee)).toBe(maxMonthlyFee);
    });
  })

  describe('calculateMonthlyPayment', () => {
    test('return correct data for the amount = 1000', () => {
      const amount = 1000;
      const interest = 0.06 * 360 / 365;
      const loanTerm = 3;
      const monthlyFee = 50;
      const fractionDigits = 2;
      const monthlyToPay = roundUp(calculateMonthlyPayment(amount, interest, loanTerm), fractionDigits);
      expect(monthlyToPay + monthlyFee).toBe(386.63);
    });
  })

  describe('calculateDailyInterest', () => {
    test('return correct data', () => {
      const amount = 1000;
      const interest = 0.06;
      const dailyToPay = calculateDailyInterest(amount, interest) * 30;
      expect(dailyToPay).toBe(4.931506849315069);
    });
  })

  describe('calculatePaymentsInformation', () => {
    test('return array with calculated data', () => {
      const amount = 1000;
      const monthlyInstallment = 386.63;
      const interest = 0.06;
      const monthlyFee = 50;
      const loanTerm = 3;
      expect(calculatePaymentsInformation({ amount, monthlyInstallment, interest, monthlyFee, loanTerm }))
        .toBeDefined();
    });

    test('return array with length equals to loan term', () => {
      const amount = 1000;
      const monthlyInstallment = 386.63;
      const interest = 0.06;
      const monthlyFee = 50;
      const loanTerm = 3;
      expect(calculatePaymentsInformation({ amount, monthlyInstallment, interest, monthlyFee, loanTerm }).length)
        .toBe(loanTerm);
    });
  })

  describe('calculateTotalAmount', () => {
    test('return total price', () => {
      const totalPrice = 300;
      const priceList = [{ monthlyInstallment: 100 }, { monthlyInstallment: 200 }]
      expect(calculateTotalAmount(priceList)).toBe(totalPrice);
    });
  })

  describe('calculateCapitalLeft', () => {
    test('return capital left information', () => {
      const paymentsInformation = [{ monthlyInstallment: 100 }, { monthlyInstallment: 200 }]
      expect(calculateCapitalLeft(paymentsInformation)).toBeDefined();;
    });
  })

  describe('calculatePlan', () => {
    test('return calculated plan', () => {
      const amount = 1000;
      const interest = 0.06;
      const maxMonthlyFee = 91.5;
      const feeMultiplier = 0.05;
      const loanTerm = 3;
      expect(calculatePlan({ feeMultiplier, maxMonthlyFee, interest, loanTerm })(amount))
        .toBeDefined();
    });
  })
})
