/**
 *  netlify/functions/tramitar.js
 *  Recibe el pedido vía POST y envía un correo con:
 *    · Datos del cliente
 *    · Tamaño elegido
 *    · Foto original (imageData)               [opcional]
 *    · Ilustración generada por IA (designData)[opcional]
 *
 *  Envía el mensaje con SendGrid (apikey en variable SENDGRID_KEY)
 */

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_KEY);   // ← variable de entorno en Netlify

exports.handler = async (event) => {
  /* ───── Permitir solo POST ───── */
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    /* ───── Datos recibidos del front-end ───── */
    const { nombre, telefono, size, imageData, designData } =
          JSON.parse(event.body || '{}');

    if (!nombre || !telefono || !size) {
      return { statusCode: 400, body: 'Missing data' };
    }

    /* ───── HTML del correo ───── */
    const html = `
      <h2>Nuevo pedido Diseño Peludo</h2>
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Teléfono:</strong> ${telefono}</p>
      <p><strong>Tamaño:</strong> ${size}</p>
      <p>Se adjuntan la foto original y (si existe) la ilustración generada.</p>
    `;

    /* ───── Construcción de adjuntos ───── */
    const attachments = [];

    if (imageData) {
      console.log('imageData length', imageData.length);
      attachments.push({
        content: imageData,                 // base64 sin prefijo data:
        filename: `foto_${Date.now()}.jpg`,
        type: 'image/jpeg',
        disposition: 'attachment'
      });
    }

    if (designData) {
      console.log('designData length', designData.length);
      attachments.push({
        content: designData,
        filename: `diseño_${Date.now()}.png`, // o .svg
        type: designData.trim().startsWith('PD94') ? 'image/svg+xml' : 'image/png',
        disposition: 'attachment'
      });
    }

    /* ───── Mensaje SendGrid ───── */
    const msg = {
      to: 'davidvaquero94@gmail.com',      // destino
      from: 'davidvaquero94@gmail.com',    // remitente verificado en SendGrid
      subject: `Nuevo pedido de ${nombre}`,
      html
    };

    if (attachments.length) msg.attachments = attachments;

    /* ───── Enviar ───── */
    await sgMail.send(msg);

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };

  } catch (err) {
    console.error('SendGrid error', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
