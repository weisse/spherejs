/**
 * Created by weisse on 06/04/2015.
 */
module.exports = O.create = function(){

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