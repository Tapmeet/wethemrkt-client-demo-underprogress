import React, { useState, useEffect } from "react"
import HorizontalLayout from "components/HorizontalLayout"
import SymbolChart from "./symbol-chart"
import PostCreate from "../../components/Common/PostCreate"
import PostListDashboard from "../../components/Common/PostListDashboard"
import { withContext } from "../../context/index"
import { setSymbolName as setSymbolNameAction } from "../../store/actions/appActions"

const SymbolDashboard = ({ postReload, setSymbolNameAction, ...props }) => {
	const [symbolname, setsymbolname] = useState("")
	const [postSymbolname, setPostSymbolname] = useState("")

	const [showPostCreate, setShowPostCreate] = React.useState(true)
	React.useEffect(() => {
		setShowPostCreate(false)
		setTimeout(() => {
			setShowPostCreate(true)
		}, 100)
	}, [postReload])

	useEffect(() => {
		if (
			props.match.params !== undefined &&
			props.match.params.symbol !== undefined
		) {
			setsymbolname(props.match.params.symbol)
			if (
				props.match.params.symbol.startsWith("^") ||
				props.match.params.symbol.startsWith("%5E")
			) {
				setPostSymbolname(props.match.params.symbol)
			} else {
				setPostSymbolname("$" + props.match.params.symbol)
			}
			setSymbolNameAction(props.match.params.symbol)
		}
	}, [props.match.params.symbol])
	if (props.match.params.id) {
		symbolname = props.match.params.id
		postSymbolname = props.match.params.id
	}
	return (
		<React.Fragment>
			<HorizontalLayout>
				{symbolname ? (
					<div className="white-boxpart rs-box">
						<SymbolChart symbolname={symbolname} />
					</div>
				) : (
					"Loading..."
				)}
				{symbolname ? (
					<div className="white-boxpart rs-box">
						{showPostCreate && (
							<PostCreate symboleValueInEditor={postSymbolname} />
						)}
					</div>
				) : (
					"Loading..."
				)}
				{symbolname ? (
					<div className="white-boxpart">
						<PostListDashboard symbolname={"$" + symbolname} />
					</div>
				) : (
					"Loading..."
				)}
			</HorizontalLayout>
		</React.Fragment>
	)
}

export default withContext(
	([
		{
			app: { postReload },
		},
		dispatch,
	]) => ({
		setSymbolNameAction: data => setSymbolNameAction(data, dispatch),
	}),
	SymbolDashboard
)
