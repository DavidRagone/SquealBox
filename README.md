# SquealBox

[Oink](https://github.com/davidragone/oink)'s toolkit.

A basic collection of simple MCP tools for use with Oink. Similar to Oink, the
primary intention is for me to learn more about the MCP protocol and how to use
it. I intend to use them myself, and you are welcome to use them too, but mostly
I hope that you can learn along with me.

## Phase 1: Hello, tools!

A minimalist API surface area for me to start with.

Goal: Stand up a minimal MCP server that exposes a single ping tool returning "pong".

Key reading:
- [MCP Architecture](https://modelcontextprotocol.io/docs/concepts/architecture)

### Learning notes

_Sharing what I learned while building this._

Apparently this is a standard naming convention for the MCP endpoints:

| Endpoint             | Purpose              | Typical payload |
| -------------------- | -------------------- | --------------- |
| `GET /v1/metadata`   | Capability discovery | `{ "server_name": "...", "mcp_version": "2025-03-26" }` |
| `GET /v1/list_tools` | Enumerate tools      | `{ "tools": [ { …JSON-Schema… } ] }`                    |
| `POST /v1/call_tool` | Invoke one tool      | `{ "name":"ping", "arguments":{} }`                     |

