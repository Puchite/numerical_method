import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { render, screen, fireEvent, waitFor, within, getByText, cleanup} from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import LinearAlgebra from './Course/LinearAlgebra/LinearAlgebra';
import RootEquation from './Course/RootOfEquation/RootEquation';
import { wait } from '@testing-library/user-event/dist/utils';
import Polation from './Course/Polation/Polation';
import { Simulate } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import Course from './pages/Course';
import LinearRegression from './Course/LinearRegression/LinearRegression';

test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

test('can renders home page', () => {
  render(<App />);
  expect(screen.getByText('Numerical Method')).toBeInTheDocument();
});

//Root of Equation
test('can render Root of Equation contect', async () => {
  render(<RootEquation/>);
  // fireEvent.click(screen.getByText('View Root Of Equation Content'));

  await waitFor(() => {
    expect(screen.getByText('This is Root Equation')).toBeInTheDocument();
  })

  
});

test('user can select method in Root of Equation', async () => {
  render(<RootEquation />);
  
  fireEvent.change(screen.getByTestId("select-method"), {
    target: { value: "bisection" },
  });

  await waitFor(() => {
    expect(screen.getByTestId("select-method").value).toEqual("bisection");
  });
});

test('user can calculate custom equation in Root of Equation',async () => {
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
    target: { value: "2.0" },
  });

  fireEvent.click(screen.getByText(/SUBMIT/i));

  await waitFor(()=>{
    expect(screen.getByText('[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]')).toBeInTheDocument();
  });

});

//Linear Algebra
test('can render Linear Algebra contect', async () => {
  render(<LinearAlgebra/>);
  // fireEvent.click(screen.getByText("View Linear Algebra Content"));

  await waitFor(() => {
    expect(screen.getByText('This is Linear Algebra')).toBeInTheDocument();
  });
  
});

test('user can select method in Linear Algebra', async () => {
  render(<LinearAlgebra />);
  
  fireEvent.change(screen.getByTestId("select-method"), {
    target: { value: "gaussElimination" },
  });

  await waitFor(() => {
    expect(screen.getByTestId("select-method").value).toEqual("gaussElimination");
  })
  
});

test('user can input custom matrix',async () => {
  render(<LinearAlgebra />);
  fireEvent.change(screen.getByTestId("select-method"), {
    target: { value: "cramerRule" },
  });

  fireEvent.change(screen.getByTestId("select-problem"), {
    target: { value: "Custom" },
  });

  fireEvent.change(screen.getByTestId("row-input"), {
    target: { value: "4" },
  });

  fireEvent.change(screen.getByTestId("column-input"), {
    target: { value: "4" },
  });
  
  fireEvent.click(screen.getByText(/CLEAR MATRIX/i));

  await waitFor(()=>{
    expect(screen.getByText('[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]')).toBeInTheDocument();
  });

});

test('user can calculate custom matrix',async () => {
  render(<LinearAlgebra />);

  fireEvent.change(screen.getByTestId("select-method"), {
    target: { value: "cramerRule" },
  });

  fireEvent.change(screen.getByTestId("select-problem"), {
    target: { value: "0" },
  });
  
  expect(screen.getByText('[[-2, 3, 1],[3, 4, -5],[1, -2, 1]]')).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByTestId("select-problem").value).toEqual("test");
  })

  fireEvent.click(screen.getByText(/SUBMIT/i));

  await waitFor(()=>{
    expect(screen.getByText('[-1,2,1]')).toBeInTheDocument();
  });

});

//Polation
test('can render Polation contect', async () => {
  render(<Polation/>);
  // fireEvent.click(screen.getByText("View Linear Algebra Content"));

  await waitFor(() => {
    expect(screen.getByText('This is Polation Course')).toBeInTheDocument();
  });
  
});

//Linear Regression
test('can render Regression contect', async () => {
  render(<LinearRegression/>);
  // fireEvent.click(screen.getByText("View Linear Algebra Content"));

  await waitFor(() => {
    expect(screen.getByText('This is Linear Regression')).toBeInTheDocument();
  });
  
});


