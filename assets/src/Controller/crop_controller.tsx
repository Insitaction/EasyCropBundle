import React from "react"
import { CropperJs } from "../Component/CropperJs"
import AbstractController from "./AbstractController"
import { RenderData } from "../Type/RenderData"
import { FormInput } from "../Type/FormInput"
import { FormLabel } from "../Type/FormLabel"
import { FormCropped } from "../Type/FormCropped"
import { Translations } from "../Type/Translations"

export default class extends AbstractController<HTMLButtonElement> {
  static values = {
    formFile: Object,
    formLabel: Object,
    formCropped: Object,
    render: Object,
    translations: Object,
  }

  declare readonly formFileValue: FormInput

  declare readonly formLabelValue: FormLabel

  declare readonly formCroppedValue: FormCropped

  declare readonly renderValue: RenderData

  declare readonly translationsValue: Translations

  connect() {
    import("react-dom").then((ReactDOM) => {
      ReactDOM.default.render(
        <CropperJs
          renderData={this.renderValue}
          translations={this.translationsValue}
          formCropped={this.formCroppedValue}
          formFile={this.formFileValue}
          formLabel={this.formLabelValue}
        />,
        this.element
      )
    })
  }
}
