
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8 mt-auto">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl confess-gradient bg-clip-text text-transparent">
                Confess
              </span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Share your thoughts anonymously
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-12">
            <div>
              <h3 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">Navigation</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link 
                    to="/"
                    className="text-gray-500 dark:text-gray-400 hover:text-confess-orange dark:hover:text-confess-pink"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/new"
                    className="text-gray-500 dark:text-gray-400 hover:text-confess-orange dark:hover:text-confess-pink"
                  >
                    New Thread
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">Account</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link 
                    to="/login"
                    className="text-gray-500 dark:text-gray-400 hover:text-confess-orange dark:hover:text-confess-pink"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/signup"
                    className="text-gray-500 dark:text-gray-400 hover:text-confess-orange dark:hover:text-confess-pink"
                  >
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Confess. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
