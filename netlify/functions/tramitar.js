// netlify/functions/tramitar.js
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mensaje: "Funciona Netlify Functions 🚀" })
  };
};
