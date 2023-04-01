import React from 'react'
import ReactLoading from "react-loading";
import classes from "./Loading.module.scss";

function Loading() {
    return (
        <div className={classes.loadingContainer}>
            <ReactLoading type="spin" color="#C4EB12" height={100} width={100} />
        </div>
    )
}

export default Loading