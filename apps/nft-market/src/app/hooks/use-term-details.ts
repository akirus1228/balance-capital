import { useEffect, useState } from "react";
import { Terms } from "../types/backend-types";

export type TermDetails = {
  repaymentAmount: number;
  repaymentTotal: number;
  amount: number;
  apr: number;
  duration: number;
};

export const useTermDetails = (term: Terms | undefined): TermDetails => {
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
  // only update value if the term have changed
  useEffect(() => {
    if (term) {
      if (term.amount && term.amount !== amount) {
        setAmount(term.amount);
      }
      if (term.apr && term.apr !== apr) {
        setApr(term.apr);
      }
      if (term.duration && term.duration !== duration) {
        setDuration(term.duration);
      }
    }
  }, [JSON.stringify(term)]);

  return { repaymentAmount, repaymentTotal, amount, apr, duration };
};
