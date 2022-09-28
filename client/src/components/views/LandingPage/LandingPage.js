import React from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";

function LandingPage(props) {
  const onClickHandler = () => {
    axios.get(`/api/users/logout`).then((response) => {
      if (response.data.success) {
        props.history.push("/login");
      } else {
        alert("Logout failed");
      }
    });
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <h2>Welcome Page</h2>
      <div>
        <button onClick={onClickHandler}>Logout</button>
      </div>
    </div>
  );
}

export default withRouter(LandingPage);
