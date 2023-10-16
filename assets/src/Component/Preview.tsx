import React from "react"
import { RenderData } from "../Type/RenderData"
import { Actions } from "./Actions"
import { FileObject } from "../Type/FileObject"

interface Props {
  file: string | FileObject
  modifyId: string
  renderData: RenderData
  setToDelete: React.Dispatch<React.SetStateAction<boolean>>
  editBtn: string
  deleteBtn: string
}

export function Preview(props: Props) {
  const { file, editBtn, deleteBtn, setToDelete, renderData, modifyId } = props

  if (typeof file === "string") {
    return (
      <tr>
        <td className="hovered-nav-container">
          <Actions
            renderData={renderData}
            editBtn={editBtn}
            deleteBtn={deleteBtn}
            setToDelete={setToDelete}
            modifyId={modifyId}
          />
          <img alt={file} style={{ maxWidth: "100%", maxHeight: "200px" }} src={file} />
        </td>
      </tr>
    )
  }

  if (undefined === file.filename) {
    return false
  }

  const url = `${window.location.protocol}//${window.location.hostname}/${file.filepath}`

  return (
    <tr>
      <td className="hovered-nav-container">
        <Actions
          modifyId={modifyId}
          url={url}
          filename={file.filename}
          filesize={file.size}
          renderData={renderData}
          setToDelete={setToDelete}
          editBtn={editBtn}
          deleteBtn={deleteBtn}
        />
        <a href={url}>
          {["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "tiff", "tif", "ico"].includes(file.extension) && (
            <img alt={file.filename} style={{ maxWidth: "100%", maxHeight: "200px" }} src={url} />
          )}
        </a>
      </td>
    </tr>
  )
}

export default Preview
