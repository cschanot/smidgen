const app = require('./app');
const port = 3030;

app.use(express.static(__dirname + '/static'));

app.listen(port, function() {
    console.log('Express server listening on port ' + port);
});
