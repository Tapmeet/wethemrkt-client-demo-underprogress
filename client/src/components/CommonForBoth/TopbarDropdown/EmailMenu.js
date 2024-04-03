import React, { useState } from "react"
import PropTypes from 'prop-types'
import { Link } from "react-router-dom"
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from "reactstrap"
import SimpleBar from "simplebar-react"

//Import images
import avatar3 from "../../../assets/images/users/avatar-3.jpg"
import avatar4 from "../../../assets/images/users/avatar-4.jpg"

//i18n
import { withTranslation } from "react-i18next"

const EmailMenu = props => {
  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false)

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="dropdown d-inline-block bg-white"
        tag="li"
      >
        <DropdownToggle
          className="btn noti-icon "
          tag="button"
          id="page-header-notifications-dropdown"
        >
          <i className="bx bx-bell bx-envelope bg-white " /> &nbsp; <span className="bg-white">Messages</span>
          {/* <span className="badge bg-danger rounded-pill">2</span> */}
        </DropdownToggle>
      </Dropdown>
    </React.Fragment>
  )
}

export default withTranslation()(EmailMenu)

EmailMenu.propTypes = {
  t: PropTypes.any
}