import React, { useState, useEffect, useRef } from "react"
import HorizontalLayout from "components/HorizontalLayout"
import { Container, Row, Col, Button, Card } from "reactstrap"
import { Field, Form } from "@availity/form"
import "@availity/yup"
import { withRouter } from "react-router-dom"
import Toaster from "../../components/Common/Toaster"
import "../../assets/scss/custom/wethemkrt/user-profile.scss"
import "../../assets/scss/custom/wethemkrt/mentor.scss"
import axiosHttpMiddelware from "common/axiosHttpMiddelware"
import axiosAuthHttpMiddelware from "../../common/axiosAuthHttpMiddelware"
import { useHistory } from "react-router-dom"
const KeyCodes = {
	comma: 188,
	enter: 13,
}
const delimiters = [KeyCodes.comma, KeyCodes.enter]
const UserProfile = props => {
	const history = useHistory()
	const [userInfo, setuserInfo] = useState({
		idx: "",
		email: "",
		name: "",
		about: "",
		preview: "",
		profilePhoto: "",
	})
	const [editAbout, setEditAbout] = useState(false)
	const [tagvalue, settagvalue] = useState({
		active: false,
		passive: false,
		growth: false,
		value: false,
		divident: false,
		technical: false,
		fundamental: false,
		momentum: false,
		breakout: false,
		swing: false,
		daytrader: false,
		shortterm: false,
		longterm: false,
		scalping: false,
		canslim: false,
	})
	const [updateClick, setUpdateClick] = useState(false)
	const [kudosCoin, setkudosCoin] = useState({ coinCount: 0, progress: "0" })
	const [tags, setTags] = React.useState([])
	const [suggestions, setsuggestions] = React.useState([])
	const [tagErrorMsg, settagErrorMsg] = useState("")
	const inputFile = useRef(null)
	var tagData = ""
	useEffect(() => {
		getUsers()
		getUserInfo()
	}, [props.success, updateClick])
	function getUsers() {
		if (localStorage.getItem("user")) {
			const obj = JSON.parse(localStorage.getItem("user"))
			axiosHttpMiddelware
				.post("/usergetbyid", { userid: obj.id })
				.then(userResponse => {
					if (
						userResponse !== undefined &&
						userResponse.status === 200 &&
						userResponse.data.userResponse !== null &&
						userResponse.data.userResponse !== undefined
					) {
						setuserInfo({
							...userInfo,
							idx: userResponse.data.userResponse.id,
							name: userResponse.data.userResponse.username,
							email: userResponse.data.userResponse.email,
							about:
								userResponse.data.userResponse.about == null
									? ""
									: userResponse.data.userResponse.about,
							profilePhoto: userResponse.data.userResponse.profilephoto,
							preview: userResponse.data.userResponse.profilephoto,
							follower: userResponse.data.userResponse.follower,
							following: userResponse.data.userResponse.following,
						})
					}
				})
				.catch(err => {
					console.error(err)
					Toaster.errorToaster("Could not fetch user info", "Error")
				})
		}
	}
	async function getUserInfo() {
		if (localStorage.getItem("user")) {
		}
	}
	const handleDelete = i => {
		setTags(tags.filter((tag, index) => index !== i))
	}
	const handleAddition = tag => {
		setTags([...tags, tag])
	}
	const handleDrag = (tag, currPos, newPos) => {
		const newTags = tags.slice()
		newTags.splice(currPos, 1)
		newTags.splice(newPos, 0, tag)
		setTags(newTags)
	}
	const handleTagClick = index => {}
	const showOpenFileDialog = () => {
		inputFile.current.click()
	}
	const handleClickTwo = e => {
		var file = e.target.files[0]
		const fileSize = file.size / 1024 / 1024
		if (fileSize > 20) {
			Toaster.errorToaster("File size should be less than 20 MB", "UserPost")
		} else {
			getBase64(file)
				.then(result => {})
				.catch(err => {
					console.log(err)
				})
		}
		if (e.target.files[0]) {
			inputFile.current.value = ""
		}
	}
	function getBase64(file) {
		return new Promise(resolve => {
			let baseURL = ""
			let reader = new FileReader()
			reader.readAsDataURL(file)
			reader.onload = () => {
				baseURL = reader.result
				if (file) {
					setuserInfo({
						...userInfo,
						preview: URL.createObjectURL(file),
						raw: reader.result,
					})
				}
				resolve(baseURL)
			}
		})
	}
	async function tagGroupChange(e) {
		const value = e.target.checked
		settagvalue({ ...tagvalue, [e.target.name]: value })
	}
	function validateDetail() {
		return true
	}
	function handleValidSubmit(values) {
		if (localStorage.getItem("user")) {
			if (validateDetail()) {
				var newVal = {
					userid: userInfo.idx,
					username: values.username,
					useremail: values.useremail,
					about: values.about,
					imageuri: userInfo.raw,
				}
				axiosAuthHttpMiddelware
					.post("/updateuserprofile", newVal)
					.then(response => {
						Toaster.successToaster(response.data.message, "Success!")
						const user = JSON.parse(localStorage.getItem("user"))
						const userResponse = response.data.userResponse
						user.username = userResponse.username
						localStorage.setItem("user", JSON.stringify(user))
						history.push(`/viewprofile/${userInfo.name}`)
					})
					.catch(err => {
						// if status 400 then show the message
						if (err.response.status === 400) {
							debugger
							Toaster.errorToaster(err.response.data.message, "Profile")
						}
					})
				setUpdateClick(true)
			} else {
				Toaster.errorToaster(tagErrorMsg, "Profile")
			}
		}
	}
	return (
		<React.Fragment>
			<HorizontalLayout>
				<div class="white-boxpart rs-box">
					<div className="profile-info-edit-box">
						<Container fluid>
							{/* Render Breadcrumb */}
							<Row>
								<Col className="col-xl-12">
									<Row>
										<Col className="col-md-12 p-0 m-auto">
											<div className="page-content pt-4">
												<Container fluid>
													<div className="row">
														<div className="col-lg-10 m-auto">
															<div className="row">
																<h4 className="card-title mb-4 title-text">
																	Personal Info
																</h4>
																<div className="col-lg-6">
																	<div className="d-flex">
																		<div className="flex-shrink-0 me-4">
																			<div className="avatar-md">
																				<span
																					className="avatar-title rounded-circle bg-light text-danger font-size-16 cursor-pointer"
																					onClick={showOpenFileDialog}
																					htmlFor="upload-button">
																					{userInfo.preview ? (
																						<img
																							className=" rounded-circle avatar-md"
																							src={userInfo.preview}
																							alt="dummy"
																						/>
																					) : (
																						<div>
																							<img
																								src={userInfo.raw}
																								alt=""
																								className="avatar-md rounded-circle img-thumbnail"
																							/>
																						</div>
																					)}
																				</span>
																				<input
																					type="file"
																					ref={inputFile}
																					name="file"
																					style={{ display: "none" }}
																					accept="image/*"
																					onChange={e => handleClickTwo(e)}
																				/>
																			</div>
																		</div>
																		<div className="flex-grow-1 overflow-hidden">
																			<h5 className="text-truncate font-size-15 text-transform ">
																				{" "}
																				{userInfo.name}
																			</h5>
																			<p className="text-muted m-0">
																				<i className="bx bx-calendar font-size-16 align-middle text-primary me-1"></i>{" "}
																				Member since December 1st 2021
																			</p>
																			<div className="d-flex following-text pt-2">
																				<span className="pe-3">
																					{" "}
																					{userInfo.following &&
																						userInfo.following.length}{" "}
																					Following
																				</span>
																				<span>
																					{userInfo.follower &&
																						userInfo.follower.length}{" "}
																					Followers
																				</span>
																			</div>
																			<div></div>
																		</div>
																	</div>
																</div>
																<h4 className="card-title pt-4 mb-md-4 title-text">
																	User Profile
																</h4>
																<div>
																	<Form
																		initialValues={{
																			idx: "",
																			email: "",
																			username: "",
																			about: "",
																			preview: "",
																			raw: "",
																		}}
																		className="form-horizontal"
																		onSubmit={value => {
																			handleValidSubmit(value)
																		}}>
																		<Row>
																			<Col className="col-md-6 col-12 pt-md-0 pt-3">
																				<div className="form-group">
																					<Field
																						name="username"
																						label="Username"
																						value={userInfo.name}
																						className="form-control"
																						placeholder="Enter User Name"
																						type="text"
																						onChange={e =>
																							setuserInfo({
																								...userInfo,
																								name: e.target.value,
																							})
																						}
																					/>
																					<Field
																						name="idx"
																						value={userInfo.idx}
																						type="hidden"
																					/>
																				</div>
																			</Col>
																			<Col className="col-md-6 col-12 pt-md-0 pt-3">
																				<div className="form-group">
																					<Field
																						name="useremail"
																						label="Email"
																						value={userInfo.email}
																						className="form-control"
																						placeholder="Enter User Email"
																						type="email"
																						readOnly
																					/>
																				</div>
																			</Col>
																		</Row>
																		<Row>
																			<Col className="col-12 pt-4">
																				<div className="form-group">
																					{editAbout ? (
																						<Field
																							name="about"
																							label="About"
																							className="form-control"
																							placeholder="About you in 250 characters and less"
																							type="textarea"
																							maxLength="225"
																							rows="3"
																						/>
																					) : (
																						<Field
																							name="about"
																							label="About"
																							value={userInfo.about}
																							className="form-control"
																							placeholder="About you in 250 characters and less"
																							type="textarea"
																							maxLength="225"
																							rows="3"
																							onClick={e => setEditAbout(true)}
																						/>
																					)}
																				</div>
																			</Col>
																		</Row>
																		<div className="mt-4 mb-4">
																			<Button
																				type="submit"
																				className="px-5"
																				color="primary">
																				Update
																			</Button>
																		</div>
																	</Form>
																</div>
															</div>
														</div>
													</div>
												</Container>
											</div>
										</Col>
									</Row>
								</Col>
							</Row>
						</Container>
					</div>
				</div>
			</HorizontalLayout>
		</React.Fragment>
	)
}
export default withRouter(UserProfile)
