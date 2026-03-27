import React from "react";

const Favicon = () => {
    return (
        <>
            <link rel="icon" href="/static/favicon/icon.svg" type="image/svg+xml" />
            <link rel="icon" href="/static/favicon/favicon.ico" sizes="any" />
            <link rel="apple-touch-icon" href="/static/favicon/apple-icon.png" />
            <link rel="manifest" href="/static/favicon/manifest.json" />
            <meta name="msapplication-TileColor" content="#da532c" />
            <meta name="theme-color" content="#2742F5" />
        </>
    );
};

export default Favicon;
