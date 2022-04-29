import { render } from "@testing-library/react";

import BorrowerAssetDetailsPage from "./borrower-asset-details-page";

describe("BorrowerAssetDetailsPage", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<BorrowerAssetDetailsPage />);
    expect(baseElement).toBeTruthy();
  });
});
