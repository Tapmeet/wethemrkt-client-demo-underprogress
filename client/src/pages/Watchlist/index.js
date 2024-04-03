import React, { useState, useEffect, Component } from "react"
import Toaster from "components/Common/Toaster";
import axiosAuthHttpMiddelware from "common/axiosAuthHttpMiddelware";
import { Link } from "react-router-dom"
import { ListGroup, ListGroupItem } from "reactstrap"
import Star from "../../assets/images/star.png"
import "./watchlist.css"
import { withContext } from '../../context/index'
import { appWatchloadSwitch as appWatchloadSwitchAction } from '../../store/actions/appActions'
import { useHistory } from "react-router-dom"

const Watchlist = ({ watchload, appWatchloadSwitch }) => {
    const history = useHistory()
    const [watchlistData, setwatchlistData] = useState([]);
    const WatchListCardStar = (symbolData) => {
        function deleteButtonClicked(symbol) {
            if (localStorage.getItem("user")) {
                const userData = JSON.parse(localStorage.getItem("user"))
                let watchlistData = {
                    symbolename: symbol.content,
                    userid: userData.id
                }
                axiosAuthHttpMiddelware.post("watchlistdelete", { watchlistData }).then((resp) => {
                    Toaster.successToaster("", "Success");
                    getWatchlistByUser();
                    appWatchloadSwitch();
                }).catch((err) => {
                    Toaster.errorToaster("", "Error")
                });
            }
        }
        if (symbolData && symbolData.length > 0) {
            return symbolData.map((symbol, index) => {
                return (
                    <div key={index}>
                        <ListGroupItem>
                            <Link to={"/feed/" + symbol.content} className="text-dark ml-2 pl-2" key={symbol.key}>
                                {index < 3 && (
                                    <div className="avatar-xs me-3" style={{ display: "inline-block" }}>
                                        <img src={Star} alt="" height="32" />
                                    </div>
                                )} <span className="ps-2">{symbol.content}</span>
                            </Link>
                            <div className="float-end">
                                <button type="button" className="ml-2 btn" onClick={() => deleteButtonClicked(symbol)} ><i className="bx bx-trash"></i>{" "}</button>
                            </div>
                        </ListGroupItem>
                    </div>
                )
            })
        }
    };
    useEffect(() => {
        getWatchlistByUser()
    },[watchload])
    useEffect(() => {
        getWatchlistByUser();
    }, [])
    function getWatchlistByUser() {
        if (localStorage.getItem("user")) {
            const obj = JSON.parse(localStorage.getItem("user"));
            axiosAuthHttpMiddelware.get("watchlist", { userid: obj.id }).then((response) => {
                if (response.data.watchlistResponse !== undefined && response.data.watchlistResponse !== null) {
                    if (response.data.watchlistResponse !== '') {
                        let symbolsTwo = response.data.watchlistResponse;
                        let data = symbolsTwo.map((val, index) => (
                            {
                                id: `${index}`,
                                key: `index-${index}`,
                                content: `${val.symbol}`.replace('$', '')
                            }))
                        setwatchlistData(data);
                    }
                    else {
                        setwatchlistData([]);
                    }
                }
                else {
                    setwatchlistData([]);
                }
            }).catch((err) => {
                history.push(`/logout`)
                console.error(err);
            })
        }
    }
    return (
        <>
            {watchlistData.length === 0 ? <h5> Please add symbols to watchlist.</h5> :
                <ListGroup>
                    {WatchListCardStar(watchlistData)}
                </ListGroup>
            }
        </>
    );
}
export default withContext(
	([
		{
			app: { watchload },
        },
        dispatch
	]) => ({
        watchload: watchload,
        appWatchloadSwitch: () => appWatchloadSwitchAction(dispatch)
	}),
	Watchlist,
)