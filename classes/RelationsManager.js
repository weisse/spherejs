/**
 * Created by weisse on 07/04/2015.
 */
var O = require("../sphere.js");
var x = require("xtra");

module.exports = O.create(O.EventsManager, {

    constructor: function(){

        O.EventsManager.prototype.constructor.apply(this, arguments);
        this.__commands = {};
        this.__responses = {};

    },
    command: function(name, fn){

        if(!x.isUndefined(this.__commands[name])) this.dismiss(name);
        var task = this.registerTask(fn);
        this.__commands[name] = task;
        return this;

    },
    response: function(request, fn){

        if(!x.isUndefined(this.__responses[request])) this.shut(request);
        var task = this.registerTask(fn);
        this.__responses[request] = task;
        return this;

    },
    dismiss: function(name){

        this.removeTask(this.__commands[name]);
        delete this.__commands[name];
        return this;

    },
    dismissAll: function(){

        for(var name in this.__commands) this.dismiss(name);
        return this;

    },
    shut: function(request){

        this.removeTask(this.__responses[request]);
        delete this.__responses[request];
        return this;

    },
    shutAll: function(){

        for(var request in this.__responses) this.shut(request);
        return this;

    },
    execute: function(){

        var args = x.toArray(x.objectify(arguments));
        var command = args.shift();
        this.perform.apply(this, [this.__commands[command], this].concat(args));
        return this;

    },
    ask: function(){

        var args = x.toArray(x.objectify(arguments));
        var question = args.shift();
        return this.perform.apply(this, [this.__responses[question], this].concat(args));

    }

});
