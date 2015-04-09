/**
 * Created by weisse on 06/04/2015.
 */
var x = require("xtra");
var O = require("../sphere");
O.TaskManager = require("./TaskManager");

module.exports = O.create(O.TaskManager, {

    constructor: function(){

        O.TaskManager.prototype.constructor.apply(this, arguments);
        this.__handlers = {};
        this.__listeners = {};
        return this;

    },
    __handlersCounter: 0,
    __listenersCounter: 0,
    __playHandler: function(idx, args){

        var handler = this.__handlers[idx];

        if(handler.times !== 0){

            this.perform.apply(this, [idx,this].concat(args));
            handler.times--;

        }

        if(handler.times == 0){

            this.removeHandler(idx);

        }

    },
    registerHandler: function(event, fn, times, observer, listener){ //observer & listener are optionals

        var taskPointer = this.registerTask(fn);
        var handler = {event:event, task:taskPointer, times:times};
        if(observer && listener) handler.observer = observer.sid, handler.listener = listener;
        this.__handlers[this.__handlersCounter] = handler;
        return this.__handlersCounter++;

    },
    registerListener: function(evObj, event, fn, times){

        var handler = evObj.registerHandler(event, fn, times, this, this.__listenersCounter);
        this.__listeners[this.__listenersCounter] = {event:event, observed:evObj.sid, handler:handler};
        return this.__listenersCounter++;

    },
    removeHandler: function(idx){

        var handler = this.__handlers[idx];

        if(handler){

            delete this.__handlers[idx];
            this.removeTask(handler.task);
            if(handler.observer) O.get(handler.observer).removeListener(handler.listener);

        }

        return handler;

    },
    removeListener: function(idx){

        var listener = this.__listeners[idx];

        if(listener){

            delete this.__listeners[idx];
            O.get(listener.observed).removeHandler(listener.handler);

        }

        return listener;

    },
    on: function(event, fn, times){

        if(!times) times = -1;
        this.registerHandler(event, fn, times);
        return this;

    },
    once: function(event, fn){

        this.on(event, fn, 1);
        return this;

    },
    listenTo: function(evObj, event, fn, times){

        if(!times) times = -1;
        this.registerListener(evObj, event, fn, times);
        return this;

    },
    listenOnce: function(evObj, event, fn){

        this.registerListener(evObj, event, fn, 1);
        return this;

    },
    off: function(event){

        for(var idx in this.__handlers){

            var handler = this.__handlers[idx];
            if(handler.event === event) this.removeHandler(idx);

        }

        return this;

    },
    offAll: function(){

        for(var idx in this.__handlers){

            this.removeHandler(idx);

        }

        return this;

    },
    ignore: function(evObj, event){

        for(var idx in this.__listeners){

            var listener = this.__listeners[idx];

            if(listener.observed === evObj.sid){

                if(x.isUndefined(event) || listener.event === event){

                    this.removeListener(idx);

                }

            }

        }

        return this;

    },
    ignoreAll: function(){

        for(var idx in this.__listeners) this.removeListener(idx);
        return this;

    },
    trigger: function(){

        var args = x.toArray(x.objectify(arguments));
        var event = args.shift();

        for(var idx in this.__handlers){

            var handler = this.__handlers[idx];

            if(handler.event === event) {

                this.__playHandler(idx, args);

            }else if(handler.event == "all"){

                this.__playHandler(idx, [event].concat(args));

            }

        }

        return this;

    },
    destroy: function(){

        this.offAll().ignoreAll();
        O.TaskManager.prototype.destroy.apply(this, arguments);
        return this;

    }

});
