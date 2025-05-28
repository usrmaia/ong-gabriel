import { describe, expect, it } from 'vitest';
import { GET } from './route';

describe('Health API', () => {
  it('should return 200 status code', async () => {
    const response = await GET();
    expect(response.status).toBe(200);
  });

  it('should return status ok', async () => {
    const response = await GET();
    const data = await response.json();
    expect(data).toHaveProperty('status', 'ok');
  });

  it('should return a valid timestamp', async () => {
    const response = await GET();
    const data = await response.json();
    expect(data).toHaveProperty('timestamp');
    expect(new Date(data.timestamp).toISOString()).toBe(data.timestamp);
  });
});