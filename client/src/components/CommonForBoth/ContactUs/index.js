import React from "react"
import { useHistory } from "react-router-dom"
import { Row, Col, Card } from "reactstrap"
import { Form, Field } from '@availity/form';
import HorizontalLayout from "components/HorizontalLayout"
import axiosHttpMiddelware from "common/axiosHttpMiddelware"
import toastr from "toastr";
const ContactUsIndex = (props) => {
  const history = useHistory()
  const handleValidSubmit = (values) => {
    axiosHttpMiddelware.post("auth/contact-us", {
      email: values.email,
      message: values.message
    }).then((response) => {
      toastr.success("Message send successfully", "Success");
      history.push({ pathname: `/` })
    }).catch((err) => {
      toastr.error("Something went wrong.", "Error");
    });
  }
  return (
    <React.Fragment>
      <HorizontalLayout>
        <div className="white-boxpart rs-box contact-us-box">
          <h1 className="rs-title">Contact Us</h1>
          <Form initialValues={{
            email: '',
            message: ''
          }} className="form-horizontal pt-4" onSubmit={(value) => { handleValidSubmit(value) }} >
            <div className="mb-3">
              <Field name="email" label="Email" className="form-control" autoComplete="on" placeholder="Enter email" type="email" required />
            </div>
            <div className="mb-3">
              <Field name="message" label="Message" type="textarea" autoComplete="on" placeholder="Enter your message" required />
            </div>
            <div className="modal-footer justify-content-start p-0">
              <button type="submit" className="btn btn-primary px-4" >
                Submit
              </button>
            </div>
          </Form>
        </div>
      </HorizontalLayout>
    </React.Fragment>
  )
}
export default ContactUsIndex
