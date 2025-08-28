import { JsonSchemaParser } from "../src";
import { readFile, mkdir, writeFile, stat } from 'fs/promises';
import path from 'path';

describe('JsonSchemaParser', () => {

    beforeAll(async () => {
        await stat(path.join(__dirname, '.tmp')).catch(async () => {
            await mkdir(path.join(__dirname, '.tmp'));
        });
    });

    it('should create instance', () => {
        const parser = new JsonSchemaParser();
        expect(parser).toBeTruthy();
    });
    it('should parse json schema', async () => {
        const parser = new JsonSchemaParser();
        const schema = JSON.parse(await readFile(path.join(__dirname, './schemas/UserProfile.json'), 'utf-8'));
        const result = parser.parse(schema, {
            name: 'UserProfile',
            title: 'User Profile',
            description: 'A user profile'
        }).get('UserProfile');
        expect(result).toBeTruthy();
        await writeFile(path.join(__dirname, '.tmp/UserProfile.json'), JSON.stringify(result, null, 2));
        expect(result.name).toBe('UserProfile');
        for (const field of result.fields) {
            expect(field.name).toBeTruthy();
            expect(field.type).toBeTruthy();
        }
        const email = result.fields.find(field => field.name === 'email');
        expect(email).toBeTruthy();
        expect(email.nullable).toBe(false);
    });

    it('should parse additional json schema', async () => {
        
        const otherSchemas = [];
        const schema1 = JSON.parse(await readFile(path.join(__dirname, './schemas/UserProfile.json'), 'utf-8'))
        schema1.$name = 'UserProfile';
        otherSchemas.push(schema1);

        const parser = new JsonSchemaParser();
        parser.resolvingSchema.subscribe((event) => {
            const schema = otherSchemas.find(s => s.$id === event.id);
            if (schema) {
                event.schema.push(schema);
            }
        });

        const schema = JSON.parse(await readFile(path.join(__dirname, './schemas/BlogPost.json'), 'utf-8'));
        const results = parser.parse(schema, {
            name: 'BlogPost',
            title: 'BlogPost',
            description: 'A blog post'
        });
        for (const [name, result] of results) {
            await writeFile(path.join(__dirname, `.tmp/${name}.json`), JSON.stringify(result, null, 2));
            expect(result.name).toBe(name);
            for (const field of result.fields) {
                expect(field.name).toBeTruthy();
                expect(field.type).toBeTruthy();
            }
        }
        expect(results.size).toBeGreaterThan(1);
    });
});