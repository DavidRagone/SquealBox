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

### Code

See [diff](https://github.com/DavidRagone/SquealBox/commit/82d5308947b7bdd7483246d90b1b4ac81d52b1a4)

### Wait, how does any of this work?

1. Model → tool (“I’d like to run ping.”)
1. Tool → model (“Here’s { result: "pong" }; now please continue your answer.”)

**But, why would the model try to run a tool?** Because you told it that the tool
exists (via the `/v1/list_tools` endpoint) and that it can be run (via the
`/v1/call_tool` endpoint), and the model determined that it should use the tool.

Different providers register these in different ways (and some call them
different things, e.g. functions instead of tools), but the end result is the
same - the model becomes aware of the tool, and uses it when necessary.

When the model is deciding what to output, it sees two options:

* Emit plain text (role assistant), or
* Emit a special message of type tool_call whose JSON matches the schema for ping.

If the user asks _“What is the result of ping?”_, the model notices it can’t
fabricate the answer itself (the schema promises an authoritative result), so it
chooses the second path.

Internally, tool-aware models are trained with thousands of examples where they
see:

> **user →** “What files are in this folder?”
> **assistant (tool_call) →** { name: "list_files", … }
> **tool result →** …
> **assistant →** “Here are the files: …”

That bias makes them pick tool calls whenever they fit.

In this one-tool prototype, the model will only call ping if the
conversation context makes that look useful (e.g. you ask “please run ping”).


