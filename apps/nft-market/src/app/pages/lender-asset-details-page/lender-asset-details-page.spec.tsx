import { render } from "@testing-library/react";

import LenderAssetDetailsPage from "./lender-asset-details-page";

describe("LenderAssetDetailsPage", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<LenderAssetDetailsPage />);
    expect(baseElement).toBeTruthy();
  });
});
