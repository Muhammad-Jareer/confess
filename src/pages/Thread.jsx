
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useThread } from '@/contexts/ThreadContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import CommentCard from '@/components/CommentCard';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowUpCircle, ArrowDownCircle, ArrowLeft, MessageSquare } from 'lucide-react';

const Thread = () => {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const { 
    getThreadById, 
    getCommentsByThreadId, 
    voteThread,
    createComment
  } = useThread();
  const { isAuthenticated, currentUser } = useAuth();
  
  const [thread, setThread] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchedThread = getThreadById(threadId);
    
    if (!fetchedThread) {
      navigate('/not-found');
      return;
    }
    
    setThread(fetchedThread);
    setComments(getCommentsByThreadId(threadId));
  }, [threadId, getThreadById, getCommentsByThreadId, navigate]);
  
  const handleUpvote = () => {
    voteThread(thread.id, 1);
    setThread(prevThread => ({
      ...prevThread,
      votes: prevThread.votes + 1
    }));
  };
  
  const handleDownvote = () => {
    voteThread(thread.id, -1);
    setThread(prevThread => ({
      ...prevThread,
      votes: prevThread.votes - 1
    }));
  };
  
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const success = createComment(thread.id, commentText.trim());
      
      if (success) {
        setCommentText('');
        // Update comments list
        setComments(getCommentsByThreadId(threadId));
        // Update thread
        setThread(prevThread => ({
          ...prevThread,
          commentCount: prevThread.commentCount + 1
        }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!thread) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-xl">Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <Link 
          to="/" 
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-confess-orange dark:hover:text-confess-pink mb-6"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to threads
        </Link>
        
        <div className="confess-card p-6 mb-6">
          <div className="flex items-start">
            {/* Voting */}
            <div className="flex flex-col items-center mr-4 space-y-1">
              <button
                onClick={handleUpvote}
                className={`transition-colors ${isAuthenticated ? 'hover:text-confess-orange dark:hover:text-confess-pink' : ''}`}
                disabled={!isAuthenticated}
              >
                <ArrowUpCircle size={24} className={thread.votes > 0 ? 'text-confess-orange dark:text-confess-pink' : 'text-gray-400'} />
              </button>
              
              <span className="font-medium text-lg">
                {thread.votes}
              </span>
              
              <button
                onClick={handleDownvote}
                className={`transition-colors ${isAuthenticated ? 'hover:text-confess-orange dark:hover:text-confess-pink' : ''}`}
                disabled={!isAuthenticated}
              >
                <ArrowDownCircle size={24} className={thread.votes < 0 ? 'text-confess-orange dark:text-confess-pink' : 'text-gray-400'} />
              </button>
            </div>
            
            {/* Thread Content */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">{thread.title}</h1>
              
              <div className="flex items-center mb-4">
                <div className="relative w-6 h-6 bg-confess-orange rounded-full flex items-center justify-center text-white mr-2">
                  <span className="text-xs font-medium">{thread.avatar}</span>
                </div>
                <Link 
                  to={`/profile/${thread.userId}`}
                  className="text-sm font-medium hover:text-confess-orange dark:hover:text-confess-pink mr-2"
                >
                  {thread.username}
                </Link>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}
                </span>
              </div>
              
              <div className="prose dark:prose-invert max-w-none">
                <p>{thread.content}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Add Comment Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <MessageSquare className="mr-2" size={20} />
            Comments ({thread.commentCount})
          </h3>
          
          {isAuthenticated ? (
            <form onSubmit={handleSubmitComment} className="mb-8">
              <Textarea
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={isSubmitting}
                className="mb-3"
              />
              <Button 
                type="submit" 
                className="confess-gradient" 
                disabled={isSubmitting || !commentText.trim()}
              >
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </Button>
            </form>
          ) : (
            <div className="confess-card p-4 mb-6 text-center">
              <p className="mb-3">Sign in to join the conversation</p>
              <div className="flex justify-center space-x-3">
                <Link 
                  to="/login" 
                  className="confess-btn-secondary"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="confess-btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
          
          {/* Comments List */}
          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <CommentCard key={comment.id} comment={comment} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No comments yet. Be the first to comment!
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Thread;
