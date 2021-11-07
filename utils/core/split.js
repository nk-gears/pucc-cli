const ora = require('ora');
const { dim, red, yellow } = require('chalk');
const handleError = require('cli-handle-error');
const spinner = ora({ text: '' });
const fs = require('fs');
const fx = require('mkdir-recursive');



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

function createBaseMeta({ apiDefContent, apiPropContent,targetPath }) {
    const defData={...apiDefContent};
    defData.paths= defData.definitions=defData.parameters={};
    createJSONFile(`${targetPath}`, `base.info`, defData);
	const propContent={...apiPropContent};
	propContent.policyTemplateInstances={};
	createJSONFile(`${targetPath}`, `base.prop`, apiPropContent);

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

const ensureDirectories=(targetFolderPath)=>{
	const rootDirs=["policies","resources","definitions","parameters","basemeta"];
	rootDirs.map(dirName=>{
		fx.mkdirSync(`${targetFolderPath}/${dirName}`)
	});
	

};

module.exports = async inputOptions => {
	console.log("test")
	const basePath = inputOptions.sourceFolderPath;
	const targetFolderPath = inputOptions.targetFolderPath;
    return new Promise((resolve,reject)=>{

	let apiDef = inputOptions.apiDefFileName || 'apiDefinition.swagger.json';
	let apiProp = inputOptions.apiPropFileName || 'apiProperties.json';
	const apiDefContent = require(`${basePath}/${apiDef}`);
	const apiPropContent = require(`${basePath}/${apiProp}`);

	ensureDirectories(targetFolderPath);
	createResources({
		apiDefContent,
		targetPath: `${targetFolderPath}/resources`
	});
	createDefinitions({ apiDefContent, targetPath: `${targetFolderPath}/definitions` });
	createParameters({ apiDefContent, targetPath: `${targetFolderPath}/parameters` });
	createBaseMeta({ apiDefContent,apiPropContent, targetPath: `${targetFolderPath}/basemeta` });
	createPolicies({ apiPropContent, targetPath: `${targetFolderPath}/policies` });
    resolve();
    })
};
