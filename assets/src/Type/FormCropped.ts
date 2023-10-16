export type FormCropped = {
  id: string
  name: string
  class: string
  required: boolean
  size: Resize
}

export type Resize = {
  width: number
  height: number
  format: string
  enableSizeValidation: boolean
  enableResize: boolean
}
