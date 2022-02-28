import { render } from '@testing-library/react';

import Web3Context from './web3-context';

describe('Web3Context', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Web3Context />);
    expect(baseElement).toBeTruthy();
  });
});
