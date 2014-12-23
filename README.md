risk-in-meteor
==============

RISK in Meteor

*NOTE: This was a hackathon project, and does not represent good practices for coding. It was a pure learning experiment to see what was possible with Meteor in about a day and a half.*


## to debug server-side

* Stop normal meteor server
* Run debug server `meteor debug`
* Put debugger statement in server side code
* Go to http://localhost:8080/debug?port=5858 and make sure it has a paragraph talking about "// The debugger pauses here when you run `meteor debug`, because this is ..."
* Open / refresh localhost:3000
* Click the "Play" button (it should be enabled, refresh if not) in the localhost:8080 debug control panel on right (not chrome dev tools, it's  tools within a tools)
* Wait and pray it hits the statement (it can take up to 15 sec top hit)
