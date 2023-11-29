import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, List, ListItem, ListItemText, Paper as MuiPaper } from '@mui/material';
import { styled } from '@mui/material/styles';
import FileViewer from './components/FileViewer';

type File = {
  id: number;
  name: string;
  url: string;
}

const Paper = styled(MuiPaper)({
  padding: 20,
  textAlign: 'center',
  color: 'black',
});

const RootContainer = styled(Container)({
  flexGrow: 1,
  marginTop: 30,
});

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  useEffect(() => {
    fetch('http://localhost:8000/files/')
      .then((response) => response.json())
      .then(setFiles);
  }, []);


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
        <RootContainer>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Paper>
                <List>
                  {files.map((file) => (
                    <ListItem button key={file.id} onClick={() => setSelectedFile(file)}>
                      <ListItemText primary={file.name} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
            <Grid item xs={8}>
              <Paper>
                {selectedFile && <FileViewer file={selectedFile} />}
              </Paper>
            </Grid>
          </Grid>
        </RootContainer>
      </div>
  );
}

export default App;
