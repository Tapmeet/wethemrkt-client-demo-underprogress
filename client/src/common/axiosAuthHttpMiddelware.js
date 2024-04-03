import axios from "axios"

function getAccessToken() {
	const user = JSON.parse(localStorage.getItem("user"))

	if (user && user.accessToken) {
		return user.accessToken
	}
}

const axiosInstance = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
	headers: {
		"Content-type": "application/json",
		Authorization: `Bearer ` + getAccessToken(),
	},
})

axiosInstance.interceptors.response.use(
	response => {
		return response
	},
	error => {
		if (error.response.status === 401) {
			localStorage.removeItem("user")
			window.location.href = "/logout"
		}
		return Promise.reject(error)
	}
)

export default axiosInstance
