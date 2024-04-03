import React, { useState, useEffect, useRef } from "react"
import {
  Col,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap"

import classnames from "classnames"

//import userpost from "../../services/post.service"
import "../../assets/scss/custom/wethemkrt/common.scss"
import "../../assets/scss/custom/wethemkrt/filter.scss"

import PeopleCard from "./post"
import axiosHttpMiddelware from "common/axiosHttpMiddelware"
import Toaster from "components/Common/Toaster"

const Feed = props => {
  
  const [userPostData, setuserPostData] = useState([])
  const [countUpdate, setcountUpdate] = useState(false)
  const [buttonRealTime, setbuttonRealTime] = useState(false)
  let intervalId = useRef(null)
  //var userPostData = '';


  useEffect(() => {
    getUserPostList()
    
  }, [countUpdate])

  async function getUserPostList() {
    if (localStorage.getItem("user")) {
      setuserPostData([])
      // const obj = JSON.parse(localStorage.getItem("user"))
      // axiosHttpMiddelware.post("/userpostget",{userid: obj.id}).then((response) => {
      //   if (
      //     response.status == 200 &&
      //     response.data.userPostResponse !== undefined 
      //   ) {
      //     setuserPostData(response.data.userPostResponse)
      //     //userPostData =  response.data.userPostResponse;
      //   } else {
      //     setuserPostData([])
      //   }
      // }).catch((err) => {
      // console.log(err);
      // Toaster.errorToaster("userpostget", "Error");
      // })
    //  const response = await userpost.getUserPost(obj.id)
      
    }
  }

  async function handleStart() {
    clearInterval(intervalId.current)

    // var timeinterval = 20 * 1000; //1 second
    // loadinterval= setInterval(()=>{
    //   getPostbyTimeFilter("RealTime");
    // },timeinterval)

    // setIntervalTime(loadinterval);
    intervalId.current = setInterval(() => {
      getPostbyTimeFilter("RealTime")
    }, 5000)
  }

  function handleReset() {
    clearInterval(intervalId.current)
  }

  async function getPostbyTimeFilter(tempfilterdata) {
    if (localStorage.getItem("user")) {
      setuserPostData([])
      const obj = JSON.parse(localStorage.getItem("user"))
      var filterdata = {
        userid: obj.id,
        filtervalue:
        tempfilterdata.target != undefined ? tempfilterdata.target.value : tempfilterdata,
      }
      if (filterdata == "Pause") {
        filterdata = ""
        setbuttonRealTime(true)
        handleReset()
        getUserPostList()
      } else {
        // axiosHttpMiddelware.post("/userpostgetbytimefilter",{filterdata}).then((response) => {

        //   if (
        //     response !== undefined &&
        //     response.data.filterResponse !== undefined &&
        //     response.status == 200 &&
        //     response.data.filterResponse.length > 0
        //   ) {
        //     setuserPostData(response.data.filterResponse)
        //     if (filterdata == "RealTime") {
        //       setbuttonRealTime(!buttonRealTime)
        //       handleStart()
        //     } else {
        //       filterdata = ""
        //       setbuttonRealTime(true)
        //       handleReset()
        //     }
        //   }
  


        // }).catch((err) => {

        //   console.log(err);
        //   Toaster.errorToaster(err.response,"Error");
        //   Toaster.errorToaster("userpostgetbytimefilter","Error");
          
        // })
        //const response = await userpost.getUserPostbyTimeFilter(newValues)
      }
    }
  }

  async function getPostbyTagFilter(filterdatabc) {
    if (localStorage.getItem("user")) {
      setuserPostData([])
      const obj = JSON.parse(localStorage.getItem("user"))

      var filterdata = {
        userid: obj.id,
        filtervalue: filterdatabc.target.value,
      }

      // axiosHttpMiddelware.post("/userpostgetbytagfilter",filterdata).then((response) => {
      //   if (
      //     response !== undefined &&
      //     response.data.filterResponse !== undefined &&
      //     response.status == 200 &&
      //     response.data.filterResponse.length > 0
      //   ) {
      //     setuserPostData(response.data.filterResponse)
      //     filterdata = ""
      //     setbuttonRealTime(true)
      //     handleReset()
      //   }
      // }).catch((err) => {

      // });

      //const response = await userpost.getUserPostbyTagFilter(newValues)

    }
  }

  async function handleChange(value, key) {
    if (localStorage.getItem("user")) {
      const obj = JSON.parse(localStorage.getItem("user"))

      if(value.userid == obj.id)
      {
          Toaster.errorToaster("You can't upvote your own post.", "Error");
      } else {
      var userPostData = {
        postid: value.id,
        userid: obj.id,
        kudosuserid: value.userid,
        upvote: key == "up" ? 1 : 0,
        downvote: key == "down" ? 1 : 0,
      }

      axiosHttpMiddelware.post("/updateuserpostvotecount",userPostData).then((response) => {
        setcountUpdate(!countUpdate)

      }).catch((err) => {

        console.log(err);

      })
    }
      //const response = await userpost.updateUserPostVoteCount(newValues)
    }
  }

  return (
    <React.Fragment>
      <div className="filter-body mt-3 filter-responsive">
        <div className="social-source m-3 d-flex align-items-center ">
          <div className="filter-ion">
            <i className="bx bx-filter-alt"></i>
          </div>
          <h5 className="font-size-16 m-0 pr-3 filter-by">Filter By :</h5>
          <div className="d-flex align-items-center filter-time">
            {/* who */}
            <label className="col-form-label">Who : </label>
            <select className="form-select top-drop">
              <option>All</option>
              <option>Following</option>
            </select>
            {/* what */}
            <label className="col-form-label">what : </label>
            <select
              className="form-select top-drop"
              onChange={e => getPostbyTagFilter(e)}
            >
              <option value="All">All</option>
              <option value="News">News</option>
              <option value="Fundamental">Fundamental</option>
              <option value="Technical">Technical</option>
              <option value="Questions">Questions</option>
            </select>
            {/* RealTime */}
            <h4 className="m-0">
              {buttonRealTime ? (
                <span
                  className="d-flex align-items-center"
                  onClick={() => getPostbyTimeFilter("RealTime")}
                >
                  Real Time<i className="bx bx-play font-size-24"></i>
                </span>
              ) : (
                <span
                  className="d-flex align-items-center"
                  onClick={() => getPostbyTimeFilter("Pause")}
                >
                  Pause<i className="bx bx-pause font-size-24"></i>
                </span>
              )}
            </h4>
            {/* Top */}
            <label className="col-form-label">Top : </label>
            <select
              className="form-select top-drop"
              onChange={e => getPostbyTimeFilter(e)}
            >
              <option>Real Time</option>
              <option value="24 HOURS">24hrs</option>
              <option value="7 Days">7 days</option>
              <option value="30 Days">30 days</option>
              <option value="1 Year">1 year</option>
            </select>
          </div>
        </div>
      </div>
      <Col xl="11">
            {userPostData.length > 0 ? (
              <PeopleCard userPostData={userPostData} onChange={handleChange} />
            ) : null}

      </Col>
    </React.Fragment>
  )
}

export default Feed
