export type Project = {
    id: string;
    title: string;
    description: string;
    additionalInfo: string;
    ctime: string;
    mtime: string;
    exported?: boolean;
};

export type Subtitle = {
    text: string;
    start: number;
    end: number;
    translatedText?: string;
}