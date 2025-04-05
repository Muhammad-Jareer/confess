import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { createUser, signIn, signOutUser, getCurrentUser } from "@/lib/appwrite"; // adjust path as needed

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On initial load: check if there's a logged-in session and fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setCurrentUser(user);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      await signIn(email, password);
      const user = await getCurrentUser();
      setCurrentUser(user);

      toast({
        title: "Login successful",
        description: `Welcome back, ${user.username}!`,
      });
      return true;
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: err.message,
      });
      return false;
    }
  };

  const signup = async (username, email, password) => {
    try {
      const user = await createUser(email, password, username);
      setCurrentUser(user);

      toast({
        title: "Signup successful",
        description: `Welcome to Confess, ${username}!`,
      });
      return true;
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: err.message,
      });
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOutUser();
      setCurrentUser(null);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: err.message,
      });
    }
  };

  const updateProfile = async (updates) => {
    // You can later implement this with Appwrite document update API
    setCurrentUser((prev) => ({ ...prev, ...updates }));
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        signup,
        logout,
        updateProfile,
        isAuthenticated: !!currentUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
