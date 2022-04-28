import { Collectible } from "@audius/fetch-nft";
import { render } from "@testing-library/react";

import BorrowerAsset from "./borrower-asset";

describe("BorrowerAsset", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<BorrowerAsset asset={{} as Collectible} />);
    expect(baseElement).toBeTruthy();
  });
});
