// import React, { useState, useEffect, useRef, useCallback } from "react"
// import PropTypes from 'prop-types'

// // reactstrap
// import { Card, CardBody, Modal, Row, Col, Button, Popover, PopoverHeader, PopoverBody } from "reactstrap"

// //i18n
// // import { withTranslation } from "react-i18next"

// import { Field, Form } from '@availity/form';
// import '@availity/yup';
// import * as yup from 'yup';

// //import { AvForm } from "availity-reactstrap-validation"
// import { useHistory } from "react-router-dom";

// import 'bootstrap/dist/css/bootstrap.css'; // or include from a CDN
// import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
// import RangeSlider from 'react-bootstrap-range-slider';

// import bearImage from "../../../assets/images/bear.png";
// import bullImage from "../../../assets/images/bull.png";
// // users


// // import userpost from '../../../services/post.service';
// // import symbol from '../../../services/symbol.servie';
// // import user from '../../../services/user.service';
// // import country from '../../../services/country.service';

// import Editor from '@draft-js-plugins/editor';
// import { EditorState, AtomicBlockUtils, ContentState } from 'draft-js';
// import { convertToHTML } from 'draft-convert';
// import createHashtagPlugin from '@draft-js-plugins/hashtag';
// import createLinkifyPlugin from '@draft-js-plugins/linkify';
// import createImagePlugin from '@draft-js-plugins/image';
// import createMentionPlugin, {
//     defaultSuggestionsFilter,
// } from '@draft-js-plugins/mention';

// import 'draft-js/dist/Draft.css';
// import '@draft-js-plugins/linkify/lib/plugin.css';
// import '@draft-js-plugins/hashtag/lib/plugin.css';
// import '@draft-js-plugins/image/lib/plugin.css';

// const hashtagPlugin = createHashtagPlugin();
// const linkifyPlugin = createLinkifyPlugin();
// const imagePlugin = createImagePlugin();
// const mentionPlugin = createMentionPlugin({
//     entityMutability: 'IMMUTABLE',
//     mentionPrefix: '@',
//     mentionTrigger: '@',
//     supportWhitespace: true,
// });

// const mentionPlugin2 = createMentionPlugin({
//     entityMutability: 'IMMUTABLE',
//     mentionPrefix: '$',
//     mentionTrigger: '$',
//     supportWhitespace: true,
// });

// const plugins = [linkifyPlugin, hashtagPlugin, imagePlugin, mentionPlugin, mentionPlugin2];

// import toaster from '../../../components/Common/Toaster';
// // import PostComment from "../PostOptions/PostComment"
// import "../../../assets/scss/custom/wethemkrt/people.scss"
// import "../../../assets/scss/custom/wethemkrt/retweet.scss"

// const Retweet = props => {
//     let history = useHistory();
//     const [posttextcount, setposttextcount] = useState(300);
//     const [popovertop, setpopovertop] = useState(false);
//     const [postbuttonclass, setpostbuttonclass] = useState("post-btn-grey");
//     const [hashTag, setHashTag] = useState({ isNews: false, isFundamental: false, isTechnical: false });
//     const [sourcelink, setsourcelink] = useState(false);
//     const ref = useRef(null);
//     const [fileExtension, setFileExtension] = useState('png');
//     const [openCountry, setOpenCountry] = useState(false);
//     var countryData = [];
//     const [countrysuggestions, setcountrySuggestions] = useState(countryData);
//     const [openSymbol, setOpenSymbol] = useState(false);
//     var symbolData = [];
//     const [symbolsuggestions, setsymbolSuggestions] = useState(symbolData);
//     const [htmlContent, sethtmlContent] = useState("");
//     var urlRegex = /(https?:\/\/[^ ]*)/;
//     const [preview, setPreview] = useState()

//     // var usernameData = props.elementInfo.username;
//     // var postData = props.elementInfo.post;
//     // const sampleMarkup = '<div><h6>'+ usernameData +'</h6><p>'+ postData +'</p></div>';

//     // const blocksFromHTML = convertFromHTML(sampleMarkup);
//     // const postContent = ContentState.createFromBlockArray(
//     //     blocksFromHTML.contentBlocks,
//     //     blocksFromHTML.entityMap
//     // );
//     const [editorState, setEditorState] = useState(EditorState.createEmpty());
//     // const stateWithEntity = editorState.getCurrentContent().createEntity(
//     //     'mention',
//     //     'IMMUTABLE',
//     //     {
//     //       mention: {id: 'foobar', name: 'foobar', link: 'https://www.facebook.com/foobar'},
//     //     },
//     //   )
//     //   const entityKey = stateWithEntity.getLastCreatedEntityKey()
//     //   const stateWithText = Modifier.insertText(stateWithEntity, editorState.getSelection(), 'foobar', null, entityKey)
//     //   EditorState.push(editorState, stateWithText)


//     //const [editorState, setEditorState] = useState(EditorState.createWithContent(postContent));

//     //const [editorState, setEditorState] = useState(EditorState.createWithContent(ContentState.createFromText(props.elementInfo.post)));
//     const [rangevalue, setRangeValue] = useState(0);
//     const [image, setimage] = useState('');
//     const inputFile = useRef(null);
//     // const [symbolsugesstion, setsymbolsugesstion] = useState("");
//     const [modal_standard, setmodal_standard] = useState(false)

//     useEffect(() => {
//         setmodal_standard(props.dataParentToChild)
//         removeBodyCss()
//     }, [])

//     function removeBodyCss() {
//         document.body.classList.add("no_padding")
//     }

//     function tog_standard() {
//         setmodal_standard(!modal_standard)
//         removeBodyCss()
//     }

//     function handleChange() {
//         setmodal_standard(false);
//         props.onChange(false);
//     }

//     const focusEditor = () => {
//         ref.current.focus()
//     }

//     const MentionSuggestions = mentionPlugin.MentionSuggestions;
//     const MentionSuggestions2 = mentionPlugin2.MentionSuggestions;

//     const onOpenChange = useCallback((_open) => {
//         setOpenCountry(_open);
//     }, []);

//     const onOpenChange2 = useCallback((_open) => {
//         setOpenSymbol(_open);
//     }, []);

//     async function getCountrybyName(countrysearch) {
//         // const response = await country.getCountryByName(countrysearch);
//         // if (response.status == 200) {
//         //     countryData = [];
//         //     // userData = response.data.userResponse;
//         //     if (response.data.countryResponse.length > 0) {
//         //         for (let index = 0; index < response.data.countryResponse.length; index++) {
//         //             const element = response.data.countryResponse[index];
//         //             countryData.push({ "name": element.countrycode });
//         //         }
//         //     }
//         //     setcountrySuggestions(countryData);
//         // }
//     }

//     async function getSymbolbyName(symbolsearch) {
//         // const response = await symbol.getSymbolData(symbolsearch);
//         // if (response.status == 200) {
//         //     symbolData = [];
//         //     if (response.data.symbolResponse.length > 0) {
//         //         for (let index = 0; index < response.data.symbolResponse.length; index++) {
//         //             const element = response.data.symbolResponse[index];
//         //             symbolData.push({ "name": element.symbol });
//         //         }
//         //     }
//         //     setsymbolSuggestions(symbolData);
//         // }
//     }

//     const onSearchChange = useCallback(({ value }) => {
//         // if (value) {
//         //     getCountrybyName(value);
//         //     if (countryData.length > 0) {
//         //         setcountrySuggestions(defaultSuggestionsFilter(value, countryData));
//         //     }
//         // }
//         // else {
//         //     setcountrySuggestions([]);
//         // }
//     }, []);

//     const onSearchChange2 = useCallback(({ value }) => {
//         // if (value) {
//         //     getSymbolbyName(value);
//         //     if (symbolData.length > 0) {
//         //         setsymbolSuggestions(defaultSuggestionsFilter(value, symbolData));
//         //     }
//         // }
//         // else {
//         //     setsymbolSuggestions([]);
//         // }
//     }, []);

//     function getBase64(file) {
//         return new Promise(resolve => {
//             let baseURL = "";
//             let reader = new FileReader();

//             // Convert the file to base64 text
//             reader.readAsDataURL(file);
//             // on reader load somthing...
//             reader.onload = () => {
//                 // Make a fileInfo Object
//                 baseURL = reader.result;
//                 setimage(reader.result);
//                 resolve(baseURL);
//             };
//         });
//     };

//     const handleClickTwo = (e) => {
//         var file = e.target.files[0];

//         const fileSize = file.size / 1024 / 1024; // in MiB
//         if (fileSize > 20) {
//             toaster.warnToaster('File size should be less than 20 MB', 'UserPost');
//         }
//         else {
//             setFileExtension(file.name.split('.').pop());
//             getBase64(file).then(result => {
//                 setPreview(result);
//                 // const newEditorState = insertImage(editorState, result);
//                 // setEditorState(newEditorState);
//                 // var validHashTag = checkHashTag();
//                 if (newEditorState && validHashTag) {
//                     setpostbuttonclass("post-btn");
//                 }
//                 else {
//                     setpostbuttonclass("post-btn-grey");
//                 }
//             }).catch(err => {
//                 console.log(err);
//             });
//         }



//         if (e.target.files[0]) {
//             inputFile.current.value = "";
//         }
//     };

//     function insertImage(editorState, base64) {
//         const contentState = editorState.getCurrentContent();
//         const contentStateWithEntity = contentState.createEntity("image", "IMMUTABLE", { src: base64 });
//         const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
//         const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
//         return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ");
//     };

//     const showOpenFileDialog = () => {
//         inputFile.current.click();
//     };

//     //   async function getSymbolData(e) {
//     //       setsymbolsugesstion("");

//     //       if (e.target.value) {
//     //         const response = await symbol.getSymbolData(e.target.value);
//     //         if (response.status == 200) {
//     //           setsymbolsugesstion(response.data.symbolResponse.map(({ symbol,name }) => ({ label: name, value: symbol })));
//     //         }
//     //       }
//     //       else{
//     //         const response = await symbol.getTrendingSymbols();
//     //         if (response.status == 200) {
//     //           setsymbolsugesstion(response.data.trendingSymbolResponse[0].quotes.map(({ symbol }) => ({ label: symbol, value: symbol })));
//     //         }
//     //       }
//     //   }

//     function checkHashTag() {
//         return  hashTag.isFundamental || hashTag.isTechnical ? true : false;
//         // if (hashTag.isNews && hashTag.isFundamental && hashTag.isTechnical) {
//         //     return false;
//         // }
//         // if ((hashTag.isNews && hashTag.isFundamental) || (hashTag.isNews && hashTag.isTechnical)) {
//         //     return true;
//         // }
//         // else {
//         //     return false;
//         // }
//     }

//     function checkPostbuttonValidation(editorData) {
//         var isurl = isValidURL(editorData);
//         // var validHashTag = checkHashTag();

//         if (isurl) {
//             // var urlRegex = /(https?:\/\/[^ ]*)/;
//             if (editorData.match(urlRegex) != null) {
//                 setsourcelink(false);
//             }
//         }
//         else {
//             setsourcelink(true);
//         }

//         if (editorData && (isurl || (editorData != "" && editorData == " "))) { // && validHashTag
//             setpostbuttonclass("post-btn");
//             setpopovertop(false);
//         }
//         else {
//             setpostbuttonclass("post-btn-grey");
//         }
//     }

//     function textareachange(event) {
//         const posttextcount = event.getCurrentContent().getPlainText('\u0001').length;//event.blocks[0].text.length
//         var editorData = event.getCurrentContent().getPlainText('\u0001');

//         var htmlData = convertToHTML(event.getCurrentContent());
//         if (htmlData != null && htmlData.includes('figure')) {
//             htmlData = htmlData.replace('<figure>', '')
//             htmlData = htmlData.replace('</figure>', '')
//         }
//         if (htmlData.match(urlRegex)) {
//             htmlData = htmlData.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
//         }
//         if (htmlData != null && htmlData.includes('$')) {
//             var replaceData = htmlData.substr(htmlData.indexOf("$") + 1).split(' ')[0]
//             sethtmlContent(htmlData.replace(`$${replaceData}`, `<a style="color:#556ee6" href='/feed/${replaceData}'>$${replaceData}</a>`));
//         }

//         if (editorData == "") {
//             setimage("");
//         }

//         checkPostbuttonValidation(editorData);
//         var remainingposttextlength = 300 - posttextcount;
//         setposttextcount(remainingposttextlength);
//     }

//     function isValidURL(string) {
//         var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
//         return (res !== null)
//     };

//     function httpHtml(content) {
//         const reg = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
//         return content.replace(reg, "");
//     };

//     const handleValidSubmit = (event, values) => {
//         if (localStorage.getItem("user") && props.elementInfo !== null && props.elementInfo !== undefined) {
//             const obj = JSON.parse(localStorage.getItem("user"));
//             var text = editorState.getCurrentContent().getBlocksAsArray();
//             var finalText;
//             text.map((item) => {
//                 finalText = finalText + item.getText()
//             });
//             if (finalText.toLowerCase().includes("undefined")) {
//                 finalText = finalText.replace("undefined", "").trim();
//             }

//             var isurl = isValidURL(finalText);
//             // var validHashTag = checkHashTag();
//             var link = '';

//             if (isurl) {
//                 // var urlRegex = /(https?:\/\/[^ ]*)/;
//                 link = finalText.match(urlRegex)[1];
//                 finalText = httpHtml(finalText);
//             }

//             if ((isurl || image) && (hashTag.isFundamental || hashTag.isTechnical) && (finalText !== null && finalText !== "" && finalText.length <= 300)) {
//                 var newValues = {
//                     userid: obj.id,
//                     retweetpostid: props.elementInfo.id,
//                     isretweet: true,
//                     userpost: finalText,
//                     htmlpost: htmlContent,
//                     imageuri: image,
//                     fileextension: fileExtension,
//                     isnews: true,
//                     isfundamental: hashTag.isFundamental,
//                     istechnical: hashTag.isTechnical,
//                     bullish: rangevalue > 0 ? rangevalue : 0,
//                     bearish: rangevalue < 0 ? rangevalue : 0,
//                     link: link,
//                     upvotecount: 0,
//                     downvotecount: 0
//                 }

//                 // const response = userpost.createUserPost(newValues);
//                 // if (props.onChange) {
//                 //     props.onChange();
//                 // }
//                 window.location.reload();
//             }
//             else {
//                 setpopovertop(!popovertop);
//             }
//         }
//     }

//     function EditorChange(editorState) {
//         setEditorState(editorState);
//         textareachange(editorState);
//         var editorData = editorState.getCurrentContent().getPlainText('\u0001');
//         var isurl = isValidURL(editorData);
//         if (isurl && editorData.match(urlRegex) != null) {
    
//           setsourcelink(true)
//         }
//         else {
//           setsourcelink(false)
//         }
//     };

//     // function handleNews(event){
//     //     event.preventDefault();
//     //     setHashTag({...hashTag,isNews:!hashTag.isNews});
//     //     var editorData = editorState.getCurrentContent().getPlainText('\u0001');
//     //     checkPostbuttonValidation(editorData);
//     // }

//     function handleFundamental(event) {
//         // event.preventDefault();
//         setHashTag({ ...hashTag, isFundamental: !hashTag.isFundamental });
//         // var editorData = editorState.getCurrentContent().getPlainText('\u0001');
//         // checkPostbuttonValidation(editorData);
//     }

//     function handleTechnical(event) {
//         // event.preventDefault();
//         setHashTag({ ...hashTag, isTechnical: !hashTag.isTechnical });
//         // var editorData = editorState.getCurrentContent().getPlainText('\u0001');
//         // checkPostbuttonValidation(editorData);
//     }

//     function handlePastedImage(e, html) {
//         if (e.length !== 1) {
//             return;
//         }

//         var file = e[0];
//         const fileSize = file.size / 1024 / 1024; // in MiB
//         if (fileSize > 20) {
//             toaster.warnToaster('File size should be less than 20 MB', 'UserPost');
//         }
//         else {
//             setFileExtension(file.name.split('.').pop());
//             getBase64(file).then(result => {
//                 setPreview(result);
//                 // const newEditorState = insertImage(editorState, result);
//                 // setEditorState(newEditorState);
//                 // var validHashTag = checkHashTag();
//                 if (newEditorState) {
//                     setpostbuttonclass("post-btn");
//                 }
//                 else {
//                     setpostbuttonclass("post-btn-grey");
//                 }
//             }).catch(err => {
//                 console.log(err);
//             });
//         }

//         if (e[0]) {
//             inputFile.current.value = "";
//         }
//     }

//     return (
//         <React.Fragment>
//             {props !== undefined ?
//                 <div className="topnav">
//                     <div className="container-fluid">
//                         <Card>
//                             <CardBody>
//                                 <div>
//                                     <Modal size="lg" isOpen={modal_standard} toggle={() => { tog_standard() }} centered={true} >
//                                         <div className="modal-header d-flex justify-content-center">
//                                             <h5 className="modal-title mt-0"> Post an Idea </h5>
//                                             <button type="button" onClick={() => { handleChange() }} className="close" data-dismiss="modal" aria-label="Close">
//                                                 <span aria-hidden="true">&times;</span>
//                                             </button>
//                                         </div>
//                                         <div className="modal-body">
//                                             <Form className="form-horizontal" onSubmit={(value) => { handleValidSubmit(value) }}>
//                                                 <Row>
//                                                     <div className=" col-md-1 col-2  text-sm-end ">
//                                                         <img className="rounded-circle header-profile-user" src={props.elementInfo.userimage == null ? user2 : props.elementInfo.userimage} alt="Header Avatar" />
//                                                     </div>
//                                                     <div className="col-md-9 col-10 p-0">
//                                                         <div style={{ color: "GrayText", border: "1px #ccc solid" }} onClick={() => focusEditor()}>
//                                                             <Editor editorState={editorState} placeholder="Start a new post..."
//                                                                 spellCheck={true} onChange={(event) => EditorChange(event)} plugins={plugins} ref={ref}
//                                                                 handlePastedFiles={handlePastedImage} />
//                                                             <MentionSuggestions open={openCountry}
//                                                                 onOpenChange={onOpenChange}
//                                                                 suggestions={countrysuggestions}
//                                                                 onSearchChange={onSearchChange}
//                                                                 onAddMention={() => {
//                                                                     // get the mention object selected
//                                                                 }}
//                                                             />
//                                                             <MentionSuggestions2 open={openSymbol}
//                                                                 onOpenChange={onOpenChange2}
//                                                                 suggestions={symbolsuggestions}
//                                                                 onSearchChange={onSearchChange2}
//                                                                 onAddMention={() => {
//                                                                     // get the mention object selected
//                                                                 }}
//                                                             />
//                                                             <div>
//                                                                 <div className="retweet-div-border">
//                                                                     <span className="retweet-user"><b>{props.elementInfo.username}</b></span>
//                                                                     <br />
//                                                                     <span>{props.elementInfo.post}</span>
//                                                                     <br />
//                                                                     <span>{props.elementInfo.link} {props.elementInfo.imagelink}</span>
//                                                                 </div>
//                                                                 <Row >
//                                                                     <div className="col-lg-6">
//                                                                         {/* <div className="d-flex px-3">
//                                             <label htmlFor="example-text-input" className="col-md-3 col-form-label px-0">Sources:</label>
//                                             <div className="col-md-8">
//                                                 <input className="form-control source-text pb-0 source-width1" type="text" id="example-text-input" value={sourcelink} readOnly/>
//                                             </div>
//                                         </div> */}
//                                                                         <div className="imagePreviewDivBtnTag">
//                                                                             {preview &&
//                                                                                 <div className="button-items px-2">
//                                                                                     <button
//                                                                                         type="button"
//                                                                                         onClick={() => { setPreview(); }}
//                                                                                         className="text-start btn-draftimgupload"
//                                                                                     >
//                                                                                         <i className="bx bx-x font-size-20"></i>
//                                                                                     </button>
//                                                                                 </div>
//                                                                             }
//                                                                             {preview && <img className="imagePreviewDivBtnTag" height="300px" width="300px" src={preview} />}
//                                                                         </div>
//                                                                     </div>
//                                                                     <div className="col-lg-6">
//                                                                         <div className="d-flex justify-content-end">
//                                                                             <div className="px-2 link-icon">
//                                                                                 <i className={sourcelink ? "text-primary bx bx-link font-size-20" : "bx bx-link font-size-20"} />
//                                                                             </div>
//                                                                             <div className="button-items px-2">
//                                                                                 <button type='button' onClick={showOpenFileDialog} className="text-start btn-draftimgupload"><i className="bx bx-images font-size-20"></i></button>
//                                                                                 <input type="file" name="file" ref={inputFile} style={{ display: "none" }} accept="image/*" onChange={(e) => handleClickTwo(e)} />
//                                                                                 {/*<button type='button' className='btn btn-primary py-2 px-5 mb-3' onClick={(e) => showOpenFileDialog(e)}> Upload Picture </button>*/}
//                                                                             </div>
//                                                                             {/*<div className="py-2">Sentiment : </div>*/}
//                                                                             <label className=" col-form-label px-0 sentiment-text d-none d-sm-block">Sentiment: </label>
//                                                                             <div className="px-1">
//                                                                                 <img src={bearImage} height="32" width="32" className="mx-3"></img> <br />
//                                                                                 <label className=" col-form-label p-0 px-0 postbox-text d-flex justify-content-center">strong sell</label>
//                                                                             </div>
//                                                                             <div className="px-1 ">  <RangeSlider step={0.5} value={rangevalue} onChange={e => setRangeValue(e.target.value)} min={-10} max={10} />
//                                                                                 <label className="col-form-label p-0 px-3 postbox-text d-flex justify-content-center">neutral</label>
//                                                                             </div>
//                                                                             <div className="px-1">  <img src={bullImage} height="32" width="32" className="text-end mx-3"></img><br />
//                                                                                 <label className=" col-form-label p-0 px-0 postbox-text d-flex justify-content-center">strong buy</label>
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>
//                                                                 </Row>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                     <div className="col-md-2  pt-3 pt-md-0">
//                                                         {/* <div className="tag-btn">
//                                 <Button className="btn-sm mt-1" color="primary" outline={!hashTag.isNews} onClick={(e)=> handleNews(e) }>#news</Button>
//                               </div>
//                               <div className="tag-btn">
//                                 <Button className="btn-sm mt-1" color="primary" outline={!hashTag.isFundamental} onClick={(e)=> handleFundamental(e)}>#fundamental</Button>
//                               </div>
//                               <div className="tag-btn">
//                                 <Button className="btn-sm mt-1" color="primary" outline={!hashTag.isTechnical} onClick={(e)=> handleTechnical(e)}>#technical</Button>
//                               </div> */}

//                                                         <div className="btn-group-vertical">
//                                                             <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio5" autoComplete="off" />
//                                                             <label className="btn-sm btn btn-outline-primary" htmlFor="vbtn-radio5"
//                                                             //  checked={!hashTag.isFundamental} 
//                                                              onClick={(e) => handleFundamental(e)}>#fundamental</label>
//                                                             <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio6" autoComplete="off" />
//                                                             <label className="btn-sm btn btn-outline-primary" htmlFor="vbtn-radio6"
//                                                             //  checked={!hashTag.isTechnical}
//                                                               onClick={(e) => handleTechnical(e)}>#technical</label>
//                                                         </div>

//                                                         <div className="pt-2 pb-1" >
//                                                             <span className="text-muted font-size-16">
//                                                                 {" "}
//                                                                 {posttextcount}
//                                                             </span>
//                                                         </div>
//                                                         <div className={postbuttonclass}>
//                                                             <Button type="submit" id="Popoverpostcomment" className="btn  w-md ">Post</Button>
//                                                             <Popover placement="top" isOpen={popovertop} target="Popoverpostcomment" toggle={() => { postbuttonclass == "btn-post-grey" ? setpopovertop(!popovertop) : setpopovertop(false) }} >
//                                                                 <PopoverHeader>Post</PopoverHeader>
//                                                                 <PopoverBody>
//                                                                     <span> <b> 1 :</b> Use a $stock cashtag (you can have more than one)</span> <br />
//                                                                     <span>  <b>2 :</b>  Include a source for your post, either a link to your source, or relevant image or screenshot, such as a price chart.</span> <br />
//                                                                     <span> <b>3 :</b>  Categorise as either #fundamental or #technical</span>
//                                                                 </PopoverBody>
//                                                             </Popover>{" "}
//                                                         </div>
//                                                     </div>
//                                                 </Row>
//                                             </Form>
//                                         </div>
//                                         {/*<button type="button" className="btn btn-primary"> Save changes </button>*/}
//                                     </Modal>
//                                 </div>
//                             </CardBody>
//                         </Card>
//                     </div>
//                 </div> : null
//             }
//         </React.Fragment>
//     )
// }

// Retweet.propTypes = {
//     t: PropTypes.any
// }

// export default (Retweet)