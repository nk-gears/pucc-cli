#!/usr/bin/env node

/**
 * pucc
 * PowerUp Custom Connector CLI
 *
 * @author Nirmal Kumar <https://twitter.com/nirmal_kumar/>
 */

const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');
const inquirer=require('inquirer');
const alert = require('cli-alerts');
const create = require('./utils/core/create');


const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

(async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);
	flags.split &&
		alert({
			type: 'info',
			name: `Power Up Custom Connector Cli`,
			msg: `Schedule`
		});


	const path=require('path');
	const fullPathName = process.cwd();
	const targetDir = path.resolve(
	fullPathName.substr(fullPathName.indexOf('/')),
	'./freeagent'
	);
 
	const options = {
		name: 'freeagent',
		targetDirectory: targetDir,
		template: 'default'
		//templateDirectory:''
	};


	async function promptForMissingOptions(options) {
		const defaultTemplate = 'default';
		if (options.skipPrompts) {
		  return {
			...options,
			template: options.template || defaultTemplate,
		  };
		}
	  
		const questions = [];
		if (!options.name) {
		  questions.push({
			type: 'text',
			name: 'template',
			message: 'Please enter the name of the connector',
			default: 'my-connector-1',
		  });
		}
	  
		if (!options.git) {
		  questions.push({
			type: 'confirm',
			name: 'filepicker',
			message: 'Need filepicker capability ?',
			default: false,
		  });
		}
	  
		const answers = await inquirer.prompt(questions);
		return {
		  ...options,
		  template: options.template || answers.template,
		  filepicker: options.filepicker || answers.git,
		};
	}

	flags.create && 
		(await promptForMissingOptions(options)) &&
		(await create(options));
	debug && log(flags);
})();
