import assert from "assert";
import { Revenue } from "../performance/revenue.interface";

const INCONGRUENT_COIN_TYPE_MSG = "Revenue coinTypes must be equal.";

export function revenueSum(augend: Revenue, addend: Revenue) {
  assert(
    augend.coinType == addend.coinType,
    generateCoinTypeError(augend.coinType, addend.coinType)
  );
}

export function revenueDifference(minuend: Revenue, subtrahend: Revenue) {
  assert(
    minuend.coinType == subtrahend.coinType,
    generateCoinTypeError(minuend.coinType, subtrahend.coinType)
  );
  return {
    amount: minuend.amount - subtrahend.amount,
    coinType: minuend.coinType,
  };
}

export function revenueDivision(dividend: Revenue, divisor: Revenue) {
  assert(
    dividend.coinType == divisor.coinType,
    generateCoinTypeError(dividend.coinType, divisor.coinType)
  );
}

function generateCoinTypeError(coinType1, coinType2) {
  return `${INCONGRUENT_COIN_TYPE_MSG} Type1: ${coinType1}, Type2: ${coinType2}.`;
}
