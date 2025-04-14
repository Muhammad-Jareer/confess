import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/use-toast';
import { createThread as apiCreateThread, fetchAllThreads, fetchThreadById, voteThread as apiVoteThread } from '@/lib/appwrite';

const ThreadContext = createContext();

export const ThreadProvider = ({ children }) => {
  const [threads, setThreads] = useState([]);
  const { currentUser, isAuthenticated } = useAuth();

  useEffect(() => {
    const loadThreads = async () => {
      try {
        const allThreads = await fetchAllThreads();
        setThreads(allThreads);
      } catch (error) {
        console.error("Error fetching threads:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "There was an issue loading the threads.",
        });
      }
    };

    loadThreads();
  }, []);

  const createThread = async (title, description, isAnonymous, category) => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to create threads.",
      });
      return false;
    }

    try {
      const newThread = await apiCreateThread(title, description, isAnonymous, category);
      setThreads(prev => [newThread, ...prev]);
      toast({
        title: "Thread created",
        description: "Your thread has been posted successfully!",
      });
      return true;
    } catch (error) {
      console.error("Error creating thread:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an issue creating your thread.",
      });
      return false;
    }
  };

  const voteThread = async (threadId, direction) => {
    if (!isAuthenticated) {
      console.log("[voteThread] User not authenticated");
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to vote on threads.",
      });
      return;
    }
  
    try {
      console.log(`[voteThread] Voting on thread: ${threadId}, direction: ${direction}`);
      
      const { score, voteAction } = await apiVoteThread(threadId, direction);
      console.log(`[voteThread] Vote result: action=${voteAction}, new score=${score}`);
  
      const updatedThreads = threads.map(thread =>
        thread.$id === threadId ? { ...thread, likes: score } : thread
      );
      setThreads(updatedThreads);
  
      console.log("[voteThread] Local threads updated");
  
      toast({
        title: "Vote registered",
        description: voteAction === "removed"
          ? "Your vote has been removed."
          : `You ${voteAction} your vote.`,
      });
    } catch (error) {
      console.error("[voteThread] Vote failed:", error);
      toast({
        variant: "destructive",
        title: "Voting error",
        description: "Something went wrong while voting on the thread.",
      });
    }
  };
  
  

  const deleteThread = async (threadId) => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to delete threads.",
      });
      return false;
    }

    const thread = threads.find(t => t.id === threadId);
    if (!thread || thread.userId !== currentUser.id) {
      toast({
        variant: "destructive",
        title: "Permission denied",
        description: "You can only delete your own threads.",
      });
      return false;
    }

    try {
      setThreads(prev => prev.filter(thread => thread.id !== threadId));
      toast({
        title: "Thread deleted",
        description: "Your thread has been deleted successfully.",
      });
      return true;
    } catch (error) {
      console.error("Error deleting thread:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an issue deleting your thread.",
      });
      return false;
    }
  };

  const getThreadById = async (threadId) => {
    try {
      const thread = await fetchThreadById(threadId);
      return thread;
    } catch (error) {
      console.error('[ThreadContext] fetchThreadById error:', error);
      throw error;   
    }
  };

  return (
    <ThreadContext.Provider value={{
      threads,
      createThread,
      voteThread,
      deleteThread,
      getThreadById,
    }}>
      {children}
    </ThreadContext.Provider>
  );
};

export const useThread = () => {
  const context = useContext(ThreadContext);
  if (context === undefined) {
    throw new Error('useThread must be used within a ThreadProvider');
  }
  return context;
};
