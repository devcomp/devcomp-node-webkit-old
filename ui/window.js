
exports.main = function(options) {

	var PATH = require("path");
	var PINF = require("../node_modules/pinf");
	var GUI = window.require("nw.gui");

	var config = PINF.for(module, "github.com/devcomp/devcomp/0").config();

	function initUI() {
		var $ = options.API.window.$;

		$("body").layout({
			maskIframesOnResize: true,
			stateManagement__enabled: true,
			resizable: false,
			north__size: 100
		});

		function addButtonForTool(path) {

			var toolConfig = PINF.for(path, "github.com/devcomp/devcomp/0").config();

			var button = $('<button>' + (toolConfig.label || path) + '</button>');
			button.on("click", function() {

				$("#tool-frame").attr("src", PATH.join(path, toolConfig.pinf.main || ""));

				// TODO: Wait for on-load event instead?
				var toolIframe = $("#tool-frame").get()[0];
				var sanityCount = 0;
				var waitId = setInterval(function() {
					if (toolIframe.contentWindow && toolIframe.contentWindow.__devcomp_sub_context__init) {
						clearInterval(waitId);
						toolIframe.contentWindow.__devcomp_sub_context__init({
							API: {
								NODE: {
									require: require,
									process: process
								},
								GUI: GUI
							},
							config: config
						});
						delete toolIframe.contentWindow.__devcomp_sub_context__init;
					} else {
						sanityCount += 1;
						if (sanityCount > 100) {
							console.error("ERROR: Tool UI took too long to load. Please reload the tool.");
							clearInterval(waitId);
						}
					}
				}, 50);
			});
			$("#menu").append(button);
		}

		(config.tools || []).forEach(function(uri) {
			if (/^\./.test(uri)) {
				addButtonForTool(PATH.join(config.pinf.paths.program, "..", uri));
			} else {
				// TODO: Implement dynamic install via `sm`.
				if (/^github\.com\/devcomp\/devcomp-tool-welcome/.test(uri)) {
					addButtonForTool("./node_modules/devcomp-tool-welcome/ui");
				} else {
					console.log("NYI: Dynamic install of tools via `sm`", uri);
				}
			}
		});
	}

	function initWindowLifecycle() {
		var win = GUI.Window.get();
		var localStorage = options.API.window.localStorage;
		// @credit https://github.com/rogerwang/node-webkit/wiki/Preserve-window-state-between-sessions
		win.on('close', function() {
			localStorage.x      = win.x;
			localStorage.y      = win.y;
			localStorage.width  = win.width;
			localStorage.height = win.height;
			this.close(true);
		});
		if (localStorage.width && localStorage.height) {
			win.resizeTo(parseInt(localStorage.width), parseInt(localStorage.height));
			win.moveTo(parseInt(localStorage.x), parseInt(localStorage.y));
		}
		win.show();
	}

	initUI();
	initWindowLifecycle();
}
