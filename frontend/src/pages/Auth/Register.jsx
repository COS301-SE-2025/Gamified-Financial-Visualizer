import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout';
import logoImg from '../../assets/Images/Logo.png';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    username: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (res.ok) {
        console.log('Registration successful:', result);
        navigate('/login');
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <AuthLayout reverse={true}>
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6 space-y-2">
          <img src={logoImg} alt="Gamified Finance" className="w-32" />
          <h2 className="text-2xl font-bold">Register</h2>
        </div>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} className="input" required />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="input" required />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="input" required />
          </div>
          <div>
            <label className="block text-sm font-medium">Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} className="input" required />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="btn-green">Register</button>
        </form>
        <p className="text-sm mt-4 text-center">
          Already a member of Gamified Finance?{' '}
          <Link to="/" className="font-semibold underline">Login</Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;