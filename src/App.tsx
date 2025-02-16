import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import Home from './components/Home';
import Emergency from './components/Emergency/Emergency';
import FIRForm from './components/Emergency/FIRForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/emergency/fir" element={<FIRForm />} />
      </Routes>
    </Router>
  );
}

export default App;