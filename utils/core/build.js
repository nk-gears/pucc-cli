const ora = require('ora');
const { dim, red, yellow } = require('chalk');
const handleError = require('cli-handle-error');
const spinner = ora({ text: '' });
const fs = require('fs');
const fsutil = require('../fsutil');
const resolvePath= require('path').resolve;


const getJSONContentFromFile = (filepath) => {
  let finalContentList = getContentListFromFileList([filepath]);
  return finalContentList[0].content;
}

const getContentListFromFileList = (fileList) => {
  let finalContentList = [];
  fileList.forEach((f) => {
    const fileContent = require(f);
    finalContentList.push({ filename: f, content: fileContent });
  });
  return finalContentList;
}

const buildApiSwaggerFile = (options, coreInfo) => {

  let finalResourceList = {};
  let files = coreInfo.resources;
  coreInfo.resources.forEach((f) => {
    const fileContent = f.content;
    const pathName = Object.keys(fileContent)[0];
    const pathNameInfo = fileContent[pathName];
    const pathMethodName = Object.keys(pathNameInfo)[0];
    let isEventNotify;
    if (finalResourceList[pathName]) {
      isEventNotify = false;
      finalResourceList[pathName][[pathMethodName]] = fileContent[pathName][pathMethodName];
    } else {
      finalResourceList[pathName] = {};
      isEventNotify = true;
      finalResourceList[pathName][pathMethodName] = fileContent[pathName][pathMethodName];
    }
  });

  // massage the data in the finalResourceList
  const originalBase = coreInfo.baseContent.baseInfo;
  
  //Load all files from folders
  const parameter_files = coreInfo.parameters;
  let parameters = originalBase.parameters;
  parameter_files.map(p => {
    parameters = { ...parameters, ...p.content };
  });

  const definitions_files =coreInfo.definitions;
  let definitions = originalBase.definitions;
  definitions_files.map(d => {
    definitions = { ...definitions, ...d.content };
  });

  const originalPaths = originalBase.paths;
  let finalresp = {};
  finalresp = { ...originalBase, paths: { ...originalPaths, ...finalResourceList } };
  let newPaths = {};
  Object.keys(finalresp.paths).map(p => {
    let hasKeys = Object.keys(finalresp.paths[p]).length > 0;
    if (hasKeys) newPaths[p] = finalresp.paths[p];
  });
  finalresp.paths = newPaths;
  finalresp.definitions = { ...definitions };
  finalresp.parameters = { ...parameters };

  fsutil.createJSONFile(options.targetFolderPath, "apiDefinition.swagger", finalresp);

};

const buildApiPropertiesFile = (options, coreInfo) => {
   const policy_files = coreInfo.baseContent.policies;

   let policies = [];
   policy_files.map(p => {
    policies.push(p.content);
   });

  const apiPropContent = coreInfo.baseContent.propInfo;
  const policyInstances=apiPropContent.properties.policyTemplateInstances || []
  var finalPolicies = [...policyInstances, ...policies];
  apiPropContent.properties.policyTemplateInstances = finalPolicies;
  fsutil.createJSONFile(options.targetFolderPath,'apiProperties', apiPropContent);
}


module.exports = async options => {

  spinner.start(dim(`Preparing to Build…\n`));
  const sourceFolderPath = resolvePath(options.sourceFolderPath);
  console.log(sourceFolderPath);
  //process.exit();
  const targetFolderPath = resolvePath(options.targetFolderPath);
  options.targetFolderPath=targetFolderPath;
  return new Promise((resolve, reject) => {

    //load the core files
    const resources = getContentListFromFileList(fsutil.findFilesInDir(`${sourceFolderPath}/resources`, ".json"));
    const definitions = getContentListFromFileList(fsutil.findFilesInDir(`${sourceFolderPath}/definitions`, ".json"));
    const parameters = getContentListFromFileList(fsutil.findFilesInDir(`${sourceFolderPath}/parameters`, ".json"));
    const policies = getContentListFromFileList(fsutil.findFilesInDir(`${sourceFolderPath}/policies`, ".json"));

    const baseInfo = getJSONContentFromFile(`${sourceFolderPath}/basemeta/base.info.json`);
    const basePropInfo = getJSONContentFromFile(`${sourceFolderPath}/basemeta/base.prop.json`);

    const coreInfo = { baseContent: { baseInfo: baseInfo, propInfo: basePropInfo,policies:policies }, resources, definitions, parameters };
    fsutil.mkdir(options.targetFolderPath);
    console.log(dim(`❯❯ Generating Swagger file`));
    buildApiSwaggerFile(options, coreInfo);
    console.log(dim(`❯❯ Generating Properties file`));
    buildApiPropertiesFile(options, coreInfo);
  
    spinner.stop();
    console.log(dim(`❯❯ Build Complete. File available in ./dist`));
    resolve();
  })
};
