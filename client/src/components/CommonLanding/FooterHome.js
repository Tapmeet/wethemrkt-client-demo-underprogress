import React from "react"
import { Container, Row, Col } from "reactstrap"
import './FooterHome.css'

const FooterHome = () => {
  return (
    <React.Fragment>
      <footer className="footer bg-white">
        <div style={{ display: 'inline-block' }}>
          {/* <Row>
            <Col md={6} className="py-4">
              <Row className="links">
                <Col md={4}>
                  About
                </Col>
                <Col md={4}>
                  Best Practices
                </Col>
                <Col md={4}>
                  Careers
                </Col>
              </Row>
              <Row className="links">
                <Col md={4}>
                  Blog
                </Col>
                <Col md={4}>
                  Developers
                </Col>
                <Col md={4}>
                  Disclaimer
                </Col>
              </Row>
              <Row className="links">
                <Col md={4}>
                  Help
                </Col>
                <Col md={4}>
                  Privacy
                </Col>
                <Col md={4}>
                  Rules
                </Col>
              </Row>
              <Row className="links">
                <Col md={4}>
                  Terms
                </Col>
                <Col md={4}>
                  Disclosure
                </Col>
                <Col md={4}>
                  Advertise
                </Col>
              </Row>
            </Col>
            <Col md={6} className="py-4">
              <span className="bg-white social-icon p-4"><i className='bx bxl-twitter' ></i></span>
              <span className="bg-white social-icon p-4"><i className='bx bxl-instagram' ></i></span>
              <span className="bg-white social-icon p-4"><i className='bx bxl-facebook' ></i></span>
            </Col>
            
          </Row> */}

          <Row>
            <Col md={12}>{new Date().getFullYear()} © Wethemkrt.</Col>
          </Row>
        </div>
      </footer>
    </React.Fragment>
  )
}

export default FooterHome
