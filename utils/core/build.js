const ora = require('ora');
const { dim, red, yellow } = require('chalk');
const handleError = require('cli-handle-error');
const spinner = ora({ text: '' });
const fs = require('fs');
const fsutil = require('../fsutil');

const getContentListFromFileList = (fileList) => {
  let finalContentList = [];
  files.forEach((f) => {
    const fileContent = require(f);
    finalContentList.push({ filename: f, content: fileContent });
  });
  return finalContentList;
}

const buildApiSwaggerFile = (options, coreFileInfo) => {

  let finalResourceList = {};
  let files = coreFileInfo.resources;
  files.forEach((f) => {
    const fileContent = require(f);
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
  const originalBase = coreFileInfo.baseContent.baseInfo;
  const definitions = coreFileInfo.definitions;

  //Load all files from folders
  const parameter_files = getContentListFromFileList(coreFileInfo.parameters);
  const parameters = parameter_files.map(p => {
    return p;
  });

  const definitions_files = getContentListFromFileList(coreFileInfo.definitions);
  const definitions = definitions_files.map(p => {
    return p;
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


const buildApiPropertiesFile = (options, coreFileInfo) => {
  const policyFiles = coreFileInfo.policies;
  //create array from policy files
  const apiPropContent = coreFileInfo.propInfo;
  var finalPolicies = [...apiPropContent.properties.policyTemplateInstances, ...policies];
  apiPropContent.properties.policyTemplateInstances = finalPolicies;
  fsutil.createJSONFile(options.targetFolderPath, apiPropContent);
}


module.exports = async options => {

  console.log(options);
  const sourceFolderPath = options.sourceFolderPath;
  const targetFolderPath = options.targetFolderPath;
  return new Promise((resolve, reject) => {

    //load the core files
    const resources = fsutil.findFilesInDir(`${sourceFolderPath}/resources`, ".json");
    const definitions = fsutil.findFilesInDir(`${sourceFolderPath}/definitions`, ".json");
    const parameters = fsutil.findFilesInDir(`${sourceFolderPath}/parameters`, ".json");
    const policies = fsutil.findFilesInDir(`${sourceFolderPath}/policies`, ".json");

    const baseInfo = `${sourceFolderPath}/con.base.json`;
    const basePropInfo = `${sourceFolderPath}/con.base.prop.json`;

    const coreFileInfo = { baseContent: { baseInfo: baseInfo, propInfo: basePropInfo }, resources, definitions, parameters, policies };

    buildApiSwaggerFile(options, coreFileInfo);
    buildApiPropertiesFile(options, coreFileInfo);

    resolve();
  })
};
