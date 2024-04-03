import { useEffect, useState } from "react"
import parse from "html-react-parser"
import axiosAuthHttpMiddelware from "common/axiosAuthHttpMiddelware"
import axiosHttpMiddelware from "common/axiosHttpMiddelware"

import bearImage from "../../assets/images/bear.png"
import bullImage from "../../assets/images/bull.png"
import RetweetModal from "./RetweetModal"
import "toastr/build/toastr.min.css"
import "../../assets/scss/custom/wethemkrt/people.scss"
import "../../assets/scss/custom/wethemkrt/link-preview.scss"
import "./PostListDashboard.scss"
import Toaster from "./Toaster"
import ModalImage from "react-modal-image"
import 'react-loading-skeleton/dist/skeleton.css'
import moment from 'moment'
import Linkify from "react-linkify"
import Skeleton from 'react-loading-skeleton'
import upArrowGray from "../../assets/images/up-arrow-gray.svg"
import upArrowGreen from "../../assets/images/up-arrow-green.svg"
import upArrowAllowed from "../../assets/images/up-arrow-allowed.svg"
import downArrowGray from "../../assets/images/down-arrow-gray.svg"
import downArrowRed from "../../assets/images/down-arrow-red.svg"
import downArrowAllowed from "../../assets/images/down-arrow-allowed.svg"

const PostListReply = ({ post }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [upvotes, setUpvotes] = useState([])
    const [downvotes, setDownvotes] = useState([])
    const [showVote, setShowVote] = useState(true)
    const [userPostData, setuserPostData] = useState([])
    const [userInfo, setUserInfo] = useState(null)
    const [userData, setUserData] = useState(null)
    const [isLogin, setIsLogin] = useState(false)
    const [postAction, setPostAction] = useState(false)

    const getUserInfo = (user) => {
        axiosHttpMiddelware.post("/usergetbyid", { userid: user.id }).then((userResponse) => {
            setUserInfo(userResponse.data.userResponse)
        })
    }
    function diffMinutes(dt2, dt1) {

        var diff = (new Date(dt2).getTime() - new Date(dt1).getTime()) / 1000;
        diff /= 60;
        return Math.abs(Math.round(diff));

    }
    function isJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    const postDelete = (postguid) => {
        if (localStorage.getItem("user")) {
            axiosAuthHttpMiddelware.post("/post/delete", {
                postguid: postguid
            }).then((response) => {
                if (response.status == 200) {
                    Toaster.successToaster("Vote deleted successfully", "Success!")
                    setuserPostData([])
                    setScroll(true)
                    setPageNo(0)
                    postReloadSwitch()
                }
            }).catch((err) => {
                console.log(err)
            })
        }
    }
    const getUserPostList = async () => {
        setIsLoading(true)
        let postguid = post.postguid ?? null;
        let authUser = {
            id: 0
        }
        if (localStorage.getItem("user")) {
            authUser = JSON.parse(localStorage.getItem("user"))
        }
        axiosHttpMiddelware.get("/post/userDashboard", {
            params: { postguid: postguid, userId: authUser.id },
        }).then((response) => {
            if (response.status === 200 && response.data.postData !== undefined && response.data.postData !== '' && response.data.postData !== null) {
                if (response.data.postData.length) {
                    setuserPostData(response.data.postData)
                    setIsLoading(false)
                    setPostAction(true)
                    setTimeout(() => {
                        setPostAction(false)
                    }, 300000);
                }
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    const isNotFollowing = (userId) => {
        for (let i = 0; i < userInfo.following.length; i++) {
            const element = userInfo.following[i];
            if (element.userId == userId) {
                return false;
            }
        }
        return true;
    }

    useEffect(() => {
        let user = JSON.parse(localStorage.getItem("user"))
        setIsLogin(true)
        getUserInfo(user)
        setUserData(user)
        getUserPostList()
    }, [])

    const isUpVoteAllowed = (post, userData, key) => {
        if (userData == null) {
            return false
        }
        let voteUsers = post.vote_users ? JSON.parse(post.vote_users) : []
        if (voteUsers == null) {
            voteUsers = []
        }
        return (post.username !== userData.username && !voteUsers.includes(userData.id) && addVote(key) <= 0)
    }
    const upVote = (key, postguid, status) => {
        setShowVote(false)
        if (localStorage.getItem("user")) {
            axiosAuthHttpMiddelware.post("/post/upvote", {
                upvote: status,
                postguid: postguid,
                userId: userData.id
            }).then((response) => {
                if (response.status == 200) {
                    Toaster.successToaster("Vote updated successfully", "Success!")
                    if (status) {
                        const index = downvotes.indexOf(key);
                        if (index > -1) {
                            downvotes.splice(index, 1)
                            setDownvotes(downvotes);
                        }
                        else {
                            setUpvotes((upvotes) => [...upvotes, key])
                        }
                    } else {
                        const index = upvotes.indexOf(key);
                        if (index > -1) {
                            upvotes.splice(index, 1)
                            setUpvotes(upvotes);
                        }
                        else {
                            setDownvotes((downvotes) => [...downvotes, key])
                        }
                    }
                    setTimeout(() => {
                        setShowVote(true)
                    }, 500);
                }
            }).catch((err) => {
                console.log(err)
            })
        }
    }

    const addedVote = (votes, key) => {
        let votesCount = votes
        votesCount = votesCount + addVote(key)
        return votesCount
    }
    const addVote = (key) => {
        const downindex = downvotes.indexOf(key);
        if (downindex > -1) {
            return -1
        }
        const upindex = upvotes.indexOf(key);
        if (upindex > -1) {
            return 1
        }
        return 0
    }

    const isDownVoteAllowed = (post, userData, key) => {
        if (userData == null) {
            return false
        }
        let voteUsers = post.down_vote_users ? JSON.parse(post.down_vote_users) : []
        if (voteUsers == null) {
            voteUsers = []
        }
        return post.username !== userData.username && !voteUsers.includes(userData.id) && addVote(key) >= 0
    }

    const getUpvoteIcon = (post, userData, key) => {
        if (userData == null) {
            return upArrowGray
        }
        if (isUpVoteAllowed(post, userData, key)) {
            return upArrowGray
        } else {
            let voteUsers = post.vote_users ? JSON.parse(post.vote_users) : []
            if (voteUsers.includes(userData.id) || addVote(key) > 0) {
                return upArrowGreen
            } else {
                return upArrowGray
            }
        }
    }
    const getDownvoteIcon = (post, userData, key) => {
        if (userData == null) {
            return downArrowGray
        }
        if (isDownVoteAllowed(post, userData, key)) {
            return downArrowGray
        } else {
            let voteUsers = post.down_vote_users ? JSON.parse(post.down_vote_users) : []
            if (voteUsers.includes(userData.id) || addVote(key) < 0) {
                return downArrowRed
            } else {
                return downArrowGray
            }
        }
    }

    return (
        <>
            {userPostData.length > 0 && userPostData.map((element, key) => {
                return (
                    <div key={key} className="ct-postbox" >
                        <div className="userpost-box">
                            <div className="usbox-profile">
                                {element.profilephoto ? (
                                    <img
                                        className="rounded-circle header-profile-user"
                                        src={element.profilephoto}
                                        alt="Header Avatar"
                                    />
                                ) : (
                                    <div className="text-center circle-shadow-a bg-gray">
                                        <i className="rounded-circle bx bx-user font-size-20 align-middle mt-4" />
                                    </div>
                                )}
                            </div>
                            <div className="usbox-right-content">
                                <div className="ubox-top">
                                    <div className="usb-info">
                                        <h5
                                            className="m-0 text-transform tooltipyy">
                                            {element.username}
                                            <span className="dollar-box ms-2" style={{ position: "relative", top: "3px" }}>
                                                <i className="bx bx-dollar-circle dollar-icon-uesr"></i>{" "}
                                                <span className="dollar-count ms-2">
                                                    {" "}
                                                    {(element.kudoscoin) > 0 ? element.kudoscoin : 0}{" "}
                                                </span>
                                            </span>
                                            <span className="font-size-12 text-muted ms-4 mt-1">
                                                {moment(element.postcreatedat).format("DD/MM/YYYY HH:mm")}
                                            </span>
                                        </h5>

                                        <h6 style={{ overflowWrap: "break-word" }}><Linkify
                                            componentDecorator={(decoratedHref, decoratedText, key) => (
                                                <a target="blank" href={decoratedHref} key={key}>
                                                    {decoratedText}
                                                </a>
                                            )}
                                        >{parse(element.posthtmldata)}</Linkify></h6>
                                    </div>
                                    {/* <div>
                                        {userInfo && (
                                            <>
                                                {element.username !== userData.username && (
                                                    <>
                                                        {isNotFollowing(element.user_id) ? (
                                                            <button
                                                                type="button"
                                                                className="theme-btn pb-btn"
                                                                onClick={() => { followUser(element.user_id); }}
                                                            >
                                                                Follow
                                                            </button>
                                                        ) :
                                                            (
                                                                <button
                                                                    type="button"
                                                                    className="theme-btn pb-btn"
                                                                    onClick={() => { unFollowUser(element.user_id); }}
                                                                >
                                                                    Unfollow
                                                                </button>
                                                            )}
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </div> */}
                                    <div>
                                        {(diffMinutes(element.now, element.postcreatedat) <= 5 && isLogin && postAction && element.username == userData.username) && (
                                            <>
                                                <i className='bx bxs-message-square-edit' role="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setPost(element)
                                                        togglePostModal()
                                                    }}></i>
                                                <i className='bx bxs-trash' role="button" onClick={(e) => {
                                                    e.preventDefault();
                                                    postDelete(element.postguid);
                                                }}></i>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="userpost-box">
                            <div className="arrow-box">
                                <div className="short-arw-box topar-box">
                                    <img style={{ width: 40 }} className={isUpVoteAllowed(element, userData, key) ? '' : 'disabled'}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (isUpVoteAllowed(element, userData, key)) {
                                                upVote(key, element.postguid, true);
                                            }
                                        }}
                                        role="button" src={getUpvoteIcon(element, userData, key)}
                                        onMouseOver={(e) => {
                                            if (isUpVoteAllowed(element, userData, key)) {
                                                e.currentTarget.src = upArrowAllowed
                                            }
                                        }}
                                        onMouseOut={(e) => {
                                            if (isUpVoteAllowed(element, userData, key)) {
                                                e.currentTarget.src = upArrowGray
                                            }
                                        }} />
                                </div>
                                {showVote && (
                                    <div className="short-arw-box">
                                        {addedVote(element.votes, key)}
                                    </div>
                                )}
                                <div className="short-arw-box downar-box">
                                    <img style={{ width: 40 }} className={isDownVoteAllowed(element, userData, key) ? '' : 'disabled'}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (isDownVoteAllowed(element, userData, key)) {
                                                upVote(key, element.postguid, false);
                                            }
                                        }} role="button" src={getDownvoteIcon(element, userData, key)}
                                        onMouseOver={(e) => {
                                            if (isDownVoteAllowed(element, userData, key)) {
                                                e.currentTarget.src = downArrowAllowed
                                            }
                                        }}
                                        onMouseOut={(e) => {
                                            if (isDownVoteAllowed(element, userData, key)) {
                                                e.currentTarget.src = downArrowGray
                                            }
                                        }} />
                                </div>
                            </div>
                            <div className="usbox-right-content">
                                <div className="details-imagebox">
                                    {element.imagedata ? (
                                        <>
                                            {isJsonString(element.imagedata) ? (
                                                <div className="row">
                                                    {JSON.parse(element.imagedata) && JSON.parse(element.imagedata).map((image, key) => {
                                                        return (
                                                            <div className={JSON.parse(element.imagedata).length == 1 ? 'col-12' : 'col-6'} key={key}>
                                                                <ModalImage
                                                                    small={image}
                                                                    large={image}
                                                                    alt=""
                                                                />
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            ) : (
                                                <ModalImage
                                                    small={element.imagedata}
                                                    large={element.imagedata}
                                                    alt=""
                                                />
                                            )}

                                        </>
                                    ) : (
                                        ""
                                    )}
                                    {element.linkid > 0 ?
                                        <div>
                                            <div className="mb-0 message-img pt-3">
                                                <a
                                                    href={element.originalurl}
                                                    target="_blank">
                                                    <div className="preview-data mt-2">
                                                        <div className="text-container">
                                                            <span className="header ">
                                                                {element.title}
                                                            </span>
                                                            <span className="text-domain">
                                                                {element.domain}
                                                            </span>
                                                        </div>
                                                        <div className="img-container">
                                                            <img
                                                                className="img"
                                                                src={element.image}
                                                            />
                                                        </div>
                                                        <div className="text-container">
                                                            <span className="description">
                                                                {element.description}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </a>
                                                <br />
                                                <span>
                                                    Source :{" "}
                                                    <a
                                                        href={element.originalurl}
                                                        target="_blank">
                                                        {element.originalurl}
                                                    </a>
                                                </span>
                                            </div>
                                        </div> : null}
                                </div>
                                <div className="ubox-middle">
                                    <div className="ut-buttonrow">
                                        <div className="btn-group-vertical">

                                            {element.isnews ? <div className="bt-lable">
                                                <label className="btn-sm"
                                                    onClick={(e) => e.preventDefault()}>#news
                                                </label>
                                            </div> : null}


                                            {element.isfundamental ? (
                                                <div className="bt-lable">
                                                    <label
                                                        className="btn-sm"
                                                        onClick={e => e.preventDefault()}>
                                                        #fundamental
                                                    </label>
                                                </div>
                                            ) : null}


                                            {element.istechnical ? (
                                                <div className="bt-lable">
                                                    <label
                                                        className="btn-sm"
                                                        onClick={e => e.preventDefault()}>
                                                        #technical
                                                    </label>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="ut-button-right">
                                        <div className="count-post">
                                            <div className="post-icon-size">
                                                {element.sentimentvalue == 0 &&
                                                    element.sentimentvalue == 0 ? null : element.sentimentvalue >
                                                        0 ? (
                                                    <button className="btn-icon-sentiment">
                                                        <div className=" px-2">
                                                            {" "}
                                                            + {element.sentimentvalue}{" "}
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
                                                            {element.sentimentvalue}{" "}
                                                            <img
                                                                src={bearImage}
                                                                height="25"
                                                                width="25"
                                                                className="text-end"></img>
                                                        </div>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                {/* <span
                                    className="reply-btn"
                                    onClick={() => { onRetweetChild(element); }}
                                    role="button"
                                >
                                    <i className="fas fa-reply"></i> <span>Reply</span>
                                </span> */}
                                {element.ccount != '0' && (
                                    <PostListReply post={element} />
                                )}
                            </div>
                        </div>
                    </div>
                )
            })}
            {userPostData.length == 0 && isLoading && <Skeleton count={5} />}
        </>

    )
}

export default PostListReply