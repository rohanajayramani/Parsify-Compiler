import React from 'react'

const Footer = () => {
    return (
        <div style={ FooterStyle }>
        <h1 ><center>Designed & Coded by Rohan, Devansh & Vansh</center></h1>
        </div>
    )
}
export default Footer;

const FooterStyle = {
    background: "#222",
    fontSize: "0.5rem",
    color: "#fff",
    position: "fixed",
    bottom: 0,
    padding: "0.5rem",
    width: "100%",
    opacity: ".5"
}