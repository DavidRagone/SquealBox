"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const ping_1 = require("../src/tools/ping");
// Recreate the server setup from src/server.ts
const app = (0, express_1.default)();
app.use(express_1.default.json());
function withVersion(res) {
    res.setHeader('MCP-Protocol-Version', '2025-06-18');
    return res;
}
app.post('/v1/call_tool', (req, res) => {
    const { name, arguments: args = {} } = req.body ?? {};
    if (name !== ping_1.pingTool.name) {
        return withVersion(res).status(404).json({ error: 'Tool not found' });
    }
    return ping_1.pingTool.run()
        .then(result => withVersion(res).json(result))
        .catch(err => withVersion(res).status(500).json({ error: err.message }));
});
describe('POST /v1/call_tool', () => {
    it('should return pong for the ping tool', async () => {
        const response = await (0, supertest_1.default)(app)
            .post('/v1/call_tool')
            .set('MCP-Protocol-Version', '2025-06-18')
            .send({ name: 'ping' });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('content');
        expect(response.body).toHaveProperty('structuredContent');
        expect(response.body.structuredContent).toEqual({ result: 'pong' });
    });
});
