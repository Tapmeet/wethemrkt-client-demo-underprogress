import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"
import { Row, CardText } from "reactstrap"
import moment from "moment"
import parse from "html-react-parser"
import { Progress } from "reactstrap"

import bearImage from "../../assets/images/bear.png"
import bullImage from "../../assets/images/bull.png"
import toastr from "toastr"
import Retweet from "../../components/Common/RetweetModal"
import ImageModel from "./imageModel"
import axiosHttpMiddelware from "common/axiosHttpMiddelware"
const PostCard = props => {
	function handleChange(postid, key) {
		props.onChange(postid, key)
	}
	return (
		<React.Fragment>
			{
				<div key={key} className="ct-postbox">
					<div className="userpost-box">
						<div
							className="usbox-profile"
							onClick={e => userprofile(element.username, element.user_id)}>
							{element.profilephoto ? (
								<img
									className="rounded-circle header-profile-user"
									src={element.profilephoto}
									alt="Header Avatar"
								/>
							) : (
								<div className="text-center circle-shadow-a bg-gray">
									<i className="rounded-circle bx bx-user font-size-20 align-middle mt-4" />
								</div>
							)}
						</div>
						<div className="usbox-right-content">
							<div className="ubox-top">
								<div>
									<div>
										<h5
											className="m-0 text-transform tooltipyy"
											onClick={e =>
												userprofile(element.username, element.user_id)
											}>
											{element.username}
											<span
												className="dollar-box ms-2"
												style={{ position: "relative", top: "3px" }}>
												<i className="bx bx-dollar-circle dollar-icon-uesr"></i>{" "}
												<span className="dollar-count ms-2">
													{" "}
													{element.kudoscoin + addVote(key) > 0
														? element.kudoscoin + addVote(key)
														: 0}{" "}
												</span>
											</span>
											<span className="font-size-12 text-muted ms-4 mt-1">
												{moment(element.postcreatedat).format(
													"DD/MM/YYYY HH:mm"
												)}
											</span>
										</h5>

										<h6 style={{ overflowWrap: "break-word" }}>
											<Linkify
												componentDecorator={(
													decoratedHref,
													decoratedText,
													key
												) => (
													<a target="blank" href={decoratedHref} key={key}>
														{decoratedText}
													</a>
												)}>
												{parse(element.posthtmldata)}
											</Linkify>
										</h6>
									</div>
								</div>
								<div className="ubox-btn-right">
									<div className="me-3">
										{userInfo && (
											<>
												{element.username !== userData.username && (
													<>
														{isNotFollowing(element.user_id) ? (
															<button
																type="button"
																className="theme-btn pb-btn"
																onClick={() => {
																	followUser(element.user_id)
																}}>
																Follow
															</button>
														) : (
															<button
																type="button"
																className="theme-btn pb-btn"
																onClick={() => {
																	unFollowUser(element.user_id)
																}}>
																Unfollow
															</button>
														)}
													</>
												)}
											</>
										)}
									</div>
									<div>
										{diffMinutes(element.now, element.postcreatedat) <= 5 &&
											isLogin &&
											postAction &&
											element.username == userData.username && (
												<>
													<i
														className="bx bxs-message-square-edit"
														role="button"
														onClick={e => {
															e.preventDefault()
															setPost(element)
															togglePostModal()
														}}></i>
													<i
														className="bx bxs-trash"
														role="button"
														onClick={e => {
															e.preventDefault()
															postDelete(element.postguid)
														}}></i>
												</>
											)}
										{element?.bookmarkStatus ? (
											<i class="bx bxs-bookmark-star"></i>
										) : (
											<span
												role="button"
												onClick={() => {
													onBookmark(element)
												}}>
												<i class="bx bx-bookmark-plus"></i>
											</span>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="userpost-box">
						<div className="arrow-box">
							<div className="short-arw-box topar-box">
								<img
									style={{ width: 40 }}
									className={
										isUpVoteAllowed(element, userData, key) ? "" : "disabled"
									}
									onClick={e => {
										e.preventDefault()
										if (isUpVoteAllowed(element, userData, key)) {
											upVote(key, element.postguid, true)
										}
									}}
									role="button"
									src={getUpvoteIcon(element, userData, key)}
									onMouseOver={e => {
										if (isUpVoteAllowed(element, userData, key)) {
											e.currentTarget.src = upArrowAllowed
										}
									}}
									onMouseOut={e => {
										if (isUpVoteAllowed(element, userData, key)) {
											e.currentTarget.src = upArrowGray
										}
									}}
								/>
							</div>
							{showVote && (
								<div className="short-arw-box">
									{addedVote(element.votes, key)}
								</div>
							)}
							<div className="short-arw-box downar-box">
								<img
									style={{ width: 40 }}
									className={
										isDownVoteAllowed(element, userData, key) ? "" : "disabled"
									}
									onClick={e => {
										e.preventDefault()
										if (isDownVoteAllowed(element, userData, key)) {
											upVote(key, element.postguid, false)
										}
									}}
									role="button"
									src={getDownvoteIcon(element, userData, key)}
									onMouseOver={e => {
										if (isDownVoteAllowed(element, userData, key)) {
											e.currentTarget.src = downArrowAllowed
										}
									}}
									onMouseOut={e => {
										if (isDownVoteAllowed(element, userData, key)) {
											e.currentTarget.src = downArrowGray
										}
									}}
								/>
							</div>
						</div>
						<div className="usbox-right-content">
							{element.imagedata ? (
								<>
									{isJsonString(element.imagedata) ? (
										<div className="row">
											{JSON.parse(element.imagedata) &&
												JSON.parse(element.imagedata).map((image, key) => {
													return (
														<div
															className={
																JSON.parse(element.imagedata).length == 1
																	? "col-12"
																	: "col-6"
															}
															key={key}>
															<div className="details-imagebox">
																<div
																	style={{ background: `url(${image})` }}
																	className="bg-image"></div>
																<div className="f-image">
																	<ModalImage
																		small={image}
																		large={image}
																		alt=""
																	/>
																</div>
															</div>
														</div>
													)
												})}
										</div>
									) : (
										<div className="details-imagebox">
											<ModalImage
												small={element.imagedata}
												large={element.imagedata}
												alt=""
											/>
										</div>
									)}
								</>
							) : (
								""
							)}
							{element.linkid > 0 ? (
								<div>
									<div className="mb-0 message-img pt-3">
										<a href={element.originalurl} target="_blank">
											<div className="preview-data mt-2">
												<div className="text-container">
													<span className="header ">{element.title}</span>
													<span className="text-domain">{element.domain}</span>
												</div>
												<div className="img-container">
													<img className="img" src={element.image} />
												</div>
												<div className="text-container">
													<span className="description">
														{element.description}
													</span>
												</div>
											</div>
										</a>
										<br />
										<span>
											Source :{" "}
											<a href={element.originalurl} target="_blank">
												{element.originalurl}
											</a>
										</span>
									</div>
								</div>
							) : null}
							<PostFooter element={element} onRetweet={onRetweet} />
						</div>
					</div>
					<hr />
				</div>
			}
		</React.Fragment>
	)
}

PostCard.propTypes = {
	userPostData: PropTypes.array,
}

export default PostCard
