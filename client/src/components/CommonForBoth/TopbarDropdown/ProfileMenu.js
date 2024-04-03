import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import {
	Dropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
} from "reactstrap"

import { withRouter, Link, useHistory } from "react-router-dom"

import axiosHttpMiddelware from "common/axiosHttpMiddelware"

// import user from '../../../services/user.service';

const ProfileMenu = props => {
	const history = useHistory()
	// Declare a new state variable, which we'll call "menu"
	const [menu, setMenu] = useState(false)
	// const [username, setusername] = useState("Admin")
	const [userInfo, setuserInfo] = useState({
		id: "",
		name: "",
		profilePhoto: "",
		isadmin: "",
	})

	useEffect(() => {
		async function getUsers() {
			if (localStorage.getItem("user")) {
				const obj = JSON.parse(localStorage.getItem("user"))
				const username = obj.username
				if (username) {
					axiosHttpMiddelware
						.post("/usergetbyusername", { username: username })
						.then(userResponse => {
							if (
								userResponse !== undefined &&
								userResponse.status === 200 &&
								userResponse.data.userResponse !== null &&
								userResponse.data.userResponse !== undefined
							) {
								setuserInfo({
									...userInfo,
									id: userResponse.data.userResponse.id,
									name: userResponse.data.userResponse.username,
									email: userResponse.data.userResponse.email,
									about: userResponse.data.userResponse.about,
									profilePhoto: userResponse.data.userResponse.profilephoto,
									isadmin: userResponse.data.userResponse.isadmin,
									createddate: userResponse.data.userResponse.createdAt,
									preview: userResponse.data.userResponse.profilephoto,
									tradingtag:
										userResponse.data.userResponse.tradingstyles != null
											? userResponse.data.userResponse.tradingstyles.split(",")
											: userResponse.data.userResponse.tradingstyles,
									follower: userResponse.data.userResponse.follower,
									following: userResponse.data.userResponse.following,
								})
							}
						})
						.catch(err => {
							setuserInfo({
								...userInfo,
								id: obj.id,
								name: obj.username,
								profilePhoto: obj.profilePhoto,
								isadmin: obj.isadmin,
							})
						})
				}
			}
		}
		getUsers()
	}, [props.success])

	const userprofile = (username, userid) => {
		history.push({ pathname: `/viewprofile/${username}`, state: userid })
	}

	return (
		<React.Fragment>
			<Dropdown
				isOpen={menu}
				toggle={() => setMenu(!menu)}
				className="d-inline-block profile-dropdown">
				<DropdownToggle
					className="btn p-0"
					id="page-header-user-dropdown"
					tag="button">
					<div className="profile-dropdown-wrapper">
						<div className="usbox-profile-name-wrapper">
							<div className="usbox-profile-name">{userInfo.name}</div>
						</div>
						<div className="usbox-profile">
							{userInfo.profilePhoto && (
								<img
									src={userInfo.profilePhoto}
									alt=""
									className="profile-dropdown-img rounded-circle"
								/>
							)}
						</div>
					</div>
				</DropdownToggle>
				<DropdownMenu className="dropdown-menu-end dropdown-profile-menu">
					<DropdownItem onClick={e => userprofile(userInfo.name, userInfo.id)}>
						{" "}
						<i className="bx bx-user font-size-16 align-middle me-1" />
						{"Profile"}{" "}
					</DropdownItem>
					{userInfo.isadmin ? (
						<DropdownItem tag="a" href="/admin">
							<i className="bx bx-wrench font-size-16 align-middle me-1" />
							{"Admin"}
						</DropdownItem>
					) : null}
					<div className="dropdown-divider" />
					<Link to="/logout" className="dropdown-item">
						<i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
						<span>{"Logout"}</span>
					</Link>
				</DropdownMenu>
			</Dropdown>
		</React.Fragment>
	)
}

ProfileMenu.propTypes = {
	success: PropTypes.any,
	t: PropTypes.any,
}

const mapStatetoProps = state => {
	const { error, success } = state.Profile
	return { error, success }
}

export default withRouter(ProfileMenu)
