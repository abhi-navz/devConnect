import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import CreatePostForm from '../components/common/CreatePostForm';
import PostCard from '../components/common/PostCard';
import api from '../api/axios';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFeed = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/posts');
      setPosts(data.posts);
    } catch (err) {
      setError('Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handleDelete = async (postId) => {
    try {
      await api.delete(`/posts/${postId}`);
      setPosts(posts.filter((p) => p._id !== postId));
    } catch (err) {
      setError('Failed to delete post');
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-text-primary mb-6 font-mono">Feed</h1>

        <CreatePostForm onPostCreated={handlePostCreated} />

        {error && (
          <div className="bg-danger/10 border border-danger text-danger text-sm rounded-lg px-4 py-2.5 mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <LoadingSpinner label="Loading feed...." />
        ) : posts.length === 0 ? (
          <p className="text-text-secondary text-center py-12">
            Your feed is empty. Share what you're building — it's the fastest way to get noticed.
          </p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;