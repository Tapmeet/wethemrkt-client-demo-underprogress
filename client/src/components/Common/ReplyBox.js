import React from "react"
import PostReplyList from "./PostReplyList"
import Retweet from "./Retweet"

const ReplyBox = ({ element, userInfo }) => {
	const [reload, setReload] = React.useState(false)
	return (
		<>
			<div className="reply-box">
				<PostReplyList
					post={element}
					hideReplyInput={true}
					onReload={() => {
						setReload(!reload)
					}}
					reload={reload}
				/>
			</div>
			<div className="type-commentpart outer-comment-part-input">
				<div className="type-comment">
					<div className="cf-userpic">
						{userInfo?.profilePhoto ? (
							<img
								className="rounded-circle"
								src={userInfo?.profilePhoto}
								alt="Header Avatar"
							/>
						) : (
							<div className="circle-shadow-a bg-gray">
								<i className="rounded-circle bx bx-user font-size-20 align-middle" />
							</div>
						)}
					</div>
					<div className="comment-part">
						<Retweet
							modal={false}
							retweetData={element}
							onReload={() => {
								setReload(!reload)
							}}
							reload={reload}
						/>
					</div>
				</div>
			</div>
		</>
	)
}

export default ReplyBox
