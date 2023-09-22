import React, { useState, useContext } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoginContext } from '../context/LoginContext';

const Login = () => {
  const { setUserLogin } = useContext(LoginContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); 

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const userData = {
      email,
      password,
    };

    try {
      const response = await fetch('https://socialapi-dr9x.onrender.com/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        const { token, user } = data;

        toast.success('Login successful!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
        });

        localStorage.setItem('jwt', token);
        localStorage.setItem('user', JSON.stringify(user));

        setUserLogin(true);
        navigate('/');
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      console.error(error);
      toast.error('Invalid email or password. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
      });
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-md-12'>
            <div className='login'>
              <h3>SocialMedia</h3>
              <form onSubmit={handleSubmit}>
                <input
                  type='text'
                  placeholder='Enter Email Address'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                /><br />
                <input
                  type='password'
                  placeholder='Enter Password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                /><br />
                <button
                  type='submit'
                  id='submit'
                  disabled={isLoading} 
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
              </form>
              <hr />
              <p>If you have no account? <Link to='/register'>Register Here</Link> </p><br />
              <p>or</p><br />
              <p><Link to="/forgotpassword" >Forgot Password</Link></p>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Login;
