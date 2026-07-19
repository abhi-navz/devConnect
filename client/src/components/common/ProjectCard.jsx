import { Link } from 'react-router-dom';
import SkillTag from './SkillTag';

const ProjectCard = ({ project }) => {
  const openRoles = project.rolesNeeded?.filter((r) => !r.filled) || [];

  return (
    <Link
      to={`/projects/${project._id}`}
      className="block bg-bg-secondary border border-border rounded-xl p-5 hover:border-accent transition-colors"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-text-primary font-semibold">{project.title}</h3>
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${
            project.status === 'open'
              ? 'bg-success/10 text-success'
              : 'bg-text-muted/10 text-text-muted'
          }`}
        >
          {project.status}
        </span>
      </div>

      <p className="text-text-secondary text-sm mb-3 line-clamp-2">{project.description}</p>

      {project.techStack?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.techStack.slice(0, 5).map((tech) => (
            <SkillTag key={tech} skill={tech} />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-xs">
        <p className="text-text-muted">
          {openRoles.length > 0
            ? `${openRoles.length} role${openRoles.length > 1 ? 's' : ''} open`
            : 'All roles filled'}
        </p>
        <p className="text-text-muted">by @{project.owner?.username}</p>
      </div>
    </Link>
  );
};

export default ProjectCard;