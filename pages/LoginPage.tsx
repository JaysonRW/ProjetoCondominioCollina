import React, { useState } from 'react';
import { Lock, LogIn } from 'lucide-react';
import { logoBase64 } from '../assets/logo';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulating an API call
    setTimeout(() => {
      // In a real application, this would be a call to an authentication service.
      // For this example, we use a simple hardcoded password.
      if (password === 'admin') {
        onLoginSuccess();
      } else {
        setError('Senha incorreta. Tente novamente.');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-148px)] bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 space-y-6">
        <div className="text-center">
            <img src={logoBase64} alt="Logo" className="mx-auto h-16 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 font-display">Acesso Restrito</h1>
          <p className="text-gray-600">Área exclusiva para administração.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
             <label htmlFor="password" className="sr-only">Senha</label>
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-brandGreen focus:border-brandGreen"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brandGreen hover:bg-brandGreen-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brandGreen-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Entrando...' : <> <LogIn size={18} /> Entrar </>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
