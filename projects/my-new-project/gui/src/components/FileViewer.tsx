import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// Styled component for the document container
const DocumentContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
});

interface FileViewerProps {
  file: {
    id: number;
    name: string;
    url: string;
  };
}

const FileViewer: React.FC<FileViewerProps> = ({ file }) => {
  return (
    <Paper elevation={3}>
      <DocumentContainer>
        <Document file={`http://localhost:8000/files/${file.id}`} loading="Loading PDF...">
          <Page pageNumber={1} />
        </Document>
      </DocumentContainer>
    </Paper>
  );
};

export default FileViewer;
