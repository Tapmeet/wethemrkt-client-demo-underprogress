import React, { useState, useCallback, useEffect, useRef } from "react"
import { useQuery } from "react-query"
import {
	Button,
	Row,
	Col,
	UncontrolledTooltip,
	Dropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
} from "reactstrap"
import { Form } from "@availity/form"
import "@availity/yup"
import Switch from "react-switch"
import RangeSlider from "react-bootstrap-range-slider"
import Editor from "@draft-js-plugins/editor"
import { EditorState, ContentState } from "draft-js"
import { convertToHTML } from "draft-convert"
import createHashtagPlugin from "@draft-js-plugins/hashtag"
import createLinkifyPlugin from "@draft-js-plugins/linkify"
import createImagePlugin from "@draft-js-plugins/image"
import createMentionPlugin, { defaultSuggestionsFilter, } from "@draft-js-plugins/mention"
import Toaster from "./Toaster"

import axiosHttpMiddelware from "../../common/axiosHttpMiddelware"
import axiosAuthHttpMiddelware from "../../common/axiosAuthHttpMiddelware"

import bearImage from "../../assets/images/bear.png"
import bullImage from "../../assets/images/bull.png"

import "bootstrap/dist/css/bootstrap.css"
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css"
import "draft-js/dist/Draft.css"
import "@draft-js-plugins/linkify/lib/plugin.css"
import "@draft-js-plugins/hashtag/lib/plugin.css"
import "@draft-js-plugins/image/lib/plugin.css"
import "@draft-js-plugins/mention/lib/plugin.css"

const hashtagPlugin = createHashtagPlugin()
const linkifyPlugin = createLinkifyPlugin()
const imagePlugin = createImagePlugin()

const countrySearchPlugin = createMentionPlugin({
	entityMutability: "IMMUTABLE",
	mentionPrefix: "@",
	mentionTrigger: "@",
	supportWhitespace: true,
})

const symbolSearchPlugin = createMentionPlugin({
	entityMutability: "IMMUTABLE",
	mentionPrefix: "$",
	mentionTrigger: "$",
	supportWhitespace: true,
})

var plugins = [
	linkifyPlugin,
	hashtagPlugin,
	imagePlugin,
	countrySearchPlugin,
	symbolSearchPlugin,
]

// import user from "../../services/user.service"
import toaster from "./Toaster"
import "../../assets/scss/custom/wethemkrt/post-draftjsPostbox.scss"
import "../../assets/scss/custom/wethemkrt/draftpostbox.scss"
import "../../assets/scss/custom/wethemkrt/loader.scss"

import Entry from "./Dropdown"

const fortmatResponse = res => {
	return JSON.stringify(res, null, 2)
}


//Post editor box.
const DraftjsPostbox = props => {
	const editorDefaultMessage =
		"Share an idea (use $ before symbol eg $AAPL) use @to higlight market AU/US"
	const editorFailureMessage =
		"1 : Use a $stock cashtag (you can have more than one). <br /> 2 : Include a source for your post, either a link to your source, or relevant image or screenshot, such as a price chart. <br /> 3 : Categorise as either #fundamental or #technical."
	const postFailureMessage =
		"1 : Use a $stock cashtag (you can have more than one).2 : Include a source for your post, either a link to your source, or relevant image or screenshot, such as a price chart.    3 : Categorise as either #fundamental or #technical."

		const [posttextcount, setposttextcount] = useState(300)

	let defaultString = ""

	//which default editor message do we need to display? the default one or the chashtag of a symbol
	if (
		props.symboleValueInEditor != "$undefined " &&
		props.symboleValueInEditor != undefined
	) {
		defaultString = props.symboleValueInEditor
	} else {
		defaultString = editorDefaultMessage
	}

	//sanity check.
	if (
		props.symboleValueInEditor === "$undefined" ||
		props.symboleValueInEditor === "$undefined " ||
		props.symboleValueInEditor === undefined ||
		props.symboleValueInEdito === null
	) {
		//console.log(props.symboleValueInEditor);
		defaultString = ""
	}

	const content = ContentState.createFromText(defaultString)
	const toolTipref = useRef(null)
	const [editorState, setEditorState] = useState(
		EditorState.createWithContent(content)
	)
	const [dropdownOpen, setDropdownOpen] = useState(false)
	const [dropdownOption, setDropdownOption] = useState(0)
	const toggle = () => setDropdownOpen(prevState => !prevState)
	const [rangevalue, setRangeValue] = useState(0)
	const [fileExtension, setFileExtension] = useState("png")
	const [postbuttonclass, setpostbuttonclass] = useState("post-btn")
	const [postloadingclass, setpostloadingclass] = useState("loader-none")
	const [hashTag, setHashTag] = useState({
		isFundamental: false,
		isTechnical: false,
	})
	const [image, setImage] = useState("")
	const [allowThread, setAllowThread] = useState(false)
	const [openCountry, setOpenCountry] = useState(false)
	const [openSymbol, setOpenSymbol] = useState(false)
	const [sourcelink, setsourcelink] = useState(false)
	const [isPostOk, setIsPostOk] = useState(false)
	const [tooltipLoader, setToolTip] = useState(true)

	const [didWeFetchLinkPreviewMetadata, setDidWeFetchLinkPreviewMetadata] =
		useState(false)

	const [htmlContent, sethtmlContent] = useState("")
	const [userInfo, setuserInfo] = useState({
		id: "",
		name: "",
		profilePhoto: "",
		isadmin: "",
	})

	const [preview, setPreview] = useState()

	const [linkInfo, setLinkInfo] = useState("")

	var countryData = []
	var symbolData = []

	const [countrysuggestions, setcountrySuggestions] = useState(countryData)
	const [symbolsuggestions, setsymbolSuggestions] = useState(symbolData)

	const inputFile = useRef(null)
	const ref = useRef(null)
	const urlRegex =
		/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/

	const [getResult, setGetResult] = useState(null)
	const [isLoading, setIsLoading] = useState(false)

	const { isLoading: isLinkPreviewLoading, refetch: getLinkPreivew } = useQuery(
		"link-preview",
		async () => {
			console.log(linkInfo)
			setIsLoading(true)
			return await axiosAuthHttpMiddelware.get("/linkPreview", {
				params: { link: linkInfo },
			})
		},
		{
			enabled: false,
			onSuccess: res => {
				const result = {
					status: res.status + "-" + res.statusText,
					headers: res.headers,
					data: res.data,
				}
				// console.log("after fetch response")
				 console.log(result.data)

				setGetResult(result.data)
				setDidWeFetchLinkPreviewMetadata(true)
				setIsLoading(false)
			},
			onError: err => {
				setGetResult(fortmatResponse(err.response?.data || err))
			},
		}
	)

	useEffect(() => {
		if (localStorage.getItem("user")) {
			const userData = JSON.parse(localStorage.getItem("user"))
			setuserInfo({
				...userInfo,
				id: userData.id,
				name: userData.username,
				profilePhoto: userData.profilePhoto,
				isadmin: userData.isadmin,
			})
		}
	}, [])

	const focusEditor = () => {
		ref.current.focus()
	}

	const CountrySuggesionDropdown = countrySearchPlugin.MentionSuggestions
	const SymbolSuggesionDropdown = symbolSearchPlugin.MentionSuggestions

	const onOpenChange = useCallback(_open => {
		setOpenCountry(_open)
	}, [])
	const onOpenChange2 = useCallback(_open => {
		setOpenSymbol(_open)
	}, [])

	//search country with name on server.
	function getCountrybyName(countryData) {
		axiosAuthHttpMiddelware
			.post("/getcountry", { countryData })
			.then(response => {
				if (response.status == 200) {
					countryData = []

					if (response.data.countryResponse.length > 0) {
						for (
							let index = 0;
							index < response.data.countryResponse.length;
							index++
						) {
							const element = response.data.countryResponse[index]
							countryData.push({ name: element.countrycode })
						}
					}
					setcountrySuggestions(countryData)
				}
			})
			.catch(err => {
				// console.log(err)
				Toaster.errorToaster("Error fetchig country", "Error")
			})
	}

	//search symbol on server
	function getSymbolbyName(symbolsearch) {
		axiosHttpMiddelware
			.post("search/symbol", {
				symbolname: symbolsearch,
			})
			.then(response => {
				if (response.status == 200) {
					symbolData = []
					if (response.data.symbolResponse.length > 0) {
						for (
							let index = 0;
							index < response.data.symbolResponse.length;
							index++
						) {
							const element = response.data.symbolResponse[index]
							symbolData.push({
								name: element.symbol,
								symboleName: element.name,
							})
						}
					}
					setsymbolSuggestions(symbolData)
				}
			})
	}

	//get the triggered editor value for country.
	const onSearchChange = useCallback(({ value }) => {
		if (value) {
			getCountrybyName(value)
			if (countryData.length > 0) {
				setcountrySuggestions(defaultSuggestionsFilter(value, countryData))
			}
		} else {
			setcountrySuggestions([])
		}
	}, [])

	//get the triggered editor value for cashtag
	const symbolSearch = useCallback(({ value }) => {
		if (value) {
			getSymbolbyName(value)
			if (symbolData.length > 0) {
				// console.log(symbolData);
				setsymbolSuggestions(defaultSuggestionsFilter(value, symbolData))
			}
		} else {
			setsymbolSuggestions([])
		}
	}, [])

	//convert the image to base64 encoding.
	function getBase64(file) {
		return new Promise(resolve => {
			let baseURL = ""
			let reader = new FileReader()

			// Convert the file to base64 text
			reader.readAsDataURL(file)
			// on reader load somthing...
			reader.onload = () => {
				// Make a fileInfo Object
				baseURL = reader.result

				resolve(baseURL)
			}
		})
	}

	//handle the image upload.
	const handleImageUpload = e => {
		var file = e.target.files[0]

		getBase64(file).then(res => {
			setPreview(res)
			setImage(res)
		})

		checkHashTag()
	}

	//handles the file open dialogue box.
	const showOpenFileDialog = () => {
		inputFile.current.click()
	}

	//get the link preview
	async function getPreview(linkdata) {
		if (linkdata !== null && linkInfo && !didWeFetchLinkPreviewMetadata) {
			getLinkPreivew()
		}
	}

	//check if the given string is a valid URL.
	function isValidURL(string) {
		var res = string.match(
			/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
		)
		return res !== null
	}

	//handles post submit.
	function handleValidSubmit(event, values) {
		if (localStorage.getItem("user")) {
			
			var finalText = editorState.getCurrentContent().getPlainText("")
			finalText = finalText.replace("\u0001","")
			finalText = finalText.replace("undefined", "").trim()
			console.log(finalText)
				var countryData = [];
				var symbolData = [];
				var htmlBodyText = "";

				const myArray = finalText.split(" ")
				for (let i = 0; i < myArray.length; i++) {
					if (myArray[i].startsWith("@")) {						
						countryData.push(myArray[i])
						htmlBodyText += `<a style="color:#556ee6">${myArray[i]}</a>` + " "
						console.log(myArray[i])
					} else if (myArray[i].startsWith("$")) {
						symbolData.push(myArray[i])
						console.log(myArray[i])
						htmlBodyText +=
							`<a style="color:#556ee6" href='/feed/${myArray[i]}'>${myArray[i]}</a>` +
							" "
					} else {
						htmlBodyText+= myArray[i] + " ";
					}
				}

			// console.log(htmlBodyText)
			// console.log(countryData)
			// console.log(symbolData)
			htmlBodyText = htmlBodyText.replace(urlRegex, '');
			if (finalText.length <= 300) {
				if (
					(linkInfo || image) &&
					(hashTag.isFundamental || hashTag.isTechnical) &&
					finalText !== null &&
					finalText !== ""
				) {
					//console.log("HTML Conversion : " + htmlContent);

					setpostloadingclass("loader1")
					// debugger;
					let linkIds = -1
					if (getResult) {
						linkIds = getResult.linkMeta.linkId
					}

					var userPostData = {
						hasThread: allowThread,
						postHTMLData: htmlBodyText,
						postRawData: finalText,
						imageData: image,
						countries: countryData,
						symbols: symbolData,
						isFundamental: hashTag.isFundamental,
						isTechnical: hashTag.isTechnical,
						sentiment: rangevalue,
						repliesPermission : dropdownOption,
						linkId: linkIds,
					}

					axiosAuthHttpMiddelware
						.post("/post/create", { userPostData })
						.then(response => {
							if (response.status == 200) {
								debugger;
								console.log(response)
								setpostloadingclass("loader-none")
								Toaster.successToaster("Post Created Successfully", "Success!")
								const neweditorState = EditorState.push(editorState,ContentState.createFromText(""))
								setDidWeFetchLinkPreviewMetadata(false)
								setGetResult(null)
								setPreview("")
								setLinkInfo("")
								setEditorState(neweditorState)
								
							} else {
								Toaster.errorToaster("Something went wrong while creating post. please try again.", "Error")
								
								setpostloadingclass("loader-none")
							}
						})
						.catch(err => {
							console.log(err)
							Toaster.errorToaster(editorFailureMessage, "Error")
							setpostloadingclass("loader-none")
						})		

					if (props.onChange) {
						props.onChange()
					}
				} else {
					console.log("some of the details are missing check post.")
					toaster.errorToaster(editorFailureMessage, "Error")
					setpostloadingclass("loader-none")
				}
			} else {
				toaster.errorToaster("Maximum 300 chars allowed.", "POST TOO LONG")
			}
			
			
			//}

			//setisCallFeed(!isCallFeed);
			//history.push('/feed');
		}
	}

	//this event is getting triggered whenever user enters anything in the text editor.
	//it validates and converts users text of '@' and '$' and links to relative platform specific
	//blue color. the post validation should happen here and instead of getting all the text
	//need to iterate one time on overall text and update the editor state.
	//whenever editor has any data we update our editor state to caputure the information.
	function EditorChange(editorState) {
		setEditorState(editorState)

		const posttextcount = editorState.getCurrentContent().getPlainText("\u0001").length
		var fianlModifiedHTMLPostData = ""
		var editorData = editorState.getCurrentContent().getPlainText("\u0001").trim("undefined", "")

		// if (editorData != null && editorData.match(urlRegex) > 0) {
		// 	console.log("Inside text area change. and URL regex.")
		// 	console.log(editorData.match(urlRegex))
		// 	console.log(editorData)
		// 	setLinkInfo(editorData)
		// 	getPreview(editorData)
		// } else {
		// 	setsourcelink(false)
		// 	setLinkInfo("")
		// }

		if (editorData.match(urlRegex)) {
			// console.log("IF URL regex.")
			// console.log(editorData.match(urlRegex))
			// console.log(editorData)
			setsourcelink(true)			
			setLinkInfo(editorData)
			getPreview(editorData)
			editorData = editorData.replace(urlRegex, "")
		} else {
			// console.log("ELSE URL regex.")
			// console.log(editorData.match(urlRegex))
			// console.log(editorData)
			setsourcelink(false)
			setLinkInfo("")
			setDidWeFetchLinkPreviewMetadata(false)
			setGetResult(null)
		}

		if (editorData.includes("$")) {
			var replaceData = editorData
				.substr(editorData.indexOf("$") + 1)
				.split(" ")[0]
			sethtmlContent(
				editorData.replace(
					`$${replaceData}`,
					`<a style="color:#aaa" href='/feed/${replaceData}'>$${replaceData}</a>`
				)
			)
		}

		if (editorData.includes("@")) {
			var replaceData = editorData
				.substr(editorData.indexOf("@") + 1)
				.split(" ")[0]
			sethtmlContent(
				editorData.replace(
					`$${replaceData}`,
					`<a style="color:#eee">@${replaceData}</a>`
				)
			)
		}

	
		if (editorData == "") {
			setImage("")
		}

		var remainingposttextlength = 300 - posttextcount
		if (remainingposttextlength < 0) {
			remainingposttextlength = 0
			toaster.warnToaster("Maximum 300 chars allowed.", "POST TOO LONG!!")
		}

		setposttextcount(remainingposttextlength)
			if (posttextcount <= 300) {

				if ((linkInfo || image) && (hashTag.isFundamental || hashTag.isTechnical) && editorData !== null && editorData !== "" ) {
					setpostbuttonclass("post-btn")
					setIsPostOk(false)
				} else {
					return;
				} 
			} else{
				setIsPostOk(true)
				console.log("inside this text")
				toaster.warnToaster("Maximum 300 chars allowed.", "POST TOO LONG!!")

			}
		// var editorData = editorState.getCurrentContent().getPlainText("\u0001")
		// console.log("editor data in editor change event")
		// console.log(editorData)
		// //is the necassory? can we optimize this??  --HS : TODO
	}

	//triggers when fudamental button is getting clicked.
	function handleFundamental(event) {
		setHashTag({ ...hashTag, isFundamental: true, isTechnical: false })
	}

	//triggers when the technical button is getting clicked.
	function handleTechnical(event) {
		setHashTag({ ...hashTag, isFundamental: false, isTechnical: true })
		
	}

	//checks if any of the button is clcked.
	function checkHashTag() {
		return hashTag.isFundamental || hashTag.isTechnical ? true : false
	}

	//triggers when the thread creation button is getting cliked.
	function handleThreadCreatButton(event) {
		setAllowThread(!allowThread)
	}

	//triggers when ever we paste any image from web.
	function handlePastedImage(e, html) {
		if (e.length !== 1) {
			return
		}

		var file = e[0]
		const fileSize = file.size / 1024 / 1024 // in MiB
		if (fileSize > 20) {
			toaster.warnToaster("File size should be less than 20 MB", "UserPost")
		} else {
			setFileExtension(file.name.split(".").pop())
			getBase64(file)
				.then(result => {
					setPreview(result)
					setImage(result)
				})
				.catch(err => {
					//console.log(err)
				})
		}

		if (e[0]) {
			inputFile.current.value = ""
		}
		
	}

	return (
		<React.Fragment>
			<Form
				initialValues={{ a: "" }}
				className="form-horizontal"
				onSubmit={value => {
					handleValidSubmit(value)
				}}>
				<Row>
					<Col sm="12">
						<div className=" text-center">
							<div className={postloadingclass}>
								<span></span>
								<span></span>
								<span></span>
								<span></span>
								<span></span>
							</div>
						</div>
						<Row>
							<div className="col-md-1 col-2 text-sm-end">
								<img
									className="rounded-circle header-profile-user"
									src={userInfo.profilePhoto}
									alt="Header Avatar"
								/>
							</div>
							<div
								className="col-md-9 col-10 p-0"
								key={props.symboleValueInEditor}
								style={{ color: "GrayText", border: "1px #ccc solid"}}>
								<div key={props.symboleValueInEditor} onClick={() => focusEditor()}>
									<Editor
										editorState={editorState}
										placeholder={editorDefaultMessage}
										onChange={event => EditorChange(event)}
										plugins={plugins}
										ref={ref}
										handlePastedFiles={handlePastedImage}
										Entry
									/>
									<CountrySuggesionDropdown
										open={openCountry}
										onOpenChange={onOpenChange}
										suggestions={countrysuggestions}
										onSearchChange={onSearchChange}
									/>

									<SymbolSuggesionDropdown
										entryComponent={Entry}
										open={openSymbol}
										onOpenChange={onOpenChange2}
										suggestions={symbolsuggestions}
										onSearchChange={symbolSearch}
									/>

									<Row onClick={() => focusEditor()}>
										<div className="col-md-6 d-flex align-items-center">
											<div className="d-flex px-2">
												{/* <label
                          htmlFor="example-text-input"
                          className="col-form-label px-2 "
                        >
                          Source:
                        </label>
                        <div>
                          <input
                            className="form-control source-text  pb-0"
                            type="text"
                            id="example-text-input"
                            value={sourcelink}
                            readOnly
                          />
                        </div> */}
											</div>
										</div>
										<div className="imagePreviewDivBtnTag">
											{preview && (
												<div className="button-items px-2">
													<button
														type="button"
														onClick={() => {
															setPreview()
														}}
														className="text-start btn-draftimgupload">
														<i className="bx bx-x font-size-20"></i>
													</button>
												</div>
											)}
											{preview && (
												<img
													className="imagePreviewDivBtnTag"
													height="100%"
													width="100%"
													src={preview}
												/>
											)}
										</div>
										<div className="imagePreviewDivBtnTag">
											{isLoading ? <div> Loading...</div> : <></>}
											{didWeFetchLinkPreviewMetadata ? (
												<div>
													{getResult ? (
														<div>
															<div className="mb-0 message-img pt-3">
																<a
																	href={getResult.linkMeta.link}
																	target="_blank">
																	<div className="preview-data mt-2">
																		<div className="text-container">
																			<span className="header ">
																				{getResult.linkMeta.title}
																			</span>
																			<span className="text-domain">
																				{getResult.linkMeta.domain}
																			</span>
																		</div>
																		<div className="img-container">
																			<img
																				className="img"
																				src={getResult.linkMeta.img}
																			/>
																		</div>
																		<div className="text-container">
																			<span className="description">
																				{getResult.linkMeta.description}
																			</span>
																		</div>
																	</div>
																</a>
																<br />
																<span>
																	Source :{" "}
																	<a
																		href={getResult.linkMeta.originalURL}
																		target="_blank">
																		{getResult.linkMeta.originalURL}
																	</a>
																</span>
															</div>
														</div>
													) : (
														<></>
													)}
												</div>
											) : (
												<></>
											)}
										</div>									
									</Row>
								</div>
								<div className="col-md-8 offset-md-4" style={{ position : "relative", paddingTop:"80px" }}>
											<div className="d-flex justify-content-end">
												<div className="px-2 link-icon">
													<i className={ sourcelink ? "text-primary bx bx-link font-size-20" : "bx bx-link font-size-20"} />
												</div>
												<div className="button-items px-2">
													<button
														type="button"
														onClick={showOpenFileDialog}
														className= { preview ? "text-primary text-start btn-draftimgupload" : "text-start btn-draftimgupload"}>
														<i className="bx bx-images font-size-20"></i>
													</button>
													<input
														type="file"
														name="file"
														ref={inputFile}
														style={{ display: "none" }}
														accept="image/*"
														onChange={e => handleImageUpload(e)}
													/>
													{/*<button type='button' className='btn btn-primary py-2 px-5 mb-3' onClick={(e) => showOpenFileDialog(e)}> Upload Picture </button>*/}
												</div>

												{/*<div className="py-2">Sentiment : </div>*/}
												<label className=" col-form-label px-0 sentiment-text d-none d-sm-block">
													Sentiment:{" "}
												</label>
												<div className="px-1">
													<img
														src={bearImage}
														height="32"
														width="32"
														className="mx-3"></img>{" "}
													<br />
													<label className=" col-form-label p-0 px-0 postbox-text d-flex justify-content-center">
														strong sell
													</label>
												</div>
												<div className="px-1 ">
													{" "}
													<RangeSlider
														step={0.5}
														value={rangevalue}
														onChange={e => setRangeValue(e.target.value)}
														min={-10}
														max={10}
													/>
													<label className="col-form-label p-0 postbox-text d-flex justify-content-center">
														neutral
													</label>
												</div>
												<div className="px-1">
													{" "}
													<img
														src={bullImage}
														height="32"
														width="32"
														className="text-end mx-3"></img>
													<br />
													<label className=" col-form-label p-0 px-0 postbox-text d-flex justify-content-center">
														strong buy
													</label>
												</div>
											</div>
								</div>
							</div>
							<div className="col-md-2 pt-3 pt-md-1 ">
								<div className="btn-group-vertical">
									<input
										type="radio"
										className="btn-check"
										name="vbtn-radio"
										id="vbtn-radio1"
										autoComplete="off"
									/>
									<label
										className="btn-sm btn btn-outline-primary dashboard-fundamental"
										htmlFor="vbtn-radio1"
										checked={hashTag.isFundamental}
										onClick={e => handleFundamental(e)}>
										#fundamental
									</label>
									<input
										type="radio"
										className="btn-check"
										name="vbtn-radio"
										id="vbtn-radio2"
										autoComplete="off"
									/>
									<label
										className="btn-sm btn btn-outline-primary dashboard-technical"
										htmlFor="vbtn-radio2"
										checked={hashTag.isTechnical}
										onClick={e => handleTechnical(e)}>
										#technical
									</label>
								</div>
								<div className="pt-2 pb-1 ">
									<span className="text-muted font-size-16">
										{" "}
										{posttextcount}
									</span>
								</div>
								<div className="pt-2 pb-1">
									<span className="text-muted font-size-14">Replies?</span>
								</div>

								<div className="pt-2 pb-1">
									<Switch
										onColor="#86d3ff"
										onHandleColor="#2693e6"
										handleDiameter={15}
										uncheckedIcon={false}
										checkedIcon={false}
										boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
										activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
										height={20}
										width={48}
										className="react-switch"
										id="material-switch"
										onChange={e => handleThreadCreatButton(e)}
										checked={allowThread}
									/>
									<div className="d-flex">
										<Dropdown
											isOpen={dropdownOpen}
											toggle={toggle}
											direction="down">
											<DropdownToggle disabled={!allowThread} caret>
												Who?
											</DropdownToggle>
											<DropdownMenu>
												<DropdownItem onClick={() => setDropdownOption(1)}>
													None
												</DropdownItem>
												<DropdownItem onClick={() => setDropdownOption(2)}>
													Everyone
												</DropdownItem>
												<DropdownItem onClick={() => setDropdownOption(3)}>
													People I follow
												</DropdownItem>
											</DropdownMenu>
										</Dropdown>
									</div>
								</div>
								<div className={postbuttonclass}>
									<div>
										<p ref={toolTipref}>
											<Button
												disabled={isPostOk}
												type="submit"
												className="btn w-md">
												Post
											</Button>
										</p>
										<UncontrolledTooltip target={toolTipref}>
											{postFailureMessage}
										</UncontrolledTooltip>
									</div>
								</div>
							</div>
						</Row>
					</Col>
				</Row>
			</Form>
		</React.Fragment>
	)
}


export default DraftjsPostbox
