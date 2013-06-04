var iroute = require('./index')
var request = request('request');

var func =  function(req,res){
	res.end("hello")
}


iroute.add([
["get:/user/aaa/[ggg/aaaa]?key1&key2&key3",func],
["get:/user/aaa/[ggg/aaaa]?key1&key2&key3",func],
["get:/user/aaa/[ggg/aaaa]?key1&key2&key3",func],
["get:/ccc/aaa/[ggg/aaaa]?key1&key2&key3",func],
["get:/bbb/aaa/[ggg/aaaa]?key1&key2&key3",func],
["post:/ww/aaa/[ggg/aaaa]?key1&key2&key3",func],
["post:/ww/aaa/[ggg/aaaa]?key1&key2&key3",func],
["post:/ww/bb/[ggg/aaaa]?key1&key2&key3",func],
["post:/ww/cc/[ggg/aaaa]?key1&key2&key3",func],
["post:/ww/aaa/[ggg/aaaa]?key1&key2&key3",func],
["put:/qq/aaa/[ggg/aaaa]?key1&key2&key3",func],
["put:/qq/aaa/[ggg/aaaa]?key1&key2&key3",func],
["put:/qq/aaa/[ggg/aaaa]?key1&key2&key3",func],
["put:/qq/aaa/[ggg/aaaa]?key1&key2&key3",func],
["delete:/ddd/aaa/[ggg/aaaa]?key1&key2&key3",func]
])





var http = require('http');

http.createServer(function (request, response) {
	//request.url
	//request.method
	if(request.url != '/favicon.ico') {


		 console.log('***************')
		 console.log(request.url)
		 console.log('***************')

		 iroute.route(request,response);
	} 

/*
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Hello World\n');
  */
}).listen(8124);

console.log('Server running at http://127.0.0.1:8124/');
