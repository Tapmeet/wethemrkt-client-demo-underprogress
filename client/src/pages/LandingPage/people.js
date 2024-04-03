import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"
import { Row, CardText, Col, Container } from "reactstrap"
import moment from "moment"
import parse from "html-react-parser"
import { useHistory } from "react-router-dom"
import { Progress } from "reactstrap"
import { useQuery } from "react-query"
import axiosHttpMiddelware from "common/axiosHttpMiddelware"




import ImageModel from "./imageModel"
import Retweetcard from "./retweetcard"
import Login from "../../components/CommonForBoth/AuthenticationModel/Login"
import Signup from "../../components/CommonForBoth/AuthenticationModel/Signup"


import bearImage from "../../assets/images/bear.png"
import bullImage from "../../assets/images/bull.png"
import toastr from "toastr"


import "toastr/build/toastr.min.css"
import "../../assets/scss/custom/wethemkrt/people.scss"
import "../../assets/scss/custom/wethemkrt/link-preview.scss"


const PostCard = props => {
  ////console.log(props);
  const history = useHistory()
  //const [modal_message, setmodal_message] = useState(false)
  // const [modal_retweet, setmodal_retweet] = useState(false)
  const [modal_imageview, setmodal_imageview] = useState(false)
  const [modal_backdroplogin, setmodal_backdroplogin] = useState(false);
  const [modal_backdropsignup, setmodal_backdropsignup] = useState(false);
  const [imageViewData, setimageViewData] = useState("")
  
  //Need to think more about the kudosCoin logic -- Need to display them along with the user name.
  const [kudosCoin, setkudosCoin] = useState({ coinCount: 0, progress: "0" })
  const [postData, setPostData] = useState({});
  
//   const { isLoading, error, data, isFetching } = useQuery("getTopFivePost", () =>
//   axiosHttpMiddelware.get(
//     "getTopFivePost"
//   ).then((res) => {
//     // console.log("getTopFivePost");
//     // console.log(res.data.userPostResponse);
//     setPostData(res.data.userPostResponse); })
// );

// if (isLoading) return (
//   <div id="preloader">
// <div id="status">
//   <div className="spinner-chase">
//     <div className="chase-dot" />
//     <div className="chase-dot" />
//     <div className="chase-dot" />
//     <div className="chase-dot" />
//     <div className="chase-dot" />
//     <div className="chase-dot" />
//   </div>
// </div>
// </div>);

// if (error) return "An error has occurred: " + error.message;




  // function handleChange(postid, key) {
  //   props.onChange(postid, key)
  // }
  function tog_backdroplogin() {
    setmodal_backdroplogin(true);
  }

  function tog_backdropsignup() {
    setmodal_backdropsignup(true);
  }

  function handleChangeLogin(value,issignup)
  {
    setmodal_backdroplogin(value);
    if (issignup) {
      tog_backdropsignup();
    }
  }

  function handleChangeSignup(value,islogin)
  {
    setmodal_backdropsignup(value);
    if (islogin) {
      tog_backdroplogin();
    }
  }

  function onImageView(element) {
    setmodal_imageview(true)
    setimageViewData(element)
  }

  function handleChangeImageView(value) {
    setmodal_imageview(value)
  }

  // const userprofile = (username, userid) => {
  //   history.push({ pathname: `/viewprofile/${username}`, state: userid })
  // }

  // async function getUserPostList() {
    // if (localStorage.getItem("user")) {
    //   const obj = JSON.parse(localStorage.getItem("user"))
    //   setloginUserID(obj.id)
    // }

    // const response = await post.getTopFivePost();
    //      if (
    //     response.status == 200 &&
    //     response.data.userPostResponse !== undefined &&
    //     response.data.userPostResponse.length > 0
    //   ) {
    //     //console.log("Inside post api");
    //     //console.log(response.data.userPostResponse);
    //     setPostData(response.data.userPostResponse);
    //   } else{
    //     //handel errors
    //     //console.log("Inside post errors");
    //     //console.log(response);

    //   }

  // }

  // async function getUserInfo(userid) {
  //   // setkudosCoin({ coinCount: 0, progress: "0" })
  //   // if (userid > 0) {
  //   //   const response = await kudoscoin.getKudosCountByUser(userid)
  //   //   if (
  //   //     response.status == 200 &&
  //   //     response.data.kudosCoinResponse !== undefined &&
  //   //     response.data.kudosCoinResponse.length > 0
  //   //   ) {
  //   //     setkudosCoin({
  //   //       ...kudosCoin,
  //   //       coinCount: response.data.kudosCoinResponse[0].kudoscoincount,
  //   //       progress: response.data.kudosCoinResponse[0].progress,
  //   //     })
  //   //   }else if ( response.status == 400 ) {
  //   //     setkudosCoin({ coinCount: 0, progress: "0" })
  //   //   }
  //   // }
  // }

  return (
    <React.Fragment>
      {
        <div>
          <Container>
            <Row className="post-content align-items-center">
            <Col lg="5"></Col>
            {modal_backdroplogin ? <Login onChange={handleChangeLogin} dataParentToChild={modal_backdroplogin}/> : null}
            {modal_backdropsignup ? <Signup onChange={handleChangeSignup} dataParentToChild={modal_backdropsignup}/> : null}
            { postData === null ? <div className="h2 text-center mt-3"> No Post found. Please make some posts. </div> : <></>}
            {postData !== null && postData !== undefined && postData.length > 0
            ? postData.map((element, key) => (
                <div key={key}>
                  <Row className="comment-card px-md-3 px-0">
                    <div className="col-sm-1 col-2 d-flex text-center p-0">
                      <div>
                        <input
                          // checked={false}
                          type="radio"
                          className="btn-check"
                          name={element.id}
                          id={element.id + "-up"}
                          autoComplete="off"
                          onClick={() => { tog_backdroplogin() }}
                          defaultChecked={false}
                        />
                        <label
                          className="btn btn-outline m-0 p-0 icon-text"
                          htmlFor={element.id + "-up"}
                        >
                          <i className="mdi mdi-arrow-up-bold d-block vote-icon-size"></i>
                         
                        </label>
                        <h6 className="text-muted m-0 votes-text">
                          {element.upvotecount}
                        </h6>
                        <h6 className="m-0 votes-text">upvotes</h6>
                        <input
                          // checked={false}
                          type="radio"
                          className="btn-check"
                          name={element.id}
                          id={element.id + "-down"}
                          autoComplete="off"
                          onClick={() => { tog_backdroplogin() }}
                           defaultChecked={element.downvote == 0 ? false : true}
                        />
                        <label
                          className="btn btn-outline p-0 m-0 mt-1 icon-text"
                          htmlFor={element.id + "-down"}
                        >
                          <i className="mdi mdi-arrow-down-bold d d-block vote-icon-size"></i>
                      
                        </label>
                      </div>
                    </div>

                    <div className="col-sm-11 py-3 col-10  p-0">
                      <Row>
                        <div className="col-sm-1 col-2 ">
                          <img
                            className="rounded-circle header-profile-user"
                            src={element.profilePhoto}
                            alt="Header Avatar"
                          />
                        </div>
                        <div className="col-sm-11 col-10">
                          <div className="d-flex align-items-center user-name ">
                            <div>
                              <h5 className="m-0 p-1 text-transform tooltipyy"> {element.username} </h5> 
                              {/* <h5 */}
                                {/* className="m-0 text-transform tooltipyy"                                */}
                              {/* > */}
                                {/* {element.username} */}
                                {/* <span className="classic "> */}
                                  {/* <div className="row"> */}
                                    {/* <div className="col-5"> */}
                                      {/* <h4
                                        className="hover-profile-name  one-line-dot"
                                        onClick={() =>
                                          userprofile(
                                            element.username,
                                            element.userid
                                          )
                                        }
                                      >
                                        {element.username}
                                      </h4>
                                      <span className="font-size-12 text-muted hover-time m-0">
                                        {moment(element.createddate).format(
                                          "DD/MM/YYYY HH:mm"
                                        )}
                                      </span>
                                    </div> */}
                                    {/* <div className="col-2 p-0">
                                      <div className="d-flex justify-content-center align-items-center">
                                        <span className="dollar-box">
                                          <i className="bx bx-dollar-circle dollar-icon-uesr"></i>{" "}
                                          <span className="dollar-count ms-2">
                                            {" "}
                                            {kudosCoin.coinCount}{" "}
                                          </span>
                                        </span>
                                      </div>
                                    </div> */}
                                    {/* <div className="col-5">
                                      <div className="text-center">
                                        <Progress
                                          className=" mb-2 progress-profile"
                                          color="primary"
                                          value={kudosCoin.progress}
                                        />
                                        <span>
                                          Top {kudosCoin.progress}% of users
                                        </span>
                                      </div>
                                    </div> */}
                                  {/* </div> */}
                                  {/* <div className="border-t mt-2"></div> */}
                                  {/* <div className="row">
                                    {/* <div className="col-6 text-center followin-text-hover p-2">
                                      <h6 className="m-0 ">2.6K</h6>
                                      <span className="m-0 ">Following</span>
                                    </div>
                                    <div className="col-6 text-center followin-text-hover p-2">
                                      <h6 className="m-0 ">2.6K</h6>
                                      <span className="m-0 ">Followers</span>
                                    </div>
                                  </div> */}
                                  {/* <div className="border-b mb-2"></div> */}
                                  {/* <button
                                    type="button"
                                    className="btn btn-sign-up w-100"
                                  >
                                    {" "}
                                    Follow
                                  </button> */}
                                  {/* <div
                                    className="m-0 pt-3 text-center view-profile-text "
                                    onClick={() => { tog_backdroplogin() }} >
                                    View Profile
                                  </div> */}
                                {/* </span> */}
                              {/* </h5> */}
                            </div>
                            {/* <span className="dollar-box">
                              <i className="bx bx-dollar-circle dollar-icon-uesr"></i>{" "}
                              <span className="dollar-count ms-1">
                                {" "}
                                {element.kudoscoincount}{" "}
                              </span>
                            </span> */}
                            <span className="p-2 font-size-12 text-muted">
                              {moment(element.createddate).format(
                                "DD/MM/YYYY HH:mm"
                              )}
                            </span>
                          </div>
                          <div className="post-text m-0 pt-2">
                            {parse(element.htmlpost)}
                          </div>
                          {element.isretweet ? (
                            <Retweetcard dataRetweet={element} />
                          ) : null}
                          <div className="mb-0 message-img ">
                            {element.imageuri ? (
                              <img
                                src={element.imageuri}
                                onClick={() => onImageView(element)}
                                height="50%"
                                width="50%"
                              />
                            ) : (
                              ""
                            )}
                            {element.link ? (
                              <div className="mb-0 message-img pt-3">
                                <a href={element.link} target="_blank">
                                  <div className="preview-data mt-2">
                                    <div className="text-container">
                                      <span className="header ">
                                        {element.linktitle}
                                      </span>
                                      <span className="text-domain">
                                        {element.linkdomain}
                                      </span>
                                    </div>
                                    <div className="img-container">
                                      <img
                                        className="img"
                                        src={element.linkimg}
                                      />
                                    </div>
                                    <div className="text-container">
                                      {/*<span className="domain">{element.linkdomain}</span>*/}
                                      <span className="description">
                                        {element.linkdescription}
                                      </span>
                                    </div>
                                  </div>
                                </a>
                                <br />
                                <span>
                                  Source :{" "}
                                  <a href={element.link} target="_blank">
                                    {element.link}
                                  </a>
                                </span>
                              </div>
                            ) : null}
                            {/*{element.link ? <div className="mb-0 message-img pt-3"> Source : <a href={element.link} target="_blank" >{element.link}</a></div> : null} */}
                            <div className="pt-3">
                              {/* {element.isnews ?<span className="btn-sm my-3 spn-people-hashtag" onClick={(e)=> e.preventDefault() }>#news</span>: null} */}
                              {element.isfundamental ? (
                                <span
                                  className="btn-sm my-3  spn-people-hashtag"
                                  onClick={() => { tog_backdroplogin() }}
                                >
                                  #fundamental
                                </span>
                              ) : null}
                              {element.istechnical ? (
                                <span
                                  className="btn-sm my-3  spn-people-hashtag"
                                  onClick={() => { tog_backdroplogin() }}
                                >
                                  #technical
                                </span>
                              ) : null}
                            </div>
                          </div>
                         <div className="font-size-20 d-flex align-items-center pt-3 ">
                            {/*  <div className="post-icon-size mr-50">
                              <span className="post-icon-chat icon-p">
                                <i
                                  className="mdi mdi-chat-outline people-pointer"
                                  onClick={() => onMessage(element)}
                                />
                              </span>
                            </div> */}
                            <div className="post-icon-size mr-50">
                              <span className="post-icon-retweet icon-p">
                                <i
                                  className="mdi mdi-twitter-retweet people-pointer"
                                  onClick={() => { tog_backdroplogin() }}
                                />
                              </span>
                            </div>
                            <div className="post-icon-size mr-50">
                              <span className="post-icon-retweet icon-p">
                                <i
                                  className="mdi mdi-share"
                                  onClick={() => {
                                  ////console.log(element.postguid);
                                  let postLocation = window.origin+"/post/"+element.postguid;
                                  ////console.log(postLocation);
                                  navigator.clipboard.writeText(postLocation);

                                  toastr.success(postLocation,"Link copied to clipboard");

                                  }}
                                />
                              </span>
                            </div>
                            
                            <div className="post-icon-size mr-50">
                              {element.bullish == 0 &&
                              element.bearish == 0 ? null : element.bullish >
                                0 ? (
                                <button className="btn-icon-sentiment">
                                  <div className=" px-2">
                                    {" "}
                                    + {element.bullish}{" "}
                                    <img
                                      src={bullImage}
                                      height="25"
                                      width="25"
                                      className="text-end"
                                    ></img>
                                  </div>
                                </button>
                              ) : (
                                <button className="btn-icon-sentiment">
                                  <div className=" px-2">
                                    {" "}
                                    {element.bearish}{" "}
                                    <img
                                      src={bearImage}
                                      height="25"
                                      width="25"
                                      className="text-end"
                                    ></img>
                                  </div>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </Row>
                    </div>
                  </Row>
                </div>
              ))
            : null}
          {modal_imageview ? (
            <ImageModel
              onChange={handleChangeImageView}
              dataParentToChild={modal_imageview}
              elementInfo={imageViewData}
            />
          ) : null}
          {/* {modal_message ? (
            <Message
              onChange={handleChangeMessage}
              dataParentToChild={modal_message}
              elementInfo={messageData}
            />
          ) : null} */}
          {/* {modal_retweet ? (
            <Retweet
              onChange={handleChangeRetweet}
              dataParentToChild={modal_retweet}
              elementInfo={retweetData}
            />
          ) : null} */}
          </Row>
          </Container>
          
        </div>
      }
      
    </React.Fragment>
  )
}

export default PostCard
