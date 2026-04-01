import { render, screen } from '@testing-library/react';
import App from './App';

test('renders dashboard overview', () => {
  render(<App />);
  const linkElement = screen.getByText(/Overview/i);
  expect(linkElement).toBeInTheDocument();
});
