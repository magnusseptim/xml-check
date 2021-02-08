const prompt = require('prompt');
const xml2js = require('xml2js');
const fs = require('fs');
const colors = require('colors');

let parser = new xml2js.Parser();

prompt.start();

prompt.get(['path', 'parentNodeName', 'parentNodeAttrName', 'childNodeName', 'childNodeAttrName'], (err, result) => {
    
    console.log('Command-line input received:');
    console.log(`path : ${result.path}`);
    console.log(`parentNodeName : ${result.parentNodeName}`);
    console.log(`parentNodeAttrName : ${result.parentNodeAttrName}`);
    console.log(`childNodeName : ${result.childNodeName}`);
    console.log(`childNodeAttrName : ${result.childNodeAttrName}`);

    const xmlString = fs.readFileSync(result.path,{encoding: 'utf-8'});
    const xml = parser.parseString(xmlString, (parseErr, parseRes) => {

        console.log('Converted file:');
        console.log(parseRes);

        let headers = searchTree(parseRes, result.parentNodeName);

        console.log(headers);

        headers.forEach(header => {
            let contacts = searchTree(header, result.childNodeName);
            let headerRef = header['$'][result.parentNodeAttrName];

            contacts.forEach(contact => {
                let contactRef = contact['$'][result.childNodeAttrName];
                if(headerRef !== contactRef){
                    console.log(`Wrong contact ref: ${contactRef} where header ref was ${headerRef}`.yellow);
                    console.log(`${JSON.stringify(contact)}`.red);
                }
            });
        });
    });
});


function searchTree(element, matchingTitle){
    let arr = [];

    let keys = Object.keys(element);

    for(key in keys){
        let label = keys[key];
        if(label === matchingTitle) {
            if(Array.isArray(element[matchingTitle])){
                element[matchingTitle].forEach(element => {
                    arr.push(element);
                });
            } else {
                arr.push(element[matchingTitle]);
            }
        } else {
            if(element[label] !== Object(element[label])){
                continue;
            }
            let recRes = searchTree(element[label], matchingTitle);
            if(recRes != null){
                if(Array.isArray(recRes)){
                    recRes.forEach(element => {
                        arr.push(element);
                    });
                } else {
                    arr.push(recRes);
                };
            }
        }
    }

    return arr;
}