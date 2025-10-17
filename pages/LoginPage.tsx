import React, { useState } from 'react';
import { LogIn, AlertCircle } from 'lucide-react';
import { logoBase64 } from '../assets/logo';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulating an API call
    setTimeout(() => {
      if (email === 'admin@collinabelvedere.com' && password === 'admin123') {
        onLoginSuccess();
      } else {
        setError('E-mail ou senha inválidos. Tente novamente.');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-148px)] flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #3E594D 0%, #A3C168 100%)'}}>
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 space-y-6 animate-fade-in">
        <div className="text-center">
            <img src={logoBase64} alt="Collina Belvedere Logo" className="h-20 w-auto mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-brandGreen-dark font-display">Área Administrativa</h1>
            <p className="text-gray-600 mt-1">Portal de Gerenciamento</p>
        </div>

        {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-center" role="alert">
                <AlertCircle className="h-5 w-5 mr-3"/>
                <p>{error}</p>
            </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brandGreen focus:border-brandGreen"
              placeholder="admin@collinabelvedere.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brandGreen focus:border-brandGreen"
              placeholder="••••••••"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brandLime hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brandGreen-dark disabled:bg-gray-400 transition-all transform hover:scale-105"
            >
              {isLoading ? 'Entrando...' : (
                <>
                  <LogIn size={20} />
                  Entrar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
       <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
