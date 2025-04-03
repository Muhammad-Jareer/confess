
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThread } from '@/contexts/ThreadContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const NewThread = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { createThread } = useThread();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const success = createThread(title.trim(), content.trim());
      
      if (success) {
        navigate('/');
      }
    } catch (err) {
      console.error('Error creating thread:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create New Thread</h1>
        
        <div className="confess-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block mb-1 text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter thread title"
                disabled={isSubmitting}
                required
              />
            </div>
            
            <div>
              <label htmlFor="content" className="block mb-1 text-sm font-medium">
                Content
              </label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your thread content..."
                className="min-h-[200px]"
                disabled={isSubmitting}
                required
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate('/')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="confess-gradient"
                disabled={isSubmitting || !title.trim() || !content.trim()}
              >
                {isSubmitting ? 'Creating...' : 'Create Thread'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default NewThread;
