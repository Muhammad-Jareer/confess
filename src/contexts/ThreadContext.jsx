
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/use-toast';

const ThreadContext = createContext();

// Generate mock data
const generateMockThreads = () => {
  const threads = [
    {
      id: 1,
      title: "Welcome to Confess!",
      content: "This is a place where you can share your thoughts anonymously.",
      userId: 1,
      username: "johndoe",
      avatar: "1",
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      votes: 15,
      commentCount: 2
    },
    {
      id: 2,
      title: "How to use this forum effectively",
      content: "Follow these guidelines to get the most out of this community...",
      userId: 2,
      username: "janedoe",
      avatar: "2",
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      votes: 8,
      commentCount: 3
    },
    {
      id: 3,
      title: "Introducing myself to the community",
      content: "Hello everyone! I'm new here and excited to join this community. Looking forward to engaging in meaningful discussions!",
      userId: 1,
      username: "johndoe",
      avatar: "1",
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      votes: 4,
      commentCount: 2
    },
    {
      id: 4,
      title: "What is your biggest fear?",
      content: "This is a safe space to share what keeps you up at night. Sometimes sharing helps to overcome our fears.",
      userId: 2,
      username: "janedoe",
      avatar: "2",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      votes: 12,
      commentCount: 5
    }
  ];
  return threads;
};

const generateMockComments = () => {
  return [
    {
      id: 1,
      threadId: 1,
      content: "Great intro! Looking forward to being part of this community.",
      userId: 2,
      username: "janedoe",
      avatar: "2",
      createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
      votes: 3
    },
    {
      id: 2,
      threadId: 1,
      content: "Thanks for creating this space!",
      userId: 1,
      username: "johndoe",
      avatar: "1",
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      votes: 2
    },
    {
      id: 3,
      threadId: 2,
      content: "These guidelines are really helpful.",
      userId: 1,
      username: "johndoe",
      avatar: "1",
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      votes: 1
    },
    {
      id: 4,
      threadId: 2,
      content: "I'd add that being respectful is key to any healthy community.",
      userId: 2,
      username: "janedoe",
      avatar: "2",
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      votes: 4
    },
    {
      id: 5,
      threadId: 2,
      content: "Completely agree with the guidelines!",
      userId: 1,
      username: "johndoe",
      avatar: "1",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      votes: 0
    },
    {
      id: 6,
      threadId: 3,
      content: "Welcome! Great to have you here.",
      userId: 2,
      username: "janedoe",
      avatar: "2",
      createdAt: new Date(Date.now() - 86400000 * 2 + 3600000).toISOString(),
      votes: 1
    },
    {
      id: 7,
      threadId: 3,
      content: "Looking forward to your contributions!",
      userId: 1,
      username: "johndoe",
      avatar: "1", 
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      votes: 0
    },
    {
      id: 8,
      threadId: 4,
      content: "My biggest fear is failing those who depend on me.",
      userId: 1,
      username: "johndoe",
      avatar: "1",
      createdAt: new Date(Date.now() - 86400000 * 1 + 7200000).toISOString(),
      votes: 3
    },
    {
      id: 9,
      threadId: 4,
      content: "I'm afraid of not living up to my potential.",
      userId: 2,
      username: "janedoe",
      avatar: "2",
      createdAt: new Date(Date.now() - 86400000 * 1 + 10800000).toISOString(),
      votes: 2
    },
    {
      id: 10,
      threadId: 4,
      content: "Heights! I can't even look out from tall buildings.",
      userId: 1,
      username: "johndoe",
      avatar: "1",
      createdAt: new Date(Date.now() - 43200000).toISOString(),
      votes: 1
    },
    {
      id: 11,
      threadId: 4,
      content: "The unknown can be pretty scary sometimes.",
      userId: 2,
      username: "janedoe",
      avatar: "2",
      createdAt: new Date(Date.now() - 21600000).toISOString(),
      votes: 1
    },
    {
      id: 12,
      threadId: 4,
      content: "I fear losing my memories as I grow older.",
      userId: 1,
      username: "johndoe",
      avatar: "1",
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      votes: 0
    }
  ];
};

export const ThreadProvider = ({ children }) => {
  const [threads, setThreads] = useState(() => {
    const savedThreads = localStorage.getItem('confess-threads');
    return savedThreads ? JSON.parse(savedThreads) : generateMockThreads();
  });
  
  const [comments, setComments] = useState(() => {
    const savedComments = localStorage.getItem('confess-comments');
    return savedComments ? JSON.parse(savedComments) : generateMockComments();
  });
  
  const { currentUser, isAuthenticated } = useAuth();

  // Persist data to localStorage
  useEffect(() => {
    localStorage.setItem('confess-threads', JSON.stringify(threads));
  }, [threads]);
  
  useEffect(() => {
    localStorage.setItem('confess-comments', JSON.stringify(comments));
  }, [comments]);

  // Thread actions
  const createThread = (title, content) => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to create threads.",
      });
      return false;
    }

    const newThread = {
      id: Date.now(),
      title,
      content,
      userId: currentUser.id,
      username: currentUser.username,
      avatar: currentUser.avatar,
      createdAt: new Date().toISOString(),
      votes: 0,
      commentCount: 0
    };

    setThreads(prev => [newThread, ...prev]);
    
    toast({
      title: "Thread created",
      description: "Your thread has been posted successfully!",
    });
    
    return true;
  };

  const voteThread = (threadId, direction) => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to vote on threads.",
      });
      return;
    }

    setThreads(prev => 
      prev.map(thread => 
        thread.id === threadId 
          ? { ...thread, votes: thread.votes + direction } 
          : thread
      )
    );
  };

  const deleteThread = (threadId) => {
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

    setThreads(prev => prev.filter(thread => thread.id !== threadId));
    
    // Also delete all associated comments
    setComments(prev => prev.filter(comment => comment.threadId !== threadId));
    
    toast({
      title: "Thread deleted",
      description: "Your thread has been deleted successfully.",
    });
    
    return true;
  };

  // Comment actions
  const createComment = (threadId, content) => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to comment.",
      });
      return false;
    }

    const newComment = {
      id: Date.now(),
      threadId,
      content,
      userId: currentUser.id,
      username: currentUser.username,
      avatar: currentUser.avatar,
      createdAt: new Date().toISOString(),
      votes: 0
    };

    setComments(prev => [...prev, newComment]);
    
    // Update comment count on thread
    setThreads(prev => 
      prev.map(thread => 
        thread.id === threadId 
          ? { ...thread, commentCount: thread.commentCount + 1 } 
          : thread
      )
    );
    
    toast({
      title: "Comment posted",
      description: "Your comment has been added successfully!",
    });
    
    return true;
  };

  const voteComment = (commentId, direction) => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to vote on comments.",
      });
      return;
    }

    setComments(prev => 
      prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, votes: comment.votes + direction } 
          : comment
      )
    );
  };

  const deleteComment = (commentId) => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to delete comments.",
      });
      return false;
    }

    const comment = comments.find(c => c.id === commentId);
    
    if (!comment || comment.userId !== currentUser.id) {
      toast({
        variant: "destructive",
        title: "Permission denied",
        description: "You can only delete your own comments.",
      });
      return false;
    }

    setComments(prev => prev.filter(comment => comment.id !== commentId));
    
    // Update comment count on thread
    setThreads(prev => 
      prev.map(thread => 
        thread.id === comment.threadId 
          ? { ...thread, commentCount: thread.commentCount - 1 } 
          : thread
      )
    );
    
    toast({
      title: "Comment deleted",
      description: "Your comment has been deleted successfully.",
    });
    
    return true;
  };

  // Filter functions
  const getThreadById = (id) => {
    return threads.find(thread => thread.id === parseInt(id) || thread.id === id);
  };
  
  const getCommentsByThreadId = (threadId) => {
    return comments.filter(comment => 
      comment.threadId === parseInt(threadId) || comment.threadId === threadId
    );
  };
  
  const getThreadsByUser = (userId) => {
    return threads.filter(thread => thread.userId === userId);
  };
  
  const getCommentsByUser = (userId) => {
    return comments.filter(comment => comment.userId === userId);
  };

  return (
    <ThreadContext.Provider value={{
      threads,
      comments,
      createThread,
      voteThread,
      deleteThread,
      createComment,
      voteComment,
      deleteComment,
      getThreadById,
      getCommentsByThreadId,
      getThreadsByUser,
      getCommentsByUser
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
