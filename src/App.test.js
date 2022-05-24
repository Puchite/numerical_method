import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import {BrowserRouter as Router} from 'react-router-dom';
import App from './App';
import axios from "axios"


test('Is All Data Loaded', async () => {
  render(
    <Router>
      <App />
    </Router>
  );
  await waitFor(()=>{expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument()})
  expect(screen.getByTestId("ShowData")).toBeInTheDocument();
});