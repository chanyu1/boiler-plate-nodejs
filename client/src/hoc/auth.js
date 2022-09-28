import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { auth } from "../_actions/userAction";

// null  -> Anyone can enter
// true  -> Only log in user can enter
// false -> Log in user can not enter
const hocAuth = function (SpecificComponent, option, adminRoute = null) {
  function AuthenticationCheck(props) {
    const dispatch = useDispatch();
    useEffect(() => {
      dispatch(auth()).then((response) => {
        if (!response.payload.isAuth) {
          if (option) {
            props.history.push("/login");
          }
        } else {
          if (adminRoute && !response.payload.isAdmin) {
            props.history.push("/");
          } else {
            if (option === false) props.history.push("/");
          }
        }
      });
    });
    return <SpecificComponent />;
  }
  return AuthenticationCheck;
};

export default hocAuth;
