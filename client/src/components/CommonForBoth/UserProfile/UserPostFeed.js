import React ,{ useState,useEffect,useRef} from "react"
import { Col, Nav,NavItem,
    NavLink,TabContent,
    TabPane} from "reactstrap"

import classnames from "classnames"

//import userpost from '../../../services/post.service';
import "../../../assets/scss/custom/wethemkrt/common.scss";
// import "../../assets/scss/custom/wethemkrt/filter.scss";
import UserPostCard from './UserPostCard';
import axiosHttpMiddelware from "common/axiosHttpMiddelware";
import Toaster from "components/Common/Toaster";

const UserPost = props => {
    const [customActiveTab, setcustomActiveTab] = useState("1")
    const [userPostData, setuserPostData] = useState([]);
    const [countUpdate, setcountUpdate] = useState(false);
    const [buttonRealTime, setbuttonRealTime] = useState(true);
    let intervalId = useRef(null);
    
    const toggleCustom = tab => {
        if (customActiveTab !== tab) {
          setcustomActiveTab(tab)
        }
      }

      useEffect(() => {
        getUserPostList();
      }, [props.dataParentToChild.location.state,countUpdate])

      async function getUserPostList() {
        if (props.dataParentToChild.location.state !== undefined && props.dataParentToChild.location.state !== null) {
           const obj = JSON.parse(localStorage.getItem("user"))
        
           /* axiosHttpMiddelware.post("/userpostgetbyid",{userid : obj.id}).then((response) => {

            if (response.status == 200 && response.data.userPostResponse!== undefined && response.data.userPostResponse.length > 0) {
              setuserPostData(response.data.userPostResponse);
            }
  

           }).catch((err) => {

           }) */
        //   const response = await userpost.getUserPostById(props.dataParentToChild.location.state);
        }
      }

      async function handleStart(){
        clearInterval(intervalId.current);  
            
        var timeinterval = 20 * 1000; //1 second
        loadinterval= setInterval(()=>{
          getPostbyTimeFilter("RealTime");
        },timeinterval)

        setIntervalTime(loadinterval);
        intervalId.current = setInterval(() => {
          getPostbyTimeFilter("RealTime");
        }, 5000)
      }

      function handleReset(){
        clearInterval(intervalId.current);  
      }

      async function getPostbyTimeFilter(tempFilterdata){
        if (localStorage.getItem("user")) {
          setuserPostData([]);
          const obj = JSON.parse(localStorage.getItem("user"))
          var filterdata = {
            userid : obj.id,
            filtervalue : tempFilterdata.target != undefined ? tempFilterdata.target.value : tempFilterdata
          }
          if (filterdata == "Pause") {
              filterdata = '';
              setbuttonRealTime(true);
              handleReset();
              getUserPostList();
          }
          else{
            // axiosHttpMiddelware.post("/userpostgetbytimefilter", { filterdata }).then((response) => {

            //   if (response !== undefined && response.data.filterResponse!== undefined && response.status == 200 && response.data.filterResponse.length > 0) {
            //     setuserPostData(response.data.filterResponse);
            //     if (filterdata == "RealTime") {
            //       setbuttonRealTime(!buttonRealTime);
            //       handleStart();
            //     }
            //     else{
            //       filterdata = '';
            //       setbuttonRealTime(true);
            //       handleReset();
            //     }
            //   }
  
            // }).catch((err) => {
            //   console.log(err);
            //   Toaster.errorToaster(err.data.response, "Error");
            // })
            //const response = await userpost.getUserPostbyTimeFilter(newValues);
          }
        }
      }

    async function getPostbyTagFilter(tempFilterdata){
      if (localStorage.getItem("user")) {
        setuserPostData([]);
        const obj = JSON.parse(localStorage.getItem("user"))
        
        var filterdata = {
          userid : obj.id,
          filtervalue : tempFilterdata.target.value
        }
        // axiosHttpMiddelware.post("/userpostgetbytagfilter",{filterdata}).then((response) => {

        //   if (response !== undefined && response.data.filterResponse!== undefined && response.status == 200 && response.data.filterResponse.length > 0) 
        //   {
        //     setuserPostData(response.data.filterResponse);
        //     filterdata = '';
        //     setbuttonRealTime(true);
        //     handleReset();
        //   }
  
        // }).catch((err) => {

        //   console.log(err);
        //   Toaster.errorToaster(err.data.response, "Error");

        // });
        //const response = await userpost.getUserPostbyTagFilter(filterdata);
      }
    }

    async function handleChange(value,key) {
      if (localStorage.getItem("user")) {
        const obj = JSON.parse(localStorage.getItem("user"))

        if(value.userid == obj.id)
        {
            Toaster.errorToaster("You can't upvote your own post.", "Error");
        } else {
      var userPostData = {
        postid : value.id,
        userid : obj.id,
        kudosuserid:value.userid,
        upvote : key == "up" ? 1 : 0,
        downvote : key == "down" ? 1 : 0,
      }
      axiosHttpMiddelware.post("/updateuserpostvotecount", { userPostData }).then((response) => {
        setcountUpdate(!countUpdate)
      }).catch((err) => {

        console.log(err);
        Toaster.errorToaster(err.data.response, "Error");


      })
      //const response = await userpost.updateUserPostVoteCount(newValues);
      
    }}
    }

  return (
    <React.Fragment>
     
      <Col className="col-lg-6 m-auto px-2 p-0">
      <div className="filter-body mt-3  filter-responsive">
        <div className="social-source m-3 d-flex align-items-center">
          <div className="filter-ion">
              <i className="bx bx-filter-alt"></i>
          </div>
          <h5 className="font-size-16 m-0 pr-3 filter-by">Filter By :</h5>
          <div className="d-flex align-items-center filter-time">
          {/* what */}
          <label className="col-form-label">what : </label>
            <select className="form-select top-drop" onChange={(e) => getPostbyTagFilter(e)}>              
              <option value="All">All</option>
              <option value="News">News</option>
              <option value="Fundamental">Fundamental</option>
              <option value="Technical">Technical</option>
              <option value="Questions">Questions</option>
            </select>
            {/* Top */}
            <label className="col-form-label">Top :  </label>
            <select className="form-select top-drop" onChange={(e) => getPostbyTimeFilter(e)}>
                <option value="24 HOURS">24hrs</option>
                <option value="7 Days">7 days</option>
                <option value="30 Days">30 days</option>
                <option value="1 Year">1 year</option>
            </select>
          </div>
          </div>
      </div>
        
   
              {userPostData.length > 0 ? <UserPostCard userPostData={userPostData} onChange={handleChange}/> : null}
    
        </Col>
    </React.Fragment>
  )
}

export default UserPost;
