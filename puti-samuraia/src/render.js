import ReactDOM from "react-dom/client";
import React from "react";
import {BrowserRouter} from "react-router-dom";
import App from "./App";
import {addPost, updateNewPostText} from "./redux/state";

const root = ReactDOM.createRoot(document.getElementById('root'));
export let rerenderEntireTree = (state) => {

    root.render(
        <React.StrictMode>

            {/*OUR APP IS UNDER BROWSER ROUTER CONTROL*/}
            <BrowserRouter>
                <App state={ state }
                     addPost={ addPost }
                     updateNewPostText={ updateNewPostText }
                />
            </BrowserRouter>

        </React.StrictMode>
    );
}