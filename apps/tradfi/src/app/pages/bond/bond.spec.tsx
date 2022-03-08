import { render } from '@testing-library/react';

import Bond from './bond';

describe('Bond', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Bond bondType="string" />);
    expect(baseElement).toBeTruthy();
  });
});
