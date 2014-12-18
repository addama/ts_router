ts_router
=========

Simple hash path router with basic argument/variable checking and user-defined binding, target, and handlers.

Usage
=====

Initialize the router with <pre>Router.init(String TARGET_ELEMENT, String BINDING, Bool ISVERBOSE)</pre>

For example, <pre>Router.init('applicationRoot', 'ts-route', true)</pre>

This would correspond to an HTML setup like this: 
<pre>
&lt;div id='applicationRoot'&gt;Nothing yet&lt;/div&gt;
&lt;script type='text/html' ts-route='banana'&gt;...&lt;/script&gt;
&lt;script type='text/html' ts-route='ducks'&gt;...&lt;/script&gt;
</pre>

Handler functions can be bound to routes, which will be executed in the order they were added. You do this by using <pre>Router.registerHandler(String ROUTE, Function FUNC)</pre>. 

Routes can have as many handlers as you'd like to preprocess data, prep the elements in the new content, or whatever. Each handler is given the hash path as an array of arguments for it to use or discard. For example, <em>url/#/banana/arg1/arg2/arg3</em> will mean that every handler assigned to the 'banana' route will be passed <strong>['banana', 'arg1', 'arg2', 'arg3']</strong>

If you bind a function to a route that has no corresponding content, that function will never run.

Handlers can be bound at any time, but it's probably best to bind them before calling Router.init() so that they are available immediately.

Possible Issues, probably
=========================

There is no input checking on the hash path just yet. It will probably error if you try something like <em>url/#/$banana/&ducks</em>. Nothing untoward would happen - it would most likely just fail on that particular route and complain to the console.

Future Work, maybe
==================

* Build a list of routes by looking for all elements that have the binding attribute assigned to them. This would provide a better error-checking structure instead of just taking any path or registering any handler and trusting that the route specified actually exists.
* Some actual error handling, because, you know, that's what you do.
* Support for compound path arguments, like <em>url/#/name:george/age:23</em>. Would that even be useful? Probably not, but it would greatly expand the script's capabilities
