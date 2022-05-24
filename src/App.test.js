import { render, screen } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

describe("<App />", () => {
 
  test('pass equation', () => {
    render(<App />);
 
    const inputEl = screen.getByTestId("equation");
    userEvent.type(inputEl, "x^4-13");
 
    expect(screen.getByTestId("equation")).toHaveValue("x^4-13");
    expect(screen.getByTestId("answer")).toBeInTheDocument();
    expect(screen.queryByTestId("answer").textContent).toEqual("1.898829");
  });
 
});