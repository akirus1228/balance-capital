import { render } from "@testing-library/react";

import BorrowerAsset from "./borrower-asset";

describe("BorrowerAsset", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<BorrowerAsset />);
    expect(baseElement).toBeTruthy();
  });
});
