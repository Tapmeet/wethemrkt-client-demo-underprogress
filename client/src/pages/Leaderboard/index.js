import React, {useState, useEffect} from "react"
import {Card, Col, Container, ListGroup, ListGroupItem, ListGroupItemHeading, Row} from "reactstrap"

import "../../assets/scss/custom/wethemkrt/blogpost.scss"
import HorizontalLayout from "../../components/HorizontalLayout";
import axiosAuthHttpMiddelware from "../../common/axiosAuthHttpMiddelware";
import axiosHttpMiddelware from "../../common/axiosHttpMiddelware";
import toaster from "../../components/Common/Toaster";
import UserKudos from "./UserKudos";
import UserPostKudos from "./UserPostKudos";
import "./Leaderboard.scss";

const Leaderboard = (props) => {
    const [techFund, setTechFund] = useState(true)
    const [watchlist, setWatchlist] = useState(true)
    const [leaders, setLeaders] = useState(null)
    const [lineData, setLineData] = useState(null)
    const getCharts = (symbols) => {
        if (symbols.length) {
            let symbolNames = symbols.slice(0, 1).map((symbol) => {
                return symbol
            }).join(',')
            let comparisons = symbols.slice(1, 5).map((symbol) => {
                return symbol
            }).join(',')
            axiosHttpMiddelware.post("/getChartBySymbol", {
                symbolename: symbolNames,
                range: '1d',
                comparisons: comparisons
            }).then((response) => {
                if (
                    response.status == 200 &&
                    response.data.symbolChartResponse !== null
                ) {
                    setLineData(response.data.symbolChartResponse)
                }
            }).catch((err) => {
                console.error(err);
                toaster.errorToaster("error while setting up the filter", "Error")
            })
        }
    }


    const getSymbolData = (symbol) => {
        if (lineData) {
            for (let i = 0; i < lineData[0].comparisons.length; i++) {
                if (lineData[0].comparisons[i].symbol == symbol) {
                    return lineData[0].comparisons[i].previousClose
                }
            }
            if (lineData[0].meta.symbol == symbol) {
                return lineData[0].indicators.quote[0].close[lineData[0].indicators.quote[0].close.length - 1]
            }
        }
    }

    const getSymbolDataDiff = (symbol) => {
        if (lineData) {
            for (let i = 0; i < lineData[0].comparisons.length; i++) {
                if (lineData[0].comparisons[i].symbol == symbol) {
                    return lineData[0].comparisons[i].close[lineData[0].comparisons[i].close.length - 1] - lineData[0].comparisons[i].close[0]
                }
            }
            if (lineData[0].meta.symbol == symbol) {
                return lineData[0].indicators.quote[0].close[lineData[0].indicators.quote[0].close.length - 1] - lineData[0].indicators.quote[0].close[0]
            }
        }
    }
    const getColor = (diff) => {
        if (diff > 0) {
            return 'green'
        } else {
            return 'red'
        }
    }
    const getArrow = (diff) => {
        if (diff > 0) {
            return (<i className='bx bx-up-arrow-alt'></i>)
        } else {
            return (<i className='bx bx-down-arrow-alt'></i>)
        }
    }
    const getLeaders = () => {
        setLeaders(null)
        setLineData(null)
        if (localStorage.getItem("user")) {
            const obj = JSON.parse(localStorage.getItem("user"));
            axiosAuthHttpMiddelware.get("leaders", {
                userId: obj.id,
                params: {
                    techFund: techFund,
                    watchlist: watchlist
                }
            }).then((response) => {
                setLeaders(response.data.data)
                getCharts(response.data.data)
            })
        }
    }

    useEffect(() => {
        getLeaders()
    }, [techFund, watchlist])
    return (
        <React.Fragment>
            <HorizontalLayout>
                <div className="leaderboard">
                    <h1 className="pt-2 rs-title">Leaderboard</h1>
                    <div className="white-boxpart rs-box">
                        <h4 className="rs-title">Watchlist Top Ideas Currently On Watchlist</h4>
                        {leaders !== null && (
                            <div className="search-filter">
                                <div className="sf-row">
                                    <div className="sf-group sf-6">
                                        {watchlist ? (
                                            <i className='bx bxs-down-arrow'
                                                role="button"
                                                onClick={() => setWatchlist(false)}></i>
                                        ) : (
                                            <i className='bx bxs-up-arrow'
                                                role="button"
                                                onClick={() => setWatchlist(true)}></i>
                                        )}
                                        5 Most Popular Stocks on watchlist
                                    </div>
                                    <div className="sf-group sf-6">
                                        {techFund ? (
                                            <i className='bx bxs-down-arrow'
                                                role="button"
                                                onClick={() => setTechFund(false)}></i>
                                        ) : (
                                            <i className='bx bxs-up-arrow'
                                                role="button"
                                                onClick={() => setTechFund(true)}></i>
                                        )}
                                        Technical / Fundamental
                                    </div>
                                </div>
                                
                                {leaders?.length && leaders.map((leader, index) => {
                                    return (
                                        <div className="sf-row" key={index}>
                                            <div className="sf-group sf-6">
                                                {leader}
                                            </div>
                                            <div className="sf-group sf-6">
                                                {(lineData && index < 6) && (
                                                    <div className="symbol-data ps-4">
                                                        <div className="symbol-data-title">
                                                            {getSymbolData(leader)?.toFixed(2)}
                                                        </div>
                                                        <div className="symbol-data-diff">
                                                            <div
                                                                className={getColor(getSymbolDataDiff(leader))}>
                                                                {getArrow(getSymbolDataDiff(leader))}
                                                                {getSymbolDataDiff(leader)?.toFixed(2)} ({((getSymbolDataDiff(leader)) / getSymbolData(leader) * 100)?.toFixed(2)}%)
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                    <UserKudos  props={props} />
                    <UserPostKudos props={props} />
                </div>
            </HorizontalLayout>
        </React.Fragment>
    )
}
export default Leaderboard
