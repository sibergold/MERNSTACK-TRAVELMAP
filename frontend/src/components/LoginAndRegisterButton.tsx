import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../css/loginregister.css';

const LoginAndRegisterButtons: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        login(data.token);
        navigate('/');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.log(error);
    }
  };

  const handleSubmitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        navigate('/login');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.log(error);
    }
  };

  return (
    <div className="button-containers">
      <button className="register-btn" onClick={() => setIsRegisterModalOpen(true)}>
        Register
      </button>
      <button className="login-btn" onClick={() => setIsLoginModalOpen(true)}>
        Login
      </button>

      {/* Register Modal */}
      {isRegisterModalOpen && (
        <div className="modal-overlay">
        <div className="modal-content">
          <h2>Register</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmitRegister}>
            <div className="mb-6">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="******************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="button-container">
              <button className="register-btn" type="submit">
                Register
              </button>
              <button className="cancel-btn" type="button" onClick={() => setIsRegisterModalOpen(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      
      )}

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Login</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmitLogin}>
              <div className="mb-6">
                <label className="block text-gray-800 text-md font-semibold mb-3" htmlFor="email">
                  Email
                </label>
                <input
                  className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-800 text-md font-semibold mb-3" htmlFor="password">
                  Password
                </label>
                <input
                  className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-800 mb-4 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  placeholder="******************"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="button-container">
              <button className="register-btn" type="submit">
                Login
              </button>
              <button className="cancel-btn" type="button" onClick={() => setIsLoginModalOpen(false)}>
                Cancel
              </button>
              </div>
            </form>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginAndRegisterButtons;
