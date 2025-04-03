
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      if (!email || !password) {
        setError('Please fill in all fields');
        return;
      }
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const success = login(email, password);
      
      if (success) {
        navigate('/');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Demo account shortcuts
  const loginAsDemoUser = async (userType) => {
    setIsLoading(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (userType === 'john') {
        login('john@example.com', 'password123');
      } else {
        login('jane@example.com', 'password123');
      }
      
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 confess-card">
      <h2 className="text-2xl font-bold mb-6">Login to Confess</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1 text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={isLoading}
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block mb-1 text-sm font-medium">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            disabled={isLoading}
            required
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full confess-gradient" 
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
      
      <div className="my-6 flex items-center">
        <div className="flex-grow h-px bg-gray-300 dark:bg-gray-700"></div>
        <span className="px-3 text-sm text-gray-500 dark:text-gray-400">or use demo account</span>
        <div className="flex-grow h-px bg-gray-300 dark:bg-gray-700"></div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={() => loginAsDemoUser('john')}
          variant="outline"
          disabled={isLoading}
          className="border-confess-orange hover:bg-confess-orange/5"
        >
          Login as John
        </Button>
        <Button
          onClick={() => loginAsDemoUser('jane')}
          variant="outline"
          disabled={isLoading}
          className="border-confess-pink hover:bg-confess-pink/5"
        >
          Login as Jane
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
