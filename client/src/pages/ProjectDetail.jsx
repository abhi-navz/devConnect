import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Button from "../components/common/Button";
import SkillTag from "../components/common/SkillTag";
import ApplicantsList from "../components/common/ApplicantsList";
import CreateProjectForm from "../components/common/CreateProjectForm";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import LoadingSpinner from "../components/common/LoadingSpinner";
import SuggestedDevelopers from "../components/common/SuggestedDevelopers";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applyingRole, setApplyingRole] = useState(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [myApplications, setMyApplications] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showApplicants, setShowApplicants] = useState(false);

  const fetchProject = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/projects/${projectId}`);
      setProject(data.project);
    } catch (err) {
      setError("Project not found");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyApplications = async () => {
    try {
      const { data } = await api.get("/applications/mine");
      setMyApplications(
        data.applications.filter((a) => a.project?._id === projectId)
      );
    } catch (err) {
      // Non-critical — if this fails, Apply buttons just won't show status; not worth blocking the page
    }
  };

  useEffect(() => {
    fetchProject();
    fetchMyApplications();
  }, [projectId]);

  const handleApply = async (roleId) => {
    setSubmitting(true);
    setError("");
    try {
      await api.post("/applications", { projectId, roleId, message });
      await fetchMyApplications();
      setApplyingRole(null);
      setMessage("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to apply");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async () => {
    const newStatus = project.status === "open" ? "closed" : "open";
    try {
      const { data } = await api.put(`/projects/${projectId}/status`, {
        status: newStatus,
      });
      setProject(data.project);
    } catch (err) {
      setError("Failed to update project status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <Navbar />
        <LoadingSpinner label="Loading project....." />
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <Navbar />
        <div className="text-center mt-12">
          <p className="text-danger mb-4">{error}</p>
          <Link to="/projects" className="text-accent hover:text-accent-hover">
            ← Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = project?.owner?._id === user?._id;

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-bg-secondary border border-border rounded-xl p-6">
          <div className="flex items-start justify-between mb-2">
            <h1 className="text-xl font-bold text-text-primary">
              {project.title}
            </h1>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  project.status === "open"
                    ? "bg-success/10 text-success"
                    : "bg-text-muted/10 text-text-muted"
                }`}
              >
                {project.status}
              </span>
              {isOwner && !isEditing && (
                <>
                  <Button variant="ghost" onClick={handleToggleStatus}>
                    {project.status === "open"
                      ? "Close Project"
                      : "Reopen Project"}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                </>
              )}
            </div>
          </div>

          {isEditing ? (
            <CreateProjectForm
              existingProject={project}
              onCreated={(updatedProject) => {
                setProject(updatedProject);
                setIsEditing(false);
              }}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <>
              <Link
                to={`/developers/${project.owner?.username}`}
                className="text-text-secondary text-sm hover:text-accent"
              >
                by @{project.owner?.username}
              </Link>

              <p className="text-text-primary text-sm mt-4 mb-4 whitespace-pre-wrap">
                {project.description}
              </p>

              {project.techStack?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.techStack.map((tech) => (
                    <SkillTag key={tech} skill={tech} />
                  ))}
                </div>
              )}

              {error && <p className="text-danger text-sm mb-4">{error}</p>}

              <h3 className="text-text-secondary text-xs uppercase tracking-wide mb-3">
                Roles Needed
              </h3>
              <div className="space-y-3">
                {project.rolesNeeded?.map((role) => {
                  const myApplication = myApplications.find(
                    (a) => a.roleId === role._id
                  );
                  return (
                    <div
                      key={role._id}
                      className="bg-bg-tertiary border border-border rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-text-primary text-sm font-medium">
                          {role.roleName}
                        </p>
                        {role.filled && (
                          <span className="text-text-muted text-xs">
                            Filled
                          </span>
                        )}
                      </div>
                      {role.skillsRequired?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {role.skillsRequired.map((s) => (
                            <SkillTag key={s} skill={s} />
                          ))}
                        </div>
                      )}

                      {isOwner &&
                        !role.filled &&
                        role.skillsRequired?.length > 0 && (
                          <SuggestedDevelopers
                            projectId={projectId}
                            roleId={role._id}
                            roleName={role.roleName}
                          />
                        )}

                      {!isOwner && project.status === "open" && (
                        <>
                          {myApplication ? (
                            <p
                              className={`text-xs mt-1 ${
                                myApplication.status === "accepted"
                                  ? "text-success"
                                  : myApplication.status === "rejected"
                                  ? "text-danger"
                                  : "text-warning"
                              }`}
                            >
                              {myApplication.status === "pending" &&
                                "⏳ Application pending"}
                              {myApplication.status === "accepted" &&
                                "✓ You were accepted!"}
                              {myApplication.status === "rejected" &&
                                "✗ Application rejected"}
                            </p>
                          ) : role.filled ? null : applyingRole === role._id ? (
                            <div className="mt-2">
                              <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={2}
                                placeholder="Optional message to the project owner..."
                                className="w-full bg-bg-primary border border-border text-text-primary text-sm rounded-lg px-3 py-2 placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none mb-2"
                              />
                              <div className="flex gap-2">
                                <Button
                                  variant="primary"
                                  onClick={() => handleApply(role._id)}
                                  disabled={submitting}
                                >
                                  {submitting
                                    ? "Sending..."
                                    : "Send Application"}
                                </Button>
                                <Button
                                  variant="ghost"
                                  onClick={() => setApplyingRole(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button
                              variant="secondary"
                              onClick={() => setApplyingRole(role._id)}
                            >
                              Apply
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              {isOwner && (
                <div className="mt-6 pt-6 border-t border-border">
                  <button
                    onClick={() => setShowApplicants(!showApplicants)}
                    className="text-accent text-sm hover:text-accent-hover mb-4"
                  >
                    {showApplicants ? "Hide Applicants" : "View Applicants"}
                  </button>
                  {showApplicants && (
                    <ApplicantsList
                      projectId={projectId}
                      onRoleFilled={fetchProject}
                    />
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
