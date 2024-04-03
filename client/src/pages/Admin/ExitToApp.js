import React, { Component } from 'react';
import {Link} from "react-router-dom";
export const ExitToApp =  () => (
    <>
        <Link to="/feed" className="dropdown-item px-2">
            <i className='bx bx-arrow-back'></i>
            <span>{("Exit")}</span>
        </Link>
    </>
)