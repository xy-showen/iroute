var iroute = require('../index')


iroute.add([
["get:/test1/",function(req,res){res.end('test1')}],
["get:/test2/test2/test2/test2/",function(req,res){res.end('test2')}],
["get:/test3/test3/test3/test3?key1&key2&key3",function(req,res){res.end('test3')}],
["post:/test4",function(req,res){res.end('test4')}],
["post:/test5/test5/test5/test5",function(req,res){res.end('test5')}],
["post:/test6/test6/test6/test6?key1&key2&key3",function(req,res){res.end('test6')}],
["put:/test7",function(req,res){res.end('test7')}],
["put:/test8/test8/test8/test8",function(req,res){res.end('test8')}],
["put:/test9/test9/test9/test9?key1",function(req,res){res.end('test9')}],
["delete:/test10",function(req,res){res.end('test10')}],
["delete:/test11/test11/test11/test11",function(req,res){res.end('test11')}],
["delete:/test12/test12/test12/test12?key1&key2&key3&key4&key5&key6&key7&key8&key9&key10",function(req,res){res.end('test12')}]

],function(req,res){
	res.statusCode = 404;
	res.end('404')
})



var assert = require('assert');





var test_num = 16
var test_back = function(msg){
	console.log(msg, 'test ok')
	if(!--test_num){
		process.exit(0)
	}

}



function request(path, method, cb){

	var req = {
		method:method,
		url:path
	}
	var res={end:function(s){
		if(!this.statusCode) this.statusCode= 200;
		 
		this.body = s;
	}}
	iroute.route(req,res);
	cb(null,res,res.body);

}




//begin test
//get


	
request('/TEST1/', 'GET', function (error, response, body) {
	assert.equal(response.statusCode,200)
	assert.equal(body,'test1')
	test_back('get1')
})

request('/TEST1', 'GET', function (error, response, body) {
	assert.equal(response.statusCode,200)
	assert.equal(body,'test1')
	test_back('get2')
})


request('/test2/test2/test2/test2/','GET', function (error, response, body) {
	assert.equal(response.statusCode,200)
	assert.equal(body,'test2')
	test_back('get3')
})



	request('/test3/test3/test3/test3/?key1&key2&&&key3=123', 'GET', function (error, response, body) {
		assert.equal(response.statusCode,404)
		assert.equal(body,'404')
		test_back('get5')
	})


	request('/test3/test3/test3/test3?key1=&key2=&key3=', 'GET', function (error, response, body) {
		assert.equal(response.statusCode,200)
		assert.equal(body,'test3')
		test_back('get6')
	})

	request('/test3/test3/test3/test3/?key1=1111&key2=22222&key3=333','GET',  function (error, response, body) {
		assert.equal(response.statusCode,200)
		assert.equal(body,'test3')
		test_back('get7')
	})






//post
request('/test4','POST',  function (error, response, body) {
	assert.equal(response.statusCode,200)
	assert.equal(body,'test4')
	test_back('post1')
})

request('/test5/test5/test5/test5/','POST',  function (error, response, body) {
	assert.equal(response.statusCode,200)
	assert.equal(body,'test5')
	test_back('post2')
})

request('/test6/test6/test6/test6?key1=1&key2=2&key3=3','POST',  function (error, response, body) {
	assert.equal(response.statusCode,200)
	assert.equal(body,'test6')
	test_back('post3')
})



//put

request('/test7','PUT',  function (error, response, body) {
	assert.equal(response.statusCode,200)
	assert.equal(body,'test7')
	test_back('put1')
})

request('/test8/test8/test8/test8/','PUT',  function (error, response, body) {
	assert.equal(response.statusCode,200)
	assert.equal(body,'test8')
	test_back('put2')
})

request('/test9/test9/test9/test9/?key1=111','PUT',  function (error, response, body) {
	assert.equal(response.statusCode,200)
	assert.equal(body,'test9')
	test_back('put3')
})




//delete

request('/test10','DELETE',  function (error, response, body) {
	assert.equal(response.statusCode,200)
	assert.equal(body,'test10')
	test_back('del1')
})

request('/test11/test11/test11/test11','DELETE',  function (error, response, body) {
	assert.equal(response.statusCode,200)
	assert.equal(body,'test11')
	test_back('del2')
})

request('/test12/test12/test12/test12?key1=&key2=&key3=&key4=&key5=&key6=&key7=&key8=&key9=&key10=0','DELETE',  function (error, response, body) {
	assert.equal(response.statusCode,200)
	assert.equal(body,'test12')
	test_back('del3')
})

 
