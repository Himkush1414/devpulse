import express from 'express';
import { env } from './config/env';
import { sourcesRouter } from './routes/sources';
import { ingestRouter } from './routes/ingest';
import { logsRouter } from './routes/logs';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'devpulse-api' });
});

app.use('/api/sources', sourcesRouter);
app.use('/api/ingest', ingestRouter);
app.use('/api/logs', logsRouter);

app.listen(env.port, () => {
  console.log(`DevPulse API listening on port ${env.port}`);
});
