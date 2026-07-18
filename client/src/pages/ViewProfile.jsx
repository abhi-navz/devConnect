import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import SkillTag from "../components/common/SkillTag";
import api from "../api/axios";
import ConnectButton from "../components/common/ConnectButton";

const ViewProfile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get(`/users/${username}`);
        setProfile(data.user);
      } catch (err) {
        setError(err.response?.data?.message || "Developer not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <Navbar />
        <p className="text-text-secondary text-center mt-12">
          Loading profile...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12 text-center">
          <p className="text-danger mb-4">{error}</p>
          <Link to="/discover" className="text-accent hover:text-accent-hover">
            ← Back to Discover
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-bg-secondary border border-border rounded-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {profile?.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt={profile.name}
                  className="w-16 h-16 rounded-full object-cover border border-border"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className="w-16 h-16 rounded-full bg-bg-tertiary border border-border items-center justify-center text-2xl font-bold text-accent"
                style={{ display: profile?.profilePicture ? "none" : "flex" }}
              >
                {profile?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-bold text-text-primary">
                  {profile?.name}
                </h1>
                <p className="text-text-secondary text-sm">
                  @{profile?.username}
                </p>
              </div>
            </div>
            {profile?._id && <ConnectButton targetUserId={profile._id} />}
          </div>

          <div className="space-y-5">
            <div>
              <h3 className="text-text-muted text-xs uppercase tracking-wide mb-1">
                Bio
              </h3>
              <p className="text-text-primary">
                {profile?.bio || "No bio added yet."}
              </p>
            </div>

            <div>
              <h3 className="text-text-muted text-xs uppercase tracking-wide mb-2">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile?.skills?.length ? (
                  profile.skills.map((skill) => (
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
                  {profile?.githubUsername ? `@${profile.githubUsername}` : "—"}
                </p>
              </div>
              <div>
                <h3 className="text-text-muted text-xs uppercase tracking-wide mb-1">
                  Location
                </h3>
                <p className="text-text-primary text-sm">
                  {profile?.location || "—"}
                </p>
              </div>
              <div className="col-span-2">
                <h3 className="text-text-muted text-xs uppercase tracking-wide mb-1">
                  Portfolio
                </h3>
                {profile?.portfolio ? (
                  <a
                    href={profile.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent-hover text-sm"
                  >
                    {profile.portfolio}
                  </a>
                ) : (
                  <p className="text-text-primary text-sm">—</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
