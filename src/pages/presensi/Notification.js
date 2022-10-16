import React from 'react';
import FlashMessage from 'react-flash-message';
import classes from "./Notification.module.scss";

function Notification(props) {
  return (
    // <div className={classes.msgContainer}>
      <FlashMessage duration={5000}>
        <div className={classes.msgContainer}>
          <strong>{props.msg}</strong>
        </div>
      </FlashMessage>
    // </div>
  )
}

export default Notification