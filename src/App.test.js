import React from 'react';
import ReactDOM from 'react-dom';
import {Router} from 'react-router-dom';
import { BrowserRouter} from "react-router-dom";
import {createMemoryHistory} from 'history'
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
import axios from 'axios';


test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

test('api is active', async () =>{
  await axios.post('https://numerical-react-api.herokuapp.com/login', {
        email: "s6204062616316@email.kmutnb.ac.th",
        password: "0859150757"
    }).then((res) => {
      expect(res).toBeDefined();
    })
})

test('can renders home page', () => {
  render(<App />);
  expect(screen.getByText('Numerical Method')).toBeInTheDocument();
});

//Root of Equation
test('can render Root of Equation contect', async () => {

  render(<App/>);

  await new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 3000);
  });
  
  fireEvent.click(screen.queryByText('View Root Of Equation Content'));
  // fireEvent.click(screen.getByText('View Root Of Equation Content'));

  await waitFor(() => {
    expect(screen.getByText('This is Root Equation')).toBeInTheDocument();
  },setTimeout(5000));

},60000);

test('can get problem for Root Equation from api', async () => {


  render(<RootEquation/>);

  await new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 3000);
  });
 
  let token = {}
  await axios.post('https://numerical-react-api.herokuapp.com/login', {
    email: "s6204062616316@email.kmutnb.ac.th",
    password: "0859150757"
  }).then((res) => {
    token = res.data;
  })

  await axios.get('https://numerical-react-api.herokuapp.com/root-equation', {
            headers: {
                "Authorization": `Bearer ${token.accessToken}`
            }
        }).then((responseFromAapi) => {
            expect(responseFromAapi).toBeDefined();
    
        })

},60000);

test('user can select method in Root of Equation', async () => {

  render(<RootEquation />);
  
  await new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 3000);
  });

  fireEvent.change(screen.getByTestId("select-method"), {
    target: { value: "bisection" },
  });

  await waitFor(() => {
    expect(screen.getByTestId("select-method").value).toEqual("bisection");
  },setTimeout(5000));

},60000);

test('user can calculate custom equation in Root of Equation',async () => {

  render(<RootEquation />);

  await new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 3000);
  });

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

  fireEvent.change(screen.getByTestId("right-input"), {
    target: { value: "2.0" },
  });

  fireEvent.click(screen.getByText(/SUBMIT/i));

  await waitFor(()=>{
    expect(screen.getByText('1.8988289833068848')).toBeInTheDocument();
  },setTimeout(50000));

},60000);

//Linear Algebra
test('can render Linear Algebra content', async () => {

  render(<LinearAlgebra />);

  await new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 3000);
  });

  await waitFor(() => {
    expect(screen.getByText('This is Linear Algebra')).toBeInTheDocument();
  },setTimeout(5000));
  
},60000);

test('can get problem for Linear Algebra from api', async () => {

  render(<LinearAlgebra/>);

  await new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 3000);
  });
 
  let token = {}
  await axios.post('https://numerical-react-api.herokuapp.com/login', {
    email: "s6204062616316@email.kmutnb.ac.th",
    password: "0859150757"
  }).then((res) => {
    token = res.data;
  })

  await axios.get('https://numerical-react-api.herokuapp.com/linear', {
            headers: {
                "Authorization": `Bearer ${token.accessToken}`
            }
        }).then((responseFromAapi) => {
            expect(responseFromAapi).toBeDefined();
    
        })

},60000);

test('user can select method in Linear Algebra', async () => {

  render(<LinearAlgebra />);
  
  await new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 3000);
  });

  fireEvent.change(screen.getByTestId("select-method"), {
    target: { value: "gaussElimination" },
  });

  await waitFor(() => {
    expect(screen.getByTestId("select-method").value).toEqual("gaussElimination");
  },setTimeout(5000))
  
},60000);

test('user can input custom matrix',async () => {

  render(<LinearAlgebra />);

  await new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 3000);
  });

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
  },setTimeout(5000));

},60000);

//Polation
test('can render Polation contect', async () => {

  render(<Polation/>);

  await new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 3000);
  });

  await waitFor(() => {
    expect(screen.getByText('This is Polation Course')).toBeInTheDocument();
  },setTimeout(5000));
  
},60000);


test('can get problem for Polation from api', async () => {

  render(<Polation/>);

  await new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 3000);
  });
 
  let token = {}
  await axios.post('https://numerical-react-api.herokuapp.com/login', {
    email: "s6204062616316@email.kmutnb.ac.th",
    password: "0859150757"
  }).then((res) => {
    token = res.data;
  })

  await axios.get('https://numerical-react-api.herokuapp.com/polation', {
            headers: {
                "Authorization": `Bearer ${token.accessToken}`
            }
        }).then((responseFromAapi) => {
            expect(responseFromAapi).toBeDefined();
    
        })

},60000);

test('user can select method in Polation', async () => {

  render(<Polation />);
  
  await new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 3000);
  });

  fireEvent.change(screen.getByTestId("select-method"), {
    target: { value: "lagrange" },
  });

  await waitFor(() => {
    expect(screen.getByTestId("select-method").value).toEqual("lagrange");
  },setTimeout(5000))
  
},60000);

//Linear Regression
test('can render Regression contect', async () => {

  render(<LinearRegression/>)
  
  await new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 3000);
  });

  // fireEvent.click(screen.getByText("View Linear Algebra Content"));

  await waitFor(() => {
    expect(screen.getByText('This is Linear Regression')).toBeInTheDocument();
  },setTimeout(5000));
  
},60000);

test('user can select method in Linear Regression', async () => {

  render(<LinearRegression />);
  
  await new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 3000);
  });

  fireEvent.change(screen.getByTestId("select-method"), {
    target: { value: "polynomial" },
  });

  await waitFor(() => {
    expect(screen.getByTestId("select-method").value).toEqual("polynomial");
  },setTimeout(5000))
  
},60000);

// test('user can input number of x and y in Polation', async () => {

//   render(<Polation />);
  
//   await new Promise(resolve => {
//     setTimeout(() => {
//       resolve();
//     }, 3000);
//   });

//   fireEvent.change(screen.getByTestId("select-method"), {
//     target: { value: "polynomial" },
//   });

//   fireEvent.change(screen.getByTestId("select-problem"), {
//     target: { value: "Custom" },
//   });

//   fireEvent.change(screen.getByTestId("x-input"), {
//     target: { value: "7" },
//   });

//   await waitFor(() => {
//     expect(screen.getByText("Number of X and Y is 7")).toBeInTheDocument();
//   },setTimeout(5000))
  
// },60000);


