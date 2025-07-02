import { JSONSchema7 } from 'json-schema';

/** Minimal TextContent helper for the new structured output schema */
interface TextContent {
  type: 'text';
  text: string;
}

export const pingTool = {
  name: 'ping',
  description: 'Health-check tool – always answers “pong”.',
  annotations: { title: 'Ping' },        // NEW
  inputSchema: {} as JSONSchema7,        // still valid
  outputSchema: {
    type: 'object',
    properties: { result: { type: 'string' } },
    required: ['result'],
    additionalProperties: false,
  } as JSONSchema7,

  /** Implements MCP 2025-06-18 structured tool result */
  run: async (): Promise<{
    content: TextContent[];
    structuredContent: { result: 'pong' };
  }> => ({
    content: [{ type: 'text', text: 'pong' }],
    structuredContent: { result: 'pong' },
  }),
};
