const chalk = require('chalk');
const fs = require('fs');
const gitignore = require('gitignore');
const Listr = require('listr');
const ncp = require('ncp');
const path = require('path');
//const { projectInstall } = require('pkg-install');
const { promisify } = require('util');
const replaceInFiles = require('replace-in-files');
const access = promisify(fs.access);
const writeFile = promisify(fs.writeFile);
const copy = promisify(ncp);
const writeGitignore = promisify(gitignore.writeFile);

async function copyTemplateFiles(options) {
	console.log(options.targetDirectory)
	await copy(options.templateDirectory, options.targetDirectory, {
		clobber: false
	});

	const _params={
		files: [
			options.targetDirectory + "/**/*.*" 
		],
		from: '{{CONNECTOR_NAME}}',  // string or regex
		to: options.name, // string or fn  (fn: carrying last argument - path to replaced file)
	  

	};
	try {
		const {
		changedFiles,
		countOfMatchesByPaths,
		replaceInFilesOptions
		} = await replaceInFiles(_params);
		console.log('Modified files:', changedFiles);
		console.log('Count of matches by paths:', countOfMatchesByPaths);
		console.log('was called with:', replaceInFilesOptions);
	} catch (error) {
		console.log('Error occurred:', error);
	}

	return Promise.resolve();

}

async function createGitignore(options) {
	const file = fs.createWriteStream(
		path.join(options.targetDirectory, '.gitignore'),
		{ flags: 'a' }
	);
	return writeGitignore({
		type: 'Node',
		file: file
	});
}

const create = async options => {
	options = {
		...options,
		targetDirectory: options.targetDirectory || process.cwd()
	};

	const fullPathName = __dirname;
	const templateDir = path.resolve(
		fullPathName.substr(fullPathName.indexOf('/')),
		'../../templates',
		options.template.toLowerCase()
	);
	console.log(templateDir);
	options.templateDirectory = templateDir;

	try {
		console.log(templateDir);
		await access(templateDir, fs.constants.R_OK);
	} catch (err) {
		console.error('%s Invalid template name', chalk.red.bold('ERROR'));
		process.exit(1);
	}

	const tasks = new Listr(
		[
			{
				title: 'Copy connector files',
				task: () => copyTemplateFiles(options)
			},
			{
				title: 'Create gitignore',
				task: () => createGitignore(options)
			}
			/* {
        title: 'Create License',
        task: () => createLicense(options),
      }
      {
        title: 'Install dependencies',
        task: () =>
          projectInstall({
            cwd: options.targetDirectory,
          }),
        skip: () =>
          !options.runInstall
            ? 'Pass --install to automatically install dependencies'
            : undefined,
      }*/
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
