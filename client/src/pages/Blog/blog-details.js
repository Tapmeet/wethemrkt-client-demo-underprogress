import React from "react"
import { Container, Card, CardBody,Col, Row } from "reactstrap"
import parse from 'html-react-parser';

// import images

import moment from "moment";

const BlogDetails = (props) => {

  return (
    <React.Fragment>
      <div className="page-content pt-0">
       
        <Container className="p-0">
          {/* <Breadcrumbs title="Blog" breadcrumbItem="Blog Details" /> */}
          <Row>
            <Col lg={12}>
              <Card className="mt-3">
                <CardBody className="blogs-border">
                    <div className="row justify-content-center">
                            <h1>{props.location.state.blogtitle}</h1>
                            <p className="text-muted mb-4">
                              <i className="mdi mdi-calendar me-1"></i> {moment(props.location.state.createddate).format("ll")}
                            </p>
                          <hr/>
                          <div className="my-3">
                            {props.location.state != undefined && props.location.state != null ?
                              <span  className="blogcontent">
                              {parse(props.location.state.blogcontent)}
                              </span> : null}
                          </div>
                    </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default BlogDetails
