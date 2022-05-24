import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { render, screen, fireEvent} from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import LinearAlgebra from './Course/LinearAlgebra/LinearAlgebra';
import RootEquation from './Course/RootOfEquation/RootEquation';
import { wait } from '@testing-library/user-event/dist/utils';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

it('can renders home', () => {
  render(<App />);
  expect(screen.getByText('Numerical Method')).toBeInTheDocument();
});

it('can render RootEquation component', () => {
  render(<RootEquation />);
  expect(screen.getByText('This is Root Equation')).toBeInTheDocument();
});

test('user can select method in RootEquation', () => {
  render(<RootEquation />);
  fireEvent.change(screen.getByTestId("select-method"), {
    target: { value: "bisection" },
  });

  expect(screen.getByText('Method is bisection')).toBeInTheDocument();
});

test('user can submit custom equation in RootEquation',async () => {
  render(<RootEquation />);
  fireEvent.change(screen.getByTestId("select-method"), {
    target: { value: "bisection" },
  });

  fireEvent.change(screen.getByTestId("select-problem"), {
    target: { value: "Custom" },
  });

  fireEvent.change(screen.getByTestId("equation-input"), {
    target: { value: "x^4-13" },
  });

  fireEvent.change(screen.getByTestId("left-input"), {
    target: { value: "1.5" },
  });

  fireEvent.change(screen.getByTestId("left-input"), {
    target: { value: "2" },
  });
  
  fireEvent.click(screen.getByText(/SUBMIT/i));

  await wait(() => {
    expect(screen.getByText('1.8988289833068848')).toBeInTheDocument();
  }) 
})
