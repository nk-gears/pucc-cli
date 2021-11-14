const chalk = require('chalk');
const fs = require('fs');
const Listr = require('listr');
const path = require('path');
const fsutil=require("../fsutil");

async function createDefaultFiles(options) {
	const defaultBaseInfo=require("../config/base.info.json");	
	const defaultPropInfo=require("../config/base.prop.json");	
	defaultBaseInfo.info.title=options.name;
	const baseFolder=path.join(options.targetDirectory,"basemeta");
	fsutil.createJSONFile(baseFolder,"base.info",defaultBaseInfo);		
	fsutil.createJSONFile(baseFolder,"base.prop",defaultPropInfo);
	return Promise.resolve();
}

async function createCoreFolders(options) {
	const folders=["basemeta","definitions","parameters","policies","resources"];
	folders.forEach(f=>{
		var actualPath=path.join(options.targetDirectory,f);
		fsutil.mkdir(actualPath);
	});
}

const create = async options => {
	options = {
		...options,
		targetDirectory: options.targetFolder || process.cwd()
	};
	if(options.targetDirectory.includes("./")){
		options.targetDirectory=process.cwd();
	}
	fsutil.mkdir(options.targetDirectory);
	options.targetDirectory=path.join(options.targetDirectory,options.name);
	await createCoreFolders(options);
	try {
		console.log(options);
	} catch (err) {
		console.error('%s Invalid template name', chalk.red.bold('ERROR'));
		process.exit(1);
	}

	const tasks = new Listr(
		[
			{
				title: 'Create core folders',
				task: () => createCoreFolders(options)
			},
			{
				title: 'Create default files',
				task: () => createDefaultFiles(options)
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

// /module.exports={create};

module.exports = async options => {
	return create(options);
};
