export default function agreeable(num) {
  num = +num;
  const vowelInitial = num > 0 && (num === 18 || num.toString()[0] === `8`);
  const singular = num === 1 || num === -1;
  return {
    vowelInitial,
    singular,
    apply(fn) {
      return fn({ num, vowelInitial, singular });
    }
  };
}
