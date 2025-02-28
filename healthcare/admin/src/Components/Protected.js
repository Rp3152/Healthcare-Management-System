import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import React from "react";

function Protected(props) {
    const { Component } = props;
    const navigate = useNavigate();
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
        }
    });
    return (
        <div>
            <Component />
        </div>
    );
}

export default Protected;
