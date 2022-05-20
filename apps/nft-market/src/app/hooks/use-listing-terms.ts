import { useEffect, useState } from "react";
import { Listing } from "../types/backend-types";

export type ListingTermDetails = {
  repaymentAmount: number;
  repaymentTotal: number;
  amount: number;
  apr: number;
  duration: number;
};

export const useListingTermDetails = (listing: Listing): ListingTermDetails => {
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
    if (listing && listing.terms) {
      if (listing.terms.amount && listing.terms.amount !== amount) {
        setAmount(listing.terms.amount);
      }
      if (listing.terms.apr && listing.terms.apr !== apr) {
        setApr(listing.terms.apr);
      }
      if (listing.terms.duration && listing.terms.duration !== duration) {
        setDuration(listing.terms.duration);
      }
    }
  }, [JSON.stringify(listing.terms)]);

  return { repaymentAmount, repaymentTotal, amount, apr, duration };
};
