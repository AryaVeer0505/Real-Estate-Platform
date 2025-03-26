const mongoose=require("mongoose")
const express=require("express")
const cors=require("cors")
const routes =require("./routes/index")
const app=express()

app.use(express.json())

app.use(routes)

app.use(cors({
    origin:"*",
    methods:["GET","POST","PUT","PATCH","HEAD","UPDATE","DELETE"],
}))

mongoose.connect("mongodb+srv://aryaveerk123:kmFs1Il9x1GAA2su@backend-pi.5edpy.mongodb.net/")
.then(()=>{
    console.log("Mongo Connected")
})
.then(()=>{
    const PORT=5000
    app.listen(PORT,()=>{
        console.log("Successsfully connected on PORT:",(PORT))
    })
})
.catch((err)=>{
    console.log(err)
})