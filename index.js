const http = require("http");
const fs = require("fs");
var requests = require("requests");


const homefile = fs.readFileSync("index.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    let temperature =  tempVal.replace("{%tempval%}", orgVal.main.temp - 273)
    temperature =  temperature.replace("{%tempmin%}", orgVal.main.temp_min - 273)
    temperature =  temperature.replace("{%tempmax%}", orgVal.main.temp_max - 273)
    temperature =  temperature.replace("{%location%}", orgVal.name)
    temperature =  temperature.replace("{%country%}", orgVal.sys.country)

    return temperature;
}

const server = http.createServer((req,res) => {
    if(req.url == "/"){
        requests(
            "https://api.openweathermap.org/data/2.5/weather?q=vadodara&appid=b9c4cb773ae8592fca2298cc0799f511"
        ,)
        .on('data', (chunk) => {
            const objdata = JSON.parse(chunk);
            const arrdata = [objdata];
            //console.log(Math.floor(arrdata[0].main.temp - 273));
            const realTimeData = arrdata.map((val) => replaceVal(homefile,val)).join("");
            //res.write(realTimeData);
            res.write(realTimeData);
        })
        .on('end',(err) =>{
        if (err) return console.log('connection closed due to errors', err);
        
        console.log('end');
        });
    }
    else
    {
        res.end("File not found")
    }

});

server.listen(3000);