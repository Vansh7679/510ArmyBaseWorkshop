import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Request from './pages/Request';
import Videos from './pages/Videos';

import './styles/App.css';


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/videos" element={<Videos />} />
        <Route path="/" element={<Home />} />
        <Route path="/request" element={<Request />} />
      </Routes>
    </>
  );
}

export default App;
