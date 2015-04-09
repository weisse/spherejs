/**
 * Created by weisse on 06/04/2015.
 */
var x = require("xtra");
var O = function(){return this.constructor.apply(this,arguments)};
O.__factoryCounter = 0;
O.factory = {};
O.prototype.constructor = function(){

    this.sid = O.__factoryCounter.toString();
    O.factory[this.sid] = this;
    O.__factoryCounter++;
    return this;

};
O.prototype.destroy = function(){

    delete O.factory[this.sid];
    return this;

};

O.create = function(){

    // check arguments
    if(arguments[0] && !arguments[1] && x.isObject(arguments[0])){

        var Super = O;
        var proto = arguments[0];

    }else if(arguments[0] && arguments[1] && x.isFunction(arguments[0]) && x.isObject(arguments[1])){

        var Super = arguments[0];
        var proto = arguments[1];

    }else{

        throw(new Error("Invalid arguments."))

    }

    // create constructor caller
    var Class = function(){return this.constructor.apply(this,arguments)};

    // load inherited prototype
    Class.prototype = Object.create(Super.prototype);

    // extend inherited prototype
    for(var attr in proto) Class.prototype[attr] = proto[attr];

    // seal prototype object
    Object.seal(Class.prototype);

    // return class
    return Class;

};
O.get = function(idx){

    return O.factory[idx];

};

module.exports = O;
