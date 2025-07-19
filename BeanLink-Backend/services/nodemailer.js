const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail", // O el servicio que uses
//   auth: {
//     user: process.env.EMAIL_USER, // Correo de envío (usualmente es una variable de entorno)
//     pass: process.env.EMAIL_PASSWORD, // Contraseña del correo (también debe ser una variable de entorno)
//   },
// });
//Transporte para el correo support@beanlink.es
const transporter = nodemailer.createTransport({
  host: 'smtp.ionos.es', //Servidor del correo
  port: 587, 
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
//Envio de emial cuando el usuario se olvida la contraseña
const sendMail = async (to, subject, htmlContent) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo enviado con éxito a:", to);
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw new Error("Error al enviar el correo");
  }
};

//Envio de correo cuando escribe un usuario desde formulario de contacto (soporte)
const sendSupportMail = async (email, name, content) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `Ticket de soporte ${name}, ${email}`,
    html: content,
    replyTo: email
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo enviado con éxito a soporte");
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw new Error("Error al enviar el correo");
  }
};

//Feedback al usuario cuando envia correo a soporte 
const sendFeedbackMail = async (userEmail, userName, userMessage) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,  // Correo que se usa para enviar
    to: userEmail,  // Correo del usuario
    subject: "Has enviado un correo al soporte de BeanLink",  // Asunto
    html: `
      <p>Hola ${userName},</p>
      <p>Gracias por ponerte en contacto con nuestro soporte. Hemos recibido tu mensaje y uno de nuestros agentes se pondrá en contacto contigo lo antes posible.</p>
      <p><strong>Tu mensaje:</strong></p>
      <p>"${userMessage}"</p>
      <p>Si necesitas más información, no dudes en contactarnos nuevamente.</p>
      <p>Saludos,<br>El equipo de soporte de BeanLink</p>
    `, 
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Correo de confirmación enviado con éxito a ${userEmail}`);
  } catch (error) {
    console.error("Error al enviar el correo al usuario:", error);
    throw new Error("Error al enviar el correo al usuario");
  }
};

module.exports = { sendMail, sendSupportMail, sendFeedbackMail };
