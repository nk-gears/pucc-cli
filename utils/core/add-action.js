const chalk = require('chalk');
const fs = require('fs');
const Listr = require('listr');
const path = require('path');
const fsutil=require("../fsutil");

const addActionFile=async options =>{
    const baseFolder=path.join(options.targetDirectory,"resources");
    const methodName=options.methodName;
    const actionName=options.name;
    const actionPath=option.path;

 

	fsutil.createJSONFile(baseFolder,"base.info",defaultBaseInfo);		

	return Promise.resolve();
}

const addAction = async options => {
	options = {
		...options,
		targetDirectory: options.targetFolder || process.cwd()
	};
	if(options.targetDirectory.includes("./")){
		options.targetDirectory=process.cwd();
	}

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
