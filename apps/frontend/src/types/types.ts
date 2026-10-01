export type ProjectType = {
    id: number;
    name: string;
    description: string | null;
    tasks: TaskType[];
    date_created: string;
};

export type ProjectTaskInput = {
    name: string;
    description: string;
};

export type TaskType = {
    id: number;
    project_id: number;
    name: string;
    description: string | null;
    date_created: string;
};


export type AuthUser = {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    date_created: string;
};