import PropTypes from "prop-types"
import React from "react"
import parse from "html-react-parser"
import axiosAuthHttpMiddelware from "common/axiosAuthHttpMiddelware"
import axiosHttpMiddelware from "common/axiosHttpMiddelware"

import "toastr/build/toastr.min.css"
import "../../assets/scss/custom/wethemkrt/people.scss"
import "../../assets/scss/custom/wethemkrt/link-preview.scss"
import upArrowGray from "../../assets/images/up-arrow-gray.svg"
import upArrowGreen from "../../assets/images/up-arrow-green.svg"
import downArrowGray from "../../assets/images/down-arrow-gray.svg"
import downArrowRed from "../../assets/images/down-arrow-red.svg"
import "./PostListDashboard.scss"
import Toaster from "./Toaster"
import "react-loading-skeleton/dist/skeleton.css"
import moment from "moment"
import Linkify from "react-linkify"
import ModalImage from "react-modal-image"
import PostFooter from "./PostFooter"

const PostCard = props => {
	const key = 0
	const [element, setElement] = React.useState(null)
	const [scroll, setScroll] = React.useState(true)
	const [userData, setUserData] = React.useState(null)
	const [pageNo, setPageNo] = React.useState(0)
	const [userInfo, setUserInfo] = React.useState(null)
	const [isPostModalOpen, setIsPostModalOpen] = React.useState(false)
	const [userPostData, setuserPostData] = React.useState([])
	const [post, setPost] = React.useState(null)
	const [isLogin, setIsLogin] = React.useState(false)
	const [upvotes, setUpvotes] = React.useState([])
	const [downvotes, setDownvotes] = React.useState([])
	const [postAction, setPostAction] = React.useState(false)
	const [showVote, setShowVote] = React.useState(true)

	const userprofile = (username, userid) => {
		history.push({ pathname: `/viewprofile/${username}`, state: userid })
	}

	const handleScroll = () => {
		if (scroll) {
			let userScrollHeight = window.innerHeight + window.scrollY + 1
			let windowBottomHeight = document.documentElement.offsetHeight
			if (userScrollHeight >= windowBottomHeight) {
				window.removeEventListener("scroll", handleScroll, false)
				window.removeEventListener("scroll", handleScroll, true)
				setPageNo(pageNo + 1)
			}
		}
	}

	function isJsonString(str) {
		try {
			JSON.parse(str)
		} catch (e) {
			return false
		}
		return true
	}

	function diffMinutes(dt2, dt1) {
		var diff = (new Date(dt2).getTime() - new Date(dt1).getTime()) / 1000
		diff /= 60
		return Math.abs(Math.round(diff))
	}
	const togglePostModal = () => {
		setIsPostModalOpen(!isPostModalOpen)
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

	React.useEffect(() => {
		window.addEventListener("scroll", handleScroll)
		if (localStorage.getItem("user")) {
			let user = JSON.parse(localStorage.getItem("user"))
			setIsLogin(true)
			setUserData(user)
			getUserInfo(user)
		}
	}, [])

	function onRetweet(element) {
		setRetweetData(element)
		setIsRetweetModalOpen(true)
	}

	const followUser = userId => {
		axiosAuthHttpMiddelware
			.post("/followUser", {
				followeruserid: userData.id,
				userid: userId,
			})
			.then(response => {
				Toaster.successToaster(response.data.message, "Success!")
				getUserInfo(userData)
			})
			.catch(err => {
				Toaster.errorToaster(err.response.data.message, "Oops!")
			})
	}
	const unFollowUser = userId => {
		axiosAuthHttpMiddelware
			.post("/unfollowUser", {
				followeruserid: userData.id,
				userid: userId,
			})
			.then(response => {
				Toaster.successToaster(response.data.message, "Success!")
				getUserInfo(userData)
			})
			.catch(err => {
				Toaster.errorToaster(err.response.data.message, "Oops!")
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

	const getUserInfo = user => {
		axiosHttpMiddelware
			.post("/usergetbyid", { userid: user.id })
			.then(userResponse => {
				setUserInfo(userResponse.data.userResponse)
			})
	}

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

	const onBookmark = element => {
		// add a tost message bookmark added successfully
		Toaster.successToaster("Bookmark added successfully", "Success!")

		// find the element in userPostData and change the element.bookmarkStatus true and setuserPostData
		let userPostDataCopy = [...userPostData]
		userPostDataCopy.map(post => {
			if (post.postguid == element.postguid) {
				post.bookmarkStatus = true
			}
			return post
		})
		setuserPostData(userPostDataCopy)
	}

	function getPostData() {
		axiosHttpMiddelware
			.get("/postData", {
				params: { id: props.postid },
			})
			.then(res => {
				setElement(res.data.postData)
			})
	}
	React.useEffect(() => {
		getPostData()
	}, [props.postid])
	return (
		<React.Fragment>
			{element && (
				<div className="ct-postbox">
					<div className="userpost-box">
						<div
							className="usbox-profile"
							onClick={e => userprofile(element.username, element.user_id)}>
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
						<div className="usbox-right-content">
							<div className="ubox-top">
								<div>
									<div>
										<h5
											className="m-0 text-transform tooltipyy"
											onClick={e =>
												userprofile(element.username, element.user_id)
											}>
											{element.username}
											<span
												className="dollar-box ms-2"
												style={{ position: "relative", top: "3px" }}>
												<i className="bx bx-dollar-circle dollar-icon-uesr"></i>{" "}
												<span className="dollar-count ms-2">
													{" "}
													{element.kudoscoin + addVote(key) > 0
														? element.kudoscoin + addVote(key)
														: 0}{" "}
												</span>
											</span>
											<span className="font-size-12 text-muted ms-4 mt-1">
												{moment(element.postcreatedat).format(
													"DD/MM/YYYY HH:mm"
												)}
											</span>
										</h5>

										<h6 style={{ overflowWrap: "break-word" }}>
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
										</h6>
									</div>
								</div>
								<div className="ubox-btn-right">
									<div className="me-3">
										{userInfo && (
											<>
												{element.username !== userData.username && (
													<>
														{isNotFollowing(element.user_id) ? (
															<button
																type="button"
																className="theme-btn pb-btn"
																onClick={() => {
																	followUser(element.user_id)
																}}>
																Follow
															</button>
														) : (
															<button
																type="button"
																className="theme-btn pb-btn"
																onClick={() => {
																	unFollowUser(element.user_id)
																}}>
																Unfollow
															</button>
														)}
													</>
												)}
											</>
										)}
									</div>
									<div>
										{diffMinutes(element.now, element.postcreatedat) <= 5 &&
											isLogin &&
											postAction &&
											element.username == userData.username && (
												<>
													<i
														className="bx bxs-message-square-edit"
														role="button"
														onClick={e => {
															e.preventDefault()
															setPost(element)
															togglePostModal()
														}}></i>
													<i
														className="bx bxs-trash"
														role="button"
														onClick={e => {
															e.preventDefault()
															postDelete(element.postguid)
														}}></i>
												</>
											)}
										{element?.bookmarkStatus ? (
											<i class="bx bxs-bookmark-star"></i>
										) : (
											<span
												role="button"
												onClick={() => {
													onBookmark(element)
												}}>
												<i class="bx bx-bookmark-plus"></i>
											</span>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="userpost-box">
						<div className="arrow-box">
							<div className="short-arw-box topar-box">
								<img
									style={{ width: 40 }}
									className={
										isUpVoteAllowed(element, userData, key) ? "" : "disabled"
									}
									onClick={e => {
										e.preventDefault()
										if (isUpVoteAllowed(element, userData, key)) {
											upVote(key, element.postguid, true)
										}
									}}
									role="button"
									src={getUpvoteIcon(element, userData, key)}
									onMouseOver={e => {
										if (isUpVoteAllowed(element, userData, key)) {
											e.currentTarget.src = upArrowAllowed
										}
									}}
									onMouseOut={e => {
										if (isUpVoteAllowed(element, userData, key)) {
											e.currentTarget.src = upArrowGray
										}
									}}
								/>
							</div>
							{showVote && (
								<div className="short-arw-box">
									{addedVote(element.votes, key)}
								</div>
							)}
							<div className="short-arw-box downar-box">
								<img
									style={{ width: 40 }}
									className={
										isDownVoteAllowed(element, userData, key) ? "" : "disabled"
									}
									onClick={e => {
										e.preventDefault()
										if (isDownVoteAllowed(element, userData, key)) {
											upVote(key, element.postguid, false)
										}
									}}
									role="button"
									src={getDownvoteIcon(element, userData, key)}
									onMouseOver={e => {
										if (isDownVoteAllowed(element, userData, key)) {
											e.currentTarget.src = downArrowAllowed
										}
									}}
									onMouseOut={e => {
										if (isDownVoteAllowed(element, userData, key)) {
											e.currentTarget.src = downArrowGray
										}
									}}
								/>
							</div>
						</div>
						<div className="usbox-right-content">
							{element.imagedata ? (
								<>
									{isJsonString(element.imagedata) ? (
										<div className="row">
											{JSON.parse(element.imagedata) &&
												JSON.parse(element.imagedata).map((image, key) => {
													return (
														<div
															className={
																JSON.parse(element.imagedata).length == 1
																	? "col-12"
																	: "col-6"
															}
															key={key}>
															<div className="details-imagebox d-flex justify-content-center bg-black">
																<ModalImage
																	small={image}
																	large={image}
																	alt=""
																/>
															</div>
														</div>
													)
												})}
										</div>
									) : (
										<div className="details-imagebox">
											<ModalImage
												small={element.imagedata}
												large={element.imagedata}
												alt=""
											/>
										</div>
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
													<span className="header ">{element.title}</span>
													<span className="text-domain">{element.domain}</span>
												</div>
												<div className="img-container">
													<img className="img" src={element.image} />
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
											<a href={element.originalurl} target="_blank">
												{element.originalurl}
											</a>
										</span>
									</div>
								</div>
							) : null}
							<PostFooter element={element} onRetweet={onRetweet} />
						</div>
					</div>
					<hr />
				</div>
			)}
		</React.Fragment>
	)
}

PostCard.propTypes = {
	userPostData: PropTypes.array,
}

export default PostCard
