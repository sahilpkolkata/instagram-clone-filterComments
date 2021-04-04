import React, { useState, useEffect } from 'react';
import Post from './Post';
import './App.css';
import { auth, db } from './firebase'
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload'

// import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50
  const left = 50 

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 270,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  }}))


function App() {
  const [modalStyle] = useState(getModalStyle)
  const [posts, setPosts] = useState([])
  const [open, setOpen] = useState(false)
  const [signInOpen, setSignInOpen]  = useState(false)
  const classes = useStyles();
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [user, setUser] = useState(null)
  

  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        //user logged in
        console.log(authUser)
        setUser(authUser)
      }
      else{
        setUser(null)
      }
    })
    return ()=>{
      unsubscribe()
    }
  },[user,username])

  useEffect(()=>{
      db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot=>{
        setPosts(snapshot.docs.map(doc=> ({
            id: doc.id,
            post: doc.data()
          })))
      })
    },[])

    const handleSignUp = (event)=>{
      event.preventDefault()
      auth.createUserWithEmailAndPassword(email,password)
      .then((authUser)=>{
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error)=>alert(error.message))
      setOpen(false)
    }

    const handleSignIn = (event)=>{
      event.preventDefault()
      auth.signInWithEmailAndPassword(email,password)
          .catch((error)=>error.message)
      setSignInOpen(false)
    }

  return (
    <div className="app">
      {/* Sign Up Modal */}
       <Modal
        open={open}
        onClose={()=> setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <div className="app__header">
              <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" className="app__headerImage"/>
              </div>
            </center>
              <Input 
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e)=>setUsername(e.target.value.toUpperCase())}/>
              <Input 
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}/>
              <Input 
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}/>
              <Button className="signup_button" type="submit" onClick={handleSignUp}>SignUp</Button>
          </form>
        </div>
      </Modal>
      
      {/* Sign In Modal */}
        <Modal
          open={signInOpen}
          onClose={()=> setSignInOpen(false)}
        >
          <div style={modalStyle} className={classes.paper}>
            <form className="app__signup">
              <center>
                <div className="app__header">
                <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" className="app__headerImage"/>
                </div>
              </center>
                <Input 
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}/>
                <Input 
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}/>
                <Button className="signin_button" variant="contained" color="primary" type="submit" onClick={handleSignIn}>SignIn</Button>
            </form>
          </div>
        </Modal>

     <div className="app__header">
       <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" className="app__headerImage"/>
       {
       user? 
       (<Button variant="outlined" color="secondary" onClick={()=>auth.signOut()}>Logout</Button>):
       (
         <div className="app__loginContainer">
           <Button className="signin_button" variant="contained" color="primary" onClick={()=>setSignInOpen(true)}>SignIn</Button>
           <Button className="signup_button" variant="contained" color="green" onClick={()=>setOpen(true)}>SignUp</Button>
         </div>
         )
       }
     </div>
     <div className="app__posts">
       <div className="app__postsLeft">
       {user?.displayName? 
           ( <ImageUpload username={user.displayName}/>)
          : (<p className="imageupload__message"><strong>Login to Upload Post</strong></p>)}
    
        {
            posts.map(({id,post})=>
              <Post user={user} key={id} postId={id} username={post.username} imageUrl={post.imageUrl} caption={post.caption} />
            )
        }
       </div>
       <div className="app__postsRight">
      
       </div>
      
     </div>
      
    </div>
     
  );
}

export default App;
