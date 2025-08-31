import { DataModelProperties } from '@themost/common';
import { JSONSchema7WithName } from './JsonSchemaParserBase';

export declare class JsonEnumSchemaParser {
  constructor();
  parse(schema: JSONSchema7WithName, template?: DataModelProperties): Map<string, DataModelProperties>;
}
