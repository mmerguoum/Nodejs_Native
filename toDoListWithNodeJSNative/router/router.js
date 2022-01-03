
let ejs = require('ejs');
const fs = require('fs');

const fetcher = require('../Helpers/fetcher')
const queery = require("../Mutations");
const path = require('path')

const formidable = require('formidable');


module.exports = routes = {
    assets: function (data, res) {
        // for statis files (css, img,...)
        let assets = fs.readFileSync(path.join(__dirname + "/.." + data.url));
        console.log(data.url);
        res.writeHead(200);
        res.write(assets);
        res.end("\n");
    },
    submit: function (data, req, res) {
        // parsing form data
        let form = new formidable.IncomingForm();

        form.parse(req, async function (err, fields) {
            //handle errors
            if (err) {
                console.error(err);
                return;
            }
            let obj;
            obj = { fields: fields }
  
             let dataObj = Object.assign({},obj.fields);
                // insert into Task
                let Task = await fetcher.post(queery.addTask(dataObj.Ttask, dataObj.date,dataObj.description,dataObj.priority))
              
                ejs.renderFile('./views/index.ejs', { data: dataObj }, async function (err, str) {
                    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
                    if (err) {
                        console.log(err)
                        res.end();
                    }
                });
        })
    },

    index: async function (data, res) {
      
        ejs.renderFile('./views/index.ejs', function (err, str) {
            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
            if (err) {
                console.log(err)
                res.end();
            } else {
                res.end(str);
            }
        });
    },
  
}