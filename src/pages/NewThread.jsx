import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThread } from '@/contexts/ThreadContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const NewThread = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',        
    isAnonymous: false,  
    category: '',       
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { createThread } = useThread();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e) => {
    setFormData(prev => ({ ...prev, isAnonymous: e.target.checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // Prepare data for thread creation. Convert category string to array:
      const threadData = {
        title: formData.title.trim(),
        description: formData.content.trim(),
        isAnonymous: formData.isAnonymous,
        category: formData.category ? formData.category.split(',').map(s => s.trim()) : []
      };
      
      const success = await createThread(threadData);
      
      if (success) {
        toast({
          title: 'Thread Created!',
          description: 'Your new thread has been posted.',
        });
        navigate('/');
      }
    } catch (err) {
      console.error('Error creating thread:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while creating the thread. Please try again.",
      });
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
                name="title"
                value={formData.title}
                onChange={handleChange}
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
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your thread content..."
                className="min-h-[200px]"
                disabled={isSubmitting}
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block mb-1 text-sm font-medium">
                Category (comma-separated)
              </label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g., Artificial Intelligence, Technology"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isAnonymous"
                  checked={formData.isAnonymous}
                  onChange={handleCheckboxChange}
                  disabled={isSubmitting}
                />
                <span className="text-sm">Post anonymously</span>
              </label>
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
                disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
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
