const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const pool = require("../databases");



router.get('/', (req,res) => {
    res.render('Contacto');
});

router.post('/', async(req,res) => {

    const {name,Email,phone,Message} = req.body;

    const dataInsert = {
        Email,
        Name: name ,
        phone: phone,
        message: Message 
    };

    contentHTML = `
    <h1> Información de Cliente </h1>
    <ul>
        <li>Nombre: ${name}</li>
        <li>Teléfono: ${phone}</li>
        <li>Email: ${Email}</li>
    </ul>
    <p>${Message}</p>
    `;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'devdawup@gmail.com',
            pass: 'DEVDAWUPI7340V0856'
        }
    });

    const mailOptions = {
        from: `${Email}`,
        to: 'devdawup@gmail.com',
        cc: 'ivanjhovanni@gmail.com',
        subject: 'Web Development',
        html: contentHTML
    } 
     transporter.sendMail(mailOptions, (err, data,done) => {

        if (err) {
            console.log("Ocurrio un error");
        } else {   
        }
    });
    await pool.query("INSERT INTO Emails set ?", [dataInsert]);
    console.log('Mensage info');
    req.flash('success', 'Link Saved Successfully');
    res.redirect('/');

});

module.exports = router;