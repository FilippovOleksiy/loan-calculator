import { roundUp, generateArray } from './utils';

describe('utils', () => {
  describe('roundUp', () => {
    test('return correct data', () => {
      const fractionDigits = 2;
      expect(roundUp(1264.136666, fractionDigits)).toBe(1264.14);
    });
  })
  describe('generateArray', () => {
    test('return array with an empty objects', () => {
      const count = 5;
      expect(generateArray(count).length).toBe(count);
    });
  })
});
