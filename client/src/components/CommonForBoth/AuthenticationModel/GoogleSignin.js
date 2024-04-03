import React, { useState, useEffect } from "react";
import { GoogleLogin } from '@react-oauth/google';
import axiosHttpMiddelware from "common/axiosHttpMiddelware";
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const GoogleSignin = props => {
  const [user, setUser] = useState([]);
  useEffect(
    () => {
      if (user) {
        axiosHttpMiddelware.post("auth/google-login", {
          credential: user.credential
        }).then((response) => {
          if (response.data.accessToken) {
            onLogin(response.data)
          }
        }).catch((err) => {
          console.log(err);
        });
      }
    },
    [user]
  );
  const onLogin = (data) => {
    localStorage.setItem("user", JSON.stringify(data));
    var expdate = new Date();
    expdate.setDate(expdate.getDate() + 2);
    cookies.set('otp', data.otp, { path: '/', expires: expdate});
    setTimeout(() => {
      window.location.href = "/feed";
    }, 1000);
  }
  return (
    <GoogleLogin
      size="medium"
      theme="filled_blue"
      text="signin"
      shape="rectangular"
      onSuccess={credentialResponse => {
        setUser(credentialResponse);
      }}
      onError={() => {
        console.log('Login Failed');
      }}
      useOneTap
    />
  )
}
export default GoogleSignin;
