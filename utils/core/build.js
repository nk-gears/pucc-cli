const ora = require('ora');
const { dim, red, yellow } = require('chalk');
const handleError = require('cli-handle-error');
const spinner = ora({ text: '' });
const fs = require('fs');
const fsutil=require('../fsutil');
const { createInflate } = require('zlib');

  

const buildApiSwaggerFile=(filesByType)=>{

let finalFileList={};
let files=filesByType.resources;
files.forEach((f) => {
  const fileContent = require(f);
  const pathName = Object.keys(fileContent)[0];
  const pathNameInfo = fileContent[pathName];
  const pathMethodName = Object.keys(pathNameInfo)[0];
  let isEventNotify;
  if (finalFileList[pathName]) {
    isEventNotify=false;
      finalFileList[pathName][[pathMethodName]] = fileContent[pathName][pathMethodName];
  } else {
    finalFileList[pathName] = {};
    isEventNotify=true;
    finalFileList[pathName][pathMethodName] = fileContent[pathName][pathMethodName];
  }
});

// massage the data in the finalFileList
const originalBase = require(`${inputOptions.sourceFolderPath}/basemeta/apiDefinition.swagger.json`);
const originalPaths = originalBase.paths;
let finalresp = {};
finalresp = { ...originalBase, paths: { ...originalPaths, ...finalFileList } };
let newPaths={};
Object.keys(finalresp.paths).map(p=>{
  let hasKeys=Object.keys(finalresp.paths[p]).length>0;
  if(hasKeys) newPaths[p]=finalresp.paths[p];
});
finalresp.paths=newPaths;
finalresp.definitions = { ...newDefinitions };
finalresp.parameters = { ...newParameters };

createFile(finalresp);

};


const buildApiPropertiesFile=(filesByType)=>{
  //pull policyInstances
}


module.exports = async inputOptions => {

  const sourceFolderPath = inputOptions.sourceFolderPath;
  const targetFolderPath = inputOptions.targetFolderPath;
  return new Promise((resolve, reject) => {

  //load the core files
  const resources =fsutil.findFilesInDir(`${sourceFolderPath}/resources`, ".json");
  const baseInfo =`${sourceFolderPath}/con.base.json`;
  const basePropInfo =`${sourceFolderPath}/con.base.prop.json`;
  const definitions = fsutil.findFilesInDir(`${sourceFolderPath}/definitions`, ".json");
  const parameters = fsutil.findFilesInDir(`${sourceFolderPath}/parameters`, ".json");
  const policies = fsutil.findFilesInDir(`${sourceFolderPath}/policies`, ".json");

  const filesByType={basemeta:{info:baseInfo,propInfo:basePropInfo},resources,definitions,parameters,policies};
  buildApiSwaggerFile(inputOptions,filesByType);
  buildApiPropertiesFile(inputOptions,filesByType);

  resolve();
  })
};
