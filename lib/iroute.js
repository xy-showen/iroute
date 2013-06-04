
var route_cc = require('../build/Release/iroute.node');
var iroute = {}

var os = require("os");
var URLSTR_EX = "get:/user/aaa/?key1&key2&key3";
var get_ary = [];
var post_ary = [];
var put_ary = [];
var delete_ary=[];

/*
urlstr example

iroute.add(
[
["get:/user/aaa/[ggg/aaaa]?key1&key2&key3", function(req,res){
	res.end("hello")
}],
...
])

get 表示方法
/user/aaa/[ggg/aaaa] 表示请求路径，中括号表示可选url路径
key1&key2&key3 表示此action必须接受的参数

*/
iroute.add = function(array, default_callback){
	var that = this;
	array.forEach(function(v,i){

			var urlstr = v[0];
			var temp = urlstr.split(':');

			//get method
			var method = temp[0];
			if(!method){
				throw('add error; '+urlstr+': must have methd, example is "'+ URLSTR_EX +'"')
			}
			method = method.toLowerCase();

			temp = temp[1].split('?') || false;

			//get uri
			var uri = temp[0].toLowerCase();
			if(!uri){
				throw('add error; '+urlstr+': must have url, example is "'+ URLSTR_EX +'"')
			}
			uri = uri.split('[')[0];
			var last_po = uri.length-1;

			if(uri[last_po] !== '/'){

				uri += '/' 
			}
			if(uri[0] !== '/'){
				uri = '/'+uri;
			}

			//get param
			var key = temp[1] || false;
			if(key){
				key = key.split('&')
						 .filter(function(v,i){
						 	return v;
						 })
						 .join('=&') + '=';
			}

			var router_obj = {
				uri:uri,
				param:key,
				callback:v[1] || function(){}
			}

			switch (method){
				case "get":
					get_ary.push(router_obj);
					break;
				case "post":
					post_ary.push(router_obj);
					break;
				case "put":
					put_ary.push(router_obj);
					break;
				case "delete":
					delete_ary.push(router_obj);
					break;
			}

	});

	default_callback = default_callback || function(req,res){
		res.statusCode  = 404;
		res.end('404 not found');
	}

	var add_obj_cc = {
		"get" : get_ary,
		"get_len" : get_ary.length,
		"post" : post_ary,
		"post_len" : post_ary.length,
		"put" : put_ary,
		"put_len" : put_ary.length,
		"delete" : delete_ary,
		"delete_len" : delete_ary.length
	};

	route_cc.add(add_obj_cc, default_callback);

	return that;

}


iroute.route = function(req, res){
	
	req.url2 = req.url.toLowerCase();
	route_cc.match(req, res);

}



module.exports.add = iroute.add;
module.exports.route = iroute.route;