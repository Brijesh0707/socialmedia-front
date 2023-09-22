import React, { createContext, useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import Forgot from './pages/Forgot';
import Createpost from './pages/Createpost';
import { LoginContext } from './context/LoginContext';
import Profile from './pages/Profile';


const App = () => {
  const [userLogin, setUserLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      setUserLogin(true);
    } else {
      setUserLogin(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setUserLogin(false);
    navigate('/login');
  };

  return (
    <>
      <LoginContext.Provider value={{ setUserLogin }}>
        <Navbar login={userLogin} onLogout={handleLogout} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgotpassword' element={<Forgot />} />
          <Route path='/myprofile' element={<Profile />} />



      
          <Route path='/createpost' element={<Createpost />} />
         

        </Routes>
      </LoginContext.Provider>
    </>
  );
};

export default App;
