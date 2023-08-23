import {File} from "./File";

export type RenderData = {
    size: string;
    allow_delete: boolean;
    deleteId: string;
    currentFiles: File[];
};
