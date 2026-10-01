import { useState } from 'react';
import type { ProjectTaskInput } from '../../types/types';
import { useNavigate } from 'react-router';

const CreateProjectPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [projectTasks, setProjectTasks] = useState<ProjectTaskInput[]>([]);

    async function handleCreateProject(e: React.FormEvent) {
        e.preventDefault();

        // Check if project name and description are provided
        if (!projectName || !projectDescription) {
            setErrorMessage('Please provide both project name and description.');
            return;
        }

        // Check if tasks empty
        if (projectTasks.length === 0) {
            setErrorMessage('Please add at least one task.');
            return;
        }

        // Add logic to handle project creation here
        console.log('Creating project:', { projectName, projectDescription });
        setIsLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/projects`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: projectName,
                    description: projectDescription,
                    tasks: projectTasks.map(({ name, description }) => ({ name, description })),
                }),
            });

            if (!response.ok) {
                throw new Error(`Unable to create project (HTTP ${response.status}).`);
            } else {
                navigate('/');
            }
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Error creating project');
            console.error('Error creating project:', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="page-body">
            <h1>Create Project Page</h1>

            {isLoading && <p>Loading...</p>}

            {errorMessage && <p className="text-red-600">{errorMessage}</p>}

            <form onSubmit={handleCreateProject} className="flex flex-col gap-4">
                <input
                    className="default-input"
                    type="text"
                    placeholder="Project Name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                />
                <textarea
                    rows={4}
                    className="default-input resize-none"
                    placeholder="Project Description"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                />

                {projectTasks.map((task, index) => (
                    <div key={index} className="flex flex-col gap-2">
                        <input
                            className="default-input"
                            type="text"
                            placeholder="Task Name"
                            value={task.name}
                            onChange={(e) => {
                                const newTasks = [...projectTasks];
                                newTasks[index].name = e.target.value;
                                setProjectTasks(newTasks);
                            }}
                        />
                        <textarea
                            rows={2}
                            className="default-input resize-none"
                            placeholder="Task Description"
                            value={task.description}
                            onChange={(e) => {
                                const newTasks = [...projectTasks];
                                newTasks[index].description = e.target.value;
                                setProjectTasks(newTasks);
                            }}
                        />
                    </div>
                ))}

                <button
                    type="button"
                    onClick={() =>
                        setProjectTasks([
                            ...projectTasks,
                                { name: '', description: '' },
                        ])
                    }
                >
                    Add Task
                </button>

                <button type="submit" className="default-button">
                    Create Project
                </button>
            </form>
        </div>
    );
};

export default CreateProjectPage;
