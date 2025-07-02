import request from 'supertest';
import express from 'express';
import { pingTool } from '../src/tools/ping';

// Recreate the server setup from src/server.ts
const app = express();
app.use(express.json());
function withVersion(res: any) {
  res.setHeader('MCP-Protocol-Version', '2025-06-18');
  return res;
}
app.post('/v1/call_tool', (req, res) => {
  const { name, arguments: args = {} } = req.body ?? {};
  if (name !== pingTool.name) {
    return withVersion(res).status(404).json({ error: 'Tool not found' });
  }
  return pingTool.run()
    .then(result => withVersion(res).json(result))
    .catch(err   => withVersion(res).status(500).json({ error: err.message }));
});

describe('POST /v1/call_tool', () => {
  it('should return pong for the ping tool', async () => {
    const response = await request(app)
      .post('/v1/call_tool')
      .set('MCP-Protocol-Version', '2025-06-18')
      .send({ name: 'ping' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('content');
    expect(response.body).toHaveProperty('structuredContent');
    expect(response.body.structuredContent).toEqual({ result: 'pong' });
  });
}); 