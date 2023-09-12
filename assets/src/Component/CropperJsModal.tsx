import React, { useRef } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Box, Modal, Typography } from "@mui/material";
import { File } from "../Type/File";

interface Props {
  cropBtn: string;
  setCropData: React.Dispatch<React.SetStateAction<string>>;
  setPreviewImages: React.Dispatch<React.SetStateAction<string[] | File[]>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  image: string;
  open: boolean;
}

export function CropperJsModal(props: Props) {
  const cropperRef = useRef<ReactCropperElement>(null);
  const {
    cropBtn, setPreviewImages, setCropData, image, open, setOpen,
  } = props;
  const handleClose = () => setOpen(false);

  const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const getCropData = () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      setCropData(cropperRef.current?.cropper.getCroppedCanvas()
        .toDataURL());
      setPreviewImages([cropperRef.current?.cropper.getCroppedCanvas()
        .toDataURL()]);
    }

    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <div style={{ width: "100%" }}>
            <Cropper
              style={{
                height: 400,
                width: "100%",
              }}
              initialAspectRatio={1}
              preview=".img-preview"
              src={image}
              ref={cropperRef}
              viewMode={1}
              guides
              minCropBoxHeight={10}
              minCropBoxWidth={10}
              background={false}
              responsive
              checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
            />
          </div>
          <div style={{
            textAlign: "center",
            padding: "20px",
          }}
          >
            <button type="button" className="btn btn-primary action-save" onClick={getCropData}>
              <span className="btn-label">
                <i className="action-icon fa fa-crop" />
                <span className="action-label">
                  {" "}
                  {cropBtn}
                </span>
              </span>
            </button>
          </div>
          <br style={{ clear: "both" }} />
        </Typography>
      </Box>
    </Modal>
  );
}

export default CropperJsModal;
