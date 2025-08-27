import { JsonSchemaParser } from "../src";
import { readFile } from 'fs/promises';
import path from 'path';

describe('JsonSchemaParser', () => {
    it('should create instance', () => {
        const parser = new JsonSchemaParser();
        expect(parser).toBeTruthy();
    });
    it('should parse json schema', async () => {
        const parser = new JsonSchemaParser();
        const schema = JSON.parse(await readFile(path.join(__dirname, './schemas/BlogPost.json'), 'utf-8'));
        const result = parser.parse(schema, {
            name: 'BlogPost',
            description: 'A blog post',
            fields: []
        });
        expect(result).toBeTruthy();
        expect(result.name).toBe('BlogPost');
    });
});