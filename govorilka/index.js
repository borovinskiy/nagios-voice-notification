var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
handle["/audiomessage"] = requestHandlers.audiomessage;
handle["/wav"] = requestHandlers.audiomessage;

server.start(router.route, handle);