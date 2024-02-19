export default function isNaNArray(nums: number[]) {
  let isNaNArray = false;

  nums.forEach((num) => {
    if (isNaNArray) {
      return;
    }

    if (isNaN(num)) {
      isNaNArray = true;
    }
  });

  return isNaNArray;
}
