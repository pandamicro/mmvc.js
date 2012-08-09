// Callback Class
var Callback = function(func, caller) {
    if(typeof func != "function") {
        console.error('Fail to initialize a Callback object: except first parameter to be a function');
        return;
    }
    
	this.func = func;
	this.caller = caller;
	this.args = null;
	
	// Arguments to be passed in the function when the callback is invoked
	if(arguments.length > 2) {
		this.args = new Array();
		for(var i = 2; i < arguments.length; i++)
			this.args.push(arguments[i]);
	}
	
	// Init futur possible variables
	// Linked Callbacks list
	this.linked = null;
};
Callback.prototype = {
    // Any other callback can be linked to one callback, they will be called after its invokation
    link: function(cb) {
        // Accept only callback type object
        if(!(cb instanceof Callback)) return;
        
        // Lazy initialize of linked array
    	if(!this.linked) this.linked = new Array();
    	
    	this.linked.push(cb);
    },
    invoke: function() {
        // Arguments array
    	var arr = null;
    	
    	// Additional arguments passed in invokation will be add to the end of original arguments array
    	if(this.args) arr = (arguments.length>0 ? this.args.concat(Array.prototype.slice.call(arguments)) : this.args);
    	// No original arguments, then take directly the arguments in invokation
    	else if(!this.args && arguments.length>0) var arr = arguments;
    	
    	// Call function of callback
    	this.func.apply(this.caller, arr);
    	
    	// Invoke linked callback
    	if(this.linked) {
    		for(var i in this.linked) this.linked[i].invoke();
    	}
    }
};


// Mini MVC architecture implemented with Observer pattern
var mmvc = (function(){
    // Observe function for model object
    var observe = function(variable, callback) {
    
        // Initialization of listeners array
        if(!this._mmvclisteners[variable]) {
            // Setter function existe already, ignore this variable, in all case, notify function can be called manully after a modification of variable
            if(this['set'+variable]) {
                console.error("Fail to define the setter function of "+variable);
                return;
            }
        
            this._mmvclisteners[variable] = [];
        
            // Basic setter function is constructed with 'set' + variable name
            eval("this.set"+variable+" = function(value) {this."+variable+" = value; this.notify('"+variable+"', value);}");
        }
        
        // Add observer callback into the listeners list indexed with variable name
        this._mmvclisteners[variable].push(callback);
    };
    
    // Notify function for model object, this function is called automatically by variable setter function
    var notify = function(variable, value) {
        // Invoke all listeners' callback
        var ls = this._mmvclisteners[variable];
        for(var i = 0; i < ls.length; ++i)
            ls[i].invoke(value);
    };
    
    var addObservableVars = function(vars) {
        // vars must be an Array of variables' name
        if(!(vars instanceof Array)) return;
        
        for(var i = 0; i < vars.length; ++i) {
            var variable = vars[i];
            // Setter function existe already, ignore this variable, in all case, notify function can be called manully after a modification of variable
            if(this['set'+variable]) {
                console.error("Fail to define the setter function of "+variable);
                continue;
            }
            
            // Initialization of listeners array
            if(!this._mmvclisteners[variable]) {
                this._mmvclisteners[variable] = [];
                // Basic setter function is constructed with 'set' + variable name
                eval("this.set"+variable+" = function(value) {this."+variable+" = value; this.notify('"+variable+"', value);}");
            }
        }
    };
    
    return {
        // This function can make a javascript Object a mmvc model, in which some variable predefined can be observed by any Callback object( which can simulate an internal function invokation environment of an object )
        makeModel: function(model) {
            // Model must be an Object
            if(!(model instanceof Object)) 
                return;
                
            // Check existance of notify and observe function in model
            if(model.notify || model.observe || model.addObservableVars) {
                console.error("Model has his own observe, notify and/or addObservableVars method");
                return;
            }
            
            // Init listeners' list, observe and notify function for model
            model._mmvclisteners = {};
            model.observe = observe;
            model.notify = notify;
            model.addObservableVars = addObservableVars;
        }
    };
}());