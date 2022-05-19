import { useEffect, useState } from "react";
import { Listing, Terms } from "../types/backend-types";

export type TermDetails = {
  repaymentAmount: number;
  repaymentTotal: number;
  amount: number;
  apr: number;
  duration: number;
};

export const useTermDetails = (terms: Terms | undefined): TermDetails => {
  console.log("useListingTerms");
  const [repaymentAmount, setRepaymentAmount] = useState(0);
  const [repaymentTotal, setRepaymentTotal] = useState(0);
  const [amount, setAmount] = useState(0);
  const [apr, setApr] = useState(0);
  const [duration, setDuration] = useState(0);

  // calculate repayment totals
  useEffect(() => {
    if (amount && duration && apr) {
      const wholePercent = (duration / 365) * apr;
      const realPercent = wholePercent / 100;
      const _repaymentAmount = amount * realPercent;
      setRepaymentAmount(_repaymentAmount);
      setRepaymentTotal(_repaymentAmount + amount);
    }
  }, [amount, duration, apr]);

  // handle internal updates
  // only update value if the terms have changed
  useEffect(() => {
    if (terms) {
      if (terms.amount && terms.amount !== amount) {
        setAmount(terms.amount);
      }
      if (terms.apr && terms.apr !== apr) {
        setApr(terms.apr);
      }
      if (terms.duration && terms.duration !== duration) {
        setDuration(terms.duration);
      }
    }
  }, [JSON.stringify(terms)]);

  return { repaymentAmount, repaymentTotal, amount, apr, duration };
};
