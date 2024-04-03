import React, { useState, useEffect } from "react"
import { ListGroup, ListGroupItem } from "reactstrap"
import { Sparklines, SparklinesLine } from "react-sparklines"
import axiosAuthHttpMiddelware from "common/axiosAuthHttpMiddelware"
import axiosHttpMiddelware from "common/axiosHttpMiddelware"
import { useHistory } from "react-router-dom"

import "./Symbol.scss"
import Skeleton from "react-loading-skeleton"

const TrendingSymbol = () => {
	const history = useHistory()
	const [trendingSymbols, setTrendingSymbols] = useState(null)
	const [lineData, setLineData] = useState(null)
	useEffect(() => {
		getTrendingSymbol()
	}, [])
	const symboal = params => {
		history.push(`/feed/${params}`)
	}
	const getTrendingSymbol = async () => {
		axiosAuthHttpMiddelware
			.get("/getTrendingSymbols")
			.then(response => {
				if (
					response.status == 200 &&
					response.data.trendingSymbolResponse[0].quotes !== undefined
				) {
					setTrendingSymbols(response.data.trendingSymbolResponse[0].quotes)
					getCharts(response.data.trendingSymbolResponse[0].quotes)
				} else {
					setTrendingSymbols([])
				}
			})
			.catch(err => {
				console.log(err)
			})
	}
	const getCharts = symbols => {
		if (symbols) {
			let symbolNames = symbols
				.slice(0, 1)
				.map(symbol => {
					return symbol.symbol
				})
				.join(",")
			let comparisons = symbols
				.slice(0, 5)
				.map(symbol => {
					return symbol.symbol
				})
				.join(",")
			axiosHttpMiddelware
				.post("/getChartBySymbol", {
					symbolename: symbolNames,
					range: "1d",
					comparisons: comparisons,
				})
				.then(response => {
					if (
						response.status == 200 &&
						response.data.symbolChartResponse !== null
					) {
						setLineData(response.data.symbolChartResponse)
					}
				})
				.catch(err => {
					console.error(err)
					toaster.errorToaster("error while setting up the filter", "Error")
				})
		}
	}
	const getLineData = symbol => {
		if (lineData) {
			for (let i = 0; i < lineData[0].comparisons.length; i++) {
				if (lineData[0].comparisons[i].symbol == symbol) {
					return [
						lineData[0].comparisons[i].close,
						lineData[0].comparisons[i].open,
					]
				}
			}
			if (lineData[0].meta.symbol == symbol) {
				return [
					lineData[0].indicators.quote[0].close,
					lineData[0].indicators.quote[0].open,
				]
			}
		}
	}
	const getSymbolData = symbol => {
		if (lineData) {
			for (let i = 0; i < lineData[0].comparisons.length; i++) {
				if (lineData[0].comparisons[i].symbol == symbol) {
					return lineData[0].comparisons[i].previousClose
				}
			}
			if (lineData[0].meta.symbol == symbol) {
				return lineData[0].indicators.quote[0].close[
					lineData[0].indicators.quote[0].close.length - 1
				]
			}
		}
	}

	const getSymbolDataDiff = symbol => {
		if (lineData) {
			for (let i = 0; i < lineData[0].comparisons.length; i++) {
				if (lineData[0].comparisons[i].symbol == symbol) {
					return (
						lineData[0].comparisons[i].close[
							lineData[0].comparisons[i].close.length - 1
						] - lineData[0].comparisons[i].close[0]
					)
				}
			}
			if (lineData[0].meta.symbol == symbol) {
				return (
					lineData[0].indicators.quote[0].close[
						lineData[0].indicators.quote[0].close.length - 1
					] - lineData[0].indicators.quote[0].close[0]
				)
			}
		}
	}
	const getColor = diff => {
		if (diff > 0) {
			return "green"
		} else {
			return "red"
		}
	}
	const getArrow = diff => {
		if (diff > 0) {
			return <i className="bx bx-up-arrow-alt"></i>
		} else {
			return <i className="bx bx-down-arrow-alt"></i>
		}
	}
	const symbols = symbolsList => {
		if (symbolsList && symbolsList.length > 0) {
			return symbolsList.slice(0, 5).map((symbol, index) => {
				const symbolLineData = getLineData(symbol.symbol)
				return (
					<div key={index} className="graph-partbox">
						<div
							className="gp-price"
							role="button"
							onClick={() => symboal(symbol.symbol)}>
							{symbol.symbol}
						</div>
						{lineData && (
							<>
								<div className="symbol-sparkline gp-map">
									<Sparklines
										data={
											Array.isArray(symbolLineData) && symbolLineData.length > 0
												? symbolLineData[0]
												: symbolLineData
										}>
										<SparklinesLine
											color={getColor(getSymbolDataDiff(symbol.symbol))}
										/>
									</Sparklines>
								</div>
								<div className="gp-price">
									<div className="symbol-data-title">
										{getSymbolData(symbol.symbol)?.toFixed(2)}
									</div>
									<div className="symbol-data-diff">
										<div className={getColor(getSymbolDataDiff(symbol.symbol))}>
											{getArrow(getSymbolDataDiff(symbol.symbol))}
											{getSymbolDataDiff(symbol.symbol)?.toFixed(2)}(
											{(
												(getSymbolDataDiff(symbol.symbol) /
													getSymbolData(symbol.symbol)) *
												100
											)?.toFixed(2)}
											%)
										</div>
									</div>
								</div>
							</>
						)}
					</div>
				)
			})
		}
		return null
	}
	return (
		<div className="rs-box">
			<h4 className="rs-title">Most Active</h4>
			<div>
				{trendingSymbols ? (
					<>{symbols(trendingSymbols)}</>
				) : (
					<Skeleton count={10} />
				)}
			</div>
		</div>
	)
}

export default TrendingSymbol
