// import React, { useState, useEffect } from "react"
// import PropTypes from "prop-types"

// // reactstrap
// import { Row, Col, Modal } from "reactstrap"

// import bearImage from "../../../assets/images/bear.png"
// import bullImage from "../../../assets/images/bull.png"

// //i18n
// // import { withTranslation } from "react-i18next"

// import moment from "moment"
// import PostComment from "../PostOptions/PostComment"
// import CommentCard from "../PostOptions/CommentCard"
// import "../../../assets/scss/custom/wethemkrt/people.scss"
// // import "../../../assets/scss/custom/wethemkrt/message.scss";
// import "../../../assets/scss/custom/wethemkrt/common.scss"
// import "../../../assets/scss/custom/wethemkrt/message.scss"

// const Message = props => {
//   const [modal_standard, setmodal_standard] = useState(false)
//   const [showpostcomment, setshowpostcomment] = useState(true)
//   const [closerecomment, setcloserecomment] = useState(false)
//   const [modal_retweet, setmodal_retweet] = useState(false)

//   useEffect(() => {
//     setmodal_standard(props.dataParentToChild)
//     removeBodyCss()
//   }, [])

//   function removeBodyCss() {
//     document.body.classList.add("no_padding")
//   }

//   function tog_standard() {
//     setmodal_standard(!modal_standard)
//     removeBodyCss()
//   }

//   function postComment(value) {
//     if (value == true) {
//       setcloserecomment(!value)
//     }
//     setshowpostcomment(value)
//   }

//   function handleChange() {
//     setmodal_standard(false)
//     props.onChange(false)
//   }

//   function handleComment() {
//     setshowpostcomment(true)
//     setcloserecomment(true)
//   }

//   function onRetweet() {
//     setmodal_retweet(true)
//   }

//   return (
//     <React.Fragment>
//       {props !== undefined ? (
//         <div className="topnav">
//           <div className="container-fluid">
//             <div>
//               <Modal
//                 size="lg"
//                 isOpen={modal_standard}
//                 toggle={() => {
//                   tog_standard()
//                 }}
//                 centered={true}
//                 className="modal-dialog-scrollable"
//               >
//                 <div className="modal-header d-flex justify-content-cente r">
//                   <h5 className="modal-title mt-0"> Message </h5>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       handleChange()
//                     }}
//                     className="close"
//                     data-dismiss="modal"
//                     aria-label="Close"
//                   >
//                     <span aria-hidden="true">&times;</span>
//                   </button>
//                 </div>
//                 <div className="modal-body">
//                   <Row>
//                     <div className="col-sm-1 col-2">
//                       <img
//                         className="rounded-circle header-profile-user"
//                         src={
//                           props.elementInfo.userimage == null
//                             ? user2
//                             : props.elementInfo.userimage
//                         }
//                         alt="Header Avatar"
//                       />
//                     </div>
//                     <div className="col-sm-11 col-10">
//                       <div className="d-flex align-items-center user-name">
//                         <h5 className="m-0 ">{props.elementInfo.username}</h5>
//                         <span className="font-size-12 text-muted">
//                           {moment(props.elementInfo.createddate).format(
//                             "DD/MM/YYYY HH:mm"
//                           )}
//                         </span>
//                       </div>
//                       <div className="post-text m-0 pt-2 ">
//                         {props.elementInfo.post}
//                       </div>
//                       {props.elementInfo.imageuri ? (
//                         <div className="mb-0 message-img">
//                           {" "}
//                           <img src={props.elementInfo.imageuri} />{" "}
//                         </div>
//                       ) : (
//                         ""
//                       )}
//                       {props.elementInfo.link ? (
//                         <div className="mb-0 message-img pt-3">
//                           <a href={props.elementInfo.link} target="_blank">
//                             <div className="preview-data mt-2">
//                               <div className="text-container">
//                                 <span className="header ">
//                                   {props.elementInfo.linktitle}
//                                 </span>
//                                 <span className="text-domain">
//                                   {props.elementInfo.linkdomain}
//                                 </span>
//                               </div>
//                               <div className="img-container">
//                                 <img
//                                   className="img"
//                                   src={props.elementInfo.linkimg}
//                                 />
//                               </div>
//                               <div className="text-container">
//                                 {/*<span className="domain">{element.linkdomain}</span>*/}
//                                 <span className="description">
//                                   {props.elementInfo.linkdescription}
//                                 </span>
//                               </div>
//                             </div>
//                           </a>
//                           <br />
//                           <span>
//                             Source :{" "}
//                             <a href={props.elementInfo.link} target="_blank">
//                               {props.elementInfo.link}
//                             </a>
//                           </span>
//                         </div>
//                       ) : null}
//                       <div className="pt-3">
//                         {/* {props.elementInfo.isnews ?<span className="btn-sm my-3 spn-people-hashtag" onClick={(e)=> e.preventDefault() }>#news</span>: null} */}
//                         {props.elementInfo.isfundamental ? (
//                           <span
//                             className="btn-sm my-3  spn-people-hashtag"
//                             onClick={e => e.preventDefault()}
//                           >
//                             #fundamental
//                           </span>
//                         ) : null}
//                         {props.elementInfo.istechnical ? (
//                           <span
//                             className="btn-sm my-3 spn-people-hashtag"
//                             onClick={e => e.preventDefault()}
//                           >
//                             #technical
//                           </span>
//                         ) : null}
//                       </div>
//                       <div className="font-size-20 post-icon">
//                         <div className="post-icon-size">
//                           <span className="post-icon-chat icon-p">
//                             <i
//                               className="mdi mdi-chat-outline people-pointer"
//                               onClick={() => handleComment(props.elementInfo)}
//                             />
//                           </span>
//                         </div>
//                         <div className="post-icon-size">
//                           <span className="post-icon-retweet icon-p">
//                             <i
//                               className="mdi mdi-twitter-retweet  people-pointer"
//                               onClick={() => onRetweet()}
//                             />
//                           </span>
//                         </div>
//                         {/* <div className="post-icon-size">
//                                 <button className="btn-icon-sentiment">
//                                 { props.elementInfo.bullish > 0 ? 
//                                   <div className=" px-2"> + {props.elementInfo.bullish} <img src={bullImage} height="25" width="25" className="text-end"></img></div> : 
//                                   <div className=" px-2"> {props.elementInfo.bearish} <img src={bearImage} height="25" width="25" className="text-end"></img></div>
//                                 } 
//                                 </button>
//                             </div> */}
//                         <div className="post-icon-size mr-50">
//                           {props.elementInfo.bullish == 0 &&
//                           props.elementInfo.bearish == 0 ? null : props
//                               .elementInfo.bullish > 0 ? (
//                             <button className="btn-icon-sentiment">
//                               <div className=" px-2">
//                                 {" "}
//                                 + {props.elementInfo.bullish}{" "}
//                                 <img
//                                   src={bullImage}
//                                   height="25"
//                                   width="25"
//                                   className="text-end"
//                                 ></img>
//                               </div>
//                             </button>
//                           ) : (
//                             <button className="btn-icon-sentiment">
//                               <div className=" px-2">
//                                 {" "}
//                                 {props.elementInfo.bearish}{" "}
//                                 <img
//                                   src={bearImage}
//                                   height="25"
//                                   width="25"
//                                   className="text-end"
//                                 ></img>
//                               </div>
//                             </button>
//                           )}
//                         </div>
//                         {/* <div className="post-icon-size">
//                               <span className="post-icon-heart icon-p">
//                                 <i className="mdi mdi-heart-outline people-pointer"/>
//                               </span>
//                             </div>
//                             <div className="post-icon-size">
//                               <span className="post-icon-share icon-p">
//                                 <i className="mdi mdi-share people-pointer"/>
//                               </span>
//                             </div>
//                             <div className="post-icon-size">
//                               <span className="post-icon-magnify icon-p">
//                                 <i className="mdi mdi-magnify people-pointer"/>
//                               </span>
//                             </div> */}
//                       </div>
//                     </div>
//                   </Row>
//                   {showpostcomment ? (
//                     <PostComment userPostInfo={props.elementInfo} />
//                   ) : null}
//                   <CommentCard
//                     onChange={postComment}
//                     userPostInfo={props.elementInfo}
//                     recomment={closerecomment}
//                   />
//                 </div>
//                 {/*<button type="button" className="btn btn-primary"> Save changes </button>*/}
//               </Modal>
//             </div>
//           </div>
//         </div>
//       ) : null}
//     </React.Fragment>
//   )
// }

// Message.propTypes = {
//   t: PropTypes.any,
// }

// export default (Message)
