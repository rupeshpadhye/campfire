import React from 'react';
import { PickerOverlay } from "filestack-react";
import { Button, Image } from 'antd';


const API_KEY = "AGjVx6ZZnSZOKdCmH1npDz";

const UploadButton = (props) => {
    const [showFileUploadOverlay, setShowFileUploadOverlay] =
      React.useState(false);
    const { handleUpload, label, fileURL, removeFile } = props;
    return (
      <div>
        {showFileUploadOverlay ? (
          <PickerOverlay
            apikey={API_KEY}
            onSuccess={(res) => {
              handleUpload(res);
              setShowFileUploadOverlay(false);
            }}
          />
        ) : null}
        <div>
         {fileURL && <Image src={fileURL} alt="uploaded" width='100px' height={100}/>}
          <Button type='text' danger onClick={() => removeFile()}> Click To Remove File </Button>
        </div>
        <Button type="secondary" onClick={() => setShowFileUploadOverlay(true)}>
          {label}
        </Button>
      </div>
    );
  };
  
  export default UploadButton;