import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout';
import logoImg from '../../assets/Images/Logo.png';
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';

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
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (res.ok) {
        const username = result.data.user.username;

        const idRes = await fetch(`http://localhost:5000/api/auth/user-id/${username}`);
        const idResult = await idRes.json();

        if (idRes.ok && idResult.data?.user_id) {
          const userId = idResult.data.user_id;
          localStorage.setItem('user', JSON.stringify({ username, id: userId }));
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
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6 space-y-2">
          <img src={logoImg} alt="Gamified Finance" className="w-32" />
          <h2 className="text-2xl font-bold">Login</h2>
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
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="btn-green">Login</button>
        </form>
        <p className="text-sm mt-4 text-center">
          New to Gamified Finance?{' '}
          <Link to="/register" className="font-semibold underline">Sign Up</Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
