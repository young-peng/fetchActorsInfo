/**
 * Created by py on 2016/7/29.
 */
var request = require("request");
var fs = require("fs");
var mkdirp = require('mkdirp');

var dir = require("../setting.json").file_dir;
mkdirp(dir, function(err) {
    if(err){
        console.log(err);
    }
});

function downloadImg(url,fileName,cb){
    var options = {
        url: url,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
        }
    };
    request(options,function (err,res,body){
        if(err) console.log(err+"获取图片失败");
        cb(err,body);
    }).pipe( fs.createWriteStream(dir+"/"+fileName+".jpg"));
}

exports.downloadImg = downloadImg;