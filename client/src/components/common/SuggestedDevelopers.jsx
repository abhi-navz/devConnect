import { useState } from "react";
import { Link } from "react-router-dom";
import SkillTag from "./SkillTag";
import api from "../../api/axios";

const SuggestedDevelopers = ({ projectId, roleId, roleName }) => {
  const [suggestions, setSuggestions] = useState(null); // null = not yet fetched
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSuggestions = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(
        `/projects/${projectId}/suggestions/${roleId}`
      );
      setSuggestions(data.suggestions);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load suggestions");
    } finally {
      setLoading(false);
    }
  };

  if (suggestions === null) {
    return (
      <button
        onClick={fetchSuggestions}
        disabled={loading}
        className="text-accent hover:text-accent-hover text-xs mt-1 disabled:opacity-50"
      >
        {loading
          ? "Finding matches..."
          : `✨ Suggest developers for ${roleName}`}
      </button>
    );
  }

  return (
    <div className="mt-2">
      {error && <p className="text-danger text-xs mb-2">{error}</p>}
      {suggestions.length === 0 ? (
        <p className="text-text-muted text-xs">
          No matching developers found yet.
        </p>
      ) : (
        <div className="space-y-2">
          {suggestions.map(({ user, matchScore, matchedSkills }) => (
            <Link
              key={user._id}
              to={`/developers/${user.username}`}
              className="flex items-center justify-between bg-bg-primary border border-border rounded-lg p-2.5 hover:border-accent transition-colors"
            >
              <div className="flex items-center gap-2.5">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-border"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className="w-8 h-8 rounded-full bg-bg-tertiary border border-border items-center justify-center text-accent text-xs font-bold"
                  style={{ display: user.profilePicture ? "none" : "flex" }}
                >
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-text-primary text-xs font-medium">
                    {user.name}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {matchedSkills.slice(0, 3).map((s) => (
                      <SkillTag key={s} skill={s} />
                    ))}
                  </div>
                </div>
              </div>
              <span className="text-success text-xs font-mono font-bold shrink-0 ml-2">
                {matchScore}%
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuggestedDevelopers;
