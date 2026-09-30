import { useState } from 'react';
import { useNavigate } from 'react-router';

const CreateProjectPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');

    async function handleCreateProject(e: React.FormEvent) {
        e.preventDefault();
        // Add logic to handle project creation here
        console.log('Creating project:', { projectName, projectDescription });
        setIsLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/projects`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: projectName, description: projectDescription }),
            });

            if (!response.ok) {
                throw new Error('Unable to fetch projects.');
            } else {
                navigate('/');
            }
        } catch (error) {
            setErrorMessage('Error creating project');
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
                <button type="submit" className="default-button">
                    Create Project
                </button>
            </form>
        </div>
    );
};

export default CreateProjectPage;
