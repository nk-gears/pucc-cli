const meow = require('meow');
const meowHelp = require('cli-meow-help');

const flags = {
	split: {
		type: 'boolean',
		default: false,
		alias: 's',
		desc: `Split a Swagger file to separate path files to a target directory`
	},
	validate: {
		type: 'boolean',
		default: false,
		alias: 'v',
		desc: `Validate the final build file. `
	},
	publish: {
		type: `boolean`,
		default: true,
		alias: `p`,
		desc: `Publish to target Power Automate environment`
	},
	create: {
		type: `boolean`,
		default: true,
		alias: `c`,
		desc: `Create a new connector`
	},
	create: {
		type: `boolean`,
		default: true,
		alias: `c`,
		desc: `Create a new connector`
	},
	addAction: {
		type: `boolean`,
		default: true,
		alias: `aa`,
		desc: `Add a action to the current connector`
	},
	addTrigger: {
		type: `boolean`,
		default: true,
		alias: `at`,
		desc: `Add a new trigger to the current connector`
	},
	version: {
		type: `boolean`,
		alias: `v`,
		desc: `Print CLI version`
	}
};

const commands = {
	help: { desc: `Print help info` }
};

const helpText = meowHelp({
	name: `pucc`,
	defaults: false,
	flags,
	commands
});

const options = {
	inferType: true,
	description: false,
	hardRejection: false,
	flags
};

module.exports = meow(helpText, options);
