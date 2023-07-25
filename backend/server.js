import express from "express"
import dotenv from "dotenv"
import { errorHandler, notFound } from './middleware/errorMiddleware.js'
import cookieParser from "cookie-parser"

import userRoutes from './routes/userRoutes.js'
import { connectDB } from './config/db.js'




dotenv.config()

const port = process.env.PORT || 5000;

connectDB();
const app = express()



app.use(express.json())// this takes the body of req and converts it into json
app.use(express.urlencoded({ extended: true }))// this also does same as the express.json() but it is used to do convert form data to json

app.use(cookieParser());

app.use('/api/users', userRoutes)




//last middleware as error handler 



app.get('/', (req, res) => {
    return res.send(`app is running`)
})


app.use(notFound)
app.use(errorHandler);

app.listen(port, () => console.log(`Listening on the port : ${port}`))