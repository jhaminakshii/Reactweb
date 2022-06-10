const connectToMongo = require("./app");
var cors = require('cors')
const express = require('express');

connectToMongo();

const app = express();
const port = 5000
app.use(cors());

// app.get('/', (req, res) => {
//   res.send('Hello mini!')
// })

app.use(express.json());

app.use('/auth',require('./routes/auth'))

app.use('/api/notes', require('./routes/notes'))



app.listen(port, () => {
  console.log(`iNOTEBOOK app listening at http://localhost:${port}`)
})