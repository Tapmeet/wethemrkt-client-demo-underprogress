import React, { useEffect, useState } from "react"
import { Row, Col, Button, Modal, ModalHeader, ModalBody } from "reactstrap"
import parse from "html-react-parser"
import "../../../assets/scss/custom/wethemkrt/people.scss"
import "../../../assets/scss/custom/wethemkrt/link-preview.scss"
import axiosAuthHttpMiddelware from "common/axiosAuthHttpMiddelware"
import axiosHttpMiddelware from "common/axiosHttpMiddelware"
import upArrowGray from "../../../assets/images/up-arrow-gray.svg"
import upArrowGreen from "../../../assets/images/up-arrow-green.svg"
import upArrowAllowed from "../../../assets/images/up-arrow-allowed.svg"
import downArrowGray from "../../../assets/images/down-arrow-gray.svg"
import downArrowRed from "../../../assets/images/down-arrow-red.svg"
import downArrowAllowed from "../../../assets/images/down-arrow-allowed.svg"
import Toaster from "components/Common/Toaster"
import Linkify from "react-linkify"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import moment from "moment"
import PostFooter from "components/Common/PostFooter"
import "../../Common/PostListDashboard.scss"
import ImageCarousel from "../../Common/ImageCarousel"

const UserPostCard = ({ postReload, ...props }) => {
	const [isLogin, setIsLogin] = useState(false)
	const [userPostData, setuserPostData] = useState([])
	const [postAction, setPostAction] = useState(false)
	const [userData, setUserData] = useState(null)
	const [filterTime, setFilterTime] = useState(null)
	const [filterTag, setFilterTag] = useState(null)
	const [upvotes, setUpvotes] = useState([])
	const [showVote, setShowVote] = useState(true)
	const [downvotes, setDownvotes] = useState([])
	const [category, setCategory] = useState(null)
	const [authUserInfo, setAuthUserInfo] = useState(null)
	const [pageNo, setPageNo] = useState(0)
	const [loader, setLoader] = useState(false)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [modalImages, setModalImages] = useState([])
	const [modalImagesCurrentIndex, setModalImagesCurrentIndex] = useState(0)

	const toggleModal = () => {
		setIsModalOpen(!isModalOpen)
	}

	const showModalImage = (images, index) => {
		setModalImages(JSON.parse(images))
		setModalImagesCurrentIndex(index)
		toggleModal()
	}

	function isJsonString(str) {
		try {
			JSON.parse(str)
		} catch (e) {
			return false
		}
		return true
	}
	const getUserPostList = async (tag = null, time = null) => {
		if (props.userInfo.id) {
			setLoader(true)
			if (pageNo === 0) {
				setuserPostData([])
			}
			axiosHttpMiddelware
				.get("/post/userDashboard", {
					params: {
						time: time,
						tag: tag,
						userId: props.userInfo.id,
						onlyUser: true,
						page: pageNo,
					},
				})
				.then(response => {
					if (
						response.status === 200 &&
						response.data.postData !== undefined &&
						response.data.postData !== "" &&
						response.data.postData !== null
					) {
						if (response.data.postData.length) {
							if (pageNo === 0) {
								setuserPostData(response.data.postData)
							} else {
								setuserPostData([...userPostData, ...response.data.postData])
							}
							window.addEventListener("scroll", handleScroll)
							setPostAction(true)
							setTimeout(() => {
								setPostAction(false)
							}, 300000)
						}
						setLoader(false)
					}
				})
				.catch(err => {
					console.log(err)
				})
		}
	}

	useEffect(() => {
		getUserPostList(filterTag, filterTime)
	}, [pageNo])

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
	function getPostbyTagFilter(e) {
		setFilterTag(e.target.value)
		setuserPostData([])
		getUserPostList(e.target.value, filterTime)
	}
	const removeCategory = () => {
		setFilterTag(null)
		setuserPostData([])
		getUserPostList(null, filterTime)
	}
	function getPostbyTimeFilter(e) {
		setFilterTime(e.target.value)
		setuserPostData([])
		getUserPostList(filterTag, e.target.value)
	}
	const getPostbyTimeFilterBlank = () => {
		let time = null
		if (filterTime == null) {
			time = "24 hour"
		}
		setFilterTime(time)
		setuserPostData([])
		getUserPostList(filterTag, time)
	}
	useEffect(() => {
		setPageNo(0)
		getUserPostList(filterTag, filterTime)
	}, [props.userInfo])

	useEffect(() => {
		if (localStorage.getItem("user")) {
			let user = JSON.parse(localStorage.getItem("user"))
			setUserData(user)
			setIsLogin(true)
		}
		window.addEventListener("scroll", handleScroll)
	}, [])

	useEffect(() => {
		if (userData) {
			getUserInfo(userData)
		}
	}, [userData])

	const isUpVoteAllowed = (post, userData, key) => {
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
	const isNotFollowing = userId => {
		for (let i = 0; i < authUserInfo.following.length; i++) {
			const element = authUserInfo.following[i]
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
				setAuthUserInfo(userResponse.data.userResponse)
			})
	}

	const followUser = userId => {
		axiosAuthHttpMiddelware
			.post("/followUser", {
				followeruserid: userData.id,
				userid: userId,
			})
			.then(response => {
				Toaster.successToaster(response.data.message, "Success!")
				setTimeout(() => {
					window.location.reload()
				}, 2000)
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
				setTimeout(() => {
					window.location.reload()
				}, 2000)
			})
			.catch(err => {
				Toaster.errorToaster(err.response.data.message, "Oops!")
			})
	}

	function diffMinutes(dt2, dt1) {
		var diff = (new Date(dt2).getTime() - new Date(dt1).getTime()) / 1000
		diff /= 60
		return Math.abs(Math.round(diff))
	}

	function onRetweet(element) {
		setRetweetData(element)
		setIsRetweetModalOpen(true)
	}
	return (
		<React.Fragment>
			<div className="white-boxpart">
				<h4 className="rs-title" style={{ marginLeft: 20, paddingTop: 10 }}>
					Posts
				</h4>
				<div className="categorey-list bottom-border">
					<div className="category-filter-top">
						<div className="d-flex">
							<div className="m-2">
								<Button
									className={category ? "btn btn-sm btn-danger" : "btn btn-sm"}
									onClick={() => {
										if (category) {
											removeCategory()
										}
										setCategory(!category)
									}}>
									<i className="bx bx-category"></i>
									Category
								</Button>
								&nbsp;
								{category && (
									<select
										className="form-select-sm filter-select"
										onChange={e => getPostbyTagFilter(e)}>
										<option value="All">All</option>
										<option value="Fundamental">Fundamental</option>
										<option value="Technical">Technical</option>
									</select>
								)}
								&nbsp;
								<Button
									className={
										filterTime == null ? "btn btn-sm btn-danger" : "btn btn-sm"
									}
									onClick={() => {
										getPostbyTimeFilterBlank()
									}}>
									<i className="bx bxs-timer"></i>
									New
								</Button>
								&nbsp;
								<Button
									className={
										filterTime ? "btn btn-sm btn-danger" : "btn btn-sm"
									}
									onClick={() => {
										getPostbyTimeFilterBlank()
									}}>
									<i className="bx bxs-timer"></i>
									Top
								</Button>
								&nbsp;
								{filterTime && (
									<>
										<select
											className="form-select-sm filter-select"
											onChange={e => getPostbyTimeFilter(e)}>
											<option value="24 hour">24hrs</option>
											<option value="7 day">7 days</option>
											<option value="30 day">30 days</option>
											<option value="1 year">1 year</option>
										</select>
									</>
								)}
							</div>
						</div>
						<div className="d-flex">
							<div className="filter-icon">
								<i className="bx bx-filter-alt "></i>
							</div>
							<span
								onClick={() => {
									getUserPostList(filterTag, filterTime)
								}}
								role="button"
								className="mx-3">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24">
									<path d="M10 11H7.101l.001-.009a4.956 4.956 0 0 1 .752-1.787 5.054 5.054 0 0 1 2.2-1.811c.302-.128.617-.226.938-.291a5.078 5.078 0 0 1 2.018 0 4.978 4.978 0 0 1 2.525 1.361l1.416-1.412a7.036 7.036 0 0 0-2.224-1.501 6.921 6.921 0 0 0-1.315-.408 7.079 7.079 0 0 0-2.819 0 6.94 6.94 0 0 0-1.316.409 7.04 7.04 0 0 0-3.08 2.534 6.978 6.978 0 0 0-1.054 2.505c-.028.135-.043.273-.063.41H2l4 4 4-4zm4 2h2.899l-.001.008a4.976 4.976 0 0 1-2.103 3.138 4.943 4.943 0 0 1-1.787.752 5.073 5.073 0 0 1-2.017 0 4.956 4.956 0 0 1-1.787-.752 5.072 5.072 0 0 1-.74-.61L7.05 16.95a7.032 7.032 0 0 0 2.225 1.5c.424.18.867.317 1.315.408a7.07 7.07 0 0 0 2.818 0 7.031 7.031 0 0 0 4.395-2.945 6.974 6.974 0 0 0 1.053-2.503c.027-.135.043-.273.063-.41H22l-4-4-4 4z"></path>
								</svg>
							</span>
						</div>
					</div>
				</div>
				<div>
					{userPostData.length > 0
						? userPostData.map((element, key) => (
								<div key={key} className="ct-postbox">
									<div className="userpost-box">
										<div
											className="usbox-profile"
											onClick={e =>
												userprofile(element.username, element.user_id)
											}>
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
																className="dollar-box ms-4"
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

														<h6
															style={{
																overflowWrap: "break-word",
																marginTop: 30,
															}}>
															<Linkify
																componentDecorator={(
																	decoratedHref,
																	decoratedText,
																	key
																) => (
																	<a
																		target="blank"
																		href={decoratedHref}
																		key={key}>
																		{decoratedText}
																	</a>
																)}>
																{parse(
																	element.posthtmldata
																		.replace(/\n/g, "<br/>")
																		.replace(element.originalurl, "")
																)}
															</Linkify>
														</h6>
													</div>
												</div>
												<div className="ubox-btn-right">
													<div className="me-3">
														{props.userInfo && (
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
														{diffMinutes(element.now, element.postcreatedat) <=
															5 &&
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
															<span
																role="button"
																onClick={() => {
																	onBookmarkRemove(element)
																}}>
																<i class="bx bxs-bookmark-star"></i>
															</span>
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
														isUpVoteAllowed(element, userData, key)
															? ""
															: "disabled"
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
														isDownVoteAllowed(element, userData, key)
															? ""
															: "disabled"
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
																JSON.parse(element.imagedata).length < 3 &&
																JSON.parse(element.imagedata).map(
																	(image, key) => {
																		return (
																			<div
																				className={
																					JSON.parse(element.imagedata)
																						.length == 1
																						? "col-12"
																						: "col-6"
																				}
																				key={key}>
																				<div className="details-imagebox d-flex justify-content-center bg-black">
																					<img
																						role="button"
																						src={image}
																						alt=""
																						onClick={() =>
																							showModalImage(
																								element.imagedata,
																								key
																							)
																						}
																					/>
																				</div>
																			</div>
																		)
																	}
																)}
															{JSON.parse(element.imagedata) &&
																JSON.parse(element.imagedata).length > 2 &&
																JSON.parse(element.imagedata).map(
																	(image, key) => {
																		return (
																			<div
																				className={
																					JSON.parse(element.imagedata)
																						.length == 1
																						? "col-12"
																						: "col-6"
																				}
																				key={key}>
																				<div className="details-imagebox four-img-box d-flex justify-content-center bg-black">
																					<img
																						role="button"
																						src={image}
																						alt=""
																						onClick={() =>
																							showModalImage(
																								element.imagedata,
																								key
																							)
																						}
																					/>
																				</div>
																			</div>
																		)
																	}
																)}
														</div>
													) : (
														<div className="details-imagebox">
															<img src={element.imagedata} alt="" />
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
																	<span className="header ">
																		{element.title}
																	</span>
																	<span className="text-domain">
																		{element.domain}
																	</span>
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

											{/* {element?.ccount && element.ccount != '0' && (
                                    <PostListReply post={element} />
                                )} */}
										</div>
									</div>
									<hr />
								</div>
						  ))
						: null}
					{loader && <Skeleton count={5} />}
					<Modal
						className="modal-fullscreen"
						style={{ width: "auto" }}
						fullscreen={true}
						isOpen={isModalOpen}
						toggle={toggleModal}>
						<ModalHeader toggle={toggleModal}></ModalHeader>
						<ModalBody>
							<Row>
								<Col md="12">
									<ImageCarousel
										images={modalImages}
										currentIndex={modalImagesCurrentIndex}
									/>
								</Col>
							</Row>
						</ModalBody>
					</Modal>
				</div>
			</div>
		</React.Fragment>
	)
}
export default UserPostCard
