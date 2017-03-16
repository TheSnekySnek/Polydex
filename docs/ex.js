
var fs = require("fs");

var fileContent = fs.readFile("/home/test/file.txt");
console.log(fileContent);

fs.readFile("/home/test/file.txt", function(content) {
  console.log(content);
});
