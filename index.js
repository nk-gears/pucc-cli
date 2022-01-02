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
const inquirer = require('inquirer');
const alert = require('cli-alerts');
const core = require('./utils/core');

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

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

const handleSplit=async ()=>{
  await alert({
    type: 'info',
    name: `Power Up Custom Connector Cli`,
    msg: `Split Connector Files`
  });
   await core.split(flags);
}

const handleBuild=async ()=>{
  console.log(flags);

  await alert({
    type: 'info',
    name: `Power Up Custom Connector Cli`,
    msg: `Build Connector Files`
  });
  await core.build(flags);
}

const handleCreate=async ()=>{
  await alert({
    type: 'info',
    name: `Power Up Custom Connector Cli`,
    msg: `Split Connector Files`
  }) && await split(flags);
}

const handleAddAction=async ()=>{
  await alert({
    type: 'info',
    name: `Power Up Custom Connector Cli`,
    msg: `Add Action`
  }) && await split(flags);
}

const handleAddPolicy=async ()=>{
  await alert({
    type: 'info',
    name: `Power Up Custom Connector Cli`,
    msg: `Add Policy`
  }) && await core.split(flags);
}


(async () => {
 // init({ clear });
  const isCommand = (c) => input.includes(c);
  input.includes(`help`) && cli.showHelp(0);

   //await handleSplit()
  
  isCommand(`split`) && (await handleSplit());
  isCommand(`build`) && handleBuild();
  isCommand(`create`) && handleCreate();
  isCommand(`add-action`) && handleAddAction();
  isCommand(`add-policy`) && handleAddPolicy();

})();


/*

  flags.split &&
    await alert({
      type: 'info',
      name: `Power Up Custom Connector Cli`,
      msg: `Split Connector Files`
    }) && await split(flags);

  const inputOptions = {};

  await build(flags);

  /*flags.create &&
  (await promptForMissingOptions(options)) &&
  (await create(options));

  debug && log(flags);

  const path = require('path');
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
  */