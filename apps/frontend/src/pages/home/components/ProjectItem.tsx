import type { ProjectType } from '../../../types/types';

interface ProjectItemProps {
    project: ProjectType;
}

const ProjectItem = ({ project }: ProjectItemProps) => {
    return (
        <div className="list-item-container">
            <div className="flex-2">
                <h3>{project.name}</h3>
            </div>

            <div className="flex-1">
                <p>{new Date(project.date_created).toLocaleString()}</p>
            </div>

            <div className="flex-1 flex justify-end p-4">
                <div className="flex w-full h-2 bg-gray-600">
                    <div className="flex w-[40%] h-2 bg-green-600" />
                </div>
            </div>
        </div>
    );
};

export default ProjectItem;
