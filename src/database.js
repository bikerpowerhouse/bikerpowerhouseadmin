const mongoose = require('mongoose');


mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(db => console.log('DB is connected'))
  .catch(err => console.log(err));
