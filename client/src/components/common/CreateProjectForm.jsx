import { useState } from "react";
import Button from "./Button";
import SkillTag from "./SkillTag";
import api from "../../api/axios";

const CreateProjectForm = ({ onCreated, onCancel }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState([]);
  const [techInput, setTechInput] = useState("");
  const [roles, setRoles] = useState([{ roleName: "", skillsRequired: [] }]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddTech = (e) => {
    e.preventDefault();
    const trimmed = techInput.trim();
    if (
      trimmed &&
      !techStack.some((t) => t.toLowerCase() === trimmed.toLowerCase())
    ) {
      setTechStack([...techStack, trimmed]);
    }
    setTechInput("");
  };

  const handleRoleChange = (index, field, value) => {
    const updated = [...roles];
    updated[index][field] = value;
    setRoles(updated);
  };

  const handleRoleSkillAdd = (index, skillValue) => {
    const trimmed = skillValue.trim();
    if (!trimmed) return;
    const updated = [...roles];
    if (
      !updated[index].skillsRequired.some(
        (s) => s.toLowerCase() === trimmed.toLowerCase()
      )
    ) {
      updated[index].skillsRequired.push(trimmed);
      setRoles(updated);
    }
  };

  const addRoleField = () => {
    setRoles([...roles, { roleName: "", skillsRequired: [] }]);
  };

  const removeRoleField = (index) => {
    setRoles(roles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required");
      return;
    }
    const validRoles = roles.filter((r) => r.roleName.trim());
    if (validRoles.length === 0) {
      setError("Add at least one role you need teammates for");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/projects", {
        title,
        description,
        techStack,
        rolesNeeded: validRoles,
      });
      onCreated(data.project);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
          e.preventDefault();
        }
      }}
      className="bg-bg-secondary border border-border rounded-xl p-6"
    >
      <h2 className="text-lg font-bold text-text-primary mb-4 font-mono">
        Post a Project
      </h2>

      {error && <p className="text-danger text-sm mb-3">{error}</p>}

      <div className="mb-4">
        <label className="block text-sm font-medium text-text-secondary mb-1.5">
          Project Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. AI-powered study planner"
          className="w-full bg-bg-tertiary border border-border text-text-primary rounded-lg px-4 py-2.5 placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-text-secondary mb-1.5">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          maxLength={1000}
          placeholder="What are you building, and what's the goal?"
          className="w-full bg-bg-tertiary border border-border text-text-primary rounded-lg px-4 py-2.5 placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-text-secondary mb-1.5">
          Tech Stack
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) =>
              (e.key === "Enter" || e.key === ",") && handleAddTech(e)
            }
            placeholder="e.g. React (Enter to add)"
            className="flex-1 bg-bg-tertiary border border-border text-text-primary rounded-lg px-4 py-2.5 placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <Button variant="secondary" onClick={handleAddTech}>
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <SkillTag
              key={tech}
              skill={tech}
              onRemove={() => setTechStack(techStack.filter((t) => t !== tech))}
            />
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Roles Needed
        </label>
        {roles.map((role, index) => (
          <div
            key={index}
            className="bg-bg-tertiary border border-border rounded-lg p-3 mb-2"
          >
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={role.roleName}
                onChange={(e) =>
                  handleRoleChange(index, "roleName", e.target.value)
                }
                placeholder="Role name (e.g. Frontend Developer)"
                className="flex-1 bg-bg-primary border border-border text-text-primary text-sm rounded-lg px-3 py-2 placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
              />
              {roles.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRoleField(index)}
                  className="text-text-muted hover:text-danger text-sm px-2"
                >
                  ×
                </button>
              )}
            </div>
            <input
              type="text"
              placeholder="Skills required, comma separated (e.g. React, Tailwind)"
              className="w-full bg-bg-primary border border-border text-text-primary text-sm rounded-lg px-3 py-2 placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent mb-1.5"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.target.blur(); // triggers the onBlur handler below to process the skills
                }
              }}
              onBlur={(e) => {
                e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .forEach((skill) => handleRoleSkillAdd(index, skill));
                e.target.value = "";
              }}
            />
            {role.skillsRequired.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {role.skillsRequired.map((s) => (
                  <SkillTag key={s} skill={s} />
                ))}
              </div>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addRoleField}
          className="text-accent text-sm hover:text-accent-hover"
        >
          + Add another role
        </button>
      </div>

      <div className="flex gap-3">
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Posting..." : "Post Project"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default CreateProjectForm;
