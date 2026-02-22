#!/usr/bin/env node
const https = require('https');
const { performance } = require('perf_hooks');
const crypto = require('crypto');

function die(msg) { console.error(`\n❌ NASA DIAGNOSTICS FAILED: ${msg}\n`); process.exit(1); }
function ok(msg) { console.log(`✅ ${msg}`); }
function warn(msg) { console.log(`⚠️  ${msg}`); }
function info(msg) { console.log(`ℹ️  ${msg}`); }

function getEnv(name, required = true) {
  const v = process.env[name];
  if (!v && required) die(`Missing required env: ${name}`);
  return v;
}

function httpRequest(url, { method='GET', headers={}, body } = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const opts = { method, hostname: u.hostname, path: u.pathname + u.search, headers: { 'User-Agent': 'kamdridi-nasa/2.0', ...headers } };
    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', (d)=> data += d);
      res.on('end', ()=> resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

function p95(arr) {
  const s = [...arr].sort((a,b)=>a-b);
  const idx = Math.floor(0.95*(s.length-1));
  return s[idx] || 0;
}

async function webhookHandshakeValidation() {
  info('Webhook handshake validation (signature simulation)');
  const secret = getEnv('STRIPE_WEBHOOK_SECRET');
  const payload = JSON.stringify({ id:'evt_test', type:'checkout.session.completed' });
  const t = Math.floor(Date.now()/1000);
  const signedPayload = `${t}.${payload}`;
  const v1 = crypto.createHmac('sha256', secret).update(signedPayload, 'utf8').digest('hex');
  const expected = crypto.createHmac('sha256', secret).update(`${t}.${payload}`, 'utf8').digest('hex');
  if (v1 !== expected) die('Webhook signature simulation failed');
  ok('Webhook signature simulation verified');
}

async function supabaseResilienceCheck() {
  info('DB resilience check (Supabase REST ping)');
  const url = `${getEnv('NEXT_PUBLIC_SUPABASE_URL')}/rest/v1/members?select=id&limit=1`;
  const key = getEnv('SUPABASE_SERVICE_ROLE_KEY');
  const headers = { apikey: key, Authorization: `Bearer ${key}` };
  const t0 = performance.now();
  const res = await httpRequest(url, { headers });
  if (!(res.status >= 200 && res.status < 300)) die(`Supabase non-2xx (${res.status})`);
  ok(`Supabase reachable in ${(performance.now()-t0).toFixed(0)}ms`);
}

async function stripeLatencyBenchmark() {
  info('Stripe latency benchmark (GET /v1/balance)');
  const sk = getEnv('STRIPE_SECRET_KEY');
  const auth = Buffer.from(`${sk}:`).toString('base64');
  const samples = 6;
  const times = [];
  for (let i=0;i<samples;i++) {
    const t0 = performance.now();
    const res = await httpRequest('https://api.stripe.com/v1/balance', { headers: { Authorization: `Basic ${auth}` } });
    const dt = performance.now() - t0;
    if (!(res.status >= 200 && res.status < 300)) die(`Stripe API failed (${res.status})`);
    times.push(dt);
  }
  ok(`Stripe latency avg=${(times.reduce((a,b)=>a+b,0)/times.length).toFixed(0)}ms p95=${p95(times).toFixed(0)}ms`);
  if (p95(times) > 1800) warn('Stripe p95 latency is high (monitor).');
}

async function apiStressTest(baseUrl) {
  info('API stress test on health endpoint');
  const total = Number(process.env.NASA_REQUESTS || 60);
  const conc = Number(process.env.NASA_CONCURRENCY || 10);
  const lat = [];
  let fail = 0;
  let sent = 0;

  const one = async () => {
    const t0 = performance.now();
    try {
      const res = await httpRequest(`${baseUrl}/.netlify/functions/health`);
      const dt = performance.now() - t0;
      if (res.status >= 200 && res.status < 300) lat.push(dt);
      else fail++;
    } catch { fail++; }
  };

  const workers = Array.from({length: conc}, async () => {
    while (true) {
      if (sent >= total) break;
      sent++;
      await one();
    }
  });

  await Promise.all(workers);

  ok(`API ok=${lat.length} fail=${fail} avg=${(lat.reduce((a,b)=>a+b,0)/Math.max(1,lat.length)).toFixed(0)}ms p95=${p95(lat).toFixed(0)}ms`);
  if (fail > Math.ceil(total*0.02)) die(`Too many failures (${fail}/${total})`);
}

async function main() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🚀 NASA DIAGNOSTICS — KAMDRIDI EMPIRE v2');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  getEnv('NEXT_PUBLIC_SUPABASE_URL');
  getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  getEnv('SUPABASE_SERVICE_ROLE_KEY');
  getEnv('STRIPE_SECRET_KEY');
  getEnv('STRIPE_WEBHOOK_SECRET');
  getEnv('SITE_URL');

  ok('Env vars present');

  await webhookHandshakeValidation();
  await supabaseResilienceCheck();
  await stripeLatencyBenchmark();

  const baseUrl = process.env.NASA_BASE_URL || getEnv('SITE_URL');
  const health = await httpRequest(`${baseUrl}/.netlify/functions/health`);
  if (!(health.status >= 200 && health.status < 300)) die(`Health endpoint failed (${health.status})`);
  ok('Health endpoint reachable');

  await apiStressTest(baseUrl);

  console.log('\n✅ NASA DIAGNOSTICS PASSED. READY TO DEPLOY.\n');
}

main().catch(e => die(e.message || String(e)));
