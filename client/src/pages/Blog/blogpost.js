import React, { useState ,useEffect } from "react"
import {Card,Col,Row} from "reactstrap"

import "../../assets/scss/custom/wethemkrt/blogpost.scss";
import { map } from "lodash";
import { Link } from "react-router-dom"
import parse from 'html-react-parser';
// import blog from '../../services/blog.service';

import moment from "moment";

const BlogPost = () => {
  const [activeTab, toggleTab] = useState("1");
  const [blogpost, setblogposet] = useState([]);

  const toggle = tab => {
    if (activeTab !== tab) toggleTab(tab)
  }

  useEffect(() => {
    getBlogInfo();
  }, [])

  async function getBlogInfo(){
  //   if (localStorage.getItem("user")) {
    
  //   const blogResponse = await blog.getBlog();
  //   if (blogResponse !== undefined && blogResponse.status === 200 && blogResponse.data.blogResponse !== null && blogResponse.data.blogResponse !== undefined) 
  //   {
  //     setblogposet(blogResponse.data.blogResponse);
  //   }
  // }
  }
  return (
    <React.Fragment>

      <div className="container p-0">
        <div className="row pt-5 ">
          <Row className="justify-content-center pt-5">
            <Col xl={12}>
                  {blogpost.length > 0 ? 
                    <Row>
                  {map(Object.keys(blogpost), key => (
                    <Col className="col-lg-4 col-md-6 col-12" key={key}>
                    <Card className="p-1 border shadow-none blog-bg">
                      <div className="position-relative">
                        <div className="">
                            <span  className="blogcontent-blogpost">
                            {parse(blogpost[key].blogcontent)} </span>
                            </div> 
                        </div>
                      <div className="p-3">
                        <ul className="list-inline mb-3">
                          <li className="list-inline-item me-3">
                            <Link to="#" className="text-muted">
                              <i className="bx bx-time align-middle text-muted me-1"></i>{" "}
                              {moment(blogpost[key].createddate).format("ll")}
                            </Link>
                          </li>
                        </ul>
                        <h4 className="block-ellipsis">
                          <Link to={{pathname:"blog-details",state:blogpost[key]}} className="text-dark">
                            {blogpost[key].blogtitle}
                          </Link>
                        </h4>
                        <div className="pt-3">
                        <Link to={{pathname:"blog-details",state:blogpost[key]}} className="text-primary ">
                            Read more{" "}
                            <i className="mdi mdi-arrow-right"></i>
                          </Link>
                        </div>
                         
                      </div>
                    </Card>
                    </Col>
                    ))} </Row>: null
                  }
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  )
}
export default BlogPost
