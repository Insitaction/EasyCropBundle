import React from "react"
import { RenderData } from "../Type/RenderData"

interface Props {
  modifyId: string | undefined
  url?: string | undefined
  filename?: string | undefined
  filesize?: string | undefined
  renderData: RenderData
  setToDelete: React.Dispatch<React.SetStateAction<boolean>>
  editBtn: string
  deleteBtn: string
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore fields are required
const defaultProps: Props = {
  url: undefined,
  filename: undefined,
  filesize: undefined,
}

export function Actions(props: Props) {
  const { filesize, editBtn, deleteBtn, setToDelete, renderData, filename, url, modifyId } = props

  return (
    <div className="hovered-nav">
      <div>
        {undefined !== modifyId && (
          <label title="Upload" htmlFor={modifyId}>
            <div className="btn btn-primary action-save">
              <span className="btn-label">
                <i className="action-icon fa fa-folder-open-o" />
                <span className="action-label"> {editBtn}</span>
              </span>
            </div>
          </label>
        )}

        {undefined !== renderData && renderData?.allow_delete && (
          /* eslint jsx-a11y/label-has-associated-control: ["error", { assert: "either" } ] */
          <label title="Delete" htmlFor={renderData?.deleteId}>
            <button
              className="btn btn-primary action-save"
              type="button"
              onClick={() => {
                if (undefined !== setToDelete) {
                  setToDelete(true)
                }
              }}
              onKeyDown={() => {
                if (undefined !== setToDelete) {
                  setToDelete(true)
                }
              }}
            >
              <span className="btn-label">
                <i className="action-icon fa fa-trash-o" />
                <span className="action-label"> {deleteBtn}</span>
              </span>
            </button>
          </label>
        )}
      </div>

      <div>
        {undefined !== filesize && <span className="text-right file-size">{filesize}</span>}
        {undefined !== url && (
          <span>
            <a href={url}>
              <i className="fa fa-file-o" /> {filename}
            </a>
          </span>
        )}
        {undefined === url && undefined !== filename && (
          <span>
            <i className="fa fa-file-o" /> {filename}
          </span>
        )}
      </div>
    </div>
  )
}

Actions.defaultProps = defaultProps

export default Actions
