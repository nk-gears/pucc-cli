const ora = require('ora');
const { dim, red, yellow } = require('chalk');
const handleError = require('cli-handle-error');
const spinner = ora({ text: '' });
const fs = require('fs');

const fileTypes={ BASE_META:'', DEFINITIONS:'',PARAMETERS:'',POLICIES:''};

const combineFiles=()=>{

 return "";
}


module.exports = async inputOptions => {

  const basePath = inputOptions.sourceFolderPath;
  const targetFolderPath = inputOptions.targetFolderPath;

  return new Promise((resolve, reject) => {

    /*
    - Load the Core resource files
    - Load the definitions
    - Load the Policies
    - Load the MetaBase
    - Load the Parameters
    */


  const definitions = combineFiles(fileTypes.DEFINITIONS);
  const parameters = combineFiles(fileTypes.PARAMETERS);
  const policies = combineFiles(fileTypes.POLICIES);

  //load the core files
  const files =[];// common.findFilesInDir(`${basePath}${conName}/partials/core`, ".json");
  //loop through the files
  // create apiProperties and apiDefinition.swagger.json file

  resolve();
  })
};
