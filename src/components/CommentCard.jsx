
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useThread } from '@/contexts/ThreadContext';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowUpCircle, ArrowDownCircle, Trash2 } from 'lucide-react';

const CommentCard = ({ comment }) => {
  const { voteComment, deleteComment } = useThread();
  const { isAuthenticated, currentUser } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleUpvote = () => {
    voteComment(comment.id, 1);
  };
  
  const handleDownvote = () => {
    voteComment(comment.id, -1);
  };
  
  const handleDelete = () => {
    if (isDeleting) {
      deleteComment(comment.id);
      setIsDeleting(false);
    } else {
      setIsDeleting(true);
      
      // Auto-reset after 3 seconds
      setTimeout(() => {
        setIsDeleting(false);
      }, 3000);
    }
  };
  
  const canDelete = isAuthenticated && currentUser && comment.userId === currentUser.id;

  return (
    <div className="confess-card p-4 mb-3">
      <div className="flex space-x-4">
        {/* Avatar */}
        <div className="relative w-8 h-8 bg-confess-orange rounded-full flex items-center justify-center text-white">
          <span className="text-sm font-medium">{comment.avatar}</span>
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <div className="flex justify-between">
            <div className="flex items-center">
              <span className="font-medium mr-2">{comment.username}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </span>
            </div>
            
            {canDelete && (
              <button
                onClick={handleDelete}
                className={`transition-colors p-1 rounded-md ${isDeleting ? 'bg-red-100 dark:bg-red-900/30 text-red-500' : 'text-gray-400 hover:text-red-500'}`}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 my-2">
            {comment.content}
          </p>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <button
                onClick={handleUpvote}
                className={`transition-colors ${isAuthenticated ? 'hover:text-confess-orange dark:hover:text-confess-pink' : ''}`}
                disabled={!isAuthenticated}
              >
                <ArrowUpCircle size={18} className={comment.votes > 0 ? 'text-confess-orange dark:text-confess-pink' : 'text-gray-400'} />
              </button>
              
              <span className="text-sm font-medium">
                {comment.votes}
              </span>
              
              <button
                onClick={handleDownvote}
                className={`transition-colors ${isAuthenticated ? 'hover:text-confess-orange dark:hover:text-confess-pink' : ''}`}
                disabled={!isAuthenticated}
              >
                <ArrowDownCircle size={18} className={comment.votes < 0 ? 'text-confess-orange dark:text-confess-pink' : 'text-gray-400'} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
