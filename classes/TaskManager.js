/**
 * Created by weisse on 06/04/2015.
 */
var x = require("xtra");
var O = require("../sphere");

module.exports = O.create({

    constructor: function(options){

        O.prototype.constructor.apply(this, arguments);
        this.__tasks = {};

        if(options){

            if(options.tasks){

                for(var name in options.tasks){

                    this.registerTask(name, options.tasks[name]);

                }

            }

        }

        return this;

    },
    __tasksCounter: 0,
    __tasks: {},
    registerTask: function(){

        var idx;
        var fn;

        if(x.isFunction(arguments[0])){

            idx = this.__tasksCounter.toString();
            fn = arguments[0];
            this.__tasksCounter++;

        }else if(x.isString(arguments[0]) && x.isFunction(arguments[1])){

            idx = arguments[0];
            fn = arguments[1];

        }else{

            throw(new Error("Invalid arguments."));

        }

        this.__tasks[idx] = fn;
        return idx;

    },
    removeTask: function(idx){

        var fn = this.__tasks[idx];
        delete this.__tasks[idx];
        return fn;

    },
    perform: function(){

        var args = x.toArray(x.objectify(arguments));
        var idx = args.shift();
        var ctx = args.shift();
        return this.__tasks[idx].apply(ctx, args);

    },
    destroy: function(){

        var self = this;

        for(var idx in this.__tasks){

            self.removeTask(idx);

        };

        O.prototype.destroy.apply(this, arguments);
        return this;

    }

});
