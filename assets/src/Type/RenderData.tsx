import {File} from "./File";

export type RenderData = {
    download_path: string;
    size: string;
    allow_delete: boolean;
    deleteId: string;
    currentFiles: File[];
};
