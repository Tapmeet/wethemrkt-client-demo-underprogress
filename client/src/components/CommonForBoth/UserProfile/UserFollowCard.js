import React from "react"
import { useHistory } from "react-router-dom"
import { Row, Col } from "reactstrap"
const UserFollowCard = ({ ...props }) => {
  const history = useHistory();
  const userprofile = (username, userid) => {
    history.push({ pathname: `/viewprofile/${username}`, state: userid });
  }
  return (
    <React.Fragment>
      <div class="white-boxpart rs-box">
        <Row>
          <Col sm={6}>
            <h3>Following</h3>
            <div className="follow-details">
              <ul>
                {props.data.following.length > 0
                  ? props.data.following.map((element, key) => (
                    <li key={key}>
                      {element.followingusers.profilephoto ? (
                        <div className="profile-follow-image">
                          <img
                            src={element.followingusers.profilephoto}
                            alt="Profile Avatar"
                          />
                        </div>
                      ) : (
                        <div className="placeholder-image">
                          <i className="bx bx-user" />
                        </div>
                      )}
                      <span role="button" onClick={(e) => userprofile(element.followingusers.username, element.followingusers.id)}>{element.followingusers.username}</span>
                    </li>
                  ))
                  : null}
              </ul>
            </div>
          </Col>
          <Col sm={6}>
            <h3>Followers</h3>
            <div className="follow-details">
              <ul>
                {props.data.follower.length > 0
                  ? props.data.follower.map((element, key) => (
                    <li key={key}>
                      {element.profilephoto ? (
                        <div className="profile-follow-image">
                          <img
                            src={element.profilephoto}
                            alt="Profile Avatar"
                          />
                        </div>
                      ) : (
                        <div className="placeholder-image">
                          <i className="bx bx-user" />
                        </div>
                      )}
                      <span role="button" onClick={(e) => userprofile(element.username, element.id)}>{element.username}</span>
                    </li>
                  ))
                  : null}
              </ul>
            </div>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  )
}
export default UserFollowCard
