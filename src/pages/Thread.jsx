import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useThread } from '@/contexts/ThreadContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import ThreadCard from '@/components/ThreadCard';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const Thread = () => {
  
  const { threadId } = useParams();
  const navigate = useNavigate();
  const {
    getThreadById,
    voteThread,
    editThread,
    deleteThread
  } = useThread();
  const { isAuthenticated, currentUser } = useAuth();

  const [thread, setThread] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadThread = async () => {
      try {
        const fetched = await getThreadById(threadId);
        if (!fetched) return navigate('/not-found');

        setThread(fetched);
        setEditTitle(fetched.title);
        setEditContent(fetched.content);
      } catch (err) {
        console.error('[Thread] error in loadThread:', err);
        navigate('/not-found');
      }
    };

    loadThread();
  }, [threadId, getThreadById, navigate]);

  const canModify = isAuthenticated && currentUser && thread?.userId?.$id === currentUser.id;

  const handleUpvote = () => {
    voteThread(thread?.$id, 1);
    setThread(prev => ({ ...prev, votes: prev.votes + 1 }));
  };

  const handleDownvote = () => {
    voteThread(thread?.$id, -1);
    setThread(prev => ({ ...prev, votes: prev.votes - 1 }));
  };

  const handleEditClick = () => setIsEditing(true);

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle(thread?.title);
    setEditContent(thread?.content);
  };

  const handleSaveEdit = () => {
    if (editTitle.trim() && editContent.trim()) {
      const success = editThread(thread?.$id, {
        title: editTitle.trim(),
        content: editContent.trim()
      });

      if (success) {
        setIsEditing(false);
        setThread(prev => ({
          ...prev,
          title: editTitle.trim(),
          content: editContent.trim(),
          updatedAt: new Date().toISOString()
        }));
      }
    }
  };

  const handleDeleteClick = () => {
    if (isDeleting) {
      const success = deleteThread(thread?.$id);
      if (success) navigate('/');
      setIsDeleting(false);
    } else {
      setIsDeleting(true);
      setTimeout(() => setIsDeleting(false), 3000);
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
              <Button type="button" variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button type="button" className="confess-gradient" onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
          <ThreadCard
            thread={thread}
            onUpvote={handleUpvote}
            onDownvote={handleDownvote}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            canModify={canModify}
          />
        )}
      </div>
    </Layout>
  );
};

export default Thread;
