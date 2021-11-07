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
 
 const create = require('./utils/core/new');
 
 const input = cli.input;
 const flags = cli.flags;
 const { clear, debug } = flags;
 
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
 
 
 (async () => {
     init({ clear });
     input.includes(`help`) && cli.showHelp(0);
     console.log(input)
     flags.split &&
         await alert({
             type: 'info',
             name: `Power Up Custom Connector Cli`,
             msg: `Split Connector Files`
         });
         await promptForMissingOptionsForSplit(options);
     /*flags.create && 
     (await promptForMissingOptions(options)) &&
     (await create(options));*/		
 
     debug && log(flags);
 })();
 