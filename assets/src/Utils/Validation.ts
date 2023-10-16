import loadImage from "./Utils";
import { FileToLoad } from "../Type/FileToLoad";
import React, { MutableRefObject } from "react";
import { Translations } from "../Type/Translations";
import { Resize } from "../Type/FormCropped";

export function sizeValidation(fileToLoad: FileToLoad, setFileError: React.Dispatch<React.SetStateAction<string[]>>, translations: Translations, size: Resize) {
  const img = new Image();
  const _URL = window.URL || window.webkitURL;
  img.onload = () => {
    const errors: string[] = []
    if (img.width < size?.width) {
      console.error('Width too small: ' + img.width)
      errors.push(translations.widthError)
    }

    if (img.height < size?.height) {
      console.error('Height too small: ' + img.height)
      errors.push(translations.heightError)
    }

    setFileError(errors)

    if (0 !== errors.length) {
      return
    }

    loadImage(fileToLoad)
  }

  img.src = _URL.createObjectURL(fileToLoad.file);
}

export function mimeValidation(labelRef: MutableRefObject<HTMLLabelElement | null>, file: File, e: React.ChangeEvent<HTMLInputElement>): boolean {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    e.target.value = '';
    if (null !== labelRef?.current && 'innerHTML' in labelRef?.current) {
      labelRef.current.innerHTML = "";
    }
    console.error('Unsupported file type: ' + file.type)

    return false
  }

  return true
}


export default sizeValidation;
