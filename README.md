# iroute(fast and simple nodejs http/https router module)

if you only want to build a simple http server and don't want to use express,so iroute module could simple and fast to handler the request to action.
the module are also be used in flat.js framework.

## Installing the module

With [npm](http://npmjs.org/):

iroute module is supported windows, linux.

Make sure, node-gyp has installed.

     npm install iroute

From source:

     git clone https://github.com/DoubleSpout/iroute.git
     cd iroute
     node-gyp rebuild

To include the module in your project:

     var iroute = require('iroute');

##benchmark

to run 1000 handler and match 10000 times,regexp match and iroute result is follow:

      regexp: 1107ms
      cb1 run times :10000
      iroute: 251ms
      cb2 run times :10000

wow!!it's 4 times faster than regex match router.

## example

    var iroute = require('iroute')

    iroute.add([

      ["get:/hello/world",function(req,res){res.end('hello world')}],

    ],function(req,res){

        res.statusCode = 404;

        res.end('404')

    })

    var http = require('http');

    http.createServer(function (req, res) {

      iroute.route(req,res);

    }).listen(8124);

then request the 127.0.0.1:8124 you can see 'hello world'

##API

iroute.add(routearray [,not_match_function]);

iroute.route(req,res);

routearray:

  [
    [{method}:{url}?{key1}&{key2},function(req,res){}]
    ...
  ]

  example:

      [

      ["get:/hello/world/?key1&key2",function(req,res){  }]

      ]

not_match_function:
if iroute not match the request,the not_match_function will be called.It has two parameters,req and res.

more example see /example/example.js
