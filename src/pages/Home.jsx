import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useThread } from '@/contexts/ThreadContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import ThreadCard from '@/components/ThreadCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const Home = () => {
  const { threads } = useThread(); 
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');

  // Fetch threads from Appwrite when component mounts or when authentication changes
  useEffect(() => {
    if (isAuthenticated) {
    }
  }, [isAuthenticated]);

  // Filter threads based on search query
  const filteredThreads = threads.filter(thread => {
    if (!searchQuery) return true;
  
    const query = searchQuery.toLowerCase().trim();
  
    return (
      thread.title?.toLowerCase().includes(query) ||
      thread.content?.toLowerCase().includes(query) ||
      thread.username?.toLowerCase().includes(query)
    );
  });

  // Sort threads based on selected criteria
  const sortedThreads = [...filteredThreads].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.likes - a.likes; // Sorting based on likes
      case 'comments':
        return b.commentCount - a.commentCount; // Sorting based on comment count
      case 'latest':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt); // Sorting based on createdAt
    }
  });

  return (
    <Layout>
      <section className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Discover Threads</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
          Join the conversation by exploring threads or share your thoughts.
        </p>

        {/* Search and filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              className="pl-10"
              placeholder="Search threads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <div className="inline-flex items-center border rounded-md overflow-hidden">
            <Button
              type="button"
              variant={sortBy === 'latest' ? 'default' : 'ghost'}
              className={`text-sm px-3 py-1 h-auto ${sortBy === 'latest' ? 'confess-gradient text-white' : ''}`}
              onClick={() => setSortBy('latest')}
            >
              Latest
            </Button>
            <Button
              type="button"
              variant={sortBy === 'popular' ? 'default' : 'ghost'}
              className={`text-sm px-3 py-1 h-auto ${sortBy === 'popular' ? 'confess-gradient text-white' : ''}`}
              onClick={() => setSortBy('popular')}
            >
              Most Liked
            </Button>
            <Button
              type="button"
              variant={sortBy === 'comments' ? 'default' : 'ghost'}
              className={`text-sm px-3 py-1 h-auto ${sortBy === 'comments' ? 'confess-gradient text-white' : ''}`}
              onClick={() => setSortBy('comments')}
            >
              Comments
            </Button>

            </div>
          </div>
        </div>
      </section>

      <section>
        {sortedThreads.length > 0 ? (
          <div>
            {sortedThreads.map((thread) => (
              // Ensuring that 'key' is passed here as thread.id
              <ThreadCard key={thread.$id} thread={thread} searchQuery={searchQuery} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No threads found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? 'Try a different search term' : 'Be the first to create a thread!'}
            </p>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Home;
