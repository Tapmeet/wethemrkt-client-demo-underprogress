
import React, { useEffect } from "react"
// import { connect } from "react-redux"
import { withRouter, useHistory } from "react-router-dom"

// import { logoutUser } from "../../store/actions"

//redux
// import { useSelector, useDispatch } from "react-redux"

const Logout = () => {
  
  // const dispatch = useDispatch()
  const history = useHistory();

  useEffect(() => {
    if(localStorage.getItem("user"))
    {
      localStorage.removeItem("user");
      history.push("/");
    }
    
  }, [])
return <></>
}



export default withRouter((Logout))
