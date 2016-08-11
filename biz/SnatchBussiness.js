/**
 * Created by py on 2016/7/28.
 */
var superagent = require("superagent");
var cheerio = require("cheerio");
var img_dir = require("../setting.json").img_dir
var co = require("co")
var downloadImg = require("./DownloadImg").downloadImg
var Actor = require("../entity/ActorEntity").Actor;
var async = require("async");

function snatchActorData (actor,callback) {
    var url = "https://movie.douban.com/celebrities/search?search_text="+encodeURIComponent(actor.chinese_name)+"&cat=1002";
    superagent.get(url)
       
        .end(function (err,res){
            if(err) {
                console.log("获取："+url+" 失败");
                return Actor.findByIdAndUpdate(actor._id,null,null, callback);
            }
            var $ = cheerio.load(res.text,{decodeEntities: false});
            var href = $(".result .content a").attr("href");
            if(!href) {
                return Actor.findByIdAndUpdate(actor._id,null,null, callback);
            };
            console.log('正在抓取的是', url,"详情地址是，",href);
            setTimeout(function () {
                fetchInfo(href,actor,callback);
            },1500);
        });
}


var fetchInfo = function (href,actor,callback) {
    superagent.get(href)
        .set({
            "Host": "movie.douban.com",
            "Connection": "keep-alive",
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "zh-CN,zh;q=0.8"
        })
        .end(function (e,actorDetail){
            if(e) {
                console.log("获取："+href+" 失败");
               return Actor.findByIdAndUpdate(actor._id,null,null, callback);
            }
            if(actorDetail.text){
                var $ = cheerio.load(actorDetail.text,{decodeEntities: false});
                var info = $("#headline ul li");
                var actorEntity = {alias:[]};
                info.each(function (idx,element) {
                    var el = $(element);
                    var title = el.find("span").text();
                    switch (title){
                        case '性别':
                            actorEntity.sex = el.contents().filter(function () {return this.nodeType===3}).text().replace(":","").trim();
                            break;
                        case '星座':
                            actorEntity.constellation = el.contents().filter(function () {return this.nodeType===3}).text().replace(":","").trim();
                            break;
                        case'出生日期':
                            actorEntity.born_day = el.contents().filter(function () {return this.nodeType===3}).text().replace(":","").trim();
                            break;
                        case'出生地':
                            actorEntity.born_place = el.contents().filter(function () {return this.nodeType===3}).text().replace(":","").trim();
                            break;
                        case'职业':
                            actorEntity.occupation = el.contents().filter(function () {return this.nodeType===3}).text().replace(":","").trim().split("/");
                            break;
                        case'更多外文名':
                            var textArr = el.contents().filter(function () {return this.nodeType===3}).text().replace(":","").trim().split("/");
                            textArr.forEach(function (item) {
                                actorEntity.alias.push(item);
                            });
                            break;
                        case'更多中文名':
                            var textArr = el.contents().filter(function () {return this.nodeType===3}).text().replace(":","").trim().split("/");
                            textArr.forEach(function (item) {
                                actorEntity.alias.push(item);
                            });
                            break;
                        case'家庭成员':
                            actorEntity.family = el.contents().filter(function () {return this.nodeType===3}).text().replace(":","").trim();
                            break;
                    }
                });
                var intro = $("#intro .bd");
                var pic = $("#headline .pic img").attr("src");
                var enName = $("#content h1").text();
                actorEntity.english_name = enName.slice(enName.indexOf(" ")+1,enName.length);
                actorEntity.icon = img_dir+actor._id+".jpg";
                actorEntity.is_update = 1;
                if(intro.children("span").length===0){
                    actorEntity.intro = intro.html();
                } else {
                    actorEntity.intro = intro.find(".all.hidden").html();
                }
                async.series([
                    function (cb) {
                        downloadImg(pic,actor._id,cb)
                    }
                ],function (err,result) {
                    if(err) {
                        actorEntity.icon = null;
                        Actor.findByIdAndUpdate(actor._id,actorEntity,null, callback);
                    } else{
                        Actor.findByIdAndUpdate(actor._id,actorEntity,null, callback);
                    }
                });
            } else {
                Actor.findByIdAndUpdate(actor._id,actorEntity,null, callback);
            }

        });
}
exports.snatchActorData = snatchActorData;