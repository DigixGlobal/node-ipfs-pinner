const Koa = require('koa');
const HashManager = require('./hashManager');

const app = new Koa();
const hashManager = new HashManager();

// Logging
app.use(async (ctx) => {
  const { i, t, s } = ctx.request.query;
  if (i && t && s) {
    const tx = await hashManager.processMessage({ ipfsHash: i, timestamp: t, signature: s });
    ctx.body = tx;
  }
});

app.listen(3001);
