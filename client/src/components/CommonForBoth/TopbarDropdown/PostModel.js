import React,{useState,useEffect } from "react"
import PropTypes from 'prop-types'
            
            import { Row, Col , Modal, ModalHeader, ModalBody ,Nav, NavItem, NavLink, TabContent, TabPane , Card,CardTitle} from "reactstrap"

// import { Field, Form } from '@availity/form';
// import '@availity/yup';
// import * as yup from 'yup';


// import { AvForm } from "availity-reactstrap-validation"
import axiosHttpMiddelware from "common/axiosHttpMiddelware"
import 'bootstrap/dist/css/bootstrap.css';


import PostEditorDashboard from '../../Common/PostEditorDashboard';
import AskQuestionsbox from './AskQuestionsbox';

import classnames from "classnames"

import "../../../assets/scss/custom/wethemkrt/post-PostModel.scss";


//i18n
// import { withTranslation } from "react-i18next"

const PostModel = (props) => {
    const [activeTab, setactiveTab] = useState("1")
    
    const [modal_backdrop, setmodal_backdrop] = useState(false);
    const [symbolsugesstion, setsymbolsugesstion] = useState("");

    useEffect(() => {
        setmodal_backdrop(props.dataParentToChild)
        removeBodyCss()
    }, [])

    function handleChange() {
        setmodal_backdrop(false);
        props.onChange(false);
    }

    async function getSymbolData(e) {
        setsymbolsugesstion("");
       
        if (e.target.value) {
          const response = await symbol.getSymbolData(e.target.value);
          if (response.status == 200) {
            setsymbolsugesstion(response.data.symbolResponse.map(({ symbol,name }) => ({ label: name, value: symbol })));
          }
        }
        else{
          const response = await symbol.getTrendingSymbols();
          if (response.status == 200) {
            setsymbolsugesstion(response.data.trendingSymbolResponse[0].quotes.map(({ symbol }) => ({ label: symbol, value: symbol })));  
          }
        }
    }

    function removeBodyCss() {
        document.body.classList.add("no_padding")
    }

    function tog_backdrop() {
        setmodal_backdrop(modal_backdrop)
        removeBodyCss()
    }

    const toggle = tab => {
        if (activeTab !== tab) {
            setactiveTab(tab)
        }
    }
    
  return (
    <React.Fragment>
        <Modal size="lg" isOpen={modal_backdrop} toggle={() => { tog_backdrop() }} fade={true} centered={true} backdrop={'static'} id="staticBackdrop" >
            <ModalHeader toggle={ () => handleChange()} />
            <ModalBody>            
              <PostEditorDashboard onChange={() => {handleChange()}}/>
            </ModalBody>

        </Modal>
    </React.Fragment>
  )
}

//export default PostModel
export default (PostModel)

PostModel.propTypes = {
  t: PropTypes.any
}
