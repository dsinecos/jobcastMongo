var app = require('./app.js');
var PORT = process.env.PORT || 2348;

app.listen(PORT);

console.info("Server started on PORT : " + PORT);