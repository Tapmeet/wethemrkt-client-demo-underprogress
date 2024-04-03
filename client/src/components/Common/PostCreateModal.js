import React from "react"
import PropTypes from "prop-types"
import { Modal, ModalBody, ModalHeader } from "reactstrap"
import PostCreate from "./PostCreate"
const PostCreateModal = ({ open, toggle, post }) => {
	return (
		<>
			<Modal fade={false} size="lg" isOpen={open} toggle={toggle}>
				<ModalHeader>
					<button
						type="button"
						onClick={toggle}
						className="close"
						data-dismiss="modal"
						aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</ModalHeader>
				<ModalBody>
					<PostCreate post={post} modal={true} toggle={toggle} />
				</ModalBody>
			</Modal>
		</>
	)
}

PostCreateModal.propTypes = {
	open: PropTypes.bool,
	toggle: PropTypes.func,
	post: PropTypes.any,
}

PostCreateModal.defaultProps = {
	open: false,
	toggle: () => {},
	post: null,
}

export default PostCreateModal
