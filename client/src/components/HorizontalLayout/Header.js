import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { useHistory } from "react-router-dom"
import { Link } from "react-router-dom"
import { Container, Nav, NavItem, NavLink } from "reactstrap"

import bearImage from "../../assets/images/crosshair.png"

// Redux Store
// import { toggleLeftmenu } from "../../store/actions"
// reactstrap
import { Dropdown, DropdownToggle, Row, Col, Progress } from "reactstrap"

// Import menuDropdown
import NotificationDropdown from "../CommonForBoth/TopbarDropdown/NotificationDropdown"
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu"
import EmailMenu from "../CommonForBoth/TopbarDropdown/EmailMenu"
import SearchDropdown from "../../components/CommonForBoth/TopbarDropdown/SearchDropdown"
import PostModel from "../CommonForBoth/TopbarDropdown/PostModel"
import axios from "axios"
import axiosHttpMiddelware from "common/axiosHttpMiddelware"
import toastr from "toastr"

// import userpost from '../../services/post.service';
// import kudoscoin from "../../services/kudoscoin.service"

import "../../assets/scss/custom/wethemkrt/post-header.scss"
import "../../assets/scss/custom/wethemkrt/editor.scss"
import "../../assets/scss/custom/wethemkrt/common.scss"
import "toastr/build/toastr.min.css"

import logo from "../../assets/images/logo-sm-light.png"
import logoLight from "../../assets/images/logo-light.png"
import logoLightSvg from "../../assets/images/logo-light.svg"
import logoDark from "../../assets/images/logo-dark.png"
import WatchListDropdown from "components/CommonForBoth/TopbarDropdown/WatchList"
import Login from "components/CommonForBoth/AuthenticationModel/Login"
import Signup from "components/CommonForBoth/AuthenticationModel/Signup"

//i18n
// import { withTranslation } from "react-i18next"

const Header = props => {
	const history = useHistory()
	const [activeClass, setActiveClass] = useState("page-topbar")
	const [user, setUser] = useState(null)
	const [menu, setMenu] = useState(false)
	const [isSearch, setSearch] = useState(false)
	const [modal_backdrop, setmodal_backdrop] = useState(false)
	const [kudosCoin, setkudosCoin] = useState({ coincount: 0, progress: "0" })
	const [modal_backdroplogin, setmodal_backdroplogin] = useState(false)
	const [modal_backdropsignup, setmodal_backdropsignup] = useState(false)

	function tog_backdroplogin() {
		setmodal_backdroplogin(true)
	}

	function tog_backdropsignup() {
		setmodal_backdropsignup(true)
	}

	function handleChangeLogin(value, issignup) {
		setmodal_backdroplogin(value)
		if (issignup) {
			tog_backdropsignup()
		}
	}

	function handleChangeSignup(value, islogin) {
		setmodal_backdropsignup(value)
		if (islogin) {
			tog_backdroplogin()
		}
	}

	function tog_backdrop() {
		setmodal_backdrop(true)
	}

	function handleChange(value) {
		setmodal_backdrop(value)
	}

	useEffect(() => {
		if (localStorage.getItem("user")) {
			setkudosCoin({ coincount: 0, progress: "0" })

			let userid = JSON.parse(localStorage.getItem("user"))
			// axios.defaults.headers.common['Authorization'] = userid.accessToken;
			axiosHttpMiddelware
				.post("getKudosCountByUser", { userid: userid.id })
				.then(response => {
					if (
						response.status == 200 &&
						response.data.kudosCoinResponse !== undefined
					) {
						setkudosCoin({
							...kudosCoin,
							coincount: response.data.kudosCoinResponse.kudoscoin,
							progress: response.data.kudosCoinResponse.progress,
						})
					}
				})
				.catch(err => {
					console.log(err)
					toastr.error("Error fetching kudoscoin.", "Error")
				})
		}
		// async function getUserInfo() {
		//   if (localStorage.getItem("user")) {
		//     const obj = JSON.parse(localStorage.getItem("user"))
		//     const response = await kudoscoin.getKudosCountByUser(obj.id)
		//     if (
		//       response.status == 200 &&
		//       response.data.kudosCoinResponse !== undefined &&f
		//       response.data.kudosCoinResponse.length > 0
		//     ) {
		//       setkudosCoin({
		//         ...kudosCoin,
		//         coinCount: response.data.kudosCoinResponse[0].kudoscoincount,
		//         progress: response.data.kudosCoinResponse[0].progress,
		//       })
		//     }
		//   }
		// }
		// getUserInfo()
	}, [props.success])

	const clickonBlog = () => {
		history.push(`/blog`)
	}

	const clickonWatchlist = () => {
		history.push(`/watchlist`)
	}

	const clickonLeadboard = () => {
		history.push(`/leadboard`)
	}

	useEffect(() => {
		if (localStorage.getItem("user")) {
			setUser(localStorage.getItem("user"))
		}
		window.addEventListener("scroll", () => {
			if (window.scrollY === 0) {
				setActiveClass("page-topbar")
			} else {
				setActiveClass("page-topbar page-topbar-active")
			}
		})
	}, [])

	return (
		<React.Fragment>
			<header id="page-topbar" className={activeClass}>
				<Nav className="d-flex justify-content-end header-nav-top">
					<NavItem style={{ marginRight: "auto" }}>
						<SearchDropdown />
					</NavItem>
					{user && (
						<NavItem>
							<div className="d-flex">
								<div className="px-3">
									<Progress
										className="top-progress"
										color="primary"
										value={100 - kudosCoin.progress}
									/>
									{kudosCoin.progress < 50 ? (
										<>Top {kudosCoin.progress}% of users</>
									) : (
										<>
											Progress {100 - kudosCoin.progress}% <br /> based on kudos
											coins
										</>
									)}
								</div>
							</div>
						</NavItem>
					)}
					{user ? (
						<NavItem className="nav-link-btn" style={{ marginRight: 100 }}>
							<div className="d-flex justify-content-center align-items-center">
								<div className="px-2">
									<NotificationDropdown />
								</div>
								<span className="dollar-box px-2">
									<i className="bx bx-dollar-circle dollar-icon-uesr"></i>{" "}
									<span className="dollar-count">
										{" "}
										&nbsp;&nbsp;
										{kudosCoin.coincount ?? 0}{" "}
									</span>
								</span>
								<ProfileMenu />
							</div>
						</NavItem>
					) : (
						<NavItem className="me-5">
							<div>
								<button
									className="btn btn-primary"
									onClick={() => {
										tog_backdroplogin()
									}}>
									{" "}
									Login{" "}
								</button>
								<button
									type="button"
									className="btn btn-primary  ms-2"
									onClick={() => {
										tog_backdropsignup()
									}}>
									{" "}
									Sign Up{" "}
								</button>
							</div>
						</NavItem>
					)}
				</Nav>
				{modal_backdroplogin ? (
					<Login
						onChange={handleChangeLogin}
						dataParentToChild={modal_backdroplogin}
					/>
				) : null}
				{modal_backdropsignup ? (
					<Signup
						onChange={handleChangeSignup}
						dataParentToChild={modal_backdropsignup}
					/>
				) : null}
			</header>
		</React.Fragment>
	)
}

Header.propTypes = {
	leftMenu: PropTypes.any,
	t: PropTypes.any,
	toggleLeftmenu: PropTypes.func,
}

const mapStatetoProps = state => {
	const { layoutType, leftMenu } = state.Layout
	return { layoutType, leftMenu }
}

export default Header
