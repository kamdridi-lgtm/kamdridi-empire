const os = require('os');
exports.handler = async () => ({
  statusCode: 200,
  headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  body: JSON.stringify({
    uptime: process.uptime(),
    loadAvg: os.loadavg(),
    memory: process.memoryUsage(),
    lastBuild: process.env.BUILD_ID || null,
    systemStatus: 'Nominal 🚀'
  })
});
