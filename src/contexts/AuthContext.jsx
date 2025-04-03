
import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

const AuthContext = createContext();

// Mock user data
const mockUsers = [
  { id: 1, username: 'johndoe', email: 'john@example.com', password: 'password123', bio: 'Just a regular user', avatar: '1' },
  { id: 2, username: 'janedoe', email: 'jane@example.com', password: 'password123', bio: 'Love to share thoughts', avatar: '2' },
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('confess-user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Store user in localStorage when it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('confess-user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('confess-user');
    }
  }, [currentUser]);

  const login = (email, password) => {
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Create a copy without the password
      const { password, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.username}!`,
      });
      return true;
    } else {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
      });
      return false;
    }
  };

  const signup = (username, email, password) => {
    if (mockUsers.some(u => u.email === email)) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: "Email already exists. Please use another email.",
      });
      return false;
    }

    // Create new user
    const newUser = { 
      id: mockUsers.length + 1, 
      username, 
      email, 
      password,
      bio: `Hi, I'm ${username}!`,
      avatar: Math.ceil(Math.random() * 5).toString()
    };
    
    mockUsers.push(newUser);
    
    // Set current user (without password)
    const { password: _, ...userWithoutPassword } = newUser;
    setCurrentUser(userWithoutPassword);
    
    toast({
      title: "Signup successful",
      description: `Welcome to Confess, ${username}!`,
    });
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  const updateProfile = (updates) => {
    setCurrentUser(prev => ({
      ...prev,
      ...updates
    }));
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
    
    // Also update in our mock data
    const userIndex = mockUsers.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
      mockUsers[userIndex] = { 
        ...mockUsers[userIndex],
        ...updates
      };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      login, 
      signup, 
      logout, 
      updateProfile,
      isAuthenticated: !!currentUser,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
