import React, {useState, useRef, useEffect} from "react";
import Cropper, {ReactCropperElement} from "react-cropper";
import "cropperjs/dist/cropper.css";
import {Box, Modal, Typography} from "@mui/material";
import {FormInput} from "../Type/FormInput";
import {FormCropped} from "../Type/FormCropped";
import {FormLabel} from "../Type/FormLabel";
import {RenderData} from "../Type/RenderData";
import {File} from "../Type/File";

export const CropperJs: React.FC = (props: {
    cropBtn?: String;
    renderData?: RenderData;
    formFile?: FormInput;
    formLabel?: FormLabel;
    formCropped?: FormCropped
}) => {
    const [open, setOpen] = React.useState(false);
    const handleClose = () => setOpen(false);
    const [image, setImage] = useState("");
    const [previewImages, setPreviewImages] = useState<File[]|string[]>([]);
    const [cropData, setCropData] = useState("");
    const cropperRef = useRef<ReactCropperElement>(null);

    useEffect(() => {
        if (undefined !== props.renderData?.currentFiles) {
            setPreviewImages(props.renderData?.currentFiles);
        }
    }, [props]);

    const onChange = (e: any) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result as any);
        };
        reader.readAsDataURL(files[0]);
        setOpen(true)
    };

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const getCropData = () => {
        if (typeof cropperRef.current?.cropper !== "undefined") {
            // @ts-ignore
            setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
            setPreviewImages([cropperRef.current?.cropper.getCroppedCanvas().toDataURL()]);
        }

        setOpen(false)
    };

    if (undefined === props.cropBtn || undefined === props.formLabel || undefined === props.formFile || undefined === props.formCropped) {
        console.error("Unexpected error, some props are undefined.")
        return (<></>);
    }

    return (
        <div>
            <div className={"input-group"}>
            <input
                type={"file"}
                className={props.formFile.class}
                title={props.formFile.title}
                name={props.formFile.name}
                id={props.formFile.id}
                placeholder={props.formFile.placeholder}
                onChange={onChange}
                required={props.formFile.required}
            />
            <input type={"hidden"}
                   className={props.formCropped.class}
                   name={props.formCropped.name}
                   id={props.formCropped.id}
                   value={cropData}
                   required={props.formCropped.required}
            />
            <label htmlFor={props.formLabel.for} className={props.formLabel.class}></label>
            <div className="input-group-text">
                {props.renderData?.size}
                {
                    props.renderData?.allow_delete &&
                  <label className="btn ea-fileupload-delete-btn {{ currentFiles is empty ? 'd-none' }}" title="delete"
                         htmlFor={props.renderData?.deleteId}>
                    <i className="fa fa-trash-o"></i>
                  </label>

                }

                <label className="btn" title="upload" htmlFor={props.formFile?.id}>
                    <i className="fa fa-folder-open-o"></i>
                </label>

            </div>
            </div>
            <div className=" form-control fileupload-list">
                <table className="fileupload-table">
                    <tbody>

                    {
                        previewImages.map(function (file, i) {
                            if (typeof file === 'string') {
                                return <tr>
                                    <td><img style={{maxWidth: "100%", maxHeight: "200px"}}
                                             src={file}/></td>
                                </tr>
                            }

                            if (undefined === file.filename) {
                                return <></>
                            }

                            const url = window.location.protocol + '//' + window.location.hostname + '/' + file.filepath

                            return <tr>
                                <td>
                                    <a href={url}>
                                        {
                                            ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff', 'tif', 'ico'].includes(file.extension) &&
                                          <img style={{maxWidth: "100%", maxHeight: "200px"}}
                                               src={url}/>
                                        }
                                        <span title="{{ file.mTime|date }}">
                                        <i className="fa fa-file-o"></i> {file.filename}
                                    </span>
                                    </a>

                                </td>
                                <td className="text-right file-size">{file.size}</td>
                            </tr>
                        })
                    }
                    </tbody>
                </table>
            </div>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-description" sx={{mt: 2}}>
                        <div style={{width: "100%"}}>
                            <Cropper
                                style={{height: 400, width: "100%"}}
                                initialAspectRatio={1}
                                preview=".img-preview"
                                src={image}
                                ref={cropperRef}
                                viewMode={1}
                                guides={true}
                                minCropBoxHeight={10}
                                minCropBoxWidth={10}
                                background={false}
                                responsive={true}
                                checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                            />
                        </div>
                        <div style={{textAlign: "center", padding: "20px"}}>
                            <button className="btn btn-primary action-save" onClick={getCropData}>
                    <span className="btn-label">
                        <i className="action-icon fa fa-crop"></i>
                        <span className="action-label">  {props.cropBtn}</span>
                    </span>
                            </button>
                        </div>
                        <br style={{clear: "both"}}/>
                    </Typography>
                </Box>
            </Modal>
        </div>
    )
        ;
};

export default CropperJs;
