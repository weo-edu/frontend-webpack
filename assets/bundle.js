/******/ (function(modules) { // webpackBootstrap
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(callback) { // eslint-disable-line no-unused-vars
/******/ 		if(typeof XMLHttpRequest === "undefined")
/******/ 			return callback(new Error("No browser support"));
/******/ 		try {
/******/ 			var request = new XMLHttpRequest();
/******/ 			var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 			request.open("GET", requestPath, true);
/******/ 			request.timeout = 10000;
/******/ 			request.send(null);
/******/ 		} catch(err) {
/******/ 			return callback(err);
/******/ 		}
/******/ 		request.onreadystatechange = function() {
/******/ 			if(request.readyState !== 4) return;
/******/ 			if(request.status === 0) {
/******/ 				// timeout
/******/ 				callback(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 			} else if(request.status === 404) {
/******/ 				// no update available
/******/ 				callback();
/******/ 			} else if(request.status !== 200 && request.status !== 304) {
/******/ 				// other failure
/******/ 				callback(new Error("Manifest request to " + requestPath + " failed."));
/******/ 			} else {
/******/ 				// success
/******/ 				try {
/******/ 					var update = JSON.parse(request.responseText);
/******/ 				} catch(e) {
/******/ 					callback(e);
/******/ 					return;
/******/ 				}
/******/ 				callback(null, update);
/******/ 			}
/******/ 		};
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "4e0f051539ce8d901d31"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					if(me.children.indexOf(request) < 0)
/******/ 						me.children.push(request);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				fn[name] = __webpack_require__[name];
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId, callback) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			__webpack_require__.e(chunkId, function() {
/******/ 				try {
/******/ 					callback.call(null, fn);
/******/ 				} finally {
/******/ 					finishChunkLoading();
/******/ 				}
/******/ 	
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback;
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback;
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 				else
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailibleFilesMap = {};
/******/ 	var hotCallback;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply, callback) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		if(typeof apply === "function") {
/******/ 			hotApplyOnUpdate = false;
/******/ 			callback = apply;
/******/ 		} else {
/******/ 			hotApplyOnUpdate = apply;
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 		hotSetStatus("check");
/******/ 		hotDownloadManifest(function(err, update) {
/******/ 			if(err) return callback(err);
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				callback(null, null);
/******/ 				return;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotAvailibleFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			for(var i = 0; i < update.c.length; i++)
/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			hotCallback = callback;
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var callback = hotCallback;
/******/ 		hotCallback = null;
/******/ 		if(!callback) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate, callback);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			callback(null, outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options, callback) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		if(typeof options === "function") {
/******/ 			callback = options;
/******/ 			options = {};
/******/ 		} else if(options && typeof options === "object") {
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		} else {
/******/ 			options = {};
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function getAffectedStuff(module) {
/******/ 			var outdatedModules = [module];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice();
/******/ 			while(queue.length > 0) {
/******/ 				var moduleId = queue.pop();
/******/ 				var module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return new Error("Aborted because of self decline: " + moduleId);
/******/ 				}
/******/ 				if(moduleId === 0) {
/******/ 					return;
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push(parentId);
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return [outdatedModules, outdatedDependencies];
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				var moduleId = toModuleId(id);
/******/ 				var result = getAffectedStuff(moduleId);
/******/ 				if(!result) {
/******/ 					if(options.ignoreUnaccepted)
/******/ 						continue;
/******/ 					hotSetStatus("abort");
/******/ 					return callback(new Error("Aborted because " + moduleId + " is not accepted"));
/******/ 				}
/******/ 				if(result instanceof Error) {
/******/ 					hotSetStatus("abort");
/******/ 					return callback(result);
/******/ 				}
/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 				addAllToSet(outdatedModules, result[0]);
/******/ 				for(var moduleId in result[1]) {
/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
/******/ 						if(!outdatedDependencies[moduleId])
/******/ 							outdatedDependencies[moduleId] = [];
/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(var i = 0; i < outdatedModules.length; i++) {
/******/ 			var moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			var moduleId = queue.pop();
/******/ 			var module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(var j = 0; j < disposeHandlers.length; j++) {
/******/ 				var cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(var j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				var idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					var dependency = moduleOutdatedDependencies[j];
/******/ 					var idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(var moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(var i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					var dependency = moduleOutdatedDependencies[i];
/******/ 					var cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(var i = 0; i < callbacks.length; i++) {
/******/ 					var cb = callbacks[i];
/******/ 					try {
/******/ 						cb(outdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			var moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else if(!error)
/******/ 					error = err;
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return callback(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		callback(null, outdatedModules);
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/assets/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(59);
	module.exports = __webpack_require__(88);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Modules
	 */
	
	var isObject = __webpack_require__(11)
	var isArray = __webpack_require__(37)
	var forEachObj = __webpack_require__(33)
	var forEachArr = __webpack_require__(32)
	
	/**
	 * Expose foreach
	 */
	
	module.exports = forEach['default'] = forEach
	
	/**
	 * For each
	 * @param  {Function} fn  iterator
	 * @param  {Object}   obj object to iterate over
	 */
	
	function forEach (fn, a) {
	  if (isArray(a)) return forEachArr.call(this, fn, a)
	  if (isObject(a)) return forEachObj.call(this, fn, a)
	}


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.actions = exports.element = undefined;
	
	var _actions = __webpack_require__(7);
	
	var actions = _interopRequireWildcard(_actions);
	
	var _update = __webpack_require__(86);
	
	var _update2 = _interopRequireDefault(_update);
	
	var _create = __webpack_require__(20);
	
	var _create2 = _interopRequireDefault(_create);
	
	var _element = __webpack_require__(85);
	
	var _element2 = _interopRequireDefault(_element);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	/**
	 * Virtex
	 */
	
	/**
	 * Imports
	 */
	
	function virtex(effect) {
	  return {
	    create: (0, _create2.default)(effect),
	    update: (0, _update2.default)(effect)
	  };
	}
	
	/**
	 * Exports
	 */
	
	exports.default = virtex;
	exports.element = _element2.default;
	exports.actions = actions;

/***/ },
/* 3 */
/***/ function(module, exports) {

	/**
	 * Expose isString
	 */
	
	module.exports = isString['default'] = isString
	
	/**
	 * Check if string
	 * @param  {Mixed}  value
	 * @return {Boolean}
	 */
	function isString (value) {
	  return typeof value === 'string'
	}


/***/ },
/* 4 */
/***/ function(module, exports) {

	/**
	 * Expose isUndefined
	 */
	
	module.exports = isUndefined['default'] = isUndefined
	
	/**
	 * Check if undefined.
	 * @param  {Mixed}  value
	 * @return {Boolean}
	 */
	
	function isUndefined (value) {
	  return typeof value === 'undefined'
	}


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _element = __webpack_require__(17);
	
	var _element2 = _interopRequireDefault(_element);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function render() {
	  return (0, _element2.default)(
	    'div',
	    null,
	    'Hello world'
	  );
	}
	
	exports.default = render;

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	function reducer(state, action) {
	  return state;
	}
	
	exports.default = reducer;

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * Action types
	 */
	
	var types = {
	  CREATE_NODE: 'CREATE_NODE',
	  UPDATE_NODE: 'UPDATE_NODE',
	  REPLACE_NODE: 'REPLACE_NODE',
	  REMOVE_NODE: 'REMOVE_NODE',
	  INSERT_NODE: 'INSERT_NODE',
	  CREATE_THUNK: 'CREATE_THUNK',
	  UPDATE_THUNK: 'UPDATE_THUNK',
	  DESTROY_THUNK: 'DESTROY_THUNK'
	};
	
	/**
	 * Action creators for effectful things
	 */
	
	function vnodeAction(type) {
	  return function (vnode, prev) {
	    return {
	      type: type,
	      vnode: vnode,
	      prev: prev
	    };
	  };
	}
	
	var createThunk = vnodeAction(types.CREATE_THUNK);
	var updateThunk = vnodeAction(types.UPDATE_THUNK);
	var destroyThunk = vnodeAction(types.DESTROY_THUNK);
	var updateNode = vnodeAction(types.UPDATE_NODE);
	var replaceNode = vnodeAction(types.REPLACE_NODE);
	var removeNode = vnodeAction(types.REMOVE_NODE);
	
	function createNode(vnode, children) {
	  return {
	    type: types.CREATE_NODE,
	    vnode: vnode,
	    children: children
	  };
	}
	
	function insertNode(vnode, newVnode, pos) {
	  return {
	    type: types.INSERT_NODE,
	    vnode: vnode,
	    newVnode: newVnode,
	    pos: pos
	  };
	}
	
	/**
	 * Exports
	 */
	
	exports.createNode = createNode;
	exports.insertNode = insertNode;
	exports.updateNode = updateNode;
	exports.replaceNode = replaceNode;
	exports.removeNode = removeNode;
	exports.createThunk = createThunk;
	exports.updateThunk = updateThunk;
	exports.destroyThunk = destroyThunk;
	exports.types = types;

/***/ },
/* 8 */
/***/ function(module, exports) {

	/**
	 * Expse equal
	 */
	
	module.exports = equal['default'] = equal
	
	/**
	 * Check if two arrays are equal.
	 * @param  {Array} a array 1
	 * @param  {Array} b array 2
	 * @return {Boolean}
	 */
	
	function equal (a, b) {
	  var aLen = a.length
	  var bLen = b.length
	
	  if (aLen === bLen) {
	    for (var i = 0; i < aLen; ++i) {
	      if (a[i] !== b[i]) {
	        return false
	      }
	    }
	
	    return true
	  }
	
	  return false
	}


/***/ },
/* 9 */
/***/ function(module, exports) {

	/**
	 * domEvents
	 */
	
	var domEvents = [
	  'abort',
	  'animationend',
	  'animationiteration',
	  'animationstart',
	  'blur',
	  'canplay',
	  'canplaythrough',
	  'change',
	  'click',
	  'contextmenu',
	  'copy',
	  'cut',
	  'dblclick',
	  'drag',
	  'dragend',
	  'dragenter',
	  'dragexit',
	  'dragleave',
	  'dragover',
	  'dragstart',
	  'drop',
	  'durationchange',
	  'emptied',
	  'encrypted',
	  'ended',
	  'error',
	  'focus',
	  'focusin',
	  'focusout',
	  'input',
	  'invalid',
	  'keydown',
	  'keypress',
	  'keyup',
	  'load',
	  'loadeddata',
	  'loadedmetadata',
	  'loadstart',
	  'mousedown',
	  'mouseenter',
	  'mouseleave',
	  'mousemove',
	  'mouseout',
	  'mouseover',
	  'mouseup',
	  'paste',
	  'pause',
	  'play',
	  'playing',
	  'progress',
	  'ratechange',
	  'reset',
	  'resize',
	  'scroll',
	  'seeked',
	  'seeking',
	  'select',
	  'stalled',
	  'submit',
	  'suspend',
	  'timeupdate',
	  'touchcancel',
	  'touchend',
	  'touchmove',
	  'touchstart',
	  'transitionend',
	  'unload',
	  'volumechange',
	  'waiting',
	  'wheel'
	]
	
	/**
	 * Expose domEvents
	 */
	
	module.exports = domEvents


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Modules
	 */
	
	var isString = __webpack_require__(3)
	
	/**
	 * Expose getProp
	 */
	
	module.exports = getProp['default'] = getProp
	
	/**
	 * Get propert
	 * @param  {Array|String} path path to property
	 * @param  {Object} obj object to retrieve property from
	 * @return {Mixed} property
	 */
	
	function getProp (path, obj) {
	  if (isString(path)) {
	    path = path.split('.')
	  }
	
	  for (var i = 0, len = path.length; i < len && obj; ++i) {
	    obj = obj[path[i]]
	  }
	
	  return obj
	}


/***/ },
/* 11 */
/***/ function(module, exports) {

	/**
	 * Expose isObject
	 */
	
	module.exports = isObject
	
	/**
	 * Constants
	 */
	
	var objString = toString(Object)
	
	/**
	 * Check for plain object.
	 *
	 * @param {Mixed} val
	 * @return {Boolean}
	 * @api private
	 */
	
	function isObject (val) {
	  return !!val && (val.constructor === Object || toString(val.constructor) === objString)
	}
	
	function toString (val) {
	  return Function.prototype.toString.call(val)
	}


/***/ },
/* 12 */
/***/ function(module, exports) {

	/**
	 * objectEqual
	 */
	
	function objectEqual (a, b) {
	  var aKeys = Object.keys(a)
	  var bKeys = Object.keys(b)
	  var aLen = aKeys.length
	  var bLen = bKeys.length
	
	  if (aLen === bLen) {
	    for (var i = 0; i < aLen; ++i) {
	      var key = aKeys[i]
	
	      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key) || a[key] !== b[key]) {
	        return false
	      }
	    }
	
	    return true
	  }
	
	  return false
	}
	
	/**
	 * Exports
	 */
	
	module.exports = objectEqual


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Modules
	 */
	
	var clone = __webpack_require__(25)
	var isFunction = __webpack_require__(39)
	var isString = __webpack_require__(3)
	var isNumber = __webpack_require__(40)
	
	/**
	 * Expose setProp
	 */
	
	module.exports = setProp['default'] = setProp
	
	/**
	 * setProp
	 */
	
	function setProp (path, obj, value) {
	  // Fast-path single key array paths
	  if (isNumber(path)) return set(obj, path, value)
	  if (isString(path)) path = path.split('.')
	
	  return setPropInternal(path, obj, value, 0)
	}
	
	function setPropInternal (path, obj, value, idx) {
	  if (path.length === idx) {
	    return value
	  }
	
	  // Create things as we go down if they don't exist
	  obj = obj || {}
	
	  var key = path[idx]
	  return set(obj, key, setPropInternal(path, obj[key], value, ++idx))
	}
	
	function set (obj, key, value) {
	  var newObj = clone(obj)
	  newObj[key] = isFunction(value) ? value(obj[key]) : value
	  return newObj
	}


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Modules
	 */
	
	var canSelectText = __webpack_require__(22)
	
	/**
	 * Expose setValue
	 */
	
	module.exports = setValue['default'] = setValue
	
	/**
	 * setValue
	 */
	
	function setValue (node, value) {
	  if (node.ownerDocument.activeElement === node && canSelectText(node)) {
	    var start = node.selectionStart
	    var end = node.selectionEnd
	    node.value = value
	    node.setSelectionRange(start, end)
	  } else {
	    node.value = value
	  }
	}


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var OneVersionConstraint = __webpack_require__(67);
	
	var MY_VERSION = '7';
	OneVersionConstraint('ev-store', MY_VERSION);
	
	var hashKey = '__EV_STORE_KEY@' + MY_VERSION;
	
	module.exports = EvStore;
	
	function EvStore(elem) {
	    var hash = elem[hashKey];
	
	    if (!hash) {
	        hash = elem[hashKey] = {};
	    }
	
	    return hash;
	}


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
	                                                                                                                                                                                                                                                                   * Imports
	                                                                                                                                                                                                                                                                   */
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.destroyEphemeral = exports.createEphemeral = exports.toEphemeral = undefined;
	
	var _getProp = __webpack_require__(10);
	
	var _getProp2 = _interopRequireDefault(_getProp);
	
	var _setProp = __webpack_require__(13);
	
	var _setProp2 = _interopRequireDefault(_setProp);
	
	var _omitProp = __webpack_require__(46);
	
	var _omitProp2 = _interopRequireDefault(_omitProp);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	/**
	 * Action types
	 */
	
	var CREATE = 'CREATE_EPHEMERAL';
	var DESTROY = 'DESTROY_EPHEMERAL';
	
	/**
	 * Ephemeral state reducer
	 */
	
	function ephemeralReducer() {
	  var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	  var action = arguments[1];
	  var _action$meta$ephemera = action.meta.ephemeral;
	  var reducer = _action$meta$ephemera.reducer;
	  var key = _action$meta$ephemera.key;
	
	  switch (action.type) {
	    case CREATE:
	      return (0, _setProp2.default)(key, state, action.payload);
	    case DESTROY:
	      return (0, _omitProp2.default)(key, state);
	    default:
	      var newState = reducer((0, _getProp2.default)(key, state), action);
	      return (0, _setProp2.default)(key, state, newState);
	  }
	
	  return state;
	}
	
	/**
	 * Action creators
	 */
	
	function toEphemeral(key, reducer, action) {
	  return _extends({}, action, {
	    meta: _extends({}, action.meta || {}, {
	      ephemeral: {
	        key: key,
	        reducer: reducer
	      }
	    })
	  });
	}
	
	function createEphemeral(key, initialState) {
	  return {
	    type: CREATE,
	    payload: initialState,
	    meta: {
	      ephemeral: { key: key }
	    }
	  };
	}
	
	function destroyEphemeral(key) {
	  return {
	    type: DESTROY,
	    meta: {
	      ephemeral: { key: key }
	    }
	  };
	}
	
	/**
	 * Mount reducer
	 */
	
	function mount(prop, reducer) {
	  return function (state, action) {
	    return isEphemeral(action) ? _extends({}, state, _defineProperty({}, prop, ephemeralReducer(state[prop] || {}, action))) : reducer(state, action);
	  };
	}
	
	function isEphemeral(action) {
	  return action.meta && action.meta.hasOwnProperty('ephemeral');
	}
	
	/**
	 * Exports
	 */
	
	exports.default = mount;
	exports.toEphemeral = toEphemeral;
	exports.createEphemeral = createEphemeral;
	exports.destroyEphemeral = destroyEphemeral;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Convenience for accessing element, so you can
	 * require('vdux/element')
	 */
	
	module.exports = __webpack_require__(83)


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _setValue = __webpack_require__(14);
	
	var _setValue2 = _interopRequireDefault(_setValue);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Remove an attribute from an element
	 */
	
	function removeAttribute(node, name) {
	  switch (name) {
	    case 'checked':
	    case 'disabled':
	    case 'selected':
	      node[name] = false;
	      break;
	    case 'innerHTML':
	      node.innerHTML = '';
	      break;
	    case 'value':
	      (0, _setValue2.default)(node, null);
	      break;
	    default:
	      node.removeAttribute(name);
	      break;
	  }
	}
	
	/**
	 * Exports
	 */
	
	/**
	 * Imports
	 */
	
	exports.default = removeAttribute;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _removeAttribute = __webpack_require__(18);
	
	var _removeAttribute2 = _interopRequireDefault(_removeAttribute);
	
	var _isValidAttr = __webpack_require__(42);
	
	var _isValidAttr2 = _interopRequireDefault(_isValidAttr);
	
	var _setAttribute = __webpack_require__(51);
	
	var _setAttribute2 = _interopRequireDefault(_setAttribute);
	
	var _setValue = __webpack_require__(14);
	
	var _setValue2 = _interopRequireDefault(_setValue);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Set an attribute on an element
	 */
	
	/**
	 * Imports
	 */
	
	function setAttribute(node, name, value) {
	  if (typeof value === 'function') {
	    value = value(node, name);
	  }
	
	  if ((0, _isValidAttr2.default)(value)) {
	    switch (name) {
	      case 'nodeValue':
	      case 'checked':
	      case 'disabled':
	      case 'selected':
	      case 'innerHTML':
	      case 'textContent':
	        node[name] = value;
	        break;
	      case 'value':
	        (0, _setValue2.default)(node, value);
	        break;
	      default:
	        (0, _setAttribute2.default)(node, name, value);
	        break;
	    }
	  } else {
	    (0, _removeAttribute2.default)(node, name);
	  }
	}
	
	/**
	 * Exports
	 */
	
	exports.default = setAttribute;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _util = __webpack_require__(21);
	
	var _mapArray = __webpack_require__(45);
	
	var _mapArray2 = _interopRequireDefault(_mapArray);
	
	var _actions = __webpack_require__(7);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Create the initial document fragment
	 */
	
	function create(effect) {
	  return function (vnode) {
	    var path = arguments.length <= 1 || arguments[1] === undefined ? '0' : arguments[1];
	    return createRecursive(vnode, path);
	  };
	
	  function createRecursive(vnode, path) {
	    vnode.path = path;
	
	    if ((0, _util.isThunk)(vnode)) {
	      return createRecursive(effect((0, _actions.createThunk)(vnode)), (0, _util.createPath)(vnode, path, 0));
	    }
	
	    var children = (0, _mapArray2.default)(function (child, i) {
	      return createRecursive(child, (0, _util.createPath)(child, path, i));
	    }, vnode.children);
	    return effect((0, _actions.createNode)(vnode, children));
	  }
	}
	
	/**
	 * Exports
	 */
	
	/**
	 * Imports
	 */
	
	exports.default = create;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getKey = exports.createPath = exports.isSameNode = exports.isThunk = undefined;
	
	var _isString = __webpack_require__(3);
	
	var _isString2 = _interopRequireDefault(_isString);
	
	var _isUndefined = __webpack_require__(4);
	
	var _isUndefined2 = _interopRequireDefault(_isUndefined);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Utilities
	 */
	
	/**
	 * Imports
	 */
	
	function isThunk(a) {
	  return !(0, _isString2.default)(a.type);
	}
	
	function isSameNode(a, b) {
	  return a.type === b.type;
	}
	
	function getKey(a) {
	  return a.key;
	}
	
	function createPath(vnode, path, pos) {
	  var key = getKey(vnode);
	  var part = (0, _isUndefined2.default)(key) ? pos : key;
	
	  return path + '.' + part;
	}
	
	/**
	 * Exports
	 */
	
	exports.isThunk = isThunk;
	exports.isSameNode = isSameNode;
	exports.createPath = createPath;
	exports.getKey = getKey;

/***/ },
/* 22 */
/***/ function(module, exports) {

	/**
	 * Modules
	 */
	
	/**
	 * Expose canSelectText
	 */
	
	module.exports = canSelectText['default'] = canSelectText
	
	/**
	 * Selectable element regex
	 */
	
	var selectable = /^text|search|password|tel|url$/
	
	/**
	 * canSelectText
	 */
	
	function canSelectText (node) {
	  return node.tagName === 'INPUT' && selectable.test(node.type)
	}


/***/ },
/* 23 */
/***/ function(module, exports) {

	/**
	 * Expose capitalize
	 */
	
	module.exports = capitalize
	
	/**
	 * capitalize
	 */
	
	function capitalize (str) {
	  return str[0].toUpperCase() + str.slice(1)
	}


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Modules
	 */
	
	var forEach = __webpack_require__(1)
	
	/**
	 * Expose cloneObj
	 */
	
	module.exports = cloneObj['default'] = cloneObj
	
	/**
	 * Clone an object.
	 * @param  {Object} obj Object to Clone
	 * @return {Object}
	 */
	
	function cloneObj (obj) {
	  var newObj = {}
	
	  forEach(function (val, key) {
	    newObj[key] = val
	  }, obj)
	
	  return newObj
	}


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Modules
	 */
	
	var cloneObj = __webpack_require__(24)
	
	/**
	 * Expose cloneShallow
	 */
	
	module.exports = cloneShallow['default'] = cloneShallow
	
	/**
	 * Clone object or array shallow
	 * @param  {Object|Array} a object to copy
	 * @return {Object|Array}
	 */
	
	function cloneShallow (a) {
	  return Array.isArray(a)
	    ? a.slice()
	    : cloneObj(a)
	}


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Modules
	 */
	
	var reduce = __webpack_require__(48)
	var identity = __webpack_require__(35)
	var slice = __webpack_require__(52)
	
	/**
	 * Expose compose
	 */
	
	module.exports = compose
	
	/**
	 * Accumulate function compositions.
	 * f . g . h ...
	 */
	
	function compose () {
	  var args = arguments
	  return reduce(
	    composeTwo,
	    args[0] || identity,
	    slice(args, 1, args.length)
	  )
	}
	
	/**
	 * Compose `f` with `g`
	 * f . g
	 */
	
	function composeTwo (f, g) {
	  return function () {
	    return f.call(null, g.apply(null, arguments))
	  }
	}


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Modules
	 */
	
	var isSvg = __webpack_require__(41)
	var svgNs = __webpack_require__(56)
	
	/**
	 * Expose createElement
	 */
	
	module.exports = createElement['default'] = createElement
	
	/**
	 * createElement
	 */
	
	function createElement (tag) {
	  return isSvg(tag)
	    ? document.createElementNS(svgNs, tag)
	    : document.createElement(tag)
	}


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Imports
	 */
	
	var forEach = __webpack_require__(1)
	
	/**
	 * defaults
	 */
	
	function defaults (obj, src) {
	  forEach(src, function (val, key) {
	    if (obj[key] === undefined) {
	      obj[key] = val
	    }
	  })
	
	  return obj
	}
	
	/**
	 * Exports
	 */
	
	module.exports = defaults


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Modules
	 */
	
	var isDomLoaded = __webpack_require__(38)
	
	/**
	 * Expose domready
	 */
	
	module.exports = domready
	
	/**
	 * Check whether the DOM is ready already, and setup
	 * a listener if necessary
	 */
	
	var loaded = isDomLoaded()
	var fns = []
	
	if (!loaded) {
	  document.addEventListener('DOMContentLoaded', function listener () {
	    document.removeEventListener('DOMContentLoaded', listener)
	    loaded = true
	    fns.forEach(function (fn) { fn() })
	    fns.length = 0
	  })
	}
	
	/**
	 * domready
	 */
	
	function domready (fn) {
	  loaded ? setTimeout(fn) : fns.push(fn)
	}


/***/ },
/* 30 */
/***/ function(module, exports) {

	/**
	 * Expose emptyElement
	 */
	
	module.exports = emptyElement
	
	/**
	 * emptyElement
	 */
	
	function emptyElement (el) {
	  var node
	
	  while (node = el.firstChild) {
	    el.removeChild(node)
	  }
	
	  return el
	}


/***/ },
/* 31 */
/***/ function(module, exports) {

	/**
	 * Expose focusElement
	 */
	
	module.exports = focusElement
	
	/**
	 * focusElement
	 */
	
	 function focusElement (node) {
	   if (node.ownerDocument.activeElement !== node) {
	     node.focus()
	   }
	 }


/***/ },
/* 32 */
/***/ function(module, exports) {

	/**
	 * Expose forEach
	 */
	
	module.exports = forEach['default'] = forEach
	
	/**
	 * forEach
	 */
	
	function forEach (fn, arr) {
	  if (!arr) return
	
	  for (var i = 0, len = arr.length; i < len; ++i) {
	    fn.call(this, arr[i], i)
	  }
	}


/***/ },
/* 33 */
/***/ function(module, exports) {

	/**
	 * Expose forEach
	 */
	
	module.exports = forEach['default'] = forEach
	
	/**
	 * forEach
	 */
	
	function forEach (fn, obj) {
	  if (!obj) return
	
	  var keys = Object.keys(obj)
	
	  for (var i = 0, len = keys.length; i < len; ++i) {
	    var key = keys[i]
	    fn.call(this, obj[key], key)
	  }
	}


/***/ },
/* 34 */
/***/ function(module, exports) {

	/**
	 * Expose has
	 */
	
	module.exports = has['default'] = has
	
	/**
	 * Vars
	 */
	
	var hasOwn = Object.prototype.hasOwnProperty
	
	/**
	 * has
	 */
	
	function has (prop, obj) {
	  return hasOwn.call(obj, prop)
	}


/***/ },
/* 35 */
/***/ function(module, exports) {

	/**
	 * Modules
	 */
	
	/**
	 * Expose identity
	 */
	
	module.exports = identity['default'] = identity
	
	/**
	 * A function that returns its first arg.
	 * @param  {Any} val
	 * @return {Any} val
	 */
	function identity (val) {
	  return val
	}


/***/ },
/* 36 */
/***/ function(module, exports) {

	/**
	 * Expose insertElement
	 */
	
	module.exports = insertElement['default'] = insertElement
	
	/**
	 * insertElement
	 */
	
	function insertElement (parent, node, pos) {
	  return parent.insertBefore(node, parent.childNodes[pos] || null)
	}


/***/ },
/* 37 */
/***/ function(module, exports) {

	/**
	 * Expose isArray
	 */
	
	module.exports = isArray['default'] = isArray
	
	/**
	 * isArray
	 */
	
	function isArray (val) {
	  return Array.isArray(val)
	}


/***/ },
/* 38 */
/***/ function(module, exports) {

	/**
	 * Expose isDomLoaded
	 */
	
	module.exports = isDomLoaded
	
	/**
	 * Ready states
	 */
	
	var readyStates = ['complete', 'loaded']
	
	if (!document.documentElement.doScroll) {
	  readyStates.push('interactive')
	}
	
	/**
	 * isDomLoaded
	 */
	
	function isDomLoaded () {
	  return readyStates.indexOf(document.readyState) !== -1
	}


/***/ },
/* 39 */
/***/ function(module, exports) {

	/**
	 * Modules
	 */
	
	/**
	 * Expose isFunction
	 */
	
	module.exports = isFunction['default'] = isFunction
	
	/**
	 * isFunction
	 */
	
	function isFunction (value) {
	  return typeof value === 'function'
	}


/***/ },
/* 40 */
/***/ function(module, exports) {

	/**
	 * Modules
	 */
	
	/**
	 * Expose isNumber
	 */
	
	module.exports = isNumber['default'] = isNumber
	
	/**
	 * isNumber
	 */
	
	function isNumber (value) {
	  return typeof value === 'number'
	}


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Modules
	 */
	
	var svgElements = __webpack_require__(55)
	var has = __webpack_require__(34)
	
	/**
	 * Expose isSvg
	 */
	
	module.exports = isSvg['default'] = isSvg
	
	/**
	 * Vars
	 */
	
	var svgMap = svgElements
	  .reduce(function (acc, name) {
	    acc[name] = true
	    return acc
	  }, {})
	
	/**
	 * isSvg
	 */
	
	function isSvg (name) {
	  return has(name, svgMap)
	}


/***/ },
/* 42 */
/***/ function(module, exports) {

	/**
	 * Expose isValidAttr
	 */
	
	module.exports = isValidAttr
	
	/**
	 * isValidAttr
	 */
	
	function isValidAttr (val) {
	  switch (typeof val) {
	    case 'string':
	    case 'number':
	      return true
	    case 'boolean':
	      return val
	    default:
	      return false
	  }
	}


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Modules
	 */
	
	var keycodes = __webpack_require__(44)
	
	/**
	 * Expose keychord
	 */
	
	module.exports = keychord['default'] = keychord
	
	/**
	 * keychord
	 */
	
	function keychord (e) {
	  var chord = []
	
	  if (e.ctrlKey) chord.push('ctrl')
	  if (e.altKey) chord.push('alt')
	  if (e.metaKey) chord.push('command')
	  if (e.shiftKey) chord.push('shift')
	
	  var name = keycodes[e.which]
	  if (chord.indexOf(name) === -1) {
	    chord.push(name)
	  }
	
	  return chord.join('+')
	}


/***/ },
/* 44 */
/***/ function(module, exports) {

	/**
	 * Expose keycodes
	 */
	
	var keycodes = module.exports = {
	  8: 'backspace',
	  9: 'tab',
	  13: 'enter',
	  16: 'shift',
	  17: 'ctrl',
	  18: 'alt',
	  19: 'pause',
	  20: 'caps_lock',
	  27: 'esc',
	  32: 'space',
	  33: 'page_up',
	  34: 'page_down',
	  35: 'end',
	  36: 'home',
	  37: 'left',
	  38: 'up',
	  39: 'right',
	  40: 'down',
	  45: 'insert',
	  46: 'delete',
	  91: 'command',
	  93: 'right_click',
	  106: 'numpad_*',
	  107: 'numpad_+',
	  109: 'numpad_-',
	  110: 'numpad_.',
	  111: 'numpad_/',
	  144: 'num_lock',
	  145: 'scroll_lock',
	  182: 'my_computer',
	  183: 'my_calculator',
	  186: ';',
	  187: '=',
	  188: ',',
	  189: '-',
	  190: '.',
	  191: '/',
	  192: '`',
	  219: '[',
	  220: '\\',
	  221: ']',
	  222: "'"
	}
	
	// lower case chars
	for (var i = 97; i < 123; i++) {
	  keycodes[i - 32] = String.fromCharCode(i)
	}
	
	// numbers
	for (var j = 48; j < 58; j++) {
	  keycodes[j] = j - 48
	}
	
	// function keys
	for (var k = 1; k < 13; k++) {
	  keycodes[k + 111] = 'f' + k
	}
	
	// numpad keys
	for (var l = 0; l < 10; l++) {
	  keycodes[l + 96] = 'numpad_' + l
	}


/***/ },
/* 45 */
/***/ function(module, exports) {

	/**
	 * Expose map
	 */
	
	module.exports = map['default'] = map
	
	/**
	 * Map array
	 * @param  {Function} fn
	 * @param  {Array} arr
	 * @return {Array}
	 */
	
	function map (fn, arr) {
	  var len = arr.length
	  var result = new Array(len)
	  var self = this
	
	  for (var i = 0; i < len; ++i) {
	    result[i] = fn.call(self, arr[i], i)
	  }
	
	  return result
	}


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Modules
	 */
	
	var omit = __webpack_require__(47)
	var setProp = __webpack_require__(13)
	
	/**
	 * Expose omitProp
	 */
	
	module.exports = omitProp['default'] = omitProp
	
	/**
	 * omitProp
	 */
	
	function omitProp (path, obj) {
	  if (typeof path === 'string') {
	    path = path.split('.')
	  }
	
	  if (path.length > 1) {
	    var subpath = path.slice(0, -1)
	    var key = path[path.length - 1]
	
	    return setProp(subpath, obj, function (obj) {
	      return omit(obj, key)
	    })
	  }
	
	  return omit(obj, key)
	}


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Imports
	 */
	
	var forEach = __webpack_require__(1)
	
	/**
	 * Object omit
	 */
	
	function omit (obj, keys, ctx) {
	  var result = {}
	
	  if (Array.isArray(keys)) {
	    forEach(obj, function (val, key) {
	      if (keys.indexOf(key) === -1) {
	        result[key] = val
	      }
	    })
	  } else if (typeof keys === 'function') {
	    forEach(obj, function (val, key) {
	      if (keys !== key) {
	        result[key] = val
	      }
	    })
	  } else {
	    forEach(obj, function (val, key) {
	      if (!keys.call(ctx, key)) {
	        result[key] = val
	      }
	    })
	  }
	
	  return result
	}
	
	/**
	 * Exports
	 */
	
	module.exports = omit


/***/ },
/* 48 */
/***/ function(module, exports) {

	/**
	 * Modules
	 */
	
	/**
	 * Expose reduceArray
	 */
	
	module.exports = reduceArray['default'] = reduceArray
	
	/**
	 * reduceArray
	 */
	
	function reduceArray (cb, init, arr) {
	  var len = arr.length
	  var acc = init
	  if (!arr.length) return init
	
	  for (var i = 0; i < len; i++) {
	    acc = cb(acc, arr[i], i, arr)
	  }
	
	  return acc
	}


/***/ },
/* 49 */
/***/ function(module, exports) {

	/**
	 * Expose removeElement
	 */
	
	module.exports = removeElement['default'] = removeElement
	
	/**
	 * removeElement
	 */
	
	function removeElement (node) {
	  return node.parentNode.removeChild(node)
	}


/***/ },
/* 50 */
/***/ function(module, exports) {

	/**
	 * Expose replaceElement
	 */
	
	module.exports = replaceElement['default'] = replaceElement
	
	/**
	 * replaceElement
	 */
	
	function replaceElement (newNode, oldNode) {
	  return oldNode.parentNode.replaceChild(newNode, oldNode)
	}


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Modules
	 */
	
	var svgAttributeNamespace = __webpack_require__(53)
	
	/**
	 * Expose setAttribute
	 */
	
	module.exports = setAttribute['default'] = setAttribute
	
	/**
	 * setAttribute
	 */
	
	function setAttribute (node, name, value) {
	  var ns = svgAttributeNamespace(name)
	  return ns
	    ? node.setAttributeNS(ns, name, value)
	    : node.setAttribute(name, value)
	}


/***/ },
/* 52 */
/***/ function(module, exports) {

	/**
	 * Vars
	 */
	
	var sliced = Array.prototype.slice
	
	/**
	 * Expose slice
	 */
	
	module.exports = slice['default'] = slice
	
	/**
	 * slice
	 */
	
	function slice (array, begin, end) {
	  return sliced.call(array, begin, end)
	}


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Modules
	 */
	
	var namespaces = __webpack_require__(54)
	
	/**
	 * Exports
	 */
	
	module.exports = svgAttributeNamespace['default'] = svgAttributeNamespace
	
	/**
	 * Get namespace of svg attribute
	 *
	 * @param {String} attributeName
	 * @return {String} namespace
	 */
	
	function svgAttributeNamespace (attributeName) {
	  // if no prefix separator in attributeName, then no namespace
	  if (attributeName.indexOf(':') === -1) return null
	
	  // get prefix from attributeName
	  var prefix = attributeName.split(':', 1)[0]
	
	  // if prefix in supported prefixes
	  if (namespaces.hasOwnProperty(prefix)) {
	    // then namespace of prefix
	    return namespaces[prefix]
	  } else {
	    // else unsupported prefix
	    throw new Error('svg-attribute-namespace: prefix "' + prefix + '" is not supported by SVG.')
	  }
	}


/***/ },
/* 54 */
/***/ function(module, exports) {

	/*
	 * Supported SVG attribute namespaces by prefix.
	 *
	 * References:
	 * - http://www.w3.org/TR/SVGTiny12/attributeTable.html
	 * - http://www.w3.org/TR/SVG/attindex.html
	 * - http://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-ElSetAttrNS
	 */
	
	var svgAttributeNamespaces = {
	  ev: 'http://www.w3.org/2001/xml-events',
	  xlink: 'http://www.w3.org/1999/xlink',
	  xml: 'http://www.w3.org/XML/1998/namespace',
	  xmlns: 'http://www.w3.org/2000/xmlns/'
	}
	
	/**
	 * Expose svgAttributeNamespaces
	 */
	
	module.exports = svgAttributeNamespaces


/***/ },
/* 55 */
/***/ function(module, exports) {

	/**
	 * svgElements
	 */
	
	var svgElements = 'animate circle defs ellipse g line linearGradient mask path pattern polygon polyline radialGradient rect stop svg text tspan'.split(' ')
	
	/**
	 * Expose svgElements
	 */
	
	module.exports = svgElements['default'] = svgElements


/***/ },
/* 56 */
/***/ function(module, exports) {

	/**
	 * Svg namespace
	 */
	
	var svgNamespace = 'http://www.w3.org/2000/svg'
	
	/**
	 * Expose svgNamespace
	 */
	
	module.exports = svgNamespace['default'] = svgNamespace


/***/ },
/* 57 */
/***/ function(module, exports) {

	/**
	 * Modules
	 */
	
	/**
	 * Expose toInlineStyle
	 */
	
	module.exports = toInlineStyle['default'] = toInlineStyle
	
	/**
	 * Vars
	 */
	
	var upperCasePattern = /([A-Z])/g
	
	/**
	 * toInlineStyle
	 */
	
	function toInlineStyle (style) {
	  var str = ''
	
	  for (var key in style) {
	    str += format(key, style[key])
	  }
	
	  return hyphenate(str)
	}
	
	/**
	 * Hyphenate a given `str`
	 */
	
	function hyphenate (str) {
	  return str.replace(upperCasePattern, dashLower)
	}
	
	function dashLower (c) {
	  return '-' + c.toLowerCase()
	}
	
	/**
	 * Format a css key, value pair to their respective string representation
	 */
	
	function format (key, value) {
	  return key + ':' + value + ';'
	}


/***/ },
/* 58 */
/***/ function(module, exports) {

	'use strict';
	module.exports = function () {
		return /(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/g;
	};


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _client = __webpack_require__(60);
	
	var _client2 = _interopRequireDefault(_client);
	
	var _domready = __webpack_require__(29);
	
	var _domready2 = _interopRequireDefault(_domready);
	
	var _element = __webpack_require__(17);
	
	var _element2 = _interopRequireDefault(_element);
	
	var _app = __webpack_require__(5);
	
	var _app2 = _interopRequireDefault(_app);
	
	var _reducer = __webpack_require__(6);
	
	var _reducer2 = _interopRequireDefault(_reducer);
	
	var _dom = __webpack_require__(77);
	
	var _dom2 = _interopRequireDefault(_dom);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var hmr = undefined;
	(0, _domready2.default)(function () {
	  return hmr = (0, _dom2.default)({
	    middleware: _client2.default,
	    reducer: _reducer2.default,
	    initialState: window.__initialState__,
	    app: function app(state) {
	      return (0, _element2.default)(_app2.default, { state: state });
	    }
	  });
	});
	
	if (true) {
	  module.hot.decline();
	  module.hot.accept([5, 6], function () {
	    hmr.replace(__webpack_require__(5), __webpack_require__(6));
	  });
	}

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _reduxMulti = __webpack_require__(71);
	
	var _reduxMulti2 = _interopRequireDefault(_reduxMulti);
	
	var _reduxEffects = __webpack_require__(70);
	
	var _reduxEffects2 = _interopRequireDefault(_reduxEffects);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var middleware = [_reduxMulti2.default, _reduxEffects2.default];
	
	exports.default = middleware;

/***/ },
/* 61 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * Use typed arrays if we can
	 */
	
	var FastArray = typeof Uint32Array === 'undefined' ? Array : Uint32Array;
	
	/**
	 * Bit vector
	 */
	
	function createBv(sizeInBits) {
	  return new FastArray(Math.ceil(sizeInBits / 32));
	}
	
	function setBit(v, idx) {
	  var r = idx % 32;
	  var pos = (idx - r) / 32;
	
	  v[pos] |= 1 << r;
	}
	
	function clearBit(v, idx) {
	  var r = idx % 32;
	  var pos = (idx - r) / 32;
	
	  v[pos] &= ~(1 << r);
	}
	
	function getBit(v, idx) {
	  var r = idx % 32;
	  var pos = (idx - r) / 32;
	
	  return !!(v[pos] & 1 << r);
	}
	
	/**
	 * Exports
	 */
	
	exports.createBv = createBv;
	exports.setBit = setBit;
	exports.clearBit = clearBit;
	exports.getBit = getBit;

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	  Copyright (c) 2016 Jed Watson.
	  Licensed under the MIT License (MIT), see
	  http://jedwatson.github.io/classnames
	*/
	/* global define */
	
	(function () {
		'use strict';
	
		var hasOwn = {}.hasOwnProperty;
	
		function classNames () {
			var classes = [];
	
			for (var i = 0; i < arguments.length; i++) {
				var arg = arguments[i];
				if (!arg) continue;
	
				var argType = typeof arg;
	
				if (argType === 'string' || argType === 'number') {
					classes.push(arg);
				} else if (Array.isArray(arg)) {
					classes.push(classNames.apply(null, arg));
				} else if (argType === 'object') {
					for (var key in arg) {
						if (hasOwn.call(arg, key) && arg[key]) {
							classes.push(key);
						}
					}
				}
			}
	
			return classes.join(' ');
		}
	
		if (typeof module !== 'undefined' && module.exports) {
			module.exports = classNames;
		} else if (true) {
			// register as 'classnames', consistent with npm package name
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
				return classNames;
			}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else {
			window.classNames = classNames;
		}
	}());


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _proxyEvent = __webpack_require__(64);
	
	var _proxyEvent2 = _interopRequireDefault(_proxyEvent);
	
	var _domEvents = __webpack_require__(9);
	
	var _domEvents2 = _interopRequireDefault(_domEvents);
	
	var _compose = __webpack_require__(26);
	
	var _compose2 = _interopRequireDefault(_compose);
	
	var _evStore = __webpack_require__(15);
	
	var _evStore2 = _interopRequireDefault(_evStore);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
	                                                                                                                                                                                                     * Imports
	                                                                                                                                                                                                     */
	
	/**
	 * Delegator
	 */
	
	function delegant(rootNode) {
	  var fn = arguments.length <= 1 || arguments[1] === undefined ? function (v) {
	    return v;
	  } : arguments[1];
	
	  return _compose2.default.apply(undefined, _toConsumableArray(_domEvents2.default.map(bind)));
	
	  function bind(name) {
	    var handler = listener(name);
	    rootNode.addEventListener(name, handler, true);
	    return function () {
	      return rootNode.removeEventListener(name, handler, true);
	    };
	  }
	
	  function listener(name) {
	    return function (e) {
	      return bubble(name, e.target, e);
	    };
	  }
	
	  function bubble(name, target, e) {
	    var es = (0, _evStore2.default)(target);
	    var handler = es[name];
	
	    if (handler) {
	      var event = new _proxyEvent2.default(e);
	      event.currentTarget = target;
	      fn(handler(event));
	      if (event._stopPropagation || event._stopImmediatePropagation) {
	        return;
	      }
	    }
	
	    if (target.parentNode && target.parentNode !== rootNode) {
	      bubble(name, target.parentNode, e);
	    }
	  }
	}
	
	/**
	 * Exports
	 */
	
	exports.default = delegant;

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	/**
	 * Note: This code copied from: https://github.com/Raynos/dom-delegator/blob/master/proxy-event.js
	 */
	
	var inherits = __webpack_require__(68);
	
	var ALL_PROPS = ["altKey", "bubbles", "cancelable", "ctrlKey", "eventPhase", "metaKey", "relatedTarget", "shiftKey", "target", "timeStamp", "type", "view", "which"];
	var KEY_PROPS = ["char", "charCode", "key", "keyCode"];
	var MOUSE_PROPS = ["button", "buttons", "clientX", "clientY", "layerX", "layerY", "offsetX", "offsetY", "pageX", "pageY", "screenX", "screenY", "toElement"];
	
	var rkeyEvent = /^key|input/;
	var rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/;
	
	module.exports = ProxyEvent;
	
	function ProxyEvent(ev) {
	    if (!(this instanceof ProxyEvent)) {
	        return new ProxyEvent(ev);
	    }
	
	    if (rkeyEvent.test(ev.type)) {
	        return new KeyEvent(ev);
	    } else if (rmouseEvent.test(ev.type)) {
	        return new MouseEvent(ev);
	    }
	
	    for (var i = 0; i < ALL_PROPS.length; i++) {
	        var propKey = ALL_PROPS[i];
	        this[propKey] = ev[propKey];
	    }
	
	    this._rawEvent = ev;
	    this._bubbles = false;
	}
	
	ProxyEvent.prototype.preventDefault = function () {
	    this._rawEvent.preventDefault();
	};
	
	ProxyEvent.prototype.startPropagation = function () {
	    this._bubbles = true;
	};
	
	ProxyEvent.prototype.stopPropagation = function () {
	    this._stopPropagation = true;
	};
	
	ProxyEvent.prototype.stopImmediatePropagation = function () {
	    this._stopImmediatePropagation = true;
	};
	
	function MouseEvent(ev) {
	    for (var i = 0; i < ALL_PROPS.length; i++) {
	        var propKey = ALL_PROPS[i];
	        this[propKey] = ev[propKey];
	    }
	
	    for (var j = 0; j < MOUSE_PROPS.length; j++) {
	        var mousePropKey = MOUSE_PROPS[j];
	        this[mousePropKey] = ev[mousePropKey];
	    }
	
	    this._rawEvent = ev;
	}
	
	inherits(MouseEvent, ProxyEvent);
	
	function KeyEvent(ev) {
	    for (var i = 0; i < ALL_PROPS.length; i++) {
	        var propKey = ALL_PROPS[i];
	        this[propKey] = ev[propKey];
	    }
	
	    for (var j = 0; j < KEY_PROPS.length; j++) {
	        var keyPropKey = KEY_PROPS[j];
	        this[keyPropKey] = ev[keyPropKey];
	    }
	
	    this._rawEvent = ev;
	}
	
	inherits(KeyEvent, ProxyEvent);

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.REMOVE = exports.MOVE = exports.UPDATE = exports.CREATE = undefined;
	
	var _bitVector = __webpack_require__(61);
	
	/**
	 * Actions
	 */
	
	var CREATE = 0; /**
	                 * Imports
	                 */
	
	var UPDATE = 1;
	var MOVE = 2;
	var REMOVE = 3;
	
	/**
	 * dift
	 */
	
	function dift(prev, next, effect, key) {
	  var pStartIdx = 0;
	  var nStartIdx = 0;
	  var pEndIdx = prev.length - 1;
	  var nEndIdx = next.length - 1;
	  var pStartItem = prev[pStartIdx];
	  var nStartItem = next[nStartIdx];
	
	  // List head is the same
	  while (pStartIdx <= pEndIdx && nStartIdx <= nEndIdx && equal(pStartItem, nStartItem)) {
	    effect(UPDATE, pStartItem, nStartItem, nStartIdx);
	    pStartItem = prev[++pStartIdx];
	    nStartItem = next[++nStartIdx];
	  }
	
	  // The above case is orders of magnitude more common than the others, so fast-path it
	  if (nStartIdx > nEndIdx && pStartIdx > pEndIdx) {
	    return;
	  }
	
	  var pEndItem = prev[pEndIdx];
	  var nEndItem = next[nEndIdx];
	  var movedFromFront = 0;
	
	  // Reversed
	  while (pStartIdx <= pEndIdx && nStartIdx <= nEndIdx && equal(pStartItem, nEndItem)) {
	    effect(MOVE, pStartItem, nEndItem, pEndIdx - movedFromFront + 1);
	    pStartItem = prev[++pStartIdx];
	    nEndItem = next[--nEndIdx];
	    ++movedFromFront;
	  }
	
	  // Reversed the other way (in case of e.g. reverse and append)
	  while (pEndIdx >= pStartIdx && nStartIdx <= nEndIdx && equal(nStartItem, pEndItem)) {
	    effect(MOVE, pEndItem, nStartItem, nStartIdx);
	    pEndItem = prev[--pEndIdx];
	    nStartItem = next[++nStartIdx];
	    --movedFromFront;
	  }
	
	  // List tail is the same
	  while (pEndIdx >= pStartIdx && nEndIdx >= nStartIdx && equal(pEndItem, nEndItem)) {
	    effect(UPDATE, pEndItem, nEndItem, nEndIdx);
	    pEndItem = prev[--pEndIdx];
	    nEndItem = next[--nEndIdx];
	  }
	
	  if (pStartIdx > pEndIdx) {
	    while (nStartIdx <= nEndIdx) {
	      effect(CREATE, null, nStartItem, nStartIdx);
	      nStartItem = next[++nStartIdx];
	    }
	
	    return;
	  }
	
	  if (nStartIdx > nEndIdx) {
	    while (pStartIdx <= pEndIdx) {
	      effect(REMOVE, pStartItem);
	      pStartItem = prev[++pStartIdx];
	    }
	
	    return;
	  }
	
	  var created = 0;
	  var pivotDest = null;
	  var pivotIdx = pStartIdx - movedFromFront;
	  var keepBase = pStartIdx;
	  var keep = (0, _bitVector.createBv)(pEndIdx - pStartIdx);
	
	  var prevMap = keyMap(prev, pStartIdx, pEndIdx + 1, key);
	
	  for (; nStartIdx <= nEndIdx; nStartItem = next[++nStartIdx]) {
	    var oldIdx = prevMap[key(nStartItem)];
	
	    if (isUndefined(oldIdx)) {
	      effect(CREATE, null, nStartItem, pivotIdx++);
	      ++created;
	    } else if (pStartIdx !== oldIdx) {
	      (0, _bitVector.setBit)(keep, oldIdx - keepBase);
	      effect(MOVE, prev[oldIdx], nStartItem, pivotIdx++);
	    } else {
	      pivotDest = nStartIdx;
	    }
	  }
	
	  if (pivotDest !== null) {
	    (0, _bitVector.setBit)(keep, 0);
	    effect(MOVE, prev[pStartIdx], next[pivotDest], pivotDest);
	  }
	
	  // If there are no creations, then you have to
	  // remove exactly max(prevLen - nextLen, 0) elements in this
	  // diff. You have to remove one more for each element
	  // that was created. This means once we have
	  // removed that many, we can stop.
	  var necessaryRemovals = prev.length - next.length + created;
	  for (var removals = 0; removals < necessaryRemovals; pStartItem = prev[++pStartIdx]) {
	    if (!(0, _bitVector.getBit)(keep, pStartIdx - keepBase)) {
	      effect(REMOVE, pStartItem);
	      ++removals;
	    }
	  }
	
	  function equal(a, b) {
	    return key(a) === key(b);
	  }
	}
	
	function isUndefined(val) {
	  return typeof val === 'undefined';
	}
	
	function keyMap(items, start, end, key) {
	  var map = {};
	
	  for (var i = start; i < end; ++i) {
	    map[key(items[i])] = i;
	  }
	
	  return map;
	}
	
	/**
	 * Exports
	 */
	
	exports.default = dift;
	exports.CREATE = CREATE;
	exports.UPDATE = UPDATE;
	exports.MOVE = MOVE;
	exports.REMOVE = REMOVE;

/***/ },
/* 66 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	/*global window, global*/
	
	var root = typeof window !== 'undefined' ?
	    window : typeof global !== 'undefined' ?
	    global : {};
	
	module.exports = Individual;
	
	function Individual(key, value) {
	    if (key in root) {
	        return root[key];
	    }
	
	    root[key] = value;
	
	    return value;
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Individual = __webpack_require__(66);
	
	module.exports = OneVersion;
	
	function OneVersion(moduleName, version, defaultValue) {
	    var key = '__INDIVIDUAL_ONE_VERSION_' + moduleName;
	    var enforceKey = key + '_ENFORCE_SINGLETON';
	
	    var versionValue = Individual(enforceKey, version);
	
	    if (versionValue !== version) {
	        throw new Error('Can only have one copy of ' +
	            moduleName + '.\n' +
	            'You already have version ' + versionValue +
	            ' installed.\n' +
	            'This means you cannot install version ' + version);
	    }
	
	    return Individual(key, defaultValue);
	}


/***/ },
/* 68 */
/***/ function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ },
/* 69 */
/***/ function(module, exports) {

	module.exports = isPromise;
	
	function isPromise(obj) {
	  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
	}


/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * Imports
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            */
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.bind = undefined;
	
	var _isPromise = __webpack_require__(69);
	
	var _isPromise2 = _interopRequireDefault(_isPromise);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Action Types
	 */
	
	var EFFECT_COMPOSE = 'EFFECT_COMPOSE';
	
	/**
	 * Effects
	 */
	
	function effects(_ref) {
	  var dispatch = _ref.dispatch;
	  var getState = _ref.getState;
	
	  return function (next) {
	    return function (action) {
	      return action.type === EFFECT_COMPOSE ? composeEffect(action) : next(action);
	    };
	  };
	
	  function composeEffect(action) {
	    var q = promisify(maybeDispatch(action.payload));
	    return action.meta && applyPromises(action.meta.steps, q);
	  }
	
	  function applyPromises() {
	    var steps = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
	    var q = arguments[1];
	
	    return steps.reduce(function (q, _ref2) {
	      var _ref3 = _slicedToArray(_ref2, 2);
	
	      var _ref3$ = _ref3[0];
	      var success = _ref3$ === undefined ? noop : _ref3$;
	      var _ref3$2 = _ref3[1];
	      var failure = _ref3$2 === undefined ? noop : _ref3$2;
	      return q.then(function (val) {
	        return maybeDispatch(success(val));
	      }, function (err) {
	        return maybeDispatch(failure(err));
	      });
	    }, q);
	  }
	
	  function maybeDispatch(action) {
	    return action && dispatch(action);
	  }
	}
	
	function promisify(val) {
	  return Array.isArray(val) ? Promise.all(val) : Promise.resolve(val);
	}
	
	function noop() {}
	
	/**
	 * Action creator
	 */
	
	function bind(action) {
	  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    args[_key - 1] = arguments[_key];
	  }
	
	  return {
	    type: EFFECT_COMPOSE,
	    payload: action,
	    meta: {
	      steps: [args]
	    }
	  };
	}
	
	/**
	 * Exports
	 */
	
	exports.default = effects;
	exports.bind = bind;

/***/ },
/* 71 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * Redux dispatch multiple actions
	 */
	
	function multi(_ref) {
	  var dispatch = _ref.dispatch;
	
	  return function (next) {
	    return function (action) {
	      return Array.isArray(action) ? action.filter(Boolean).map(dispatch) : next(action);
	    };
	  };
	}
	
	/**
	 * Exports
	 */
	
	exports.default = multi;

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = createStore;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _utilsIsPlainObject = __webpack_require__(75);
	
	var _utilsIsPlainObject2 = _interopRequireDefault(_utilsIsPlainObject);
	
	/**
	 * These are private action types reserved by Redux.
	 * For any unknown actions, you must return the current state.
	 * If the current state is undefined, you must return the initial state.
	 * Do not reference these action types directly in your code.
	 */
	var ActionTypes = {
	  INIT: '@@redux/INIT'
	};
	
	exports.ActionTypes = ActionTypes;
	/**
	 * Creates a Redux store that holds the state tree.
	 * The only way to change the data in the store is to call `dispatch()` on it.
	 *
	 * There should only be a single store in your app. To specify how different
	 * parts of the state tree respond to actions, you may combine several reducers
	 * into a single reducer function by using `combineReducers`.
	 *
	 * @param {Function} reducer A function that returns the next state tree, given
	 * the current state tree and the action to handle.
	 *
	 * @param {any} [initialState] The initial state. You may optionally specify it
	 * to hydrate the state from the server in universal apps, or to restore a
	 * previously serialized user session.
	 * If you use `combineReducers` to produce the root reducer function, this must be
	 * an object with the same shape as `combineReducers` keys.
	 *
	 * @returns {Store} A Redux store that lets you read the state, dispatch actions
	 * and subscribe to changes.
	 */
	
	function createStore(reducer, initialState) {
	  if (typeof reducer !== 'function') {
	    throw new Error('Expected the reducer to be a function.');
	  }
	
	  var currentReducer = reducer;
	  var currentState = initialState;
	  var listeners = [];
	  var isDispatching = false;
	
	  /**
	   * Reads the state tree managed by the store.
	   *
	   * @returns {any} The current state tree of your application.
	   */
	  function getState() {
	    return currentState;
	  }
	
	  /**
	   * Adds a change listener. It will be called any time an action is dispatched,
	   * and some part of the state tree may potentially have changed. You may then
	   * call `getState()` to read the current state tree inside the callback.
	   *
	   * @param {Function} listener A callback to be invoked on every dispatch.
	   * @returns {Function} A function to remove this change listener.
	   */
	  function subscribe(listener) {
	    listeners.push(listener);
	    var isSubscribed = true;
	
	    return function unsubscribe() {
	      if (!isSubscribed) {
	        return;
	      }
	
	      isSubscribed = false;
	      var index = listeners.indexOf(listener);
	      listeners.splice(index, 1);
	    };
	  }
	
	  /**
	   * Dispatches an action. It is the only way to trigger a state change.
	   *
	   * The `reducer` function, used to create the store, will be called with the
	   * current state tree and the given `action`. Its return value will
	   * be considered the **next** state of the tree, and the change listeners
	   * will be notified.
	   *
	   * The base implementation only supports plain object actions. If you want to
	   * dispatch a Promise, an Observable, a thunk, or something else, you need to
	   * wrap your store creating function into the corresponding middleware. For
	   * example, see the documentation for the `redux-thunk` package. Even the
	   * middleware will eventually dispatch plain object actions using this method.
	   *
	   * @param {Object} action A plain object representing “what changed”. It is
	   * a good idea to keep actions serializable so you can record and replay user
	   * sessions, or use the time travelling `redux-devtools`. An action must have
	   * a `type` property which may not be `undefined`. It is a good idea to use
	   * string constants for action types.
	   *
	   * @returns {Object} For convenience, the same action object you dispatched.
	   *
	   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
	   * return something else (for example, a Promise you can await).
	   */
	  function dispatch(action) {
	    if (!_utilsIsPlainObject2['default'](action)) {
	      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
	    }
	
	    if (typeof action.type === 'undefined') {
	      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
	    }
	
	    if (isDispatching) {
	      throw new Error('Reducers may not dispatch actions.');
	    }
	
	    try {
	      isDispatching = true;
	      currentState = currentReducer(currentState, action);
	    } finally {
	      isDispatching = false;
	    }
	
	    listeners.slice().forEach(function (listener) {
	      return listener();
	    });
	    return action;
	  }
	
	  /**
	   * Replaces the reducer currently used by the store to calculate the state.
	   *
	   * You might need this if your app implements code splitting and you want to
	   * load some of the reducers dynamically. You might also need this if you
	   * implement a hot reloading mechanism for Redux.
	   *
	   * @param {Function} nextReducer The reducer for the store to use instead.
	   * @returns {void}
	   */
	  function replaceReducer(nextReducer) {
	    currentReducer = nextReducer;
	    dispatch({ type: ActionTypes.INIT });
	  }
	
	  // When a store is created, an "INIT" action is dispatched so that every
	  // reducer returns their initial state. This effectively populates
	  // the initial state tree.
	  dispatch({ type: ActionTypes.INIT });
	
	  return {
	    dispatch: dispatch,
	    subscribe: subscribe,
	    getState: getState,
	    replaceReducer: replaceReducer
	  };
	}

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports['default'] = applyMiddleware;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _compose = __webpack_require__(74);
	
	var _compose2 = _interopRequireDefault(_compose);
	
	/**
	 * Creates a store enhancer that applies middleware to the dispatch method
	 * of the Redux store. This is handy for a variety of tasks, such as expressing
	 * asynchronous actions in a concise manner, or logging every action payload.
	 *
	 * See `redux-thunk` package as an example of the Redux middleware.
	 *
	 * Because middleware is potentially asynchronous, this should be the first
	 * store enhancer in the composition chain.
	 *
	 * Note that each middleware will be given the `dispatch` and `getState` functions
	 * as named arguments.
	 *
	 * @param {...Function} middlewares The middleware chain to be applied.
	 * @returns {Function} A store enhancer applying the middleware.
	 */
	
	function applyMiddleware() {
	  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
	    middlewares[_key] = arguments[_key];
	  }
	
	  return function (next) {
	    return function (reducer, initialState) {
	      var store = next(reducer, initialState);
	      var _dispatch = store.dispatch;
	      var chain = [];
	
	      var middlewareAPI = {
	        getState: store.getState,
	        dispatch: function dispatch(action) {
	          return _dispatch(action);
	        }
	      };
	      chain = middlewares.map(function (middleware) {
	        return middleware(middlewareAPI);
	      });
	      _dispatch = _compose2['default'].apply(undefined, chain)(store.dispatch);
	
	      return _extends({}, store, {
	        dispatch: _dispatch
	      });
	    };
	  };
	}
	
	module.exports = exports['default'];

/***/ },
/* 74 */
/***/ function(module, exports) {

	/**
	 * Composes single-argument functions from right to left.
	 *
	 * @param {...Function} funcs The functions to compose.
	 * @returns {Function} A function obtained by composing functions from right to
	 * left. For example, compose(f, g, h) is identical to arg => f(g(h(arg))).
	 */
	"use strict";
	
	exports.__esModule = true;
	exports["default"] = compose;
	
	function compose() {
	  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
	    funcs[_key] = arguments[_key];
	  }
	
	  return function (arg) {
	    return funcs.reduceRight(function (composed, f) {
	      return f(composed);
	    }, arg);
	  };
	}
	
	module.exports = exports["default"];

/***/ },
/* 75 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = isPlainObject;
	var fnToString = function fnToString(fn) {
	  return Function.prototype.toString.call(fn);
	};
	var objStringValue = fnToString(Object);
	
	/**
	 * @param {any} obj The object to inspect.
	 * @returns {boolean} True if the argument appears to be a plain object.
	 */
	
	function isPlainObject(obj) {
	  if (!obj || typeof obj !== 'object') {
	    return false;
	  }
	
	  var proto = typeof obj.constructor === 'function' ? Object.getPrototypeOf(obj) : Object.prototype;
	
	  if (proto === null) {
	    return true;
	  }
	
	  var constructor = proto.constructor;
	
	  return typeof constructor === 'function' && constructor instanceof constructor && fnToString(constructor) === objStringValue;
	}
	
	module.exports = exports['default'];

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var ansiRegex = __webpack_require__(58)();
	
	module.exports = function (str) {
		return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
	};


/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Convenience so that you can do
	 * require('vdux/dom')
	 */
	
	module.exports = __webpack_require__(78)


/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _applyMiddleware = __webpack_require__(73);
	
	var _applyMiddleware2 = _interopRequireDefault(_applyMiddleware);
	
	var _createStore = __webpack_require__(72);
	
	var _createStore2 = _interopRequireDefault(_createStore);
	
	var _virtexComponent = __webpack_require__(79);
	
	var _virtexComponent2 = _interopRequireDefault(_virtexComponent);
	
	var _reduxEphemeral = __webpack_require__(16);
	
	var _reduxEphemeral2 = _interopRequireDefault(_reduxEphemeral);
	
	var _emptyElement = __webpack_require__(30);
	
	var _emptyElement2 = _interopRequireDefault(_emptyElement);
	
	var _virtexLocal = __webpack_require__(84);
	
	var _virtexLocal2 = _interopRequireDefault(_virtexLocal);
	
	var _delegant = __webpack_require__(63);
	
	var _delegant2 = _interopRequireDefault(_delegant);
	
	var _virtexDom = __webpack_require__(81);
	
	var _virtexDom2 = _interopRequireDefault(_virtexDom);
	
	var _virtex2 = __webpack_require__(2);
	
	var _virtex3 = _interopRequireDefault(_virtex2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
	                                                                                                                                                                                                     * Imports
	                                                                                                                                                                                                     */
	
	/**
	 * vdux
	 */
	
	function vdux(_ref) {
	  var _ref$middleware = _ref.middleware;
	  var middleware = _ref$middleware === undefined ? [] : _ref$middleware;
	  var reducer = _ref.reducer;
	  var _ref$initialState = _ref.initialState;
	  var initialState = _ref$initialState === undefined ? {} : _ref$initialState;
	  var app = _ref.app;
	  var _ref$node = _ref.node;
	  var node = _ref$node === undefined ? document.body : _ref$node;
	  var vtree = _ref.vtree;
	
	  /**
	   * Create redux store
	   */
	
	  var store = _applyMiddleware2.default.apply(undefined, [_virtexDom2.default, (0, _virtexLocal2.default)('ui'), _virtexComponent2.default].concat(_toConsumableArray(middleware)))(_createStore2.default)((0, _reduxEphemeral2.default)('ui', reducer), initialState);
	
	  /**
	   * Initialize virtex
	   */
	
	  var _virtex = (0, _virtex3.default)(store.dispatch);
	
	  var create = _virtex.create;
	  var update = _virtex.update;
	
	  /**
	   * Empty the root node
	   */
	
	  if (!vtree) {
	    (0, _emptyElement2.default)(node);
	  }
	
	  /**
	   * Render the VDOM tree
	   */
	
	  if (vtree) {
	    (0, _virtexDom.reconstitute)(vtree, node.firstChild);
	    syncNow();
	  } else {
	    vtree = render();
	    node.appendChild(create(vtree).element);
	  }
	
	  /**
	   * Create the Virtual DOM <-> Redux cycle
	   */
	
	  var unsubscribe = store.subscribe(sync);
	  var undelegate = (0, _delegant2.default)(node, function (action) {
	    return action && store.dispatch(action);
	  });
	
	  return {
	    replace: function replace(_app, _reducer) {
	      app = _app;
	      reducer = _reducer;
	      store.replaceReducer((0, _reduxEphemeral2.default)('ui', reducer));
	      sync();
	    },
	    stop: function stop() {
	      unsubscribe();
	      undelegate();
	    }
	  };
	
	  /**
	   * Render a new virtual dom
	   */
	
	  function render() {
	    return app(store.getState());
	  }
	
	  /**
	   * Sync the virtual dom and the actual dom
	   */
	
	  var pending = false;
	
	  function sync() {
	    // Prevent re-entrant renders
	    if (pending) return;
	    pending = true;
	
	    setTimeout(syncNow);
	  }
	
	  function syncNow() {
	    pending = false;
	
	    var newTree = render();
	    update(vtree, newTree);
	    vtree = newTree;
	  }
	}
	
	/**
	 * Exports
	 */
	
	exports.default = vdux;

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _virtex = __webpack_require__(2);
	
	var _defaults = __webpack_require__(28);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _arrayEqual = __webpack_require__(8);
	
	var _arrayEqual2 = _interopRequireDefault(_arrayEqual);
	
	var _objectEqual = __webpack_require__(12);
	
	var _objectEqual2 = _interopRequireDefault(_objectEqual);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Constants
	 */
	
	/**
	 * Imports
	 */
	
	var _actions$types = _virtex.actions.types;
	var CREATE_THUNK = _actions$types.CREATE_THUNK;
	var UPDATE_THUNK = _actions$types.UPDATE_THUNK;
	var DESTROY_THUNK = _actions$types.DESTROY_THUNK;
	
	/**
	 * virtex-component
	 */
	
	function middleware(_ref) {
	  var dispatch = _ref.dispatch;
	
	  var maybeDispatch = function maybeDispatch(action) {
	    return action && dispatch(action);
	  };
	
	  return function (next) {
	    return function (action) {
	      switch (action.type) {
	        case CREATE_THUNK:
	          return create(maybeDispatch, action.vnode);
	        case UPDATE_THUNK:
	          return update(maybeDispatch, action.vnode, action.prev);
	        case DESTROY_THUNK:
	          return destroy(maybeDispatch, action.vnode);
	        default:
	          return next(action);
	      }
	    };
	  };
	}
	
	function create(dispatch, thunk) {
	  var component = thunk.type;
	  var onCreate = component.onCreate;
	
	  thunk.props = thunk.props || {};
	
	  // Setup the default immutable shouldUpdate if this component
	  // hasn't exported one
	  component.shouldUpdate = component.shouldUpdate || shouldUpdate;
	
	  // Call the onCreate hook
	  if (onCreate) {
	    dispatch(onCreate(thunk));
	  }
	
	  return thunk.vnode = render(component, thunk);
	}
	
	function update(dispatch, thunk, prev) {
	  if (thunk.vnode) return thunk.vnode;
	
	  var component = thunk.type;
	  var onUpdate = component.onUpdate;
	  var shouldUpdate = component.shouldUpdate;
	
	  thunk.props = thunk.props || {};
	  (0, _defaults2.default)(thunk, prev);
	
	  if (shouldUpdate(prev, thunk)) {
	    onUpdate && dispatch(onUpdate(prev, thunk));
	    thunk.vnode = render(component, thunk);
	
	    return thunk.vnode;
	  }
	
	  return thunk.vnode = prev.vnode;
	}
	
	function destroy(dispatch, thunk) {
	  var onRemove = thunk.type.onRemove;
	
	  onRemove && dispatch(onRemove(thunk));
	}
	
	function render(component, thunk) {
	  return typeof component === 'function' ? component(thunk) : component.render(thunk);
	}
	
	function shouldUpdate(prev, next) {
	  return !(0, _arrayEqual2.default)(prev.children, next.children) || !(0, _objectEqual2.default)(prev.props, next.props);
	}
	
	/**
	 * Exports
	 */
	
	exports.default = middleware;

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createElement = __webpack_require__(27);
	
	var _createElement2 = _interopRequireDefault(_createElement);
	
	var _setAttribute = __webpack_require__(19);
	
	var _setAttribute2 = _interopRequireDefault(_setAttribute);
	
	var _foreach = __webpack_require__(1);
	
	var _foreach2 = _interopRequireDefault(_foreach);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Create a DOM element
	 */
	
	function createNode(vnode, children) {
	  var type = vnode.type;
	
	  if (type === '#text') {
	    vnode.element = document.createTextNode(vnode.props.nodeValue);
	    return vnode;
	  }
	
	  var node = vnode.element = (0, _createElement2.default)(type);
	  (0, _foreach2.default)(function (value, name) {
	    return (0, _setAttribute2.default)(node, name, value);
	  }, vnode.props);
	  (0, _foreach2.default)(function (child) {
	    return node.appendChild(child.element);
	  }, children);
	
	  return vnode;
	}
	
	/**
	 * Exports
	 */
	
	/**
	 * Imports
	 */
	
	exports.default = createNode;

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.reconstitute = undefined;
	
	var _replaceElement = __webpack_require__(50);
	
	var _replaceElement2 = _interopRequireDefault(_replaceElement);
	
	var _insertElement = __webpack_require__(36);
	
	var _insertElement2 = _interopRequireDefault(_insertElement);
	
	var _removeElement = __webpack_require__(49);
	
	var _removeElement2 = _interopRequireDefault(_removeElement);
	
	var _updateNode = __webpack_require__(82);
	
	var _updateNode2 = _interopRequireDefault(_updateNode);
	
	var _createNode = __webpack_require__(80);
	
	var _createNode2 = _interopRequireDefault(_createNode);
	
	var _foreach = __webpack_require__(1);
	
	var _foreach2 = _interopRequireDefault(_foreach);
	
	var _virtex = __webpack_require__(2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Constants
	 */
	
	var _actions$types = _virtex.actions.types; /**
	                                             * Imports
	                                             */
	
	var CREATE_NODE = _actions$types.CREATE_NODE;
	var UPDATE_NODE = _actions$types.UPDATE_NODE;
	var REMOVE_NODE = _actions$types.REMOVE_NODE;
	var REPLACE_NODE = _actions$types.REPLACE_NODE;
	var INSERT_NODE = _actions$types.INSERT_NODE;
	
	/**
	 * Virtex DOM effects driver
	 */
	
	function dom(_ref) {
	  var dispatch = _ref.dispatch;
	
	  return function (next) {
	    return function (action) {
	      switch (action.type) {
	        case CREATE_NODE:
	          return (0, _createNode2.default)(action.vnode, action.children);
	        case UPDATE_NODE:
	          return (0, _updateNode2.default)(action.prev, action.vnode);
	        case REMOVE_NODE:
	          (0, _removeElement2.default)(action.vnode.element);
	          return action.vnode;
	        case REPLACE_NODE:
	          (0, _replaceElement2.default)(action.vnode.element, action.prev.element);
	          return action.vnode;
	        case INSERT_NODE:
	          (0, _insertElement2.default)(action.vnode.element, action.newVnode.element, action.pos);
	          return action.vnode;
	      }
	
	      return next(action);
	    };
	  };
	}
	
	/**
	 * Setup the cached element property on a vnode tree. Useful for server-side
	 * rendering
	 */
	
	function reconstitute(vnode, element) {
	  vnode.element = element;
	  (0, _foreach2.default)(function (vnode, i) {
	    return reconstitute(vnode, element.childNodes[i]);
	  }, vnode.children);
	}
	
	/**
	 * Exports
	 */
	
	exports.default = dom;
	exports.reconstitute = reconstitute;

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _removeAttribute = __webpack_require__(18);
	
	var _removeAttribute2 = _interopRequireDefault(_removeAttribute);
	
	var _setAttribute = __webpack_require__(19);
	
	var _setAttribute2 = _interopRequireDefault(_setAttribute);
	
	var _isUndefined = __webpack_require__(4);
	
	var _isUndefined2 = _interopRequireDefault(_isUndefined);
	
	var _foreach = __webpack_require__(1);
	
	var _foreach2 = _interopRequireDefault(_foreach);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Update element
	 */
	
	/**
	 * Imports
	 */
	
	function updateElement(prev, next) {
	  var node = next.element = prev.element;
	
	  /**
	   * Diff attributes
	   */
	
	  var pattrs = prev.props;
	  var nattrs = next.props;
	
	  (0, _foreach2.default)(function (val, key) {
	    if (!nattrs || (0, _isUndefined2.default)(nattrs[key])) {
	      (0, _removeAttribute2.default)(node, key);
	    }
	  }, pattrs);
	
	  (0, _foreach2.default)(function (val, key) {
	    if (!pattrs || val !== pattrs[key]) {
	      (0, _setAttribute2.default)(node, key, val);
	    }
	  }, nattrs);
	
	  return next;
	}
	
	/**
	 * Exports
	 */
	
	exports.default = updateElement;

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _virtex = __webpack_require__(2);
	
	var _toInlineStyle = __webpack_require__(57);
	
	var _toInlineStyle2 = _interopRequireDefault(_toInlineStyle);
	
	var _capitalize = __webpack_require__(23);
	
	var _capitalize2 = _interopRequireDefault(_capitalize);
	
	var _focusElement = __webpack_require__(31);
	
	var _focusElement2 = _interopRequireDefault(_focusElement);
	
	var _classnames = __webpack_require__(62);
	
	var _classnames2 = _interopRequireDefault(_classnames);
	
	var _isObject = __webpack_require__(11);
	
	var _isObject2 = _interopRequireDefault(_isObject);
	
	var _keychord = __webpack_require__(43);
	
	var _keychord2 = _interopRequireDefault(_keychord);
	
	var _domEvents = __webpack_require__(9);
	
	var _domEvents2 = _interopRequireDefault(_domEvents);
	
	var _foreach = __webpack_require__(1);
	
	var _foreach2 = _interopRequireDefault(_foreach);
	
	var _evStore = __webpack_require__(15);
	
	var _evStore2 = _interopRequireDefault(_evStore);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Constants
	 */
	
	/**
	 * Imports
	 */
	
	var eventRegex = new RegExp('^on(?:' + _domEvents2.default.join('|') + ')$', 'i');
	
	/**
	 * virtex-element
	 */
	
	function element(tag, attrs) {
	  // Only apply sugar to native elements
	  if (typeof tag === 'string' && attrs) {
	    (0, _foreach2.default)(function (val, key) {
	      return attrs[key] = sugar(val, key);
	    }, attrs);
	  }
	
	  return _virtex.element.apply(null, arguments);
	}
	
	function sugar(value, name) {
	  switch (name) {
	    case 'style':
	      if ((0, _isObject2.default)(value)) value = (0, _toInlineStyle2.default)(value);
	      return value;
	    case 'class':
	      return (0, _classnames2.default)(value);
	    case 'focused':
	      return value && function (node) {
	        return setTimeout(function () {
	          return (0, _focusElement2.default)(node);
	        });
	      };
	    default:
	      return eventRegex.test(name) ? bindEvent(name.slice(2).toLowerCase(), value) : value;
	  }
	}
	
	function bindEvent(name, fn) {
	  return function (node) {
	    return (0, _evStore2.default)(node)[name] = createHandler(fn);
	  };
	}
	
	function createHandler(fn) {
	  return function (e) {
	    var f = (0, _isObject2.default)(fn) ? fn[(0, _keychord2.default)(e)] : fn;
	
	    if (f) {
	      return Array.isArray(f) ? f.map(function (f) {
	        return f(e);
	      }) : f(e);
	    }
	  };
	}
	
	/**
	 * Exports
	 */
	
	exports.default = element;

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _reduxEphemeral = __webpack_require__(16);
	
	var _objectEqual = __webpack_require__(12);
	
	var _objectEqual2 = _interopRequireDefault(_objectEqual);
	
	var _arrayEqual = __webpack_require__(8);
	
	var _arrayEqual2 = _interopRequireDefault(_arrayEqual);
	
	var _getProp = __webpack_require__(10);
	
	var _getProp2 = _interopRequireDefault(_getProp);
	
	var _virtex = __webpack_require__(2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Constants
	 */
	
	var _actions$types = _virtex.actions.types; /**
	                                             * Imports
	                                             */
	
	var CREATE_THUNK = _actions$types.CREATE_THUNK;
	var UPDATE_THUNK = _actions$types.UPDATE_THUNK;
	var DESTROY_THUNK = _actions$types.DESTROY_THUNK;
	
	/**
	 * Provide local state to virtex components
	 */
	
	function local() {
	  var prop = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	
	  return function (_ref) {
	    var getState = _ref.getState;
	    var dispatch = _ref.dispatch;
	
	    var state = function state() {
	      return (0, _getProp2.default)(prop, getState());
	    };
	
	    return function (next) {
	      return function (action) {
	        switch (action.type) {
	          case CREATE_THUNK:
	            create(dispatch, action.vnode);
	            break;
	          case UPDATE_THUNK:
	            update(state, action.vnode, action.prev);
	            break;
	          case DESTROY_THUNK:
	            destroy(dispatch, action.vnode);
	            break;
	        }
	
	        return next(action);
	      };
	    };
	  };
	}
	
	function create(dispatch, thunk) {
	  var component = thunk.type;
	  var _component$initialSta = component.initialState;
	  var initialState = _component$initialSta === undefined ? function () {
	    return {};
	  } : _component$initialSta;
	
	  prepare(thunk, initialState(thunk.props));
	
	  // If a component does not have a reducer, it does not
	  // get any local state
	  if (component.reducer) {
	    component.shouldUpdate = component.shouldUpdate || shouldUpdate;
	    dispatch((0, _reduxEphemeral.createEphemeral)(thunk.path, thunk.state));
	  }
	}
	
	function update(getState, thunk, prev) {
	  prepare(thunk, (0, _getProp2.default)(thunk.path, getState()));
	}
	
	function destroy(dispatch, thunk) {
	  thunk.type.reducer && dispatch((0, _reduxEphemeral.destroyEphemeral)(thunk.path));
	}
	
	function shouldUpdate(prev, next) {
	  return !(0, _arrayEqual2.default)(prev.children, next.children) || !(0, _objectEqual2.default)(prev.props, next.props) || prev.state !== next.state;
	}
	
	function ref(refs) {
	  return function (name) {
	    return function (local) {
	      return refs[name] = local;
	    };
	  };
	}
	
	function prepare(thunk, state) {
	  thunk.state = state;
	  thunk.local = function (fn) {
	    for (var _len = arguments.length, outerArgs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	      outerArgs[_key - 1] = arguments[_key];
	    }
	
	    return function () {
	      for (var _len2 = arguments.length, innerArgs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	        innerArgs[_key2] = arguments[_key2];
	      }
	
	      return (0, _reduxEphemeral.toEphemeral)(thunk.path, thunk.type.reducer, fn.apply(thunk, outerArgs.concat(innerArgs)));
	    };
	  };
	
	  var refs = {};
	
	  thunk.ref = {
	    as: ref(refs),
	    to: function to(name, fn) {
	      for (var _len3 = arguments.length, outerArgs = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
	        outerArgs[_key3 - 2] = arguments[_key3];
	      }
	
	      return function () {
	        return refs[name].apply(refs, [fn].concat(outerArgs)).apply(undefined, arguments);
	      };
	    }
	  };
	
	  if (thunk.props && thunk.props.ref) {
	    thunk.props.ref(thunk.local);
	  }
	}
	
	/**
	 * Exports
	 */
	
	exports.default = local;

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _isUndefined = __webpack_require__(4);
	
	var _isUndefined2 = _interopRequireDefault(_isUndefined);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; } /**
	                                                                                                                              * Imports
	                                                                                                                              */
	
	/**
	 * Vnode creator
	 */
	
	function element(type, props) {
	  var len = arguments.length;
	  var children = [];
	
	  for (var i = 2, j = 0; i < len; ++i) {
	    j += filterFlatten(arguments[i], children, j);
	  }
	
	  var key = undefined;
	  if (props && !(0, _isUndefined2.default)(props.key)) {
	    key = props.key;
	    if (Object.keys(props).length === 1) {
	      props = undefined;
	    } else {
	      props.key = undefined;
	    }
	  }
	
	  return {
	    key: key,
	    type: type,
	    props: props,
	    children: children
	  };
	}
	
	/**
	 * Very fast in-place, single-pass filter/flatten
	 * algorithm
	 */
	
	function filterFlatten(item, arr, arrStart) {
	  var added = 0;
	
	  switch (type(item)) {
	    case 'array':
	      var len = item.length;
	      for (var i = 0; i < len; ++i) {
	        added += filterFlatten(item[i], arr, arrStart + added);
	      }
	      return added;
	    case 'null':
	    case 'undefined':
	      return 0;
	    case 'string':
	    case 'number':
	      arr[arrStart] = element('#text', { nodeValue: item });
	      break;
	    default:
	      arr[arrStart] = item;
	      break;
	  }
	
	  return 1;
	}
	
	function type(val) {
	  if (Array.isArray(val)) return 'array';
	  if (val === null) return 'null';
	  return typeof val === 'undefined' ? 'undefined' : _typeof(val);
	}
	
	/**
	 * Exports
	 */
	
	exports.default = element;

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _actions = __webpack_require__(7);
	
	var _util = __webpack_require__(21);
	
	var _dift = __webpack_require__(65);
	
	var _dift2 = _interopRequireDefault(_dift);
	
	var _foreach = __webpack_require__(1);
	
	var _foreach2 = _interopRequireDefault(_foreach);
	
	var _create2 = __webpack_require__(20);
	
	var _create3 = _interopRequireDefault(_create2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Diff and render two vnode trees
	 */
	
	function update(effect) {
	  var create = (0, _create3.default)(effect);
	  return function (prev, next) {
	    return updateRecursive(prev, next, '0');
	  };
	
	  function updateRecursive(prev, next, path) {
	    next.path = path;
	
	    if (!(0, _util.isSameNode)(prev, next)) {
	      unrenderThunks(prev);
	
	      while ((0, _util.isThunk)(prev)) {
	        prev = effect((0, _actions.updateThunk)(prev));
	      }
	
	      next = create(next, path);
	      effect((0, _actions.replaceNode)(next, prev));
	    } else if ((0, _util.isThunk)(next)) {
	      next = effect((0, _actions.updateThunk)(next, prev));
	      prev = effect((0, _actions.updateThunk)(prev));
	
	      return updateRecursive(prev, next, (0, _util.createPath)(next, path, 0));
	    } else {
	      if (prev !== next) {
	        /**
	         * Diff children
	         */
	
	        (0, _dift2.default)(prev.children, next.children, function (type, pItem, nItem, pos) {
	          switch (type) {
	            case _dift.UPDATE:
	              return updateRecursive(pItem, nItem, (0, _util.createPath)(nItem, path, pos));
	            case _dift.CREATE:
	              return effect((0, _actions.insertNode)(prev, create(nItem, (0, _util.createPath)(nItem, path, pos)), pos));
	            case _dift.MOVE:
	              return effect((0, _actions.insertNode)(prev, updateRecursive(pItem, nItem, (0, _util.createPath)(nItem, path, pos)), pos));
	            case _dift.REMOVE:
	              return effect((0, _actions.removeNode)(unrenderThunks(pItem)));
	          }
	        }, _util.getKey);
	      }
	
	      effect((0, _actions.updateNode)(next, prev));
	    }
	
	    return next;
	  }
	
	  function unrenderThunks(vnode) {
	    while ((0, _util.isThunk)(vnode)) {
	      effect((0, _actions.destroyThunk)(vnode));
	      vnode = effect((0, _actions.updateThunk)(vnode));
	    }
	
	    (0, _foreach2.default)(unrenderThunks, vnode.children);
	    return vnode;
	  }
	}
	
	/**
	 * Exports
	 */
	
	/**
	 * Imports
	 */
	
	exports.default = update;

/***/ },
/* 87 */
/***/ function(module, exports) {

	/*eslint-env browser*/
	
	var clientOverlay = document.createElement('div');
	clientOverlay.style.display = 'none';
	clientOverlay.style.background = '#fdd';
	clientOverlay.style.color = '#000';
	clientOverlay.style.whiteSpace = 'pre';
	clientOverlay.style.fontFamily = 'monospace';
	clientOverlay.style.position = 'fixed';
	clientOverlay.style.zIndex = 9999;
	clientOverlay.style.padding = '10px';
	clientOverlay.style.left = 0;
	clientOverlay.style.right = 0;
	clientOverlay.style.top = 0;
	clientOverlay.style.bottom = 0;
	clientOverlay.style.overflow = 'auto';
	
	if (document.body) {
	  document.body.appendChild(clientOverlay);
	}
	
	exports.showProblems =
	function showProblems(lines) {
	  clientOverlay.innerHTML = '';
	  clientOverlay.style.display = 'block';
	  lines.forEach(function(msg) {
	    var div = document.createElement('div');
	    div.textContent = msg;
	    clientOverlay.appendChild(div);
	  });
	};
	
	exports.clear =
	function clear() {
	  clientOverlay.innerHTML = '';
	  clientOverlay.style.display = 'none';
	};
	


/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/*eslint-env browser*/
	/*global __resourceQuery*/
	
	var options = {
	  path: "/__webpack_hmr",
	  timeout: 20 * 1000,
	  overlay: true,
	  reload: false,
	  log: true,
	  warn: true
	};
	if (false) {
	  var querystring = require('querystring');
	  var overrides = querystring.parse(__resourceQuery.slice(1));
	  if (overrides.path) options.path = overrides.path;
	  if (overrides.timeout) options.timeout = overrides.timeout;
	  if (overrides.overlay) options.overlay = overrides.overlay !== 'false';
	  if (overrides.reload) options.reload = overrides.reload !== 'false';
	  if (overrides.noInfo && overrides.noInfo !== 'false') {
	    options.log = false;
	  }
	  if (overrides.quiet && overrides.quiet !== 'false') {
	    options.log = false;
	    options.warn = false;
	  }
	}
	
	if (typeof window.EventSource === 'undefined') {
	  console.warn(
	    "webpack-hot-middleware's client requires EventSource to work. " +
	    "You should include a polyfill if you want to support this browser: " +
	    "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events#Tools"
	  );
	} else {
	  connect();
	}
	
	function connect() {
	  var source = new window.EventSource(options.path);
	  var lastActivity = new Date();
	
	  source.onopen = handleOnline;
	  source.onmessage = handleMessage;
	  source.onerror = handleDisconnect;
	
	  var timer = setInterval(function() {
	    if ((new Date() - lastActivity) > options.timeout) {
	      handleDisconnect();
	    }
	  }, options.timeout / 2);
	
	  function handleOnline() {
	    if (options.log) console.log("[HMR] connected");
	    lastActivity = new Date();
	  }
	
	  function handleMessage(event) {
	    lastActivity = new Date();
	    if (event.data == "\uD83D\uDC93") {
	      return;
	    }
	    try {
	      processMessage(JSON.parse(event.data));
	    } catch (ex) {
	      if (options.warn) {
	        console.warn("Invalid HMR message: " + event.data + "\n" + ex);
	      }
	    }
	  }
	
	  function handleDisconnect() {
	    clearInterval(timer);
	    source.close();
	    setTimeout(connect, options.timeout);
	  }
	
	}
	
	var strip = __webpack_require__(76);
	
	var overlay;
	if (options.overlay) {
	  overlay = __webpack_require__(87);
	}
	
	function problems(type, obj) {
	  if (options.warn) console.warn("[HMR] bundle has " + type + ":");
	  var list = [];
	  obj[type].forEach(function(msg) {
	    var clean = strip(msg);
	    if (options.warn) console.warn("[HMR] " + clean);
	    list.push(clean);
	  });
	  if (overlay && type !== 'warnings') overlay.showProblems(list);
	}
	
	function success() {
	  if (overlay) overlay.clear();
	}
	
	var processUpdate = __webpack_require__(89);
	
	var customHandler;
	function processMessage(obj) {
	  if (obj.action == "building") {
	    if (options.log) console.log("[HMR] bundle rebuilding");
	  } else if (obj.action == "built") {
	    if (options.log) console.log("[HMR] bundle rebuilt in " + obj.time + "ms");
	    if (obj.errors.length > 0) {
	      problems('errors', obj);
	    } else {
	      if (obj.warnings.length > 0) problems('warnings', obj);
	      success();
	
	      processUpdate(obj.hash, obj.modules, options);
	    }
	  } else if (customHandler) {
	    customHandler(obj);
	  }
	}
	
	if (module) {
	  module.exports = {
	    subscribe: function subscribe(handler) {
	      customHandler = handler;
	    }
	  };
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(90)(module)))

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Based heavily on https://github.com/webpack/webpack/blob/
	 *  c0afdf9c6abc1dd70707c594e473802a566f7b6e/hot/only-dev-server.js
	 * Original copyright Tobias Koppers @sokra (MIT license)
	 */
	
	/* global window __webpack_hash__ */
	
	if (false) {
	  throw new Error("[HMR] Hot Module Replacement is disabled.");
	}
	
	var lastHash;
	var failureStatuses = { abort: 1, fail: 1 };
	var applyOptions = { ignoreUnaccepted: true };
	
	function upToDate(hash) {
	  if (hash) lastHash = hash;
	  return lastHash == __webpack_require__.h();
	}
	
	module.exports = function(hash, moduleMap, options) {
	  var reload = options.reload;
	  if (!upToDate(hash) && module.hot.status() == "idle") {
	    if (options.log) console.log("[HMR] Checking for updates on the server...");
	    check();
	  }
	
	  function check() {
	    module.hot.check(function(err, updatedModules) {
	      if (err) return handleError(err);
	
	      if(!updatedModules) {
	        if (options.warn) {
	          console.warn("[HMR] Cannot find update (Full reload needed)");
	          console.warn("[HMR] (Probably because of restarting the server)");
	        }
	        performReload();
	        return null;
	      }
	
	      module.hot.apply(applyOptions, function(applyErr, renewedModules) {
	        if (applyErr) return handleError(applyErr);
	
	        if (!upToDate()) check();
	
	        logUpdates(updatedModules, renewedModules);
	      });
	    });
	  }
	
	  function logUpdates(updatedModules, renewedModules) {
	    var unacceptedModules = updatedModules.filter(function(moduleId) {
	      return renewedModules && renewedModules.indexOf(moduleId) < 0;
	    });
	
	    if(unacceptedModules.length > 0) {
	      if (options.warn) {
	        console.warn(
	          "[HMR] The following modules couldn't be hot updated: " +
	          "(Full reload needed)"
	        );
	        unacceptedModules.forEach(function(moduleId) {
	          console.warn("[HMR]  - " + moduleMap[moduleId]);
	        });
	      }
	      performReload();
	      return;
	    }
	
	    if (options.log) {
	      if(!renewedModules || renewedModules.length === 0) {
	        console.log("[HMR] Nothing hot updated.");
	      } else {
	        console.log("[HMR] Updated modules:");
	        renewedModules.forEach(function(moduleId) {
	          console.log("[HMR]  - " + moduleMap[moduleId]);
	        });
	      }
	
	      if (upToDate()) {
	        console.log("[HMR] App is up to date.");
	      }
	    }
	  }
	
	  function handleError(err) {
	    if (module.hot.status() in failureStatuses) {
	      if (options.warn) {
	        console.warn("[HMR] Cannot check for update (Full reload needed)");
	        console.warn("[HMR] " + err.stack || err.message);
	      }
	      performReload();
	      return;
	    }
	    if (options.warn) {
	      console.warn("[HMR] Update check failed: " + err.stack || err.message);
	    }
	  }
	
	  function performReload() {
	    if (reload) {
	      if (options.warn) console.warn("[HMR] Reloading page");
	      window.location.reload();
	    }
	  }
	};


/***/ },
/* 90 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map