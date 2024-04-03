import PropTypes from "prop-types"
import React, { useState, useEffect } from "react"
import { Container, Progress } from "reactstrap"
import { withRouter } from "react-router-dom"
import moment from "moment"
import { useHistory } from "react-router-dom"
import axiosHttpMiddelware from "common/axiosHttpMiddelware"
import axiosAuthHttpMiddelware from "common/axiosAuthHttpMiddelware"
import Toaster from "../../Common/Toaster"
const ViewUserProfile = props => {
	const [username, setUsername] = useState(null)
	const [authUser, setAuthUser] = useState(null)
	const fileInputRef = React.useRef()
	useEffect(() => {
		if (
			props.match.params !== undefined &&
			props.match.params.username !== undefined
		) {
			setUsername(props.match.params.username)
		}
		if (localStorage.getItem("user")) {
			const obj = JSON.parse(localStorage.getItem("user"))
			setAuthUser(obj)
			if (obj.username == props.match.params.username) {
				setisEditProfile(true)
			} else {
				setisEditProfile(false)
			}
		}
	}, [props.match.params.username])
	const history = useHistory()
	const [searchuserInfo, setsearchuserInfo] = useState({
		id: "",
		email: "",
		name: "",
		about: "",
		preview: "",
		raw: "",
		isadmin: "",
		createddate: "",
		tradingtag: [],
		coverphoto: "",
	})
	const [updateClick, setUpdateClick] = useState(false)
	const [isEditProfile, setisEditProfile] = useState(false)
	const [kudosCoin, setkudosCoin] = useState({ coinCount: 0, progress: "0" })
	useEffect(() => {
		getUsers()
		getMentorInfo()
	}, [username])
	async function getUsers() {
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
						setsearchuserInfo({
							id: userResponse.data.userResponse.id,
							name: userResponse.data.userResponse.username,
							email: userResponse.data.userResponse.email,
							about: userResponse.data.userResponse.about,
							raw: userResponse.data.userResponse.profilephoto,
							isadmin: userResponse.data.userResponse.isadmin,
							createddate: userResponse.data.userResponse.createdAt,
							preview: userResponse.data.userResponse.profilephoto,
							tradingtag:
								userResponse.data.userResponse.tradingstyles != null
									? userResponse.data.userResponse.tradingstyles.split(",")
									: userResponse.data.userResponse.tradingstyles,
							follower: userResponse.data.userResponse.follower,
							following: userResponse.data.userResponse.following,
							coverphoto: userResponse.data.userResponse.coverphoto,
						})
						fetchKudosCoin(userResponse.data.userResponse.id)
					}
				})
				.catch(err => {
					Toaster.errorToaster("Could not fetch user info", "Error")
				})
		}
	}
	async function getMentorInfo() {
		if (localStorage.getItem("user")) {
			const obj = JSON.parse(localStorage.getItem("user"))
		}
	}
	function editProfile(params) {
		history.push(`/profile/${params}`)
	}

	// function to upload image to s3 bucket
	const uploadToStorage = async file => {
		// Set your Linode Object Storage credentials
		const linodeConfig = {
			accessKeyId: process.env.REACT_APP_FILE_STORAGE_ACCESS_KEY,
			secretAccessKey: process.env.REACT_APP_FILE_STORAGE_SECRET_KEY,
			region: process.env.REACT_APP_FILE_STORAGE_REGION,
			endpoint: process.env.REACT_APP_FILE_STORAGE_ENDPOINT,
		}

		// Create an S3 client
		const s3 = new AWS.S3(linodeConfig)

		// Specify the bucket name and the key (path) where you want to upload the image
		const bucketName = process.env.REACT_APP_FILE_STORAGE_BUCKET_NAME

		// get the file extension
		const fileExtension = file.name.split(".").pop()
		// create a unique file name for the image
		const key = `${
			process.env.REACT_APP_OTHER_IMAGE_FOLDER
		}/${Date.now().toString()}.${fileExtension}`

		// Read the file content
		const fileContent = await file.arrayBuffer()

		// Set the parameters for the S3 upload
		const params = {
			Bucket: bucketName,
			Key: key,
			Body: Buffer.from(fileContent),
		}

		// set the access control headers
		params.ACL = "public-read"

		try {
			// Upload the image to Linode Object Storage
			const data = await s3.upload(params).promise()
			return data.Location
		} catch (error) {
			console.error("Error uploading image:", error)
			return false
		}
	}

	function updateCoverPhoto(file) {
		if (localStorage.getItem("user")) {
			axiosAuthHttpMiddelware
				.post("/updateCoverPhoto", file)
				.then(response => {
					Toaster.successToaster(response.data.message, "Success!")
					getUsers()
				})
				.catch(err => {
					console.log(err)
					Toaster.errorToaster("Could not update cover photo", "Error")
				})
		}
	}

	function showOpenFile() {
		fileInputRef.current.click()
	}

	const fetchKudosCoin = userId => {
		setkudosCoin({ coinCount: 0, progress: "0" })

		axiosHttpMiddelware
			.post("getKudosCountByUser", { userid: userId })
			.then(response => {
				if (
					response.status == 200 &&
					response.data.kudosCoinResponse !== undefined
				) {
					setkudosCoin({
						...kudosCoin,
						coinCount: response.data.kudosCoinResponse.kudoscoin,
						progress: response.data.kudosCoinResponse.progress,
					})
				}
			})
			.catch(err => {
				console.log(err)
				toastr.error("Error fetching kudoscoin.", "Error")
			})
	}
	return (
		<React.Fragment>
			<div class="white-boxpart rs-box">
				<div class="profile-wrapper">
					<div class="pw-banner">
						{searchuserInfo.coverphoto ? (
							<img src={searchuserInfo.coverphoto} />
						) : (
							<img src="https://s.yimg.com/ny/api/res/1.2/vEVSkt.K2ATKMnogEB.eWg--/YXBwaWQ9aGlnaGxhbmRlcjt3PTEyMDA7aD03OTI7Y2Y9d2VicA--/https://media.zenfs.com/en/ap_finance_articles_694/2b9a03a53108b83c3dadf1870990e240" />
						)}
						{isEditProfile && (
							<div class="edit1-btn">
								<input
									ref={fileInputRef}
									type="file"
									onChange={e => {
										// upload the file to s3 bucket
										uploadToStorage(e.target.files[0]).then(url => {
											// update the cover photo
											updateCoverPhoto({
												coverphoto: url,
												userId: authUser.id,
											})
										})
									}}
								/>
								<a href="javascript:void(0)" onClick={showOpenFile}>
									<i class="bx bxs-edit"></i>
								</a>
							</div>
						)}
					</div>
					<div class="pw-userinfo">
						<div class="pw-user-profile">
							{searchuserInfo.raw ? (
								<img src={searchuserInfo.raw} alt="" className="profile-img" />
							) : (
								<i
									className="rounded-circle bx bx-user align-middle"
									style={{ fontSize: 32, background: "#f6f0f0", padding: 20 }}
								/>
							)}
						</div>
						<div class="pw-user-info">
							<h5>{searchuserInfo.name}</h5>
							<div className="d-flex">
								<div class="follow-list">
									<ul>
										<li>
											<label>
												{searchuserInfo.following &&
													searchuserInfo.following.length}
											</label>
											Following
										</li>
										<li>
											<label>
												{searchuserInfo.follower &&
													searchuserInfo.follower.length}
											</label>
											Followers
										</li>
									</ul>
								</div>
								<div className="ps-3 ms-5">
									<Progress
										className="top-progress"
										color="primary"
										value={100 - kudosCoin.progress}
									/>
									{kudosCoin.progress < 50 ? (
										<>Top {kudosCoin.progress}% of users</>
									) : (
										<>
											Progress {100 - kudosCoin.progress}% based on <br />
											kudos coins
										</>
									)}
								</div>
							</div>
						</div>
						<div class="infoedit-btn">
							{isEditProfile ? (
								<a
									href="javascript:void(0)"
									onClick={e => editProfile(searchuserInfo.name)}
									className="edit-btn">
									{" "}
									<i class="bx bxs-edit"></i>Edit
								</a>
							) : (
								""
							)}
						</div>
					</div>
					<div class="pw-extrainfo">
						<div class="lft-side">
							<p>Joined {moment(searchuserInfo.createddate).format("LL")}</p>
							<p>{searchuserInfo.about}</p>
						</div>
						<div class="rt-side">
							<span class="coin-icon">
								<i class="bx bx-dollar-circle dollar-icon-uesr"></i>
								{kudosCoin.coinCount}
							</span>
							<h6>Kudos Coins</h6>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	)
}
ViewUserProfile.propTypes = {
	editProfile: PropTypes.func,
	error: PropTypes.any,
	success: PropTypes.any,
}
export default withRouter(ViewUserProfile)
