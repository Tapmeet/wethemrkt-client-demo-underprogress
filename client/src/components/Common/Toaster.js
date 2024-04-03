import toastr from "toastr"
import "toastr/build/toastr.min.css"

toastr.options = {
    positionClass: "toast-top-right",
    timeOut: 5000,
    extendedTimeOut: 1000,
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut",
    showDuration: 300,
    hideDuration: 1000
  }

function errorToaster(message,title = "Error") {
return(
    toastr.error(message, title)
)
}

function successToaster(message,title = "Success") {
    return(
        toastr.success(message, title)
    )
}

function infoToaster(message,title = "Information") {
    return(
        toastr.info(message, title)
    )
}

function warnToaster(message,title = "Warning") {
    return(
        toastr.warning(message, title)
    )
}

function commonErrorToaster(){
    return(
        toast.error("Something went to wrong!!","Contact Admin")
    ) 
}

export default {errorToaster,successToaster,infoToaster,warnToaster,commonErrorToaster}