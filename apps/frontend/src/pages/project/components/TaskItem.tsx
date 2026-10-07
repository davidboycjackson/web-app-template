import type { TaskType } from '../../../types/types';
import { Link } from 'react-router';

interface TaskItemProps {
    task: TaskType;
}

const TaskItem = ({ task }: TaskItemProps) => {
    return (
        <Link
            to={`/tasks/${task.id}`}
            className="button-secondary"
        >
            <h3>{task.title}</h3>
        </Link>
    );
};

export default TaskItem;
