import React, { useState, useEffect } from "react"
import { Modal } from "reactstrap"
import { useHistory } from "react-router-dom"
import axiosHttpMiddelware from "common/axiosHttpMiddelware"
import toastr from "toastr"
import { Form, Field } from "@availity/form"
import "../../../assets/scss/custom/wethemkrt/common.scss"
import "toastr/build/toastr.min.css"
import Cookies from "universal-cookie"
import GoogleSignin from "./GoogleSignin"
const cookies = new Cookies()
const Login = props => {
	const history = useHistory()
	const [modal_login, setmodal_login] = useState(false)
	const [loginData, setLoginData] = useState(null)
	useEffect(() => {
		setmodal_login(props.dataParentToChild)
		removeBodyCss()
	}, [])
	function handleLoginChange(issignup) {
		setmodal_login(false)
		props.onChange(false, issignup)
	}
	const handleLogin = values => {
		if (values.otp == loginData.otp) {
			onLogin(loginData)
		} else {
			toastr.error("Invalid OTP.", "Error")
		}
	}
	const onLogin = data => {
		localStorage.setItem("user", JSON.stringify(data))
		var expdate = new Date()
		expdate.setDate(expdate.getDate() + 2)
		cookies.set("otp", data.otp, { path: "/", expires: expdate })
		setTimeout(() => {
			window.location.href = "/feed"
		}, 1000)
	}
	function handlePasswordChange(ispasswordC) {
		setmodal_login(false)
		props.onPasswordChange(false, ispasswordC)
	}
	function removeBodyCss() {
		document.body.classList.add("no_padding")
	}
	const handleValidSubmit = values => {
		let passwordRegex = new RegExp(
			"^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{6,10}$"
		)
		if (passwordRegex.test(values.password) !== false) {
			toastr.warning(
				"Minimum six and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character",
				"Password requirenment"
			)
		}
		axiosHttpMiddelware
			.post("auth/signin", {
				email: values.email,
				password: values.password,
				otp: cookies.get("otp"),
			})
			.then(response => {
				if (response.data.accessToken) {
					if (cookies.get("otp") == response.data.otp) {
						onLogin(response.data)
					} else {
						setLoginData(response.data)
						document.getElementById("verificationCode").value = ""
						setTimeout(() => {
							document.getElementById("verificationCode").value = ""
							document.getElementById("verificationCode").focus()
						}, 500)
					}
				}
			})
			.catch(err => {
				console.log(err)
				if (err.response) {
					if (err.response.status === 401) {
						toastr.error("Invalid Credentials.", "Error")
						handleLoginChange()
					} else if (err.response.status === 404) {
						toastr.error("Please signup.", "Error")
					} else {
						toastr.error("Something went wrong.", "Error")
					}
				} else {
					toastr.error(err, "Error")
				}
				setmodal_login(modal_login)
			})
	}
	return (
		<React.Fragment>
			<Modal isOpen={modal_login} fade={false}>
				<div className="modal-header border-none">
					<button
						type="button"
						onClick={() => {
							handleLoginChange(false)
						}}
						className="close"
						data-dismiss="modal"
						aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div className="modal-body pt-0">
					<h5 className="modal-title mb-2 login-text" id="myModalLabel">
						{" "}
						Login{" "}
					</h5>
					<div className=" d-flex justify-content-center">
						<span>Don't have an account?</span>
						<span
							color="primary"
							className="sign-up-color mx-1"
							onClick={() => {
								handleLoginChange(true)
							}}>
							{" "}
							Sign Up{" "}
						</span>
					</div>
					{loginData ? (
						<Form
							className="form-horizontal pt-4"
							onSubmit={value => {
								handleLogin(value)
							}}>
							<div className="mb-3">
								<Field
									id="verificationCode"
									name="otp"
									label="Verification Code"
									className="form-control"
									autoComplete="off"
									placeholder="Enter Verification Code"
									type="password"
									required
								/>
							</div>
							<div className="modal-footer justify-content-start p-0 login-group">
								<button type="submit" className="btn btn-primary px-4">
									Confirm
								</button>
							</div>
						</Form>
					) : (
						<Form
							initialValues={{
								email: "",
								password: "",
							}}
							className="form-horizontal pt-4"
							onSubmit={value => {
								handleValidSubmit(value)
							}}>
							<div className="mb-3">
								<Field
									name="email"
									label="Email"
									className="form-control"
									autoComplete="on"
									placeholder="Enter email"
									type="email"
									required
								/>
							</div>
							<div className="mb-3">
								<Field
									name="password"
									label="Password"
									type="password"
									autoComplete="on"
									placeholder="Enter Password"
									required
								/>
							</div>
							<div className="modal-footer justify-content-start p-0 login-group">
								<GoogleSignin />
								<button
									type="submit"
									className="btn px-4"
									style={{ padding: 4 }}>
									Login
								</button>
								or
								<span
									role="button"
									color="primary"
									className="sign-up-color mx-1"
									onClick={() => {
										handlePasswordChange(true)
									}}>
									Forgot Password
								</span>
							</div>
						</Form>
					)}
				</div>
			</Modal>
		</React.Fragment>
	)
}
export default Login
