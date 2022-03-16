import {Bond} from "./Bond";

export type Terms = {
  vestingTermSeconds: number; // in seconds
  vestingTerm: number; // safeguard, use some vestingTermSeconds/2 in blocks
  discount: number; // discount in in thousandths of a % i.e. 5000 = 5%
  maxPayout: number; // in thousandths of a %. i.e. 500 = 0.5%
  fee: number; // as % of bond payout, in hundreths. ( 500 = 5% = 0.05 for every 1 paid)
  maxDebt: number; // 9 decimal debt ratio, max % total supply created as debt
  soldBondsLimitUsd: number; //
};

export type SoldBonds = {
  timestampFrom: number;
  timestampTo: number;
  payoutInUsd: number;
};

// export type Bond = {
//   payout: number; // FHUD to be paid
//   vesting: number; // Blocks left to vest
//   lastBlock: number; // Last interaction
//   pricePaid: number; // In DAI, for front end viewing
//   vestingSeconds: number; // Blocks left to vest
//   lastTimestamp: number; // Last interaction
// };

export interface BondDetails {
  FHM: string; // token given as payment for bond
  FHUD: string; // FHUD
  principle: string; // token used to create bond
  treasury: string; // mints FHM when receives principle
  DAO: string; // receives profit share from bond
  fhudMinter: string; // receives profit share from bond
  terms: Terms; // stores terms for new bonds
  totalDebt: number; // total value of outstanding bonds; used for pricing
  lastDecay: number; // reference block for debt decay
  useWhitelist: boolean;
  useCircuitBreaker: boolean;
  whitelist: string[];
  soldBondsInHour: SoldBonds[];
  _bondInfo: Bond;
  usersCount: number;

  getTreasuryBalance(networkID: number): PromiseLike<any> | any | Promise<any> | any | Promise<{ valuation: number; bondQuote: any }>;
}
