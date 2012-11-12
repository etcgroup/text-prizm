/**
 * This file is a horrible Frankenstein of two runners for PhantomJS:
 * 
 * https://github.com/larrymyers/jasmine-reporters/blob/master/test/phantomjs-testrunner.js
 * This possibly more powerful runner allows for console printouts and
 * JUnit-style xml output, but alas doesn't actually work on its own for
 * some reason.
 *
 * https://github.com/jcarver989/phantom-jasmine/blob/master/lib/run_jasmine_test.coffee
 * This simple runner only provides console output, but it works.
 *
 * The combined runner includes xml printout capabilities from the former,
 * while maintaining the general structure and work-i-ness of the latter.
 */
(function() {
  var PhantomJasmineRunner, address, page, runner;

  PhantomJasmineRunner = (function() {

    function PhantomJasmineRunner(page, exit_func) {
      this.page = page;
      this.exit_func = exit_func != null ? exit_func : phantom.exit;
      this.tries = 0;
      this.max_tries = 10;
    }

    PhantomJasmineRunner.prototype.get_status = function() {
      return this.page.evaluate(function() {
        return console_reporter.status;
      });
    };

    PhantomJasmineRunner.prototype.terminate = function() {
        var fs = require("fs"),
            xml_results = getXmlResults(page, resultsKey),
            output;

        for (var filename in xml_results) {
            if (xml_results.hasOwnProperty(filename) && (output = xml_results[filename]) && typeof(output) === "string") {
                fs.write(filename, output, "w");
            }
        }


      switch (this.get_status()) {
        case "success":
          return this.exit_func(0);
        case "fail":
          return this.exit_func(1);
        default:
          return this.exit_func(2);
      }
    };

    return PhantomJasmineRunner;

  })();

  if (phantom.args.length === 0) {
    console.log("Need a url as the argument");
    phantom.exit(1);
  }

  page = new WebPage();

  runner = new PhantomJasmineRunner(page);

  function isFinished() {
    return page.evaluate(function(){
        // if there's a JUnitXmlReporter, return a boolean indicating if it is finished
        if (jasmine.JUnitXmlReporter) {
            return jasmine.JUnitXmlReporter.finished_at !== null;
        }
    });
  }

  page.onConsoleMessage = function(msg) {
    console.log(msg);
    if (msg === "ConsoleReporter finished") {
        setInterval(function() {
            if (isFinished()) {
                return runner.terminate();
            }
        }, 100);
    }
  };

  address = phantom.args[0];

  page.open(address, function(status) {
    if (status !== "success") {
      console.log("can't load the address!");
      return phantom.exit(1);
    }
  });

  var resultsKey = "__jr" + Math.ceil(Math.random() * 1000000);
  page.onInitialized = function() {
    overloadPageEvaluate(page);
    setupWriteFileFunction(page, resultsKey);
  }

    /**
     * Replaces the "evaluate" method with one we can easily do substitution with.
     *
     * @param {phantomjs.WebPage} page The WebPage object to overload
     */
    function overloadPageEvaluate(page) {
        page._evaluate = page.evaluate;
        page.evaluate = function(fn, replacements) { return page._evaluate(replaceFunctionPlaceholders(fn, replacements)); };
        return page;
    }

    /** Stubs a fake writeFile function into the test runner.
     *
     * @param {phantomjs.WebPage} page The WebPage object to inject functions into.
     * @param {string} key The name of the global object in which file data should
     *                     be stored for later retrieval.
     */
    // TODO: not bothering with error checking for now (closed environment)
    function setupWriteFileFunction(page, key) {
        page.evaluate(function(){
            window["%resultsObj%"] = {};
            window.__phantom_writeFile = function(filename, text) {
                window["%resultsObj%"][filename] = text;
            };
        }, {resultsObj: key});
    }

    /**
     * Returns the loaded page's filename => output object.
     *
     * @param {phantomjs.WebPage} page The WebPage object to retrieve data from.
     * @param {string} key The name of the global object to be returned. Should
     *                     be the same key provided to setupWriteFileFunction.
     */
    function getXmlResults(page, key) {
        return page.evaluate(function(){
            return window["%resultsObj%"] || {};
        }, {resultsObj: key});
    }

    // Thanks to hoisting, these helpers are still available when needed above
    /**
     * Stringifies the function, replacing any %placeholders% with mapped values.
     *
     * @param {function} fn The function to replace occurrences within.
     * @param {object} replacements Key => Value object of string replacements.
     */
    function replaceFunctionPlaceholders(fn, replacements) {
        if (replacements && typeof replacements === "object") {
            fn = fn.toString();
            for (var p in replacements) {
                if (replacements.hasOwnProperty(p)) {
                    var match = new RegExp("%" + p + "%", "g");
                    do {
                        fn = fn.replace(match, replacements[p]);
                    } while(fn.indexOf(match) !== -1);
                }
            }
        }
        return fn;
    }
}).call(this);
