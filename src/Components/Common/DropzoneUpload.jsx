import React from "react";
import Dropzone from "react-dropzone";
import { Card } from "reactstrap";
import { Link } from "react-router-dom";

const DropzoneUpload = ({ onDrop, file, compact = false, thumbSize = 80 }) => {
  const previewSize = compact ? 56 : thumbSize;
  const formatBytes = (bytes, decimals = 2) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const renderPreviewThumbnail = (file) => {
    const isImage = file && file.type && file.type.startsWith("image/");
    const isPdf = file && file.type === "application/pdf";

    if (isImage && file.preview) {
      return (
        <img
          data-dz-thumbnail=""
          height={previewSize}
          width={previewSize}
          className="avatar-sm rounded bg-light"
          alt={file.name}
          src={file.preview}
          style={{ objectFit: "cover", width: previewSize, height: previewSize }}
        />
      );
    }

    if (isPdf) {
      return (
        <div className="avatar-sm rounded bg-light d-flex align-items-center justify-content-center" style={{ height: previewSize, width: previewSize }}>
          <i className="ri-file-pdf-line display-4 text-muted" />
        </div>
      );
    }

    // Fallback: show file extension
    const ext = (file && file.name && file.name.split('.').pop()) || "FILE";
    const extText = ext.length > 4 ? ext.slice(0, 4).toUpperCase() : ext.toUpperCase();
    return (
      <div className="avatar-sm rounded bg-light d-flex align-items-center justify-content-center" style={{ height: previewSize, width: previewSize }}>
        <span className="h6 mb-0">{extText}</span>
      </div>
    );
  };

  return (
    <React.Fragment>
      <Dropzone onDrop={onDrop} multiple={false}>
        {({ getRootProps, getInputProps }) => (
          <div className={`dropzone dz-clickable ${compact ? "compact-dropzone" : ""}`} {...getRootProps()}>
            <input {...getInputProps()} />
            <div className={`dz-message needsclick text-center ${compact ? "p-2" : "p-3"}`}>
              <div className="mb-3">
                <i className={`text-muted ri-upload-cloud-2-fill ${compact ? "display-5" : "display-4"}`} />
              </div>
              <h6>{compact ? "Upload profile photo" : "Drop files here or click to upload."}</h6>
            </div>
          </div>
        )}
      </Dropzone>

      {file ? (
        <ul className="list-unstyled mb-0 mt-2" id="dropzone-preview">
          <Card className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete">
            <div className="p-2">
              <div className="row align-items-center">
                <div className="col-auto">
                  {renderPreviewThumbnail(file)}
                </div>
                <div className="col ps-0">
                  <Link to="#" className="text-muted font-weight-bold">
                    {file.name}
                  </Link>
                  <p className="mb-0">
                    <strong>{formatBytes(file.size)}</strong>
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </ul>
      ) : null}
    </React.Fragment>
  );
};

export default DropzoneUpload;
