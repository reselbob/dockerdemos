const fs = require('fs');

const substitution = 'cheese';

// Do file 1

let rawdata = fs.readFileSync('file1.txt', 'utf8');

let data = rawdata.toString().replace(/([^\s]+)/g, substitution);

fs.writeFileSync('resultFile1.txt',data,'utf8');


rawdata = fs.readFileSync('file2.txt', 'utf8');

data = rawdata.toString().replace(/([^\s]+)/g, substitution);

fs.writeFileSync('resultFile2.txt',data,'utf8');
