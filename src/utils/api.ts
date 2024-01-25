import { env } from "~/env.mjs";
import type { Project, Subtitle } from "~/types";
import { generateWords } from "./utils";
import dayjs from 'dayjs';


interface IAPI {
    createSubtitles(params: any): Promise<any>;
    exportVideo(videoId: string, exportOptions: string, params: any): Promise<any>;
    getProjects(): Promise<Project[]>;
    getProject(projectId: string): Promise<Project>;
    updateProject(projectId: string, params: any): Promise<Project>;
    getSubtitles(projectId: string): Promise<any>;
}

export class MockAPI implements IAPI {
    private baseUrl: string;
    private projects: Project[];
    private subtitles: Subtitle[][];

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;

        this.projects = Array.from({ length: 25 }, (_, i) => {
            return {
                id: String(i + 1),
                title: generateWords(2),
                description: generateWords(8),
                additionalInfo: generateWords(8),
                exported: false,
                // The format is 2024-01-20 19:40:34.972326.
                // Randomize the date.
                ctime: dayjs().subtract(Math.floor(Math.random() * 365), 'day').format('YYYY-MM-DD HH:mm:ss.SSSSSS'),
                mtime: dayjs().subtract(Math.floor(Math.random() * 365), 'day').format('YYYY-MM-DD HH:mm:ss.SSSSSS'),
            }
        });

        this.subtitles = Array.from({ length: 25 }, (_, __) => {
            return Array.from({ length: 15 }, (_, j) => {
                return {
                    id: j + 1,
                    start: j * 1000,
                    end: (j + 1) * 1000,
                    text: generateWords(5),
                }
            })
        });
    }

    getProjects(): Promise<Project[]> {
        return Promise.resolve(this.projects);
    }

    getProject(projectId: string): Promise<Project> {
        return Promise.resolve(this.projects.find(project => project.id === projectId)) as Promise<Project>;
    }

    getSubtitles(projectId: string): Promise<any> {
        return Promise.resolve({ subtitles: this.subtitles.at(projectId as number) });
    }

    updateProject(projectId: string, params: any): Promise<Project> {
        return Promise.resolve(this.projects.find(project => project.id === projectId)) as Promise<Project>;
    }

    createSubtitles(params: any): Promise<any> {
        return Promise.resolve({ projectId: '1' });
    }

    exportVideo(videoId: string, exportOptions: string, params: any): Promise<any> {
        return Promise.resolve({});
    }
}


export class API implements IAPI {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    public async createSubtitles(params: any) {
        const response = await fetch(`${this.baseUrl}/project`, {
            method: 'POST',
            body: params,
        });

        return response.json();
    }

    public async exportVideo(videoId: string, exportOptions: string, params: any) {
        const response = await fetch(`${this.baseUrl}/export_video?projectId=${videoId}&export_options=${exportOptions}`, {
            method: 'POST',
            body: params
        });

        return response.json();
    }

    public async getProjects(): Promise<Project[]> {
        const response = await fetch(`${this.baseUrl}/projects`, {
            method: 'GET'
        });

        return response.json() as Promise<Project[]>;
    }

    public async getProject(projectId: string): Promise<Project> {
        const response = await fetch(`${this.baseUrl}/project?projectId=${projectId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.json() as Promise<Project>;
    }

    public async updateProject(projectId: string, params: any): Promise<Project> {
        const response = await fetch(`${this.baseUrl}/project/${projectId}`, {
            method: 'PATCH',
            body: params,
        });

        return response.json() as Promise<Project>;
    }

    public async getSubtitles(projectId: string) {
        const response = await fetch(`${this.baseUrl}/subtitles?projectId=${projectId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.json();
    }
}

export default API;

export const getAPI = (baseUrl: string): IAPI => {
    if (env.NEXT_PUBLIC_NODE_ENV === 'development') {
        return new MockAPI(baseUrl);
    }

    return new API(baseUrl);
}