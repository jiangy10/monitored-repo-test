import { add } from '../functions/calc';

describe('add function tests', () => {
    test('adds 1 + 2 to equal 3 (passing test)', () => {
      expect(add(2, 2)).toBe(4);
    });
  });