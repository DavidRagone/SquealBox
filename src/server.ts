import express from 'express';
import { pingTool } from './tools/ping';

const PORT = process.env.PORT ?? 5050;
const app  = express();
app.use(express.json());

// helper – every response gets the version header
function withVersion(res: any) {
  res.setHeader('MCP-Protocol-Version', '2025-06-18');
  return res;
}

// 1) Metadata --------------------------------------------------------------
app.get('/v1/metadata', (req, res) =>
  withVersion(res).json({
    server_name : 'squealbox',
    mcp_version : '2025-06-18',
    list_tools  : '/v1/list_tools',
    call_tool   : '/v1/call_tool',
  })
);

// 2) List tools ------------------------------------------------------------
app.get('/v1/list_tools', (req, res) =>
  withVersion(res).json({ tools: [{
    name         : pingTool.name,
    description  : pingTool.description,
    annotations  : pingTool.annotations,        // NEW
    input_schema : pingTool.inputSchema,
    output_schema: pingTool.outputSchema,
  }]})
);

// 3) Call tool -------------------------------------------------------------
app.post('/v1/call_tool', (req, res) => {
  const { name, arguments: args = {} } = req.body ?? {};
  if (name !== pingTool.name) {
    return withVersion(res).status(404).json({ error: 'Tool not found' });
  }
  return pingTool.run()
    .then(result => withVersion(res).json(result))
    .catch(err   => withVersion(res).status(500).json({ error: err.message }));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
