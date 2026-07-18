import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SkillTag from './SkillTag';

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
            onClick={() => onDelete(post._id)}
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
        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <SkillTag key={tag} skill={tag} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostCard;