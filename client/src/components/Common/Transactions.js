import React, { useState, useEffect } from "react"
import {
  Col,
  Card,
  Nav,
  CardBody,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Table,
  Button,
} from "reactstrap"
import classnames from "classnames"
import { Link } from "react-router-dom"

//Simple bar
import SimpleBar from "simplebar-react"

import { Sparklines, SparklinesLine } from "react-sparklines"

import bearImage from "../../assets/images/bear.png"
import bullImage from "../../assets/images/bull.png"

import axiosHttpMiddelware from "common/axiosHttpMiddelware"
import Login from "../CommonForBoth/AuthenticationModel/Login"
import Signup from "../CommonForBoth/AuthenticationModel/Signup"
import "../../../src/assets/scss/custom/wethemkrt/transaction.scss"
import Toaster from "components/Common/Toaster"
import { resolveConfig } from "prettier"
import axiosAuthHttpMiddelware from "common/axiosAuthHttpMiddelware"

const Transactions = props => {
  const [activeTab, setactiveTab] = useState("1")
  const [isLogin, setIsLogin] = useState(false)
  const [numberofpostData, setnumberofpostData] = useState([])
  const [kudoscoinData, setkudoscoinData] = useState([])
  const [sentimentData, setsentimentData] = useState([])
  const [modal_backdroplogin, setmodal_backdroplogin] = useState(false)
  const [modal_backdropsignup, setmodal_backdropsignup] = useState(false)
  const [isBullish, setisBullish] = useState(true)
  //var watchlistData = [];

  useEffect(() => {
   
    getNumberofPost()
    getNumerofPostbyTimeFilter("24 HOURS")
    getKudosCoinAwarded()
    getSentiment("bullish")
  }, [props.dataParentToChild])

 

  async function getNumberofPost() {
    if (localStorage.getItem("user")) {
      setIsLogin(true)

      // axiosHttpMiddelware.get("/getSymbolCountByPost").then((response) => {
        
      //   if(response.status == 200 && response.data.symbolPostResponse === null)
      //   {
      //     setnumberofpostData([])
      //   }
      //   else if (
      //     response.status == 200 && response.data.symbolPostResponse !== undefined && response.data.symbolPostResponse.length > 0 ) {          
      //     setnumberofpostData(response.data.symbolPostResponse)
      //   } else {
      //     setnumberofpostData([])
      //   }
  
      // }).catch((err) => {
      //   console.log(err);
      //   console.log("getSymbolCountByPost transcation.js");
      //   Toaster.errorToaster(err.response,"Error");
      // })

     // const response = await symbol.getSymbolCountByPost()
    }
  }

  async function getKudosCoinAwarded() {
    if (localStorage.getItem("user")) {

      setkudoscoinData([])
      // setIsLogin(true);

      // axiosHttpMiddelware.get("/getKudosCountByPost").then((response) => {

      //   //console.log("getKudosCountByPost");
      //   //console.log(response);

      //   if ( response.status == 200 && response.data.kudosCoinResponse === null) {
      //     setkudoscoinData([])
      //   }
      //   else if ( response.status == 200 && response.data.kudosCoinResponse !== undefined && response.data.kudosCoinResponse.length > 0
      //   ) {
      //     setkudoscoinData(response.data.kudosCoinResponse)
      //   }else if ( rresponse.status == 200 && response.data.kudosCoinResponse === null) {
      //     setkudoscoinData([])
      //   } else {
      //     setkudoscoinData([])
      //   }
      // }).catch((err) => {
      //   console.log("getKudosCoinAwarded");
      //   Toaster.errorToaster(err.response,"Error");
      // })

     // const response = await kudoscoin.getKudosCountByPost()

    }
  }

  async function getSentiment(sentimentData) {
    if (localStorage.getItem("user")) {
      // setIsLogin(true);
      // var sentimentData = "bullish";
      setisBullish(sentimentData == "bullish" ? true : false)
      let sentiment = sentimentData;
      setsentimentData([])
      // axiosHttpMiddelware.post("/getSentimentCountByPost",{sentiment}).then((response) => {

      //   // console.log("getSentimentCountByPost");
      //   // console.log(response);
      //   if( response.status == 200 && response.data.sentimentResponse === null ){
      //     setsentimentData([])
      //   }
      //   else if (
      //     response.status == 200 &&
      //     response.data.sentimentResponse !== undefined &&
      //     response.data.sentimentResponse.length > 0
      //   ) {
      //     //debugger;
      //     setsentimentData(response.data.sentimentResponse)
      //   } else {
      //     setsentimentData([])
      //   }
  
      // }).catch((err) => {
      //   console.log("getSentimentCountByPost")
      //   Toaster.errorToaster(err.response,"Error");

      // });

      // const response = await sentiment.getSentimentCountByPost(sentimentData)
    }
  }

   async function getSymboleQuote(response){
    for (const element of response) {
     
      var symboleData ={
        symbolname : element.symbolename,
        modules : "financialData"
      }


      axiosHttpMiddelware.post("/symbolQuoteSummary",{ symboleData }).then((response) => {

        console.log("symbolQuoteSummary");
        console.log(response);

          if (response.status == 200 && response.data.symbolResponse!== undefined && response.data.symbolResponse.length > 0)
          {
            setwatchlistData({"symbolename":element.symbolename,"currentprice":response.data.symbolResponse[0].financialData.currentPrice.fmt});
          }
          else{
            setwatchlistData({"symbolename":element.symbolename,"currentprice":0});
          }

        }).catch((err) => {
          console.log("symboleQuoteSummary")
          Toaster.errorToaster(err.response,"Error");

        })

      // const quouteresponse = await symbol.getSymbolQuoteSummary(symboleData);


    }
  }

  async function getNumerofPostbyTagFilter(tempFilterData) {
    if (localStorage.getItem("user")) {
      setnumberofpostData([])

      //let temoFilterdata = filterdata;
      var filtervalue = {
        filtervalue: tempFilterData.target.value,
      }

      let filterdata = filtervalue;
      axiosHttpMiddelware.post("/getSymbolCountByTagFilter", { filterdata }).then((response) => {

        if (
          response !== undefined &&
          response.data.filterResponse !== undefined &&
          response.status == 200 &&
          response.data.filterResponse.length > 0
        ) {
          setnumberofpostData(response.data.filterResponse)
          filterdata = ""
        }
  
      }).catch((err) => {
        console.log("getSymbolCountByTagFilter")
        

        Toaster.errorToaster(err.response,"Error");
      })

     // const response = await symbol.getSymbolCountByTagFilter(newValues)
    }
  }

  async function getNumerofPostbyTimeFilter(tempFilterData) {
    if (localStorage.getItem("user")) {
      setIsLogin(true)
      setnumberofpostData([])
      
      //let tempfilterData = filterdata;

      var filtervalueadf = {
        filtervalue:
        tempFilterData.target != undefined ? tempFilterData.target.value : tempFilterData,
      }

      let filterdata = filtervalueadf;
      // axiosHttpMiddelware.post("/getSymbolCountByTimeFilter",{filterdata}).then((response) => {
      //   if (
      //     response !== undefined &&
      //     response.data.filterResponse !== undefined &&
      //     response.status == 200 &&
      //     response.data.filterResponse.length > 0
      //   ) {
      //     setnumberofpostData(response.data.filterResponse)
      //     filterdata = ""
      //   }
  
      // }).catch((err) => {
      //   console.log("getSymbolCountByTimeFilter")

      //   Toaster.errorToaster(err.response,"Error");

      // }) 
      //const response = await symbol.getSymbolCountByTimeFilter(newValues)
    }
  }

  async function getKudosCountByTagFilter(filterdata) {
    let tempFilterData = filterdata;
    if (localStorage.getItem("user")) {
      setkudoscoinData([])

      let filterdata = {
        filtervalue: tempFilterData.target.value,
      }

      

      // axiosHttpMiddelware.post("/getKudosCountByTagFilter", {filterdata}).then((response) => {
      //   if (
      //     response !== undefined &&
      //     response.data.filterResponse !== undefined &&
      //     response.status == 200 &&
      //     response.data.filterResponse.length > 0
      //   ) {
      //     setkudoscoinData(response.data.filterResponse)
      //     filterdata = ""
      //   }else if ( response.status == 400 ) {
      //     setkudoscoinData(response.data.filterResponse)
      //   }

      // }).catch((err) => {
      //   console.log("getKudosCountByTagFilter")

      //   Toaster.errorToaster(err.response,"Error");


      // })

      // const response = await kudoscoin.getKudosCountByTagFilter(newValues)
     
    }
  }

  async function getKudosCountByTimeFilter(filterdata) {
    if (localStorage.getItem("user")) {
      setkudoscoinData([])
      var newValues = {
        filtervalue:
          filterdata.target != undefined ? filterdata.target.value : filterdata,
      }

      // axiosHttpMiddelware.post("/getKudosCountByTimeFilter", {newValues}).then((response) => {
      //   if (
      //     response !== undefined &&
      //     response.data.filterResponse !== undefined &&
      //     response.status == 200 &&
      //     response.data.filterResponse.length > 0
      //   ) {
      //     setkudoscoinData(response.data.filterResponse)
      //     filterdata = ""
      //   }else if ( response.status == 400 ) {
      //     setkudoscoinData([])
      //   }

      // }).catch((err) => {
        
      //   console.log("getKudosCountByTimeFilter");
      //   Toaster.errorToaster(err.response,"Error");


      // })

      // const response = await kudoscoin.getKudosCountByTimeFilter(newValues)
    
    }
  }

  async function getSentimentCountByTagFilter(filterdata) {
    if (localStorage.getItem("user")) {
      setsentimentData([])

      var newValues = {
        filtervalue: filterdata.target.value,
      }


      axiosHttpMiddelware.post("/getSentimentCountByTagFilter", {newValues}).then((response) => {
        if (
          response !== undefined &&
          response.data.filterResponse !== undefined &&
          response.status == 200 &&
          response.data.filterResponse.length > 0
        ) {
          setsentimentData(response.data.filterResponse)
          filterdata = ""
        }

      }).catch((err) => {
        
        console.log("getSentimentCountByTagFilter");
        Toaster.errorToaster(err.response,"Error");


      })


      // const response = await sentiment.getSentimentCountByTagFilter(newValues)
      // if (
      //   response !== undefined &&
      //   response.data.filterResponse !== undefined &&
      //   response.status == 200 &&
      //   response.data.filterResponse.length > 0
      // ) {
      //   setsentimentData(response.data.filterResponse)
      //   filterdata = ""
      // }
    }
  }

  async function getSentimentCountByTimeFilter(filterdata) {
    if (localStorage.getItem("user")) {
      setsentimentData([])
      var newValues = {
        filtervalue:
          filterdata.target != undefined ? filterdata.target.value : filterdata,
      }

      axiosHttpMiddelware.post("/getSentimentCountByTimeFilter", {newValues}).then((response) => {
        if (
          response !== undefined &&
          response.data.filterResponse !== undefined &&
          response.status == 200 &&
          response.data.filterResponse.length > 0
        ) {
          setsentimentData(response.data.filterResponse)
          filterdata = ""
        }

      }).catch((err) => {
        console.log("getSentimentCountByTimeFilter");
        Toaster.errorToaster(err.response,"Error");


      })

      // const response = await sentiment.getSentimentCountByTimeFilter(newValues)
      // if (
      //   response !== undefined &&
      //   response.data.filterResponse !== undefined &&
      //   response.status == 200 &&
      //   response.data.filterResponse.length > 0
      // ) {
      //   setsentimentData(response.data.filterResponse)
      //   filterdata = ""
      // }
    }
  }

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

  return (
    <React.Fragment>
      <div>
        {isLogin ? (
          <Card>
            <CardBody>
              <Nav tabs className="nav-tabs-custom nav-justified">
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames({ active: activeTab === "1" })}
                    onClick={() => {
                      setactiveTab("1")
                    }}
                  >
                    <span>Number of Posts</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames({ active: activeTab === "2" })}
                    onClick={() => {
                      setactiveTab("2")
                    }}
                  >
                    <span>Kudos Coins Awarded</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames({ active: activeTab === "3" })}
                    onClick={() => {
                      setactiveTab("3")
                    }}
                  >
                    <span>Sentimenet Change</span>
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={activeTab} className="">
                <TabPane tabId="1">
                  <div className="row pt-2">
                    <div className="col-md-4 col-6">
                      <select
                        className="form-select top-drop w-100"
                        onChange={e => getNumerofPostbyTagFilter(e)}
                      >
                        <option value="All">All</option>
                        <option value="Fundamental">Fundamental</option>
                        <option value="Technical">Technical</option>
                      </select>
                    </div>
                    <div className="col-md-4 col-6">
                      <select
                        className="form-select top-drop w-100"
                        onChange={e => getNumerofPostbyTimeFilter(e)}
                      >
                        <option value="24 HOURS"> 24 Hours</option>
                        <option value="7 Days">1 week</option>
                        <option value="30 Days">1 month</option>
                      </select>
                    </div>
                  </div>
                  <SimpleBar style={{ maxHeight: "330px" }}>
                    <div className="table-responsive pt-1 text-center">
                      <Table className="table align-middle table-nowrap">
                        <tbody>
                          <tr className="tabel-title">
                            <td>Stock</td>
                            <td>Post Current Period</td>
                          </tr>
                          {numberofpostData !== undefined &&
                          numberofpostData.length > 0
                            ? numberofpostData.map((element, key) => (
                                <tr key={key}>
                                  <td>
                                    <div>
                                      <h5 className="font-size-14 mb-1">
                                        {element.symbolename}
                                      </h5>
                                      <span>
                                        <a
                                          href={"/feed/" + element.symbolename}
                                        >
                                          View post
                                        </a>
                                      </span>
                                    </div>
                                  </td>
                                  <td>
                                    <div>
                                      <h5 className="font-size-14 text-muted mb-0">
                                        {element.postcount}
                                      </h5>
                                    </div>
                                  </td>
                                  {/* <td>
                      <span><a href={"/feed/"+ element.symbolename}>
                      <button type="button" className="btn btn-primary btn-sm waves-effect waves-light">View post</button></a></span>
                      
                      </td> */}
                                </tr>
                              ))
                            : null}
                        </tbody>
                      </Table>
                    </div>
                  </SimpleBar>
                </TabPane>
                <TabPane tabId="2">
                  <div className="row pt-2">
                    <div className="col-md-4 col-6">
                      <select
                        className="form-select top-drop w-100"
                        onChange={e => getKudosCountByTagFilter(e)}
                      >
                        <option value="All">All</option>
                        <option value="Fundamental">Fundamental</option>
                        <option value="Technical">Technical</option>
                      </select>
                    </div>
                    <div className="col-md-4 col-6">
                      <select
                        className="form-select top-drop w-100"
                        onChange={e => getKudosCountByTimeFilter(e)}
                      >
                        <option value="24 HOURS">24 Hours</option>
                        <option value="7 Days">1 week</option>
                        <option value="30 Days">1 month</option>
                      </select>
                    </div>
                  </div>
                  <SimpleBar style={{ maxHeight: "330px" }}>
                    <div className="table-responsive pt-1 text-center">
                      <Table className="table align-middle table-nowrap">
                        <tbody>
                          <tr className="tabel-title">
                            <td>Stock</td>
                            <td>Kudos Point Awarded</td>
                          </tr>
                          {kudoscoinData === null ? <h3> No data </h3> : <></>}
                          {kudoscoinData !== undefined &&
                          kudoscoinData.length > 0
                            ? kudoscoinData.map((element, key) => (
                                <tr key={key}>
                                  <td>
                                    <div>
                                      <h5 className="font-size-14 mb-1">
                                        {element.symbolename}
                                      </h5>
                                      <span>
                                        <a
                                          href={"/feed/" + element.symbolename}
                                        >
                                          see post
                                        </a>
                                      </span>
                                    </div>
                                  </td>
                                  <td>
                                    <div>
                                      <h5 className="font-size-14 text-muted mb-0">
                                        {element.coincount}
                                      </h5>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            : null}
                        </tbody>
                      </Table>
                    </div>
                  </SimpleBar>
                </TabPane>
                <TabPane tabId="3">
                  <div className="row pt-2">
                    <div className="col-4">
                      <select
                        className="form-select top-drop w-100"
                        onChange={e => getSentimentCountByTagFilter(e)}
                      >
                        <option value="All">All</option>
                        <option value="Fundamental">Fundamental</option>
                        <option value="Technical">Technical</option>
                      </select>
                    </div>
                    <div className="col-4">
                      <select
                        className="form-select top-drop w-100"
                        onChange={e => getSentimentCountByTimeFilter(e)}
                      >
                        <option value="24 HOURS">24 Hours</option>
                        <option value="7 Days">1 week</option>
                        <option value="30 Days">1 month</option>
                      </select>
                    </div>
                    <div className="col-4 d-flex justify-content-center align-items-center">
                      <i
                        className="mdi mdi-arrow-up-bold up-icon"
                        onClick={e => getSentiment("bullish")}
                      ></i>
                      <i
                        className="mdi mdi-arrow-down-bold down-icon"
                        onClick={e => getSentiment("bearish")}
                      ></i>
                    </div>
                  </div>
                  <SimpleBar style={{ maxHeight: "330px" }}>
                    <div className="table-responsive text-center">
                      <Table className="table align-middle table-nowrap">
                        <tbody>
                          <tr className="tabel-title">
                            <td>Stock</td>
                            <td>Avg Post Sentiment</td>
                          </tr>
                          {sentimentData !== undefined &&
                          sentimentData.length > 0
                            ? sentimentData.map((element, key) => (
                                <tr key={key}>
                                  <td>
                                    <div>
                                      <h5 className="font-size-14 mb-1">
                                        {element.symbolename}
                                      </h5>
                                      <span>
                                        <a
                                          href={"/feed/" + element.symbolename}
                                        >
                                          see post
                                        </a>
                                      </span>
                                    </div>
                                  </td>
                                  <td>
                                    <div>
                                      <h5 className="font-size-14 text-muted mb-0">
                                        <img
                                          src={
                                            isBullish ? bullImage : bearImage
                                          }
                                          height="25"
                                          width="25"
                                          className="mx-3"
                                        ></img>
                                        {element.sentiment}
                                      </h5>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            : null}
                        </tbody>
                      </Table>
                    </div>
                  </SimpleBar>
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        ) : (
          <Card className="st_aVIfaYY">
            <CardBody>
              <div className="Watchlist">
                <div className="Watchlist-border">
                  <h5>Watchlist</h5>
                </div>
              </div>
              <div>
                <h4 className="watchlist-title">Watchlist</h4>
                <p className="watchlist-text m-0">
                  Sign up to Wethemrkt to save a watchlist for easy access to
                  your favorite stocks
                </p>
              </div>
              <div className="dropdown d-inline-block">
                <Button
                  color=""
                  className="mt-4 btn-login"
                  onClick={() => {
                    tog_backdroplogin()
                  }}
                >
                  {" "}
                  Login{" "}
                </Button>
                <Button
                  color=""
                  className="mt-4 ms-2 btn-sign-up"
                  onClick={() => {
                    tog_backdropsignup()
                  }}
                >
                  {" "}
                  Sign Up{" "}
                </Button>
              </div>
            </CardBody>
          </Card>
        )}
        {modal_backdroplogin && props.symbolData ? (
          <Login
            onChange={handleChangeLogin}
            dataParentToChild={modal_backdroplogin}
            symbolData={props.symbolData}
          />
        ) : null}
        {modal_backdropsignup && props.symbolData ? (
          <Signup
            onChange={handleChangeSignup}
            dataParentToChild={modal_backdropsignup}
            symbolData={props.symbolData}
          />
        ) : null}
      </div>
    </React.Fragment>
  )
}

export default Transactions
