import React, { useState } from "react";
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic'


const QuillNoSSRWrapper = dynamic(import('react-quill'), {	
	ssr: false,
	loading: () => <p>Loading ...</p>,
});


const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['link', 'code'],
      ['clean'],
    ],
  };
  
  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'code',
  ];
  
  interface OnChangeHandler {
    (e: any): void;
  }
  
  type Props = {
    value?: string;
    placeholder?: string;
    onChange?: OnChangeHandler;
  };
  
  const RichEditor: React.FC<Props> = ({ value, onChange, placeholder }) => {
    return (
      <>
        <QuillNoSSRWrapper
          theme="snow"
          value={value || ''}
          modules={modules}
          formats={formats}
          onChange={onChange}
          placeholder={placeholder}
        />
      </>
    );
  };
  export default RichEditor;
