import { DataModelProperties, DataFieldBase } from '@themost/common';
import { JSONSchema7, JSONSchema7Definition } from 'json-schema';

export declare interface JSONSchema7DefinitionWithName extends JSONSchema7Definition {
    $name?: string;
}

export declare interface JsonSchemaParserBase {
    parse(schema: JSONSchema7): DataModelProperties;
    getDefinition(jsonSchema: JSONSchema7, referencePath: string): JSONSchema7DefinitionWithName | undefined;
    getType(definition: JSONSchema7Definition): string | undefined;
}