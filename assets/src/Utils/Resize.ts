import React from "react"
import Resizer from "react-image-file-resizer"
import { FileObject } from "../Type/FileObject"
import { Resize } from "../Type/FormCropped"

export function resize(
  size: Resize,
  setPreviewImages: React.Dispatch<React.SetStateAction<string[] | FileObject[]>>,
  setCropData: React.Dispatch<React.SetStateAction<string>>,
  cropData: Blob | null
) {
  if (cropData === null) {
    return
  }

  try {
    Resizer.imageFileResizer(
      cropData,
      size.width,
      size.height,
      size.format,
      100,
      0,
      // @ts-ignore
      (newFileUri: string) => {
        setCropData(newFileUri)
        setPreviewImages([newFileUri])
      },
      "base64",
      size.width,
      size.height
    )
  } catch (err) {
    console.error(err)
  }
}

export default resize
