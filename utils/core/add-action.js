const chalk = require('chalk');
const fs = require('fs');
const Listr = require('listr');
const path = require('path');
const fsutil=require("../fsutil");

function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

const addActionFile=async options =>{
    const baseFolder=path.join(path.resolve(options.targetDirectory),"resources");
    const defaultActionInfo=require("../config/action-template.json");
    const methodName=options.methodName || 'get';
    const actionName=options.name || 'someName';
    const actualPath=options.path || '/';
    defaultActionInfo[methodName].operationId=toTitleCase(methodName) +toTitleCase(actionName);

    const actionPathInfo={
        [actualPath]:{[methodName]:defaultActionInfo[methodName]}
    }
    //#TODO if fie not exists. don't overwrite the file
	fsutil.createJSONFile(baseFolder,`${methodName}-${defaultActionInfo[methodName].operationId}`,actionPathInfo);		
	return Promise.resolve();
}

const addAction = async options => {
    console.log("testing");
	options = {
		...options,
		targetDirectory: options.targetFolder || process.cwd()
	};
	/*if(options.targetDirectory.includes("./")){
		options.targetDirectory=process.cwd();
	}*/
    options.targetDirectory=path.resolve(options.targetDirectory);

	try {
		console.log(options);
	} catch (err) {
		console.error('%s Invalid template name', chalk.red.bold('ERROR'));
		process.exit(1);
	}

	const tasks = new Listr(
		[
			{
				title: 'Adding action',
				task: () => addActionFile(options)
			}
		],
		{
			exitOnError: false
		}
	);

	await tasks.run();
	console.log('%s Connector ready', chalk.green.bold('DONE'));
	return true;
};


module.exports = async options => {
	return addAction(options);
};
