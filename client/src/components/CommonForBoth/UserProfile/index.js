import React, { useEffect, useState } from "react"
import { Row, Col, Card } from "reactstrap"
import HorizontalLayout from "components/HorizontalLayout"
import ViewUserProfile from "./ViewUserProfile"
import UserPostCard from "./UserPostCard"
import UserFollowCard from "./UserFollowCard"
import axiosHttpMiddelware from "common/axiosHttpMiddelware"
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const UserProfileIndex = (props) => {
  const [loader, setLoader] = useState(false)
  const [username, setUsername] = useState(null);
  const [userPostData, setuserPostData] = useState([])
  const [searchuserInfo, setsearchuserInfo] = useState({
    id: "", email: "", name: "", about: "", preview: "", raw: "",
    isadmin: "", createddate: "", tradingtag: [], follower: [], following: []
  });
  useEffect(() => {
    getUsers();
  }, [username])
  async function getUsers() {
    if (username) {
      setLoader(true)
      axiosHttpMiddelware.post("/usergetbyusername", { username: username }).then((userResponse) => {
        if (userResponse !== undefined && userResponse.status === 200 && userResponse.data.userResponse !== null && userResponse.data.userResponse !== undefined) {
          setsearchuserInfo({
            id: userResponse.data.userResponse.id,
            name: userResponse.data.userResponse.username,
            email: userResponse.data.userResponse.email,
            about: userResponse.data.userResponse.about,
            raw: userResponse.data.userResponse.profilephoto,
            isadmin: userResponse.data.userResponse.isadmin,
            createddate: userResponse.data.userResponse.createdAt,
            preview: userResponse.data.userResponse.profilephoto,
            tradingtag: userResponse.data.userResponse.tradingstyles != null ? userResponse.data.userResponse.tradingstyles.split(',') :
              userResponse.data.userResponse.tradingstyles,
            follower: userResponse.data.userResponse.follower,
            following: userResponse.data.userResponse.following,
          });
          getUserPostList(userResponse.data.userResponse.id)
          setLoader(false)
        }
      }).catch((err) => {
        Toaster.errorToaster("Could not fetch user info", "Error");
      })
    }
  }
  const getUserPostList = async (userId) => {
    setuserPostData([])
    let user = null
    if (localStorage.getItem("user")) {
      user = JSON.parse(localStorage.getItem("user"))
    }
    axiosHttpMiddelware.get("/post/userDashboard", {
      params: { userId: userId, onlyUser: true },
    }).then((response) => {
      if (response.status === 200 && response.data.postData !== undefined) {
        setuserPostData(response.data.postData)
      } else {
        setuserPostData([])
      }
    }).catch((err) => {
      console.log(err)
    })
  }
  useEffect(() => {
    setUsername(props.match.params.username);
  }, [props.match.params.username])
  return (
    <React.Fragment>
      <HorizontalLayout>
        {loader ? <Skeleton count={20} /> : (
          <ViewUserProfile
            userPostData={userPostData}
            dataParentToChild={props} />
        )}
        <UserFollowCard data={searchuserInfo} dataParentToChild={props} />
        <UserPostCard
          userInfo={searchuserInfo}
          dataParentToChild={props} />
      </HorizontalLayout>
    </React.Fragment>
  )
}
export default UserProfileIndex
