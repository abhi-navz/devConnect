import { useState } from 'react';
import api from '../../api/axios';

const LikeButton = ({ postId, initialLiked, initialCount }) => {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (loading) return;
    setLoading(true);
    // Optimistic update — flip UI instantly, revert only if the request fails
    const prevLiked = liked;
    const prevCount = count;
    setLiked(!liked);
    setCount(liked ? count - 1 : count + 1);

    try {
      const { data } = await api.put(`/posts/${postId}/like`);
      setLiked(data.liked);
      setCount(data.likesCount);
    } catch (err) {
      setLiked(prevLiked);
      setCount(prevCount);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-1.5 text-sm transition-colors ${
        liked ? 'text-accent' : 'text-text-muted hover:text-text-secondary'
      }`}
    >
      <span>{liked ? '❤️' : '🤍'}</span>
      <span>{count}</span>
    </button>
  );
};

export default LikeButton;