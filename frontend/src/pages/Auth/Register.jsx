import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout';
import logoImg from '../../assets/Images/Logo.png';
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle, FaExclamationCircle } from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const passwordCriteria = {
    length: /^.{8,15}$/, // 8-15 characters
    lowercase: /[a-z]/,
    uppercase: /[A-Z]/,
    number: /\d/,
    specialChar: /[!@#$%^&*(),.?":{}|<>_]/,
  };

  const usernameCriteria = {
    pattern: /^[a-z0-9._]{3,15}$/,
  };

  const nameCriteria = {
    valid: (name) => {
      const parts = name.trim().split(' ');
      const nameRegex = /^[A-Za-z]+$/;
      return parts.length === 2 && nameRegex.test(parts[0]) && nameRegex.test(parts[1]);
    }
  };

  const validatePassword = (password) => {
    return {
      length: passwordCriteria.length.test(password),
      lowercase: passwordCriteria.lowercase.test(password),
      uppercase: passwordCriteria.uppercase.test(password),
      number: passwordCriteria.number.test(password),
      specialChar: passwordCriteria.specialChar.test(password),
    };
  };

  const validateUsername = (username) => usernameCriteria.pattern.test(username);
  const validateName = (name) => nameCriteria.valid(name);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const passwordValid = Object.values(validatePassword(formData.password)).every(Boolean);
    const usernameValid = validateUsername(formData.username);
    const nameValid = validateName(formData.full_name);
    const passwordsMatch = formData.password === formData.confirmPassword;

    if (!passwordValid || !usernameValid || !nameValid || !passwordsMatch) {
      setSubmitError('Please fix the errors before submitting.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (res.ok) {
        navigate('/login');
      } else {
        setSubmitError(result.message || 'Registration failed.');
      }
    } catch (err) {
      setSubmitError('Network error. Please try again.');
    }
  };

  const passwordStatus = validatePassword(formData.password);
  const usernameValid = validateUsername(formData.username);
  const nameValid = validateName(formData.full_name);
  const passwordsMatch = formData.password === formData.confirmPassword;

  const renderCheck = (isValid) => (
    isValid ? <FaCheckCircle className="text-green-500 inline" /> : <FaTimesCircle className="text-red-500 inline" />
  );

  return (
    <AuthLayout reverse={true}>
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6 space-y-2">
          <img src={logoImg} alt="Gamified Finance" className="w-32" />
          <h2 className="text-2xl font-bold">Register</h2>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className={`input ${formData.full_name ? (nameValid ? 'border-green-500' : 'border-red-500') : ''}`}
              required
            />
            {formData.full_name && !nameValid && (
              <p className="text-xs text-red-500 mt-1">First and last name required, only letters.</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          {/* Username with validation */}
          <div>
            <label className="block text-sm font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`input ${formData.username ? (usernameValid ? 'border-green-500' : 'border-red-500') : ''}`}
              required
            />
            {formData.username && !usernameValid && (
              <div className="text-xs mt-1 space-y-1">
                <p>{renderCheck(formData.username.length >= 3 && formData.username.length <= 15)} Between 3–15 characters</p>
                <p>{renderCheck(/^[a-z0-9._]+$/.test(formData.username))} Only lowercase letters, numbers, dots, underscores</p>
              </div>
            )}
          </div>

          {/* Password with checklist */}
          <div>
            <label className="block text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`input pr-10 ${formData.password ? (Object.values(passwordStatus).every(Boolean) ? 'border-green-500' : 'border-red-500') : ''}`}
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
            {formData.password && !Object.values(passwordStatus).every(Boolean) && (
              <div className="text-xs mt-1 space-y-1">
                <p>{renderCheck(passwordStatus.length)} At least 8 characters</p>
                <p>{renderCheck(passwordStatus.lowercase)} One lowercase letter</p>
                <p>{renderCheck(passwordStatus.uppercase)} One uppercase letter</p>
                <p>{renderCheck(passwordStatus.number)} One number</p>
                <p>{renderCheck(passwordStatus.specialChar)} One special character</p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`input pr-10 ${formData.confirmPassword ? (passwordsMatch ? 'border-green-500' : 'border-red-500') : ''}`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {formData.confirmPassword && (
              <p className={`text-xs mt-1 ${passwordsMatch ? 'text-green-500' : 'text-red-500'}`}>
                {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
              </p>
            )}
          </div>

          {/* Error message */}
          {submitError && (
            <div className="text-red-500 text-sm flex items-center gap-1">
              <FaExclamationCircle /> {submitError}
            </div>
          )}

          <button type="submit" className="btn-green w-full">Register</button>
        </form>

        <p className="text-sm mt-4 text-center">
          Already a member of Gamified Finance?{' '}
          <Link to="/login" className="font-semibold underline">Login</Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;
