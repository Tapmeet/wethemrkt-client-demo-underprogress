import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { Modal, Button } from "reactstrap";
// import ReCAPTCHA from "react-google-recaptcha";
import "./login.scss";

// availity-reactstrap-validation

import { Form, Field } from '@availity/form';

import axiosHttpMiddelware from "common/axiosHttpMiddelware";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

const SignUp = props => {
  const [modal_signup, setmodal_signup] = useState(false);
  const [loginData, setLoginData] = useState(null)
  useEffect(() => {
    setmodal_signup(props.dataParentToChild)
    removeBodyCss()
  }, [])

  function tog_signup() {
    setmodal_signup(!modal_signup)
    removeBodyCss()
  }

  function handleSignupChange(islogin) {
    setmodal_signup(false)
    props.onChange(false, islogin)
  }

  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }

  const handleValidSubmit = (values) => {

    let emailError = false;
    let passwordError = false;
    let passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z@$!%*?&]{6,10}$");

    //console.log(values);
    try {
      const newToken = executeRecaptcha("MS_Pyme_DatosEmpresa");
      console.log({ data, newToken });
    } catch (err) {
      console.log(err);
    }

    if (values.originalEmail !== values.confirmEmail) {
      toastr.error("Please provide valid email address. Email and Confirm email dosen't match", "Error");
      emailError = true;
    }

    if (passwordRegex.test(values.password) !== false) {
      passwordError = true;
      // toastr.error("Password dosn't match secure requirenment.", "Error");
      toastr.warning("Minimum six and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character", "Password requirenment");
    }

    if (passwordRegex.test(values.confirmPassword) !== false) {
      passwordError = true;
      // toastr.error("Confirm password dosn't match password requirenment.", "Error");
      toastr.warning("Minimum six and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character", "Password requirenment");
    }

    if (values.confirmPassword !== values.password) {
      passwordError = true;
      toastr.error("Please provide valid password. both passwords dosen't match", "Error");
    }


    if (emailError === false && passwordError === false) {

      axiosHttpMiddelware.post("auth/signup", {
        username: values.username,
        email: values.confirmEmail,
        password: values.password,
      }).then((res) => {

        toastr.success("Registration successfull. Please confirm your account", "Congratulations!");
        // setmodal_signup(false)
        // props.onChange(false, true);
        setLoginData(res.data)

      }).catch((err) => {
        console.log(err);
        toastr.error(err.response.data.message, "Error");
      })

    }
  }
  const handleLogin = (values) => {
    if (values.otp == loginData.otp) {
      localStorage.setItem("user", JSON.stringify(loginData));
      setTimeout(() => {
        window.location.href = "/feed";
      }, 1000);
    }
  }
  const handleCaptchaError = (value) => {
    //console.log(value);
    toastr.error("Please try again", "Error");
    history.go(0);
  }

  return (
    <React.Fragment>

      <Modal fade={false} isOpen={modal_signup} >

        <div className="modal-header  border-none">
          {/* <GoogleReCaptchaProvider
      language="es-EN"
      reCaptchaKey="6Ldaw1AgAAAAAJGc4hUHNAkqLWnqIFbtQIVWSEAM"
    /> */}
          <button type="button" onClick={() => { handleSignupChange(false) }}
            className="close" data-dismiss="modal" aria-label="Close" >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body pt-0">

          <h5 className="modal-title mb-2 login-text" id="myModalLabel"> Sign Up </h5>

          <div className=" d-flex justify-content-center">
            <span>Already have an account?</span>
            <span color="primary" className="sign-up-color mx-1" onClick={() => { handleSignupChange(true) }}> Login</span>
          </div>


          {loginData ? (
            <Form className="form-horizontal pt-4" onSubmit={(value) => { handleLogin(value) }} >
              <div className="mb-3">
                <Field name="otp" label="Verification Code" className="form-control" autoComplete="off" placeholder="Enter Verification Code" type="password" required />
              </div>
              <div className="modal-footer justify-content-start p-0 login-group">
                <button type="submit" className="btn btn-primary px-4" >
                  Confirm
                </button>
              </div>
            </Form>
          ) : (
            <Form
              initialValues={{

                originalEmail: '',
                confirmEmail: '',
                username: '',
                password: '',
                confirmPassword: '',

              }}
              className="form-horizontal pt-4" onSubmit={(values) => { handleValidSubmit(values) }} >
              <div className="mb-3">
                <Field name="originalEmail" label="Email" className="form-control" autoComplete="off" placeholder="Enter email" type="email" required />
              </div>
              <div className="mb-3">
                <Field name="confirmEmail" label="Confirm Email" className="form-control" autoComplete="off" placeholder="Confirm email" type="email" required />
              </div>

              <div className="mb-3">
                <Field name="username" label="Username" className="form-control" autoComplete="off" placeholder="Username" type="text" required />
              </div>
              <div className="mb-3">
                <Field name="password" label="Password" type="password" autoComplete="off" placeholder="Enter Password" required />
              </div>
              <div className="mb-3">
                <Field name="confirmPassword" label="Confirm Password" type="password" autoComplete="off" placeholder="Confirm Password" required />
              </div>
              <div className="modal-footer p-0 justify-content-start login-group">
                <button type="submit" className="btn btn-primary px-4" >
                  SIGN UP
                </button>
              </div>
            </Form>
          )}
        </div>
      </Modal>

    </React.Fragment>
  )
}

SignUp.propTypes = {
  registerUser: PropTypes.func,
  registrationError: PropTypes.any,
  user: PropTypes.any,
  history: PropTypes.object,
}

export default SignUp;