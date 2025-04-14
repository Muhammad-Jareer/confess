import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun, LogOut, Menu, X, Home, MessageSquarePlus } from "lucide-react";

const Header = () => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Shared style for non-auth navigation links
  const authLinkClasses = "text-gray-700 dark:text-gray-300 hover:text-confess-orange dark:hover:text-confess-pink font-medium";

  return (
    <header className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm z-50">
      <div className="container max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl md:text-2xl confess-gradient bg-clip-text text-transparent">
              Confess
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={authLinkClasses}>
              Home
            </Link>

            {isAuthenticated && (
              <Link to="/new" className={authLinkClasses}>
                New Thread
              </Link>
            )}

            <button
              onClick={toggleTheme}
              className="rounded-full p-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to={`/profile/${currentUser.$id}`} className="flex items-center space-x-2">
                  <div className="relative w-8 h-8 bg-confess-orange rounded-full flex items-center justify-center text-white">
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt="avatar"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-sm font-medium">
                        {currentUser.username.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {currentUser.username}
                  </span>
                </Link>
                <Button variant="ghost" size="icon" onClick={logout} aria-label="Log out">
                  <LogOut size={18} />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className={authLinkClasses}>
                  Login
                </Link>
                <Link to="/signup" className={authLinkClasses}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden rounded-md p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200 dark:border-gray-800 space-y-4">
            <Link
              to="/"
              className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home size={18} />
              <span>Home</span>
            </Link>

            {isAuthenticated && (
              <Link
                to="/new"
                className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <MessageSquarePlus size={18} />
                <span>New Thread</span>
              </Link>
            )}

            <div className="flex justify-between items-center px-4 py-2">
              <button
                onClick={() => {
                  toggleTheme();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2"
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? (
                  <>
                    <Sun size={18} />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon size={18} />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>

            {isAuthenticated ? (
              <div className="px-4 py-2 space-y-4">
                <Link
                  to={`/profile/${currentUser.$id}`}
                  className="flex items-center space-x-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="relative w-8 h-8 bg-confess-orange rounded-full flex items-center justify-center text-white">
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt="avatar"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-sm font-medium">
                        {currentUser.username.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {currentUser.username}
                  </span>
                </Link>
                <button
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut size={18} />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3 px-4 py-2">
                <Link
                  to="/login"
                  className="confess-btn-secondary text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="confess-btn-secondary text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
