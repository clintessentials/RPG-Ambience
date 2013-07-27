// This file is part of RPG Ambience
// Copyright 2012-2013 Jakob Kallin
// License: GNU GPL (http://www.gnu.org/licenses/gpl-3.0.txt)

'use strict';

Ambience.TaskQueue = function(limit) {
	var inLine = new List();
	var inProgress = new List();
	
	this.add = function(task) {
		return add(task, 'push');
	};
	
	this.prepend = function(task) {
		return add(task, 'unshift');
	};
	
	function add(task, methodName) {
		var deferred = when.defer();
		deferred.task = task;
		
		if ( inProgress.length < limit ) {
			execute(deferred);
		} else {
			inLine[methodName](deferred);
		}
		
		return deferred.promise;
	}
	
	function execute(deferred) {
		inProgress.push(deferred);
		
		// We want this to be async so that .
		setTimeout(function() {
			deferred.task()
			.then(deferred.resolve, deferred.reject, deferred.notify)
			.ensure(function() {
				onDeferredCompleted(deferred)
			});
		}, 0);
	}
	
	function onDeferredCompleted(deferred) {
		inProgress.remove(deferred);
		var nextDeferred = inLine.shift();
		if ( nextDeferred ) {
			execute(nextDeferred);
		}
	}
};