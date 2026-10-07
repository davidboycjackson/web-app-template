import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import type { TaskType } from '../../types/types';
import { useAuth } from '../../context/useAuth';

const TaskPage = () => {
    const { taskId } = useParams();
    const { user } = useAuth();
    const [taskData, setTaskData] = React.useState<TaskType | null>(null);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    const [isSaving, setIsSaving] = React.useState(false);
    const [updateContent, setUpdateContent] = React.useState('');

    async function handleToggleTaskComplete(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/tasks/${taskId}/toggle-complete`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                },
            );

            if (!response.ok) {
                throw new Error('Unable to toggle task completion.');
            }

            const updatedTask = (await response.json()) as TaskType;
            setTaskData(updatedTask);
        } catch {
            setErrorMessage('Unable to toggle task completion.');
        }
    }

    async function handlePostUpdate(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        // Implement the logic to post an update here

        if (!user) {
            setErrorMessage('Please log in before adding a task.');
            setIsSaving(false);
            return;
        }

        if (!taskData) {
            setErrorMessage('Task data is not available.');
            setIsSaving(false);
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/updates`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: updateContent,
                    user_created_id: user.id,
                    task_id: taskData.id,
                    project_id: Number(taskId),
                }),
            });

            if (!response.ok) {
                throw new Error('Unable to create task.');
            }

            const update = (await response.json()) as TaskType['updates'][number];
            setTaskData(
                (current) => current && { ...current, updates: [...current.updates, update] },
            );
            setUpdateContent('');
        } catch {
            setErrorMessage('Unable to create task.');
        } finally {
            setIsSaving(false);
        }
    }

    useEffect(() => {
        async function fetchTaskData() {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/tasks/${taskId}`,
                );

                if (!response.ok) {
                    throw new Error('Unable to fetch tasks.');
                }

                const data = (await response.json()) as TaskType;
                console.log(data);
                setTaskData(data);
            } catch (error) {
                console.error('Unexpected error fetching task data:', error);
                setErrorMessage('Unable to load tasks from the API.');
            }
        }
        fetchTaskData();
    }, [taskId]);

    return (
        <div className="page-body">
            {errorMessage && <p className="text-red-600">{errorMessage}</p>}
            {taskData ? (
                <>
                    {/* Task Details */}
                    <div className="container-default">
                        <div className="flex justify-between items-center">
                            <h1>{taskData.title}</h1>

                            <button
                                className={
                                    taskData.completed ? 'button-primary' : 'button-secondary'
                                }
                                disabled={isSaving}
                                onClick={handleToggleTaskComplete}
                            >
                                {taskData.completed ? 'Completed' : 'Mark Complete'}
                            </button>
                        </div>
                        <h4>Description:</h4>
                        <p>{taskData.description}</p>
                    </div>

                    {/* Task Feed */}
                    <div className="flex flex-1 flex-col gap-4">
                        <div className="flex-2">
                            <h2>Feed</h2>
                            <ul className="flex flex-col gap-2">
                                {taskData.updates.map((update) => (
                                    <div
                                        key={update.id}
                                        className="container-default"
                                    >
                                        <h3>{update.content}</h3>
                                        <p>Created by User ID: {update.user_created_id}</p>
                                        <small>{update.date_created}</small>
                                    </div>
                                ))}
                            </ul>
                        </div>

                        {/* Add Update */}
                        <div className="flex-1">
                            <form onSubmit={handlePostUpdate} className="flex flex-col gap-2 justify-end">
                                <textarea
                                    value={updateContent}
                                    onChange={(e) => setUpdateContent(e.target.value)}
                                    className="input-default"
                                />
                                <button
                                    disabled={isSaving}
                                    type="submit"
                                    className="button-primary"
                                >
                                    Add Update
                                </button>
                            </form>
                        </div>
                    </div>
                </>
            ) : errorMessage ? null : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default TaskPage;
