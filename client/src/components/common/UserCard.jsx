import { Link } from "react-router-dom";
import SkillTag from "./SkillTag";

const UserCard = ({ user }) => {
  return (
    <Link
      to={`/developers/${user.username}`}
      className="block bg-bg-secondary border border-border rounded-xl p-5 hover:border-accent hover:-translate-y-0.5 transition-all duration-150"
    >
      <div className="flex items-center gap-3 mb-3">
        {user.profilePicture ? (
          <img
            src={user.profilePicture}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover border border-border"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className="w-12 h-12 rounded-full bg-bg-tertiary border border-border items-center justify-center text-lg font-bold text-accent"
          style={{ display: user.profilePicture ? "none" : "flex" }}
        >
          {user.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <h3 className="text-text-primary font-semibold text-sm">
            {user.name}
          </h3>
          <p className="text-text-secondary text-xs">@{user.username}</p>
        </div>
      </div>

      {user.bio && (
        <p className="text-text-secondary text-sm mb-3 line-clamp-2">
          {user.bio}
        </p>
      )}

      {user.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {user.skills.slice(0, 4).map((skill) => (
            <SkillTag key={skill} skill={skill} />
          ))}
          {user.skills.length > 4 && (
            <span className="text-text-muted text-xs self-center">
              +{user.skills.length - 4} more
            </span>
          )}
        </div>
      )}

      {user.location && (
        <p className="text-text-muted text-xs">📍 {user.location}</p>
      )}
    </Link>
  );
};

export default UserCard;
