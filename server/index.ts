import * as next from 'next';
import server from './initServer';


const port = parseInt(process.env.PORT, 10) || 8888;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    server.get('/system/lsof', (req, res) => app.render(req, res, '/system/lsof', req.query));
    server.get('/genetic', (req, res) => app.render(req, res, '/genetic', req.query));

    server.get('*', (req, res) => handle(req, res));

    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  });
