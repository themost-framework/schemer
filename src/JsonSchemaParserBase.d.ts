import { DataModelProperties } from '@themost/common';
import { JSONSchema7, JSONSchema7Definition } from 'json-schema';

export declare interface JSONSchema7WithName extends JSONSchema7 {
    $name?: string;
}

export declare interface JsonSchemaParserBase {
    parse(schema: JSONSchema7): Map<string, DataModelProperties>;
    getDefinition(jsonSchema: JSONSchema7, referencePath: string): JSONSchema7WithName | undefined;
    getType(definition: JSONSchema7Definition): string | undefined;
    getSchema(id: string): JSONSchema7WithName | undefined;
}