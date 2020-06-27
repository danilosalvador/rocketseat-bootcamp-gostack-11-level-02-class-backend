import express, { Request, Response, NextFunction } from 'express';
import 'reflect-metadata';

import routes from './routes';
import uplaodConfig from './config/upload';
import './database';

const app = express();

app.use(express.json());

function logRequest(request: Request, response: Response, next: NextFunction) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.time(logLabel);

  next();

  console.timeEnd(logLabel);
}

app.use(logRequest);
app.use('/files', express.static(uplaodConfig.directory));
app.use(routes);

app.listen(3333, () => {
  console.log('Server starded on port 3333 🚀');
});
