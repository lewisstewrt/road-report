const CACHE_NAME = "road-report-v1";

//Install runs once a new version of this file is installed
self.addEventListener("install", (event) =>{
    console.log("Service worker installing...");
});

//Activate runs when this version takes over old one
self.addEventListener("activate", (event) =>{
    console.log("Service worker activated");
});

//Fetch runs for every request made by app
self.addEventListener("fetch", (event) =>{

});