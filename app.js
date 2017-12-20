const express = require('express'),
      app = express();

app.set('view engine', 'ejs');
// Sets directory to serve static files
// can be accessed from root route eg. /stylesheets/app.css
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/maps/:locReq', (req, res) => {
  let locReq = req.params.locReq;
  res.render('index', {locReq: locReq});
});

app.listen(8080, () => {
  console.log('Mapper Server ---> ON');
  console.log('listening on localhost:8080');
});
