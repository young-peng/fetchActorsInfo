/**
 * Created by py on 2016/7/27.
 */
var mongoose = require("mongoose");
var config = require("../setting.json").online_mongodb
var db = mongoose.createConnection(config.url,config.database,config.port,config.opts);
var ProgramActor = mongoose.Schema({
    actors:{type:String}
});

var ActorName = db.model("programs",ProgramActor);
exports.ActorName = ActorName;