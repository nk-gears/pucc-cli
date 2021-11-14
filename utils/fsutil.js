var path = require("path"),
  fs = require("fs");

/**
 * Find all files recursively in specific folder with specific extension, e.g:
 * findFilesInDir('./project/src', '.html') ==> ['./project/src/a.html','./project/src/build/index.html']
 * @param  {String} startPath    Path relative to this file or other file which requires this files
 * @param  {String} filter       Extension name, e.g: '.html'
 * @return {Array}               Result files with path string in an array
 */
function findFilesInDir(startPath, filter) {
  var results = [];

  if (!fs.existsSync(startPath)) {
    console.log("no dir ", startPath);
    return;
  }

  var files = fs.readdirSync(startPath);
  for (var i = 0; i < files.length; i++) {
    var filename = path.join(startPath, files[i]);
    var stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      results = results.concat(findFilesInDir(filename, filter)); //recurse
    } else if (filename.indexOf(filter) >= 0) {
      // console.log('-- found: ',filename);
      results.push(filename);
    }
  }
  return results;
}


const createJSONFile = function (targetPath, filename, fcontent) {
	const fd = fs.openSync(`${targetPath}/${filename}.json`, 'w+');
	var resp = JSON.stringify(fcontent, null, 2);
    if(resp && resp.length>0)
	    fs.writeSync(fd, resp);    
};


function mkdir(inputPath) {
  if (fs.existsSync(inputPath)) {
    return;
  }
  const basePath = path.dirname(inputPath);
  if (fs.existsSync(basePath)) {
    fs.mkdirSync(inputPath);
  }
  mkdir(basePath);
}

module.exports = { mkdir,findFilesInDir,createJSONFile };
