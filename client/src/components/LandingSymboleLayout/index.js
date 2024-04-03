import React, { useEffect, useState } from 'react';
import { withRouter } from "react-router-dom"
import PropTypes from "prop-types"

const Layout = (props) => {

  // const dispatch = useDispatch()

  // const {
  //   topbarTheme, layoutWidth, isPreloader
  // } = useSelector(state => ({
  //   topbarTheme: state.Layout.topbarTheme,
  //   layoutWidth : state.Layout.layoutWidth,
  //   isPreloader : state.Layout.isPreloader,
  // }))

  /*
  document title
  */
  useEffect(() => {
    const title = props.location.pathname
    let currentage = title.charAt(1).toUpperCase() + title.slice(2)

    document.title =
      currentage + " "
  },[props.location.pathname]);

  useEffect(() => {
    window.scrollTo(0, 0)
  },[]);

  /*
  layout settings
  */
  // useEffect(() => {
  //   dispatch(changeLayout("horizontal"));
  // },[dispatch]);

  // useEffect(() => {
  //   if (isPreloader === true) {
  //     document.getElementById("preloader").style.display = "block"
  //     document.getElementById("status").style.display = "block"

  //     setTimeout(function () {
  //       document.getElementById("preloader").style.display = "none"
  //       document.getElementById("status").style.display = "none"
  //     }, 2500)
  //   } else {
  //     document.getElementById("preloader").style.display = "none"
  //     document.getElementById("status").style.display = "none"
  //   }
  // }, [isPreloader])

  // useEffect(() => {
  //   if(topbarTheme) {
  //     dispatch(changeTopbarTheme(topbarTheme));
  //   }
  // },[dispatch, topbarTheme]);

  // useEffect(() => {
  //   if(layoutWidth) {
  //     dispatch(changeLayoutWidth(layoutWidth));
  //   }
  // },[dispatch, layoutWidth]);

  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const openMenu = () => {
    setIsMenuOpened(!isMenuOpened);
  }

  return (
    <React.Fragment>
        <div id="layout-wrapper">
          <div className="main-content">{props.children}</div>
        </div>      
      </React.Fragment>
  );
}

Layout.propTypes = {
  changeLayout: PropTypes.func,/*  */
  changeLayoutWidth: PropTypes.func,
  changeTopbarTheme: PropTypes.func,
  children: PropTypes.object,
  isPreloader: PropTypes.any,
  layoutWidth: PropTypes.any,
  location: PropTypes.object,
  topbarTheme: PropTypes.any
}

export default withRouter(Layout);