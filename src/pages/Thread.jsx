
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useThread } from '@/contexts/ThreadContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import CommentCard from '@/components/CommentCard';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowUpCircle, ArrowDownCircle, ArrowLeft, MessageSquare, Edit2, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Thread = () => {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const { 
    getThreadById, 
    getCommentsByThreadId, 
    voteThread,
    createComment,
    editThread,
    deleteThread
  } = useThread();
  const { isAuthenticated, currentUser } = useAuth();
  
  const [thread, setThread] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    const fetchedThread = getThreadById(threadId);
    
    if (!fetchedThread) {
      navigate('/not-found');
      return;
    }
    
    setThread(fetchedThread);
    setEditTitle(fetchedThread.title);
    setEditContent(fetchedThread.content);
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

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle(thread.title);
    setEditContent(thread.content);
  };

  const handleSaveEdit = () => {
    if (editTitle.trim() && editContent.trim()) {
      const success = editThread(thread.id, {
        title: editTitle.trim(),
        content: editContent.trim()
      });
      
      if (success) {
        setIsEditing(false);
        // Update thread state
        setThread(prevThread => ({
          ...prevThread,
          title: editTitle.trim(),
          content: editContent.trim(),
          updatedAt: new Date().toISOString()
        }));
      }
    }
  };

  const handleDeleteClick = () => {
    if (isDeleting) {
      const success = deleteThread(thread.id);
      if (success) {
        navigate('/');
      }
      setIsDeleting(false);
    } else {
      setIsDeleting(true);
      setTimeout(() => setIsDeleting(false), 3000);
    }
  };
  
  const canModify = isAuthenticated && currentUser && thread?.userId === currentUser.id;
  
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
        
        {isEditing ? (
          <div className="confess-card p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Edit Thread</h3>
            <div className="mb-4">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Title"
                className="mb-4"
              />
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Content"
                rows={6}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                className="confess-gradient"
                onClick={handleSaveEdit}
              >
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
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
                <div className="flex justify-between items-start">
                  <h1 className="text-2xl font-bold mb-2">{thread.title}</h1>
                  
                  {canModify && (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleEditClick}
                        className="transition-colors p-1 rounded-md text-gray-400 hover:text-amber-500"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={handleDeleteClick}
                        className={`transition-colors p-1 rounded-md ${isDeleting ? 'bg-red-100 dark:bg-red-900/30 text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  )}
                </div>
                
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
                    {thread.updatedAt && thread.updatedAt !== thread.createdAt && (
                      <span className="ml-2 italic">(edited {formatDistanceToNow(new Date(thread.updatedAt), { addSuffix: true })})</span>
                    )}
                  </span>
                </div>
                
                <div className="prose dark:prose-invert max-w-none">
                  <p>{thread.content}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
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
