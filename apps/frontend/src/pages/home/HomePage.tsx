import type { ProjectType } from '../../types/types';
import { useState, useEffect } from 'react';
import './HomePage.css';
import ProjectItem from './components/ProjectItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpAZ, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const HomePage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [projectList, setProjectList] = useState<ProjectType[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        // Implement search functionality here
    }

    useEffect(() => {
        async function fetchList() {
            setIsLoading(true);

            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/projects`);

                if (!response.ok) {
                    throw new Error('Unable to fetch projects.');
                }

                const data = (await response.json()) as ProjectType[];
                setProjectList(data);
            } catch (error) {
                console.log(error);
                setErrorMessage('Unable to load projects from the API.');
            } finally {
                setIsLoading(false);
            }
        }

        fetchList();
    }, []);

    return (
        <div className="page-body">
            <h1 data-testid="page-header">Homepage</h1>

            {isLoading && <p>Loading...</p>}

            {errorMessage && <p className="text-red-600">{errorMessage}</p>}

            <div className="flex">
                <div className="flex-1">
                    <form className="w-full flex my-2" onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search Projects"
                            className="w-full rounded-full rounded-r-none bg-white px-4 py-2"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="bg-white rounded-full rounded-l-none cursor-pointer w-16">
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </button>
                    </form>
                </div>

                <div className="flex-1 flex justify-end">
                    <button className="cursor-pointer h-full aspect-square">
                        <FontAwesomeIcon icon={faArrowUpAZ} size="lg" />
                    </button>
                </div>
            </div>

            <div className="list-container">
                {projectList.length === 0 && !isLoading && <p>No projects found.</p>}
                {projectList
                    .filter((project) =>
                        project.name.toLowerCase().includes(searchQuery.toLowerCase()),
                    )
                    .map((project) => (
                        <ProjectItem key={project.id} project={project} />
                    ))}
            </div>
        </div>
    );
};

export default HomePage;
