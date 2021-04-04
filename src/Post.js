import React, {useState, useEffect} from 'react'
import Avatar from '@material-ui/core/Avatar';
import './Post.css'
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import firebase from "firebase"
import { db} from './firebase'
import Filter from 'bad-words'


const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
    },
  }));
  

function Post({user, postId, username, imageUrl, caption}) {
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState([])
    const [alert, setAlert] = useState(false)
    const classes = useStyles();
    const filter = new Filter()
    const filterWord = (x)=>{
        const m = filter.clean(x)
        if(m!==x){
            setAlert(true)
        }
        return m
    }
    useEffect(() => {
        let unsubscribe
        if(postId){
             unsubscribe = db.collection("posts")
                            .doc(postId)
                            .collection("comments")
                            .orderBy('timestamp','desc')
                            .onSnapshot((snapshot)=>{
                               setComments(snapshot.docs.map((doc)=>doc.data()))
                            })
        }
        return () => {
           unsubscribe()
        }
    }, [postId])

    const postComment = (event)=>{
        event.preventDefault()
        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment('')

    }
   
    return (
        <div className="post">
            <div className="post__header">
              <Avatar className="post__avatar" alt={username} src="/static/images/avatar/1.jpg" />
                 <h3>{username}</h3>
            </div>
            <img className="post__image" src={imageUrl} alt=""/>
            <h4 className="post__text"><strong>{username}</strong> {caption}</h4>
            <div className="post__comments">
                {
                    comments.map((comment=>(
                        <p>
                             <strong>{comment.username}</strong> {comment.text}
                        </p>
                    )))
                }
            </div>
            {
                user? ( <form className="post__commentBox">
                <input
                  className="post__input"
                  type="text"
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e)=>setComment(filterWord(e.target.value))}/>
                  { alert ?  
                    <div className={classes.root}>
                        <Alert severity="error">Please don't abuse!!</Alert>
                     </div> : ""
                  }
                   <button 
                        className="post__button"
                        type="submit"
                        disabled={!comment}
                        onClick={postComment}>
                        Post
                    </button>
               </form>) : (<p className="comment__message"><strong>Please Login to Comment</strong></p>)
            }
           
        </div>
    )
}

export default Post
