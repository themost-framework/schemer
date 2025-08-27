import { DataFieldBase, DataModelProperties } from '@themost/common';
import { JSONSchema7, JSONSchema7Definition } from 'json-schema';
import { JsonSchemaParserBase } from './JsonSchemaParserBase';

export declare interface JsonSchemaParserEvent {
    target?: JsonSchemaParserBase,
    schema?: JSONSchema7,
    property: JSONSchema7Definition,
    model: DataModelProperties,
    field: DataFieldBase
};

export declare function onPropertyTypeArray(event: JsonSchemaParserEvent): void;
export declare function onPropertyTypeRef(event: JsonSchemaParserEvent): void;
