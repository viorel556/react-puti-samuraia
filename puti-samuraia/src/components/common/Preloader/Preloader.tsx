import React from "react";
import preloader from "../../../assets/images/preloader.gif";


function Preloader () {
    return (
        <div style = { {backgroundColor: "white"}}>
            <img src={preloader} />
        </div>
    );
}

export default Preloader;