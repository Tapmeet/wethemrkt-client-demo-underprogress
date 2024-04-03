import React,{useState,useRef,useCallback,useEffect } from "react"
// import PropTypes from 'prop-types'
// import { Button ,Row, Col ,Popover,PopoverHeader,PopoverBody } from "reactstrap"

// import { Field, Form } from '@availity/form';
// import '@availity/yup';
// import * as yup from 'yup';

// // import { AvForm } from "availity-reactstrap-validation"
// import { useHistory } from "react-router-dom";

// import 'bootstrap/dist/css/bootstrap.css'; // or include from a CDN
// import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
// import RangeSlider from 'react-bootstrap-range-slider';

// import bearImage from "../../../assets/images/bear.png"; 
// import bullImage from "../../../assets/images/bull.png";


// // import usercomment from '../../../services/comment.service';
// // import symbol from '../../../services/symbol.servie';
// // import user from '../../../services/user.service';
// // import country from '../../../services/country.service';

// import Editor from '@draft-js-plugins/editor';
// import {EditorState, AtomicBlockUtils } from 'draft-js';
// import { convertToHTML } from 'draft-convert';
// import createHashtagPlugin from '@draft-js-plugins/hashtag';
// import createLinkifyPlugin from '@draft-js-plugins/linkify';
// import createImagePlugin from '@draft-js-plugins/image';
// import createMentionPlugin, {
//     defaultSuggestionsFilter,
//   } from '@draft-js-plugins/mention';

// import 'draft-js/dist/Draft.css';
// import '@draft-js-plugins/linkify/lib/plugin.css';
// import '@draft-js-plugins/hashtag/lib/plugin.css';
// import '@draft-js-plugins/image/lib/plugin.css';
// import '@draft-js-plugins/mention/lib/plugin.css';

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

// const plugins = [linkifyPlugin, hashtagPlugin, imagePlugin,mentionPlugin,mentionPlugin2];


// import "../../../assets/scss/custom/wethemkrt/post-postcomment.scss";
// import "../../../assets/scss/custom/wethemkrt/postcomment.scss";
// import toaster from '../../../components/Common/Toaster';

//i18n
// import { withTranslation } from "react-i18next"

const PostComment = (props) => {
//     let history = useHistory();
//     const [posttextcount, setposttextcount] = useState(300);
//     const [editorState, setEditorState] = useState(EditorState.createEmpty());
//     const [rangevalue, setRangeValue ] = useState(0);
//     const [image, setimage ] = useState('');
//     const inputFile = useRef(null);
//     const [fileExtension, setFileExtension] = useState('png');
//     // const [symbolsugesstion, setsymbolsugesstion] = useState("");
//     const [sourcelink, setsourcelink] = useState("");
//     const [popovertop, setpopovertop] = useState(false);
//     const [postbuttonclass, setpostbuttonclass] = useState("post-btn-grey");
//     const [hashTag, setHashTag] = useState({isNews:false,isFundamental:false,isTechnical:false});
//     const ref = useRef(null);
//     const [openCountry, setOpenCountry] = useState(false);
//     var countryData = [];
//     const [countrysuggestions, setcountrySuggestions] = useState(countryData);
//     const [openSymbol, setOpenSymbol] = useState(false);
//     var symbolData = [];
//     const [symbolsuggestions, setsymbolSuggestions] = useState(symbolData);
//     const [htmlContent, sethtmlContent] = useState("");
//     const [userInfo, setuserInfo] = useState({id:"",name:"",raw: "",isadmin:""});
//     var urlRegex = /(https?:\/\/[^ ]*)/;

//     useEffect(() => {
//         async function getUsers(){
//         // if (localStorage.getItem("user")) {
//         //   const obj = JSON.parse(localStorage.getItem("user"))
//         //   var newVal = {
//         //     userid : obj.id
//         //   }
//         //   const userResponse = await user.getProfileUser(newVal);
//         //   if (userResponse !== undefined && userResponse.status === 200 && userResponse.data.userResponse !== null && userResponse.data.userResponse !== undefined) 
//         //   {
//         //     setuserInfo({...userInfo,
//         //       id:userResponse.data.userResponse.id,
//         //       name:userResponse.data.userResponse.username,
//         //       raw:userResponse.data.userResponse.imageuri,
//         //       isadmin:userResponse.data.userResponse.isadmin
//         //   })
//         //   }
//         // }
//         }
//         getUsers();
//       }, [])

//     const focusEditor = () => {
//         ref.current.focus()
//     }

//     // const MentionSuggestions = mentionPlugin.MentionSuggestions;
//     // const MentionSuggestions2 = mentionPlugin2.MentionSuggestions;

//     // const onOpenChange = useCallback((_open) => {
//     //     setOpenCountry(_open);
//     // }, []);

//     // const onOpenChange2 = useCallback((_open) => {
//     //     setOpenSymbol(_open);
//     // }, []);

//     async function getCountrybyName(countrysearch){
//         // const response = await country.getCountryByName(countrysearch);
//         // if (response.status == 200) {
//         //     countryData =[];
//         //     // userData = response.data.userResponse;
//         //     if (response.data.countryResponse.length > 0) {
//         //         for (let index = 0; index < response.data.countryResponse.length; index++) {
//         //             const element = response.data.countryResponse[index];
//         //             countryData.push({"name":element.countrycode});
//         //         }
//         //     }
//         //     setcountrySuggestions(countryData);
//         // }
//     }

//     async function getSymbolbyName(symbolsearch) {
//         // const response = await symbol.getSymbolData(symbolsearch);
//         // if (response.status == 200) {
//         //     symbolData =[];
//         //     if (response.data.symbolResponse.length > 0) {
//         //         for (let index = 0; index < response.data.symbolResponse.length; index++) {
//         //             const element = response.data.symbolResponse[index];
//         //             symbolData.push({"name":element.symbol});
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
//         // else{
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
//         // else{
//         //     setsymbolSuggestions([]);
//         // }
//     }, []);

//     function getBase64 (file)  {
//         return new Promise(resolve => {
//             let baseURL = "";
//             let reader = new FileReader();

//             // Convert the file to base64 text
//             reader.readAsDataURL(file);
//             // on reader load somthing...
//             reader.onload = () => {
//             // Make a fileInfo Object
//             baseURL = reader.result;
//             setimage(reader.result);
//             resolve(baseURL);
//             };
//         });
//     };
    
//     const handleClickTwo = (e) =>{
//         var file = e.target.files[0];
//         const fileSize = file.size / 1024 / 1024; // in MiB
//         if (fileSize > 20) {
//             toaster.warnToaster('File size should be less than 20 MB', 'UserPost');
//         } 
//         else{
//             setFileExtension(file.name.split('.').pop());
//             getBase64(file).then(result => {
//             const newEditorState = insertImage(editorState, result);
//             setEditorState(newEditorState);
//             if (newEditorState) {
//                 setpostbuttonclass("post-btn");
//             }
//             else{
//                 setpostbuttonclass("post-btn-grey");
//             }
//             }).catch(err => {
//             // console.log(err);
//             });
//         }
        
//         if (e.target.files[0]) {
//             inputFile.current.value = "";
//         }
//     };

//     function insertImage (editorState, base64)  {
//     const contentState = editorState.getCurrentContent();
//     const contentStateWithEntity = contentState.createEntity("image","IMMUTABLE",{ src: base64 });
//     const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
//     const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
//     return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ");
//     };

//     const showOpenFileDialog = () => {
//         inputFile.current.click();
//     };

//     function checkHashTag()
//     {
//         return  hashTag.isFundamental || hashTag.isTechnical ? true : false;
//     //     if (hashTag.isNews && hashTag.isFundamental && hashTag.isTechnical) {
//     //         return false;
//     //     }
//     //     if ((hashTag.isNews && hashTag.isFundamental) || (hashTag.isNews && hashTag.isTechnical)) {
//     //         return true;
//     //     }
//     //     else{
//     //         return false;
//     //     }
//     // }
//     }
//     function checkPostbuttonValidation(editorData){
//         var isurl = isValidURL(editorData);
//         // var validHashTag = checkHashTag();

//         if (isurl) {
//             // var urlRegex = /(https?:\/\/[^ ]*)/;
//             if (editorData.match(urlRegex) != null) {
//                 setsourcelink(editorData.match(urlRegex)[1]);
//             }
//         }
//         else{
//             setsourcelink('');
//         }
        
//         if (editorData && (isurl || (editorData != "" && editorData == " "))) { // && validHashTag
//             setpostbuttonclass("post-btn");
//             setpopovertop(false);
//         }
//         else{
//             setpostbuttonclass("post-btn-grey");
//         }
//     }

//     function textareachange(event) {
//         const posttextcount = event.getCurrentContent().getPlainText('\u0001').length;//event.blocks[0].text.length
//         var editorData = event.getCurrentContent().getPlainText('\u0001');

//         var htmlData = convertToHTML(event.getCurrentContent());
//         if (htmlData != null && htmlData.includes('figure')) {
//             htmlData = htmlData.replace('<figure>','')
//             htmlData = htmlData.replace('</figure>','')
//         }
//         if (htmlData.match(urlRegex)) {
//             htmlData =  htmlData.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
//         }
//         if (htmlData != null && htmlData.includes('$')) {
//             var replaceData = htmlData.substr(htmlData.indexOf("$") + 1).split(' ')[0]
//             sethtmlContent(htmlData.replace(`$${replaceData}`,`<a style="color:#556ee6" href='/feed/${replaceData}'>$${replaceData}</a>`));
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

//     // if (localStorage.getItem("user") && props.userPostInfo !== null && props.userPostInfo !== undefined) {
//     //     const obj = JSON.parse(localStorage.getItem("user"));
//     //     var text = editorState.getCurrentContent().getBlocksAsArray();
//     //     var finalText;
//     //     text.map((item) => {
//     //     finalText = finalText + item.getText()});
//     //     if (finalText.toLowerCase().includes("undefined")) {
//     //         finalText = finalText.replace("undefined","").trim();
//     //     }
//     //     var isurl = isValidURL(finalText);
//     //     // var validHashTag = checkHashTag();
//     //     var link = '';

//     //     if (isurl) {
//     //         // var urlRegex = /(https?:\/\/[^ ]*)/;
//     //         link = finalText.match(urlRegex)[1];
//     //         finalText = httpHtml(finalText);
//     //     }
//     //     // if (!finalText && !image) {
//     //     //     setpopovertop(!popovertop);
//     //     // }
//     //     // else{
//     //         if ((isurl || image) && (hashTag.isFundamental || hashTag.isTechnical) &&  (finalText !== null && finalText !== "" && finalText.length <= 300)) {
//     //         var newValues = {
//     //             userid : obj.id,
//     //             postid : props.userPostInfo.postid == undefined ? props.userPostInfo.id : props.userPostInfo.postid,
//     //             usercomment : finalText,//editorState.getCurrentContent().getPlainText(), //values.userpost
//     //             htmlpost : htmlContent,
//     //             imageuri : image,
//     //             fileextension : fileExtension,
//     //             isnews : true,
//     //             isfundamental : hashTag.isFundamental,
//     //             istechnical : hashTag.isTechnical,
//     //             bullish : rangevalue > 0  ? rangevalue : 0,
//     //             bearish : rangevalue < 0  ? rangevalue : 0,
//     //             link : link
//     //         }

//     //         // const response = usercomment.createUserComment(newValues);
//     //         // if (props.onChange) {
//     //         //     props.onChange();    
//     //         // }
//     //         window.location.reload();
//     //     }
//     //     else
//     //     {
//     //         setpopovertop(!popovertop);
//     //     }
//     //     //}
//     //     }
//     }

//     function EditorChange(editorState){
//         setEditorState(editorState);
//         textareachange(editorState);
//     };

//     // function handleNews(event){
//     //     event.preventDefault();
//     //     setHashTag({...hashTag,isNews:!hashTag.isNews});
//     //     var editorData = editorState.getCurrentContent().getPlainText('\u0001');
//     //     checkPostbuttonValidation(editorData);
//     // }

//     function handleFundamental(event){
//         setHashTag({...hashTag,isFundamental:!hashTag.isFundamental});
      
//     }

//     function handleTechnical(event){
//         setHashTag({...hashTag,isTechnical:!hashTag.isTechnical});

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
//         else 
//         {
//             setFileExtension(file.name.split('.').pop());
//             getBase64(file).then(result => {
//                 const newEditorState = insertImage(editorState, result);
//                 setEditorState(newEditorState);
//                 // var validHashTag = checkHashTag();
//                 if (newEditorState) {
//                     setpostbuttonclass("post-btn");
//                 }
//                 else{
//                     setpostbuttonclass("post-btn-grey");
//                 }
//                 }).catch(err => {
//                 console.log(err);
//             });
//         }

//         if (e[0]) {
//             inputFile.current.value = "";
//         }
//     }

   return (
    <></>
//         <React.Fragment>
//             <Form className="form-horizontal" onSubmit={(value) => { handleValidSubmit(value) }}>
//             <div className="border-bottom mt-3 mb-3"></div>
//                 <Row>
//                 <Col sm="12">
//                     <Row>
//                     <div className=" col-md-1 col-2  text-sm-end ">
//                         <img className="rounded-circle header-profile-user" src={userInfo.profilePhoto} alt="Header Avatar" />
//                     </div>
//                     <div className="col-md-9 col-10">
//                         <div style={{ color:"GrayText", border: "1px #ccc solid"}} onClick={() => focusEditor()}>
//                         <Editor editorState={editorState} placeholder="Start a new post..."
//                          onChange={(event) => EditorChange(event)} plugins={plugins} ref={ref}
//                          handlePastedFiles={handlePastedImage}/>
//                         <MentionSuggestions open={openCountry}
//                             onOpenChange={onOpenChange}
//                             suggestions={countrysuggestions}
//                             onSearchChange={onSearchChange}
//                             onAddMention={() => {
//                             // get the mention object selected
//                             }}
//                             />
//                         <MentionSuggestions2 open={openSymbol}
//                             onOpenChange={onOpenChange2}
//                             suggestions={ symbolsuggestions }
//                             onSearchChange={ onSearchChange2 }
//                             onAddMention={() => {
//                                 // get the mention object selected
//                             }}
//                         /> 
//                         <div>
//                         <Row >
//                             <div className="col-lg-6">
//                             <div className="d-flex px-3">
//                                 <label htmlFor="example-text-input" className="col-md-3 col-form-label px-0">Source:</label>
//                                 <div className="col-md-8">
//                                     <input className="form-control source-text pb-0 source-width1" type="text" id="example-text-input" value={sourcelink} readOnly/>
//                                 </div>
//                             </div>
//                             </div>
//                             <div className="col-lg-6">
//                             <div className="d-flex justify-content-end">
//                             <div className="button-items px-2">
//                             <button type='button' onClick={showOpenFileDialog} className="text-start btn-draftimgupload"><i className="bx bx-images font-size-20"></i></button>
//                             <input type="file" name="file" ref={inputFile} style={{display:"none"}} accept="image/*" onChange={(e) => handleClickTwo(e)}/>
//                             {/*<button type='button' className='btn btn-primary py-2 px-5 mb-3' onClick={(e) => showOpenFileDialog(e)}> Upload Picture </button>*/}
//                             </div>
//                             {/*<div className="py-2">Sentiment : </div>*/}
//                                 <label className=" col-form-label px-0 sentiment-text d-none d-sm-block">Sentiment: </label>
//                                 <div className="px-1"> 
//                                 <img src={bearImage} height="32" width="32" className="mx-3"></img> <br/>
//                                 <label  className=" col-form-label p-0 px-0 postbox-text d-flex justify-content-center">strong sell</label>
//                                 </div>
//                                 <div className="px-1 ">  <RangeSlider step={0.5} value={rangevalue} onChange={e => setRangeValue(e.target.value)} min={-10} max={10}/>
//                                         <label  className="col-form-label p-0 px-3 postbox-text d-flex justify-content-center">neutral</label>
//                                 </div>
//                                 <div className="px-1">  <img src={bullImage} height="32" width="32" className="text-end mx-3"></img><br/>
//                                 <label className=" col-form-label p-0 px-0 postbox-text d-flex justify-content-center">strong buy</label>
//                                 </div>
//                             </div>
//                             </div>
//                         </Row>
//                         </div>
//                         </div>
//                     </div>
//                     <div className="col-md-2  pt-3 pt-md-0">
//                     {/* <div className="tag-btn">
//                     <Button className="btn-sm mt-1" color="primary" outline={!hashTag.isNews} onClick={(e)=> handleNews(e) }>#news</Button>
//                     </div>
//                     <div className="tag-btn">
//                     <Button className="btn-sm mt-1" color="primary" outline={!hashTag.isFundamental} onClick={(e)=> handleFundamental(e)}>#fundamental</Button>
//                     </div>
//                     <div className="tag-btn">
//                     <Button className="btn-sm mt-1" color="primary" outline={!hashTag.isTechnical} onClick={(e)=> handleTechnical(e)}>#technical</Button>
//                     </div> */}
//                     <div className="btn-group-vertical">
//                         <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio3" autoComplete="off"/>
//                         <label className="btn-sm btn btn-outline-primary" htmlFor="vbtn-radio3"
//                         //  checked={!hashTag.isFundamental} 
//                          onClick={(e)=> handleFundamental(e)}>#fundamental</label>
//                         <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio4" autoComplete="off" />
//                         <label className="btn-sm btn btn-outline-primary" htmlFor="vbtn-radio4"
//                         //  checked={!hashTag.isTechnical} 
//                          onClick={(e)=> handleTechnical(e)}>#technical</label>
//                         </div>

//                     <div className="pt-2 pb-1 ">
//                             <span className="text-muted font-size-16">
//                             {" "}
//                             {posttextcount}
//                             </span>
//                         </div>

//                     <div className={postbuttonclass}>
//                         <Button type="submit" id="Popoverpostcomment" className="btn  w-md ">Post</Button>
//                         <Popover placement="top" isOpen={popovertop} target="Popoverpostcomment" toggle={() => { postbuttonclass == "btn-post-grey"? setpopovertop(!popovertop) :  setpopovertop(false)}} >
//                             <PopoverHeader>Post</PopoverHeader>
//                             <PopoverBody>
//                             <span> <b> 1 :</b> Use a $stock cashtag (you can have more than one)</span> <br/>
//                             <span>  <b>2 :</b>  Include a source for your post, either a link to your source, or relevant image or screenshot, such as a price chart.</span> <br/>
//                             <span> <b>3 :</b>  Categorise as either #fundamental or #technical</span>
//                             </PopoverBody>
//                         </Popover>{" "}
//                     </div>
//                     </div>
//                     </Row>
//                 </Col>
//                 </Row>
//                 <div className="border-bottom mt-3"></div>
//             </Form>
        // </React.Fragment>
  )
}

//export default PostModel
export default (PostComment)

PostComment.propTypes = {
  t: PropTypes.any
}
