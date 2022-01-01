console.log("This is background script");

var boo = true;

// get request from content script and send response back
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){

        if(request.type === "fromContent")
        {
            sendResponse(boo);
            console.log("back back");
        }
    }
)
