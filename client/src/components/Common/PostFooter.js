import React from "react"
import bearImage from "../../assets/images/bear.png"
import bullImage from "../../assets/images/bull.png"
import "./PostFooter.scss"

import axiosHttpMiddelware from "../../common/axiosHttpMiddelware"
import ReplyBox from "./ReplyBox"
import Toaster from "./Toaster"
const PostFooter = ({ element, onRetweet, userInfo }) => {
	const [showComment, setShowComment] = React.useState(false)
	// const [postCount, setPostCount] = React.useState(0)
	// const [userInfo, setuserInfo] = React.useState({
	// 	id: "",
	// 	name: "",
	// 	profilePhoto: "",
	// 	isadmin: "",
	// })
	// React.useEffect(() => {
	// 	if (localStorage.getItem("user")) {
	// 		const userData = JSON.parse(localStorage.getItem("user"))
	// 		axiosHttpMiddelware
	// 			.post("/usergetbyid", { userid: userData.id })
	// 			.then(userResponse => {
	// 				setuserInfo({
	// 					...userInfo,
	// 					id: userData.id,
	// 					name: userData.username,
	// 					profilePhoto: userResponse.data.userResponse.profilephoto,
	// 					isadmin: userData.isadmin,
	// 				})
	// 			})
	// 		setuserInfo({
	// 			...userInfo,
	// 			id: userData.id,
	// 			name: userData.username,
	// 			profilePhoto: userData.profilePhoto,
	// 			isadmin: userData.isadmin,
	// 		})
	// 	}
	// }, [])
	// React.useEffect(() => {
	// 	if (element?.ccount && element?.ccount != 0) {
	// 		setPostCount(element?.ccount)
	// 	}
	// }, [element?.ccount])
	return (
		<>
			<div className="tool-bar-btn">
				<div className="flex-ver-center">
					<div
						className="reply-btn"
						onClick={() => {
							navigator.clipboard.writeText(
								`${window.location.origin}/post/${element.postguid}`
							)
							Toaster.successToaster("Link Copied!", "Success")
						}}
						role="button"
						title="Copy Link">
						<i className="bx bx-copy" style={{ marginTop: 0 }}></i>
					</div>
					{/* <div
						className="reply-btn"
						onClick={() => {
							setShowComment(!showComment)
						}}
						role="button"
						title="Reply">
						<i class="bx bx-message-rounded"></i> <span>{element.ccount}</span>
					</div> */}
					{element.isnews ? (
						<div className="bt-lable">
							<label className="btn-sm" onClick={e => e.preventDefault()}>
								#news
							</label>
						</div>
					) : null}

					{element.isfundamental ? (
						<div className="bt-lable">
							<label className="btn-sm-type" onClick={e => e.preventDefault()}>
								#fundamental
							</label>
						</div>
					) : null}
					{element.istechnical ? (
						<div className="bt-lable">
							<label className="btn-sm-type" onClick={e => e.preventDefault()}>
								#technical
							</label>
						</div>
					) : null}
				</div>
				<div className="flex-ver-center">
					<div className="post-icon-size">
						{element.sentimentvalue == 0 &&
						element.sentimentvalue == 0 ? null : element.sentimentvalue > 0 ? (
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
				<div className="flex-ver-center">
					<span
						role="button"
						onClick={() => {
							setShowComment(!showComment)
						}}>
						{element.ccount} Comments <i class="bx bx-chevron-down"></i>
					</span>
				</div>
			</div>
			{showComment && (
				<div>
					<ReplyBox element={element} userInfo={userInfo} />
				</div>
			)}
		</>
	)
}

export default PostFooter
