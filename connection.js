var mongoose = require('mongoose');
var dotEnv = require('dotenv');

// set env variables
dotEnv.config();

//add database
let database;

if (process.env.SERVER_ENV === 'production') {
  database = process.env.DATABASE.replace('<DATABASE_PASSWORD>', process.env.DATABASE_PASSWORD)
    .replace('<DATABASE_USERNAME>', process.env.DATABASE_USERNAME)
    .replace('<DATABASE_NAME>', process.env.DATABASE_NAME);
} else {
  database = 'mongodb://' + process.env.DB_HOST + '/' + process.env.DB_NAME;
}

// Connect the database
mongoose.connect(database, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
// .then((con) => {
//   .then(() => {
//     console.log('DB connection Successfully!');
//   })
//   .catch((e) => {
//     console.log('e', e);
//   });

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
  console.log('Connection with database succeeded.');
});
