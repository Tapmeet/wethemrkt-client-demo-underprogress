import React, { useState ,useEffect} from "react"
import {
  Card,
  Nav,
  CardBody,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Table
} from "reactstrap"
import classnames from "classnames"

import {useHistory} from "react-router-dom";
import axiosHttpMiddelware from "common/axiosHttpMiddelware";
//Simple bar
import SimpleBar from "simplebar-react"


import Login from "../../../components/CommonForBoth/AuthenticationModel/Login"
import Signup from "../../../components/CommonForBoth/AuthenticationModel/Signup"
import "../../../../src/assets/scss/custom/wethemkrt/trendinguser.scss";
import Toaster from "components/Common/Toaster";

const TrendingUser = (props) => {
  const history = useHistory();
  const [activeTab, setactiveTab] = useState("1");
  const [isLogin, setIsLogin] = useState(true);
  const [modal_backdroplogin, setmodal_backdroplogin] = useState(false);
  const [modal_backdropsignup, setmodal_backdropsignup] = useState(false);
  const [kudosCoinData, setkudosCoinData] = useState([]);
  //var watchlistData = [];

  useEffect(() => {
    getKudosCoinAwarded();
  }, [])

  async function getKudosCoinAwarded() {
   
      // setIsLogin(true);
      setkudosCoinData([]);
      // axiosHttpMiddelware.get("/getTrendingKudosCoinUser").then((response) => {

        
      //   if (response.status == 200 && response.data.kudosCoinResponse == null) {
      //     setkudosCoinData([]);
      //   } else if (response.status == 200 && response.data.kudosCoinResponse!== undefined && response.data.kudosCoinResponse.length > 0) {
      //     setkudosCoinData(response.data.kudosCoinResponse);
      //   }
      //   else
      //   {
      //     setkudosCoinData([]);
      //   }
  

      // }).catch((err) => {
      //   console.log("Could not fetch trending users.");
      //   console.log(err);
      //   Toaster.errorToaster("Could not fetch trending users." , "Error");
      // })
      //const response = await kudoscoin.getTrendingKudosCoinUser();
    
  }

  function tog_backdroplogin() {
    setmodal_backdroplogin(true);
  }

  function tog_backdropsignup() {
    setmodal_backdropsignup(true);
  }

  function handleChangeLogin(value,issignup)
  {
    setmodal_backdroplogin(value);
    if (issignup) {
      tog_backdropsignup();
    }
  }

  function handleChangeSignup(value,islogin)
  {
    setmodal_backdropsignup(value);
    if (islogin) {
      tog_backdroplogin();
    }
  }

  const userprofile = (username,userid) => {
    history.push({pathname : `/viewprofile/${username}`,state: userid });
  }

  return (
    <React.Fragment>
    <div>
        <Card>
          <CardBody>
            <Nav tabs className="nav-tabs-custom nav-justified">
              <NavItem>
                <NavLink style={{ cursor: "pointer" }}
                  className={classnames({ active: activeTab === "1" })}
                  onClick={() => {
                    setactiveTab("1")
                  }}
                >
              <span className="d-none d-sm-block">Trending Users Kudos Coins</span>
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={activeTab} >
              <TabPane tabId="1">
                      <SimpleBar style={{ maxHeight: "330px" }}>
                  <div className="table-responsive pt-1">
                    <Table className="table align-middle table-nowrap">
                      <tbody>
                      <tr className="tabel-title">
                      <td>User</td>
                      <td>Kudos Coin Awarded</td>
                      </tr>
                      {kudosCoinData !== undefined && kudosCoinData.length > 0 ? kudosCoinData.map((element, key) =>
                        <tr key={key}>
                        <td>
                          <div>
                            <h5 className="font-size-14 mb-1 username" onClick={() => userprofile(element.username,element.userid)}>{element.username}</h5>
                            {/* <span onClick={() => userprofile(element.username,element.userid)}>See Profile</span> */}
                          </div>
                        </td>
                        <td className="d-flex justify-content-center">
                          <div className="text-end ">
                            <h5 className="font-size-14 text-muted mb-0 dollar-box">
                          <span className="px-1"> {element.coincount}</span>
                            </h5>
                          </div>
                        </td>
                      </tr>
                        ): null}
                      </tbody>
                    </Table>
                  </div>
                </SimpleBar>
              </TabPane>
            </TabContent>
          </CardBody>
        </Card> 
        {modal_backdroplogin && props.symbolData ? <Login onChange={handleChangeLogin} dataParentToChild={modal_backdroplogin} symbolData={props.symbolData}/> : null}
        {modal_backdropsignup && props.symbolData ? <Signup onChange={handleChangeSignup} dataParentToChild={modal_backdropsignup} symbolData={props.symbolData}/> : null}
        </div>
    </React.Fragment>
  )
}

export default TrendingUser
