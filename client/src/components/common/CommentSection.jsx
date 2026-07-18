import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ConfirmDialog from "./ConfirmDialog";
import api from "../../api/axios";

const timeAgo = (dateString) => {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  const intervals = [
    { label: "y", secs: 31536000 },
    { label: "mo", secs: 2592000 },
    { label: "d", secs: 86400 },
    { label: "h", secs: 3600 },
    { label: "m", secs: 60 },
  ];
  for (const { label, secs } of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count}${label} ago`;
  }
  return "just now";
};

const CommentRow = ({ comment, onReplyClick, onDelete, isReply = false }) => {
  const { user } = useAuth();
  const isOwn = user?._id === comment.author?._id;

  return (
    <div className={isReply ? "ml-8 mt-2" : "mt-3"}>
      <div className="flex items-start justify-between">
        <Link
          to={`/developers/${comment.author?.username}`}
          className="flex items-start gap-2"
        >
          <div className="w-7 h-7 rounded-full bg-bg-tertiary border border-border flex items-center justify-center text-accent text-xs font-bold shrink-0">
            {comment.author?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-text-primary text-xs font-medium">
              {comment.author?.name}{" "}
              <span className="text-text-muted font-normal">
                · {timeAgo(comment.createdAt)}
              </span>
            </p>
            <p className="text-text-secondary text-sm">{comment.content}</p>
            {!isReply && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onReplyClick(comment._id);
                }}
                className="text-text-muted hover:text-accent text-xs mt-0.5"
              >
                Reply
              </button>
            )}
          </div>
        </Link>
        {isOwn && (
          <button
            onClick={() => onDelete(comment._id)}
            className="text-text-muted hover:text-danger text-xs shrink-0"
          >
            Delete
          </button>
        )}
      </div>

      {!isReply && comment.replies?.length > 0 && (
        <div>
          {comment.replies.map((reply) => (
            <CommentRow
              key={reply._id}
              comment={reply}
              onDelete={onDelete}
              isReply
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [replyTo, setReplyTo] = useState(null); // commentId being replied to, or null
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // commentId pending delete confirmation

  const fetchComments = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/comments/post/${postId}`);
      setComments(data.comments);
    } catch (err) {
      // Silently fail — comment section just stays empty; feed itself isn't broken
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || submitting) return;
    setSubmitting(true);
    try {
      await api.post("/comments", {
        postId,
        content: input,
        parentComment: replyTo,
      });
      setInput("");
      setReplyTo(null);
      await fetchComments();
    } catch (err) {
      // Could surface an error banner here; kept minimal for MVP
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/comments/${deleteTarget}`);
      setDeleteTarget(null);
      await fetchComments();
    } catch (err) {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="border-t border-border mt-3 pt-3">
      {loading ? (
        <p className="text-text-muted text-xs">Loading comments...</p>
      ) : (
        comments.map((comment) => (
          <CommentRow
            key={comment._id}
            comment={comment}
            onReplyClick={setReplyTo}
            onDelete={setDeleteTarget}
          />
        ))
      )}

      <form onSubmit={handleSubmit} className="mt-3">
        {replyTo && (
          <div className="flex items-center justify-between text-xs text-text-muted mb-1.5">
            <span>Replying to comment</span>
            <button
              type="button"
              onClick={() => setReplyTo(null)}
              className="hover:text-danger"
            >
              Cancel
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={replyTo ? "Write a reply..." : "Add a comment..."}
            className="flex-1 bg-bg-tertiary border border-border text-text-primary text-sm rounded-lg px-3 py-2 placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            type="submit"
            disabled={submitting || !input.trim()}
            className="text-accent text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed px-2"
          >
            Post
          </button>
        </div>
      </form>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete comment?"
        message="This will permanently delete the comment. This can't be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default CommentSection;
