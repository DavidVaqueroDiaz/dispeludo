// netlify/functions/tramitar.js
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { nombre, telefono, size } = JSON.parse(event.body || '{}');

    if (!nombre || !telefono || !size) {
      return { statusCode: 400, body: 'Missing data' };
    }

    const html = `
      <h2>Nuevo pedido Diseño Peludo</h2>
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Teléfono:</strong> ${telefono}</p>
      <p><strong>Tamaño:</strong> ${size}</p>
    `;

    await sgMail.send({
      to: 'davidvaquero04@gmail.com',   // Tu correo destino
      from: 'davidvaquero94@gmail.com', // Remitente verificado en SendGrid
      subject: `Nuevo pedido de ${nombre}`,
      html
    });

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
