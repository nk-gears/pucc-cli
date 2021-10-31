#!/usr/bin/env node

const meow = require('meow')
const prop = k => o => o[k]
const pipe = (...fns) => x => [...fns].reduce((acc, f) => f(acc), x)

const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');
const inquirer=require('inquirer');
const alert = require('cli-alerts');

const siconstore = () => ({
    cli: meow(`
        Usage
        $ pucc [command]

        Available Commands

        $ split publish
        $ build latest
    `),
    action: cli => cli.showHelp(),
})
siconstore.split = () => ({
    cli: meow(`
        Usage
            $ pucc split --sourceFolder --targetConnectorFolder
        Description
            Uses stdin to publish json to app-store
    `),
    action: cli => {
        console.log(cli.flags)
    }
})

const getSubcommand = (cliObject, level) => pipe(
    prop('input'),
    prop(level),
    name => prop(name)(cliObject),
)(prop('cli')(cliObject()))



async function promptForMissingOptionsForSplit(options) {
 
	if (options.skipPrompts) {
	  return {
		...options
	  };
	}
  
	const questions = [];
	if (!options.folderPath) {
	  questions.push({
		type: 'text',
		name: 'folderPath',
		message: 'Please enter the custom connector folder path'
	  });
	}


  
	const answers = await inquirer.prompt(questions);
	return {
	  ...options,
	  folderPath: options.folderPath || answers.folderPath
	};
}



const cli = (cliObject, level = 0) => {
    const { cli: nextCli, action } = cliObject()
    const subCommand = getSubcommand(cliObject, level)
    return subCommand ? 
        cli(subCommand, level + 1) :
        nextCli.flags.help ?
            nextCli.showHelp() :
            action(nextCli)
}

cli(siconstore)