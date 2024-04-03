import React from "react"
import { Row, Col, Card } from "reactstrap"
import PostCreate from "../../components/Common/PostCreate"
import PostListDashboard from "../../components/Common/PostListDashboard"
import "./index.css"
import HorizontalLayout from "components/HorizontalLayout"
import { withContext } from "../../context/index"
const Dashboard = ({ postReload }) => {
	const [showPostCreate, setShowPostCreate] = React.useState(true)
	React.useEffect(() => {
		setShowPostCreate(false)
		setTimeout(() => {
			setShowPostCreate(true)
		}, 100)
	}, [postReload])
	return (
		<React.Fragment>
			<HorizontalLayout>
				<div className="white-boxpart rs-box">
					{showPostCreate && <PostCreate />}
				</div>
				<div className="white-boxpart">
					<PostListDashboard />
				</div>
			</HorizontalLayout>
		</React.Fragment>
	)
}

export default withContext(
	([
		{
			app: { postReload },
		},
	]) => ({
		postReload: postReload,
	}),
	Dashboard
)
