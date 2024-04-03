import React from "react"

const ReplySorting = ({ onChangeSorting }) => {
	return (
		<>
			<div className="sorting my-3">
				<div className="sorting__inner">
					<div className="sorting__item d-flex">
						<div className="sorting__item__title">Filter by</div>
						<div className="sorting__item__select mx-4">
							<select
								name="sort"
								id="sort"
								onChange={e => {
									onChangeSorting(e.target.value)
								}}>
								<option value="upvote">Most Active</option>
								<option value="newest">Newest</option>
								<option value="oldest">Oldest</option>
							</select>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default ReplySorting
