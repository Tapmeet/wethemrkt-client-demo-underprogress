import React, { useState } from "react"
import PropTypes from 'prop-types'
import { Link } from "react-router-dom";
import SearchDropdown from '../../components/CommonForBoth/TopbarDropdown/SearchDropdown'
import logoDark from "../../assets/images/logo.jpeg";

import Login from "../../components/CommonForBoth/AuthenticationModel/Login"
import ChangePassword from "../../components/CommonForBoth/AuthenticationModel/ChangePassword"
import Signup from "../../components/CommonForBoth/AuthenticationModel/Signup"
import "./Header.scss"
const Header = props => {
  const [menu, setMenu] = useState(false)
  const [isSearch, setSearch] = useState(false)
  const [modal_backdroplogin, setmodal_backdroplogin] = useState(false);
  const [modal_backdropsignup, setmodal_backdropsignup] = useState(false);
  const [modal_backdroppass, setmodal_backdroppass] = useState(false);



  function tog_backdroplogin() {
    setmodal_backdroplogin(true);
  }

  function tog_backdropsignup() {
    setmodal_backdropsignup(true);
  }
  function tog_backdroppass() {
    setmodal_backdroppass(true);
  }

  function handleChangeLogin(value, issignup) {
    setmodal_backdroplogin(value);
    if (issignup) {
      tog_backdropsignup();
    }
  }
  function handlePasswordChange(value, ispasswordC) {
    setmodal_backdroplogin(value);
    if (ispasswordC) {
      tog_backdroppass();
    }
  }

  function handleChangeSignup(value, islogin) {
    setmodal_backdropsignup(value);
    if (islogin) {
      tog_backdroplogin();
    }
  }
  function handleChangeChangePassword(value, islogin) {
    setmodal_backdroppass(value);
    if (islogin) {
      tog_backdroplogin();
    }
  }

  return (
    <React.Fragment>
      <header style={{ zIndex: 1 }}>
        <section class="header-top-part header-top-part-out">
          <div class="htp-container">
            <div class="tph-group">
              <div class="tph-left">
                <Link to="/" >
                  <img src={logoDark} class="tph-logo" />
                </Link>
              </div>
              <div class="tph-right">
                <div class="srch-part">
                  <SearchDropdown />
                </div>
                <div class="tph-menu">
                  <ul>
                    <li>
                      <Link to="/privacy-policy">
                        Privacy policy
                      </Link>
                    </li>
                    <li>
                      <Link to="/contact-us">
                        Contact Us
                      </Link>
                    </li>
                  </ul>
                </div>
                <div class="login-group">
                  <a href="javascript:void(0)" class="lg-btn" onClick={() => { tog_backdroplogin() }}>Login</a>
                  <a href="javascript:void(0)" class="lg-btn sgn-btn" onClick={() => { tog_backdropsignup() }}>Sign Up</a>
                </div>
              </div>
            </div>
          </div>
        </section>
        {modal_backdroplogin ? <Login onChange={handleChangeLogin} onPasswordChange={handlePasswordChange} dataParentToChild={modal_backdroplogin} /> : null}
        {modal_backdropsignup ? <Signup onChange={handleChangeSignup} dataParentToChild={modal_backdropsignup} /> : null}
        {modal_backdroppass ? <ChangePassword onChange={handleChangeChangePassword} dataParentToChild={modal_backdroppass} /> : null}
      </header>
    </React.Fragment>
  )
}



Header.propTypes = {
  leftMenu: PropTypes.any,
  t: PropTypes.any,
  toggleLeftmenu: PropTypes.func
}

const mapStatetoProps = state => {
  const { layoutType, leftMenu } = state.Layout
  return { layoutType, leftMenu }
}

export default Header;