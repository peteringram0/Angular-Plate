exports.config = {
	chromeOnly: true,
	directConnect: true,
	seleniumAddress: 'http://localhost:4444/wd/hub',
	allScriptsTimeout: 11000,
	specs: [
		'*.js'
	],
	capabilities: {
		'browserName': 'chrome'
	},
	baseUrl: 'http://localhost:3000/',
	framework: 'jasmine',
	jasmineNodeOpts: {
		showColors: true,
		defaultTimeoutInterval: 30000
	}
};
