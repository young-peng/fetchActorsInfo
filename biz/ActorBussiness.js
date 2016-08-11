/**
 * Created by py on 2016/7/27.
 */
var Actor = require("../entity/ActorEntity").Actor;
var ActorName = require("../entity/ProgramActorEntity").ActorName;
var snatchActorData = require("./SnatchBussiness").snatchActorData;
var async = require("async");
var co = require("co");

function initActor () {
     ActorName.distinct("actors",function (err,data){
        if(err) throw new Error(err);
        async.map(data,function (item,callback){
            var actor = new Actor({
                chinese_name:item
            });
            actor.save(function(err,actor){
                if(err) console.log(err);
                callback(err,actor);
            });
        },function(err,result){
            if(err) console.log(err);
            console.log("init done");
            updateActor(result);
        });
     });
}

function updateActor(actorArr) {
    async.eachLimit(actorArr,2,function (actor, callback){
        console.log('演员名字是：', actor.chinese_name);
        setTimeout(function (){
            snatchActorData(actor, callback);
        },1500)
    },function (err,result) {
        if(err) console.log(err);
        console.log("success");
        process.exit(1);
    });
}

// Actor.find(function (err,actorArr){
//     if(err)
//         throw new Error(err)
//     if(actorArr&&actorArr.length>0){
//         Actor.find({is_update:{$exists:false}},function (err,actorArr){
//             if(err) console.log(err);
//             console.log(actorArr.length)
//             updateActor(actorArr)
//         });
//     } else {
//        initActor();
//     }
// });

//test
Actor.find({is_update:{$exists:true}},function (err,data){
    if(err) throw new Error(err);//42006
    console.log(data.length)
});

