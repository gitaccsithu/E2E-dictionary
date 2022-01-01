var bgPage = chrome.extension.getBackgroundPage(); // get background page
var toggle = bgPage.boo; // get boo variable from background

var button = document.getElementsByClassName("csinnerButton");
console.log(button);

toggling();

button[0].addEventListener("click", function (){

    if(toggle == false)
    {
        toggle = true;
    }
    else
    {
        toggle = false;
    }

    console.log(toggle);
    toggling();
    bgPage.boo = toggle;
    
})

function toggling() {
    if(toggle == true)
    {
        button[0].style.backgroundImage = "linear-gradient(to bottom right, #6ebff5 , #1388d6)";
    }
    else
    {
        button[0].style.backgroundImage = "linear-gradient(to bottom right, #1D1E20 , #5f5f5f)";
    }
}