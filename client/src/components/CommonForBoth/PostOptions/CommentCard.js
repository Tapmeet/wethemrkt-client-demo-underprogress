// import React, { useEffect, useState } from "react"
// import PropTypes from "prop-types"
// import { Row, Col } from "reactstrap"

// // import { AvForm } from "availity-reactstrap-validation"
// // import { useHistory } from "react-router-dom";

// import bearImage from "../../../assets/images/bear.png"
// import bullImage from "../../../assets/images/bull.png"

// import "bootstrap/dist/css/bootstrap.css" // or include from a CDN
// import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css"

// import "../../../assets/scss/custom/wethemkrt/commentcard.scss"
// import "../../../assets/scss/custom/wethemkrt/common.scss"

// //i18n
// // import { withTranslation } from "react-i18next"



// import PostComment from "../PostOptions/PostComment"
// import moment from "moment"

// const CommentCard = props => {
//   var arrReCommentOpen = []
//   const [userCommentData, setuserCommentData] = useState([])
//   // const [showrecomment, setshowrecomment] = useState(false);
//   const [preserveData, setpreserveData] = useState({ arry: arrReCommentOpen })
//   if (
//     props.recomment !== undefined &&
//     props.recomment !== null &&
//     props.recomment == true
//   ) {
//     if (preserveData.arry.length > 0) {
//       preserveData.arry.map((key, value) => {
//         key.open = false
//       })
//     }
//     props.onChange(true)
//   }
//   useEffect(() => {
//     async function getUserComment() {
//       // if (props.userPostInfo !== null && props.userPostInfo !== undefined) {
//       //   const response = await comment.getUserComment(props.userPostInfo.id)
//       //   if (
//       //     response.status == 200 &&
//       //     response.data.userCommentResponse !== undefined &&
//       //     response.data.userCommentResponse.length > 0
//       //   ) {
//       //     setuserCommentData(response.data.userCommentResponse)
//             arrReCommentOpen = []
//       //     if (response.data.userCommentResponse.length > 0) {
//       //       for (
//       //         let index = 0;
//       //         index < response.data.userCommentResponse.length;
//       //         index++
//       //       ) {
//       //         const element = response.data.userCommentResponse[index]
//       //         arrReCommentOpen.push({ commentid: element.id, open: false })
//       //       }
//             setpreserveData({ arry: arrReCommentOpen })
//           }
//         //}
//     //   }
//     // }
//     getUserComment()
//   }, [])

//   function handleReComment(value) {
//     props.onChange(false)
//     setpreserveData({
//       ...preserveData,
//       arry: preserveData.arry.map(item =>
//         item.commentid === value.id
//           ? { ...item, open: true }
//           : { ...item, open: false }
//       ),
//     })
//     //setshowrecomment(true);
//   }

//   return (
//     <React.Fragment>
//       {userCommentData !== undefined && userCommentData.length > 0
//         ? userCommentData.map((element, key) => (
//             <Row key={key}>
//               <div className="p-0">
//                 <div className="mt-3 p-3 comment-card">
//                   <Row>
//                     <Col lg={1}>
//                       <img
//                         className="rounded-circle header-profile-user"
//                         src={user2}
//                         alt="Header Avatar"
//                       />
//                     </Col>
//                     <Col lg={11}>
//                       <div className="d-flex align-items-center user-name">
//                         <h5 className="m-0 ">{element.commnetusername}</h5>
//                         <span className="font-size-12 text-muted">
//                           {moment(element.createddate).format(
//                             "DD/MM/YYYY HH:mm"
//                           )}
//                         </span>
//                       </div>
//                       <div className="post-text  pt-2 "> {element.usercomment}</div>{" "}
//                       {/*<span>@{element.postusername}</span>*/}
//                       <div className="mb-0 message-img">
//                         {" "}
//                         {element.imageuri ? <img src={element.imageuri} /> : ""}
//                         {element.link ? (
//                           <div className="mb-0 message-img pt-3">
//                             <a href={element.link} target="_blank">
//                               <div className="preview-data mt-2">
//                                 <div className="text-container">
//                                   <span className="header ">
//                                     {element.linktitle}
//                                   </span>
//                                   <span className="text-domain">
//                                     {element.linkdomain}
//                                   </span>
//                                 </div>
//                                 <div className="img-container">
//                                   <img className="img" src={element.linkimg} />
//                                 </div>
//                                 <div className="text-container">
//                                   {/*<span className="domain">{element.linkdomain}</span>*/}
//                                   <span className="description">
//                                     {element.linkdescription}
//                                   </span>
//                                 </div>
//                               </div>
//                             </a>
//                             <br />
//                             <span>
//                               Source :{" "}
//                               <a href={element.link} target="_blank">
//                                 {element.link}
//                               </a>
//                             </span>
//                           </div>
//                         ) : null}
//                         <div className="pt-3">
//                           {/* {element.isnews ?<span className="btn-sm my-3 spn-people-hashtag" onClick={(e)=> e.preventDefault() }>#news</span>: null} */}
//                           {element.isfundamental ? (
//                             <span
//                               className="btn-sm my-3  spn-people-hashtag"
//                               onClick={e => e.preventDefault()}
//                             >
//                               #fundamental
//                             </span>
//                           ) : null}
//                           {element.istechnical ? (
//                             <span
//                               className="btn-sm my-3 spn-people-hashtag"
//                               onClick={e => e.preventDefault()}
//                             >
//                               #technical
//                             </span>
//                           ) : null}
//                         </div>
//                       </div>
//                       <div className="font-size-20 post-icon">
//                         <div className="post-icon-size">
//                           <span className="post-icon-chat icon-p">
//                             <i
//                               className="mdi mdi-chat-outline people-pointer"
//                               onClick={() => handleReComment(element)}
//                             />
//                           </span>
//                         </div>
//                         <div className="post-icon-size">
//                           <span className="post-icon-retweet icon-p">
//                             <i className="mdi mdi-twitter-retweet  people-pointer" />
//                           </span>
//                         </div>
//                         <div className="post-icon-size">
//                           <button className="btn-icon-sentiment">
//                             {element.bullish > 0 ? (
//                               <div className=" px-2">
//                                 {" "}
//                                 + {element.bullish}{" "}
//                                 <img
//                                   src={bullImage}
//                                   height="25"
//                                   width="25"
//                                   className="text-end"
//                                 ></img>
//                               </div>
//                             ) : (
//                               <div className=" px-2">
//                                 {" "}
//                                 {element.bearish}{" "}
//                                 <img
//                                   src={bearImage}
//                                   height="25"
//                                   width="25"
//                                   className="text-end"
//                                 ></img>
//                               </div>
//                             )}
//                           </button>
//                         </div>
//                         {/* <div className="post-icon-size">
//                         <span className="post-icon-heart icon-p">
//                               <i className="mdi mdi-heart-outline people-pointer"/>
//                         </span>
//                     </div>
//                     <div className="post-icon-size">
//                         <span className="post-icon-share icon-p">
//                             <i className="mdi mdi-share people-pointer"/>
//                         </span>
//                     </div>
//                     <div className="post-icon-size">
//                         <span className="post-icon-magnify icon-p">
//                         <i className="mdi mdi-magnify people-pointer"/>
//                         </span>
//                     </div> */}
//                       </div>
//                     </Col>
//                   </Row>
//                   <div>
//                     {preserveData.arry.length > 0 &&
//                     preserveData.arry.find(
//                       item => item.commentid === element.id
//                     ).open ? (
//                       <PostComment userPostInfo={element} />
//                     ) : null}
//                   </div>
//                 </div>
//               </div>
//             </Row>
//           ))
//         : null}
//     </React.Fragment>
//   )
// }

// //export default PostModel
// export default (CommentCard)

// CommentCard.propTypes = {
//   t: PropTypes.any,
// }
