import { DataModelProperties, DataFieldBase } from '@themost/common';
import { JSONSchema7, JSONSchema7Definition } from 'json-schema';
import { SyncSeriesEventEmitter } from '@themost/events';
import { JsonSchemaParserBase } from './JsonSchemaParserBase';
export declare class JsonSchemaParser implements JsonSchemaParserBase {
    beforeProperty: SyncSeriesEventEmitter<{target: JsonSchemaParser, schema: JSONSchema7, property: JSONSchema7Definition, model: DataModelProperties, field: DataFieldBase}>;
    parse(schema: JSONSchema7): DataModelProperties;
    getDefinition(jsonSchema: JSONSchema7, referencePath: string): JSONSchema7Definition;
    getType(definition: JSONSchema7Definition): string | undefined;
}