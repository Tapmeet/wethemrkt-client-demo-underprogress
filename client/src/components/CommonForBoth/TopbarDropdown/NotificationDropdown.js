import React, { useState, useRef } from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from "reactstrap"
// import socketIOClient from "socket.io-client"
import io from "socket.io-client"
import toastr from "toastr"
import notificationSound from "../../../assets/sounds/notification.mp3"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import axiosAuthHttpMiddelware from "common/axiosAuthHttpMiddelware"
import parse from "html-react-parser"
import moment from "moment"
import useSound from "use-sound"
import Skeleton from "react-loading-skeleton"
import "./scss/topBar.scss"

//i18n
// import { withTranslation } from "react-i18next"

const NotificationDropdown = props => {
	const [notifications, setNotifications] = useState([])
	const [playSound] = useSound(notificationSound)
	const [dataLoaded, setDataLoaded] = useState(false)
	const [page, setPage] = useState(1)
	const notificationWrapperRef = useRef(null)
	const [socketNotifications, setSocketNotifications] = useState([])
	const [totalUnread, setTotalUnread] = useState(0)
	const [loading, setLoading] = useState(false)
	React.useEffect(() => {
		// get the browser notification permission if not given
		if (Notification.permission !== "granted") {
			Notification.requestPermission()
		}
		initSocket()
	}, [])

	const initSocket = () => {
		// create a socket connection
		const socket = io(process.env.REACT_APP_SOCKET_URL)
		// listen for the event
		socket.on("notification", data => {
			updateSocketNotifications(data)
		})
	}

	const updateSocketNotifications = data => {
		const authUser = JSON.parse(localStorage.getItem("user"))
		if (authUser.id !== data.userId) {
			return
		}
		// add the notification to the state
		setNotifications(oldNotifications => [data, ...oldNotifications])

		setSocketNotifications(oldSocketNotifications => [
			data,
			...oldSocketNotifications,
		])

		setTotalUnread(totalUnread => totalUnread + 1)

		// show toast notification
		toastr.success(data.text)

		//use memo to play sound only once
		try {
			// show browser notification only once
			if (Notification.permission === "granted") {
				new Notification(data.text)
			}
		} catch (e) {
			console.log(e)
		}
	}

	// play sound when new notification comes
	React.useEffect(() => {
		if (socketNotifications.length > 0 && dataLoaded) {
			playSound()
		}
	}, [socketNotifications])

	// Declare a new state variable, which we'll call "menu"
	const [menu, setMenu] = useState(false)

	const history = useHistory()
	const getNotifications = () => {
		if (page === 0 || loading) {
			return
		}
		setLoading(true)
		let authUser = {}
		// call get notifications api
		if (localStorage.getItem("user")) {
			authUser = JSON.parse(localStorage.getItem("user"))
		}
		// call get paginated notifications api
		axiosAuthHttpMiddelware
			.get("/getPaginatedNotifications", {
				params: {
					userid: authUser.id,
					page: page,
				},
			})
			.then(response => {
				if (response.data) {
					if (notifications.length === 0) {
						setNotifications(response.data.notifications)
						setDataLoaded(true)
					} else {
						setNotifications([...notifications, ...response.data.notifications])
					}
					setTotalUnread(response.data.totalUnread)
					if (response.data.notifications.length === 0) {
						setPage(0)
					} else {
						setPage(page + 1)
					}
					setLoading(false)
				}
			})
			.catch(error => {
				console.log(error)
				setNotifications([])
				localStorage.setItem("notifications", JSON.stringify([]))
			})
	}
	//call get notification
	React.useEffect(() => {
		getNotifications(page)
	}, [])

	const goToNotification = notification => {
		if (notification.notifiableType === "posts") {
			let authUser = {}
			// call get notifications api
			if (localStorage.getItem("user")) {
				authUser = JSON.parse(localStorage.getItem("user"))
			}
			// markNotificationAsRead notification as read
			axiosAuthHttpMiddelware
				.post("/markNotificationAsRead", {
					id: notification.id,
					userId: authUser.id,
				})
				.then(response => {
					if (response.data) {
						getNotifications()
						history.push("/post/" + notification.post.postguid)
					}
				})
		}
	}

	const markAllAsRead = () => {
		if (totalUnread > 0) {
			let authUser = {}
			// call get notifications api
			if (localStorage.getItem("user")) {
				authUser = JSON.parse(localStorage.getItem("user"))
			}
			// markNotificationAsRead notification as read
			axiosAuthHttpMiddelware
				.post("/markNotificationAsRead", {
					userId: authUser.id,
				})
				.then(response => {
					if (response.data) {
						//make All notification as read
						setNotifications(
							notifications.map(notification => {
								notification.isRead = true
								return notification
							})
						)
						// set notification on the local storage
						localStorage.setItem(
							"notifications",
							JSON.stringify(
								notifications.map(notification => {
									notification.isRead = true
									return notification
								})
							)
						)
						setTotalUnread(0)
						// clear socket notification
						setSocketNotifications([])
					}
				})
		}
	}

	const onNotificationScroll = () => {
		if (notificationWrapperRef.current) {
			if (
				notificationWrapperRef.current.scrollTop +
					notificationWrapperRef.current.clientHeight ===
				notificationWrapperRef.current.scrollHeight
			) {
				getNotifications()
			}
		}
	}

	return (
		<React.Fragment>
			<Dropdown
				isOpen={menu}
				toggle={() => setMenu(!menu)}
				className="dropdown">
				<DropdownToggle
					className="btn"
					tag="button"
					id="page-header-notifications-dropdown">
					<i className="bx bx-bell" style={{ fontSize: "1.3rem" }} />{" "}
					{totalUnread > 0 && (
						<span className="badge bg-danger" style={{ top: "-12px" }}>
							{" "}
							{totalUnread}{" "}
						</span>
					)}
				</DropdownToggle>

				<DropdownMenu
					className="dropdown-menu dropdown-menu-left"
					style={{ minWidth: 539 }}>
					<div
						className="wraaper"
						ref={notificationWrapperRef}
						onScroll={onNotificationScroll}>
						<div className="notification">
							<div className="notification-header justify-content-between ">
								<h3 class="notification-title">Notification</h3>
								<h3
									class="notification-mark"
									onClick={() => {
										markAllAsRead()
									}}
									role="button">
									Mark as all read
								</h3>
							</div>
							{notifications.length > 0 ? (
								notifications.map((notification, index) => {
									return (
										<div
											className={`notification-container`}
											onClick={() => {
												goToNotification(notification)
											}}
											role="button"
											key={index}>
											<div className="notification-media">
												{notification.user && notification.user.profilephoto ? (
													<img
														src={notification.user.profilephoto}
														alt=""
														className="notification-user-avatar"
													/>
												) : (
													<i
														className="fa fa-user-circle bg-light rounded-circle d-flex align-items-center justify-content-center"
														style={{ width: 60, height: 60 }}></i>
												)}
											</div>
											<div className="notification-content">
												<p className="notification-text">
													{/** show notification text html */}
													{parse(notification.htmlText)}
												</p>
												<span className="notification-timer">
													{moment(notification.createdAt).fromNow()}
												</span>
											</div>
											{/** if the notification is unread then show a dot badge */}
											{!notification.isRead && (
												<div className="notification-dot"></div>
											)}
										</div>
									)
								})
							) : (
								<div className="notification-container">
									{" "}
									No unread notification found{" "}
								</div>
							)}
							{loading && (
								<div className="notification-container">
									<Skeleton
										height={60}
										width={60}
										circle={true}
										style={{ marginRight: 10 }}
									/>
									<div className="notification-content">
										<Skeleton width={200} />
										<Skeleton width={100} />
									</div>
								</div>
							)}
						</div>
					</div>
				</DropdownMenu>
			</Dropdown>
		</React.Fragment>
	)
}

export default NotificationDropdown

NotificationDropdown.propTypes = {
	t: PropTypes.any,
}
