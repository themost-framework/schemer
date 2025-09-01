import { DataFieldBase, DataModelProperties } from '@themost/common';
import { JSONSchema7, JSONSchema7Definition } from 'json-schema';
import { JSONSchema7WithName, JsonSchemaParserBase } from './JsonSchemaParserBase';

export declare interface JsonSchemaParserPropertyEvent {
    target?: JsonSchemaParserBase,
    schema?: JSONSchema7,
    property: JSONSchema7Definition,
    model: DataModelProperties,
    additionalSchema?: JSONSchema7WithName[],
    field: DataFieldBase
}

export declare interface JsonSchemaParserResolveEvent {
    target?: JsonSchemaParserBase,
    schema?: JSONSchema7WithName[],
    id: string
}

export declare function onPropertyTypeArray(event: JsonSchemaParserPropertyEvent): void;
export declare function onPropertyTypeRef(event: JsonSchemaParserPropertyEvent): void;
export declare function onPropertyDynamicRef(event: JsonSchemaParserPropertyEvent): void;
