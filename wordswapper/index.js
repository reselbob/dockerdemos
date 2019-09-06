const fs = require('fs');
const substitution = 'cheese';

console.log(`Start time in millisecond: ${new Date().getMilliseconds()}`);

// Do file 1
let rawdata = fs.readFileSync('file1.txt', 'utf8');

let data = rawdata.toString().replace(/([^\s]+)/g, substitution);

console.log(`Writing a processed file, resultFile1.txt, of size ${data.length}`);

fs.writeFileSync('resultFile1.txt',data,'utf8');

// Do file 2
rawdata = fs.readFileSync('file2.txt', 'utf8');

data = rawdata.toString().replace(/([^\s]+)/g, substitution);

console.log(`Writing a processed file, resultFile1.txt, of size ${data.length}`);

fs.writeFileSync('resultFile2.txt',data,'utf8');

console.log(`Start time in millisecond: ${new Date().getMilliseconds()}`);
