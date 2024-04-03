import React,{useState,useEffect} from 'react';
import { Modal } from "reactstrap";

import "../../assets/scss/custom/wethemkrt/imagemodel.scss";

const ImageModel = (props) => {
    const [modal_standard, setmodal_standard] = useState(false)
    useEffect(() => {
        setmodal_standard(props.dataParentToChild)
        removeBodyCss()
    }, [])
    function removeBodyCss() {
        document.body.classList.add("no_padding")
    }
    function tog_standard() {
        setmodal_standard(!modal_standard)
        removeBodyCss()
    }
    function handleChange() {
        setmodal_standard(false);
        props.onChange(false);
    }

    return (
        <Modal size="xl" isOpen={modal_standard} toggle={() => { tog_standard(); }} className="modal-bg modal-fullscreen">
            <div className="close model-close-img" onClick={() => { handleChange(false); }} type="button"  data-dismiss="modal" aria-label="Close">
                <i className="mdi mdi-close"></i>
            </div>
            <div className="modal-body">
                <div className="container">
                    <div className="row">
                        <div className="col-12 d-flex justify-content-center align-items-center" style={{height:"100vh"}}>
                            {props.elementInfo.imageuri ? <img src={props.elementInfo.imageuri}  width="60%"/>: ''}
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
export default ImageModel;