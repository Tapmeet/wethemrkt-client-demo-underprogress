import React, { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { Col, ListGroup, ListGroupItem, Row } from "reactstrap"
import axiosHttpMiddelware from "common/axiosHttpMiddelware"
import Toaster from "../../components/Common/Toaster"
import { withContext } from "../../context/index"
import Skeleton from "react-loading-skeleton"

const UserKudos = ({ symbolfullname, props }) => {
	const history = useHistory()
	const [userList, setUserList] = useState([])
	const [time, setTime] = useState("")
	const [type, setType] = useState("")
	useEffect(() => {
		getDataList()
	}, [])
	const getDataList = (time = "", type = "") => {
		setTime(time)
		setType(type)
		setUserList([])
		axiosHttpMiddelware
			.get("getTrendingUsers", {
				params: {
					time: time,
					type: type,
				},
			})
			.then(response => {
				if (
					response.status == 200 &&
					response.data.userResponse !== undefined &&
					response.data.userResponse.length > 0
				) {
					setUserList(response.data.userResponse)
				} else {
					setUserList([])
					Toaster.errorToaster("Something went wrong while fetching userlist")
				}
			})
			.catch(err => {
				setUserList([])
				Toaster.errorToaster("Something went wrong while fetching userlist")
			})
	}
	const userprofile = (username, userid) => {
		history.push({ pathname: `/viewprofile/${username}`, state: userid })
	}
	const users = userListData => {
		if (userListData && userListData.length > 0) {
			return userListData.map((user, index) => {
				return (
					user.totalvotes > 0 && (
						<div key={index}>
							<ListGroupItem className="fl-list-group treding-userbox">
								<div className="left-list">
									<span className="number-icnbox">{index + 1}</span>
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
									<span
										role="button"
										onClick={e => userprofile(user.username, user.id)}>
										{user.username}
									</span>
								</div>
								<div className="right-list">
									<span className="coin-icon">
										<i className="bx bx-dollar-circle dollar-icon-uesr"></i>
									</span>
									{user.totalvotes > 0 ? user.totalvotes : 0}
								</div>
							</ListGroupItem>
						</div>
					)
				)
			})
		}
		return null
	}
	return (
		<div className="white-boxpart rs-box">
			<h4 className="rs-title">Top 10 Users By Kudos Coins Awarded</h4>
			<div className="search-filter">
				<div className="sf-row">
					<div className="sf-group sf-6">
						<select
							className="form-select-sm filter-select filter-control"
							onChange={e => {
								getDataList(e.target.value, type)
							}}>
							<option value="">All time</option>
							<option value="24 hour">1 day</option>
							<option value="7 day">This Week</option>
							<option value="30 day">This Month</option>
							<option value="1 year">This Year</option>
						</select>
					</div>
					<div className="sf-group sf-6">
						<select
							className="form-select-sm filter-select filter-control"
							onChange={e => {
								getDataList(time, e.target.value)
							}}>
							<option value="">All</option>
							<option value="Technical">Technical</option>
							<option value="Fundamental">Fundamental</option>
						</select>
					</div>
				</div>
			</div>
			<div className="filter-list main-filterlist">
				<ListGroup>
					<ListGroupItem className="fl-list-group top-flg">
						<div className="left-list">
							<b>USER</b>
						</div>
						<div className="right-list">
							<b>KUDOS COINS</b>
						</div>
					</ListGroupItem>
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

export default UserKudos
