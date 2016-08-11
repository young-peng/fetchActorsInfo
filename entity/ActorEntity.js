/**
 * Created by py on 2016/7/27.
 */
var db = require("../setting.json").online_mongodb
var mongoose = require("mongoose");
var conn = mongoose.createConnection(db.url,db.database,db.port,db.opts);

var ActorSchema = mongoose.Schema({
    flush_required:{type:Number},
    is_update:{type:Number},
    deleteme:{type:Number},
    chinese_name:{type:String,unique:true},
    english_name:{type:String},
    alias:{type:Array},
    born_day:{type:String},
    born_place:{type:String},
    occupation:{type:Array},
    icon:{type:String},
    intro:{type:String},
    constellation:{type:String},
    sex:{type:String},
    family:{type:String},
    pinyin_set:{type:Array},
    pinyin:{type:Array}
});


var Actor = conn.model("actors",ActorSchema);

exports.Actor = Actor;


