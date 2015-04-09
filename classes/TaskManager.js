/**
 * Created by weisse on 06/04/2015.
 */
var x = require("xtra");
var O = require("../sphere");

module.exports = O.create({

    constructor: function(){

        O.prototype.constructor.apply(this, arguments);
        this.__tasks = {};
        return this;

    },
    __tasksCounter: 0,
    __tasks: {},
    registerTask: function(task){

        if(x.isFunction(task)){

            this.__tasks[this.__tasksCounter] = task;
            this.__tasksCounter++;
            return this.__tasksCounter - 1;

        }else{

            throw(new Error("Task must be a function."));

        }

    },
    removeTask: function(idx){

        return delete this.__tasks[idx];

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
