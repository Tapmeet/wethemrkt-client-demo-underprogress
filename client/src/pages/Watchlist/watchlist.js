import React, { useState, useEffect, Component } from "react"
import { withContext } from '../../context/index'
import { Card, Col, Row, CardBody, Container, Media } from "reactstrap"
import { Link } from "react-router-dom"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import "../../assets/scss/custom/wethemkrt/blogpost.scss";
import Star from "../../assets/images/star.png"
// import watchlist from '../../services/watchlist.service';

import moment from "moment";
import axiosHttpMiddelware from "common/axiosHttpMiddelware";
import Toaster from "components/Common/Toaster";
import axiosAuthHttpMiddelware from "common/axiosAuthHttpMiddelware";
import HorizontalLayout from "components/HorizontalLayout";
import toaster from "../../components/Common/Toaster";
import "./watchlist.css"
import { appWatchloadSwitch as appWatchloadSwitchAction } from '../../store/actions/appActions'
import bearImage from "../../assets/images/bear.png"
import bullImage from "../../assets/images/bull.png"

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};


const grid = 2;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid,
    margin: `0 0 ${grid * 2}px 0`,

    // change background colour if dragging
    background: isDragging ? "#333" : "white",

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    padding: grid,
    // width: 600

});


const Watchlist = ({ watchload, appWatchloadSwitch, ...props }) => {
    const [kudosCoinsAwarded, setKudosCoinsAwarded] = useState(false)
    const [numberOfPosts, setNumberOfPosts] = useState(false)
    const [sentiment, setSentiment] = useState(false)
    const [sorting, setSorting] = useState(false)
    const [activeTab, toggleTab] = useState("1");
    const [watchlistData, setwatchlistData] = useState([]);
    const [lineData, setLineData] = useState(null)
    const getCharts = (symbols) => {
        if (symbols) {
            let symbolNames = symbols.slice(0, 1).map((symbol) => {
                return symbol.content
            }).join(',')
            let comparisons = symbols.slice(1, symbols.length).map((symbol) => {
                return symbol.content
            }).join(',')
            axiosHttpMiddelware.post("/getChartBySymbol", { symbolename: symbolNames, range: '1d', comparisons: comparisons }).then((response) => {
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
            if (lineData[0].meta.symbol == symbol) {
                return lineData[0].indicators.quote[0].close[lineData[0].indicators.quote[0].close.length - 1]
            }
            else {
                for (let i = 0; i < lineData[0].comparisons.length; i++) {
                    if (lineData[0].comparisons[i].symbol == symbol) {
                        return lineData[0].comparisons[i].previousClose
                    }
                }
            }


        }
    }

    const getSymbolDataDiff = (symbol) => {
        if (lineData) {
            if (lineData[0].meta.symbol == symbol) {
                return lineData[0].indicators.quote[0].close[lineData[0].indicators.quote[0].close.length - 1] - lineData[0].indicators.quote[0].close[0]
            } else {
                for (let i = 0; i < lineData[0].comparisons.length; i++) {
                    if (lineData[0].comparisons[i].symbol == symbol) {
                        return lineData[0].comparisons[i].close[lineData[0].comparisons[i].close.length - 1] - lineData[0].comparisons[i].close[0]
                    }
                }
            }
        }
    }

    const getColor = (diff) => {
        if (diff > 0) {
            return 'green'
        }
        else {
            return 'red'
        }
    }

    const getArrow = (diff) => {
        if (diff > 0) {
            return (<i className='bx bx-up-arrow-alt'></i>)
        }
        else {
            return (<i className='bx bx-down-arrow-alt'></i>)
        }
    }

    const WatchListCardwitoutStar = ({ symbolData }) => {
        /* watchlistData.symbolename, watchlistData.userid */
        function deleteButtonClicked() {
            if (localStorage.getItem("user")) {
                const userData = JSON.parse(localStorage.getItem("user"))

                let watchlistData = {
                    symbolename: symbolData.content,
                    userid: userData.id

                }

                axiosAuthHttpMiddelware.post("watchlistdelete", { watchlistData }).then((resp) => {
                    // console.log(resp);
                    Toaster.successToaster("Item removed", "Success");
                    getWatchlistByUser()
                    appWatchloadSwitch()
                }).catch((err) => {
                    Toaster.errorToaster("", "Error")
                });
            }
        }

        return (
            <tr>
                <td>
                </td>
                <td>
                    <h3>
                        <Link to={"/feed/" + symbolData.content} className="text-dark ml-2 pl-2"
                            key={symbolData.key}>
                            {symbolData.content}
                        </Link>
                    </h3>
                </td>
                <td>
                    {lineData && (
                        <div className="symbol-data ps-4">
                            <div className="symbol-data-title">
                                {getSymbolData(symbolData.content)?.toFixed(2)}
                            </div>
                            <div className="symbol-data-diff">
                                <div className={getColor(getSymbolDataDiff(symbolData.content)?.toFixed(2))}>
                                    {getArrow(getSymbolDataDiff(symbolData.content)?.toFixed(2))}
                                    {getSymbolDataDiff(symbolData.content)?.toFixed(2)} ({(getSymbolDataDiff(symbolData.content)?.toFixed(2) / getSymbolData(symbolData.content)?.toFixed(2) * 100)?.toFixed(2)}%)
                                </div>
                            </div>
                        </div>
                    )}
                </td>
                <td>
                    <div className="">{symbolData.kudosCoins}</div>
                </td>
                <td>
                    <div className="ps-3">{symbolData.postCount}</div>
                </td>
                <td>
                    <div className="post-icon-size">
                        {symbolData.sentimentvalue == 0 &&
                            symbolData.sentimentvalue == 0 ? null : symbolData.sentimentvalue >
                                0 ? (
                            <button className="btn-icon-sentiment">
                                <div className=" px-2">
                                    {" "}
                                    + {symbolData.sentimentvalue}{" "}
                                    <img
                                        src={bullImage}
                                        height="25"
                                        width="25"
                                        className="text-end"></img>
                                </div>
                            </button>
                        ) : (
                            <button className="btn-icon-sentiment">
                                <div className=" px-2">
                                    {" "}
                                    {symbolData.sentimentvalue}{" "}
                                    <img
                                        src={bearImage}
                                        height="25"
                                        width="25"
                                        className="text-end"></img>
                                </div>
                            </button>
                        )}
                    </div>
                </td>
                <td>
                    <div className="float-end">
                        <button type="button" className="ml-2 btn btn-danger deleteButtonWatchlist"
                            onClick={() => deleteButtonClicked()}><i
                                className="mdi mdi-delete"></i>{" "}</button>
                    </div>
                </td>
            </tr>
        )
    };


    const WatchListCardStar = ({ symbolData }) => {
        function deleteButtonClicked() {
            if (localStorage.getItem("user")) {
                const userData = JSON.parse(localStorage.getItem("user"))
                let watchlistData = {
                    symbolename: symbolData.content,
                    userid: userData.id
                }
                axiosAuthHttpMiddelware.post("watchlistdelete", { watchlistData }).then((resp) => {
                    // console.log(resp);
                    Toaster.successToaster("Item removed", "Success");
                    getWatchlistByUser()
                    appWatchloadSwitch()
                }).catch((err) => {
                    Toaster.errorToaster("", "Error")
                });
            }
        }

        return (
            <tr>
                <td>
                    <div className="avatar-xs me-3">
                        <img src={Star} alt="" height="32" />
                    </div>
                </td>
                <td>
                    <h3>
                        <Link to={"/feed/" + symbolData.content} className="text-dark ml-2 pl-2"
                            key={symbolData.key}>
                            {symbolData.content}
                        </Link>
                    </h3>
                </td>
                <td>
                    {lineData && (
                        <div className="symbol-data">
                            <div className="symbol-data-title">
                                {getSymbolData(symbolData.content)?.toFixed(2)}
                            </div>
                            <div className="symbol-data-diff">
                                <div className={getColor(getSymbolDataDiff(symbolData.content)?.toFixed(2))}>
                                    {getArrow(getSymbolDataDiff(symbolData.content)?.toFixed(2))}
                                    {getSymbolDataDiff(symbolData.content)?.toFixed(2)} ({(getSymbolDataDiff(symbolData.content)?.toFixed(2) / getSymbolData(symbolData.content)?.toFixed(2) * 100)?.toFixed(2)}%)
                                </div>
                            </div>
                        </div>
                    )}
                </td>
                <td>
                    <div>{symbolData.kudosCoins}</div>
                </td>
                <td>
                    <div className="ps-3">{symbolData.postCount}</div>
                </td>
                <td>
                    <div className="post-icon-size">
                        {symbolData.sentimentvalue == 0 &&
                            symbolData.sentimentvalue == 0 ? null : symbolData.sentimentvalue >
                                0 ? (
                            <button className="btn-icon-sentiment">
                                <div className=" px-2">
                                    {" "}
                                    + {symbolData.sentimentvalue}{" "}
                                    <img
                                        src={bullImage}
                                        height="25"
                                        width="25"
                                        className="text-end"></img>
                                </div>
                            </button>
                        ) : (
                            <button className="btn-icon-sentiment">
                                <div className=" px-2">
                                    {" "}
                                    {symbolData.sentimentvalue}{" "}
                                    <img
                                        src={bearImage}
                                        height="25"
                                        width="25"
                                        className="text-end"></img>
                                </div>
                            </button>
                        )}
                    </div>
                </td>
                <td>
                    <div className="float-end">
                        <button type="button" className="ml-2 btn btn-danger deleteButtonWatchlist"
                            onClick={() => deleteButtonClicked()}><i
                                className="mdi mdi-delete"></i>{" "}</button>
                    </div>
                </td>
            </tr>
        )
    };

    useEffect(() => {
        getWatchlistByUser();
    }, [])

    useEffect(() => {
        sortWatchlist(kudosCoinsAwarded, numberOfPosts, sentiment)
    }, [kudosCoinsAwarded, numberOfPosts, sentiment])

    function onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }
        //let tempItems = items;

        const tempItems = reorder(watchlistData, result.source.index, result.destination.index);
        console.log(tempItems);
        let symbols = "";
        tempItems.map((value, index) => {
            if (index === tempItems.length - 1) {
                symbols += '$' + value.content
            } else {
                symbols += '$' + value.content + ','

            }

        });
        symbols.substring(0, symbols.length - 2);
        //console.log(symbols);
        setwatchlistData(tempItems);
        if (localStorage.getItem("user")) {
            const userData = JSON.parse(localStorage.getItem("user"))

            let watchlistData = {
                symbolename: symbols,
                userid: userData.id

            }
            axiosAuthHttpMiddelware.post("/watchlistupdate", { watchlistData }).then((response) => {
                //console.log(response.data);
                appWatchloadSwitch()
                Toaster.successToaster("Updated successfully", "Watchlist");

            }).catch((err) => {
                Toaster.errorToaster("Updated error", "Error");
            })
        }//setTaskData(tempItems);
        //setTaskData({ items });
    }

    const sortWatchlist = (kudosCoinsAwardedD, numberOfPostsD, sentiment) => {
        setSorting(true);
        setTimeout(() => {
            let watchlistDataSorted = watchlistData.sort((a, b) => {
                if (numberOfPostsD) {
                    return parseInt(b.postCount) - parseInt(a.postCount)
                } else if (kudosCoinsAwardedD) {
                    return parseInt(b.kudosCoins) - parseInt(a.kudosCoins)
                } else if (sentiment) {
                    return parseFloat(b.sentimentvalue) - parseFloat(a.sentimentvalue)
                }
                else {
                    return a.id - b.id
                }
            })
            setwatchlistData(watchlistDataSorted)
            setSorting(false);
        }, 500);
    }

    function getWatchlistByUser() {
        if (localStorage.getItem("user")) {
            const obj = JSON.parse(localStorage.getItem("user"));

            axiosAuthHttpMiddelware.get("watchlist", { userid: obj.id }).then((response) => {
                if (response.data.watchlistResponse !== undefined && response.data.watchlistResponse !== null) {
                    if (response.data.watchlistResponse !== '') {
                        let symbolsTwo = response.data.watchlistResponse;
                        let data = symbolsTwo.map((val, index) => {
                            let postCount = val.postCount
                            let kudosCoins = val.kudosCoins
                            let sentimentvalue = 0;
                            if (response.data.postResponse !== '') {
                                let posts = response.data.postResponse.filter((post) => {
                                    return post.
                                        symbolname == val.symbol
                                });
                                postCount = posts.length
                                for (let key in posts) {
                                    kudosCoins += posts[key].post.votes;
                                    sentimentvalue += parseFloat(posts[key].post.sentimentvalue);
                                }
                            }
                            return {
                                id: `${index}`,
                                key: `index-${index}`,
                                content: `${val.symbol}`.replace('$', ''),
                                postCount: postCount,
                                kudosCoins: kudosCoins,
                                sentimentvalue: sentimentvalue
                            }
                        })
                        setwatchlistData(data);
                        getCharts(data)
                    }
                    else {
                        setwatchlistData([]);
                    }

                } else {
                    setwatchlistData([]);
                }


            }).catch((err) => {
                console.log(err);
            })
        }
    }

    return (
        <React.Fragment>
            <HorizontalLayout>
                <div className="white-boxpart rs-box">
                    <div className="title-group">
                        <div>
                            <h4 className="rs-title">My Watchlist</h4>
                            <p className="short-text">{watchlistData.length} {watchlistData.length === 1 ? "Item" : "Items"}</p>
                        </div>
                    </div>
                    <div className="theme-table">
                        <table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>
                                        {kudosCoinsAwarded ? (
                                            <i className='bx bxs-down-arrow'
                                                role="button"
                                                onClick={() => setKudosCoinsAwarded(false)}></i>
                                        ) : (
                                            <i className='bx bxs-up-arrow'
                                                role="button"
                                                onClick={() => {
                                                    setNumberOfPosts(false)
                                                    setKudosCoinsAwarded(true)
                                                    setSentiment(false)
                                                }}></i>
                                        )}
                                        Kudos Coins Awarded
                                    </th>
                                    <th>
                                        {numberOfPosts ? (
                                            <i className='bx bxs-down-arrow'
                                                role="button"
                                                onClick={() => setNumberOfPosts(false)}></i>
                                        ) : (
                                            <i className='bx bxs-up-arrow'
                                                role="button"
                                                onClick={() => {
                                                    setNumberOfPosts(true)
                                                    setKudosCoinsAwarded(false)
                                                    setSentiment(false)
                                                }}></i>
                                        )}
                                        Number of Posts
                                    </th>
                                    <th>
                                        {sentiment ? (
                                            <i className='bx bxs-down-arrow'
                                                role="button"
                                                onClick={() => setSentiment(false)}></i>
                                        ) : (
                                            <i className='bx bxs-up-arrow'
                                                role="button"
                                                onClick={() => {
                                                    setNumberOfPosts(false)
                                                    setKudosCoinsAwarded(false)
                                                    setSentiment(true)
                                                }}></i>
                                        )}
                                        Average Sentiment
                                    </th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {watchlistData.length === 0 ? (
                                    <tr>
                                        <td colSpan={7}>
                                            Please add symbols to watchlist.
                                        </td>
                                    </tr>
                                ) : watchlistData.map((popularpost, key) => {
                                    return key < 3 ? <WatchListCardStar
                                        symbolData={popularpost} key={key} /> :
                                        <WatchListCardwitoutStar
                                            symbolData={popularpost} key={key} />
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </HorizontalLayout>

        </React.Fragment>
    )
}
export default withContext(
    ([
        {
            app: { watchload },
        },
        dispatch
    ]) => ({
        watchload: watchload,
        appWatchloadSwitch: () => appWatchloadSwitchAction(dispatch),
    }),
    Watchlist
)
