const ora = require('ora');
const { dim, red, yellow } = require('chalk');
const handleError = require('cli-handle-error');
const spinner = ora({ text: '' });
const fs = require('fs');

const createJSONFile = function (targetPath, filename, fcontent) {
	const fd = fs.openSync(`${targetPath}/${filename}.json`, 'w+');
	var resp = JSON.stringify(fcontent, null, 2);
    if(resp && resp.length>0)
	    fs.writeSync(fd, resp);    
};

const createResources = ({ apiDefContent, targetPath }) => {
    const apiDefContentPaths=apiDefContent.paths;
    const paths = Object.keys(apiDefContentPaths);
	paths.forEach(path => {
		const methods = Object.keys(apiDefContentPaths[path]);
		methods.forEach(mtd => {
			const operationId = apiDefContentPaths[path][mtd].operationId;
			if (operationId) {
				fcontent = { [path]: { [mtd]: apiDefContentPaths[path][mtd] } };
				let filename = `${mtd}-${operationId}`;
				createJSONFile(targetPath, filename, fcontent);
			} else {
				let stripPath = path.replace(/\//g, '-');
				fcontent = { [path]: { [mtd]: apiDefContentPaths[path][mtd] } };
				let filename = `${mtd}-${stripPath}`;
				createJSONFile(targetPath, filename, fcontent);
			}
		});
	});
};

function createBaseMeta({ apiDefContent, targetPath }) {
    const defData={...apiDefContent};
    defData.paths= defData.definitions=defData.parameters={};
    createJSONFile(`${targetPath}`, `conn.basemeta`, defData);

}
function createPolicies({ apiPropContent, targetPath }) {
    if(!apiPropContent.properties.policyTemplateInstances) return;
    const policies=apiPropContent.properties.policyTemplateInstances;
	policies.forEach(propDef => {
		createJSONFile(`${targetPath}`, `${propDef.title}`, propDef);
	});
}

function createParameters({ apiDefContent, targetPath }) {
	const parameters = Object.keys(apiDefContent.parameters);
	parameters.forEach(propDef => {
		console.log(`${targetPath}/${propDef}`);
		createJSONFile(`${targetPath}`, `${propDef}`, apiDefContent.parameters[propDef]);
	});
}
function createDefinitions({ apiDefContent, targetPath }) {
	const definitions = Object.keys(apiDefContent.definitions);
	definitions.forEach(propDef => {
		createJSONFile(`${targetPath}`, `${propDef}`, apiDefContent.definitions[propDef]);
	});
}

module.exports = async inputOptions => {

	const basePath = inputOptions.sourceFolderPath;
	const targetFolderPath = inputOptions.targetFolderPath;
    return new Promise((resolve,reject)=>{

	let apiDef = inputOptions.apiDefFileName || 'apiDefinition.swagger.json';
	let apiProp = inputOptions.apiPropFileName || 'apiProperties.json';
	const apiDefContent = require(`${basePath}/${apiDef}`);
	const apiPropContent = require(`${basePath}/${apiProp}`);

	createResources({
		apiDefContent,
		targetPath: `${basePath}/fa/resources`
	});
	createDefinitions({ apiDefContent, targetPath: `${targetFolderPath}/definitions` });
	createParameters({ apiDefContent, targetPath: `${targetFolderPath}/parameters` });
	createBaseMeta({ apiDefContent,apiPropContent, targetPath: `${targetFolderPath}/basemeta` });
	createPolicies({ apiPropContent, targetPath: `${targetFolderPath}/policies` });
    resolve();
    })
};
