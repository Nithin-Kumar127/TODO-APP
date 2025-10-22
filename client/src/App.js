import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Todo from './Todo';
import Dashboard from './components/Dashboard';
import FocusTimer from './components/FocusTimer';

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className='container' style={{ textAlign: 'center', padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Todo />} />
          <Route path="/tasks" element={<Todo />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/focus" element={<FocusTimer />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;