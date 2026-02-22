const os = require('os');
exports.handler = async () => ({
  statusCode: 200,
  headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  body: JSON.stringify({
    status: 'ok',
    systemStatus: 'Nominal 🚀',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    loadAvg: os.loadavg(),
    memory: process.memoryUsage(),
    build: process.env.BUILD_ID || 'unknown',
    node: process.version
  })
});
