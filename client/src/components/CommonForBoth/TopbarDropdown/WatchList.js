import React, { useState, useEffect } from "react"
import PropTypes from 'prop-types'
import { Link } from "react-router-dom"
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from "reactstrap"
import SimpleBar from "simplebar-react"
import Toaster from "components/Common/Toaster"
import axiosAuthHttpMiddelware from "common/axiosAuthHttpMiddelware"
import 'boxicons'





const WatchListDropdown = props => {
  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false)
  const [watchlistData, setwatchlistData] = useState([]);

  useEffect(() => {
    getWatchlistByUser();
  }, [])

  
    function getWatchlistByUser() {
    if (localStorage.getItem("user")) {
      const obj = JSON.parse(localStorage.getItem("user"));
     
    axiosAuthHttpMiddelware.get("watchlist",{ userid : obj.id }).then((response) => {
        if(response.data.watchlistResponse)
        { 
        if (response.data.watchlistResponse!== undefined) {

          let symbolsTwo = response.data.watchlistResponse.symbols.split(',');
          let splittedWithComma = symbolsTwo[0].split(',');
          // console.log("after formating the data")
          // console.log(data);
          let data = symbolsTwo.map((val, index) => (
            {
            id: `${index}`,
            key:`index-${index}`,
            content : `${val}`.replace('$','')
          }))
          //  console.log("after formating the data")
          //  console.log(data);
          setwatchlistData(data);
          

          // Array.from({ length: response.data.watchlistResponse.length }, (v, k) => k).map(k => ({
          //   id: `item-${k}`,
          //   content: `item ${k}`
          // }));

          //Array.from({ length: response.data.watchlistResponse.length }, (v, k) => k).map(k => console.log(k));

        }
        }
        else
        {

            toaster.errorToaster(response.data.message, "Error")
          
          setwatchlistData([]);
        }
  

      }).catch((err) => {
        console.log(err);
      })
      
    }
  }



  return (
    <React.Fragment>
       
       
      <Dropdown isOpen={menu} toggle={() => setMenu(!menu)} className="dropdown d-inline-block" tag="li" >
        <DropdownToggle className="btn noti-icon" tag="button" id="page-header-notifications-dropdown" >
        <box-icon name='briefcase-alt' color='#555b6d' />
        </DropdownToggle>

        <DropdownMenu className="dropdown-menu dropdown-menu-lg p-0 dropdown-menu-end">
          <div className="p-3">
            <Row className="align-items-center">
              <Col>
                <h6 className="m-0"> {"Watchlist"} </h6>
              </Col>
            </Row>
          </div>

        
          

      {watchlistData.map((popularpost, key) => (
               <div className="p-2 border-top d-grid">
            <Link
              className="btn btn-sm btn-link font-size-14 btn-block text-center"
              to={`/feed/`+popularpost.content}
            >
              {popularpost.content}
            
            </Link>
          </div>
              ))}



            
      
          <div className="p-2 border-top d-grid">
            <Link
              className="btn btn-sm btn-link font-size-14 btn-block text-center"
              to="/watchlist"
            >
              <i className="mdi mdi-arrow-right-circle me-1"></i>
              {" "}
              {"View all"}{" "}
            </Link>
          </div>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  )
}

export default (WatchListDropdown)

WatchListDropdown.propTypes = {
  t: PropTypes.any
}