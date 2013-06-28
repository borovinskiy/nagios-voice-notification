var querystring = require("querystring");
var child_process = require("child_process");
var crypto = require("crypto");


function start(response, postData, getData) {
  console.log("Request handler 'start' was called.");

  var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/audiomessage" method="post">'+
    '<textarea name="text" rows="20" cols="60"></textarea><br />'+
    '<input type="submit" value="Submit text" />'+
    '</form>'+
    '</body>'+
    '</html>';

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

function upload(response, postData, getData) {
  console.log("Request handler 'upload' was called.");
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write("You've sent the text: " + querystring.parse(postData)["text"]);
  response.end();
}

function mp3(response, postData, getData) {
	audiomessage(response, postData, getData, "mp3");
}

function wav(response, postData, getData) {
	audiomessage(response, postData, getData, "wav");
}

function audiomessage(response, postData, getData, extension) {
  console.log("Request handler 'audiomessage' was called.");
  //response.writeHead(200, {"Content-Type": "text/html"});
  console.log('GET DATA TEXT: '+querystring.parse(getData)["text"]);	// comment in ANSI codepage
  var text = querystring.parse(getData)["text"];						// ищем текст, который будем переводить в музыку как параметр get ?text=message%20for%20user
  if (!text || text.length == 0) {
	text = querystring.parse(postData)["text"];	// если параметр text как GET не задан, то берем его как post
  }
  if (text && text.length > 0) {
	var fs = require("fs");
	var file_hash = crypto.createHash('md5').update(text).digest('hex');  	// Считаем хеш от текста, который будем произносить
	console.log('md5 hash is: ' + file_hash);
	var filename = file_hash;
	var file = 'tmp/' + filename + '.txt';		
	var file_cp1251 = 'tmp/' + filename + '.cp1251.txt';				// файл в кодировке cp1251
	var file_cp1251_govorilka = 'c:\\govorilka\\tmp\\' + filename + '.cp1251.txt'; // тот же файл но с windows путем для говорилки
	var file_wav = 'wav/' + filename + '.wav';				// wav - файл
	var file_wav_govorilka = 'c:\\govorilka\\wav\\' + filename + '.wav';  // wav - файл с путем для говорилки
	var file_mp3 = 'mp3/' + filename + '.mp3';
	
	// теперь проверим что такой wav файл не был сгенерирован ранее, если он уже сгенерирован, то вернем его без новой генерации
	fs.open(file_wav,'r',0664,function(err,file_handle){
	  if (!err) {
		fs.close(file_handle);
		html_out_wav(response,file_wav);		// если звуковой файл с таким текстом уже существует, сразу отдадим его пользователю
	  }
	  else{


	
		fs.open(file,'w', 0664,function(err,file_handle){
			if (!err) {		// если открыли файл на запись и текст не undifined
				fs.write(file_handle, text, null, 'utf-8', function(err,write){		// записываем сообщение text в файл file
					if (!err) {
						fs.close(file_handle);		// здесь можно проверить что закрыли нормально. но не будем этого делать.
						var iconv = child_process.spawn('iconv',['-f','utf-8','-t','Windows-1251',file]);
						console.log('start iconv to file: '+file+'.cp1251');
						iconv.stderr.on('data', function(data){
							console.log('error: '+data);
						});
						iconv.stdout.on('data',function (data) {
							fs2 = require("fs");
							fs2.open(file_cp1251,'w',0664,function(err,filecp1251_handle) {
								if (!err) {
									console.log('file write data: '+data);
									console.log('file cp1251 handle is '+filecp1251_handle.toString());
									fs2.write(filecp1251_handle, data, undefined, data.length, 0, function(err,write){
										if (!err) {
											fs2.close(filecp1251_handle);		// закрываем текстовый файл
										} else {
											console.log('error: can not write to file');
											fs2.close(filecp1251_handle);		// закрываем текстовый файл если возникла ошибка
										}
									});
								} else {
								console.log('error: can not write iconv cp1251 file');
								}	
							});
						});	
						iconv.on('exit', function (data) { 			// после завершения конвертации текстового файла в cp1251, необходимо вызвать говорилку
							console.log('iconv is end');
							var govorilka = child_process.spawn('c:\\govorilka\\govorilka_cp\\Govorilka_cp.exe',['-I', '-F', file_cp1251_govorilka, '-TO', file_wav_govorilka]);
							console.log('run govorilka: c:\\govorilka\\govorilka_cp\\Govorilka_cp.exe -I -F '+file_cp1251_govorilka+' -TO '+file_wav_govorilka);
							govorilka.stdout.on('data', function (data) {
								console.log('stdout: ' + data);
							});
							govorilka.stderr.on('data', function (data) {
								console.log('stderr: ' + data);
							});
							govorilka.on('exit', function (code) {
										// wav файл создан, теперь надо отдать его пользователю
										var ffmpeg = child_process.spawn('c:\\govorilka\\bin\\ffmpeg.exe',['-i',file_wav,file_mp3,'-y']);										
										console.log("run ffmpeg convert wav to mp3");
										console.log('c:\\govorilka\\bin\\ffmpeg.exe -i ' + file_wav + ' ' + file_mp3);
										ffmpeg.stdout.on('data', function (data) { console.log('stdout: ' + data); });
										ffmpeg.stderr.on('data', function (data) { console.log('stderr: ' + data); });
										ffmpeg.on('exit', function (code) {
											if (extension == 'wav') {
												html_out_wav(response,file_wav);
											}
											if (extension == 'mp3') {
												html_out_mp3(response,file_mp3);
											}
										});
										
								console.log('child process exited with code ' + code);
							});
						});	
					} else {
						console.log('error: can not write text ' + text + ' into file ' + file);	// не смогли записать сообщение во временный файл
					}	
				});
			} else {
				console.log('error: can not opened file ' + file + ' for writing' );
			}
	
		});	//end file open
	  }				// end create file if hash.wav not exist
	});				// end stop for user process
  }		// end if (text)
}

// выводит в бинарном виде файл wav c путем filepath в браузер
function html_out_wav(response,file_wav) {
	fs = require("fs");
	// wav файл создан, теперь надо отдать его пользователю
	response.writeHead(200, {"Content-Type": "audio/x-wav"});
										//response.writeHead(200, {"Content-Type": "text/html"});
										//fs2.readFile(file_cp1251,'binary',function(err,data){
										//	if (!err) {
										//		response.write(data);	
										//	} else {
										//		console.log('error: can not reading wav file');
										//	}	
										//});
	var body = fs.readFileSync(file_wav,'binary');
	console.log('wav file length: '+body.length);
	response.write(body,'binary');
										//fs2.createReadStream(file_wav).pipe(response);
	response.end();
	console.log('wav file is downloaded');
}

function html_out_mp3(response,file_mp3) {
	fs = require("fs");
	// wav р ©« с®§¤б­¬ тҐЇҐрј ­бҐ® пі¤біј ж¤® аЇ«р§®ўбіҐмѕЌ	
	response.writeHead(200, {"Content-Type": "audio/mpeg"});
										//response.writeHead(200, {"Content-Type": "text/html"});
										//fs2.readFile(file_cp1251,'binary',function(err,data){
										//	if (!err) {
										//		response.write(data);	
										//	} else {
										//		console.log('error: can not reading wav file');
										//	}	
										//});
	var body = fs.readFileSync(file_mp3,'binary');
	console.log('mp3 file length: '+body.length);
	response.write(body,'binary');
										//fs2.createReadStream(file_wav).pipe(response);
	response.end();
	console.log('mp3 file is downloaded');
}

exports.audiomessage = audiomessage;
exports.wav = wav;
exports.mp3 = mp3;
exports.start = start;
exports.upload = upload;
