import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import allInvestments from "../helpers/all-investments";
import { Investment } from "../lib/investment";

interface IInvestmentStateView {
  investments: {
    loading: boolean;
    [key: string]: any;
  };
}

// Smash all the interfaces together to get the InvestmentData Type
export function useInvestments() {
  const investmentsLoading = useSelector(
    (state: IInvestmentStateView) => !state.investments.loading
  );
  const investmentsState = useSelector(
    (state: IInvestmentStateView) => state.investments
  );
  const [investments, setInvestments] = useState<Investment[]>(allInvestments);

  useEffect(() => {
    let investmentsDetails: Investment[];
    // eslint-disable-next-line prefer-const
    investmentsDetails = allInvestments.flatMap((investment) => {
      if (investmentsState[investment.name]) {
        return Object.assign(investment, investmentsState[investment.name]); // Keeps the object type
      }
      return investment;
    });

    const largestHoldings = investmentsDetails
      .concat()
      .sort((a, b) =>
        a["treasuryBalance"] > b["treasuryBalance"]
          ? -1
          : b["treasuryBalance"] > a["treasuryBalance"]
          ? 1
          : 0
      );

    setInvestments(largestHoldings);
  }, [investmentsState, investmentsLoading]);

  // Debug Log:
  // console.log(investments);
  return { investments, loading: investmentsLoading };
}

export default useInvestments;
