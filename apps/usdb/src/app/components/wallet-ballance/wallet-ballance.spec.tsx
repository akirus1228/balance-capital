import { render } from '@testing-library/react';

import WalletBallance from './wallet-ballance';

describe('WalletBallance', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<WalletBallance />);
    expect(baseElement).toBeTruthy();
  });
});
