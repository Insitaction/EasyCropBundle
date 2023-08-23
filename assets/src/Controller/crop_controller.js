import { Controller } from "@hotwired/stimulus";
import React from "react";
import CropperJs from "../Component/CropperJs";

export default class extends Controller {
  static values = {
    formFile: Object,
    formLabel: Object,
    formCropped: Object,
    render: Object,
    cropBtn: String,
  };

  connect() {
    console.log(this.renderValue)
    import('react-dom').then((ReactDOM) => {
      ReactDOM.default.render(
          <CropperJs renderData={this.renderValue} cropBtn={this.cropBtnValue} formCropped={this.formCroppedValue} formFile={this.formFileValue} formLabel={this.formLabelValue}/>,
          this.element,
      );
    });
  }
}
