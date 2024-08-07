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
        <RootContainer>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Grid container direction="column">
                <Grid item xs={12}>
                  <Paper>
                    <div className="file-upload">
                      <input type="file" onChange={handleFileChange} />
                      <button onClick={onFileUpload}>Upload</button>
                    </div>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper>
                    <List>
                      <ListItem>
                        <ListItemText primary="File Name" />
                      </ListItem>
                      {files.map((file, index) => (
                        <ListItem
                          key={file.id} 
                          onClick={() => setSelectedFile(file)}
                          style={{ backgroundColor: index % 2 === 1 ? 'lightgray' : 'inherit' }}
                        >
                          <ListItemText primary={file.name} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={9}>
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
