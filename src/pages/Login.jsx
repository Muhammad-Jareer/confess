
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import LoginForm from '@/components/LoginForm';

const Login = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <Layout>
      <div className="max-w-md mx-auto py-8">
        <LoginForm />
        
        <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link 
            to="/signup" 
            className="text-confess-orange dark:text-confess-pink hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </Layout>
  );
};

export default Login;
