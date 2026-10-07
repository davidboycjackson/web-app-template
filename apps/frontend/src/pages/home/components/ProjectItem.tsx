import type { ProjectType } from '../../../types/types';
import { Link } from 'react-router';

interface ProjectItemProps {
    project: ProjectType;
}

const ProjectItem = ({ project }: ProjectItemProps) => {
    const tasks = project.tasks ?? [];
    const completed = tasks.filter((task) => task.completed).length;
    const progress = tasks.length > 0 ? (completed / tasks.length) * 100 : 100;

    return (
        <Link to={`/projects/${project.id}`} className="container-default flex items-center">
            <div className="flex-2">
                <h3>{project.name}</h3>
            </div>

            <div className="flex-1 flex items-center -space-x-2">
                {project.assigned_users.map(({ user }) => (
                    <img
                        key={user.id}
                        src={user.profile_picture ?? '/default_user_icon.png'}
                        alt={`${user.first_name} ${user.last_name}`}
                        title={`${user.first_name} ${user.last_name}`}
                        className="w-8 h-8 rounded-full object-cover border-2 border-white"
                    />
                ))}
            </div>

            <div className="flex-1 flex justify-end p-4">
                <div className="flex w-full h-2 bg-gray-600">
                    <div
                        className="flex"
                        style={{
                            width: `${progress}%`,
                            height: '0.5rem',
                            backgroundColor: '#16a34a',
                        }}
                    />
                </div>
            </div>
        </Link>
    );
};

export default ProjectItem;
