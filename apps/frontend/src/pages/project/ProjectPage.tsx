import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import type { ProjectType } from '../../types/types';
import { useAuth } from '../../context/useAuth';
import AddTaskModal from './AddTaskModal';

const ProjectPage = () => {
    const { projectId } = useParams();
    const { user } = useAuth();
    const [projectData, setProjectData] = React.useState<ProjectType | null>(null);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    const [taskName, setTaskName] = React.useState('');
    const [taskDescription, setTaskDescription] = React.useState('');
    const [isSaving, setIsSaving] = React.useState(false);
    const [isAddTaskOpen, setIsAddTaskOpen] = React.useState(false);

    useEffect(() => {
        async function fetchProjectData() {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/projects/${projectId}`,
                );

                if (!response.ok) {
                    throw new Error('Unable to fetch projects.');
                }

                const data = (await response.json()) as ProjectType;

                setProjectData(data);
            } catch (error) {
                console.error('Unexpected error fetching project data:', error);
                setErrorMessage('Unable to load projects from the API.');
            }
        }
        fetchProjectData();
    }, [projectId]);

    async function handleAddTask(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSaving(true);
        setErrorMessage(null);

        if (!user) {
            setErrorMessage('Please log in before adding a task.');
            setIsSaving(false);
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    project_id: Number(projectId),
                    user_created_id: user.id,
                    name: taskName,
                    description: taskDescription,
                }),
            });

            if (!response.ok) {
                throw new Error('Unable to create task.');
            }

            const task = (await response.json()) as ProjectType['tasks'][number];
            setProjectData((current) => current && { ...current, tasks: [...current.tasks, task] });
            setTaskName('');
            setTaskDescription('');
            setIsAddTaskOpen(false);
        } catch {
            setErrorMessage('Unable to create task.');
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="page-body">
            {errorMessage && <p className="text-red-600">{errorMessage}</p>}
            {projectData ? (
                <div className="flex flex-col gap-4">
                    <div className="border rounded-2xl p-4 bg-white flex flex-col gap-2">
                        <h1>{projectData.name}</h1>
                        <h4>Description:</h4>
                        <p>{projectData.description}</p>
                    </div>

                    <hr />

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <h2>Feed</h2>
                            <ul className="flex flex-col gap-2">
                                {projectData.updates.map((update) => (
                                    <div
                                        key={update.id}
                                        className="border rounded-2xl p-4 bg-white/40 flex flex-col gap-2"
                                    >
                                        <h3>{update.content}</h3>
                                        <p>Created by User ID: {update.user_created_id}</p>
                                        <small>{update.date_created}</small>
                                    </div>
                                ))}
                            </ul>
                        </div>

                        <div className="flex-1">
                            <h2>Tasks</h2>
                            <ul className="flex flex-col gap-2">
                                {projectData.tasks.map((task) => (
                                    <li
                                        key={task.id}
                                        className="border rounded-2xl p-4 bg-white/40 flex flex-col gap-2"
                                    >
                                        <h3>{task.name}</h3>
                                    </li>
                                ))}
                            </ul>

                            <button
                                type="button"
                                className="primary-button mt-4"
                                onClick={() => setIsAddTaskOpen(true)}
                            >
                                Add Task
                            </button>
                        </div>
                    </div>

                    <AddTaskModal
                        isOpen={isAddTaskOpen}
                        isSaving={isSaving}
                        taskName={taskName}
                        taskDescription={taskDescription}
                        onTaskNameChange={setTaskName}
                        onTaskDescriptionChange={setTaskDescription}
                        onClose={() => setIsAddTaskOpen(false)}
                        onSubmit={handleAddTask}
                    />
                </div>
            ) : errorMessage ? null : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default ProjectPage;
