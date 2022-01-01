//font for extension
var extFont = document.createElement("style");
extFont.innerHTML = 
"@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500&display=swap');";

document.getElementsByTagName("head")[0].appendChild(extFont);

//if extension closed or no
var toggle = false;

//send background to know if extension closed or not
window.addEventListener("mousedown", sendmessBg);

function sendmessBg()
{
    // listen message from the background script
    chrome.runtime.sendMessage({type: "fromContent"}, function(value) {
    toggle = value;
    console.log("send mess " + value + " and " + toggle);
    }); 
}

//create div
var wrapDiv = document.createElement("div");
wrapDiv.id = "mWrapper";

//create draggable element (div)
var dragDiv = document.createElement("div");
dragDiv.id = "dragDiv";

//create defination aera (div)
var defDiv = document.createElement("div");
defDiv.id = "defDiv";

//add draggable div into mWrapper
wrapDiv.appendChild(dragDiv);
//add defination div into mWrapper
wrapDiv.appendChild(defDiv);

var disX = 0;// pixels between mouse pointer and div leftoffset
var disY = 0;// pixels between mouse pointer and div topoffset
var isSelected = false;// check if ther's selected text 
var pDefdiv = false;// if there's still mwrapper in div
var resized = false;// if window is resized
var ldivdown = false;// left click down on wrap div before
var ldivup = false;// left click up on a wrap div
var ldocdown = false;// left click down on document
var ldocup = false;// left click up on document
var sText = null; // selected trimed text
var resized = false; // is window resized

//add mouse down, mouse up events into mwrap div and document not to trun off suddenly
defDiv.addEventListener("mousedown", function(){
    ldivdown = true;
});

document.addEventListener("mousedown", function(){
    if(ldivdown == false)
    {
        ldocdown = true;
    }
    if(ldivdown == true)
    {
        ldocdown = false;
    }
    console.log("+++ mouse down on the doc");
    console.log("ldocdown " + ldocdown);
});

defDiv.addEventListener("mouseup", function(){
    ldivdown = false;
    ldocdown = false;
});

document.addEventListener("mouseup",function() {
    ldivdown = false;
    ldocdown = false;
});

window.addEventListener("mousedown", text); // is mouse downed in window 
window.addEventListener("mouseup", text); // is mouse up in window 
window.onresize = resize; // is window resized

//text function
function text(e) 
{
    var select = document.getSelection();// get selection
    var sText = select.toString().trim();// trim spaces from selected text
    
    if(sText && pDefdiv == false && resized == false && toggle == true)
    {
        //add mwrapper div into body of a web page
        document.getElementsByTagName("html")[0].appendChild(wrapDiv);

        ldivdown = false;
        ldocdown = false;
        divClose = false;
        pDefdiv = true; // there's a mwrapper div in body
        
        //put mWrapper div near mouse coursor
        wrapDiv.style.left = e.pageX + "px";
        
        //for corner cases
        if((wrapDiv.offsetWidth + wrapDiv.offsetLeft) > window.innerWidth)
        {
            wrapDiv.style.left = (window.innerWidth - (wrapDiv.offsetWidth + (window.innerWidth - e.clientX))) + "px";
            if(wrapDiv.getBoundingClientRect().left < 0)
            {
                wrapDiv.style.left = "0px";
            }
        }
        
        if(((e.pageY + 300)) > document.documentElement.scrollHeight)
        {
            wrapDiv.style.top = (((window.innerHeight - (window.innerHeight - e.clientY)) - 300) + (window.scrollY)) + "px";
        }
        else
        {
            wrapDiv.style.top = e.pageY + "px";
        }
    
        if(((sText.indexOf(' ') > 0) && (sText.indexOf(' ') < sText.length - 1)))
        {
            defDiv.innerHTML = "Only one word allowed!";
            return;
        }

        getDef(sText);

        //console.log(wrapDiv.getBoundingClientRect().bottom);
        
        isSelected = true;//there is a selected text
        pDefdiv = true;// there is mwrapper div in dom

        //add mouse down, mouse up events into dragDiv
        document.getElementById("dragDiv").onmousedown = down;
        document.onmouseup = nodrag;
    }
    else if((((e.clientY + window.scrollY) > (wrapDiv.getBoundingClientRect().bottom + window.scrollY)) || 
            ((e.clientX + window.scrollX) > (wrapDiv.getBoundingClientRect().right + window.scrollX)) ||
            ((e.clientY + window.scrollY) < (wrapDiv.getBoundingClientRect().top + window.scrollY)) || 
            ((e.clientX + window.scrollX) < (wrapDiv.getBoundingClientRect().left + window.scrollX))) &&
            pDefdiv == true && e.clientX < window.innerWidth && e.clientX > 0 &&
            e.clientY < window.innerHeight && e.clientY > 0 && e.button != 2 &&
            ldocdown == true)
    {
        console.log("ldivdown" + ldivdown);
        console.log("ldivup" + ldivup);
        console.log("ldocup" + ldocup);
        window.getSelection().empty();
        isSelected = false;//there is no selected text
        pDefdiv = false;// there is no mwrapper div in dom
        defDiv.innerHTML = "Please wait";
        ldivdown = false;
        ldocdown = false;
        divClose = false;
        document.getElementsByTagName("html")[0].removeChild(wrapDiv);
    }
    else if(resized == true)
    {
        resized = false;
    }
}

//callback of mouse down in dragDiv
function down(e) 
{
    //calculate pixels between mouse pointer and div leftoffset
    disX = e.pageX - document.getElementById("mWrapper").offsetLeft;
    //calculate pixels between mouse pointer and div topoffset
    disY = e.pageY - document.getElementById("mWrapper").offsetTop;
    // while click call dragELe function
    document.onmousemove = dragEle;
}

function dragEle(e) 
{
            //place lefmost pixel of mwrap
            wrapDiv.style.left = (e.pageX - disX) + "px";

            //for corner cases in X
            //for right cases
            if(wrapDiv.offsetLeft <= 0)
            {
                wrapDiv.style.left = "0px";
                disX = e.pageX;
                if(e.pageX < 0)
                {
                    disX = "0px";
                }
            }
            //for left cases
            if((wrapDiv.offsetLeft + wrapDiv.offsetWidth) >= window.innerWidth)
            {
                wrapDiv.style.left = (window.innerWidth - wrapDiv.offsetWidth) + "px";
                disX = e.pageX - document.getElementById("mWrapper").offsetLeft;
                if(e.pageX > window.innerWidth)
                {
                    disX = wrapDiv.offsetWidth + "px";
                }
            }
            
            //for corner casess in Y
            //for top cases
            wrapDiv.style.top = (e.pageY - disY) +"px";
            if(wrapDiv.offsetTop <= 0)
            {
                wrapDiv.style.top = "0px";
            }
            if((wrapDiv.offsetTop + wrapDiv.offsetHeight) >= document.body.scrollHeight)
            {
                wrapDiv.style.top = (document.body.scrollHeight - wrapDiv.offsetHeight) + "px";
            }

    //remove selection while dragging div
    window.getSelection().empty();
}

//callback of mouse up in dragDiv
function nodrag(e) 
{
    //while mouse up, no function called
    document.onmousemove = null;
}

function resize() {
    if(pDefdiv == true)
    {
        document.getElementsByTagName("html")[0].removeChild(wrapDiv);
        sText = null;
        defDiv.innerHTML = "Please wait";
        pDefdiv = false;
        resized = true;
    }
}

//get defination of slected text from api
function getDef(txt)
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function()
    {
        if(xhttp.readyState == 4 && xhttp.status == 200)
        {
            var txt_obj = JSON.parse(xhttp.responseText);
            var answer = "";
            for(var k = 0; k < txt_obj.length; k++)
            {
                answer += "<div class='word'><h1 class='csmain'>" + txt_obj[k].word +"</h1>";
                for(var i = 0; i < txt_obj[k].meanings.length; i++)
                {
                    partofspeech = txt_obj[k].meanings[i].partOfSpeech;
                    partofspeech = partofspeech.slice(0, 1).toUpperCase() +
                    partofspeech.slice(1);
                    answer += "<h4 class='cspartOfSpeech'>[" + 
                        partofspeech + "]</h4><div class='csmeaning'>";
                        for(var d = 0; d < txt_obj[k].meanings[i].definitions.length; d++)
                        {
                            answer += "<p class='csdefination'>"+ txt_obj[k].meanings[i].definitions[d].definition + "</p>" + 
                            "<p class='csExample'><span class='example'>E.g., </span>" + 
                                txt_obj[k].meanings[i].definitions[d].example + "</p>";
                        }
                        answer += "</div><hr class='separate'>";
                }
            }
            answer += "</div>";
            if(document.getElementById("defDiv") != null)
            {
                document.getElementById("defDiv").innerHTML = answer;
            }
        }
        else if(xhttp.readyState == 4 && xhttp.status == 404)
        {
            defDiv.innerHTML = "no answer";
        }
    };
    xhttp.open("GET","https://api.dictionaryapi.dev/api/v2/entries/en/" + txt, true);
    xhttp.send();
}
