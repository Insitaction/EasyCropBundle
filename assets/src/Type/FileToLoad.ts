import React, { SetStateAction } from "react"

export type FileToLoad = {
  file: File
  setImage: React.Dispatch<React.SetStateAction<string>>
  setOpen: React.Dispatch<SetStateAction<boolean>>
}
