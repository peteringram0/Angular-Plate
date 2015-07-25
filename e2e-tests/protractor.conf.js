exports.config = {

	allScriptsTimeout: 11000,

	specs: [
		'*.js'
	],

	multiCapabilities: [
		//'browserName': 'firefox'},
		{'browserName': 'chrome'}
	],

	baseUrl: 'http://localhost:3000/',

	framework: 'jasmine2',

	jasmineNodeOpts: {
		defaultTimeoutInterval: 30000
	},

	seleniumAddress: 'http://localhost:4444/wd/hub'

};
