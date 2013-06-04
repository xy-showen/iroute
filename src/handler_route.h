#ifndef HANDLER_H
#define HANDLER_H
#include <node.h>
#include <string>


using namespace v8;

class handler_route {

 public:
  char *char_uri;
  char *char_param;
  int char_uri_len;
  int char_param_len;

  std::string uri;
  std::string param; 

  Persistent<Object> callback;   //js注册的回调函数
  static int count;                       //此接口的访问次数
  
  handler_route(){};
  ~handler_route(){};
  
};

#endif