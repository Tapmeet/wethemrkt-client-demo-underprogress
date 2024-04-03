import React, { useEffect, useState, useRef } from "react"
import { withContext } from "../../context/index"
import { Col, Row, Nav, NavItem, NavLink } from "reactstrap"
import { format } from "d3-format"
import { timeFormat } from "d3-time-format"
import {
	elderRay,
	ema,
	discontinuousTimeScaleProviderBuilder,
	Chart,
	ChartCanvas,
	CurrentCoordinate,
	BarSeries,
	CandlestickSeries,
	LineSeries,
	OHLCTooltip,
	lastVisibleItemBasedZoomAnchor,
	XAxis,
	YAxis,
	CrossHairCursor,
	EdgeIndicator,
	MouseCoordinateX,
	MouseCoordinateY,
} from "react-financial-charts"
import bearImage from "../../assets/images/bear.png"
import bullImage from "../../assets/images/bull.png"
import moment from "moment"
import { useHistory } from "react-router-dom"
import { Progress } from "reactstrap"
import classnames from "classnames"
import toaster from "../../components/Common/Toaster"
import "../../assets/scss/custom/wethemkrt/common.scss"
import "../../assets/scss/custom/wethemkrt/symbolchart.scss"
import Message from "../../components/CommonForBoth/PostOptions/Message"
import Login from "../../components/CommonForBoth/AuthenticationModel/Login"
import Signup from "../../components/CommonForBoth/AuthenticationModel/Signup"
import ImageModel from "../../components/Common/ImageModel"
import Retweet from "../../components/Common/RetweetModal"
import parse from "html-react-parser"
import Retweetcard from "../../components/Common/RetweetCard"
import axiosHttpMiddelware from "common/axiosHttpMiddelware"
import Toaster from "../../components/Common/Toaster"
import axiosAuthHttpMiddelware from "common/axiosAuthHttpMiddelware"
import { appWatchloadSwitch as appWatchloadSwitchAction } from "../../store/actions/appActions"
import { setSymbolFullName as setSymbolFullNameAction } from "../../store/actions/appActions"
const SymbolChart = ({
	watchload,
	appWatchloadSwitch,
	setSymbolFullNameAction,
	...props
}) => {
	const history = useHistory()
	const [chartData, setchartData] = useState([])
	const [symboleName, setSymboleName] = useState("")
	const [symbolpostData, setsymbolpostData] = useState([])
	const [symbolOption, setsymbolOption] = useState("")
	const [symbolQuote, setsymbolQuote] = useState("")
	const [iswatch, setiswatch] = useState(false)
	const [checkWatch, setCheckWatch] = useState(false)
	const [customActiveTab, setcustomActiveTab] = useState("1")
	const [countUpdate, setcountUpdate] = useState(false)
	const [modal_message, setmodal_message] = useState(false)
	const [messageData, setmessageData] = useState("")
	const [isLogin, setIsLogin] = useState(false)
	const [modal_backdroplogin, setmodal_backdroplogin] = useState(false)
	const [modal_backdropsignup, setmodal_backdropsignup] = useState(false)
	const [modal_imageview, setmodal_imageview] = useState(false)
	const [imageViewData, setimageViewData] = useState("")
	const [modal_retweet, setmodal_retweet] = useState(false)
	const [retweetData, setretweetData] = useState("")
	const [loginUserID, setloginUserID] = useState(0)
	const [kudosCoin, setkudosCoin] = useState({ coinCount: 0, progress: "0" })
	const [buttonRealTime, setbuttonRealTime] = useState(true)
	const [symbolAssetProfile, setSymbolAssetProfile] = useState(null)
	let intervalId = useRef(null)
	function onImageView(element) {
		setmodal_imageview(true)
		setimageViewData(element)
	}
	function onRetweet(element) {
		setmodal_retweet(true)
		setretweetData(element)
	}
	useEffect(() => {
		checkWatchlistByUser()
	}, [watchload])
	function getChartDataBySymbol(range) {
		if (symboleName) {
			axiosHttpMiddelware
				.post("/getChartBySymbol", { symbolename: symboleName, range: range })
				.then(response => {
					if (
						response.status == 200 &&
						response.data.symbolChartResponse !== null
					) {
						var stockDetails =
							response.data.symbolChartResponse[0].indicators.quote
						var stockTimeDetails =
							response.data.symbolChartResponse[0].timestamp
						var arrChartData = []
						if (stockDetails[0].low !== undefined) {
							for (let index = 0; index < stockDetails[0].low.length; index++) {
								arrChartData.push({
									date: new Date(stockTimeDetails[index] * 1000),
									open: stockDetails[0].open[index],
									low: stockDetails[0].low[index],
									high: stockDetails[0].high[index],
									close: stockDetails[0].close[index],
									volume: stockDetails[0].volume[index],
								})
							}
						}
						setchartData(arrChartData)
					}
				})
				.catch(err => {
					console.error(err)
					toaster.errorToaster("error while setting up the filter", "Error")
				})
		}
	}
	function checkWatchlistByUser() {
		if (localStorage.getItem("user")) {
			if (symboleName) {
				var watchlistData = { symbolename: `$` + symboleName }
				axiosAuthHttpMiddelware
					.post("/checkwatchlistbyuser", { watchlistData })
					.then(response => {
						if (
							response.status == 200 &&
							response.data.watchlistResponse !== null
						) {
							setiswatch(response.data.watchlistResponse)
						} else {
							toaster.errorToaster(response.data.message, "Error")
						}
					})
					.catch(err => {
						console.error(err)
						toaster.errorToaster(
							"Couldn't fetch user's watchlist.",
							"Watchlist"
						)
					})
			}
		}
	}
	function getSymbolQuoteData() {
		if (
			symboleName !== "" &&
			symboleName !== null &&
			symboleName !== undefined
		) {
			axiosHttpMiddelware
				.post("/symbolQuoteSummary", {
					symbolname: symboleName,
					modules: "assetProfile",
				})
				.then(response => {
					if (
						response.status == 200 &&
						response.data.symbolResponse !== null &&
						response.data.symbolResponse.length > 0
					) {
						// setsymbolQuote(response.data.symbolResponse[0].price)
						setSymbolAssetProfile(response.data.symbolResponse[0].assetProfile)
						// setSymbolFullNameAction(response.data.symbolResponse[0].price.shortName)
					}
				})
				.catch(err => {
					setsymbolQuote("")
				})
			axiosHttpMiddelware
				.post("/symbolQuoteSummaryRealTime", {
					symbolname: symboleName,
					modules: "price",
				})
				.then(response => {
					if (
						response.status == 200 &&
						response.data.symbolResponse !== null &&
						response.data.symbolResponse.length > 0
					) {
						setsymbolQuote(response.data.symbolResponse[0].price)
						// setSymbolAssetProfile(response.data.symbolResponse[0].assetProfile)
						setSymbolFullNameAction(
							response.data.symbolResponse[0].price.shortName
						)
					}
				})
				.catch(err => {
					setsymbolQuote("")
				})
		}
	}
	useEffect(() => {
		let symbolNameFromLocation = history.location.pathname.replace("/feed/", "")
		setSymboleName(symbolNameFromLocation)
		setTimeout(function () {
			checkWatchlistByUser()
		}, 500)
	})
	useEffect(() => {
		getSymbolQuoteData()
		getChartDataBySymbol("1d")
		if (localStorage.getItem("user") && !isLogin) {
			setIsLogin(true)
		}
	}, [symboleName])
	function tog_backdroplogin() {
		setmodal_backdroplogin(true)
	}
	function tog_backdropsignup() {
		setmodal_backdropsignup(true)
	}
	function handleChangeLogin(value, issignup) {
		setmodal_backdroplogin(value)
		if (issignup) {
			tog_backdropsignup()
		}
	}
	function handleChangeSignup(value, islogin) {
		setmodal_backdropsignup(value)
		if (islogin) {
			tog_backdroplogin()
		}
	}
	function onMessage(element) {
		if (localStorage.getItem("user") && isLogin) {
			setmodal_message(true)
			setmessageData(element)
		} else {
			tog_backdropsignup()
		}
	}
	function handleChangeMessage(value) {
		setmodal_message(value)
	}
	const ScaleProvider =
		discontinuousTimeScaleProviderBuilder().inputDateAccessor(
			d => new Date(d.date)
		)
	const height = 190
	const width = 670
	const margin = { left: 0, right: 48, top: 0, bottom: 24 }
	const ema12 = ema()
		.id(1)
		.options({ windowSize: 12 })
		.merge((d, c) => {
			d.ema12 = c
		})
		.accessor(d => d.ema12)
	const ema26 = ema()
		.id(2)
		.options({ windowSize: 26 })
		.merge((d, c) => {
			d.ema26 = c
		})
		.accessor(d => d.ema26)
	const elder = elderRay()
	const { data, xScale, xAccessor, displayXAccessor } = ScaleProvider(chartData)
	const pricesDisplayFormat = format(".2f")
	const max = xAccessor(data[data.length - 1])
	const min = xAccessor(data[Math.max(0, data.length - 100)])
	const xExtents = [min, max + 5]
	const gridHeight = height - margin.top - margin.bottom
	const elderRayHeight = 0.1
	const elderRayOrigin = (_, h) => [0, h - elderRayHeight]
	const barChartHeight = gridHeight / 4
	const barChartOrigin = (_, h) => [0, h - barChartHeight - elderRayHeight]
	const chartHeight = gridHeight - elderRayHeight
	const yExtents = data => {
		return [data.high, data.low]
	}
	const dateTimeFormat = "%d %b"
	const timeDisplayFormat = timeFormat(dateTimeFormat)
	const barChartExtents = data => {
		return data.volume
	}
	const candleChartExtents = data => {
		return [data.high, data.low]
	}
	const yEdgeIndicator = data => {
		return data.close
	}
	const volumeColor = data => {
		return data.close > data.open
			? "rgba(38, 166, 154, 0.3)"
			: "rgba(239, 83, 80, 0.3)"
	}
	const volumeSeries = data => {
		return data.volume
	}
	const openCloseColor = data => {
		return data.close > data.open ? "#26a69a" : "#ef5350"
	}
	const toggleCustom = (tab, range) => {
		if (customActiveTab !== tab) {
			getChartDataBySymbol(range)
			setcustomActiveTab(tab)
		}
	}
	async function handleChange(value, key) {
		if (localStorage.getItem("user") && isLogin) {
			const obj = JSON.parse(localStorage.getItem("user"))
			var userPostData = {
				postid: value.id,
				userid: obj.id,
				kudosuserid: value.userid,
				upvote: key == "up" ? 1 : 0,
				downvote: key == "down" ? 1 : 0,
			}
			axiosHttpMiddelware
				.post("/updateuserpostvotecount", { userPostData })
				.then(response => {
					setcountUpdate(!countUpdate)
				})
				.catch(err => {})
		} else {
			tog_backdropsignup()
		}
	}
	async function addWatchlist(value, key) {
		if (!isLogin) {
			tog_backdropsignup()
		} else if (localStorage.getItem("user") && symboleName) {
			const obj = JSON.parse(localStorage.getItem("user"))
			if (!iswatch) {
				var watchlistData = {
					symbols: symboleName,
					userid: obj.id,
				}
				axiosAuthHttpMiddelware
					.post("/watchlistcreate", { watchlistData })
					.then(response => {
						appWatchloadSwitch()
						Toaster.successToaster("Added to watchlist", "Success")
					})
					.catch(err => {
						console.error(err)
						Toaster.successToaster("Error adding to watchlist", "Error")
					})
			} else {
				var watchlistData = {
					symbolename: symboleName,
					userid: obj.id,
				}
				axiosAuthHttpMiddelware
					.post("/watchlistdelete", { watchlistData })
					.then(response => {
						appWatchloadSwitch()
						checkWatchlistByUser()
						Toaster.successToaster("Removed from watchlist", "Success")
					})
					.catch(err => {
						Toaster.successToaster("Error removing from watchlist", "Error")
					})
			}
			setCheckWatch(!checkWatch)
		}
	}
	function handleChangeImageView(value) {
		setmodal_imageview(value)
	}
	function handleChangeRetweet(value) {
		setmodal_retweet(value)
	}
	const userprofile = (username, userid) => {
		history.push({ pathname: `/viewprofile/${username}`, state: userid })
	}
	async function getUserInfo(userid) {
		setkudosCoin({ coinCount: 0, progress: "0" })
		if (userid > 0) {
			axiosHttpMiddelware
				.post("getKudosCountByUser", { userid: userid })
				.then(response => {
					if (
						response.status == 200 &&
						response.data.kudosCoinResponse !== undefined &&
						response.data.kudosCoinResponse.length > 0
					) {
						setkudosCoin({
							...kudosCoin,
							coinCount: response.data.kudosCoinResponse[0].kudoscoincount,
							progress: response.data.kudosCoinResponse[0].progress,
						})
					} else if (
						response.status == 200 &&
						response.data.kudosCoinResponse === null
					) {
						setkudosCoin({ coinCount: 0, progress: "0" })
					} else if (response.status == 400) {
						setkudosCoin({ coinCount: 0, progress: "0" })
					}
				})
				.catch(err => {
					Toaster.errorToaster(err.response, "Error")
				})
		}
	}
	async function handleStart() {
		clearInterval(intervalId.current)
		intervalId.current = setInterval(() => {
			getPostbyTimeFilter("RealTime")
		}, 5000)
	}
	function handleReset() {
		clearInterval(intervalId.current)
	}
	async function getPostbyTagFilter(tempfilterdata) {
		if (true) {
			setsymbolpostData([])
			const obj = JSON.parse(localStorage.getItem("user"))
			var filterdata = {
				userid: 1,
				symbolename: symboleName,
				filtervalue: tempfilterdata.target.value,
			}
		}
	}
	async function deleteUserPost(userid, postid) {
		axiosHttpMiddelware
			.post("/userpostdelete", { postid: postid, userid: userid })
			.then(response => {
				if (response.status == 200) {
					toaster.successToaster(response.data.message, "Post")
					window.location.reload()
				} else {
					toaster.warnToaster(response.data.message, "UserPost")
				}
			})
			.catch(response => {
				toaster.warnToaster("Error fetching posts", "Post")
			})
	}
	function getDifferenceInMinutes(date1, date2) {
		const diffInMs = Math.abs(date2 - date1)
		return diffInMs / (1000 * 60)
	}
	return (
		<React.Fragment>
			<div className="row d-flex pb-3">
				<div className="col-md-10  ">
					{symbolQuote != "" ? (
						<div>
							<div>
								<span className="m-0">
									<span>
										{" "}
										{symboleName} | {symbolQuote?.currency} |{" "}
										{symbolQuote?.currencySymbol} |
									</span>
								</span>
								<span className="px-2">{symbolQuote?.exchangeName} | </span>
								<span className="px-2">Updated : </span>
								<span className="">
									{moment().format("DD/MM/YYYY hh:mm A")}
								</span>
							</div>
							<div>
								<span className="m-0">
									Industry : {symbolAssetProfile?.industry} |
								</span>
								<span className="px-2">
									Sector : {symbolAssetProfile?.sector}
								</span>
							</div>
							<div className="d-flex justify-content-start  align-items-center pt-2 pt-lg-0">
								<h1 className="m-0 symbol-title">
									{symbolQuote?.shortName}{" "}
									<span>{symbolQuote?.regularMarketPrice.fmt}</span>{" "}
								</h1>
								<span>
									{symbolQuote?.regularMarketChange.fmt < 0 ? (
										<div className="symbol-percentage-down">
											<i className="bx bx-down-arrow-alt symbol-icon "></i>
											{symbolQuote?.regularMarketChange.fmt} (
											{symbolQuote?.regularMarketChangePercent.fmt})
										</div>
									) : (
										<div className="symbol-percentage-up">
											<i className="bx bx-up-arrow-alt symbol-icon"></i>
											{symbolQuote?.regularMarketChange.fmt} (
											{symbolQuote?.regularMarketChangePercent.fmt})
										</div>
									)}
								</span>
							</div>
						</div>
					) : null}
				</div>
				<div className="col-md-2 d-flex justify-content-md-end justify-content-center  align-items-center post-btn pt-2 pt-lg-0">
					<button
						type="button"
						className="btn btn-primary btn-label w-md"
						onClick={() => addWatchlist(iswatch)}
						id={isLogin ? (iswatch ? "unwatch" : "watch") : "disabled"}
						disabled={!isLogin}>
						<i className="mdi mdi-eye label-icon"></i>{" "}
						{iswatch ? "Unwatch" : "Watch"}
					</button>
				</div>
			</div>
			<ChartCanvas
				height={height}
				ratio={4}
				width={width}
				margin={margin}
				data={data}
				displayXAccessor={displayXAccessor}
				seriesName="Data"
				xScale={xScale}
				xAccessor={xAccessor}
				xExtents={xExtents}
				zoomAnchor={lastVisibleItemBasedZoomAnchor}>
				<Chart
					id={2}
					height={barChartHeight}
					origin={barChartOrigin}
					yExtents={barChartExtents}>
					<BarSeries fillStyle={volumeColor} yAccessor={volumeSeries} />
				</Chart>
				<Chart id={3} height={chartHeight} yExtents={candleChartExtents}>
					<XAxis showGridLines showTickLabel={false} />
					<YAxis showGridLines tickFormat={pricesDisplayFormat} />
					<CandlestickSeries />
					<LineSeries
						yAccessor={ema26.accessor()}
						strokeStyle={ema26.stroke()}
					/>
					<CurrentCoordinate
						yAccessor={ema26.accessor()}
						fillStyle={ema26.stroke()}
					/>
					<LineSeries
						yAccessor={ema12.accessor()}
						strokeStyle={ema12.stroke()}
					/>
					<CurrentCoordinate
						yAccessor={ema12.accessor()}
						fillStyle={ema12.stroke()}
					/>
					<MouseCoordinateY
						rectWidth={margin.right}
						displayFormat={pricesDisplayFormat}
					/>
					<EdgeIndicator
						itemType="last"
						rectWidth={margin.right}
						fill={openCloseColor}
						lineStroke={openCloseColor}
						displayFormat={pricesDisplayFormat}
						yAccessor={yEdgeIndicator}
					/>
					{/* <OHLCTooltip origin={[8, 16]} /> */}
				</Chart>
				<Chart
					id={4}
					height={elderRayHeight}
					yExtents={[0, elder.accessor()]}
					origin={elderRayOrigin}
					padding={{ top: 8, bottom: 8 }}>
					<XAxis showGridLines gridLinesStrokeStyle="#e0e3eb" />
					<YAxis ticks={4} tickFormat={pricesDisplayFormat} />
					<MouseCoordinateX displayFormat={timeDisplayFormat} />
					<MouseCoordinateY
						rectWidth={margin.right}
						displayFormat={pricesDisplayFormat}
					/>
				</Chart>
				<CrossHairCursor />
			</ChartCanvas>
			<Row>
				<Col lg={10} className="py-3">
					<Nav tabs className="nav-tabs-custom nav-justified">
						<NavItem>
							<NavLink
								style={{ cursor: "pointer" }}
								className={classnames({
									active: customActiveTab === "1",
								})}
								onClick={() => {
									toggleCustom("1", "1d")
								}}>
								<span>1D</span>
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink
								style={{ cursor: "pointer" }}
								className={classnames({
									active: customActiveTab === "2",
								})}
								onClick={() => {
									toggleCustom("2", "1w")
								}}>
								<span>1W</span>
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink
								style={{ cursor: "pointer" }}
								className={classnames({
									active: customActiveTab === "3",
								})}
								onClick={() => {
									toggleCustom("3", "1mo")
								}}>
								<span>1M</span>
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink
								style={{ cursor: "pointer" }}
								className={classnames({
									active: customActiveTab === "4",
								})}
								onClick={() => {
									toggleCustom("4", "3mo")
								}}>
								<span>3M</span>
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink
								style={{ cursor: "pointer" }}
								className={classnames({
									active: customActiveTab === "5",
								})}
								onClick={() => {
									toggleCustom("5", "6mo")
								}}>
								<span>6M</span>
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink
								style={{ cursor: "pointer" }}
								className={classnames({
									active: customActiveTab === "6",
								})}
								onClick={() => {
									toggleCustom("6", "1y")
								}}>
								<span>1Y</span>
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink
								style={{ cursor: "pointer" }}
								className={classnames({
									active: customActiveTab === "7",
								})}
								onClick={() => {
									toggleCustom("7", "max")
								}}>
								<span>All</span>
							</NavLink>
						</NavItem>
					</Nav>
				</Col>
			</Row>
			{modal_imageview ? (
				<ImageModel
					onChange={handleChangeImageView}
					dataParentToChild={modal_imageview}
					elementInfo={imageViewData}
				/>
			) : null}
			{modal_message ? (
				<Message
					onChange={handleChangeMessage}
					dataParentToChild={modal_message}
					elementInfo={messageData}
				/>
			) : null}
			{modal_backdroplogin && symboleName ? (
				<Login
					onChange={handleChangeLogin}
					dataParentToChild={modal_backdroplogin}
					symbolData={symboleName}
				/>
			) : null}
			{modal_backdropsignup && symboleName ? (
				<Signup
					onChange={handleChangeSignup}
					dataParentToChild={modal_backdropsignup}
					symbolData={symboleName}
				/>
			) : null}
			{modal_retweet ? (
				<Retweet
					onChange={handleChangeRetweet}
					dataParentToChild={modal_retweet}
					elementInfo={retweetData}
				/>
			) : null}
		</React.Fragment>
	)
}
export default withContext(
	([
		{
			app: { watchload, symbolname },
		},
		dispatch,
	]) => ({
		watchload: watchload,
		appWatchloadSwitch: () => appWatchloadSwitchAction(dispatch),
		setSymbolFullNameAction: data => setSymbolFullNameAction(data, dispatch),
	}),
	SymbolChart
)
