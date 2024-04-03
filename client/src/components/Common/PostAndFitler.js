import PropTypes from "prop-types"
import React, { useEffect, useState, useRef } from "react"
import { Row, CardText } from "reactstrap"
import moment from "moment"
import parse from "html-react-parser"
import { useHistory } from "react-router-dom"
import { Progress } from "reactstrap"
import toastr from "toastr"
import Retweetcard from "./RetweetCard"
import ImageModel from "./ImageModel"
import Toaster from "components/Common/Toaster"
import Retweet from "./RetweetModal"
import SimpleBar from "simplebar-react"
import axiosAuthHttpMiddelware from "common/axiosAuthHttpMiddelware"

import bearImage from "../../assets/images/bear.png"
import bullImage from "../../assets/images/bull.png"

import "toastr/build/toastr.min.css"
import "../../assets/scss/custom/wethemkrt/people.scss"
import "../../assets/scss/custom/wethemkrt/link-preview.scss"


//this component is responsible to fetch the data filterwise.
const PostAndFilter = props => {
	console.log("inside post and filter component")
	// console.log(props);
	const history = useHistory()
	//const [modal_message, setmodal_message] = useState(false)
	const [modal_retweet, setmodal_retweet] = useState(false)
	const [modal_imageview, setmodal_imageview] = useState(false)
	const [userPostData, setuserPostData] = useState([])
	//const [messageData, setmessageData] = useState("")
	const [retweetData, setretweetData] = useState("")
	const [imageViewData, setimageViewData] = useState("")
	const [loginUserID, setloginUserID] = useState(0)
	const [kudosCoin, setkudosCoin] = useState({ coinCount: 0, progress: "0" })
	const [countUpdate, setcountUpdate] = useState(false)
  	const [buttonRealTime, setbuttonRealTime] = useState(false)
  	let intervalId = useRef(null)
	//const [userRetweetPostData, setuserRetweetPostData] = useState([])
	//const [modal_sharePreview, setModalSharePreview] = useState(false)

	var previewData = ""

	const getUserPostList = async () => {
	console.log("inisde get user postlist")
    if (localStorage.getItem("user")) {
      setuserPostData([])
      // const obj = JSON.parse(localStorage.getItem("user"))
	console.log("get user post list")      
      axiosAuthHttpMiddelware.get("/post/userDashboard").then((response) => {
        //debugger;
		console.log(response)
        if ( response.status == 200 && response.data.postData !== undefined ) {
			console.log(response.data.postData)
          setuserPostData(response.data.postData)
          //userPostData =  response.data.userPostResponse;
        } else {
          setuserPostData([])
        }
        
      }).catch((err) => {
        console.log(err);
       // Toaster.errorToaster(err.data.response , "Error");
      })

      
      //const response = await userpost.getUserPost(obj.id)
    }
  }

	useEffect(() => {
		console.log("inside use effect.")
		getUserPostList()
	}, [])

	  

  //var userPostData = '';




 

  async function handleStart() {
    clearInterval(intervalId.current)

    // var timeinterval = 20 * 1000; //1 second
    // loadinterval= setInterval(()=>{
    //   getPostbyTimeFilter("RealTime");
    // },timeinterval)

    // setIntervalTime(loadinterval);
    intervalId.current = setInterval(() => {
      getPostbyTimeFilter("RealTime")
    }, 5000)
  }

  function handleReset() {
    clearInterval(intervalId.current)
  }

  async function getPostbyTimeFilter(filterdata) {
    if (localStorage.getItem("user")) {
      setuserPostData([])
      // const obj = JSON.parse(localStorage.getItem("user"))
      // var newValues = {
      //   userid: obj.id,
      //   filtervalue:
      //     filterdata.target != undefined ? filterdata.target.value : filterdata,
      // }
      // if (filterdata == "Pause") {
      //   filterdata = ""
      //   setbuttonRealTime(true)
      //   handleReset()
      //   getUserPostList()
      // } else {

        
      //   const response = await userpost.getUserPostbyTimeFilter(newValues)
      //   if (
      //     response !== undefined &&
      //     response.data.filterResponse !== undefined &&
      //     response.status == 200 &&
      //     response.data.filterResponse.length > 0
      //   ) {
      //     setuserPostData(response.data.filterResponse)
      //     if (filterdata == "RealTime") {
      //       setbuttonRealTime(!buttonRealTime)
      //       handleStart()
      //     } else {
      //       filterdata = ""
      //       setbuttonRealTime(true)
      //       handleReset()
      //     }
      //   }
      // }
    }
  }

  async function getPostbyTagFilter(filterdata) {
    if (localStorage.getItem("user")) {
      // setuserPostData([])
      // const obj = JSON.parse(localStorage.getItem("user"))

      // var newValues = {
      //   userid: obj.id,
      //   filtervalue: filterdata.target.value,
      // }

      // const response = await userpost.getUserPostbyTagFilter(newValues)
      // if (
      //   response !== undefined &&
      //   response.data.filterResponse !== undefined &&
      //   response.status == 200 
      // ) {
      //   setuserPostData(response.data.filterResponse)
      //   filterdata = ""
      //   setbuttonRealTime(true)
      //   handleReset()
      // }
    }
  }

  async function handleChange(value, key) {
    if (localStorage.getItem("user")) {
      const obj = JSON.parse(localStorage.getItem("user"))

      
      if(value.userid == obj.id)
      {
          Toaster.errorToaster("You can't upvote your own post.", "Error");
      } else {

        var userPostData = {
          postid: value.id,
          userid: obj.id,
          kudosuserid: value.userid,
          upvote: key == "up" ? 1 : 0,
          downvote: key == "down" ? 1 : 0,
        }
  
        
      // axiosHttpMiddelware.post("/updateuserpostvotecount", { userPostData }).then((response) => {
      //   setcountUpdate(!countUpdate)
      // }).catch((err) => {
        
      //   console.log("error updating post vote count.")
      //   console.log(err)
  
      // })
  

      }

      //const response = await userpost.updateUserPostVoteCount(newValues)
      setcountUpdate(!countUpdate)
    }
  }
	// async function getUserPostList() {
	// 	// if (localStorage.getItem("user")) {
	// 	//   const obj = JSON.parse(localStorage.getItem("user"))
	// 	//   axiosHttpMiddelware.post("/userpostget",{ userid : obj.id}).then((response) => {
	// 	//     //debugger;
	// 	//    if (response.status == 200 && response.data.userPostResponse!== undefined && response.data.userPostResponse.length > 0) {
	// 	//          setuserPostData(response.data.userPostResponse);
	// 	//        }
	// 	//   }).catch((err) => {
	// 	//     Toaster.errorToaster(err.data.response , "Error");
	// 	//   })
	// 	// }
	// }

	function handleChange(postid, key) {
		props.onChange(postid, key)
	}

	// function onMessage(element) {
	//   setmodal_message(true)
	//   setmessageData(element)
	// }

	function onRetweet(element) {
		setmodal_retweet(true)
		setretweetData(element)
	}

	function onImageView(element) {
		setmodal_imageview(true)
		setimageViewData(element)
	}

	// function handleChangeMessage(value) {
	//   setmodal_message(value)
	// }

	function handleChangeRetweet(value) {
		setmodal_retweet(value)
		//props.onChange(false);
	}

	function handleChangeImageView(value) {
		setmodal_imageview(value)
	}

	const userprofile = (username, userid) => {
		history.push({ pathname: `/viewprofile/${username}`, state: userid })
	}

	async function getUserInfo(userid) {
		setkudosCoin({ coinCount: 0, progress: "0" })
		if (userid > 0) {
			// axiosHttpMiddelware.post("getKudosCountByUser",{userid : userid}).then((response) => {
			//   if (
			//     response.status == 200 &&
			//     response.data.kudosCoinResponse !== undefined &&
			//     response.data.kudosCoinResponse.length > 0
			//   ) {
			//     setkudosCoin({
			//       ...kudosCoin,
			//       coinCount: response.data.kudosCoinResponse[0].kudoscoincount,
			//       progress: response.data.kudosCoinResponse[0].progress,
			//     })
			//   } else if ( response.status == 200 &&  response.data.kudosCoinResponse === null) {
			//       setkudosCoin({ coinCount: 0, progress: "0" })
			//     }
			//    else if ( response.status == 400 ) {
			//     setkudosCoin({ coinCount: 0, progress: "0" })
			//   }
			// }).catch((err) => {
			//   console.log(err);
			//   Toaster.errorToaster(err.response,"Error");
			// })
		}
	}

	return (
		<React.Fragment>
			{/*  FILTER START  */}
			
     <div className="mt-4 w-500">
		<div style={{borderBottom : "thin solid #ccc"}} /> 

        <div className="d-flex align-items-center w-auto">
          <div className="font-size-16 p-1 m-2 w-auto">
            <i className="bx bx-filter-alt "></i>
          </div>
          <span className="h5 p-1 m-2 w-auto">Filter By : </span>
          <div className="">
            {/* who */}
            <label className="h5 p-1 m-2 w-auto">Who : </label>
            <select className="form-select-sm w-auto m-2">
              <option>All</option>
              <option>Following</option>
            </select>
            {/* what */}
            <label className="h5 p-1">What : </label>
            <select
              className="form-select-sm w-auto"
              onChange={e => getPostbyTagFilter(e)}
            >
              <option value="All">All</option>
              <option value="Fundamental">Fundamental</option>
              <option value="Technical">Technical</option>
            </select>
            {/* RealTime */}
            <span className="h5 p-1">
              {buttonRealTime ? ( <span className="w-auto m-2 p-1" onClick={() => getPostbyTimeFilter("RealTime")}> REAL TIME {' '}<i className="p-1 m-2"></i> {' '}</span>
              ) : (
                <span className="w-auto m-2 p-1" onClick={() => getPostbyTimeFilter("Pause")}> PAUSE <i className=""></i></span>
              )}
            </span>
            {/* Top */}
            <label className="h5 p-1">Top : </label>
            <select
              className="form-select-sm w-auto"
              onChange={e => getPostbyTimeFilter(e)}
            >
              <option>Real Time</option>
              <option value="24 HOURS">24hrs</option>
              <option value="7 Days">7 days</option>
              <option value="30 Days">30 days</option>
              <option value="1 Year">1 year</option>
            </select>
          </div>
        </div>

		<div style={{borderBottom : "thin solid #ccc"}} /> 
      </div>
				{/* FITLER END  */}
			{/* POST DATA START */}
				<div>
					{userPostData.length > 0
						? userPostData.map((element, key) => (
							
								<div key={key}>
									<Row className="comment-card px-md-3 px-0">


										<div className="col-sm-11 py-3 col-10">
											<Row>
												<div className="col-sm-1 col-2 p-2">
													<img 
														className="rounded-circle header-profile-user"
														src={element.profilephoto}
														alt="Header Avatar"
													/>
												</div>
												<div className="col-sm-11 col-10">
													<div className="d-flex align-items-center user-name">
														<div>
															<h5
																className="m-0 text-transform tooltipyy"
																onMouseEnter={ () => getUserInfo(element.userid) }>
																{element.username}
																<span className="classic">
																	<div className="row">
																		<div className="col-5 p-2">
																			<span
																				className="hover-profile-name  one-line-dot"
																				onClick={() => userprofile( element.username, element.userid ) }>
																				{element.username}{" "}
																			</span>
																			{/* <span className="font-size-12 text-muted hover-time m-0">
																				{moment(element.createddate).format("DD/MM/YYYY HH:mm")}
																			</span> */}
																		</div>
																		<div className="col-2 p-0">
																			<div className="d-flex justify-content-center align-items-center">
																				<span className="dollar-box">
																					<i className="bx bx-dollar-circle dollar-icon-uesr"></i>{" "}
																					<span className="dollar-count ms-2">
																						{" "}
																						{element.kudoscoin}{" "}
																					</span>
																				</span>
																			</div>
																		</div>
																		<div className="col-5">
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
																		</div>
																	</div>
																	<div className="border-t mt-2"></div>
																	<div className="row">
																		{/* <div className="col-6 text-center followin-text-hover p-1">
                                      <h6 className="m-0 ">2.6K</h6>
                                      <span className="m-0 ">Following</span>
                                    </div>
                                    <div className="col-6 text-center followin-text-hover p-1">
                                      <h6 className="m-0 ">2.6K</h6>
                                      <span className="m-0 ">Followers</span>
                                    </div> */}
																	</div>
																	<div className="border-b mb-2"></div>
																	<button
																		type="button"
																		className="btn btn-sign-up w-100">
																		{" "}
																		Follow
																	</button>
																	<div
																		className="m-0 pt-3 text-center view-profile-text "
																		onClick={() =>
																			userprofile(
																				element.username,
																				element.userid
																			)
																		}>
																		View Profile
																	</div>
																</span>
															</h5>
														</div>
							<span className="dollar-box p-2">
                              <i className="bx bx-dollar-circle dollar-icon-uesr"></i>
                              <span className="dollar-count p-2">                              
                                {" "}{element.kudoscoin}{" "}
                              </span>
                            </span>			
								<span className="font-size-12 text-muted m-0">
															{moment(element.createdat).format("DD/MM/YYYY HH:mm")}
														</span>											
													</div>
												
													<div className="font-size-18 post-text m-0 pt-2">
														{parse(element.posthtmldata)}
													</div>
													{element.haschildpost ? (
														<Retweetcard dataRetweet={element} />
													) : null}
													<div className="mb-0 message-img ">
														{element.imagedata ? (
															<img
																src={element.imagedata}
																onClick={() => onImageView(element)}
																height="50%"
																width="50%"
															/>
														) : (
															""
														)}
														{element.linkid > 0 ?
														 	<div>
															<div className="mb-0 message-img pt-3">
																<a
																	href={element.originalurl}
																	target="_blank">
																	<div className="preview-data mt-2">
																		<div className="text-container">
																			<span className="header ">
																				{element.title}
																			</span>
																			<span className="text-domain">
																				{element.domain}
																			</span>
																		</div>
																		<div className="img-container">
																			<img
																				className="img"
																				src={element.image}
																			/>
																		</div>
																		<div className="text-container">
																			<span className="description">
																				{element.description}
																			</span>
																		</div>
																	</div>
																</a>
																<br />
																<span>
																	Source :{" "}
																	<a
																		href={element.originalurl}
																		target="_blank">
																		{element.originalurl}
																	</a>
																</span>
															</div>
														</div> : null}

														{/* {element.linkid > 0 ?
														 <div className="mb-0 message-img pt-3"> Source : <a href={element.originalurl} target="_blank" >{element.originalurl}</a></div> : null}
														 */}
														<div className="pt-3">
															{/* {element.isnews ?<span className="btn-sm my-3 spn-people-hashtag" onClick={(e)=> e.preventDefault() }>#news</span>: null} */}
															{element.isfundamental ? (
																<span
																	className="btn-sm my-3  spn-people-hashtag"
																	onClick={e => e.preventDefault()}>
																	#fundamental
																</span>
															) : null}
															{element.istechnical ? (
																<span
																	className="btn-sm my-3  spn-people-hashtag"
																	onClick={e => e.preventDefault()}>
																	#technical
																</span>
															) : null}
														</div>
													</div>
													<div className="font-size-20 d-flex align-items-center pt-3 ">
														 <div className="post-icon-size mr-50">
                              <span className="post-icon-chat icon-p">
                                <i
                                  className="mdi mdi-chat-outline people-pointer"
                                  onClick={() => console.log(element)}
                                />
                              </span>
                            </div>
														<div className="post-icon-size mr-50">
															<span className="post-icon-retweet icon-p">
																<i
																	className="mdi mdi-twitter-retweet people-pointer"
																	onClick={() => onRetweet(element)}
																/>
															</span>
														</div>
														<div className="post-icon-size mr-50">
															<span className="post-icon-retweet icon-p">
																<i
																	className="mdi mdi-share"
																	onClick={() => {
																		//console.log(element.postguid);
																		let postLocation =
																			window.origin +
																			"/post/" +
																			element.postguid
																		console.log(postLocation)
																		navigator.clipboard.writeText(postLocation)

																		toastr.success(
																			postLocation,
																			"Link copied to clipboard"
																		)
																	}}
																/>
															</span>
														</div>

														<div className="post-icon-size mr-50">
															{element.sentimentvalue == 0 &&
															element.sentimentvalue == 0 ? null : element.sentimentvalue >
															  0 ? (
																<button className="btn-icon-sentiment">
																	<div className=" px-2">
																		{" "}
																		+ {element.sentimentvalue}{" "}
																		<img
																			src={bullImage}
																			height="25"
																			width="25"
																			className="text-end"></img>
																	</div>
																</button>
															) : (
																<button className="btn-icon-sentiment">
																	<div className=" px-2">
																		{" "}
																		{element.sentimentvalue}{" "}
																		<img
																			src={bearImage}
																			height="25"
																			width="25"
																			className="text-end"></img>
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
					{modal_retweet ? (
						<Retweet
							onChange={handleChangeRetweet}
							dataParentToChild={modal_retweet}
							elementInfo={retweetData}
						/>
					) : null}
				</div>
			{/* post end */}
			
				
		</React.Fragment>
	)
}


export default PostAndFilter
