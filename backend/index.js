const express = require("express")
const cors = require("cors")
const app = express()
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://kavya:123%23@cluster0.j3pom0w.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0").then(function () {
    console.log("Connected to DB")
}).catch(function () { console.log("Failed to connect") })

const cryt = mongoose.model("cryt", {}, "bulkmail")
//
app.post("/sendemail", function (req, res) {
    var msg = req.body.msg;
    var emailList = req.body.emailList;

    cryt.find().then(function (data) {
        console.log("Fetched data from MongoDB:", data);
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: (data[0].toJSON()).user,
                pass: (data[0].toJSON()).pass,
            },
        });
        new Promise(async function (resolve, reject) {

            try {
                for (var i = 0; i < emailList.length; i++) {
                    await transporter.sendMail(
                        {
                            from: "kavyadeen05@gmail.com",
                            to: emailList[i],
                            subject: 'A message from bulk mail app',
                            text: msg
                        })
                    console.log("Email sent to:" + emailList[i])
                }
                resolve("Success")
            }
            catch (error) {
                reject("Fail")
            }

        }).then(function () {
            res.send(true)
        }).catch(function () {
            res.send(false)
        })


    }).catch(function (error) {
        console.log(error)
    })


});

require("dotenv").config(); 

app.listen(5000, function () {
    console.log("Server Started.....")
})