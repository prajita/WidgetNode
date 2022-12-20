var mongoose = require('mongoose');
const { fetchDate } = require('../utils/fetchDate');
//Widget schema
var WidgetSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    shortDesc: {
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: false
    },
    createdOn:{
        type: String,
        required: false
    },
    approvedOn:{
        type: String,
        required: false
    },
    publishedOn:{
        type: String,
        required: false
    },
    rejectedOn:{
        type: String,
        required: false
    }
})
var Widget = mongoose.model('Widget', WidgetSchema, 'Widgets');

//get Widgets
module.exports.getWidgets = function (callback, limit) {
    Widget.find(callback).limit(limit);
}

//add Widget
module.exports.addWidget = function (widgetObj, callback) {
    Widget.create(widgetObj, callback);
}

module.exports.getWidgetById = function (id, callback) {
    Widget.findById(id, callback);
}
module.exports.updateWidget = async function (id, WidgetObj, options, cb) {
    var query = { _id: id };
    var update = {
        title: WidgetObj.title,
        shortDesc: WidgetObj.shortDesc,
        createdOn: WidgetObj.createdOn,
        approvedOn: WidgetObj.approvedOn,
        publishedOn: WidgetObj.publishedOn,
        category: WidgetObj.category,
        status: WidgetObj.status

    }
    let data=await Widget.findByIdAndUpdate(query, update, options)
    cb(data);
       
}

module.exports.updateWidgetStatus = async function (id, status, options, cb){
    var query = { _id: id };
    if(status === "approved"){
        approvedOn = fetchDate();
        var update = {
            status ,
            approvedOn,
        }
    }else if(status === "published"){
        publishedOn = fetchDate();
        var update = {
            status ,
            publishedOn
        }
    }else{
        rejectedOn = fetchDate();
        var update = {
            status ,
            rejectedOn
        }
    }
    
    let data=await Widget.findByIdAndUpdate(query, update, options)
    cb(data);
}


module.exports.deleteWidget = function (id, cb) {
    Widget.findByIdAndDelete(id, cb);       
}
