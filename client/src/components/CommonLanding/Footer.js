import React from "react"
import { Container, Row, Col } from "reactstrap"
import './Footer.css'

const Footer = () => {
  return (
    <React.Fragment>
      <footer className="footer bg-white">
        <div style={{ display:'inline-block' }}>
          <Row>
            <Col md={12} className="py-4">
              <span className="bg-white social-icon p-1 m-1"><i className='bx bxl-twitter' ></i></span>
              <span className="bg-white social-icon p-1 m-1"><i className='bx bxl-instagram' ></i></span>
              <span className="bg-white social-icon p-1 m-1"><i className='bx bxl-facebook' ></i></span>
            </Col>
          </Row>
          <Row className="m-4">
            <Col md={12}>{new Date().getFullYear()} © Wethemkrt.</Col>
          </Row>
        </div>
      </footer>
    </React.Fragment>
  )
}

export default Footer
