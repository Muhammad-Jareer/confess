import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useThread } from '@/contexts/ThreadContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { ArrowUpCircle, ArrowDownCircle, MessageSquare, Trash2, Edit2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const ThreadCard = ({ thread, searchQuery }) => {
  const { voteThread, deleteThread, editThread } = useThread();
  const { isAuthenticated, currentUser } = useAuth();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(thread.title);
  const [editContent, setEditContent] = useState(thread.description);

  // Function to highlight text matching the search query
  const highlightMatch = (text) => {
    if (!searchQuery) return text;

    const regex = new RegExp(`(${searchQuery})`, 'gi');
    return text.split(regex).map((part, index) => 
      regex.test(part) ? <span key={index} className="text-pink-500">{part}</span> : part
    );
  };

  const handleVote = async (direction) => {
    try {
      await voteThread(thread.$id, direction);
      toast({
        title: `${direction === 'up' ? 'Upvoted' : 'Downvoted'}`,
        description: 'Your vote has been recorded.',
        variant: 'success',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Vote error',
        description: 'Could not process your vote.',
      });
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDeleting) {
      try {
        const success = await deleteThread(thread.$id);
        if (success) {
          toast({
            title: 'Thread deleted',
            description: 'Your thread has been deleted successfully.',
            variant: 'success',
          });
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Delete error',
          description: 'There was an issue deleting your thread.',
        });
      }
      setIsDeleting(false);
    } else {
      setIsDeleting(true);
      setTimeout(() => setIsDeleting(false), 3000);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (editTitle.trim() && editContent.trim()) {
      try {
        const success = await editThread(thread.$id, {
          title: editTitle,
          content: editContent,
        });
        if (success) {
          toast({
            title: 'Thread updated',
            description: 'Your thread has been updated successfully.',
            variant: 'success',
          });
          setIsEditing(false);
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Update error',
          description: 'There was an issue updating your thread.',
        });
      }
    }
  };

  const canModify = isAuthenticated && currentUser && thread.userId?.email === currentUser.email;

  if (isEditing) {
    return (
      <div className="confess-card block p-5 mb-4">
        <form onSubmit={handleSaveEdit}>
          <div className="mb-4">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Title"
              className="mb-2"
            />
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Content"
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button type="submit" className="confess-gradient">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <Link to={`/thread/${thread.$id}`} className="confess-card block p-5 mb-4 transition-all">
      <div className="flex flex-col">
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold mb-1 hover:text-confess-orange dark:hover:text-confess-pink transition-colors">
            {highlightMatch(thread.title)}
          </h2>
          {canModify && (
            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsEditing(true);
                }}
                className="p-1 rounded-md text-gray-400 hover:text-amber-500"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={handleDelete}
                className={`p-1 rounded-md ${isDeleting ? 'bg-red-100 dark:bg-red-900/30 text-red-500' : 'text-gray-400 hover:text-red-500'}`}
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center">
          <div className="relative w-5 h-5 bg-black rounded-full flex items-center justify-center mr-2">
            <img
              src={thread.userId?.avatar}
              alt={thread.userId?.username}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          Posted by {highlightMatch(thread.userId?.username)} • {formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}
        </div>

        <p className="text-gray-700 dark:text-gray-300 line-clamp-3 mb-4">
          {highlightMatch(thread.description)}
        </p>

        <div className="my-4 flex flex-wrap gap-2 text-sm text-gray-500">
          {thread.category.map((cat, idx) => (
            <span key={idx} className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-lg">{cat}</span>
          ))}
        </div>

        <div className="flex items-center justify-start space-x-4">
          <div className="flex flex-row items-center border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden">
            <button
              onClick={(e) => {
                e.preventDefault();
                handleVote('up');
              }}
              className="px-2 py-1 transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
              disabled={!isAuthenticated}
            >
              <ArrowUpCircle
                size={20}
                className={thread.likes > 0 ? 'text-confess-orange dark:text-confess-pink' : 'text-gray-400'}
              />
            </button>
            <span className="px-2 py-1 text-sm font-medium">{thread.likes}</span>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleVote('down');
              }}
              className="px-2 py-1 transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
              disabled={!isAuthenticated}
            >
              <ArrowDownCircle
                size={20}
                className={thread.likes < 0 ? 'text-confess-orange dark:text-confess-pink' : 'text-gray-400'}
              />
            </button>
          </div>
          <div className="flex items-center text-gray-500">
            <MessageSquare size={20} className="mr-1" />
            <span>{thread.commentCount} {thread.commentCount === 1 ? 'comment' : 'comments'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ThreadCard;
