import { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [auth, setAuth] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    attemptToLogInWithToken();
  }, []);

  const onInputChange = (event) => {
    event.target.name === 'username' ? 
      setUsername(event.target.value) : 
      setPassword(event.target.value); 
  }

  const logout = () => {
    localStorage.removeItem('token');
    setAuth({});
  }

  const logIn = async(event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post('/authenticate', {
        username,
        password
      });
      console.log(data);
      localStorage.setItem('token', data.token);
      attemptToLogInWithToken();
    } catch(err) {
      setErrorMessage('Bad Credentials');
    }
  }

  const attemptToLogInWithToken = async() => {
    const token = localStorage.getItem('token');
    if(token) {
      const response = await axios.get('/authenticate', {
        headers: {
          authorization: token
        }
      });
      setAuth(response.data);
    }
  }

  return (
    <>
      
      {
        auth.username ? 
          <>
            <h1>Welcome { auth.username }</h1>
            <button onClick={ logout }>Log Out</button>
          </>
          : 
          <>
            { errorMessage }
            <form onSubmit={ logIn }>
              <input 
                placeholder='username' 
                name='username' 
                onChange={ onInputChange } 
                value={ username }
              />

              <input 
                placeholder='password' 
                name='password' 
                onChange={ onInputChange } 
                value={ password } 
              />
              <button>Log In</button>
            </form>
          </>
          
      }

    </>
  
  )
}

export default App