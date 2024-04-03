import React from "react"
import SavedPostList from "../../components/Common/SavedPostList"
import "./index.css"
import HorizontalLayout from "components/HorizontalLayout"
const SavedPost = () => {
	return (
		<React.Fragment>
			<HorizontalLayout>
				<div className="white-boxpart">
					<SavedPostList />
				</div>
			</HorizontalLayout>
		</React.Fragment>
	)
}
export default SavedPost
