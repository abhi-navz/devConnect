import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import SkillTag from "../components/common/SkillTag";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    bio: user?.bio || "",
    githubUsername: user?.githubUsername || "",
    portfolio: user?.portfolio || "",
    location: user?.location || "",
    profilePicture: user?.profilePicture || "",
  });
  const [skills, setSkills] = useState(user?.skills || []);
  const [skillInput, setSkillInput] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = skillInput.trim();
    if (
      trimmed &&
      !skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())
    ) {
      setSkills([...skills, trimmed]);
    }
    setSkillInput("");
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      handleAddSkill(e);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const { data } = await api.put("/users/profile", { ...formData, skills });
      updateUser(data.user);
      setSuccess("Profile updated successfully");
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      bio: user?.bio || "",
      githubUsername: user?.githubUsername || "",
      portfolio: user?.portfolio || "",
      location: user?.location || "",
      profilePicture: user?.profilePicture || "",
    });
    setSkills(user?.skills || []);
    setIsEditing(false);
    setError("");
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-bg-secondary border border-border rounded-xl p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover border border-border"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className="w-16 h-16 rounded-full bg-bg-tertiary border border-border items-center justify-center text-2xl font-bold text-accent"
                style={{ display: user?.profilePicture ? "none" : "flex" }}
              >
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-bold text-text-primary">
                  {user?.name}
                </h1>
                <p className="text-text-secondary text-sm">@{user?.username}</p>
              </div>
            </div>
            {!isEditing && (
              <Button variant="secondary" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>

          {success && (
            <div className="bg-success/10 border border-success text-success text-sm rounded-lg px-4 py-2.5 mb-4">
              {success}
            </div>
          )}
          {error && (
            <div className="bg-danger/10 border border-danger text-danger text-sm rounded-lg px-4 py-2.5 mb-4">
              {error}
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleSave}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  maxLength={300}
                  rows={3}
                  placeholder="Tell other developers about yourself..."
                  className="w-full bg-bg-tertiary border border-border text-text-primary rounded-lg px-4 py-2.5 placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                />
                <p className="text-text-muted text-xs mt-1">
                  {formData.bio.length}/300
                </p>
              </div>
              <Input
                label="Profile Picture URL"
                name="profilePicture"
                value={formData.profilePicture}
                onChange={handleChange}
                placeholder="https://github.com/yourusername.png"
              />
              {formData.profilePicture && (
                <div className="mb-4 -mt-2">
                  <p className="text-text-muted text-xs mb-1">Preview:</p>
                  <img
                    src={formData.profilePicture}
                    alt="Profile preview"
                    className="w-16 h-16 rounded-full object-cover border border-border"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Skills
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                    placeholder="e.g. React (press Enter to add)"
                    className="flex-1 bg-bg-tertiary border border-border text-text-primary rounded-lg px-4 py-2.5 placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <Button variant="secondary" onClick={handleAddSkill}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <SkillTag
                      key={skill}
                      skill={skill}
                      onRemove={() => handleRemoveSkill(skill)}
                    />
                  ))}
                </div>
              </div>

              <Input
                label="GitHub Username"
                name="githubUsername"
                value={formData.githubUsername}
                onChange={handleChange}
                placeholder="octocat"
              />
              <Input
                label="Portfolio URL"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleChange}
                placeholder="https://yourportfolio.com"
              />
              <Input
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Bengaluru, India"
              />

              <div className="flex gap-3 mt-2">
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
                <Button type="button" variant="ghost" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-5">
              <div>
                <h3 className="text-text-muted text-xs uppercase tracking-wide mb-1">
                  Bio
                </h3>
                <p className="text-text-primary">
                  {user?.bio || "No bio added yet."}
                </p>
              </div>

              <div>
                <h3 className="text-text-muted text-xs uppercase tracking-wide mb-2">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {user?.skills?.length ? (
                    user.skills.map((skill) => (
                      <SkillTag key={skill} skill={skill} />
                    ))
                  ) : (
                    <p className="text-text-secondary text-sm">
                      No skills added yet.
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-text-muted text-xs uppercase tracking-wide mb-1">
                    GitHub
                  </h3>
                  <p className="text-text-primary text-sm">
                    {user?.githubUsername ? `@${user.githubUsername}` : "—"}
                  </p>
                </div>
                <div>
                  <h3 className="text-text-muted text-xs uppercase tracking-wide mb-1">
                    Location
                  </h3>
                  <p className="text-text-primary text-sm">
                    {user?.location || "—"}
                  </p>
                </div>
                <div className="col-span-2">
                  <h3 className="text-text-muted text-xs uppercase tracking-wide mb-1">
                    Portfolio
                  </h3>
                  {user?.portfolio ? (
                    <a
                      href={user.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:text-accent-hover text-sm"
                    >
                      {user.portfolio}
                    </a>
                  ) : (
                    <p className="text-text-primary text-sm">—</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
