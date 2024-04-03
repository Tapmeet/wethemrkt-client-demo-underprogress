import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import logo from "../../assets/images/logo.jpeg"
import logoDark from "../../assets/images/logo.jpeg"
import "./SideBar.css"
import { Row, Col, Button, Nav, NavItem, NavLink } from "reactstrap"
import PostCreateModal from "components/Common/PostCreateModal"

const SideBar = () => {
	const [isPostModalOpen, setIsPostModalOpen] = useState(false)
	const [user, setUser] = useState(null)
	const [isMobile, setIsMobile] = useState(false)
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	useEffect(() => {
		// Check if the screen width is less than a certain breakpoint (e.g., 768px) to determine if it's a mobile device
		const isMobileDevice = window.innerWidth < 768

		setIsMobile(isMobileDevice)

		// Add a resize event listener to update the isMobile state when the window size changes
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768)
		}

		window.addEventListener("resize", handleResize)

		// Clean up the event listener on component unmount
		return () => {
			window.removeEventListener("resize", handleResize)
		}
	}, [])

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen)
	}

	useEffect(() => {
		let authUser = localStorage.getItem("user")
		setUser(authUser)
	}, [])

	return (
		<div className="common-side-bar d-flex flex-column">
			{isMobile ? (
				<div className="mobile-menu-box">
					<div className="mobile-menu-header">
						<Link
							to="/"
							className="logo logo-dark w-100"
							onClick={() => {
								window.location.href = "/"
							}}>
							<span className="logo-sm">
								<img src={logo} alt="" height="40" />
							</span>
							<span className="logo-lg">
								<img src={logoDark} alt="" height="60" />
							</span>
						</Link>
						{isMobile && (
							<button className="menu-toggle" onClick={toggleMenu}>
								{isMenuOpen ? (
									<i class="bx bx-x"></i>
								) : (
									<i class="bx bx-menu"></i>
								)}
							</button>
						)}
					</div>
					<div
						className={
							isMenuOpen ? "mobile-menu mobile-menu-active" : "mobile-menu"
						}>
						<div className="post-btn">
							<Button
								className="btn btn btn-secondary w-xs"
								onClick={() => {
									setIsPostModalOpen(!isPostModalOpen)
								}}>
								Post
							</Button>
						</div>
						<Nav vertical>
							{user && (
								<>
									<NavItem>
										<NavLink href="/feed">
											<i class="bx bx-grid-alt"></i> &nbsp; &nbsp;
											<span className="bg-white">Dashboard</span>
										</NavLink>
									</NavItem>
									<NavItem>
										<NavLink href="/saved-posts">
											<i className="bx bx-bookmark"></i> &nbsp; &nbsp;
											<span className="bg-white">Saved Post</span>
										</NavLink>
									</NavItem>
									<NavItem>
										<NavLink href="/leaderboard">
											<i className="bx bx-bar-chart-square"></i> &nbsp; &nbsp;
											<span className="bg-white">Leaderboard</span>
										</NavLink>
									</NavItem>
									<NavItem>
										<NavLink href="/watchlist">
											<i class="bx bx-show"></i> &nbsp; &nbsp;
											<span className="bg-white">Watchlist</span>
										</NavLink>
									</NavItem>

									<NavItem>
										<NavLink href="/notification-list">
											<i className="bx bx-bell" /> &nbsp; &nbsp;
											<span className="bg-white">Notifications</span>
										</NavLink>
									</NavItem>
								</>
							)}
							<NavItem>
								<NavLink href="/privacy-policy">
									<i class="bx bx-info-circle"></i> &nbsp; &nbsp;
									<span className="bg-white">Privacy policy</span>
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink href="/contact-us">
									<i className="bx bx-message"></i> &nbsp; &nbsp;
									<span className="bg-white">Contact us</span>
								</NavLink>
							</NavItem>
						</Nav>

						<Nav className="logout-button">
							{user && (
								<>
									<NavItem>
										<NavLink href="/logout">
											<i class="bx bx-log-in"></i> &nbsp; &nbsp;
											<span className="bg-white">Logout</span>
										</NavLink>
									</NavItem>
								</>
							)}
						</Nav>
					</div>
				</div>
			) : (
				<div>
					<Row>
						<Col md={12}>
							<Link
								to="/"
								className="logo logo-dark w-100"
								onClick={() => {
									window.location.href = "/"
								}}>
								<span className="logo-sm">
									<img src={logo} alt="" height="40" />
								</span>
								<span className="logo-lg">
									<img src={logoDark} alt="" height="60" />
								</span>
							</Link>
						</Col>
					</Row>
					<Row>
						<Col className="post-btn">
							<Button
								className="btn btn btn-secondary w-xs"
								onClick={() => {
									setIsPostModalOpen(!isPostModalOpen)
								}}>
								Post
							</Button>
						</Col>
					</Row>
					<Row>
						<Col>
							<Nav vertical>
								{user && (
									<>
										<NavItem>
											<NavLink href="/feed">
												<i class="bx bx-grid-alt"></i> &nbsp; &nbsp;
												<span className="bg-white">Dashboard</span>
											</NavLink>
										</NavItem>
										<NavItem>
											<NavLink href="/saved-posts">
												<i className="bx bx-bookmark"></i> &nbsp; &nbsp;
												<span className="bg-white">Saved Post</span>
											</NavLink>
										</NavItem>
										<NavItem>
											<NavLink href="/leaderboard">
												<i className="bx bx-bar-chart-square"></i> &nbsp; &nbsp;
												<span className="bg-white">Leaderboard</span>
											</NavLink>
										</NavItem>
										<NavItem>
											<NavLink href="/watchlist">
												<i class="bx bx-show"></i> &nbsp; &nbsp;
												<span className="bg-white">Watchlist</span>
											</NavLink>
										</NavItem>
										<NavItem>
											<NavLink href="/notification-list">
												<i className="bx bx-bell" /> &nbsp; &nbsp;
												<span className="bg-white">Notifications</span>
											</NavLink>
										</NavItem>
									</>
								)}
								<NavItem>
									<NavLink href="/privacy-policy">
										<i class="bx bx-info-circle"></i> &nbsp; &nbsp;
										<span className="bg-white">Privacy policy</span>
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink href="/contact-us">
										<i className="bx bx-message"></i> &nbsp; &nbsp;
										<span className="bg-white">Contact us</span>
									</NavLink>
								</NavItem>
							</Nav>
						</Col>
					</Row>
					<Row>
						<Col>
							<Nav className="logout-button">
								{user && (
									<>
										<NavItem>
											<NavLink href="/logout">
												<i class="bx bx-log-in"></i> &nbsp; &nbsp;
												<span className="bg-white">Logout</span>
											</NavLink>
										</NavItem>
									</>
								)}
							</Nav>
						</Col>
					</Row>
				</div>
			)}

			<PostCreateModal
				open={isPostModalOpen}
				toggle={() => {
					setIsPostModalOpen(!isPostModalOpen)
				}}
			/>
		</div>
	)
}

export default SideBar
