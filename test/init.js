/**
 * Created by weisse on 04/04/2015.
 */
var x = require("xtra");
var O = require("../main");
var assert = require("assert");

describe("Sphere", function(){

    describe("create()", function(){

        it("should throw an Error when no argument was passed", function(){

            try{

                O.create();

            }catch(e){

                var err = e;

            }finally{

                assert.equal(true, err instanceof Error);

            }

        });

        it("should throw an error when it was passed only class to be extended", function(){

            var Class = O.create({});

            try{

                O.create(Class);

            }catch(e){

                var err = e;

            }finally{

                assert.equal(true, err instanceof Error);

            }

        });

        it("should throw an error when invalid arguments are passed", function(){

            var Class = O.create({});

            try{

                O.create([], "string");

            }catch(e){

                var err = e;

            }finally{

                assert.equal(true, err instanceof Error);

            }

        });

        it("should return a class containing the property \"constructor\" in prototype even if it has not been defined (creation mode)", function(){

            var Class = O.create({test:/regexp/});
            assert.equal(true, Class.prototype.constructor instanceof Function);

        });

        it("should return a class having the prototype set as defined at creation (creation mode)", function(){

            var Class = O.create({a:"a",b:"b",c:"c"});
            assert.equal("{\"a\":\"a\",\"b\":\"b\",\"c\":\"c\"}", JSON.stringify(Class.prototype));

        });

        it("should instantiate an object instance of Sphere (creation mode)", function(){

            var Class = O.create({});
            assert.equal(true, (new Class()) instanceof O);

        });

        it("should return a class having the prototype sealed (creation mode)", function(){

            var Class = O.create({});
            assert.equal(true, Object.isSealed(Class.prototype));

        });

        var Super = O.create({test:"test"});

        it("should return a class having the prototype set as defined at creation (extension mode)", function(){

            var Class = O.create(Super, {a:"a",b:"b",c:"c"});
            assert.equal("{\"a\":\"a\",\"b\":\"b\",\"c\":\"c\"}", JSON.stringify(Class.prototype));

        });

        it("should return a class having the prototype of the superclass defined in its own prototype (extension mode)", function(){

            var Class = O.create(Super, {a:"a",b:"b",c:"c"});
            var instance = new Class();
            assert.equal("test", instance.test);

        });

        it("should instantiate an object instance of superclass (extension mode)", function(){

            var Class = O.create(Super, {test:"something"});
            assert.equal(true, (new Class()) instanceof Super);

        });

        it("should return a class having the prototype sealed (extension mode)", function(){

            var Class = O.create({});
            assert.equal(true, Object.isSealed(Class.prototype));

        });

    });

    describe("get()", function(){

        var obj = new O;

        it("should return the object in factory corresponding with the index passed", function(){

            assert.equal(obj, O.get(0));

        });

    });

    describe("TaskManager", function(){

        var task = function(){console.log("doIt")};

        it("should instantiate an object containing the property \"__task\"", function(){

            var tm = new O.TaskManager();
            assert.equal(true, x.isObject(tm.__tasks));

        });

        describe("registerTask()", function(){

            it("should throw an error when the arguments are not valid", function(){

                var tm = new O.TaskManager();

                try{

                    tm.registerTask(123);

                }catch(e1){

                    var err1 = e1;

                }finally{

                    try{

                        tm.registerTask("name", 123);

                    }catch(e2){

                        var err2 = e2;

                    }finally{

                        assert.equal([true,true].toString(), [err1 instanceof Error, err2 instanceof Error]);

                    }

                }

            });

            it("should record a task inside the property \"__task\" contained in the object instantiated", function(){

                var tm = new O.TaskManager();
                tm.registerTask(task);
                assert.equal(true, tm.__tasks[0] === task);

            });

            it("should increment the counter if a name was not specified", function(){

                var tm = new O.TaskManager();
                var counter = tm.__tasksCounter;
                tm.registerTask(function(){});
                assert.equal(true, counter == tm.__tasksCounter - 1);

            });

            it("should not increment the counter if a name was specified", function(){

                var tm = new O.TaskManager();
                var counter = tm.__tasksCounter;
                tm.registerTask("test", function(){});
                assert.equal(true, counter == tm.__tasksCounter);

            });

        });

        describe("removeTask()", function(){

            it("should return \"undefined\" when it does not find a task corresponding to the passed index", function(){

                var tm = new O.TaskManager();
                console.log(tm.removeTask("string"));
                assert.equal(true, x.isUndefined(tm.removeTask("string")));

            });

            it("should delete the pointer on that task", function(){

                var tm = new O.TaskManager();
                tm.registerTask(function(){});
                tm.removeTask(0);
                assert.equal(true, x.isUndefined(tm.__tasks[0]));

            });

            it("should return the deleted task", function(){

                var tm = new O.TaskManager();
                var fn = function(){};
                tm.registerTask(fn);
                assert.equal(fn, tm.removeTask(0));

            });

        });

        describe("perform()", function(){

            it("should throw an error when the task is not found", function(){

                var tm = new O.TaskManager();

                try{

                    tm.perform(0);

                }catch(e){

                    var err = e;

                }finally{

                    assert.equal(true, err instanceof Error);

                }

            });

            it("should throw an error when the index past is formally incorrect", function(){

                var tm = new O.TaskManager();

                try{

                    tm.perform(/regexp/);

                }catch(e){

                    var err = e;

                }finally{

                    assert.equal(true, err instanceof Error);

                }

            });

            it("should perform a registered task", function(){

                var tm = new O.TaskManager();
                tm.registerTask(function(){return "done"});
                assert.equal("done", tm.perform(0));

            });

            it("should perform the task specified in the index passed as an argument", function(){

                var tm = new O.TaskManager();
                tm.registerTask(function(){return arguments});
                assert.equal(x.toArray(x.objectify((function(){return arguments}(["one","two","three"])))).toString(), x.toArray(x.objectify(tm.perform(0,this,"one","two","three"))).toString());

            });

        });

        describe("destroy()", function(){

            it("should remove all tasks of the instance", function(){

                var tm = new O.TaskManager();
                tm.registerTask("test", function(){});
                tm.registerTask(function(){});
                tm.registerTask(function(){});
                tm.destroy();
                assert.equal(0, x.size(tm.__tasks));

            }) ;

        });

    });

    describe("EventsManager", function(){

        var em = new O.EventsManager();

        it("should instantiate an object instance of TaskManager", function(){

            assert.equal(true, em instanceof O.TaskManager);

        });

        it("should instantiate an object containing the property \"__handlers\"", function(){

            assert.equal(false, x.isUndefined(em.__handlers));

        });

        it("should instantiate an object containing the property \"__listeners\"", function(){

            assert.equal(false, x.isUndefined(em.__listeners));

        });

        describe("on()", function(){

            var em = new O.EventsManager();
            var fn = function(){ return "triggered!"; };

            it("should create an event handler inside the property \"__handlers\"", function(){

                em.on("first", fn);
                assert.equal(false, x.isUndefined(em.__handlers[0]));

            });

            it("should create a task for the handler created", function(){

                assert.equal(false, x.isUndefined(em.__tasks[0]));

            });

            it("should ensure that the handler points the created task", function(){

                assert.equal(0, em.__handlers[0].task);

            });

            it("should set the number of times that the handler can be performed", function(){

                em.on("second", fn, 3);
                assert.equal(3, em.__handlers[1].times);

            });

            it("should set the number of times that the handler can be performed to -1 to default", function(){

                assert.equal(-1, em.__handlers[0].times);

            });

            it("should return \"this\" to make the chaining possible", function(){

                assert.equal(em, em.on("chain", function(){}));

            });

        });

        describe("once()", function(){

            var em = new O.EventsManager();
            var fn = function(){ return "triggered once!"; };

            it("should create an event handler inside the property \"__handlers\"", function(){

                em.once("third", fn);
                assert.equal(false, x.isUndefined(em.__handlers[0]));

            });

            it("should create a task for the handler created", function(){

                assert.equal(false, x.isUndefined(em.__tasks[0]));

            });

            it("should ensure that the handler points the created task", function(){

                assert.equal(0, em.__handlers[0].task);

            });

            it("should set the number of times that the handler can be performed to 1", function(){

                assert.equal(1, em.__handlers[0].times);

            });

            it("should return \"this\" to make the chaining possible", function(){

                assert.equal(em, em.once("chain", function(){}));

            });

        });

        describe("listenTo()", function(){

            var em1 = new O.EventsManager();
            var em2 = new O.EventsManager();
            var fn = function(){ return "someone looks for me!"; };
            em1.listenTo(em2, "event", fn);

            it("should create an event listener inside the property \"__listeners\" of the observer object", function(){

                assert.equal(false, x.isUndefined(em1.__listeners[0]));

            });

            it("should create an event handler inside the property \"__handlers\" of the observed object", function(){

                assert.equal(false, x.isUndefined(em2.__handlers[0]));

            });

            it("should create a task for the handler created", function(){

                assert.equal(false, x.isUndefined(em2.__tasks[0]));

            });

            it("should ensure that the handler points the created task", function(){

                assert.equal(0, em2.__handlers[0].task);

            });

            it("should set the number of times that the handler can be performed", function(){

                em2.listenTo(em1, "event", fn, 3);
                assert.equal(3, em1.__handlers[0].times);

            });

            it("should set the number of times that the handler can be performed to -1 to default", function(){

                assert.equal(-1, em2.__handlers[0].times);

            });

            it("should return \"this\" to make the chaining possible", function(){

                assert.equal(em1, em1.listenTo(em2, "chain", function(){}));

            });

        });

        describe("listenOnce()", function(){

            var em1 = new O.EventsManager();
            var em2 = new O.EventsManager();
            var fn = function(){ return "someone looks for me!"; };
            em1.listenOnce(em2, "event", fn);

            it("should create an event listener inside the property \"__listeners\" of the observer object", function(){

                assert.equal(false, x.isUndefined(em1.__listeners[0]));

            });

            it("should create an event handler inside the property \"__handlers\" of the observed object", function(){

                assert.equal(false, x.isUndefined(em2.__handlers[0]));

            });

            it("should create a task for the handler created", function(){

                assert.equal(false, x.isUndefined(em2.__tasks[0]));

            });

            it("should ensure that the handler points the created task", function(){

                assert.equal(0, em2.__handlers[0].task);

            });

            it("should set the number of times that the handler can be performed to 1", function(){

                em2.listenOnce(em1, "event", fn, 3);
                assert.equal(1, em1.__handlers[0].times);

            });

            it("should return \"this\" to make the chaining possible", function(){

                assert.equal(em1, em1.listenOnce(em2, "chain", function(){}));

            });

        });

        describe("trigger()", function(){

            var em = new O.EventsManager();

            it("should perform handlers whose property \"event\" coincides with the event passed as argument and handlers whose property \"event\" is \"all\"", function(){

                var count = 0;
                em.on("test", function(){count++});
                em.on("test", function(){count++});
                em.on("test", function(){count++});
                em.on("all", function(){count++});
                em.trigger("test");

                assert.equal(4, count);

            });

            it("should pass arguments without specifying the event triggered to specific event handlers", function(){

                var args;
                em.on("specific", function(){args = x.toArray(x.objectify(arguments))});
                em.trigger("specific", "arg1", "arg2", "arg3");

                assert.equal(["arg1", "arg2", "arg3"].toString(), args.toString());

            });

            it("should pass arguments by specifying the event triggered to special \"all\" event handlers", function(){

                var args;
                em.on("all", function(){args = x.toArray(x.objectify(arguments))});
                em.trigger("special", "arg1", "arg2", "arg3");

                assert.equal(["special", "arg1", "arg2", "arg3"].toString(), args.toString());

            });

            it("should reduce the number of \"times\" defined in the handler runs", function(){

                em.on("decrease", function(){}, 3);
                em.trigger("decrease");

                assert.equal(2, em.__handlers[x.size(em.__handlers) - 1].times);

            });

            it("should delete the handlers whose counter \"time\" is set to 0", function(){

                var idx = em.registerHandler("remove", function(){}, 3);
                em.trigger("remove").trigger("remove").trigger("remove");

                assert.equal(true, x.isUndefined(em.__handlers[idx]));

            });

            it("should eliminate the tasks pointed by handlers whose counter \"time\" is set to 0", function(){

                var idx = em.registerHandler("remove", function(){}, 3);
                var task = em.__handlers[idx].task;
                em.trigger("remove").trigger("remove").trigger("remove");

                assert.equal(true, x.isUndefined(em.__tasks[task]));

            });

            it("should return \"this\" to make the chaining possible", function(){

                assert.equal(em, em.trigger("chain"));

            });

        });

        describe("off()", function(){

            var em = new O.EventsManager();
            em.on("test", function(){});

            it("should remove all handlers whose property \"event\" coincides with the event passed as argument and their related tasks", function(){

                em.off("test");
                assert.equal([0,0].toString(), [x.size(em.__handlers), x.size(em.__tasks)].toString());

            });

            it("should return \"this\" to make the chaining possible", function(){

                assert.equal(em, em.off("first"));

            });

        });

        describe("offAll()", function(){

            var em = new O.EventsManager();
            em.on("test1", function(){});
            em.on("test2", function(){});
            em.on("test3", function(){});

            it("should remove all handlers and their related tasks", function(){

                em.offAll();
                assert.equal([0,0].toString(), [x.size(em.__handlers), x.size(em.__tasks)].toString());

            });

            it("should return \"this\" to make the chaining possible", function(){

                assert.equal(em, em.offAll());

            });

        });

        describe("ignore()", function(){

            var em1 = new O.EventsManager();
            var em2 = new O.EventsManager();
            em1.listenTo(em2, "test1", function(){});
            em1.listenTo(em2, "test2", function(){});
            em1.listenOnce(em2, "test3", function(){});
            em1.ignore(em2, "test2");

            it("should remove all listeners, whose properties \"object\" and \"event\" are coincident with those passed as arguments, and their handlers with related tasks", function(){

                assert.equal([true,true,true].toString(), [x.isUndefined(em1.__listeners[1]), x.isUndefined(em2.__handlers[1]), x.isUndefined(em2.__tasks[1])].toString());

            });

            it("should remove all listeners, whose property \"object\" coincides with the object passed as an argument and their handlers, with related tasks", function(){

                em1.ignore(em2);
                assert.equal([0,0,0].toString(), [x.size(em1.__listeners), x.size(em2.__handlers), x.size(em2.__tasks)].toString());

            });

            it("should return \"this\" to make the chaining possible", function(){

                assert.equal(em, em.ignore());

            });

        });

        describe("ignoreAll()", function(){

            var em1 = new O.EventsManager();
            var em2 = new O.EventsManager();
            var em3 = new O.EventsManager();

            em1.listenTo(em2, "first", function(){});
            em1.listenOnce(em2, "second", function(){});
            em1.listenTo(em3, "first", function(){});
            em1.listenTo(em2, "last", function(){});

            it("should remove all listeners, their handlers and the related tasks", function(){

                em1.ignoreAll();
                assert.equal([0,0,0,0,0].toString(), [x.size(em1.__listeners), x.size(em2.__handlers), x.size(em2.__tasks), x.size(em3.__handlers), x.size(em3.__tasks)].toString());

            });

            it("should return this to make chaining possible", function(){

                assert.equal(em, em.ignoreAll());

            });

        });

        describe("destroy()", function(){

            var em = new O.EventsManager();

            it("should run an offAll()", function(){

                var em = new O.EventsManager();
                em.on("beforeDestroy", function(){});
                em.on("beforeDestroy", function(){});
                em.on("beforeDestroy", function(){});
                em.destroy();

                assert.equal([0,0].toString(), [x.size(em.__handlers), x.size(em.__tasks)].toString());

            });

            it("should run an ignoreAll()", function(){

                var em1 = new O.EventsManager();
                var em2 = new O.EventsManager();
                em1.listenTo(em2, "beforeDestroy", function(){});
                em1.listenTo(em2, "beforeDestroy", function(){});
                em1.listenTo(em2, "beforeDestroy", function(){});
                em1.destroy();

                assert.equal(0, x.size(em1.__listeners));

            });

            it("should return \"this\" to make the chaining possible (why???)", function(){

                assert.equal(em, em.destroy());

            });

        });

    });

    describe("RelationsManager", function(){

        it("should instantiate an object instance of EventsManager", function(){

            var rm = new O.RelationsManager();
            assert.equal(true, rm instanceof O.EventsManager);

        });

        it("should instantiate an object containing the properties \"__commands\" and \"__answers\"", function(){

            var rm = new O.RelationsManager();
            assert.equal([false,false].toString(), [x.isUndefined(rm.__commands), x.isUndefined(rm.__answers)].toString());

        });

        describe("command()", function(){

            it("should create a command inside the property \"__commands\" and relative task", function(){

                var rm = new O.RelationsManager();
                rm.command("doIt", function(){});

                assert.equal([false,false].toString(), [x.isUndefined(rm.__commands["doIt"]), x.isUndefined(rm.__tasks[0])].toString());

            });

            it("should overwrite, if it exists, the task registered with the same name as the one passed as an argument and should create a task for this new command", function(){

                var rm = new O.RelationsManager();
                rm.command("doIt", function(){});
                rm.command("doIt", function(){});

                assert.equal([false,true,false].toString(), [x.isUndefined(rm.__commands["doIt"]), x.isUndefined(rm.__tasks[0]), x.isUndefined(rm.__tasks[1])].toString())

            });

            it("should return this to make chaining possible", function(){

                var rm = new O.RelationsManager();
                assert.equal(rm, rm.command("doIt", function(){}));

            });

        });

        describe("answer()", function(){

            it("should create a answer inside the property \"__answers\" and relative task", function(){

                var rm = new O.RelationsManager();
                rm.answer("myName", function(){});

                assert.equal([false,false].toString(), [x.isUndefined(rm.__answers["myName"]), x.isUndefined(rm.__tasks[0])].toString());

            });

            it("should overwrite, if it exists, the task registered with the same name as the one passed as an argument and should create a task for this new answer", function(){

                var rm = new O.RelationsManager();
                rm.answer("myName", function(){});
                rm.answer("myName", function(){});

                assert.equal([false,true,false].toString(), [x.isUndefined(rm.__answers["myName"]), x.isUndefined(rm.__tasks[0]),x.isUndefined(rm.__tasks[1])].toString());

            });

            it("should return this to make chaining possible", function(){

                var rm = new O.RelationsManager();
                assert.equal(rm, rm.answer("doIt", function(){}));

            });

        });

        describe("dismiss()", function(){

            it("should delete the specified command and its task", function(){

                var rm = new O.RelationsManager();
                rm.command("doIt", function(){});
                rm.dismiss("doIt");

                assert.equal([true,true].toString(), [x.isUndefined(rm.__commands["doIt"]), x.isUndefined(rm.__tasks[0])].toString());

            });

            it("should return this to make chaining possible", function(){

                var rm = new O.RelationsManager();
                rm.command("doIt", function(){});
                assert.equal(rm, rm.dismiss("doIt"));

            });

        });

        describe("dismissAll()", function(){

            it("should delete all commands and their task", function(){

                var rm = new O.RelationsManager();
                rm.command("first", function(){});
                rm.command("second", function(){});
                rm.command("third", function(){});
                rm.dismissAll();

                assert.equal([0,0].toString(), [x.size(rm.__commands), x.size(rm.__tasks)].toString());

            });

            it("should return this to make chaining possible", function(){

                var rm = new O.RelationsManager();
                assert.equal(rm, rm.dismissAll());

            });

        });

        describe("shut()", function(){

            it("should delete the specified answer and its task", function(){

                var rm = new O.RelationsManager();
                rm.answer("myName", function(){});
                rm.shut("myName");

                assert.equal([true,true].toString(), [x.isUndefined(rm.__answers["myName"]), x.isUndefined(rm.__tasks[0])].toString());

            });

            it("should return this to make chaining possible", function(){

                var rm = new O.RelationsManager();
                rm.answer("myName", function(){});
                assert.equal(rm, rm.shut("myName"));

            });

        });

        describe("shutAll()", function(){

            it("should delete all answers their task", function(){

                var rm = new O.RelationsManager();
                rm.answer("first", function(){});
                rm.answer("second", function(){});
                rm.answer("third", function(){});
                rm.shutAll();

                assert.equal([0,0].toString(), [x.size(rm.__answers), x.size(rm.__tasks)].toString());

            });

            it("should return this to make chaining possible", function(){

                var rm = new O.RelationsManager();
                assert.equal(rm, rm.shutAll());

            });

        });

        describe("execute()", function(){

            it("should run the specified command passing all arguments", function(){

                var count1 = 1;
                var count2 = 2;
                var count3 = 3;
                var rm = new O.RelationsManager();
                rm.command("first", function(c1, c2, c3){

                    assert.equal([1,2,3].toString(), [count1,count2,count3].toString());

                });
                rm.execute("first", count1, count2, count3);


            });

            it("should return this to make chaining possible", function(){

                var rm = new O.RelationsManager();
                rm.command("returnThis", function(){});
                assert.equal(rm, rm.execute("returnThis"));

            });

        });

        describe("ask()", function(){

            it("should run the specified answer passing all arguments", function(){

                var count1 = 1;
                var count2 = 2;
                var count3 = 3;
                var rm = new O.RelationsManager();
                rm.answer("myName", function(c1, c2, c3){

                    assert.equal([1,2,3].toString(), [count1,count2,count3].toString());

                });
                rm.ask("myName", count1, count2, count3);


            });

            it("should return the value you asked for", function(){

                var rm = new O.RelationsManager();
                rm.answer("myName", function(){return "Weisse"});
                assert.equal("Weisse", rm.ask("myName"));

            });

        });

    });

});
