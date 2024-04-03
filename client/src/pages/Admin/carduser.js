import React, { useState, useEffect } from "react"
import { Card, CardBody } from "reactstrap"
import { Link } from "react-router-dom"
import axiosAuthHttpMiddelware from "common/axiosAuthHttpMiddelware";
import Toaster from "components/Common/Toaster";

const CardUser = () => {
  const [userlist, setuserlist] = useState([]);
  useEffect(() => {
    getUserList();
  }, [])
  async function getUserList() {
    if (localStorage.getItem("user")) {
      axiosAuthHttpMiddelware.get("getTrendingKudosCoinUsers").then((response) => {
        if (response.status == 200 && response.data.userResponse !== undefined && response.data.userResponse.length > 0) {
          setuserlist(response.data.userResponse);
        } else {
          setuserlist([]);
          Toaster.errorToaster("Something went wrong while fetching userlist")
        }
      }).catch((err) => {
        setuserlist([]);
        Toaster.errorToaster("Something went wrong while fetching userlist")
      })
    }
  }
  return (
    <React.Fragment>
      <Card>
        <CardBody>
          <div className="d-flex">
            <div className="me-2">
              <h5 className="card-title ">Popular user</h5>
            </div>
          </div>
          <div className="table-responsive user-symbol-scroll">
            <table className="table align-middle table-nowrap mb-0">
              <thead>
                <tr>
                  <th scope="col" colSpan="2">
                    User
                  </th>
                  <th scope="col" className="text-center">Post</th>
                  <th scope="col" className="text-center">kudos Coins</th>
                </tr>
              </thead>
              <tbody >
                {userlist.length > 0 ? userlist.map((popularpost, key) => (
                  <tr key={key}>
                    <td style={{ width: "50px" }}>
                      <img
                        src={popularpost.profilephoto}
                        alt=""
                        className=" rounded-circle header-profile-user m-0 p-0"
                      />
                    </td>
                    <td>
                      <h5 className="font-size-13 text-truncate mb-1">
                        <Link to={{ pathname: "/viewprofile/" + popularpost.username, state: popularpost.userid }}>
                          <span to="#" className="text-dark">
                            {popularpost.username}
                          </span>
                        </Link>
                      </h5>
                    </td>
                    <td className="text-center">
                      {popularpost.totalpostcount}
                    </td>
                    <td className="text-center">
                      <i className="bx bx-dollar-circle dollar-icon align-middle me-1"></i>{" "}
                      {popularpost.kudoscoin || 0}
                    </td>
                  </tr>
                )) : null}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  )
}
export default CardUser
