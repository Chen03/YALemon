const http = require('http');
const fs = require('fs');
const path = require('path');
const sha256 = require('sha256');
const { resolveNaptr } = require('dns');

const port = 3000;

let data = JSON.parse(fs.readFileSync('./data.json'));

const server = http.createServer((req, res) => {
  if (req.method == "POST") {
    let body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      try {
        body = Buffer.concat(body).toString();
        body = JSON.parse(body);
        console.log(body);
        if (req.url == '/getPages') {
          if (!data.pageData.hasOwnProperty(body.ID)) {
            data.pageData[body.ID] = data.pageData.DEFAULT;
            fs.writeFileSync('./data.json', JSON.stringify(data));
          }
          res.end(JSON.stringify(data.pageData[body.ID]));
        } else if (req.url == '/savePages') {
          data.pageData[body.ID] = body.page;
          fs.writeFileSync('./data.json', JSON.stringify(data));
          res.end(JSON.stringify({stat: 0}));
        } else if (req.url == '/login') {
          if (data.userData[body.user] == body.pwd) {
            res.end(JSON.stringify({stat: 0, ID: sha256(body.user).slice(0, 6)}));
          }
          else res.end(JSON.stringify({stat: 1}));
        } else if (req.url == '/register') {
          data.userData[body.user] = body.pwd;
          res.end(JSON.stringify({stat: 0, ID: sha256(body.user).slice(0, 6)}));
        }
        else  res.end(JSON.stringify(body));
      } catch(e) {
        console.log(e);
        res.statusCode = 400;
        res.end(JSON.stringify({stat: 2}));
      }
      // at this point, `body` has the entire request body stored in it as a string
    });
  } else {
    let data;
    try {
      data = fs.readFileSync('.' + req.url);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(data);
    } catch(e) {
      res.statusCode = 404;
      res.end();
    }
  }
})

server.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}/`);
});