import React from "react"
import PropTypes from "prop-types"
import { Modal, ModalBody, ModalHeader } from "reactstrap"
import Retweet from "./Retweet"
import PostListReply from "./PostListReply"
const RetweetModal = ({ retweetData, updateRetweetCount }) => {
    const [showComment, setShowComment] = React.useState(false)
    const [postCount, setPostCount] = React.useState(0)
    React.useEffect(() => {
        if (retweetData?.ccount && retweetData?.ccount != 0) {
            setPostCount(retweetData?.ccount)
        }

    }, [retweetData?.ccount])
	return (
		<div className="flex-ver-center">
			<span role="button" onClick={() => {
                setShowComment(!showComment)
            }}>show comments</span>
            {showComment && (
                <div>
                {(postCount != '0' && postCount != 0) && (
                        <>
                            <div className='reply-box'>
                                <PostListReply post={retweetData} />
                            </div>
                            <hr />
                        </>
                    )}
                <Retweet modal={true} toggle={() => {
                    setShowComment(!showComment)
                }} retweetData={retweetData} updateRetweetCount={() => {
                    setPostCount(postCount + 1)
                    updateRetweetCount(retweetData)
                }} />
                </div>
            )}
		</div>
	)
}

RetweetModal.propTypes = {
	open: PropTypes.bool,
	toggle: PropTypes.func,
	post: PropTypes.any,
}

RetweetModal.defaultProps = {
	open: false,
	toggle: () => {},
	post: null,
}

export default RetweetModal
