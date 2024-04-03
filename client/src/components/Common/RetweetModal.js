import React from 'react'
import PropTypes from 'prop-types';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import Retweet from './Retweet';
import PostListReply from './PostListReply';
const RetweetModal = ({ open, toggle, retweetData, updateRetweetCount }) => {
    const [postCount, setPostCount] = React.useState(0)
    React.useEffect(() => {
        if (retweetData?.ccount && retweetData?.ccount != 0) {
            setPostCount(retweetData?.ccount)
        }

    }, [retweetData?.ccount])
    return (
        <>
            <Modal fade={false} size="lg" isOpen={open} toggle={toggle}>
                <ModalHeader>
                    <h3>Replies</h3>
                    <button type="button" onClick={toggle}
                        className="close" data-dismiss="modal" aria-label="Close" >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </ModalHeader>
                <ModalBody>
                    {(postCount != '0' && postCount != 0) && (
                        <>
                            <div className='reply-box'>
                                <PostListReply post={retweetData} />
                            </div>
                            <hr />
                        </>
                    )}
                    <Retweet modal={true} toggle={toggle} retweetData={retweetData} updateRetweetCount={() => {
                        setPostCount(postCount + 1)
                        updateRetweetCount(retweetData)
                    }} />
                </ModalBody>
            </Modal>
        </>
    );
}

RetweetModal.propTypes = {
    open: PropTypes.bool,
    toggle: PropTypes.func,
    post: PropTypes.any,
}

RetweetModal.defaultProps = {
    open: false,
    toggle: () => { },
    post: null,
}

export default RetweetModal;