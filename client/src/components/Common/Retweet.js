import React, { useState, useCallback, useEffect, useRef } from "react"
import { useQuery } from "react-query"
import { withContext } from "../../context/index"
import { Button, Row } from "reactstrap"
import { Form } from "@availity/form"
import "@availity/yup"
import Editor from "@draft-js-plugins/editor"
import { EditorState, ContentState } from "draft-js"
import createHashtagPlugin from "@draft-js-plugins/hashtag"
import createLinkifyPlugin from "@draft-js-plugins/linkify"
import createImagePlugin from "@draft-js-plugins/image"
import createMentionPlugin, {
	defaultSuggestionsFilter,
} from "@draft-js-plugins/mention"
import Toaster from "./Toaster"
import axiosHttpMiddelware from "../../common/axiosHttpMiddelware"
import axiosAuthHttpMiddelware from "../../common/axiosAuthHttpMiddelware"
import "./PostCreate.scss"
import "bootstrap/dist/css/bootstrap.css"
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css"
import "draft-js/dist/Draft.css"
import "@draft-js-plugins/linkify/lib/plugin.css"
import "@draft-js-plugins/hashtag/lib/plugin.css"
import "@draft-js-plugins/image/lib/plugin.css"
import "@draft-js-plugins/mention/lib/plugin.css"
import ModalImage from "react-modal-image"

const hashtagPlugin = createHashtagPlugin()
const linkifyPlugin = createLinkifyPlugin()
const imagePlugin = createImagePlugin()
const countrySearchPlugin = createMentionPlugin({
	entityMutability: "IMMUTABLE",
	mentionPrefix: "@",
	mentionTrigger: "@",
	supportWhitespace: false,
})
const symbolSearchPlugin = createMentionPlugin({
	entityMutability: "IMMUTABLE",
	mentionPrefix: "$",
	mentionTrigger: "$",
	supportWhitespace: false,
})
const indexSearchPlugin = createMentionPlugin({
	entityMutability: "IMMUTABLE",
	mentionPrefix: "^",
	mentionTrigger: "^",
	supportWhitespace: false,
})
var plugins = [
	linkifyPlugin,
	hashtagPlugin,
	imagePlugin,
	countrySearchPlugin,
	symbolSearchPlugin,
	indexSearchPlugin,
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
const Retweet = ({ ...props }) => {
	const [symbolDataAll, setSymbolDataAll] = useState([])
	const [linkLength, setLinkLength] = useState(0)
	const [symbols, setSymbols] = useState([])
	const [postSymbols, setPostSymbols] = useState([])
	const editorDefaultMessage = "Write a Comment..."
	const editorFailureMessage =
		"1 : Use a $stock cashtag (you can have more than one). <br /> 2 : Include a source for your post, either a link to your source, or relevant image or screenshot, such as a price chart. <br /> 3 : Categorise as either #fundamental or #technical."
	const postFailureMessage =
		"1 : Use a $stock cashtag (you can have more than one).<i className='bx bx-check'></i> 2 : Include a source for your post, either a link to your source, or relevant image or screenshot, such as a price chart.<i className='bx bx-check'></i>"
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
		defaultString = props.post != null ? props.post.postrawdata : ""
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
	const [postbuttonclass, setpostbuttonclass] = useState("post-btn")
	const [postloadingclass, setpostloadingclass] = useState("loader-none")
	const [hashTag, setHashTag] = useState({
		isFundamental: true,
		isTechnical: false,
	})
	const [image, setImage] = useState(null)
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
	const [preview, setPreview] = useState([])
	const [linkInfo, setLinkInfo] = useState("")
	var countryData = []
	var symbolData = []
	var allSymbolData = []
	const [countrysuggestions, setcountrySuggestions] = useState(countryData)
	const [symbolsuggestions, setsymbolSuggestions] = useState(symbolData)
	const inputFile = useRef(null)
	const ref = useRef(null)
	const urlRegex =
		/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/
	const [getResult, setGetResult] = useState(null)
	const [isLogin, setIsLogin] = useState(false)
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
			axiosHttpMiddelware
				.post("/usergetbyid", { userid: userData.id })
				.then(userResponse => {
					setuserInfo({
						...userInfo,
						id: userData.id,
						name: userData.username,
						profilePhoto: userResponse.data.userResponse.profilephoto,
						isadmin: userData.isadmin,
					})
				})
			setuserInfo({
				...userInfo,
				id: userData.id,
				name: userData.username,
				profilePhoto: userData.profilePhoto,
				isadmin: userData.isadmin,
			})
			setIsLogin(true)
		}
		if (props.post != null) {
			// setHashTag({ isFundamental: props.post.isfundamental, isTechnical: props.post.istechnical })
			setRangeValue(props.post.sentimentvalue)
			setPreview(JSON.parse(props.post.imagedata))
			setImage(JSON.parse(props.post.imagedata))
			axiosAuthHttpMiddelware
				.get("/post/getPost", {
					params: {
						postguid: props.post.postguid,
					},
				})
				.then(response => {
					if (
						response.status === 200 &&
						response.data.postData !== undefined &&
						response.data.postData !== "" &&
						response.data.postData !== null
					) {
						let allSymbolData = response.data.postData.symbols.map(symbol =>
							symbol.symbolname.replace("$", "")
						)
						setSymbolDataAll(allSymbolData)
						setPostSymbols(
							response.data.postData.symbols.map(symbol => symbol.symbolname)
						)
						console.log(symbolDataAll)
					}
				})
		}
	}, [])

	const focusEditor = () => {
		ref.current.focus()
	}
	const CountrySuggesionDropdown = countrySearchPlugin.MentionSuggestions
	const SymbolSuggesionDropdown = symbolSearchPlugin.MentionSuggestions
	const IndexSuggesionDropdown = indexSearchPlugin.MentionSuggestions
	const onOpenChange = useCallback(_open => {
		setOpenCountry(_open)
	}, [])
	const onOpenChange2 = useCallback(_open => {
		if (_open && !openSymbol) {
			getSymbolbyName("A", "", "I")
			if (symbolData.length > 0) {
				// console.log(symbolData);
				setsymbolSuggestions(defaultSuggestionsFilter("A", symbolData))
			}
		}
		setOpenSymbol(_open)
	}, [])

	const onOpenChange3 = useCallback(_open => {
		if (_open && !openSymbol) {
			getSymbolbyName("^", "I")
			if (symbolData.length > 0) {
				// console.log(symbolData);
				setsymbolSuggestions(defaultSuggestionsFilter("A", symbolData))
			}
		}
		setOpenSymbol(_open)
	}, [])

	const onAddMention = value => {
		// get the mention object selected
		setPostSymbols([...postSymbols, "$" + value.name])
	}

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

	useEffect(() => {
		if (
			props.symboleValueInEditor != "$undefined " &&
			props.symboleValueInEditor != undefined
		) {
			let newContent = ContentState.createFromText(props.symboleValueInEditor)
			setEditorState(EditorState.createWithContent(newContent))
		}
	}, [props.symboleValueInEditor])

	//search symbol on server
	function getSymbolbyName(symbolsearch, type = "", notType = "") {
		axiosHttpMiddelware
			.post("search/symbol", {
				symbolname: symbolsearch,
			})
			.then(response => {
				if (response.status == 200) {
					symbolData = []
					allSymbolData = symbolDataAll
					if (response.data.symbolResponse.length > 0) {
						for (
							let index = 0;
							index < response.data.symbolResponse.length;
							index++
						) {
							const element = response.data.symbolResponse[index]
							if (element.exchDisp != "Australian") {
								if (type != "" && element.type == type) {
									let symbol = element.symbol
									if (type == "I") {
										symbol = symbol.replace("^", "")
									}
									symbolData.push({
										name: symbol,
										symboleName: element.name,
									})
									allSymbolData.push(element.symbol)
								} else if (notType != "" && element.type != notType) {
									symbolData.push({
										name: element.symbol,
										symboleName: element.name,
									})
									allSymbolData.push(element.symbol)
								}
							}
						}
					}
					setSymbolDataAll(allSymbolData)
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
			getSymbolbyName(value, "", "I")
			if (symbolData.length > 0) {
				// console.log(symbolData);
				setsymbolSuggestions(defaultSuggestionsFilter(value, symbolData))
			}
		} else {
			setsymbolSuggestions([])
		}
	}, [])
	const indexSearch = useCallback(({ value }) => {
		if (value) {
			getSymbolbyName(value, "I")
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
		if (e.target.files.length > 10) {
			Toaster.errorToaster("Please select 10 files", "Validation Error")
			setPreview("")
			setImage(null)
			return false
		}
		let fileArray = []
		for (let i = 0; i < e.target.files.length; i++) {
			getBase64(e.target.files[i]).then(res => {
				fileArray.push(res)
			})
		}
		setTimeout(() => {
			setPreview(fileArray)
			setImage(fileArray)
		}, 500)

		// var file = e.target.files[0]
		// getBase64(file).then(res => {
		//     setPreview(res)
		//     setImage(res)
		// })
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

	//handles post submit.
	function handleValidSubmit(event, values) {
		if (localStorage.getItem("user")) {
			var finalText = editorState.getCurrentContent().getPlainText("")
			finalText = finalText.replace("\u0001", "")
			finalText = finalText.replace("undefined", "").trim()
			console.log(finalText)
			var countryData = []
			var symbolData = []
			var htmlBodyText = ""
			const myArray = finalText.split(" ")
			for (let i = 0; i < myArray.length; i++) {
				if (myArray[i].startsWith("@")) {
					countryData.push(myArray[i])
					htmlBodyText += `<a style="color:#556ee6">${myArray[i]}</a>` + " "
				} else if (myArray[i].startsWith("$")) {
					if (symbolDataAll.indexOf(myArray[i].replace("$", "")) !== -1) {
						symbolData.push(myArray[i])
						let symbol = myArray[i].replace("$", "")
						htmlBodyText +=
							`<a style="color:#556ee6" href='/feed/${symbol}'>${myArray[i]}</a>` +
							" "
					} else {
						htmlBodyText += myArray[i] + " "
					}
				} else if (myArray[i].startsWith("\n$")) {
					if (symbolDataAll.indexOf(myArray[i].replace("\n$", "")) !== -1) {
						symbolData.push(myArray[i].replace("\n", ""))
						let symbol = myArray[i].replace("\n$", "")
						htmlBodyText +=
							`\n<a style="color:#556ee6" href='/feed/${symbol}'>${myArray[
								i
							].replace("\n", "")}</a>` + " "
					} else {
						htmlBodyText += myArray[i] + " "
					}
				} else if (myArray[i].startsWith("^")) {
					if (symbolDataAll.indexOf(myArray[i]) !== -1) {
						symbolData.push(myArray[i])
						htmlBodyText +=
							`<a style="color:#556ee6" href='/feed/${myArray[i]}'>${myArray[i]}</a>` +
							" "
					} else {
						htmlBodyText += myArray[i] + " "
					}
				} else if (myArray[i].startsWith("\n^")) {
					if (symbolDataAll.indexOf(myArray[i].replace("\n", "")) !== -1) {
						symbolData.push(myArray[i].replace("\n", ""))
						htmlBodyText +=
							`\n<a style="color:#556ee6" href='/feed/${myArray[i].replace(
								"\n",
								""
							)}'>${myArray[i].replace("\n", "")}</a>` + " "
					} else {
						htmlBodyText += myArray[i] + " "
					}
				} else {
					htmlBodyText += myArray[i] + " "
				}
			}
			if (getResult) {
				htmlBodyText = htmlBodyText.replace(urlRegex, "")
			}
			let posttextcountC = finalText.length
			if (linkLength <= posttextcountC) {
				posttextcountC = posttextcountC - linkLength
			}
			if (posttextcountC <= 300) {
				if (finalText !== null && finalText !== "") {
					//console.log("HTML Conversion : " + htmlContent);
					setpostloadingclass("loader1")
					// debugger;
					let linkIds = -1
					if (getResult) {
						linkIds = getResult.linkMeta.linkId
					}
					var userPostData = {
						hasThread: allowThread,
						postHTMLData: htmlBodyText.replace("\n\n", "\n \n"),
						postRawData: finalText.replace("\n\n", "\n \n"),
						imageData: image,
						countries: countryData,
						symbols: symbolData,
						isFundamental: false,
						isTechnical: false,
						sentiment: rangevalue,
						repliesPermission: dropdownOption,
						linkId: linkIds,
						parentPostId: props.retweetData.postguid,
					}
					axiosAuthHttpMiddelware
						.post("/post/create", { userPostData })
						.then(response => {
							if (response.status == 200) {
								setpostloadingclass("loader-none")
								Toaster.successToaster(response.data.message, "Success!")
								const neweditorState = EditorState.push(
									editorState,
									ContentState.createFromText("")
								)
								setDidWeFetchLinkPreviewMetadata(false)
								setGetResult(null)
								setPreview("")
								setImage(null)
								setLinkInfo("")
								setEditorState(neweditorState)
								setIsPostOk(false)
								setSymbols(false)
								props.onReload()
							} else {
								Toaster.errorToaster(
									"Something went wrong while creating post. please try again.",
									"Error"
								)
								setpostloadingclass("loader-none")
							}
						})
						.catch(err => {
							console.log(err)
							Toaster.errorToaster(
								"Something went wrong while creating pos",
								"Error"
							)
							setpostloadingclass("loader-none")
						})
					if (props.onChange) {
						props.onChange()
					}
				} else {
					console.log("some of the details are missing check post.")
					toaster.errorToaster("Add some text to reply", "Error")
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
		let posttextcountC = editorState
			.getCurrentContent()
			.getPlainText("\u0001").length
		if (linkLength <= posttextcountC) {
			posttextcountC = posttextcountC - linkLength
		}
		var editorData = editorState
			.getCurrentContent()
			.getPlainText("\u0001")
			.trim("undefined", "")
		if (editorData.match(urlRegex)) {
			setsourcelink(true)
			setLinkInfo(editorData)
			getPreview(editorData)
			editorData = editorData.replace(urlRegex, "")
		} else {
			setsourcelink(false)
			setLinkInfo("")
			setDidWeFetchLinkPreviewMetadata(false)
			setGetResult(null)
		}
		sethtmlContent(editorData)
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
			setSymbols(true)
		} else if (editorData.includes("^")) {
			var replaceData = editorData
				.substr(editorData.indexOf("^") + 1)
				.split(" ")[0]
			sethtmlContent(
				editorData.replace(
					`^${replaceData}`,
					`<a style="color:#aaa" href='/feed/${replaceData}'>^${replaceData}</a>`
				)
			)
			setSymbols(true)
		} else {
			setSymbols(false)
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
		var remainingposttextlength = 300 - posttextcountC
		if (remainingposttextlength < 0) {
			remainingposttextlength = 0
			toaster.warnToaster("Maximum 300 chars allowed.", "POST TOO LONG!!")
		}
		setposttextcount(remainingposttextlength)
		if (posttextcountC <= 300) {
			if ((linkInfo || image) && editorData !== null && editorData !== "") {
				setpostbuttonclass("post-btn")
				setIsPostOk(true)
			} else {
				return
			}
		} else {
			setIsPostOk(true)
			console.log("inside this text")
			toaster.warnToaster("Maximum 300 chars allowed.", "POST TOO LONG!!")
		}
		// var editorData = editorState.getCurrentContent().getPlainText("\u0001")
		// console.log("editor data in editor change event")
		// console.log(editorData)
		// //is the necassory? can we optimize this??  --HS : TODO
	}

	useEffect(() => {
		setHashTag({ isFundamental: true, isTechnical: false })
		setRangeValue(0)
	}, [props.reload])

	useEffect(() => {
		setposttextcount(posttextcount + linkLength)
	}, [linkLength])

	//triggers when fudamental button is getting clicked.
	function handleFundamental(event) {
		setHashTag({
			isTechnical: hashTag.isTechnical,
			isFundamental: !hashTag.isFundamental,
		})
	}

	//triggers when the technical button is getting clicked.
	function handleTechnical(event) {
		setHashTag({
			isTechnical: !hashTag.isTechnical,
			isFundamental: hashTag.isFundamental,
		})
	}

	//triggers when the thread creation button is getting cliked.
	function handleThreadCreatButton(event) {
		setAllowThread(!allowThread)
	}

	//triggers when ever we paste any image from web.
	function handlePastedImage(e, html) {
		if (e.length === 0) {
			return
		}
		let fileArray = []
		if (preview) {
			fileArray = preview
		}
		for (let i = 0; i < e.length; i++) {
			var file = e[i]
			const fileSize = file.size / 1024 / 1024 // in MiB
			if (fileSize > 20) {
				toaster.warnToaster("File size should be less than 20 MB", "UserPost")
			} else {
				getBase64(file).then(result => {
					fileArray.push(result)
				})
			}
		}
		setPreview([])
		setTimeout(() => {
			setPreview(fileArray)
			setImage(fileArray)
		}, 500)
		if (e[0]) {
			inputFile.current.value = ""
		}
	}

	function handlePastedText(text) {
		var urlPattern = new RegExp(
			"^(https?:\\/\\/)?" + // validate protocol
				"((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
				"((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
				"(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
				"(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
				"(\\#[-a-z\\d_]*)?$",
			"i"
		)
		if (!!urlPattern.test(text)) {
			setLinkLength(text.length)
			setLinkInfo(text)
			setTimeout(() => {
				getLinkPreivew()
			}, 100)
		}
	}
	const removeImage = index => {
		image.splice(index, 1)
		setPreview(image)
		setImage(image)
	}

	return (
		<React.Fragment>
			<Form
				initialValues={{ a: "" }}
				className="form-horizontal"
				onSubmit={value => {
					handleValidSubmit(value)
				}}>
				<div class="userpost-box">
					<div class="usbox-right-content" style={{ width: "100%" }}>
						<div class="ubox-top">
							<div class="usb-info" style={{ maxWidth: "100%" }}>
								<div
									className="d-flex align-items-center"
									key={props.symboleValueInEditor}
									onClick={() => focusEditor()}>
									<Editor
										editorState={editorState}
										placeholder={editorDefaultMessage}
										onChange={event => EditorChange(event)}
										handlePastedText={handlePastedText}
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
										onAddMention={onAddMention}
									/>
									<IndexSuggesionDropdown
										entryComponent={Entry}
										open={openSymbol}
										onOpenChange={onOpenChange3}
										suggestions={symbolsuggestions}
										onSearchChange={indexSearch}
										onAddMention={onAddMention}
									/>
									<div class="ubox-middle align-items-center">
										<div class="ut-button-right d-flex align-items-center">
											<div class="count-post">{posttextcount}</div>
											<i
												className={
													sourcelink
														? "text-primary bx bx-link font-size-20"
														: "bx bx-link font-size-20"
												}
											/>
											<button
												type="button"
												onClick={showOpenFileDialog}
												className={
													preview && preview.length > 0
														? "text-primary text-start btn-draftimgupload"
														: "text-start btn-draftimgupload"
												}
												style={{
													color:
														preview && preview.length > 0
															? "#1b72e4"
															: "#808080",
												}}
												disabled={!isLogin}>
												<i className="bx bx-images font-size-20"></i>
											</button>
											<input
												type="file"
												name="file"
												ref={inputFile}
												style={{ display: "none" }}
												accept="image/*"
												onChange={e => handleImageUpload(e)}
												multiple
											/>
										</div>
										<div>
											<a
												className="d-flex"
												ref={toolTipref}
												href="javascript:void(0)"
												disabled={!isLogin}
												id={isLogin ? "post-btn" : "disabled"}
												onClick={() => {
													handleValidSubmit()
												}}>
												<box-icon name="send" color="rgb(73 80 87)"></box-icon>
											</a>
										</div>
									</div>
									<Row onClick={() => focusEditor()}>
										<div className="imagePreviewDivBtnTag row mt-4">
											{preview && preview.length > 0 && (
												<>
													{preview.map((eachPreview, index) => {
														return (
															<div className="col-5" key={index}>
																<div
																	className="button-items px-2"
																	style={{
																		position: "absolute",
																		width: 40,
																		top: -15,
																	}}>
																	<button
																		type="button"
																		onClick={() => {
																			removeImage(index)
																		}}
																		className="text-start btn-draftimgupload"
																		id="draftimgupload"
																		disabled={!isLogin}>
																		<i className="bx bx-x font-size-20"></i>
																	</button>
																</div>
																<div
																	style={{
																		display: "inline-block",
																		margin: 2,
																	}}>
																	{eachPreview && (
																		<ModalImage
																			small={eachPreview}
																			large={eachPreview}
																			alt=""
																		/>
																	)}
																</div>
															</div>
														)
													})}
												</>
											)}
										</div>
										<div className="imagePreviewDivBtnTag">
											{isLoading ? <div> Loading...</div> : <></>}
											{didWeFetchLinkPreviewMetadata ? (
												<div>
													{getResult ? (
														<div>
															<div className="button-items px-2">
																<button
																	className="text-start btn-draftimgupload"
																	type="button"
																	onClick={() => {
																		setGetResult(null)
																	}}>
																	<i className="bx bx-x font-size-20"></i>
																</button>
															</div>
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
							</div>
						</div>
					</div>
				</div>
			</Form>
		</React.Fragment>
	)
}
export default Retweet
