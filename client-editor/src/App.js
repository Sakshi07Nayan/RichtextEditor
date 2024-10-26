import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './Component/Layout/header';
import Footer from './Component/Layout/Footer';
import Home from './Component/Layout/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path='/'
          element={
            <>
            <Header/>
            <Home/>
            <Footer/>
            </>
          }
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;
