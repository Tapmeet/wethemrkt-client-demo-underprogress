import React, { useState, useEffect } from "react";
import { Modal } from "reactstrap";
import axiosHttpMiddelware from "common/axiosHttpMiddelware";
import toastr from "toastr";
import { Form, Field } from '@availity/form';
import "../../../assets/scss/custom/wethemkrt/common.scss";
import "toastr/build/toastr.min.css";
const ChangePassword = props => {
  const [modal_password, setmodal_password] = useState(false);
  const [email, setEmail] = useState(null);
  useEffect(() => {
    setmodal_password(props.dataParentToChild)
    removeBodyCss()
  }, [])
  function handlepasswordChange(ispasswordC) {
    setmodal_password(false)
    props.onChange(false, ispasswordC)
  }
  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }
  const handleValidSubmit = (values) => {
    axiosHttpMiddelware.post("auth/forgot-password", {
      email: values.email
    }).then((response) => {
      toastr.success("Email sent successfully", "Success!");
      setEmail(values.email)
    }).catch((err) => {
      console.log(err);
      if (err.response) {
        if (err.response.status === 401) {
          toastr.error("Invalid Credentials.", "Error");
        } else if (err.response.status === 404) {
          toastr.error("Please signup.", "Error");
        }
        else {
          toastr.error("Something went wrong.", "Error");
        }
      } else {
        toastr.error(err, "Error");
      }
    });
  }
  const handleValidSubmitPassword = (values) => {
    let passwordError = false;
    let passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z@$!%*?&]{6,10}$");
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
    if (values.otp == '') {
      passwordError = true;
      toastr.error("Please provide valid otp", "Error");
    }
    if (passwordError === false) {
      axiosHttpMiddelware.post("auth/change-password", {
        email: email,
        password: values.password,
        token: values.otp
      }).then((response) => {
        toastr.success("Email sent successfully", "Success!");
        handlepasswordChange(true)
      }).catch((err) => {
        console.log(err);
        if (err.response) {
          if (err.response.status === 401) {
            toastr.error("Invalid Verification Code.", "Error");
          } else if (err.response.status === 404) {
            toastr.error("Please signup.", "Error");
          }
          else {
            toastr.error("Something went wrong.", "Error");
          }
        } else {
          toastr.error(err, "Error");
        }
      });
    }
  }
  return (
    <React.Fragment>
      <Modal isOpen={modal_password} fade={false} >
        <div className="modal-header border-none" >
          <button type="button" onClick={() => { handlepasswordChange(false) }}
            className="close" data-dismiss="modal" aria-label="Close" >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body pt-0">
          <h5 className="modal-title mb-2 password-text" id="myModalLabel"> Change password </h5>
          {email == null ? (
            <>
              <Form initialValues={{
                email: ''
              }} className="form-horizontal pt-4" onSubmit={(value) => { handleValidSubmit(value) }} >
                <div className="m-5">
                  <Field name="email" label="Email" className="form-control" autoComplete="on" placeholder="Enter email" type="email" required />
                </div>
                <div className="modal-footer pb-0 px-1 justify-content-start ms-3">
                  <button type="submit" className="btn btn-primary px-4" >
                    Send Verification Code
                  </button>
                </div>
              </Form>
            </>
          ) : (
            <>
              <Form initialValues={{
                email: ''
              }} className="form-horizontal pt-4" onSubmit={(value) => { handleValidSubmitPassword(value) }} >
                <div className="m-5">
                  <Field name="otp" label="Verification Code" type="text" autoComplete="off" placeholder="Enter Verification Code" required />
                </div>
                <div className="m-5">
                  <Field name="password" label="Password" type="password" autoComplete="off" placeholder="Enter Password" required />
                </div>
                <div className="m-5">
                  <Field name="confirmPassword" label="Confirm Password" type="password" autoComplete="off" placeholder="Confirm Password" required />
                </div>
                <div className="modal-footer pb-0 px-1 justify-content-start ms-3">
                  <button type="submit" className="btn btn-primary px-4" >
                    Send Verification Code
                  </button>
                </div>
              </Form>
            </>
          )}
        </div>
      </Modal>
    </React.Fragment>
  )
}
export default ChangePassword;
