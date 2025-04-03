
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useThread } from '@/contexts/ThreadContext';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowUpCircle, ArrowDownCircle, MessageSquare, Trash2 } from 'lucide-react';

const ThreadCard = ({ thread }) => {
  const { voteThread, deleteThread } = useThread();
  const { isAuthenticated, currentUser } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleUpvote = (e) => {
    e.preventDefault();
    e.stopPropagation();
    voteThread(thread.id, 1);
  };
  
  const handleDownvote = (e) => {
    e.preventDefault();
    e.stopPropagation();
    voteThread(thread.id, -1);
  };
  
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isDeleting) {
      deleteThread(thread.id);
      setIsDeleting(false);
    } else {
      setIsDeleting(true);
      
      // Auto-reset after 3 seconds
      setTimeout(() => {
        setIsDeleting(false);
      }, 3000);
    }
  };
  
  const canDelete = isAuthenticated && currentUser && thread.userId === currentUser.id;
  
  return (
    <Link 
      to={`/thread/${thread.id}`}
      className="confess-card block p-5 mb-4 transition-all"
    >
      <div className="flex">
        {/* Voting */}
        <div className="flex flex-col items-center mr-4 space-y-1">
          <button
            onClick={handleUpvote}
            className={`transition-colors ${isAuthenticated ? 'hover:text-confess-orange dark:hover:text-confess-pink' : ''}`}
            disabled={!isAuthenticated}
          >
            <ArrowUpCircle size={20} className={thread.votes > 0 ? 'text-confess-orange dark:text-confess-pink' : 'text-gray-400'} />
          </button>
          
          <span className="font-medium text-sm">
            {thread.votes}
          </span>
          
          <button
            onClick={handleDownvote}
            className={`transition-colors ${isAuthenticated ? 'hover:text-confess-orange dark:hover:text-confess-pink' : ''}`}
            disabled={!isAuthenticated}
          >
            <ArrowDownCircle size={20} className={thread.votes < 0 ? 'text-confess-orange dark:text-confess-pink' : 'text-gray-400'} />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <div className="flex justify-between">
            <h2 className="text-lg font-semibold mb-1 hover:text-confess-orange dark:hover:text-confess-pink transition-colors">
              {thread.title}
            </h2>
            
            {canDelete && (
              <button
                onClick={handleDelete}
                className={`ml-auto transition-colors p-1 rounded-md ${isDeleting ? 'bg-red-100 dark:bg-red-900/30 text-red-500' : 'text-gray-400 hover:text-red-500'}`}
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Posted by {thread.username} • {formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 line-clamp-3 mb-4">
            {thread.content}
          </p>
          
          <div className="flex items-center text-gray-500">
            <MessageSquare size={18} className="mr-1" />
            <span>{thread.commentCount} {thread.commentCount === 1 ? 'comment' : 'comments'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ThreadCard;
