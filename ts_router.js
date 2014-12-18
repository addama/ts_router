var Router = {
	// Inspiration: http://joakimbeng.eu01.aws.af.cm/a-javascript-router-in-20-lines/
	// Router will interpret the hash path (url/#/this/path/here) and attempt to find an element
	// (most likely a <script> element) with a ts-route attribute that matches the first argument
	// It will then replace the information in that selected element into the target element
	
	// Can be retooled to use jQuery or salt.js $() selector, but I have included a function that
	// performs the attribute selection without these
	
	target: 'applicationRoot',
	binding: 'ts-route',
	verbose: false,
	arguments: {},
	handlers: {},
	
	getByAttribute: function(attribute, value, context) {
		var elements = (context || document).getElementsByTagName('*');
		var result = [];
		var i = 0;
		var element = null;

		while (element = elements[i++]) {
			if (element.getAttribute(attribute) && element.getAttribute(attribute) === value) result.push(element);
		}
		return result;
	},
	
	init: function(target, binding, isVerbose) {
		// Get some new settings if they are supplied. We assume that they have default values
		// already set above
		if (typeof isVerbose === 'boolean') this.verbose = isVerbose; 
		if (typeof binding === 'string') this.binding = binding; 

		if (typeof target == 'undefined' || target == '') {
			if (this.verbose) console.debug('Router defaulting to "' + this.target + '" for target element ID');
		} else {
			this.target = target;
		}
		
		// Empty the args parameter, just in case
		this.arguments = {};
		
		// Set up routing
		this.startRouting();
	},
	
	router: function() {
		// Set up our output element, and parse the hash to find our path and any additional arguments
		var app = Router;
		var target = document.getElementById(app.target);	// $(Router.target);
		if(typeof target === 'undefined' || target === '') {
			console.debug('Router could not find the target element "' + app.target + '"');
		} else {
			var url = (location.hash.slice(1) || '/').split('/');
			url.shift();

			if (url.length >= 1 && url[0] !== '') {
				var origin = app.getByAttribute(app.binding, url[0])[0];		// $('['+ Router.binding +'=' + url[0] + ']')[0];
				if (origin !== undefined) {
					// Save the secondary paths as arguments that each route can interpret (or ignore) how it needs to
					app.arguments = url;
					
					// If there are handlers assigned to this route, we'll run those in  the order they were registered in
					// Each function is passed the hash path as an array of strings that it can use or ignore
					if (typeof app.handlers[url[0]] === 'object' && app.handlers[url[0]].length > 0) {
						for (func in app.handlers[url[0]]) {
							app.handlers[url[0]][func](app.arguments);
						}
					}
					
					// Swap content based on the path
					target.innerHTML = origin.innerHTML;
				} else {
					console.debug('Router could not find given route "' + url[0] + '"; ignoring');
				}
			} else {
				console.debug('Router found no applicable routes; page will not change until a good route is given');
			}
		}
	},
	
	startRouting: function() {
		// Set up listeners on hashchange and page load
		window.onhashchange = Router.router;
		//$(window).on('load', this.router());
		window.onload = Router.router();
		return true;
	},	
	
	registerHandler: function(route, func) {
		// Registers a handler function to be executed whenever a route is activated
		// Multiple handlers can be registered, and will be executed in the order in which they were registered
		// Handlers will be given the split up hash path URL as an array, so hopefully you're prepared for that  
		if (typeof route !== 'string' || route === '') {
			console.debug('Router.registerHandler() missing or bad parameter 1: route; this should be the name of the route the handler will be bound to');
			return false;
		}
		
		if (typeof func !== 'function' || func === '') {
			console.debug('Router.registerHandler() missing or bad argument 2: func; this should be a function that will be executed whenever the given route is found');
			return false;
		}
		
		this.handlers[route] = this.handlers[route] || [];
		this.handlers[route].push(func);
		if (this.verbose) console.debug('Router.registerHandler() registered new handler for route ' + route + '; total handlers: ' + this.handlers[route].length );
		
		return true;
	}
}
