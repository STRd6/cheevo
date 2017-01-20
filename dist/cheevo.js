(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Cheevo = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var AchievementTemplate;

require("./style.css");

AchievementTemplate = require("./templates/achievement");

module.exports = {
  display: function(options) {
    var achievementElement;
    if (options == null) {
      options = {};
    }
    if (options.icon == null) {
      options.icon = "🏆";
    }
    if (options.title == null) {
      options.title = "Achievement Unlocked";
    }
    if (options.text == null) {
      options.text = "";
    }
    achievementElement = AchievementTemplate(options);
    document.body.appendChild(achievementElement);
    setTimeout(function() {
      return achievementElement.remove();
    }, 10000);
    return achievementElement;
  }
};


},{"./style.css":6,"./templates/achievement":7}],2:[function(require,module,exports){
'use strict';
// For more information about browser field, check out the browser field at https://github.com/substack/browserify-handbook#browser-field.

var styleElementsInsertedAtTop = [];

var insertStyleElement = function(styleElement, options) {
    var head = document.head || document.getElementsByTagName('head')[0];
    var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];

    options = options || {};
    options.insertAt = options.insertAt || 'bottom';

    if (options.insertAt === 'top') {
        if (!lastStyleElementInsertedAtTop) {
            head.insertBefore(styleElement, head.firstChild);
        } else if (lastStyleElementInsertedAtTop.nextSibling) {
            head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
        } else {
            head.appendChild(styleElement);
        }
        styleElementsInsertedAtTop.push(styleElement);
    } else if (options.insertAt === 'bottom') {
        head.appendChild(styleElement);
    } else {
        throw new Error('Invalid value for parameter \'insertAt\'. Must be \'top\' or \'bottom\'.');
    }
};

module.exports = {
    // Create a <link> tag with optional data attributes
    createLink: function(href, attributes) {
        var head = document.head || document.getElementsByTagName('head')[0];
        var link = document.createElement('link');

        link.href = href;
        link.rel = 'stylesheet';

        for (var key in attributes) {
            if ( ! attributes.hasOwnProperty(key)) {
                continue;
            }
            var value = attributes[key];
            link.setAttribute('data-' + key, value);
        }

        head.appendChild(link);
    },
    // Create a <style> tag with optional data attributes
    createStyle: function(cssText, attributes, extraOptions) {
        extraOptions = extraOptions || {};

        var style = document.createElement('style');
        style.type = 'text/css';

        for (var key in attributes) {
            if ( ! attributes.hasOwnProperty(key)) {
                continue;
            }
            var value = attributes[key];
            style.setAttribute('data-' + key, value);
        }

        if (style.sheet) { // for jsdom and IE9+
            style.innerHTML = cssText;
            style.sheet.cssText = cssText;
            insertStyleElement(style, { insertAt: extraOptions.insertAt });
        } else if (style.styleSheet) { // for IE8 and below
            insertStyleElement(style, { insertAt: extraOptions.insertAt });
            style.styleSheet.cssText = cssText;
        } else { // for Chrome, Firefox, and Safari
            style.appendChild(document.createTextNode(cssText));
            insertStyleElement(style, { insertAt: extraOptions.insertAt });
        }
    }
};

},{}],3:[function(require,module,exports){
// Generated by CoffeeScript 1.7.1
(function() {
  "use strict";
  var Observable, Runtime, bindEvent, bindObservable, bufferTo, classes, createElement, empty, eventNames, get, id, isEvent, isFragment, makeElement, observeAttribute, observeAttributes, observeContent, specialBindings, valueBind, valueIndexOf;

  Observable = require("o_0");

  eventNames = "abort\nblur\nchange\nclick\ncontextmenu\ndblclick\ndrag\ndragend\ndragenter\ndragexit\ndragleave\ndragover\ndragstart\ndrop\nerror\nfocus\ninput\nkeydown\nkeypress\nkeyup\nload\nmousedown\nmousemove\nmouseout\nmouseover\nmouseup\nreset\nresize\nscroll\nselect\nsubmit\ntouchcancel\ntouchend\ntouchenter\ntouchleave\ntouchmove\ntouchstart\nunload".split("\n");

  isEvent = function(name) {
    return eventNames.indexOf(name) !== -1;
  };

  isFragment = function(node) {
    return (node != null ? node.nodeType : void 0) === 11;
  };

  valueBind = function(element, value, context) {
    Observable(function() {
      var update;
      value = Observable(value, context);
      switch (element.nodeName) {
        case "SELECT":
          element.oninput = element.onchange = function() {
            var optionValue, _ref, _value;
            _ref = this.children[this.selectedIndex], optionValue = _ref.value, _value = _ref._value;
            return value(_value || optionValue);
          };
          update = function(newValue) {
            var options;
            element._value = newValue;
            if ((options = element._options)) {
              if (newValue.value != null) {
                return element.value = (typeof newValue.value === "function" ? newValue.value() : void 0) || newValue.value;
              } else {
                return element.selectedIndex = valueIndexOf(options, newValue);
              }
            } else {
              return element.value = newValue;
            }
          };
          return bindObservable(element, value, context, update);
        default:
          element.oninput = element.onchange = function() {
            return value(element.value);
          };
          if (typeof element.attachEvent === "function") {
            element.attachEvent("onkeydown", function() {
              return setTimeout(function() {
                return value(element.value);
              }, 0);
            });
          }
          return bindObservable(element, value, context, function(newValue) {
            if (element.value !== newValue) {
              return element.value = newValue;
            }
          });
      }
    });
  };

  specialBindings = {
    INPUT: {
      checked: function(element, value, context) {
        element.onchange = function() {
          return typeof value === "function" ? value(element.checked) : void 0;
        };
        return bindObservable(element, value, context, function(newValue) {
          return element.checked = newValue;
        });
      }
    },
    SELECT: {
      options: function(element, values, context) {
        var updateValues;
        values = Observable(values, context);
        updateValues = function(values) {
          empty(element);
          element._options = values;
          return values.map(function(value, index) {
            var option, optionName, optionValue;
            option = createElement("option");
            option._value = value;
            if (typeof value === "object") {
              optionValue = (value != null ? value.value : void 0) || index;
            } else {
              optionValue = value.toString();
            }
            bindObservable(option, optionValue, value, function(newValue) {
              return option.value = newValue;
            });
            optionName = (value != null ? value.name : void 0) || value;
            bindObservable(option, optionName, value, function(newValue) {
              return option.textContent = option.innerText = newValue;
            });
            element.appendChild(option);
            if (value === element._value) {
              element.selectedIndex = index;
            }
            return option;
          });
        };
        return bindObservable(element, values, context, updateValues);
      }
    }
  };

  observeAttribute = function(element, context, name, value) {
    var binding, nodeName, _ref;
    nodeName = element.nodeName;
    if (name === "value") {
      valueBind(element, value);
    } else if (binding = (_ref = specialBindings[nodeName]) != null ? _ref[name] : void 0) {
      binding(element, value, context);
    } else if (name.match(/^on/) && isEvent(name.substr(2))) {
      bindEvent(element, name, value, context);
    } else if (isEvent(name)) {
      bindEvent(element, "on" + name, value, context);
    } else {
      bindObservable(element, value, context, function(newValue) {
        if ((newValue != null) && newValue !== false) {
          return element.setAttribute(name, newValue);
        } else {
          return element.removeAttribute(name);
        }
      });
    }
    return element;
  };

  observeAttributes = function(element, context, attributes) {
    return Object.keys(attributes).forEach(function(name) {
      var value;
      value = attributes[name];
      return observeAttribute(element, context, name, value);
    });
  };

  bindObservable = function(element, value, context, update) {
    var observable, observe, unobserve;
    observable = Observable(value, context);
    observe = function() {
      observable.observe(update);
      return update(observable());
    };
    unobserve = function() {
      return observable.stopObserving(update);
    };
    observe();
    return element;
  };

  bindEvent = function(element, name, fn, context) {
    return element[name] = function() {
      return fn.apply(context, arguments);
    };
  };

  id = function(element, context, sources) {
    var lastId, update, value;
    value = Observable.concat.apply(Observable, sources.map(function(source) {
      return Observable(source, context);
    }));
    update = function(newId) {
      return element.id = newId;
    };
    lastId = function() {
      return value.last();
    };
    return bindObservable(element, lastId, context, update);
  };

  classes = function(element, context, sources) {
    var classNames, update, value;
    value = Observable.concat.apply(Observable, sources.map(function(source) {
      return Observable(source, context);
    }));
    update = function(classNames) {
      return element.className = classNames;
    };
    classNames = function() {
      return value.join(" ");
    };
    return bindObservable(element, classNames, context, update);
  };

  createElement = function(name) {
    return document.createElement(name);
  };

  observeContent = function(element, context, contentFn) {
    var append, contents, update;
    contents = [];
    contentFn.call(context, {
      buffer: bufferTo(context, contents),
      element: makeElement
    });
    append = function(item) {
      if (item == null) {

      } else if (typeof item === "string") {
        return element.appendChild(document.createTextNode(item));
      } else if (typeof item === "number") {
        return element.appendChild(document.createTextNode(item));
      } else if (typeof item === "boolean") {
        return element.appendChild(document.createTextNode(item));
      } else if (typeof item.each === "function") {
        return item.each(append);
      } else if (typeof item.forEach === "function") {
        return item.forEach(append);
      } else {
        return element.appendChild(item);
      }
    };
    update = function(contents) {
      empty(element);
      return contents.forEach(append);
    };
    return update(contents);
  };

  bufferTo = function(context, collection) {
    return function(content) {
      if (typeof content === 'function') {
        content = Observable(content, context);
      }
      collection.push(content);
      return content;
    };
  };

  makeElement = function(name, context, attributes, fn) {
    var element;
    if (attributes == null) {
      attributes = {};
    }
    element = createElement(name);
    Observable(function() {
      if (attributes.id != null) {
        id(element, context, attributes.id);
        return delete attributes.id;
      }
    });
    Observable(function() {
      if (attributes["class"] != null) {
        classes(element, context, attributes["class"]);
        return delete attributes["class"];
      }
    });
    Observable(function() {
      return observeAttributes(element, context, attributes);
    }, context);
    if (element.nodeName !== "SELECT") {
      Observable(function() {
        return observeContent(element, context, fn);
      }, context);
    }
    return element;
  };

  Runtime = function(context) {
    var self;
    self = {
      buffer: function(content) {
        if (self.root) {
          throw "Cannot have multiple root elements";
        }
        return self.root = content;
      },
      element: makeElement,
      filter: function(name, content) {}
    };
    return self;
  };

  Runtime.VERSION = require("../package.json").version;

  Runtime.Observable = Observable;

  module.exports = Runtime;

  empty = function(node) {
    var child, _results;
    _results = [];
    while (child = node.firstChild) {
      _results.push(node.removeChild(child));
    }
    return _results;
  };

  valueIndexOf = function(options, value) {
    if (typeof value === "object") {
      return options.indexOf(value);
    } else {
      return options.map(function(option) {
        return option.toString();
      }).indexOf(value.toString());
    }
  };

  get = function(x) {
    if (typeof x === 'function') {
      return x();
    } else {
      return x;
    }
  };

}).call(this);

},{"../package.json":4,"o_0":5}],4:[function(require,module,exports){
module.exports={
  "name": "hamlet.coffee",
  "version": "0.7.6",
  "description": "Truly amazing templating!",
  "devDependencies": {
    "browserify": "^12.0.1",
    "coffee-script": "~1.7.1",
    "jsdom": "^7.2.0",
    "mocha": "^2.3.3"
  },
  "dependencies": {
    "hamlet-compiler": "0.7.0",
    "o_0": "0.3.8"
  },
  "homepage": "hamlet.coffee",
  "repository": {
    "type": "git",
    "url": "https://github.com/dr-coffee-labs/hamlet.git"
  },
  "scripts": {
    "prepublish": "script/prepublish",
    "test": "script/test"
  },
  "files": [
    "dist/"
  ],
  "main": "dist/runtime.js"
}

},{}],5:[function(require,module,exports){
(function (global){
// Generated by CoffeeScript 1.8.0
(function() {
  var Observable, PROXY_LENGTH, computeDependencies, copy, extend, flatten, get, last, magicDependency, remove, splat, tryCallWithFinallyPop,
    __slice = [].slice;

  module.exports = Observable = function(value, context) {
    var changed, fn, listeners, notify, notifyReturning, self;
    if (typeof (value != null ? value.observe : void 0) === "function") {
      return value;
    }
    listeners = [];
    notify = function(newValue) {
      return copy(listeners).forEach(function(listener) {
        return listener(newValue);
      });
    };
    if (typeof value === 'function') {
      fn = value;
      self = function() {
        magicDependency(self);
        return value;
      };
      changed = function() {
        value = computeDependencies(self, fn, changed, context);
        return notify(value);
      };
      changed();
    } else {
      self = function(newValue) {
        if (arguments.length > 0) {
          if (value !== newValue) {
            value = newValue;
            notify(newValue);
          }
        } else {
          magicDependency(self);
        }
        return value;
      };
    }
    self.each = function(callback) {
      magicDependency(self);
      if (value != null) {
        [value].forEach(function(item) {
          return callback.call(item, item);
        });
      }
      return self;
    };
    if (Array.isArray(value)) {
      ["concat", "every", "filter", "forEach", "indexOf", "join", "lastIndexOf", "map", "reduce", "reduceRight", "slice", "some"].forEach(function(method) {
        return self[method] = function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          magicDependency(self);
          return value[method].apply(value, args);
        };
      });
      ["pop", "push", "reverse", "shift", "splice", "sort", "unshift"].forEach(function(method) {
        return self[method] = function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return notifyReturning(value[method].apply(value, args));
        };
      });
      if (PROXY_LENGTH) {
        Object.defineProperty(self, 'length', {
          get: function() {
            magicDependency(self);
            return value.length;
          },
          set: function(length) {
            value.length = length;
            return notifyReturning(value.length);
          }
        });
      }
      notifyReturning = function(returnValue) {
        notify(value);
        return returnValue;
      };
      extend(self, {
        each: function(callback) {
          self.forEach(function(item, index) {
            return callback.call(item, item, index, self);
          });
          return self;
        },
        remove: function(object) {
          var index;
          index = value.indexOf(object);
          if (index >= 0) {
            return notifyReturning(value.splice(index, 1)[0]);
          }
        },
        get: function(index) {
          magicDependency(self);
          return value[index];
        },
        first: function() {
          magicDependency(self);
          return value[0];
        },
        last: function() {
          magicDependency(self);
          return value[value.length - 1];
        },
        size: function() {
          magicDependency(self);
          return value.length;
        }
      });
    }
    extend(self, {
      listeners: listeners,
      observe: function(listener) {
        return listeners.push(listener);
      },
      stopObserving: function(fn) {
        return remove(listeners, fn);
      },
      toggle: function() {
        return self(!value);
      },
      increment: function(n) {
        return self(value + n);
      },
      decrement: function(n) {
        return self(value - n);
      },
      toString: function() {
        return "Observable(" + value + ")";
      }
    });
    return self;
  };

  Observable.concat = function() {
    var arg, args, collection, i, o, _i, _len;
    args = new Array(arguments.length);
    for (i = _i = 0, _len = arguments.length; _i < _len; i = ++_i) {
      arg = arguments[i];
      args[i] = arguments[i];
    }
    collection = Observable(args);
    o = Observable(function() {
      return flatten(collection.map(splat));
    });
    o.push = collection.push;
    return o;
  };

  extend = function(target) {
    var i, name, source, _i, _len;
    for (i = _i = 0, _len = arguments.length; _i < _len; i = ++_i) {
      source = arguments[i];
      if (i > 0) {
        for (name in source) {
          target[name] = source[name];
        }
      }
    }
    return target;
  };

  global.OBSERVABLE_ROOT_HACK = [];

  magicDependency = function(self) {
    var observerSet;
    observerSet = last(global.OBSERVABLE_ROOT_HACK);
    if (observerSet) {
      return observerSet.add(self);
    }
  };

  tryCallWithFinallyPop = function(fn, context) {
    try {
      return fn.call(context);
    } finally {
      global.OBSERVABLE_ROOT_HACK.pop();
    }
  };

  computeDependencies = function(self, fn, update, context) {
    var deps, value, _ref;
    deps = new Set;
    global.OBSERVABLE_ROOT_HACK.push(deps);
    value = tryCallWithFinallyPop(fn, context);
    if ((_ref = self._deps) != null) {
      _ref.forEach(function(observable) {
        return observable.stopObserving(update);
      });
    }
    self._deps = deps;
    deps.forEach(function(observable) {
      return observable.observe(update);
    });
    return value;
  };

  try {
    Object.defineProperty((function() {}), 'length', {
      get: function() {},
      set: function() {}
    });
    PROXY_LENGTH = true;
  } catch (_error) {
    PROXY_LENGTH = false;
  }

  remove = function(array, value) {
    var index;
    index = array.indexOf(value);
    if (index >= 0) {
      return array.splice(index, 1)[0];
    }
  };

  copy = function(array) {
    return array.concat([]);
  };

  get = function(arg) {
    if (typeof arg === "function") {
      return arg();
    } else {
      return arg;
    }
  };

  splat = function(item) {
    var result, results;
    results = [];
    if (item == null) {
      return results;
    }
    if (typeof item.forEach === "function") {
      item.forEach(function(i) {
        return results.push(i);
      });
    } else {
      result = get(item);
      if (result != null) {
        results.push(result);
      }
    }
    return results;
  };

  last = function(array) {
    return array[array.length - 1];
  };

  flatten = function(array) {
    return array.reduce(function(a, b) {
      return a.concat(b);
    }, []);
  };

}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],6:[function(require,module,exports){
var css = "achievement {\n  color: #fff;\n  background-color: #00f;\n  border-radius: 32px;\n  bottom: 2em;\n  box-sizing: border-box;\n  display: block;\n  font-family: helvetica, sans-serif;\n  height: 64px;\n  left: 0;\n  margin: auto;\n  padding: 8px;\n  position: absolute;\n  right: 0;\n  width: 300px;\n}\nachievement > h2 {\n  font-size: 1.25em;\n  margin: 0;\n}\nachievement > p {\n  margin-top: 8px;\n  margin-bottom: 8px;\n}\nachievement > icon {\n  background-color: #fff;\n  border-radius: 32px;\n  color: #00f;\n  display: inline-block;\n  float: left;\n  font-size: 35px;\n  height: 48px;\n  line-height: 48px;\n  margin-right: 8px;\n  text-align: center;\n  width: 48px;\n}\n"; (require("browserify-css").createStyle(css, { "href": "style.css" }, { "insertAt": "bottom" })); module.exports = css;
},{"browserify-css":2}],7:[function(require,module,exports){
module.exports = function(data) {
  "use strict";
  return (function() {
    var __root;
    __root = require('hamlet.coffee')(this);
    __root.buffer(__root.element("achievement", this, {}, function(__root) {
      __root.buffer(__root.element("icon", this, {}, function(__root) {
        __root.buffer(this.icon);
      }));
      __root.buffer(__root.element("h2", this, {}, function(__root) {
        __root.buffer(this.title);
      }));
      __root.buffer(__root.element("p", this, {}, function(__root) {
        __root.buffer(this.text);
      }));
    }));
    return __root.root;
  }).call(data);
};

},{"hamlet.coffee":3}]},{},[1])(1)
});