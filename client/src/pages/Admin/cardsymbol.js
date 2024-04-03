import React, { useState, useEffect } from "react"
import { Col, Card, CardBody } from "reactstrap"
import { Link } from "react-router-dom"
import axiosAuthHttpMiddelware from "common/axiosAuthHttpMiddelware"
const CardSymbol = () => {
	const [symbollist, setSymbolist] = useState([])
	useEffect(() => {
		getSymbolCountByPost()
	}, [])
	async function getSymbolCountByPost(search) {
		if (localStorage.getItem("user")) {
			axiosAuthHttpMiddelware
				.get("getSymbolList")
				.then(response => {
					if (
						response.status == 200 &&
						response.data.symbolResponse !== undefined &&
						response.data.symbolResponse.length > 0
					) {
						setSymbolist(response.data.symbolResponse)
					} else {
						setuserlist([])
						Toaster.errorToaster("Something went wrong while fetching userlist")
					}
				})
				.catch(err => {
					setuserlist([])
					Toaster.errorToaster("Something went wrong while fetching userlist")
				})
		}
	}
	function handleSearch(e) {
		if (e.target.value != "") {
			setSymbolist([])
			getSymbolCountByPost(e.target.value)
		} else {
			getSymbolCountByPost()
		}
	}
	return (
		<React.Fragment>
			<Card>
				<CardBody>
					<div className="d-flex">
						<div className="me-2">
							<h5 className="card-title m-0">Popular Symbol </h5>
						</div>
					</div>
					<div className="table-responsive popular-symbol-scroll">
						<form className="app-search search-btn d-none d-lg-block">
							<div className="position-relative">
								<input
									type="text"
									className="form-control"
									placeholder={"Search..."}
									onChange={e => handleSearch(e)}
								/>
								<span className="bx bx-search-alt" />
							</div>
						</form>
						<table className="table align-middle table-nowrap mb-0">
							<thead>
								<tr>
									<th scope="col">Symbol</th>
									<th scope="col" className="text-center">
										Post
									</th>
								</tr>
							</thead>
							<tbody>
								{symbollist.length > 0
									? symbollist.map((symbol, key) => (
											<tr key={key}>
												<td>
													<h5 className="font-size-13 text-truncate mb-1">
														<Link
															to={"/feed/" + symbol.symbolname}
															className="text-dark">
															<b>{symbol.symbolname}</b>
														</Link>
													</h5>
												</td>
												<td className="text-center">
													{symbol.symbolcount || 0}
												</td>
											</tr>
									  ))
									: null}
							</tbody>
						</table>
					</div>
				</CardBody>
			</Card>
		</React.Fragment>
	)
}
export default CardSymbol
