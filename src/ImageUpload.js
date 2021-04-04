import React, { useState } from 'react'
import { Button } from '@material-ui/core'
import firebase from 'firebase'
import { db, storage } from './firebase'
import './ImageUpload.css'
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Alert from '@material-ui/lab/Alert';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    input: {
      display: 'none',
      width: '100%'
    },
  }));


function ImageUpload({username}) {
    const [caption, setCaption] = useState('')
    const [image, setImage] = useState(null)
    const [progress, setProgress] = useState(0)
    const [alert, setAlert] = useState(false)
    const classes = useStyles();


    const handleChange = (event)=>{
        event.preventDefault()
        if(event.target.files[0]){
            setImage(event.target.files[0])
        }
    }
    const handleUpload = ()=>{
        const uploadTask = storage.ref(`images/${image.name}`).put(image)
        uploadTask.on('state_changed',(snapshot)=>{
            const prog = Math.round((snapshot.bytesTransferred/snapshot.totalBytes)*100)
            setProgress(prog)
        },
        (error)=>{
            console.log(error)
            alert(error.message)
        },
        ()=>{
           storage.ref("images")
                   .child(image.name)
                   .getDownloadURL()
                   .then(url=>{
                       db.collection("posts").add({
                           timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                           caption: caption,
                           imageUrl: url,
                           username: username
                       })
                       setAlert(true)
                       setImage(null)
                       setCaption('')
                       setProgress(0)
                       
                   })
                
        })
    }

    return (
        <div className="imageupload">
            <h3>Create a Post</h3>
            <input className="caption_input" required type="text" placeholder="Enter a caption" onChange={event=>setCaption(event.target.value)} value={caption}/>
            <input onChange={handleChange} accept="image/*" className={classes.input} id="icon-button-file" type="file" />
            <label htmlFor="icon-button-file">
                <IconButton className="choose_button" color="primary" aria-label="upload picture" component="span">
                    <p className="choose_image_text">Choose Image</p>
                    <PhotoCamera />
                </IconButton>
            </label>
            {/* <input required type="file" onChange={handleChange} /> */}
            {/* <Button disabled={!caption || !image} onClick={handleUpload}>Upload</Button> */}
            <label htmlFor="contained-button-file">
                <Button className="upload_button" disabled={!caption || !image} onClick={handleUpload} variant="contained" color="primary" component="span">
                    Upload
                </Button>
            </label>
            {/* <progress className="imageupload__progress" value={progress} max="100" /> */}
            <div className={classes.root}>
                <LinearProgress  variant="determinate" value={progress} max="100" />
            </div>
            {
                alert ? (<div className={classes.root}>
                    <Alert severity="success">Your post has been created!!</Alert>
                  </div>
              ) : (null)
            }
        </div>
    )
}

export default ImageUpload
