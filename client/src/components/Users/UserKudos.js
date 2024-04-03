import React, { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { Col, ListGroup, ListGroupItem, Row } from "reactstrap"
import axiosHttpMiddelware from "common/axiosHttpMiddelware"
import Toaster from "../Common/Toaster"
import { withContext } from "../../context/index"
import Skeleton from "react-loading-skeleton"

const UserKudos = ({ symbolfullname, props }) => {
	const history = useHistory()
	const [userList, setUserList] = useState([])
	const [postSymbolList, setPostSymbolList] = useState([])
	const [symbol, setSymbol] = useState(null)
	const [time, setTime] = useState(1)
	const [loading, setLoading] = useState(false)
	useEffect(() => {
		getDataList(symbol, time)
	}, [symbol, time])
	useEffect(() => {
		getDataList(props.match.params.symbol)
		setSymbol(props.match.params.symbol)
	}, [props?.match?.params?.symbol])
	const getDataList = (symbolName, timeFrame) => {
		// show loader
		setLoading(true)
		axiosHttpMiddelware
			.get("getTrendingKudosCoinUsers", {
				params: {
					symbolname: symbolName,
					timeFrame: timeFrame,
				},
			})
			.then(response => {
				if (
					response.status == 200 &&
					response.data.userResponse !== undefined &&
					response.data.userResponse.length > 0
				) {
					setUserList(response.data.userResponse)
					// hide loader
					setLoading(false)
				} else {
					setUserList([])
					Toaster.errorToaster("Something went wrong while fetching userlist")
					// hide loader
					setLoading(false)
				}
			})
			.catch(err => {
				setUserList([])
				Toaster.errorToaster("Something went wrong while fetching userlist")
				// hide loader
				setLoading(false)
			})
	}
	const userprofile = (username, userid) => {
		history.push({ pathname: `/viewprofile/${username}`, state: userid })
	}
	useEffect(() => {
		axiosHttpMiddelware
			.get("getPostSymbolList")
			.then(response => {
				if (
					response.status == 200 &&
					response.data.symbolResponse !== undefined &&
					response.data.symbolResponse.length > 0
				) {
					setPostSymbolList(response.data.symbolResponse)
				} else {
					setPostSymbolList([])
				}
			})
			.catch(err => {
				setPostSymbolList([])
			})
	}, [])

	const selectSymblolFilter = e => {
		if (e.target.value == "all") {
			setSymbol(null)
		} else {
			setSymbol(e.target.value.replace("$", ""))
		}
	}
	const selectTimeFilter = e => {
		setTime(e.target.value)
	}
	const users = userListData => {
		if (userListData && userListData.length > 0) {
			let counter = 0
			return userListData.slice(0, 5).map((user, index) => {
				if (user.kudoscoin == 0 || user.kudoscoin == null) {
					return null
				}
				counter++
				return (
					<ListGroupItem key={index} className="fl-list-group treding-userbox">
						<Col xs="9">
							<div
								className="left-list"
								role="button"
								onClick={e => userprofile(user.username, user.id)}>
								<span>{counter}</span>
								<div>
									{user.profilephoto ? (
										<img
											className="rounded-circle header-profile-user"
											src={user.profilephoto}
											alt="Header Avatar"
										/>
									) : (
										<div
											className="d-flex align-items-center justify-content-center circle-shadow-a bg-gray"
											style={{
												height: 36,
												width: 36,
											}}>
											<i className="rounded-circle bx bx-user mt-2" />
										</div>
									)}
								</div>
								&nbsp;
								<div className="text-break m-1">{user.username}</div>
							</div>
						</Col>
						<Col xs="3">
							<div className="right-list d-flex align-items-center">
								<i className="bx bx-dollar-circle dollar-icon-uesr"></i> &nbsp;
								{user.kudoscoin ? user.kudoscoin : 0}
							</div>
						</Col>
					</ListGroupItem>
				)
			})
		}
		return null
	}
	return (
		<div className="rs-box">
			<h4 className="rs-title">Trending Users </h4>
			<div className="filter-list">
				<ListGroup>
					{postSymbolList.length > 0 &&
						props?.match?.params?.symbol == null && (
							<ListGroupItem className="fl-list-group top-flg">
								<Col xs="6">
									<select
										style={{ width: "100%" }}
										className="form-select-sm filter-select"
										onChange={e => selectSymblolFilter(e)}>
										<option value="all">All</option>
										{postSymbolList.map((symbol, index) => {
											return (
												<option key={index} value={symbol.symbolname}>
													{symbol.symbolname}
												</option>
											)
										})}
									</select>
								</Col>
								<Col xs="6">
									<select
										style={{ width: "100%" }}
										className="form-select-sm filter-select"
										onChange={e => selectTimeFilter(e)}>
										<option value="1">24 Hrs</option>
										<option value="7">7 Days</option>
										<option value="30">30 Days</option>
										<option value="365">1 Year</option>
									</select>{" "}
								</Col>
							</ListGroupItem>
						)}
					{postSymbolList.length > 0 &&
						props?.match?.params?.symbol == null && (
							<ListGroupItem className="fl-list-group top-flg">
								<div className="left-list">User</div>
								<div className="right-list">Coins Awarded</div>
							</ListGroupItem>
						)}
					{symbolfullname && (
						<ListGroupItem className="fl-list-group top-flg">
							<div className="left-list"></div>
							<div className="right-list">&nbsp;-&nbsp; {symbolfullname}</div>
						</ListGroupItem>
					)}
					{loading && (
						<div className="d-flex justify-content-center">
							<div className="spinner-border" role="status">
								<span className="visually-hidden">Loading...</span>
							</div>
						</div>
					)}
					{userList.length == 0 ? (
						<Skeleton count={10} />
					) : (
						<>{users(userList)}</>
					)}
				</ListGroup>
			</div>
		</div>
	)
}

export default withContext(
	([
		{
			app: { symbolfullname },
		},
	]) => ({
		symbolfullname: symbolfullname,
	}),
	UserKudos
)
