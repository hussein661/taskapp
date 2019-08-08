
const sgMail = require('@sendgrid/mail')
const sendgridApiKey = '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'

sgMail.setApiKey(sendgridApiKey);

const sendWelcomeEmail= (email,name)=>{
    sgMail.send({
        to: email,
        from: 'hussein.hussein@montyholding.com',
        subject: 'Welcome from TaskApp',
        text: `welcome to the app, ${name}, let me know how you go along with the app`,
    })
}  

const sendCancelEmail = (email,name)=>{
    sgMail.send({
        to: email,
        from: 'hussein.hussein@montyholding.com',
        subject: 'thank you',
        text: `dear ${name} thank you for using my, hope u come back again`,
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}
