import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Forgot = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); 

    try {
      const response = await fetch('https://socialapi-dr9x.onrender.com/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        navigate('/login');
      } else {
        const errorData = await response.json();
        setMessage(errorData.error);
      }
    } catch (error) {
      console.error(error);
      setMessage('An error occurred while updating your password');
    } finally {
      setIsLoading(false); 
    }
  };

  return (
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
              />{' '}
              <br />{' '}
              {isLoading ? ( 
                <div className='loading-spinner'></div>
              ) : (
                <input
                  type='password'
                  placeholder='Enter New Password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              )}
              <br />
              <button
                type='submit'
                id='submit'
                disabled={isLoading} 
              >
                {isLoading ? 'Loading...' : 'Update Password'}
              </button>
            </form>

            {message && <p>{message}</p>}
            <hr />
            <p>
              If you have no account? <Link to='/register'>Register Here</Link>{' '}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forgot;
