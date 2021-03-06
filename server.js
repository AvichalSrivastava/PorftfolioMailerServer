const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');
var nodemailer = require('nodemailer');
var cors = require('cors');
const app = express();
var PORT = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors);
const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: false
  }
});

app.get('/',(req,res)=>
{
    res.status(200).json("Successfully conencted");
});

app.post('/send',(req,res)=>
{
    console.log(req.body);
    const {name, email, message} = req.body;
    db.insert({
        name:name,
        email: email,
        message : message,
        mailed_on: new Date()
      })
      .into('cm_users')
      .then(()=>
      {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user:'avichalsrivastavatechgig',
              pass: 'avichal.22'
            }
          });
          
          var mailOptions = {
            from: email,
            to: 'avichalsrivastavatechgig@gmail.com',
            subject: 'Reached your Porfolio',
            text: `Hello Avichal,,
             ${message},
             Thanks and regards,
             ${name}
             ${email}`
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
              res.status(400).json("Failed To mail.");
            } else {
              console.log('Email sent: ' + info.response);
              res.status(200).json("Successfully mailed.");
            }
          });
        
      })
      .catch(()=>
        {
          res.status("400").json("Failed to send. Server Exception");
        });
});

app.listen(PORT,()=>{console.log('server is running on port '+PORT);});
