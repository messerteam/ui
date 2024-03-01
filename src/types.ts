export type Project = {
    id: string;
    title: string;
    description: string;
    additionalInfo: string;
    ctime: number;
    mtime: number;
    stage: string;
    exported?: boolean;
};

export type Subtitle = {
    text: string;
    start: number;
    end: number;
    translatedText?: string;
}