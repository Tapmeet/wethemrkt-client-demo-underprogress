import React, { useState, useCallback, useEffect, useRef } from "react"
import { useQuery } from "react-query"
import { withContext } from "../../context/index"
import { Button, Row, Col, Tooltip } from "reactstrap"
import Skeleton, { SkeletonTheme } from "react-loading-skeleton"
import { Form } from "@availity/form"
import "@availity/yup"
import RangeSlider from "react-bootstrap-range-slider"
import Editor from "@draft-js-plugins/editor"
import { EditorState, ContentState } from "draft-js"
import createHashtagPlugin from "@draft-js-plugins/hashtag"
import createLinkifyPlugin from "@draft-js-plugins/linkify"
import createImagePlugin from "@draft-js-plugins/image"
import createMentionPlugin, {
	defaultSuggestionsFilter,
} from "@draft-js-plugins/mention"
import Toaster from "./Toaster"
import { postReloadSwitch as postReloadSwitchAction } from "../../store/actions/appActions"
import axiosHttpMiddelware from "../../common/axiosHttpMiddelware"
import axiosAuthHttpMiddelware from "../../common/axiosAuthHttpMiddelware"
import bearImage from "../../assets/images/bear.png"
import bullImage from "../../assets/images/bull.png"
import "./PostCreate.scss"
import "bootstrap/dist/css/bootstrap.css"
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css"
import "draft-js/dist/Draft.css"
import "@draft-js-plugins/linkify/lib/plugin.css"
import "@draft-js-plugins/hashtag/lib/plugin.css"
import "@draft-js-plugins/image/lib/plugin.css"
import "@draft-js-plugins/mention/lib/plugin.css"
import ModalImage from "react-modal-image"
import AWS from "aws-sdk"

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
const PostCreate = ({ postReload, postReloadSwitch, ...props }) => {
	const [symbolDataAll, setSymbolDataAll] = useState([])
	const [linkLength, setLinkLength] = useState(0)
	const [symbols, setSymbols] = useState([])
	const [postSymbols, setPostSymbols] = useState([])
	const [imageUploadLoaderCount, setImageUploadLoaderCount] = useState(0)
	const [tooltipOpen, setTooltipOpen] = useState(false)

	const toggleToolTip = () => setTooltipOpen(!tooltipOpen)
	// function to upload image to s3 bucket
	const handleImageUpload = async e => {
		if (e.target.files.length > 10) {
			Toaster.errorToaster("Please select 10 files", "Validation Error")
			setPreview([])
			setImage([])
			return false
		}

		setImageUploadLoaderCount(e.target.files.length)
		for (let i = 0; i < e.target.files.length; i++) {
			var file = e.target.files[i]
			const fileSize = file.size / 1024 / 1024 // in MiB
			if (fileSize > 20) {
				setImageUploadLoaderCount(0)
				toaster.warnToaster("File size should be less than 20 MB", "UserPost")
			} else {
				uploadToStorage(file).then(res => {
					setImageUploadLoaderCount(0)
					// add image to preview state
					setPreview([...preview, res])
					// add image to image state
					setImage([...image, res])
				})
			}
		}
	}

	// function to upload image to s3 bucket
	const uploadToStorage = async file => {
		// Set your Linode Object Storage credentials
		const linodeConfig = {
			accessKeyId: process.env.REACT_APP_FILE_STORAGE_ACCESS_KEY,
			secretAccessKey: process.env.REACT_APP_FILE_STORAGE_SECRET_KEY,
			region: process.env.REACT_APP_FILE_STORAGE_REGION,
			endpoint: process.env.REACT_APP_FILE_STORAGE_ENDPOINT,
		}

		// Create an S3 client
		const s3 = new AWS.S3(linodeConfig)

		// Specify the bucket name and the key (path) where you want to upload the image
		const bucketName = process.env.REACT_APP_FILE_STORAGE_BUCKET_NAME

		// get the file extension
		const fileExtension = file.name.split(".").pop()
		// create a unique file name for the image
		const key = `${
			process.env.REACT_APP_IMAGE_FOLDER
		}/${Date.now().toString()}.${fileExtension}`

		// Read the file content
		const fileContent = await file.arrayBuffer()

		// Set the parameters for the S3 upload
		const params = {
			Bucket: bucketName,
			Key: key,
			Body: Buffer.from(fileContent),
		}

		// set the access control headers
		params.ACL = "public-read"

		try {
			// Upload the image to Linode Object Storage
			const data = await s3.upload(params).promise()
			return data.Location
		} catch (error) {
			console.error("Error uploading image:", error)
			return false
		}
	}

	const editorDefaultMessage = "Share an idea (use $ before symbol eg $SYMBL)"
	const editorFailureMessage =
		"1 : Use a $stock cashtag (you can have more than one). <br /> 2 : Include a source for your post, either a link to your source, or relevant image or screenshot, such as a price chart. <br /> 3 : Categorise as either #fundamental or #technical."
	const postFailureMessage =
		"1 : Use a $stock cashtag (you can have more than one).<i className='bx bx-check'></i> 2 : Include a source for your post, either a link to your source, or relevant image or screenshot, such as a price chart.<i className='bx bx-check'></i>"
	const [posttextcount, setposttextcount] = useState(500)
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
		isFundamental: false,
		isTechnical: false,
	})
	const [image, setImage] = useState([])
	const [allowThread, setAllowThread] = useState(false)
	const [openCountry, setOpenCountry] = useState(false)
	const [openSymbol, setOpenSymbol] = useState(false)
	const [sourcelink, setsourcelink] = useState(false)
	const [isPostOk, setIsPostOk] = useState(false)
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
			setHashTag({
				isFundamental: props.post.isfundamental,
				isTechnical: props.post.istechnical,
			})
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
						if (allSymbolData.length > 0) {
							setSymbols(true)
						}
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
			// validate fundamental or technical is selected or not
			if (!hashTag.isFundamental && !hashTag.isTechnical) {
				Toaster.errorToaster("Please select fundamental or technical", "Error")
				return false
			}

			if (getResult) {
				htmlBodyText = htmlBodyText.replace(urlRegex, "")
			}
			let posttextcountC = finalText.length
			if (linkLength <= posttextcountC) {
				posttextcountC = posttextcountC - linkLength
			}
			if (posttextcountC <= 500) {
				if (finalText !== null && finalText !== "") {
					//console.log("HTML Conversion : " + htmlContent);
					setpostloadingclass("loader1")
					// debugger;
					let linkIds = -1
					if (getResult) {
						linkIds = getResult.linkMeta.linkId
					}
					let postguid = props.post != null ? props.post.postguid : null
					var userPostData = {
						hasThread: allowThread,
						postHTMLData: htmlBodyText.replace("\n\n", "\n \n"),
						postRawData: finalText.replace("\n\n", "\n \n"),
						imageData: image,
						countries: countryData,
						symbols: symbolData,
						isFundamental: hashTag.isFundamental,
						isTechnical: hashTag.isTechnical,
						sentiment: rangevalue,
						repliesPermission: dropdownOption,
						linkId: linkIds,
						postguid: postguid,
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
								setTimeout(() => {
									postReloadSwitch()
								}, 2000)
								if (props.modal) {
									props.toggle()
								}
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
				toaster.errorToaster("Maximum 500 chars allowed.", "POST TOO LONG")
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
		setSymbols(false)
		if (editorData.includes("$")) {
			// split
			var replaceData = editorData
				.substr(editorData.indexOf("$") + 1)
				.split(" ")[0]
			sethtmlContent(
				editorData.replace(
					`$${replaceData}`,
					`<a style="color:#aaa" href='/feed/${replaceData}'>$${replaceData}</a>`
				)
			)
			// split editor data and check if the symbol is already present in the all symbol data
			// if not then add it to the symbol data
			const arrEditorData = editorData.split(" ")
			const arrSymbolData = symbolDataAll
			const arrSymbolDataLength = arrSymbolData.length
			const arrEditorDataLength = arrEditorData.length
			for (let i = 0; i < arrEditorDataLength; i++) {
				for (let j = 0; j < arrSymbolDataLength; j++) {
					console.log(arrEditorData[i].replace("$"), arrSymbolData[j])
					if (arrEditorData[i].replace("$", "") == arrSymbolData[j]) {
						setSymbols(true)
					}
				}
			}
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
			// split editor data and check if the symbol is already present in the all symbol data
			// if not then add it to the symbol data
			const arrEditorData = editorData.split(" ")
			const arrSymbolData = symbolDataAll
			const arrSymbolDataLength = arrSymbolData.length
			const arrEditorDataLength = arrEditorData.length
			for (let i = 0; i < arrEditorDataLength; i++) {
				for (let j = 0; j < arrSymbolDataLength; j++) {
					if (arrEditorData[i] == arrSymbolData[j]) {
						setSymbols(true)
					}
				}
			}
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
		var remainingposttextlength = 500 - posttextcountC
		if (remainingposttextlength < 0) {
			remainingposttextlength = 0
			toaster.warnToaster("Maximum 500 chars allowed.", "POST TOO LONG!!")
		}
		setposttextcount(remainingposttextlength)
		if (posttextcountC <= 500) {
			checkPostValidity()
		} else {
			setIsPostOk(true)
			console.log("inside this text")
			toaster.warnToaster("Maximum 500 chars allowed.", "POST TOO LONG!!")
		}
		// var editorData = editorState.getCurrentContent().getPlainText("\u0001")
		// console.log("editor data in editor change event")
		// console.log(editorData)
		// //is the necassory? can we optimize this??  --HS : TODO
	}

	useEffect(() => {
		checkPostValidity()
	}, [linkInfo, image, hashTag, symbols])

	const checkPostValidity = () => {
		var editorData = editorState
			.getCurrentContent()
			.getPlainText("\u0001")
			.trim("undefined", "")
		if (
			(linkInfo || (image && image.length > 0)) &&
			(hashTag.isFundamental || hashTag.isTechnical) &&
			editorData !== null &&
			editorData != "$" &&
			editorData != "^" &&
			editorData !== "" &&
			symbols > 0
		) {
			setpostbuttonclass("post-btn")
			setIsPostOk(true)
		} else {
			setIsPostOk(false)
			return
		}
	}

	useEffect(() => {
		// if props.post is null or undefined then reset the editor state
		if (props.post == null || props.post == undefined) {
			setHashTag({ isFundamental: false, isTechnical: false })
		}
		setRangeValue(0)
	}, [postReload])

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
		setImageUploadLoaderCount(e.length)
		for (let i = 0; i < e.length; i++) {
			var file = e[i]
			const fileSize = file.size / 1024 / 1024 // in MiB
			if (fileSize > 20) {
				setImageUploadLoaderCount(0)
				toaster.warnToaster("File size should be less than 20 MB", "UserPost")
			} else {
				uploadToStorage(file).then(res => {
					setImageUploadLoaderCount(0)
					// add image to preview state
					setPreview([...preview, res])
					// add image to image state
					setImage([...image, res])
				})
			}
		}
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
				className="form-horizontal bg-white"
				onSubmit={value => {
					handleValidSubmit(value)
				}}>
				<div class="userpost-box">
					<div class="usbox-profile">
						{userInfo.profilePhoto ? (
							<img src={userInfo.profilePhoto} alt="Header Avatar" />
						) : (
							<div className="circle-shadow-a bg-gray">
								<i className="rounded-circle bx bx-user font-size-20 align-middle" />
							</div>
						)}
					</div>
					<div class="usbox-right-content">
						<div class="ubox-top">
							<div class="usb-info">
								<h5>{userInfo.username}</h5>
								<div
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
										stripPastedStyles={true}
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
											{imageUploadLoaderCount > 0 && (
												<Col className="col-5">
													<div className="d-flex align-items-center">
														{Array.from(
															Array(imageUploadLoaderCount).keys()
														).map((eachLoader, index) => {
															return (
																<div className="p-1">
																	<SkeletonTheme
																		color="#1c73e4"
																		highlightColor="#fff">
																		<Skeleton height={100} width={100} />
																	</SkeletonTheme>
																</div>
															)
														})}
													</div>
												</Col>
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

						<div class="ubox-middle">
							<div class="ut-buttonrow">
								<div class="btn-group-vertical">
									<div class="bt-lable">
										<input
											type="radio"
											className="btn-check"
											name={props.modal ? "vbtn-radio1-modal" : "vbtn-radio1"}
											id={props.modal ? "vbtn-radio1-modal" : "vbtn-radio1"}
											autoComplete="off"
											checked={hashTag.isFundamental}
										/>
										<label
											className="btn-sm btn btn-outline-primary dashboard-fundamental"
											htmlFor={
												props.modal ? "vbtn-radio1-modal" : "vbtn-radio1"
											}
											checked={hashTag.isFundamental}
											onClick={e => handleFundamental(e)}>
											#fundamental
										</label>
									</div>
									<div class="bt-lable">
										<input
											type="radio"
											className="btn-check"
											name={props.modal ? "vbtn-radio2-modal" : "vbtn-radio2"}
											id={props.modal ? "vbtn-radio2-modal" : "vbtn-radio2"}
											autoComplete="off"
											checked={hashTag.isTechnical}
										/>
										<label
											className="btn-sm btn btn-outline-primary dashboard-technical"
											htmlFor={
												props.modal ? "vbtn-radio2-modal" : "vbtn-radio2"
											}
											checked={hashTag.isTechnical}
											onClick={e => handleTechnical(e)}>
											#technical
										</label>
									</div>
								</div>
							</div>
							<div class="ut-button-right">
								<div class="count-post"> {posttextcount}</div>
							</div>
						</div>
					</div>
				</div>
				<div class="userpost-box top-border">
					<div class="usbox-profile"></div>
					<div class="usbox-right-content">
						<div class="icon-grid">
							<ul>
								<li>
									<i
										className={
											sourcelink
												? "text-primary bx bx-link font-size-20"
												: "bx bx-link font-size-20"
										}
									/>
								</li>
								<li>
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
												preview && preview.length > 0 ? "#1b72e4" : "#808080",
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
								</li>
								<li>
									<img
										src={bearImage}
										height="32"
										width="32"
										className="mx-3"></img>{" "}
									<br />
									<label
										className=" col-form-label p-0 px-0 postbox-text d-flex justify-content-center"
										style={{ position: "relative", top: "6px" }}>
										strong sell
									</label>
								</li>
								<li>
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
								</li>
								<li>
									{" "}
									<img
										src={bullImage}
										height="32"
										width="32"
										className="text-end mx-3"></img>
									<br />
									<label
										className=" col-form-label p-0 px-0 postbox-text d-flex justify-content-center"
										style={{ position: "relative", top: "6px" }}>
										strong buy
									</label>
								</li>
							</ul>
							<div id="post-btn-disabled">
								<Button
									disabled={!isPostOk || !isLogin}
									type="submit"
									className="theme-btn pb-btn"
									id={isLogin ? "post-btn" : "disabled"}>
									Post
								</Button>
								{(!isPostOk || !isLogin) && (
									<Tooltip
										placement="top"
										isOpen={tooltipOpen}
										target="post-btn-disabled"
										toggle={toggleToolTip}>
										Requirements to post not meet
									</Tooltip>
								)}
							</div>
						</div>
					</div>
				</div>

				{(didWeFetchLinkPreviewMetadata ||
					(preview && preview.length > 0) ||
					htmlContent) && (
					<div className="ubox-middle rs-box">
						<small>
							<div style={{ display: "block", position: "relative" }}>
								{symbols > 0 && (
									<i
										className="bx bx-check"
										style={{
											color: "#74A04C",
											fontSize: 26,
											position: "absolute",
											left: -22,
											top: -6,
										}}></i>
								)}
								Use a $stock cashtag (you can have more than one).
							</div>
							<div style={{ display: "block", position: "relative" }}>
								{(didWeFetchLinkPreviewMetadata ||
									(preview && preview.length > 0)) && (
									<i
										className="bx bx-check"
										style={{
											color: "#74A04C",
											fontSize: 26,
											position: "absolute",
											left: -22,
											top: -6,
										}}></i>
								)}
								Include a source for your post, either a link to your source, or
								relevant image or screenshot, such as a price chart.
							</div>
							<div style={{ display: "block", position: "relative" }}>
								{(hashTag.isFundamental || hashTag.isTechnical) && (
									<i
										className="bx bx-check"
										style={{
											color: "#74A04C",
											fontSize: 26,
											position: "absolute",
											left: -22,
											top: -6,
										}}></i>
								)}
								Select #fundamental or #technical or both.
							</div>
						</small>
					</div>
				)}
			</Form>
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
		postReload: postReload,
		postReloadSwitch: () => postReloadSwitchAction(dispatch),
	}),
	PostCreate
)
