"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PythonIntegrationClient = void 0;
class PythonIntegrationClient {
    baseUrl;
    constructor(baseUrl = process.env.INTERNAL_API_URL ?? 'http://localhost:4000') {
        this.baseUrl = baseUrl.replace(/\/$/, '');
    }
    async createToken(payload) {
        return this.post('/internal/tokens', payload);
    }
    async createAlert(payload) {
        return this.post('/internal/alerts', payload);
    }
    async post(path, body) {
        const response = await fetch(`${this.baseUrl}${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Request failed: ${String(response.status)} ${text}`);
        }
        return (await response.json());
    }
}
exports.PythonIntegrationClient = PythonIntegrationClient;
//# sourceMappingURL=python-client.js.map