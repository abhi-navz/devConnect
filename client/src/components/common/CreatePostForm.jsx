import { useState, useEffect } from "react";
import Button from "./Button";
import SkillTag from "./SkillTag";
import api from "../../api/axios";

const CreatePostForm = ({ onPostCreated }) => {
  const [content, setContent] = useState("");
  const [projectName, setProjectName] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [myProjects, setMyProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  useEffect(() => {
    const fetchMyProjects = async () => {
      try {
        const { data } = await api.get("/projects/mine");
        setMyProjects(data.projects);
      } catch (err) {
        // Non-critical — dropdown just stays empty if this fails
      }
    };
    fetchMyProjects();
  }, []);

  const handleAddTag = (e) => {
    e.preventDefault();
    const trimmed = tagInput.trim();
    if (
      trimmed &&
      !tags.some((t) => t.toLowerCase() === trimmed.toLowerCase())
    ) {
      setTags([...tags, trimmed]);
    }
    setTagInput("");
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      handleAddTag(e);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("Post content cannot be empty");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/posts", {
        content,
        projectName,
        project: selectedProjectId || null,
        tags,
      });
      onPostCreated(data.post);
      setContent("");
      setProjectName("");
      setSelectedProjectId("");
      setTags([]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-bg-secondary border border-border rounded-xl p-5 mb-6"
    >
      {error && <p className="text-danger text-sm mb-3">{error}</p>}

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={1000}
        rows={3}
        placeholder="What are you building? Share a dev update..."
        className="w-full bg-bg-tertiary border border-border text-text-primary rounded-lg px-4 py-2.5 placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none mb-3"
      />

      <div className="flex flex-col sm:flex-row gap-2 mb-3">
        <div className="flex-1">
          {myProjects.length > 0 ? (
            <select
              value={selectedProjectId}
              onChange={(e) => {
                const id = e.target.value;
                setSelectedProjectId(id);
                const matched = myProjects.find((p) => p._id === id);
                setProjectName(matched ? matched.title : "");
              }}
              className="w-full bg-bg-tertiary border border-border text-text-primary rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">No project link (optional)</option>
              {myProjects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Project name (optional, plain text)"
              className="w-full bg-bg-tertiary border border-border text-text-primary rounded-lg px-4 py-2.5 placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
            />
          )}
        </div>
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="Add tags (Enter)"
            className="flex-1 bg-bg-tertiary border border-border text-text-primary rounded-lg px-4 py-2.5 placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <Button variant="secondary" onClick={handleAddTag}>
            Add
          </Button>
        </div>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.map((tag) => (
            <SkillTag
              key={tag}
              skill={tag}
              onRemove={() => handleRemoveTag(tag)}
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-text-muted text-xs">{content.length}/1000</p>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Posting..." : "Post Update"}
        </Button>
      </div>
    </form>
  );
};

export default CreatePostForm;
