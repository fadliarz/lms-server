export default function isNaNArray(nums: number[]) {
  let isNaNArray = false;

  nums.every((num) => {
    if (isNaN(num)) {
      isNaNArray = true;
      return false;
    }
  });

  return isNaNArray;
}
