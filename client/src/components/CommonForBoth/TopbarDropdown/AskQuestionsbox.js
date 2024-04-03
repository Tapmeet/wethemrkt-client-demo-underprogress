import React,{useState,useEffect } from "react"
import PropTypes from 'prop-types'
import { Row, Col,CardText} from "reactstrap"

import { Field, Form } from '@availity/form';
import '@availity/yup';
import * as yup from 'yup';

// import { AvForm,Field } from "availity-reactstrap-validation"

import 'bootstrap/dist/css/bootstrap.css'; // or include from a CDN

// users


// import userpost from '../../../services/post.service';

import 'draft-js/dist/Draft.css';

import "../../../assets/scss/custom/wethemkrt/post-AskQuestionsbox.scss";
// import user from '../../../services/user.service';

//i18n
// import { withTranslation } from "react-i18next"

const AskQuestionsbox = (props) => {
    const [questiontextcount, setquestiontextcount] = useState(150)
    const [modal_backdrop, setmodal_backdrop] = useState(false);
    const [userInfo, setuserInfo] = useState({id:"",name:"", profilePhoto: "",isadmin:""});

    useEffect(() => {

      if (localStorage.getItem("user")) {
        const obj = JSON.parse(localStorage.getItem("user"))
      
          axiosHttpMiddelware.post("/usergetbyid",{userid : obj.id}).then((userResponse) => {
       
          if (
            userResponse !== undefined &&
            userResponse.status === 200 &&
            userResponse.data.userResponse !== null &&
            userResponse.data.userResponse !== undefined
          ) {
            setuserInfo({
              ...userInfo,
              id: userResponse.data.userResponse.id,
              name: userResponse.data.userResponse.username,
              profilePhoto: userResponse.data.userResponse.profilePhoto,
              isadmin: userResponse.data.userResponse.isadmin,
            })
          }
  

        }).catch((err) => {
          console.log(err);
          toaster.errorToaster("usergetbyid in post editor","Error");
        })
      }

    
      }, [])

    function questiontextareachange(event) {
        const questiontextcount = event.target.value.length
        var remainingquestiontextlength = 150 - questiontextcount;
        setquestiontextcount(remainingquestiontextlength);
    }
    
    const handleValidSubmit = (event, values) => {
    // if (localStorage.getItem("user")) {
    //     const obj = JSON.parse(localStorage.getItem("user"))

    //     var newValues = {
    //     userid : obj.id,
    //     userpost :values.userpost
    //     }
    //     const response = userpost.createUserPost(newValues);
    //     setmodal_backdrop(false);
    //     //setisCallFeed(!isCallFeed);
    // }
    }

  return (
    <React.Fragment>
            <Form initialValues={{}} className="form-horizontal" onSubmit={(value) => { handleValidSubmit(value) }}>
                <Row>
                <Col sm="12">
                    <CardText className="mb-0">
                    <Row>
                    <Col lg={1} className="mt-3 text-sm-end">
                        <img className="rounded-circle header-profile-user" src={userInfo.raw}  alt="Header Avatar" />
                    </Col>
                    <Col lg={9}>
                        <div className="modal-body">
                        <Field name="userpost" className="form-control" type="textarea" rows={5} required onChange={e => {questiontextareachange(e)}} maxLength="150"/>
                        </div>
                    </Col>
                    <Col lg={2}>
                        <div>
                        <br/>
                        <br/>
                        <br/>
                        <span className="text-muted font-size-16">
                            {" "}
                            {questiontextcount}
                        </span>
                        <br/>
                        <button type="submit" className="btn btn-primary btn-lg mt-2">Ask</button>
                        </div>
                    </Col>
                    </Row>
                    </CardText>
                </Col>
                </Row>
            </Form>
    </React.Fragment>
  )
}

//export default PostModel
export default (AskQuestionsbox)

AskQuestionsbox.propTypes = {
  t: PropTypes.any
}
