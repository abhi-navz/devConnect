import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SkillTag from './SkillTag';
import LikeButton from './LikeButton';
import CommentSection from './CommentSection';
import ConfirmDialog from './ConfirmDialog';

const timeAgo = (dateString) => {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  const intervals = [
    { label: 'y', secs: 31536000 },
    { label: 'mo', secs: 2592000 },
    { label: 'd', secs: 86400 },
    { label: 'h', secs: 3600 },
    { label: 'm', secs: 60 },
  ];
  for (const { label, secs } of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count}${label} ago`;
  }
  return 'just now';
};

const PostCard = ({ post, onDelete }) => {
  const { user } = useAuth();
  const isOwnPost = user?._id === post.author?._id;
  const [showComments, setShowComments] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const alreadyLiked = post.likes?.some((id) => id === user?._id);

  const handleConfirmDelete = () => {
    onDelete(post._id);
    setConfirmOpen(false);
  };

  return (
    <div className="bg-bg-secondary border border-border rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <Link to={`/developers/${post.author?.username}`} className="flex items-center gap-3">
          {post.author?.profilePicture ? (
            <img
              src={post.author.profilePicture}
              alt={post.author.name}
              className="w-10 h-10 rounded-full object-cover border border-border"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className="w-10 h-10 rounded-full bg-bg-tertiary border border-border items-center justify-center text-accent font-bold"
            style={{ display: post.author?.profilePicture ? 'none' : 'flex' }}
          >
            {post.author?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-text-primary text-sm font-medium">{post.author?.name}</p>
            <p className="text-text-muted text-xs">
              @{post.author?.username} · {timeAgo(post.createdAt)}
            </p>
          </div>
        </Link>

        {isOwnPost && (
          <button
            onClick={() => setConfirmOpen(true)}
            className="text-text-muted hover:text-danger text-xs transition-colors"
          >
            Delete
          </button>
        )}
      </div>

      {post.projectName && (
        <p className="text-accent text-xs font-mono mb-1">📦 {post.projectName}</p>
      )}

      <p className="text-text-primary text-sm whitespace-pre-wrap mb-3">{post.content}</p>

      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.map((tag) => (
            <SkillTag key={tag} skill={tag} />
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 pt-2 border-t border-border">
        <LikeButton
          postId={post._id}
          initialLiked={!!alreadyLiked}
          initialCount={post.likes?.length || 0}
        />
        <button
          onClick={() => setShowComments(!showComments)}
          className="text-text-muted hover:text-text-secondary text-sm"
        >
          💬 {showComments ? 'Hide comments' : 'Comments'}
        </button>
      </div>

      {showComments && <CommentSection postId={post._id} />}

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete post?"
        message="This will permanently delete your post and all its comments. This can't be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default PostCard;