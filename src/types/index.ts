export interface VideoQuality {
    label: string; // e.g., '1080p', '720p'
    src: string;
}

export interface Video {
    id: string;
    title: string;
    thumbnail?: string; // Optional URL
    description?: string;
    minDurationSeconds: number; // Duration user must watch before 'complete'
    qualities: VideoQuality[];
}

export interface UserProgress {
    videoId: string;
    completed: boolean;
    watchedSeconds: number;
}
