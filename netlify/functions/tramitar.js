// netlify/functions/tramitar.js
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    /* ───────────── datos recibidos del front ───────────── */
    const { nombre, telefono, size, imageData } = JSON.parse(event.body || '{}');

    if (!nombre || !telefono || !size) {
      return { statusCode: 400, body: 'Missing data' };
    }

    /* ───────────── cuerpo HTML del correo ───────────── */
    const html = `
      <h2>Nuevo pedido Diseño Peludo</h2>
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Teléfono:</strong> ${telefono}</p>
      <p><strong>Tamaño:</strong> ${size}</p>
      <p>Adjunto la foto original del cliente para el diseño.</p>
    `;

    /* ───────────── construimos el mensaje ───────────── */
    const msg = {
      to: 'davidvaquero94@gmail.com',      // destino
      from: 'davidvaquero94@gmail.com',    // remitente verificado
      subject: `Nuevo pedido de ${nombre}`,
      html
    };

    /* ───────────── adjuntamos la imagen si llega ───────────── */
    if (imageData) {
      console.log('imageData length', imageData.length);   // para depurar
      msg.attachments = [{
        content: imageData,                 // Base64 sin encabezado data:
        filename: `mascota_${Date.now()}.jpg`,
        type: 'image/jpeg',
        disposition: 'attachment'
      }];
    } else {
      console.log('No imageData recibido');
    }

    /* ───────────── enviamos ───────────── */
    await sgMail.send(msg);
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };

  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
