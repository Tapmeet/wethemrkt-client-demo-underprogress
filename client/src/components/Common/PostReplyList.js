import React, { useEffect, useState } from "react"
import parse from "html-react-parser"
import axiosAuthHttpMiddelware from "common/axiosAuthHttpMiddelware"
import axiosHttpMiddelware from "common/axiosHttpMiddelware"

import bearImage from "../../assets/images/bear.png"
import bullImage from "../../assets/images/bull.png"
import RetweetModal from "./RetweetModal"
import "toastr/build/toastr.min.css"
import "../../assets/scss/custom/wethemkrt/people.scss"
import "../../assets/scss/custom/wethemkrt/link-preview.scss"
import "./PostListDashboard.scss"
import Toaster from "./Toaster"
import ModalImage from "react-modal-image"
import "react-loading-skeleton/dist/skeleton.css"
import moment from "moment"
import Linkify from "react-linkify"
import Skeleton from "react-loading-skeleton"
import upArrowGray from "../../assets/images/up-arrow-gray.svg"
import upArrowGreen from "../../assets/images/up-arrow-green.svg"
import upArrowAllowed from "../../assets/images/up-arrow-allowed.svg"
import downArrowGray from "../../assets/images/down-arrow-gray.svg"
import downArrowRed from "../../assets/images/down-arrow-red.svg"
import downArrowAllowed from "../../assets/images/down-arrow-allowed.svg"
import Retweet from "./Retweet"
import PostReplyList from "./PostReplyList"
import ReplySorting from "./ReplySorting"

const PostListReply = ({ post, hideReplyInput, reload, onReload }) => {
	const [isLoading, setIsLoading] = useState(false)
	const [upvotes, setUpvotes] = useState([])
	const [downvotes, setDownvotes] = useState([])
	const [showVote, setShowVote] = useState(true)
	const [userPostData, setuserPostData] = useState([])
	const [userInfo, setUserInfo] = useState(null)
	const [userData, setUserData] = useState(null)
	const [isLogin, setIsLogin] = useState(false)
	const [postAction, setPostAction] = useState(false)
	const [sorting, setSorting] = useState(false)

	const getUserInfo = user => {
		axiosHttpMiddelware
			.post("/usergetbyid", { userid: user.id })
			.then(userResponse => {
				setUserInfo(userResponse.data.userResponse)
			})
	}
	function diffMinutes(dt2, dt1) {
		var diff = (new Date(dt2).getTime() - new Date(dt1).getTime()) / 1000
		diff /= 60
		return Math.abs(Math.round(diff))
	}
	function isJsonString(str) {
		try {
			JSON.parse(str)
		} catch (e) {
			return false
		}
		return true
	}

	const postDelete = postguid => {
		if (localStorage.getItem("user")) {
			axiosAuthHttpMiddelware
				.post("/post/delete", {
					postguid: postguid,
				})
				.then(response => {
					if (response.status == 200) {
						Toaster.successToaster("Vote deleted successfully", "Success!")
						setuserPostData([])
						setScroll(true)
						setPageNo(0)
						postReloadSwitch()
					}
				})
				.catch(err => {
					console.log(err)
				})
		}
	}
	const getUserPostList = async () => {
		setIsLoading(true)
		let postguid = post.postguid ?? null
		let authUser = {
			id: 0,
		}
		if (localStorage.getItem("user")) {
			authUser = JSON.parse(localStorage.getItem("user"))
		}
		axiosHttpMiddelware
			.get("/post/userDashboard", {
				params: { postguid: postguid, userId: authUser.id },
			})
			.then(response => {
				if (
					response.status === 200 &&
					response.data.postData !== undefined &&
					response.data.postData !== "" &&
					response.data.postData !== null
				) {
					if (response.data.postData.length) {
						setuserPostData(response.data.postData)
						setIsLoading(false)
						setPostAction(true)
						setTimeout(() => {
							setPostAction(false)
						}, 300000)
					}
				}
			})
			.catch(err => {
				console.log(err)
			})
	}

	const isNotFollowing = userId => {
		for (let i = 0; i < userInfo.following.length; i++) {
			const element = userInfo.following[i]
			if (element.userId == userId) {
				return false
			}
		}
		return true
	}

	useEffect(() => {
		let user = JSON.parse(localStorage.getItem("user"))
		setIsLogin(true)
		getUserInfo(user)
		setUserData(user)
		getUserPostList()
	}, [reload])

	const isUpVoteAllowed = (post, userData, key) => {
		if (userData == null) {
			return false
		}
		let voteUsers = post.vote_users ? JSON.parse(post.vote_users) : []
		if (voteUsers == null) {
			voteUsers = []
		}
		return (
			post.username !== userData.username &&
			!voteUsers.includes(userData.id) &&
			addVote(key) <= 0
		)
	}
	const upVote = (key, postguid, status) => {
		setShowVote(false)
		if (localStorage.getItem("user")) {
			axiosAuthHttpMiddelware
				.post("/post/upvote", {
					upvote: status,
					postguid: postguid,
					userId: userData.id,
				})
				.then(response => {
					if (response.status == 200) {
						Toaster.successToaster("Vote updated successfully", "Success!")
						if (status) {
							const index = downvotes.indexOf(key)
							if (index > -1) {
								downvotes.splice(index, 1)
								setDownvotes(downvotes)
							} else {
								setUpvotes(upvotes => [...upvotes, key])
							}
						} else {
							const index = upvotes.indexOf(key)
							if (index > -1) {
								upvotes.splice(index, 1)
								setUpvotes(upvotes)
							} else {
								setDownvotes(downvotes => [...downvotes, key])
							}
						}
						setTimeout(() => {
							setShowVote(true)
						}, 500)
					}
				})
				.catch(err => {
					console.log(err)
				})
		}
	}

	const addedVote = (votes, key) => {
		let votesCount = votes
		votesCount = votesCount + addVote(key)
		return votesCount
	}
	const addVote = key => {
		const downindex = downvotes.indexOf(key)
		if (downindex > -1) {
			return -1
		}
		const upindex = upvotes.indexOf(key)
		if (upindex > -1) {
			return 1
		}
		return 0
	}

	const isDownVoteAllowed = (post, userData, key) => {
		if (userData == null) {
			return false
		}
		let voteUsers = post.down_vote_users ? JSON.parse(post.down_vote_users) : []
		if (voteUsers == null) {
			voteUsers = []
		}
		return (
			post.username !== userData.username &&
			!voteUsers.includes(userData.id) &&
			addVote(key) >= 0
		)
	}

	const getUpvoteIcon = (post, userData, key) => {
		if (userData == null) {
			return upArrowGray
		}
		if (isUpVoteAllowed(post, userData, key)) {
			return upArrowGray
		} else {
			let voteUsers = post.vote_users ? JSON.parse(post.vote_users) : []
			if (voteUsers.includes(userData.id) || addVote(key) > 0) {
				return upArrowGreen
			} else {
				return upArrowGray
			}
		}
	}
	const getDownvoteIcon = (post, userData, key) => {
		if (userData == null) {
			return downArrowGray
		}
		if (isDownVoteAllowed(post, userData, key)) {
			return downArrowGray
		} else {
			let voteUsers = post.down_vote_users
				? JSON.parse(post.down_vote_users)
				: []
			if (voteUsers.includes(userData.id) || addVote(key) < 0) {
				return downArrowRed
			} else {
				return downArrowGray
			}
		}
	}

	const handleChangeSorting = sortOrder => {
		setSorting(true)
		switch (sortOrder) {
			case "newest":
				setuserPostData(
					userPostData.sort(
						(a, b) => new Date(b.postcreatedat) - new Date(a.postcreatedat)
					)
				)
				setTimeout(() => {
					setSorting(false)
				}, 1000)
				break
			case "oldest":
				setuserPostData(
					userPostData.sort(
						(a, b) => new Date(a.postcreatedat) - new Date(b.postcreatedat)
					)
				)
				setTimeout(() => {
					setSorting(false)
				}, 1000)
				break
			case "upvote":
				setuserPostData(userPostData.sort((a, b) => b.votes - a.votes))
				setTimeout(() => {
					setSorting(false)
				}, 1000)
				break
			default:
				break
		}
	}

	return (
		<>
			{userPostData.length > 0 && hideReplyInput && (
				<ReplySorting onChangeSorting={handleChangeSorting} />
			)}
			{!sorting && (
				<div className="post-comment">
					{userPostData.length > 0 &&
						userPostData.map((element, key) => {
							const postRef = React.createRef()
							return (
								<div className="comment-field" key={key}>
									<div className="cf-userpic">
										{element.profilephoto ? (
											<img
												className="rounded-circle header-profile-user"
												src={element.profilephoto}
												alt="Header Avatar"
											/>
										) : (
											<div className="text-center circle-shadow-a bg-gray">
												<i className="rounded-circle bx bx-user font-size-20 align-middle mt-4" />
											</div>
										)}
									</div>
									<div className="cf-userinfo">
										<div className="cf-chatbox" ref={postRef}>
											<h6 className="cf-name">{element.username}</h6>
											<div className="d-flex justify-content-between">
												<div className="cf-commnet-field">
													<Linkify
														componentDecorator={(
															decoratedHref,
															decoratedText,
															key
														) => (
															<a target="blank" href={decoratedHref} key={key}>
																{decoratedText}
															</a>
														)}>
														{parse(element.posthtmldata)}
													</Linkify>
												</div>
												{((element.imagedata && element.imagedata != "null") ||
													element.linkid > 0) && (
													<div className="details-imagebox">
														{element.imagedata ? (
															<>
																{isJsonString(element.imagedata) ? (
																	<div className="row">
																		{JSON.parse(element.imagedata) &&
																			JSON.parse(element.imagedata).map(
																				(image, key) => {
																					return (
																						<div className="details-imagebox d-flex justify-content-center bg-black">
																							<ModalImage
																								small={image}
																								large={image}
																								alt=""
																							/>
																						</div>
																					)
																				}
																			)}
																	</div>
																) : (
																	<ModalImage
																		small={element.imagedata}
																		large={element.imagedata}
																		alt=""
																	/>
																)}
															</>
														) : (
															""
														)}
														{element.linkid > 0 ? (
															<div>
																<div className="mb-0 message-img pt-3">
																	<a href={element.originalurl} target="_blank">
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
															</div>
														) : null}
													</div>
												)}
												<div>
													{diffMinutes(element.now, element.postcreatedat) <=
														5 &&
														isLogin &&
														postAction &&
														element.username == userData.username && (
															<>
																<i
																	className="bx bxs-trash"
																	role="button"
																	onClick={e => {
																		e.preventDefault()
																		postDelete(element.postguid)
																	}}></i>
															</>
														)}
												</div>
											</div>
										</div>
										<div className="cf-actionbox">
											<div className="post-time">
												<label>{moment(element.postcreatedat).fromNow()}</label>
											</div>
											<div
												className={`post-like ${
													isUpVoteAllowed(element, userData, key)
														? ""
														: "disabled"
												}`}>
												<a
													href="#"
													onClick={e => {
														e.preventDefault()
														if (isUpVoteAllowed(element, userData, key)) {
															upVote(key, element.postguid, true)
														}
													}}
													className={`${
														isUpVoteAllowed(element, userData, key)
															? ""
															: "disabled"
													}`}>
													<i className="bx bxs-up-arrow"></i>
												</a>
											</div>
											{showVote && (
												<div className="short-arw-box">
													{addedVote(element.votes, key)}
												</div>
											)}
											<div
												className={`post-dislike ${
													isUpVoteAllowed(element, userData, key)
														? ""
														: "disabled"
												}`}>
												<a
													href="#"
													onClick={e => {
														e.preventDefault()
														if (isDownVoteAllowed(element, userData, key)) {
															upVote(key, element.postguid, false)
														}
													}}
													className={`${
														isUpVoteAllowed(element, userData, key)
															? ""
															: "disabled"
													}`}>
													<i className="bx bxs-down-arrow"></i>
												</a>
											</div>
											{hideReplyInput && (
												<div className="reply-cmnt-link">
													<a
														href="#"
														onClick={e => {
															e.preventDefault()

															let displayStatus = document.getElementById(
																`reply-${element.postguid}`
															).style.display
															if (displayStatus == "block") {
																document.getElementById(
																	`reply-${element.postguid}`
																).style.display = "none"
															} else {
																document.getElementById(
																	`reply-${element.postguid}`
																).style.display = "block"
															}
														}}>
														Reply
													</a>
												</div>
											)}
										</div>
										{hideReplyInput && parseInt(element.ccount) > 0 && (
											<div class="count-reply mb-3">
												<label>
													<a
														href="javascript:void(0)"
														onClick={e => {
															e.preventDefault()

															let displayStatus = document.getElementById(
																`reply-${element.postguid}`
															).style.display
															if (displayStatus == "block") {
																document.getElementById(
																	`reply-${element.postguid}`
																).style.display = "none"
															} else {
																document.getElementById(
																	`reply-${element.postguid}`
																).style.display = "block"
															}
														}}>
														{" "}
														<span>
															<i class="bx bx-reply"></i>
														</span>
														View {element.ccount} Reply{" "}
													</a>
												</label>
											</div>
										)}
										{hideReplyInput && (
											<div
												className={`comment-field reply-cmnfield ${
													parseInt(element.ccount) > 0 ? "child-post-list" : ""
												}`}
												style={{
													display: "block",
												}}
												onLoad={() => {
													setTimeout(() => {
														document.getElementById(
															`reply-${element.postguid}`
														).style.display = "none"
													}, 100)
												}}
												id={`reply-${element.postguid}`}>
												<PostReplyList
													post={element}
													onReload={onReload}
													reload={reload}
												/>

												<br />
											</div>
										)}
									</div>
								</div>
							)
						})}
					{post.ccount > 0 && userPostData.length == 0 && isLoading && (
						<Skeleton count={5} />
					)}

					{!hideReplyInput && (
						<div className="type-commentpart inner-comment-part-input">
							<div className="type-comment">
								<div className="cf-userpic">
									{userInfo?.profilephoto ? (
										<img
											className="rounded-circle"
											src={userInfo?.profilephoto}
											alt="Header Avatar"
										/>
									) : (
										<div className="circle-shadow-a bg-gray">
											<i className="rounded-circle bx bx-user font-size-20 align-middle" />
										</div>
									)}
								</div>
								<div className="comment-part">
									<Retweet
										modal={false}
										retweetData={post}
										onReload={() => {
											onReload()
										}}
										reload={reload}
									/>
								</div>
							</div>
						</div>
					)}
				</div>
			)}
		</>
	)
}

export default PostListReply
