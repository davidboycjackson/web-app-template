import React, { useEffect, useRef } from 'react';

type AddTaskModalProps = {
    isOpen: boolean;
    isSaving: boolean;
    taskName: string;
    taskDescription: string;
    onTaskNameChange: (value: string) => void;
    onTaskDescriptionChange: (value: string) => void;
    onClose: () => void;
    onSubmit: (event: React.SubmitEvent<HTMLFormElement>) => void;
};

const AddTaskModal = ({
    isOpen,
    isSaving,
    taskName,
    taskDescription,
    onTaskNameChange,
    onTaskDescriptionChange,
    onClose,
    onSubmit,
}: AddTaskModalProps) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isOpen && !dialog.open) {
            dialog.showModal();
        } else if (!isOpen && dialog.open) {
            dialog.close();
        }
    }, [isOpen]);

    return (
        <dialog
            ref={dialogRef}
            aria-labelledby="add-task-title"
            onClose={onClose}
            onClick={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
            className="m-auto w-[min(28rem,calc(100%-2rem))] rounded-xl border border-gray-200 p-6 shadow-xl backdrop:bg-black/50"
        >
            <div className="mb-4 flex items-center justify-between gap-4">
                <h2 id="add-task-title">Add Task</h2>
                <button
                    type="button"
                    className="secondary-button"
                    onClick={onClose}
                    disabled={isSaving}
                >
                    Cancel
                </button>
            </div>
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <input
                    className="default-input"
                    placeholder="Task name"
                    aria-label="Task name"
                    autoFocus
                    required
                    maxLength={255}
                    value={taskName}
                    onChange={(event) => onTaskNameChange(event.target.value)}
                />
                <textarea
                    rows={2}
                    className="default-input resize-none"
                    placeholder="Description"
                    aria-label="Task description"
                    maxLength={255}
                    value={taskDescription}
                    onChange={(event) => onTaskDescriptionChange(event.target.value)}
                />
                <button type="submit" className="primary-button" disabled={isSaving}>
                    {isSaving ? 'Adding...' : 'Add task'}
                </button>
            </form>
        </dialog>
    );
};

export default AddTaskModal;