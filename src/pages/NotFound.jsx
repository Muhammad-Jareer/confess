
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-16">
        <h1 className="text-8xl font-bold confess-gradient bg-clip-text text-transparent mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-6">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md text-center mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="confess-gradient">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </Layout>
  );
};

export default NotFound;
