import React, { useState, useEffect, useRef } from "react"
import "cropperjs/dist/cropper.css"
import { FormInput } from "../Type/FormInput"
import { FormCropped } from "../Type/FormCropped"
import { FormLabel } from "../Type/FormLabel"
import { RenderData } from "../Type/RenderData"
import { CropperJsModal } from "./CropperJsModal"
import { Preview } from "./Preview"
import { FileObject } from "../Type/FileObject"
import { Translations } from "../Type/Translations"
import { sizeValidation, mimeValidation } from "../Utils/Validation"
import { loadImage } from "../Utils/Utils"
import { FileToLoad } from "../Type/FileToLoad"

interface Props {
  translations: Translations
  renderData: RenderData
  formFile: FormInput
  formLabel: FormLabel
  formCropped: FormCropped
}

export function CropperJs(props: Props) {
  const [open, setOpen] = useState(false)
  const [image, setImage] = useState("")
  const [previewImages, setPreviewImages] = useState<FileObject[] | string[]>([])
  const [toDelete, setToDelete] = useState(false)
  const [cropData, setCropData] = useState("")
  const [fileError, setFileError] = useState<Array<string>>([])

  const { renderData, translations, formLabel, formFile, formCropped } = props
  const labelRef = useRef<HTMLLabelElement | null>(null)

  useEffect(() => {
    if (undefined !== renderData?.currentFiles) {
      setPreviewImages(renderData?.currentFiles)
    }
  }, [props, renderData?.currentFiles])

  useEffect(() => {
    if (toDelete) {
      setPreviewImages([])
    }
  }, [toDelete])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files === undefined || e.target.files === null || e.target.files.item(0) === null) {
      return
    }

    const file = e.target.files.item(0)

    if (file === null) {
      return
    }

    if (!mimeValidation(labelRef, file, e)) {
      setFileError([translations.mimeError])
      return
    }

    const fileToLoad: FileToLoad = { file, setImage, setOpen }

    if (formCropped?.size.enableSizeValidation) {
      sizeValidation(fileToLoad, setFileError, translations, formCropped.size)
      return
    }

    loadImage(fileToLoad)
  }

  if (
    formLabel !== null &&
    formLabel !== undefined &&
    formFile !== null &&
    formFile !== undefined &&
    formCropped !== null &&
    formCropped !== undefined &&
    renderData !== null &&
    renderData !== undefined
  ) {
    return (
      <div>
        <div className="input-group" style={{ height: previewImages.length === 0 ? "30px" : "0" }}>
          <input
            type="file"
            className={formFile.class}
            title={formFile.title}
            name={formFile.name}
            id={formFile.id}
            placeholder={formFile.placeholder}
            onChange={onChange}
            required={formFile.required && previewImages.length === 0}
          />
          <input
            type="hidden"
            className={formCropped.class}
            name={formCropped.name}
            id={formCropped.id}
            value={cropData}
            required={formFile.required && previewImages.length === 0}
          />
          {previewImages.length === 0 && (
            <>
              <label ref={labelRef} htmlFor={formLabel.for} className={formLabel.class}>
                <span />
              </label>
              <div className="input-group-text">
                {/* eslint jsx-a11y/label-has-associated-control: ["error", { assert: "either" } ] */}
                <label className="btn" title="upload" htmlFor={formFile?.id}>
                  <i className="fa fa-folder-open-o" />
                </label>
              </div>
            </>
          )}
        </div>

        {previewImages.length !== 0 && (
          <div className=" form-control fileupload-list">
            <table className="fileupload-table">
              <tbody>
                {previewImages.map((file) => (
                  <Preview
                    key={typeof file === "string" ? file : file.filename}
                    file={file}
                    modifyId={formFile?.id}
                    renderData={renderData}
                    setToDelete={setToDelete}
                    editBtn={translations.editBtn}
                    deleteBtn={translations.deleteBtn}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        <CropperJsModal
          translations={translations}
          image={image}
          size={formCropped.size}
          setCropData={setCropData}
          setPreviewImages={setPreviewImages}
          setOpen={setOpen}
          open={open}
        />

        {renderData?.allow_delete && (
          <div className="d-none">
            <div className="form-check">
              <label className="form-check-label" htmlFor={renderData?.deleteId}>
                <input
                  type="checkbox"
                  id={renderData?.deleteId}
                  name={renderData?.deleteName}
                  className="form-check-input"
                  checked={toDelete}
                />
              </label>
            </div>
          </div>
        )}
        {fileError.map((error) => (
          <div className="invalid-feedback d-block">{error}</div>
        ))}
      </div>
    )
  }

  console.error("Unexpected error, some props are undefined.")

  return false
}

export default CropperJs
