import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout';
import logoImg from '../../assets/Images/Logo.png';
import { FaEye, FaEyeSlash,FaExclamationCircle } from 'react-icons/fa';

import  {useThemeLoader, applyThemeFromPreferences }  from '../ThemeLoader.mjs';
const BASE_URL = "http://localhost:5000";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (res.ok) {
        const username = result.data.user.username;

        const idRes = await fetch(`${BASE_URL}/api/auth/user-id/${username}`);
        const idResult = await idRes.json();

        if (idRes.ok && idResult.data?.user_id) {
          const userId = idResult.data.user_id;
          const token = result.data.token;
          const tier = result.data.user.tier_status;
          localStorage.setItem('user', JSON.stringify({ username, id: userId ,
            token: token,
            tier: tier
          }));
          applyThemeFromPreferences(userId, token);
          // remove gameId from localStorage on login
          localStorage.removeItem('gameId');
          localStorage.removeItem('lobbyId')
          navigate('/dashboard', { state: { userId } });
        } else {
          setError('Could not retrieve user ID after login.');
        }
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    }
  };

  return (
    <AuthLayout reverse={false}>
      <div className="w-full max-w-lg lg:max-w-md">
        <div className="flex flex-col items-center mb-6 space-y-2">
          <img src={logoImg} alt="Gamified Finance" className="w-32" />
          <h2 className="text-2xl font-bold text-[#83AB55]">Login</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          {error && (
            <div className="text-red-500 text-sm flex items-center gap-1">
              <FaExclamationCircle /> {error}
            </div>
          )}
          <button type="submit" className="btn-green w-full">Login</button>
        </form>

        <p className="text-sm mt-4 text-center">
          New to Gamified Finance?{' '}
          <Link to="/register" className="font-semibold underline text-[#88BC46]">Sign Up</Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;