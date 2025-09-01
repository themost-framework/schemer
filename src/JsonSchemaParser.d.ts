import { DataModelProperties, DataFieldBase } from '@themost/common';
import { JSONSchema7, JSONSchema7Definition } from 'json-schema';
import { SyncSeriesEventEmitter } from '@themost/events';
import { JSONSchema7WithName, JsonSchemaParserBase } from './JsonSchemaParserBase';
import { JsonSchemaParserPropertyEvent, JsonSchemaParserResolveEvent } from './JsonSchemaSubscribers';
export declare class JsonSchemaParser implements JsonSchemaParserBase {
    resolvingProperty: SyncSeriesEventEmitter<JsonSchemaParserPropertyEvent>;
    resolvingSchema: SyncSeriesEventEmitter<JsonSchemaParserResolveEvent>;
    parse(schema: JSONSchema7): Map<string, DataModelProperties>;
    getDefinition(jsonSchema: JSONSchema7, referencePath: string): JSONSchema7WithName | undefined;
    getType(definition: JSONSchema7Definition): string | undefined;
    getSchema(id: string): JSONSchema7WithName | undefined;
}