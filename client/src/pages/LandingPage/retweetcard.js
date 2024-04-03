import PropTypes from "prop-types"
import React,{useEffect, useState} from 'react';
import { Row,CardText } from "reactstrap"
import parse from 'html-react-parser';
import {
    Progress
  } from "reactstrap"

// users
import "../../assets/scss/custom/wethemkrt/people.scss";
// import userpost from '../../services/post.service';

const RetweetPostCard = (props) => {
    const [userRetweetPostData, setuserRetweetPostData] = useState([]);

    useEffect(() => {
        // if (props.dataRetweet !== undefined || props.dataRetweet !== null) {
        //     getUserRetweetPostList(props.dataRetweet.userid,props.dataRetweet.retweetpostid);
        // }
    }, [])

    async function getUserRetweetPostList(userid,retweetpostid) {
        // if (localStorage.getItem("user")) {
        //   const response = await userpost.getUserRetweetPost(userid,retweetpostid);
        //   if (response.status == 200 && response.data.userPostResponse!== undefined && response.data.userPostResponse.length > 0) {
        //     setuserRetweetPostData(response.data.userPostResponse);
        //   }
        // }
      }

    return (
            <React.Fragment>
            {
                <div>
                {userRetweetPostData !== undefined && userRetweetPostData.length > 0 ? userRetweetPostData.map((element,key) =>
                    <div key={key}>
                    <Row className="comment-card px-md-3 px-0">
                    <div className="col-sm-11 py-3 col-10  p-0">
                        <Row>
                            <div className="col-sm-11 col-10 retweet-div-border">
                                <div className="post-text m-0 pt-2"> 
                                {parse(element.htmlpost)}
                                </div>
                                <span>{element.link} {element.imagelink}</span>
                            </div>
                        </Row>
                    </div>
                    </Row>
                </div>
                ): null}
                </div>
            }
            </React.Fragment>
        );
    }

RetweetPostCard.propTypes = {
    userRetweetPostData: PropTypes.array,
}
        
export default RetweetPostCard;