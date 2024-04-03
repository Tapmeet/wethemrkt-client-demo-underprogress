import React, { useState, useEffect } from "react"
import HorizontalLayout from "components/HorizontalLayout"
import { Row, Col, Alert } from "reactstrap"
import axiosAuthHttpMiddelware from "common/axiosAuthHttpMiddelware"
import Linkify from "react-linkify"
import moment from "moment"
import parse from "html-react-parser"
import { useHistory } from "react-router-dom"
import Skeleton from "react-loading-skeleton"
import "./index.css"
const NotificationList = props => {
	const history = useHistory()
	const [notifications, setNotifications] = React.useState([])
	const [page, setPage] = useState(1)
	const [loading, setLoading] = useState(false)
	const getNotifications = () => {
		if (loading) {
			return
		}
		setLoading(true)
		let authUser = {}
		// call get notifications api
		if (localStorage.getItem("user")) {
			authUser = JSON.parse(localStorage.getItem("user"))
		}
		axiosAuthHttpMiddelware
			.get("/getPaginatedNotifications", {
				params: {
					userid: authUser.id,
					page: page,
					limit: 20,
				},
			})
			.then(response => {
				if (response.data) {
					// setNotifications([...notifications, ...response.data.notifications])
					// set notification and ignore the duplicate notification
					let newNotifications = []
					if (notifications.length > 0) {
						newNotifications = [...notifications]
					}
					response.data.notifications.forEach(notification => {
						let isExist = false
						newNotifications.forEach(newNotification => {
							if (newNotification.id === notification.id) {
								isExist = true
							}
						})
						if (!isExist) {
							newNotifications.push(notification)
						}
					})
					setNotifications(newNotifications)
				}
				if (response.data.notifications.length > 0) {
					window.addEventListener("scroll", handleScroll)
				}
				setTimeout(() => {
					setLoading(false)
				}, 200)
			})
	}

	const goToNotification = notification => {
		if (notification.post) {
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
						history.push("/post/" + notification.post.id)
					}
				})
		}
	}

	const markAllAsRead = () => {
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
					getNotifications()
				}
			})
	}

	useEffect(() => {
		getNotifications()
	}, [page])

	const handleScroll = () => {
		if (scroll) {
			let userScrollHeight = window.innerHeight + window.scrollY + 1
			let windowBottomHeight = document.documentElement.offsetHeight
			if (userScrollHeight >= windowBottomHeight) {
				// remove scroll event listener
				window.removeEventListener("scroll", handleScroll)
				setPage(page => page + 1)
			}
		}
	}
	return (
		<React.Fragment>
			<HorizontalLayout>
				<div className="white-boxpart rs-box">
					<div className="notification">
						<div className="notification-header justify-content-between ">
							<h3 class="notification-title">New notification</h3>
							<h3
								class="notification-mark"
								onClick={() => {
									markAllAsRead()
								}}
								role="button">
								Mark all as read
							</h3>
						</div>
						{notifications.length > 0 &&
							notifications.map((notification, index) => {
								if (!notification.createdAt) {
									return null
								}
								return (
									<div
										className={`notification-container ${
											notification.isRead ? false : "n-unread"
										}`}
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
											<span class="notification-timer">
												{moment(notification.createdAt).fromNow()}
											</span>
										</div>
										{!notification.isRead && (
											<div className="notification-unread">Unread</div>
										)}
									</div>
								)
							})}
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
			</HorizontalLayout>
		</React.Fragment>
	)
}
export default NotificationList
