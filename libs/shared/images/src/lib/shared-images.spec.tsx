import { render } from '@testing-library/react';

import SharedImages from './shared-images';

describe('SharedImages', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SharedImages />);
    expect(baseElement).toBeTruthy();
  });
});
