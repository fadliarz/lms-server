"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isNaNArray(nums) {
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
exports.default = isNaNArray;
