
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useThread } from '@/contexts/ThreadContext';
import Layout from '@/components/Layout';
import ThreadCard from '@/components/ThreadCard';
import CommentCard from '@/components/CommentCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, User, Edit2, Check } from 'lucide-react';

const Profile = () => {
  const { userId } = useParams();
  const { currentUser, updateProfile } = useAuth();
  const { getThreadsByUser, getCommentsByUser } = useThread();
  
  const [user, setUser] = useState(null);
  const [userThreads, setUserThreads] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: '',
    bio: ''
  });
  
  const isOwnProfile = currentUser && parseInt(userId) === currentUser.id;
  
  useEffect(() => {
    if (isOwnProfile) {
      setUser(currentUser);
      setEditData({
        username: currentUser.username,
        bio: currentUser.bio
      });
    } else {
      // In a real app, we'd fetch user from API
      // For now, we'll get data from threads or comments
      const threads = getThreadsByUser(parseInt(userId));
      if (threads.length > 0) {
        const { username, avatar, userId } = threads[0];
        setUser({ username, avatar, id: userId });
      } else {
        const comments = getCommentsByUser(parseInt(userId));
        if (comments.length > 0) {
          const { username, avatar, userId } = comments[0];
          setUser({ username, avatar, id: userId });
        }
      }
    }
    
    setUserThreads(getThreadsByUser(parseInt(userId)));
    setUserComments(getCommentsByUser(parseInt(userId)));
  }, [userId, currentUser, isOwnProfile, getThreadsByUser, getCommentsByUser]);
  
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmitEdit = () => {
    updateProfile({
      username: editData.username,
      bio: editData.bio
    });
    setIsEditing(false);
  };
  
  if (!user) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-xl">User not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="confess-card p-6 mb-8">
          {/* Profile header */}
          <div className="flex flex-col md:flex-row items-start md:items-center mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="relative w-16 h-16 bg-confess-orange rounded-full flex items-center justify-center text-white mr-4">
                <span className="text-2xl font-semibold">{user.avatar}</span>
              </div>
              
              {!isEditing ? (
                <div>
                  <h1 className="text-2xl font-bold">{user.username}</h1>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Member
                  </p>
                </div>
              ) : (
                <div>
                  <Input
                    name="username"
                    value={editData.username}
                    onChange={handleEditChange}
                    placeholder="Username"
                    className="mb-1"
                  />
                </div>
              )}
            </div>
            
            {isOwnProfile && (
              <div className="md:ml-auto">
                {!isEditing ? (
                  <Button 
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="flex items-center"
                  >
                    <Edit2 size={16} className="mr-1" />
                    Edit Profile
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmitEdit}
                    className="confess-gradient flex items-center"
                  >
                    <Check size={16} className="mr-1" />
                    Save Changes
                  </Button>
                )}
              </div>
            )}
          </div>
          
          {/* Profile bio */}
          {!isEditing ? (
            <div className="mb-4">
              <h3 className="font-semibold mb-1">Bio</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {user.bio || "This user hasn't added a bio yet."}
              </p>
            </div>
          ) : (
            <div className="mb-4">
              <label className="font-semibold mb-1 block">Bio</label>
              <Textarea
                name="bio"
                value={editData.bio}
                onChange={handleEditChange}
                placeholder="Tell us about yourself..."
                className="resize-none"
              />
            </div>
          )}
          
          {/* Stats */}
          <div className="flex space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{userThreads.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Threads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{userComments.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Comments</div>
            </div>
          </div>
        </div>
        
        {/* Activity tabs */}
        <Tabs defaultValue="threads">
          <TabsList className="mb-6">
            <TabsTrigger value="threads" className="flex items-center">
              <MessageSquare size={16} className="mr-1" />
              Threads
            </TabsTrigger>
            <TabsTrigger value="comments" className="flex items-center">
              <User size={16} className="mr-1" />
              Comments
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="threads">
            {userThreads.length > 0 ? (
              <div className="space-y-4">
                {userThreads.map(thread => (
                  <ThreadCard key={thread.id} thread={thread} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  {isOwnProfile 
                    ? "You haven't created any threads yet." 
                    : "This user hasn't created any threads yet."}
                </p>
                {isOwnProfile && (
                  <Button asChild className="confess-gradient mt-4">
                    <Link to="/new">Create New Thread</Link>
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="comments">
            {userComments.length > 0 ? (
              <div className="space-y-4">
                {userComments.map(comment => (
                  <div key={comment.id} className="confess-card p-4">
                    <Link 
                      to={`/thread/${comment.threadId}`}
                      className="block text-sm font-medium mb-2 text-confess-orange dark:text-confess-pink"
                    >
                      View Thread
                    </Link>
                    <CommentCard comment={comment} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  {isOwnProfile 
                    ? "You haven't made any comments yet." 
                    : "This user hasn't made any comments yet."}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
