import { FileObject } from "./FileObject"

export type RenderData = {
  size: string
  allow_delete: boolean
  deleteId: string
  currentFiles: FileObject[]
  deleteName: string
}
