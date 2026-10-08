import { useState } from 'react';
import { useNavigate } from 'react-router';

import { useAuth } from '../../context/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');

    const trimmedData = {
      username: formData.username.trim(),
      password: formData.password.trim(),
    };

    if (!trimmedData.username || !trimmedData.password) {
      setErrorMessage('Username and password are required.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trimmedData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message =
          typeof errorData?.detail === 'string' && errorData.detail.length > 0
            ? errorData.detail
            : 'Unable to log in.';

        setErrorMessage(message);
        return;
      }

      const result = await response.json();
      loginUser(result);
      setFormData({ username: '', password: '' });
      setErrorMessage('');
      navigate('/account');
    } catch (error) {
      console.error(error);
      setErrorMessage('Unable to connect to the API.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-body">
      <div className="mx-auto max-w-xl rounded-[32px] border border-blue-200 bg-white/80 p-6 shadow-sm">
        <h1 className="mb-6">Login</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-slate-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={formData.username}
              onChange={(event) => handleChange('username', event.target.value)}
              className="w-full rounded-full border border-slate-300 bg-white px-4 py-2.5 outline-none transition focus:border-blue-500"
              placeholder="jdoe"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(event) => handleChange('password', event.target.value)}
              className="w-full rounded-full border border-slate-300 bg-white px-4 py-2.5 outline-none transition focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          {errorMessage && <p className="text-sm font-medium text-red-600">{errorMessage}</p>}

          <button type="submit" className="default-button px-8 py-2.5" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;