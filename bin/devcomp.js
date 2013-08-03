
const PATH = require("path");
const FS = require("sm-util/lib/fs");
const PINF = require("pinf").for(module);
const OS = require("sm-util/lib/os");


exports.main = function(callback) {

	var workspaceHome = process.env.SM_WORKSPACE_HOME;
	if (!workspaceHome || !FS.existsSync(workspaceHome)) {
		console.error("`SM_WORKSPACE_HOME` not set!");
		return callback(null);
	}

	var config = PINF.config();

	var monPidPath = PATH.join(config.pinf.paths.pid, "mon.pid");
	FS.mkdirsSync(PATH.dirname(monPidPath));
	var monLogPath = PATH.join(config.pinf.paths.log, "mon.log");
	FS.mkdirsSync(PATH.dirname(monLogPath));

	if (process.argv.indexOf("--stop") !== -1) {

		if (FS.existsSync(monPidPath)) {
			var pid = parseInt(FS.readFileSync(monPidPath).toString());
			FS.unlinkSync(monPidPath);
			process.kill(pid, "SIGTERM");
		}
/*
		return OS.exec("ps axuww | grep mon", {
			cwd: PATH.dirname(__dirname)
		}).then(function(stdout) {
			if (stdout) {
				stdout.split("\n").forEach(function(line) {
					if (line.indexOf(monPidPath) !== -1) {
						var pid = line.match(/^\S+\s+(\d+)\s+/)[1];
						process.kill(pid, "SIGTERM");
					}
				});
			}
			return callback(null);
		}, callback);
*/
		return callback(null);

	} else {
	//if (process.argv.indexOf("--start") !== -1) {

		return OS.spawnInline("mon", [
			"--log", monLogPath,
			"--mon-pidfile", monPidPath,
			"--daemonize",
			PATH.join(__dirname, "../.sm/bin/nw") + " " + PATH.join(__dirname, "../ui")
		], {
			cwd: PATH.dirname(__dirname)
		}).then(function() {
			return callback(null);
		}, callback);
	}
}


if (require.main === module) {
	exports.main(function(err) {
		if (err) {
			console.error(err.stack);
			return process.exit(1);
		}
		return process.exit(0);
	});
}
