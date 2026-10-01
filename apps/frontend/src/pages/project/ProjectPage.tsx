import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import type { ProjectType } from '../../types/types';

const ProjectPage = () => {
    const { projectId } = useParams();
    const [projectData, setProjectData] = React.useState<ProjectType | null>(null);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    const [taskName, setTaskName] = React.useState('');
    const [taskDescription, setTaskDescription] = React.useState('');
    const [isSaving, setIsSaving] = React.useState(false);

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

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ project_id: Number(projectId), name: taskName, description: taskDescription }),
            });

            if (!response.ok) {
                throw new Error('Unable to create task.');
            }

            const task = (await response.json()) as ProjectType['tasks'][number];
            setProjectData((current) => current && { ...current, tasks: [...current.tasks, task] });
            setTaskName('');
            setTaskDescription('');
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
                <div>
                    <h2>{projectData.name}</h2>
                    <p>{projectData.description}</p>
                    <h3>Tasks</h3>
                    <ul>
                        {projectData.tasks.map((task) => (
                            <li key={task.id}>
                                <h4>{task.name}</h4>
                                <p>{task.description}</p>
                            </li>
                        ))}
                    </ul>
                    <form onSubmit={handleAddTask} className="flex flex-col gap-4 mt-4">
                        <input
                            className="default-input"
                            placeholder="Task name"
                            aria-label="Task name"
                            required
                            maxLength={255}
                            value={taskName}
                            onChange={(event) => setTaskName(event.target.value)}
                        />
                        <textarea
                            className="default-input resize-none"
                            placeholder="Description"
                            aria-label="Task description"
                            maxLength={255}
                            value={taskDescription}
                            onChange={(event) => setTaskDescription(event.target.value)}
                        />
                        <button type="submit" className="default-button" disabled={isSaving}>
                            {isSaving ? 'Adding...' : 'Add task'}
                        </button>
                    </form>
                </div>
            ) : errorMessage ? null : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default ProjectPage;
