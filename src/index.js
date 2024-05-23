import express from "express";

const app =express()

const port =3000;

app.get('/',(req,res)=>{
    res.send("Hello Rahul  Rahul")
})

app.listen(port,()=>{
    console.log(`Hello, localhost:${port}`);
})