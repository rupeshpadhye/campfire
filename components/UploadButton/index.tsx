import React from 'react';
import { PickerOverlay } from "filestack-react";
import { Button, Image } from 'antd';
import { PlusOutlined } from '@ant-design/icons';


const API_KEY = process.env.NEXT_PUBLIC_FILESTACK_API_KEY;

const UploadButton = (props) => {
    const [showFileUploadOverlay, setShowFileUploadOverlay] =
      React.useState(false);
    const { handleUpload, label ='Upload', fileURL, removeFile, type='default' } = props;
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
         { fileURL && <Button type='text' danger onClick={() => removeFile()}> Click To Remove File </Button> }
        </div>
        <Button type={type} onClick={() => setShowFileUploadOverlay(true)} icon={<PlusOutlined/>}>
          {label}
        </Button>
        <div>
    </div>
      </div>
    );
  };
  
  export default UploadButton;