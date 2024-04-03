import React, { useEffect, useState } from "react"
import { withRouter } from "react-router-dom"
import PropTypes from "prop-types"
import Header from "./Header"
import { Container, Row, Col, Card } from "reactstrap"
import SideBar from "components/CommonLanding/SideBar"
import TrendingSymbol from "components/Symbol/TrendingSymbol"
import UserKudos from "components/Users/UserKudos"
import Ranking from "../Ranking"
import "./layout.scss"

const Layout = props => {
	useEffect(() => {
		const title = props.location.pathname
		let currentage = title.charAt(1).toUpperCase() + title.slice(2)
		document.title = currentage + " "
	}, [props.location.pathname])
	useEffect(() => {
		window.scrollTo(0, 0)
	}, [])
	const [isMenuOpened, setIsMenuOpened] = useState(false)
	const openMenu = () => {
		setIsMenuOpened(!isMenuOpened)
	}
	return (
		<React.Fragment>
			<div className="dashboard-wrapper">
				<div className="left_sidebar">
					<SideBar></SideBar>
				</div>
				<div className="mainbody-wrapper">
					<Header isMenuOpened={isMenuOpened} openLeftMenuCallBack={openMenu} />
					<div className={`${!props.hideRightCards ? "inner-bodypart" : ""}`}>
						{props.children}
					</div>
					{!props.hideRightCards && (
						<div className="right-sidebar">
							<Ranking />
							<UserKudos props={props} />
							{/* <TrendingSymbol /> */}
						</div>
					)}
				</div>
			</div>
		</React.Fragment>
	)
}
Layout.propTypes = {
	changeLayout: PropTypes.func /*  */,
	changeLayoutWidth: PropTypes.func,
	changeTopbarTheme: PropTypes.func,
	children: PropTypes.object,
	isPreloader: PropTypes.any,
	layoutWidth: PropTypes.any,
	location: PropTypes.object,
	topbarTheme: PropTypes.any,
}
export default withRouter(Layout)
