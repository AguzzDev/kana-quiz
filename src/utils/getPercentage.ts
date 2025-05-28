export const getPercentage = (n: number, max: number) => {
  const number = Number((n * 100) / max).toFixed(2);

  return `(${number}%)`;
};
