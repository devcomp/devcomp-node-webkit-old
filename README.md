*STATUS: DEV*

DeveloperCompanion (devcomp)
============================

*A developer toolbox built on NodeJS.*

Status: ALPHA
-------------

  * License: [UNLICENSE](http://unlicense.org/)
  * Mailing list: [groups.google.com/group/devcomp](http://groups.google.com/group/sourcemint)
  * Author: [Christoph Dorn](http://www.christophdorn.com/)
  * Sponsor: [Christoph Dorn](http://www.christophdorn.com/)


Install
-------

Requirements:

  * OSX

Instructions:

	npm install -g devcomp
	# Follow instructions to put the `devcomp` command on your `PATH`.


Description
-----------

DeveloperCompanion is a tool container that can be used to improve the development
workflow of any project. It turns a filesystem based project into an interactive workspace
into which tools are loaded to provide functionality.


Usage
-----

  export SM_WORKSPACE_HOME=/path/to/project
	devcomp [-start]
	# The companion window should launch.
	devcomp --stop


Troubleshooting
---------------

  * Close window to restart and thus reload code for good.
  * Double-click on tool menu button to reload tool (NYI).
  * Tail log for errors and `console.log` messages: `tail -f .rt/log/github.com+devcomp+devcomp++singleton/mon.log`
