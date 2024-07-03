import React from "react";
import { Link } from "react-router-dom";

function Home() {
    return(
        <div className="home-div">
            <h2>Are you a new user? Click <Link to="/login">Here</Link> to log-in.</h2>
        </div>
    );
}

export default Home;