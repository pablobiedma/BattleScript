$(document).ready(function () {
    var numLoads = parseInt(getCookie('pageLoads'), 10);
    
    if (isNaN(numLoads) || numLoads <= 0) { 
        setCookie('pageLoads', 1); 
    }
    else { 
        setCookie('pageLoads', numLoads + 1); 
    }
    console.log(getCookie('pageLoads'))
    document.getElementById("demo").innerHTML = "You have been here " + getCookie("pageLoads") + " time(s)";
});
    
    
    function setCookie (cookieName, cookieValue, nDays) {
        var today  = new Date(),
            expire = new Date();
    
        if (nDays === null || nDays === 0) { 
            nDays = 1;
        }
    
        expire.setTime(today.getTime() + 3600000 * 24 * nDays);
    
        document.cookie = cookieName + "=" + escape(cookieValue) + ";expires=" + expire.toGMTString();
    };
    
    function getCookie (cookieName) {
        var theCookie = document.cookie,
            ind = theCookie.indexOf(" " + cookieName + "=");
    
        if (ind === -1) { 
            ind = theCookie.indexOf(";" + cookieName + "="); 
        }
        if (ind === -1 || cookieName === "") { 
            return "";
        }
    
        var ind1 = theCookie.indexOf(";", ind + 1);
    
        if (ind1 === -1) { 
            ind1 = theCookie.length; 
        }
    
        return unescape(theCookie.substring(ind + cookieName.length + 2, ind1));
    };
