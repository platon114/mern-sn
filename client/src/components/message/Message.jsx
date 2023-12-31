import React from "react";
import "./styles.css";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import UserImage from "../UserImage";


const Message = ({ message, own }) => {
    return (
        <div className={own ? "message own" : "message"}>
            <div className="messageTop">
                
                <p className="messageText">{message.text}</p>
            </div>
         
        </div>
    );
};

export default Message;