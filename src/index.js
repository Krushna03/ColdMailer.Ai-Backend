import { app } from './app.js'
import dotenv from 'dotenv'
import connectDB from './databse/db.js'

dotenv.config({
  path: "./.env"
})


app.get('/', (req, res) => {
  res.send('Hello');
});

let isConnected = false

connectDB()
  .then(() => {
    isConnected = true
    app.listen(process.env.PORT, () => {
      console.log(`Server is running at Port : ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log('MongoDBconnection failed !!!', error)
  })

export default app