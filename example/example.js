var iroute = require('../index')


iroute.add([
["get:/ex1/",function(req,res){res.end('ex1')}],
["get:/ex2/ex2/?key",function(req,res){res.end('ex2')}],
["post:/ex3/ex3/ex3/?key1&key2&key3",function(req,res){res.end('ex3')}],
["put:/ex4",function(req,res){res.end('ex4')}],
["delete:/ex5/?key1&key2&key3",function(req,res){res.end('ex5')}]
],function(req,res){
	res.statusCode = 404;
	res.end('404')
})


var http = require('http');

http.createServer(function (req, res) {

	var buf_list = [];
	var len=0;
	req.on("data",function(chunk){
		buf_list.push(chunk);
		len += chunk.length;
	})
	req.on("end", function(){
		req.body = Buffer.concat(buf_list, len).toString();
		if(req.url != '/favicon.ico') {
		 //route the request
		 iroute.route(req,res);
		} 
	})

}).listen(8124);

console.log('Server running at http://127.0.0.1:8124/');



