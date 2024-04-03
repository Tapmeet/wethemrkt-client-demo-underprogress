import React, { useState } from "react"
import {
  Container,
  Row,
  Col,
} from "reactstrap"
import Login from "../../components/CommonForBoth/AuthenticationModel/Login"
import Signup from "../../components/CommonForBoth/AuthenticationModel/Signup"
import sideBannerImage from "../../assets/images/iphone-b.jpeg"
import './Section.css'

const Section = () => {
  const [modal_backdroplogin, setmodal_backdroplogin] = useState(false);
  const [modal_backdropsignup, setmodal_backdropsignup] = useState(false);



  function tog_backdroplogin() {
    setmodal_backdroplogin(true);
  }

  function tog_backdropsignup() {
    setmodal_backdropsignup(true);
  }

  function handleChangeLogin(value, issignup) {
    setmodal_backdroplogin(value);
    if (issignup) {
      tog_backdropsignup();
    }
  }

  function handleChangeSignup(value, islogin) {
    setmodal_backdropsignup(value);
    if (islogin) {
      tog_backdroplogin();
    }
  }
  return (
    <React.Fragment>
      <section className="section bg-ico-hero" id="home">
        <div className="bg-overlay bg-white" style={{ opacity: 1 }} />
        <div className="htp-container">
          <Row className="align-items-center">
            <Col lg="7">
              <div className="font-size-50 login-group">
                <h1 className="font-weight-semibold mb-3 hero-title" style={{ color: '#000' }}>
                  See what’s happening now in the markets
                </h1>
                <p className="font-size-18 mb-3">
                  See what actual investors and traders are saying in real time about the stocks, crypto, futures, and forex you care about for free.
                </p>
                <button type="button" className="btn btn-primary" onClick={() => { tog_backdropsignup() }} style={{ width: 165, height: 46 }}> Sign Up </button>
                <p style={{ marginTop: 25 }}><p>Already have an account?</p> <button className="btn btn-primary" onClick={() => { tog_backdroplogin() }}>Log In</button></p>
                {modal_backdroplogin ? <Login onChange={handleChangeLogin} dataParentToChild={modal_backdroplogin} /> : null}
                {modal_backdropsignup ? <Signup onChange={handleChangeSignup} dataParentToChild={modal_backdropsignup} /> : null}
              </div>
            </Col>
            <Col lg={5}>
              <img src={sideBannerImage} style={{ width: '100%' }}  />
            </Col>
          </Row>
        </div>
      </section>
    </React.Fragment>
  )
}

export default Section
