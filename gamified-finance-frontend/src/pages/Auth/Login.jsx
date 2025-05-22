import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout';
import logoImg from '../../assets/Images/Logo.png';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
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
            <input type="text" className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input type="password" className="input" />
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember" className="text-sm">Remember password</label>
          </div>
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
