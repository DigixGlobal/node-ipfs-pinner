const Koa = require('koa');
const HashManager = require('./hashManager');

const app = new Koa();
const hashManager = new HashManager();

// Logging
app.use(async (ctx, next) => {
  const { i, t, s } = ctx.request.query;
  if (i && t && s) {
    await hashManager.processMessage({ ipfsHash: i, timestamp: t, signature: s });
  }
  await next();
});

app.use((ctx) => {
  ctx.body = 'Hello World';
});

app.listen(3000);
