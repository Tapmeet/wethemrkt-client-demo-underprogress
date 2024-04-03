import { useEffect, useState } from "react"
import {
	TabContent,
	TabPane,
	Nav,
	NavItem,
	NavLink,
	Col,
	ListGroup,
	ListGroupItem,
	Row,
	FormGroup,
	Input,
} from "reactstrap"
import axiosAuthHttpMiddelware from "../../common/axiosAuthHttpMiddelware"
import { useHistory } from "react-router-dom"
import classnames from "classnames"
import "./ranking.scss"
const Ranking = () => {
	const history = useHistory()
	const [trendingSymbols, setTrendingSymbols] = useState()
	const [kudosCoinsSymbols, setKudosCoinsSymbols] = useState()
	const [sentimentSymbols, setSentimentSymbols] = useState()
	const [activeTab, setActiveTab] = useState("1")
	const [techFund, setTechFund] = useState("All")
	const [filterTime, setFilterTime] = useState("1")
	const [stocksIndexes, setStocksIndexes] = useState("Stocks")
	const [sortUp, setSortUp] = useState("1")
	const [loading, setLoading] = useState(false)
	const [tooltipData, setTooltipData] = useState(null)
	useEffect(() => {
		getTrendingSymbol()
	}, [techFund, filterTime])
	const symboal = params => {
		history.push(`/feed/${params}`)
	}
	const getTrendingSymbol = async () => {
		setLoading(true)
		axiosAuthHttpMiddelware
			.get("/getSymbolList", {
				params: {
					techFund: techFund,
					time: filterTime,
				},
			})
			.then(response => {
				if (response.status == 200) {
					setTrendingSymbols(response.data.symbolResponse)
					setKudosCoinsSymbols(response.data.kudosCoinsResponse)
					setSentimentSymbols(response.data.sentimentResponse)
					setLoading(false)
				} else {
					setTrendingSymbols([])
					setKudosCoinsSymbols([])
					setSentimentSymbols([])
					setLoading(false)
				}
			})
			.catch(err => {
				console.log(err)
				setLoading(false)
			})
	}

	const toggle = tab => {
		if (activeTab !== tab) {
			setActiveTab(tab)
		}
	}

	const symbols = symbolsList => {
		if (symbolsList && symbolsList.length > 0) {
			let tab1Counter = 0
			let tab2Counter = 0
			let tab3Counter = 0
			return symbolsList.slice(0, 5).map((symbol, index) => {
				let show = false
				if (stocksIndexes == "Stocks") {
					if (!symbol.symbolname.includes("^")) {
						show = true
					} else {
						show = false
					}
				} else {
					if (symbol.symbolname.includes("^")) {
						show = true
					} else {
						show = false
					}
				}
				if (activeTab === "1" && show) {
					tab1Counter = tab1Counter + 1
				}
				if (activeTab === "2" && show) {
					tab2Counter = tab2Counter + 1
				}
				if (activeTab === "3" && show) {
					tab3Counter = tab3Counter + 1
				}
				return (
					show && (
						<div key={index}>
							<ListGroup>
								<ListGroupItem
									className="ranking-list fl-list-group"
									role="button"
									onClick={() => symboal(symbol.symbolname.replace("$", ""))}
									// on hover tooltip
									style={{ cursor: "pointer" }}
									onMouseEnter={() => {
										document.getElementById(
											"SymbolTooltip" + index
										).style.display = "block"
										setTooltipData(null)
										axiosAuthHttpMiddelware
											.post("/symbolQuoteSummary", {
												symbolname: symbol.symbolname.replace("$", ""),
												modules: "assetProfile",
											})
											.then(response => {
												if (
													response.status == 200 &&
													response.data.symbolResponse[0]
												) {
													setTooltipData(
														response.data.symbolResponse[0].assetProfile
													)
												}
											})
											.catch(err => {
												console.log(err)
											})
										axiosAuthHttpMiddelware
											.post("/symbolQuoteSummary", {
												symbolname: symbol.symbolname.replace("$", ""),
												modules: "price",
											})
											.then(response => {
												if (response.status == 200) {
													setTooltipData({
														...tooltipData,
														...response.data.symbolResponse[0].price,
													})
												}
											})
											.catch(err => {
												console.log(err)
											})
									}}
									onMouseLeave={() => {
										document.getElementById(
											"SymbolTooltip" + index
										).style.display = "none"
										setTooltipData(null)
									}}>
									<div
										id={"SymbolTooltip" + index}
										className="symbol-tooltip"
										style={{ display: "none" }}>
										<div className="symbol-tooltip-content">
											<div className="symbol-tooltip-title">
												<b>{symbol.symbolname}</b>
											</div>
											<div className="symbol-tooltip-body">
												{tooltipData ? (
													<>
														<div className="symbol-tooltip-body-title">
															{tooltipData.shortName}
														</div>
														<div className="symbol-tooltip-body-content">
															<div className="symbol-tooltip-body-content-title">
																{tooltipData.industry}
															</div>
														</div>
													</>
												) : (
													<div className="d-flex justify-content-center">
														<div className="spinner-border" role="status">
															<span className="visually-hidden">
																Loading...
															</span>
														</div>
													</div>
												)}
											</div>
										</div>
									</div>

									{activeTab === "1" && (
										<div className="left-list">
											<span>{tab1Counter}</span> <b>{symbol.symbolname}</b>
										</div>
									)}
									{activeTab === "2" && (
										<div className="left-list">
											<span>{tab2Counter}</span> <b>{symbol.symbolname}</b>
										</div>
									)}
									{activeTab === "3" && (
										<div className="left-list">
											<span>{tab3Counter}</span> <b>{symbol.symbolname}</b>
										</div>
									)}
									{activeTab === "1" && (
										<div className="right-list">{symbol.symbolcount}</div>
									)}
									{activeTab === "2" && (
										<div className="right-list">{symbol.kudoscoins}</div>
									)}
									{activeTab === "3" && (
										<div className="right-list">
											{symbol.sentimentvalue >= 0 ? (
												symbol.sentimentvalue
											) : (
												<div style={{ color: "#bb2d3b" }}>
													{symbol.sentimentvalue}
												</div>
											)}
										</div>
									)}
								</ListGroupItem>
							</ListGroup>
						</div>
					)
				)
			})
		}
		return null
	}
	return (
		<>
			<div className="rs-box">
				<h4 className="rs-title">Ranking</h4>
				<div className="filter-list">
					<ListGroup>
						<Row className="mb-2">
							<Col>
								<FormGroup>
									<Input
										type="select"
										name="tecFundSelect"
										id="tecFundSelect"
										onChange={e => setTechFund(`${e.target.value}`)}>
										<option>All</option>
										<option>Technical</option>
										<option>Fundamental</option>
									</Input>
								</FormGroup>
							</Col>
							<Col>
								<FormGroup>
									<Input
										type="select"
										name="filterTime"
										id="filterTimeSelect"
										onChange={e => setFilterTime(`${e.target.value}`)}>
										<option value="1">24hrs</option>
										<option value="7">7 days</option>
										<option value="30">30 days</option>
										<option value="365">1 year</option>
									</Input>
								</FormGroup>
							</Col>
						</Row>
						<Nav tabs>
							<NavItem style={{ fontSize: "11px" }}>
								<NavLink
									className={classnames({ active: activeTab === "1" })}
									onClick={() => {
										toggle("1")
									}}>
									Trending
								</NavLink>
							</NavItem>
							<NavItem style={{ fontSize: "11px" }}>
								<NavLink
									className={classnames({ active: activeTab === "2" })}
									onClick={() => {
										toggle("2")
									}}>
									Kudos Coins
								</NavLink>
							</NavItem>
							<NavItem style={{ fontSize: "11px" }}>
								<NavLink
									className={classnames({ active: activeTab === "3" })}
									onClick={() => {
										toggle("3")
									}}>
									Sentiment
								</NavLink>
							</NavItem>
						</Nav>

						<TabContent activeTab={activeTab} className="mt-2">
							{loading && (
								<div className="d-flex justify-content-center">
									<div className="spinner-border" role="status">
										<span className="visually-hidden">Loading...</span>
									</div>
								</div>
							)}
							{!loading && (
								<>
									<TabPane tabId="1">
										<ListGroupItem className="fl-list-group top-flg">
											<div className="left-list">
												<FormGroup>
													<Input
														type="select"
														name="tecFundSelect"
														className="form-select-sm filter-select"
														id="tecFundSelect"
														onChange={e =>
															setStocksIndexes(`${e.target.value}`)
														}
														value={stocksIndexes}>
														<option>Stocks</option>
														<option>Indexes</option>
													</Input>
												</FormGroup>
											</div>
											<div className="right-list">Current Period</div>
										</ListGroupItem>
										{symbols(trendingSymbols)}
									</TabPane>
									<TabPane tabId="2">
										<ListGroupItem className="fl-list-group top-flg">
											<div className="left-list">
												<FormGroup>
													<Input
														type="select"
														className="form-select-sm filter-select"
														name="tecFundSelect"
														id="tecFundSelect"
														onChange={e =>
															setStocksIndexes(`${e.target.value}`)
														}
														value={stocksIndexes}>
														<option>Stocks</option>
														<option>Indexes</option>
													</Input>
												</FormGroup>
											</div>
											<div className="right-list">Current Period</div>
										</ListGroupItem>
										{symbols(kudosCoinsSymbols)}
									</TabPane>
									<TabPane tabId="3">
										<ListGroupItem className="fl-list-group top-flg">
											<div className="left-list">
												<FormGroup>
													<Input
														type="select"
														className="form-select-sm filter-select"
														name="tecFundSelect"
														id="tecFundSelect"
														onChange={e =>
															setStocksIndexes(`${e.target.value}`)
														}
														value={stocksIndexes}>
														<option>Stocks</option>
														<option>Indexes</option>
													</Input>
												</FormGroup>
											</div>
											<div
												className="right-list flex cursor-pointer"
												onClick={() => {
													setSortUp(!sortUp)
												}}>
												Current Period
												{/** add up and down arrow for sorting */}
												{sortUp ? (
													<i class="bx bx-up-arrow-alt"></i>
												) : (
													<i class="bx bx-down-arrow-alt"></i>
												)}
											</div>
										</ListGroupItem>
										{symbols(sentimentSymbols)}
									</TabPane>
								</>
							)}
						</TabContent>
					</ListGroup>
				</div>
			</div>
		</>
	)
}

export default Ranking
