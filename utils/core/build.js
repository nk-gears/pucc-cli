const args = process.argv.slice(2);
let connectorName = args[0];
const groupId = args[1] || 'all';
const common = require("./common");
const fs = require("fs");
const path = require("path");
const basePath = path.resolve("./").replace("scripts", "") + "/connectors/";

const generateOutput = (conName) => {

  const definitions = require(`${basePath}${conName}/partials/definitions.json`);

  //load the core files
  var files =[];// common.findFilesInDir(`${basePath}${conName}/partials/core`, ".json");
  const groupInfoList=require(`${basePath}${conName}/group.json`);
  const groupInfo=groupInfoList.data.filter(f=>f.group_id==groupId)[0];


  groupInfo.group_folders.forEach(gp=>{
    //console.log(gp);
    const gFiles = common.findFilesInDir(`${basePath}${conName}/partials/${gp}`, ".json");
    files=files.concat(gFiles);
    files=files.filter(f=>f.indexOf('skip')<=-1);
    //return `${basePath}${conName}/partials/${gp}`.toLowerCase();
  })
 


  
  var finalFileList = {};
  var operationIds=[];
  var operationDetailedIds=[];
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

      
    let oprInfo=finalFileList[pathName][[pathMethodName]];
    operationIds.push(finalFileList[pathName][[pathMethodName]].operationId + " : " + pathName + " : " + pathMethodName);
    let tags=oprInfo.tags?oprInfo.tags.join(','):'';
    operationDetailedIds.push(`${oprInfo.description}\t${""}`);

    if(!skipActions.includes(finalFileList[pathName][[pathMethodName]].operationId)){
      if(pathMethodName!="x-ms-notification-content"){
        console.log(pathName)
        delete finalFileList[pathName][[pathMethodName]];
      }
    }
    //operationDetailedIds.push(`${oprInfo.operationId}\t${oprInfo.summary}\t${oprInfo.description}\t${tags}\t${pathMethodName}`);

  });


  let fdOprList = fs.openSync(
    `${basePath}/${connectorName}.txt`,
    "w+"
  );
  fs.writeSync(fdOprList, operationIds.map(p=>p).join('\n'));


  fdOprList = fs.openSync(
    `${basePath}/${connectorName}-detailed.txt`,
    "w+"
  );
  fs.writeSync(fdOprList, operationDetailedIds.map(p=>p).join('\n'));



  var originalBase = require(`${basePath}${conName}/base/apiDefinition.swagger.json`);
  
  var parameters = require(`${basePath}${conName}/partials/parameters.json`);
  var policies = require(`${basePath}${conName}/partials/policies.json`);
  const fd = fs.openSync(
    `${basePath}${conName}/dist/apiDefinition.swagger.json`,
    "w+"
  );
  var originalPaths = originalBase.paths;
  var finalresp = {};

  finalresp = { ...originalBase, paths: { ...originalPaths, ...finalFileList } };

 let newPaths={};
  Object.keys(finalresp.paths).map(p=>{
    let hasKeys=Object.keys(finalresp.paths[p]).length>0;
    
    //console.log(Object.keys(p).length)
    if(hasKeys) newPaths[p]=finalresp.paths[p];

  });

  finalresp.paths=newPaths;

  //var keys=Object.keys(finalFileList);
  //keys.forEach(p=>{ originalPaths[p]={};});

  let contents=JSON.stringify(finalFileList);
  let newDefinitions={};
  Object.keys(definitions).forEach(p=>{
    if(contents.includes(`#/definitions/${p}`)){
      newDefinitions[p]=definitions[p];
    }
  });

  let newParameters={};
  Object.keys(parameters).forEach(p=>{
    if(contents.includes(`#/parameters/${p}`)){
      newParameters[p]=parameters[p];
    }
  });




  finalresp.definitions = { ...newDefinitions };
  finalresp.parameters = { ...newParameters };
  var curDate = new Date();

  const versionInfo = fs.readFileSync(`${basePath}${conName}/version.txt`);
  const versionParts = versionInfo.toString().split('.');
  let finalVersion = `${versionParts[0]}.${versionParts[1]}.${parseInt(versionParts[2]) + 1}`;
    finalresp.info.version = finalVersion;

  fs.writeFileSync(`${basePath}${conName}/version.txt`, finalVersion);
  finalresp.info.description = finalresp.info.description.split('|')[0];// + "|" + curDate.toLocaleDateString() + "_" + curDate.toLocaleTimeString();
  var resp = JSON.stringify(finalresp);//, null, 2);

  let fileNames = ['apiProperties.json', 'icon.png', 'settings.json'];
  fileNames.forEach(p => {
    console.log("Copying file to Dist.." + p);
    console.log(`${basePath}${conName}/dist/${p}`);
    fs.copyFileSync(`${basePath}${conName}/base/${p}`, `${basePath}${conName}/dist/${p}`);
  });

  fs.writeSync(fd, resp);

  //Update Properties

  const apiPropContent = require(`${basePath}${conName}/base/apiProperties.json`);
  var finalPolicies = [...apiPropContent.properties.policyTemplateInstances, ...policies];
  apiPropContent.properties.policyTemplateInstances = finalPolicies;
  const fdp = fs.openSync(
    `${basePath}${conName}/dist/apiProperties.json`,
    "w+"
  );

  fs.writeSync(fdp, JSON.stringify(apiPropContent));

};
