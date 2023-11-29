import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Document, Page, pdfjs } from 'react-pdf';
import './App.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface File {
  id: number;
  name: string;
  url: string;
}

const App: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  useEffect(() => {
    axios.get('http://localhost:8000/files/').then((response) => {
      setFiles(response.data);
    });
  }, []);

  const onFileSelect = (file: File) => {
    setSelectedFile(file.url);
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const onFileUpload = () => {
    if (uploadFile) {
      const formData = new FormData();
      formData.append('file', uploadFile as any);
      axios.post('http://localhost:8000/files/', formData).then((response) => {
        setFiles([...files, response.data]);
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      setUploadFile(e.target.files[0] as any);
    }
  };

  return (
    <div className="App">
      <div className="file-upload">
        <input type="file" onChange={handleFileChange} />
        <button onClick={onFileUpload}>Upload</button>
      </div>
      <div className="file-list">
        {files.map((file, index) => (
          <div key={index} onClick={() => onFileSelect(file)}>
            {file.name}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-viewer">
          <Document
            file={selectedFile}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <Page pageNumber={pageNumber} />
          </Document>
        </div>
      )}
    </div>
  );
};

export default App;
