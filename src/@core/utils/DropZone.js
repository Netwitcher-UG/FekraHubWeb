import { useCallback, useState } from "react";

const { useDropzone } = require("react-dropzone");
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
const DropzoneWrapper = ({ row, onFileUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const onDrop = useCallback((acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
    onFileUpload(acceptedFiles, row);
  }, [onFileUpload, row]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'application/pdf' });

  return (
    <div {...getRootProps()} style={{ border: '1px dashed gray', padding: '10px', textAlign: 'center' }}>
    <input {...getInputProps()} />
    {selectedFile ? (

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <InsertDriveFileOutlinedIcon size={24} style={{ marginRight: '10px', color: 'red' }} />
        <p>{selectedFile.name}</p>
      </div>
    ) : (

      <div>
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop a PDF here, or click to select a file</p>
        )}
      </div>
    )}
  </div>
  );
};
export default DropzoneWrapper;
