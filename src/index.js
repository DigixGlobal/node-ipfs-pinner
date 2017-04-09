const Koa = require('koa');
const HashManager = require('./hashManager');
const { DEFAULT_PORT } = reuqire('./constants');

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

app.listen(DEFAULT_PORT);
