import React from "react";
import classes from './MyPosts.module.css';
import Post from "./Post/Post";
import {addPostActionCreator, updateNewPostTextActionCreator} from "../../../redux/profile-reducer";


const MyPosts = (props) => {
    // mapping data
    let myPosts = props.posts
        .map(pst => <Post message={pst.message} likes={pst.likesCount}/>)

    let newPostElement = React.createRef();

    let addPost = () => {
        // this func just FIXATES the current value in textarea and adds a post;
        props.dispatch( addPostActionCreator() );
    };

    let onPostChange = () => {
        // func LISTENS and UPDATES "newPostText" in BLL;
        let text = newPostElement.current.value;
        props.dispatch( updateNewPostTextActionCreator(text) );
    }

    return (
        <div className={classes.postsBlock}>

            <h3> My Posts </h3>
            <div>
                <div>
                    <textarea ref={ newPostElement }
                              value={ props.newPostText }
                              onChange={ onPostChange }
                    />
                </div>

                <div>
                    <button onClick={ addPost }>Add Post</button>
                </div>
            </div>

            <div className={classes.posts}>
                {myPosts}
            </div>

        </div>
    );
}

export default MyPosts;
