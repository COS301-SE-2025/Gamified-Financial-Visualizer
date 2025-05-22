import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout';
import logoImg from '../../assets/Images/Logo.png';

const Register = () => {
  return (
    <AuthLayout reverse={true}>
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6 space-y-2">
          <img src={logoImg} alt="Gamified Finance" className="w-32" />
          <h2 className="text-2xl font-bold">Register</h2>
        </div>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input type="text" className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="email" className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input type="password" className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium">Username</label>
            <input type="text" className="input" />
          </div>
          <button type="submit" className="btn-green">Register</button>
        </form>
        <p className="text-sm mt-4 text-center">
          Already a memeber of Gamified Finance?{' '}
          <Link to="/" className="font-semibold underline">Login</Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;
