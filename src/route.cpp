#include <node.h>
#include <string>
#include <iostream>
#include <ctype.h>
#include <string.h>

#include "handler_route.h"
#include "request.h"
#include "route.h"

using namespace v8;

namespace iroute{
  uv_rwlock_t numlock;
  static int isAdd = 0;
	
  static handler_route **handler_p_get;           //指向get的handler实例指针数组的指针
  static int get_len;
  static handler_route **handler_p_post;          //post
  static int post_len;
  static handler_route **handler_p_put;           //put
  static int put_len;
  static handler_route **handler_p_delete;        //delete
  static int delete_len;
  static Persistent<Object> default_callback;     //默认回调函数，表示未匹配到控制器
  

}



//add param
/*
{
	get:[{uri:"/xxx/xxx",param:"uid&uid&aaa",callback:function}, {uri:"/xxx/xxx",param:"uid&uid&aaa",callback:function}],
	get_len:10,
	post:[...],
	post_len:10,
	put:[...],
	put_len:10,
	delete:[...],
	delete_len:10
}
*/
Handle<Value> route::add(const Arguments& args){
	HandleScope scope;

	if(iroute::isAdd){
		return ThrowException(Exception::TypeError(String::New("route::add can only execute once")));
	}	

	if(!args[0]->IsObject()){
		return ThrowException(Exception::TypeError(String::New("route::add first arg must be an object")));
	}
	if(!args[1]->IsFunction()){
		return ThrowException(Exception::TypeError(String::New("route::add second arg must be a function")));
	}


	Local<Object> add_obj = args[0]->ToObject();
	Local<Object> get_array = add_obj->Get(String::New("get"))->ToObject();
	iroute::get_len = add_obj->Get(String::New("get_len"))->Uint32Value();

	Local<Object> post_array = add_obj->Get(String::New("post"))->ToObject();
	iroute::post_len = add_obj->Get(String::New("post_len"))->Uint32Value();

	Local<Object> put_array = add_obj->Get(String::New("put"))->ToObject();
	iroute::put_len = add_obj->Get(String::New("put_len"))->Uint32Value();

	Local<Object> delete_array = add_obj->Get(String::New("delete"))->ToObject();
	iroute::delete_len = add_obj->Get(String::New("delete_len"))->Uint32Value();

	iroute::handler_p_get = new handler_route*[iroute::get_len]; //创建动态指针数组
	iroute::handler_p_post = new handler_route*[iroute::post_len];
	iroute::handler_p_put = new handler_route*[iroute::put_len];
	iroute::handler_p_delete = new handler_route*[iroute::delete_len];

	loop_add(get_array, iroute::handler_p_get, iroute::get_len);
	loop_add(post_array, iroute::handler_p_post, iroute::post_len);
	loop_add(put_array, iroute::handler_p_put, iroute::put_len);
	loop_add(delete_array, iroute::handler_p_delete, iroute::delete_len);

	iroute::default_callback = Persistent<Object>::New(args[1]->ToObject());

/*

	for(int j=0;j<iroute::get_len;j++){
		std::cout<<(iroute::handler_p_get[j])->uri<<std::endl;
		std::cout<<(iroute::handler_p_get[j])->char_uri_len<<std::endl;
		std::cout<<(iroute::handler_p_get[j])->param<<std::endl;
	}

	for(int j=0;j<iroute::post_len;j++){
		std::cout<<(iroute::handler_p_post[j])->uri<<std::endl;
		std::cout<<(iroute::handler_p_post[j])->char_uri_len<<std::endl;
		std::cout<<(iroute::handler_p_post[j])->param<<std::endl;
	}

	for(int j=0;j<iroute::put_len;j++){
		std::cout<<(iroute::handler_p_put[j])->uri<<std::endl;
		std::cout<<(iroute::handler_p_put[j])->char_uri_len<<std::endl;
		std::cout<<(iroute::handler_p_put[j])->param<<std::endl;
	}

	for(int j=0;j<iroute::delete_len;j++){
		std::cout<<(iroute::handler_p_delete[j])->uri<<std::endl;
		std::cout<<(iroute::handler_p_delete[j])->char_uri_len<<std::endl;
		std::cout<<(iroute::handler_p_delete[j])->param<<std::endl;
	}
*/


	iroute::isAdd = 1;
	return Undefined(); 
};


void route::loop_add(Handle<Object> array, handler_route **handler_p, int len){
	HandleScope scope;

	for(int i=0;i<len;i++){
		handler_route *hp = new handler_route(); //创建指向 handler_route 实例的指针
		Local<Object> obj = array->Get(i)->ToObject();
		
		hp->uri = toCString(obj->Get(String::New("uri")));
	

		hp->param = toCString(obj->Get(String::New("param")));
	

		hp->char_uri = new char[hp->uri.length() + 1]; //获得uri的char*
		strcpy(hp->char_uri, hp->uri.c_str());
		hp->char_uri_len = strlen(hp->char_uri);//获得uri长度

		hp->char_param = new char[hp->param.length() + 1]; //获得param的char*
		strcpy(hp->char_param, hp->param.c_str());
		hp->char_param_len = strlen(hp->char_param);//获得param长度


		hp->callback = Persistent<Object>::New(obj->Get(String::New("callback"))->ToObject());

		handler_p[i] = hp; //将指针存入 指针数组等待匹配

	}

};


Handle<Value> route::match(const Arguments& args){
	HandleScope scope;

	if(!iroute::isAdd){
		return ThrowException(Exception::TypeError(String::New("please run iroute.add(..) first!")));
	}
	Request req;

	String::Utf8Value url(args[0]->ToObject()->Get(String::New("url2"))->ToString());//conver
	req.url = *url;

	req.method = toCString(args[0]->ToObject()->Get(String::New("method")));
	
	worker_callback(req);

	Local<Value> argv[2];
	argv[0] = args[0];
	argv[1] = args[1];


	if(req.handler_p){

		req.handler_p->callback->CallAsFunction(Object::New(), 2, argv);

	}
	else{

		iroute::default_callback->CallAsFunction(Object::New(), 2, argv);

	}
	

	//delete rq_p;
	return Undefined(); 
};



void route::worker_callback(Request &req){

	static const char sign1 = '?';
	char *char_uri = strtok(req.url, &sign1);

	handler_route* handler_p = 0;


	std::string method = req.method;


	if(method == "GET"){ //匹配url
		handler_p = uri_match(iroute::handler_p_get, iroute::get_len, char_uri);
	}
	else if(method == "POST"){
		handler_p = uri_match(iroute::handler_p_post, iroute::post_len, char_uri);
	}
	else if(method == "PUT"){
		handler_p = uri_match(iroute::handler_p_put, iroute::put_len, char_uri);
	}
	else if(method == "DELETE"){
		handler_p = uri_match(iroute::handler_p_delete, iroute::delete_len, char_uri);
	}
	
	char *param = strtok(NULL, &sign1);

	if(handler_p && handler_p->param != "false"){

		if(!param) handler_p = 0;
		else{	

				std::string string_param = param;



				handler_p = param_match(handler_p, string_param) ? handler_p : 0;
		}


	}
	
	req.handler_p = handler_p;
	


};


handler_route* route::uri_match(handler_route **handler_p,int len,const char *char_uri){

	int char_uri_len = strlen(char_uri);
	int pos = 0;
	if( char_uri[char_uri_len-1] != '/') pos = -1;

	for(int i=0;i<len;i++){

		int loc = strncmp(char_uri, handler_p[i]->char_uri, handler_p[i]->char_uri_len+pos);

		if( loc == 0 ){ //匹配uri地址成功

			return handler_p[i];
		}

	}

	return 0;
}

int route::param_match(handler_route *handler_p, std::string &param){

	int i = 1;

	static const char sign2 = '&';

	char *temp = new char[handler_p->char_param_len]; //获得uri的char*
	strcpy(temp, handler_p->char_param);



	char *need_p = strtok(temp, &sign2);

	while(need_p){


		std::string::size_type po = param.find(need_p, 0, strlen(need_p));


		if(po == std::string::npos){	

			delete temp;
			return 0;
		}

		need_p = strtok(NULL, &sign2);

	}

	
	delete temp;
	return 1;
}





std::string route::toCString(Handle<Value> strp){
      String::Utf8Value value(strp->ToString());//conver to utf8-value
      std::string str = *value;
      return str;
}


char* route::strlwr2(char* str)
{
   char* orig = str;
   // process the string
   for ( ; *str != '\0'; str++ )
       *str = tolower(*str);
   return orig;
}