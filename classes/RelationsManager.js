/**
 * Created by weisse on 07/04/2015.
 */
var O = require("../sphere.js");
var x = require("xtra");

module.exports = O.create(O.EventsManager, {

    constructor: function(options){

        O.EventsManager.prototype.constructor.apply(this, arguments);
        this.__commands = {};
        this.__answers = {};

        if(options){

            if(options.commands){

                for(var name in options.commands){

                    this.command(name, options.commands[name]);

                }

            }

            if(options.answers){

                for(var name in options.answers){

                    this.answer(name, options.answers[name]);

                }

            }

        }

        return this;

    },
    command: function(name, fn){

        if(!x.isUndefined(this.__commands[name])) this.dismiss(name);
        var taskPointer = this.registerTask(fn);
        this.__commands[name] = taskPointer;
        return this;

    },
    answer: function(request, fn){

        if(!x.isUndefined(this.__answers[request])) this.shut(request);
        var taskPointer = this.registerTask(fn);
        this.__answers[request] = taskPointer;
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

        this.removeTask(this.__answers[request]);
        delete this.__answers[request];
        return this;

    },
    shutAll: function(){

        for(var request in this.__answers) this.shut(request);
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
        return this.perform.apply(this, [this.__answers[question], this].concat(args));

    }

});
