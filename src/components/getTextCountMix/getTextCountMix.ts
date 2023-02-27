export const getTextCountMix = (num: number, arr: string[]) => {
  num = Math.abs(num);
  if (Number.isInteger(num)) {
    const options = [2, 0, 1, 1, 1, 2];
    return arr[num % 100 > 4 && num % 100 < 20 ? 2 : options[num % 10 < 5 ? num % 10 : 5]];
  }
};
