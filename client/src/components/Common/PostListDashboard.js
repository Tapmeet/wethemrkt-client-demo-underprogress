import React, { useEffect, useState } from "react"
import { withContext } from "../../context/index"
import { Button, Modal, ModalHeader, ModalBody, Col, Row } from "reactstrap"
import axiosHttpMiddelware from "common/axiosHttpMiddelware"
import RetweetModal from "./RetweetModal"
import "toastr/build/toastr.min.css"
import "../../assets/scss/custom/wethemkrt/people.scss"
import "../../assets/scss/custom/wethemkrt/link-preview.scss"
import "./PostListDashboard.scss"
import PostCreateModal from "./PostCreateModal"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { postReloadSwitch as postReloadSwitchAction } from "../../store/actions/appActions"
import io from "socket.io-client"
import ImageCarousel from "./ImageCarousel"
import UserPost from "./UserPost"
//this component is responsible to fetch the data filterwise.
const PostListDashboard = ({ postReload, postReloadSwitch, ...props }) => {
	const [scroll, setScroll] = useState(true)
	const [pageNo, setPageNo] = useState(0)
	const [isPostModalOpen, setIsPostModalOpen] = useState(false)
	const [isRetweetModalOpen, setIsRetweetModalOpen] = useState(false)
	const [retweetData, setRetweetData] = useState(false)
	const [userPostData, setuserPostData] = useState([])
	const [post, setPost] = useState(null)
	const [filterTime, setFilterTime] = useState(null)
	const [filterTag, setFilterTag] = useState(null)
	const [filterUser, setFilterUser] = useState(null)
	const [filterWhat, setFilterWhat] = useState(null)
	const [loader, setLoader] = useState(false)
	const [upvotes, setUpvotes] = useState([])
	const [downvotes, setDownvotes] = useState([])
	const [postAction, setPostAction] = useState(false)
	const [who, setWho] = useState(false)
	const [category, setCategory] = useState(false)
	const [newPostCount, setNewPostCount] = useState(0)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [modalImages, setModalImages] = useState([])
	const [modalImagesCurrentIndex, setModalImagesCurrentIndex] = useState(0)
	const toggleModal = () => {
		setIsModalOpen(!isModalOpen)
	}
	const getNewPostCount = () => {
		// create a socket connection
		const socket = io(process.env.REACT_APP_SOCKET_URL)
		// listen for the event
		socket.on("post", data => {
			// increment the new post count
			setNewPostCount(newPostCount => newPostCount + 1)
		})
	}
	const getUserSavedPostList = async (page = null) => {
		setLoader(true)
		let authUser = {
			id: 0,
		}
		if (localStorage.getItem("user")) {
			authUser = JSON.parse(localStorage.getItem("user"))
		}
		axiosHttpMiddelware
			.get("/post/userDashboard", {
				params: {
					page: page !== null ? page : pageNo,
					userId: authUser.id,
					saved: 1,
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
						if (userPostData.length == 0) {
							let postData = response.data.postData
							const postIds = postData.map(post => post.postguid)
							localStorage.setItem("userSavedPostIds", JSON.stringify(postIds))
						}
					}
				}
			})
			.catch(err => {
				console.log(err)
			})
	}
	useEffect(() => {
		getUserSavedPostList()
	}, [])
	const getUserPostList = async (
		tag = null,
		time = null,
		user = null,
		what = null,
		page = null
	) => {
		let symbol = props.symbolname ?? null
		setLoader(true)
		let authUser = {
			id: 0,
		}
		if (localStorage.getItem("user")) {
			authUser = JSON.parse(localStorage.getItem("user"))
		}
		axiosHttpMiddelware
			.get("/post/userDashboard", {
				params: {
					symbol: symbol,
					time: time,
					tag: tag,
					user: user,
					what: what,
					page: page !== null ? page : pageNo,
					userId: authUser.id,
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
						if (userPostData.length == 0) {
							let postData = response.data.postData
							const savedPostIds = localStorage.getItem("userSavedPostIds")
								? JSON.parse(localStorage.getItem("userSavedPostIds"))
								: []
							postData = postData.map(post => {
								const savedPost = savedPostIds.includes(post.postguid)
								if (savedPost) {
									post.bookmarkStatus = true
								} else {
									post.bookmarkStatus = false
								}
								return post
							})
							setuserPostData(postData)
							setPostAction(true)
							setTimeout(() => {
								setPostAction(false)
							}, 300000)
						} else {
							setuserPostData(userPostData => [
								...userPostData,
								...response.data.postData,
							])
						}
						window.addEventListener("scroll", handleScroll)
						setTimeout(() => {
							setLoader(false)
						}, 1000)
					} else {
						setLoader(false)
						setScroll(false)
					}
				}
			})
			.catch(err => {
				console.log(err)
			})
	}
	const handleScroll = () => {
		if (scroll) {
			let userScrollHeight = window.innerHeight + window.scrollY + 1
			let windowBottomHeight = document.documentElement.offsetHeight
			if (userScrollHeight >= windowBottomHeight / 2) {
				window.removeEventListener("scroll", handleScroll, false)
				window.removeEventListener("scroll", handleScroll, true)
				setPageNo(pageNo + 1)
			}
		}
	}
	useEffect(() => {
		setuserPostData([])
		setScroll(true)
		if (pageNo == 0) {
			setPageNo(0)
			getUserPostList(filterTag, filterTime, filterUser, filterWhat, 0)
		} else {
			setPageNo(0)
		}
		setNewPostCount(0)
		if (isPostModalOpen) {
			setIsPostModalOpen(!isPostModalOpen)
		}
	}, [postReload, props.symbolname])
	useEffect(() => {
		getUserPostList(filterTag, filterTime, filterUser, filterWhat)
	}, [pageNo])
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
	useEffect(() => {
		// getUserPostList(filterTag, filterTime, filterUser, filterWhat)
		window.addEventListener("scroll", handleScroll)
		if (localStorage.getItem("user")) {
			let user = JSON.parse(localStorage.getItem("user"))
			getUserInfo(user)
		}
		getNewPostCount()
	}, [])
	function getPostByTagFilter(e) {
		setFilterTag(e.target.value)
		setuserPostData([])
		setScroll(true)
		if (pageNo == 0) {
			setPageNo(0)
			getUserPostList(e.target.value, filterTime, filterUser, filterWhat, 0)
		} else {
			setPageNo(0)
		}
		setNewPostCount(0)
	}
	const removeCategory = () => {
		setFilterTag(null)
		setuserPostData([])
		setScroll(true)
		if (pageNo == 0) {
			setPageNo(0)
			getUserPostList(null, filterTime, filterUser, filterWhat, 0)
		} else {
			setPageNo(0)
		}
		setNewPostCount(0)
	}
	function getPostByUserFilter(e) {
		setFilterUser(e.target.value)
		setuserPostData([])
		setScroll(true)
		if (pageNo == 0) {
			setPageNo(0)
			getUserPostList(filterTag, filterTime, e.target.value, filterWhat, 0)
		} else {
			setPageNo(0)
		}
		setNewPostCount(0)
	}
	const removeWho = () => {
		setFilterUser(null)
		setuserPostData([])
		setScroll(true)
		if (pageNo == 0) {
			setPageNo(0)
			getUserPostList(filterTag, filterTime, null, filterWhat, 0)
		} else {
			setPageNo(0)
		}
		setNewPostCount(0)
	}
	function getPostbyTimeFilter(e) {
		setFilterTime(e.target.value)
		setuserPostData([])
		setScroll(true)
		if (pageNo == 0) {
			setPageNo(0)
			getUserPostList(filterTag, e.target.value, filterUser, filterWhat, 0)
		} else {
			setPageNo(0)
		}
		setNewPostCount(0)
	}
	const getPostbyTimeFilterBlank = () => {
		let time = null
		if (filterTime == null) {
			time = "24 hour"
		}
		setFilterTime(time)
		setuserPostData([])
		setScroll(true)
		if (pageNo == 0) {
			setPageNo(0)
			getUserPostList(filterTag, time, filterUser, filterWhat, 0)
		} else {
			setPageNo(0)
		}
		setNewPostCount(0)
	}
	const getUserInfo = user => {
		axiosHttpMiddelware
			.post("/usergetbyid", { userid: user.id })
			.then(userResponse => {
				// setUserInfo(userResponse.data.userResponse)
			})
	}
	const updateRetweetCount = retweetData => {
		// find and update the userPostData ccount
		let userPostDataCopy = [...userPostData]
		userPostDataCopy.map(post => {
			if (post.postguid == retweetData.postguid) {
				post.ccount = parseInt(post.ccount) + 1
			}
			return post
		})
		setuserPostData(userPostDataCopy)
	}
	return (
		<React.Fragment>
			<div className="categorey-list bottom-border">
				<div className="category-filter-top">
					<div className="d-flex">
						<div className="m-2">
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
								className={filterTime ? "btn btn-sm btn-danger" : "btn btn-sm"}
								onClick={() => {
									getPostbyTimeFilterBlank()
								}}>
								<i className="bx bxs-timer"></i>
								Top
							</Button>
							&nbsp;
							{filterTime && (
								<select
									className="form-select-sm filter-select"
									onChange={e => getPostbyTimeFilter(e)}>
									<option value="24 hour">1 day</option>
									<option value="7 day">7 days</option>
									<option value="30 day">30 days</option>
									<option value="1 year">1 year</option>
								</select>
							)}
							&nbsp;
							<Button
								className={who ? "btn btn-sm btn-danger" : "btn btn-sm"}
								onClick={() => {
									if (who) {
										removeWho()
									}
									setWho(!who)
								}}>
								<i className="bx bx-user-plus"></i>
								Who
							</Button>
							&nbsp;
							{who && (
								<select
									className="form-select-sm filter-select"
									onChange={e => getPostByUserFilter(e)}>
									<option value="All">All</option>
									<option value="Following">Following</option>
									<option value="TopUsers">Top Users</option>
								</select>
							)}
							&nbsp;
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
									onChange={e => getPostByTagFilter(e)}>
									<option value="All">All</option>
									<option value="Fundamental">Fundamental</option>
									<option value="Technical">Technical</option>
								</select>
							)}
						</div>
					</div>
					<div className="d-flex">
						<div className="filter-icon">
							<i className="bx bx-filter-alt "></i>
						</div>
						{newPostCount > 0 && (
							<div>
								<span className="badge bg-danger">{newPostCount} New post</span>
							</div>
						)}
						<span
							onClick={() => {
								setNewPostCount(0)
								setuserPostData([])
								setScroll(true)
								if (pageNo == 0) {
									setPageNo(0)
									getUserPostList(
										filterTag,
										filterTime,
										filterUser,
										filterWhat,
										0
									)
								} else {
									setPageNo(0)
								}
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
			{userPostData.length > 0
				? userPostData.map((element, key) => (
						<UserPost element={element} key={key} />
				  ))
				: null}
			{loader && (
				<div className="ct-postbox">
					<div className="userpost-box">
						<div className="usbox-profile">
							<Skeleton circle={true} height={50} width={50} />
						</div>
						<div className="usbox-right-content">
							<div className="ubox-top">
								<div>
									<div>
										<h5 className="m-0">
											<Skeleton width={200} />
										</h5>
										<h6>
											<Skeleton width={300} />
										</h6>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="userpost-box">
						<div className="arrow-box">
							<div className="short-arw-box topar-box">
								<Skeleton width={30} height={30} />
							</div>
							<div className="short-arw-box">
								<Skeleton width={30} height={30} />
							</div>
							<div className="short-arw-box downar-box">
								<Skeleton width={30} height={30} />
							</div>
						</div>
						<div className="usbox-right-content">
							<div className="mb-0 message-img pt-3">
								<Skeleton width={500} height={300} />
							</div>
						</div>
					</div>
					<hr />
				</div>
			)}
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
			<RetweetModal
				open={isRetweetModalOpen}
				toggle={() => {
					setIsRetweetModalOpen(!isRetweetModalOpen)
				}}
				retweetData={retweetData}
				updateRetweetCount={updateRetweetCount}
			/>
			<PostCreateModal
				open={isPostModalOpen}
				toggle={() => {
					setIsPostModalOpen(!isPostModalOpen)
				}}
				post={post}
			/>
		</React.Fragment>
	)
}
export default withContext(
	([
		{
			app: { postReload },
		},
		dispatch,
	]) => ({
		postReload: postReload,
		postReloadSwitch: () => postReloadSwitchAction(dispatch),
	}),
	PostListDashboard
)
