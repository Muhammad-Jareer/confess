
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useThread } from '@/contexts/ThreadContext';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowUpCircle, ArrowDownCircle, Trash2, Edit2, CheckCircle, XCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const CommentCard = ({ comment }) => {
  const { voteComment, deleteComment, editComment } = useThread();
  const { isAuthenticated, currentUser } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  
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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(comment.content);
  };

  const handleSaveEdit = () => {
    if (editContent.trim()) {
      editComment(comment.id, editContent.trim());
      setIsEditing(false);
    }
  };
  
  const canModify = isAuthenticated && currentUser && comment.userId === currentUser.id;

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
            
            {canModify && !isEditing && (
              <div className="flex space-x-2">
                <button
                  onClick={handleEdit}
                  className="transition-colors p-1 rounded-md text-gray-400 hover:text-amber-500"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={handleDelete}
                  className={`transition-colors p-1 rounded-md ${isDeleting ? 'bg-red-100 dark:bg-red-900/30 text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
          
          {isEditing ? (
            <div className="my-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="mb-2"
                rows={3}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleCancelEdit}
                  className="p-1 text-gray-500 hover:text-red-500"
                >
                  <XCircle size={20} />
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="p-1 text-gray-500 hover:text-green-500"
                >
                  <CheckCircle size={20} />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 dark:text-gray-300 my-2">
              {comment.content}
            </p>
          )}
          
          {!isEditing && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
