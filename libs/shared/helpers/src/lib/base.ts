import { ethers } from 'ethers';

export const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tab-panel-${index}`,
  };
}

export const scientificToDecimal = (num: any) => {
  const sign = Math.sign(num);
  //if the number is in scientific notation remove it
  if(/\d+\.?\d*e[\+\-]*\d+/i.test(num)) {
    const zero = '0';
    const parts = String(num).toLowerCase().split('e'); //split into coeff and exponent
    const e = parts.pop(); //store the exponential part
    let l = Math.abs(Number(e)); //get the number of zeros
    const direction = Number(e)/l; // use to determine the zeroes on the left or right
    const coeffArray = parts[0].split('.');

    if (direction === -1) {
      coeffArray[0] = String(Math.abs(Number(coeffArray[0])));
      num = zero + '.' + new Array(l).join(zero) + coeffArray.join('');
    }
    else {
      const dec = coeffArray[1];
      if (dec) l = l - dec.length;
      num = coeffArray.join('') + new Array(l+1).join(zero);
    }
  }

  if (sign < 0) {
    num = -num;
  }

  return num;
}

export const truncateDecimals = (number: any, digits = 2) => {
  const multiplier = Math.pow(10, digits);
  const adjustedNum = number * multiplier;
  const truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);
  return truncatedNum / multiplier;
};

export const formatAmount = (amount: any, decimals: any, length = 2, truncate = false) => {
  if (!amount || !decimals || amount === NaN) {
    return 0;
  }
  const result = ethers.utils.formatUnits(scientificToDecimal(parseInt(amount, 10)).toString(), decimals);
  if (truncate) {
    return truncateDecimals(result, length);
  } else {
    return result;
  }
};
