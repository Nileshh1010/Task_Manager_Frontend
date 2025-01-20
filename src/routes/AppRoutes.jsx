import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import TaskList from '../pages/TaskList';


const AppRoutes = () => {
  return (
    <Routes>
  <Route path="/" element={<Signup />} />  {/* This now loads the Signup page */}
  <Route path="/login" element={<Login />} />  {/* You can also add a separate login page */}
  <Route path="/tasks" element={<TaskList />} />
</Routes>
  );
};

export default AppRoutes;
