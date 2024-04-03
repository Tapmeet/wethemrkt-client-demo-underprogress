import React, { useState, useEffect } from "react"
import HorizontalLayout from "components/HorizontalLayout"
import PostCard from "../../components/Common/post"

const Dashboard = props => {
	const [postId, setPostId] = useState(props.match.params.postid)

	useEffect(() => {
		document.title = "Post"
		setPostId(props.match.params.postid)
	}, [props.match.params.postid])

	return (
		<React.Fragment>
			<HorizontalLayout hideRightCards={true}>
				<div className="white-boxpart">
					<PostCard postid={postId} />
				</div>
			</HorizontalLayout>
		</React.Fragment>
	)
}

export default Dashboard
