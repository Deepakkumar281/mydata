// App.test.tsx (or App.test.js)

import React from 'react';
import { render } from '@testing-library/react-native';
import App from './App';

describe('App Component', () => {
  it('renders a text component with the text "Haii"', () => {
    const { getByText } = render(<App />);
    const textElement = getByText('Haii');
    const textElement1 = getByText('Hello');
    expect(textElement).toBeTruthy();
    expect(textElement1).toBeTruthy();
    expect(true).toBe(true);
  });
});
