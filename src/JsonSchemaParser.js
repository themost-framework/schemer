import { SyncSeriesEventEmitter } from '@themost/events';
import assign from 'lodash/assign'
import cloneDeep from 'lodash/cloneDeep';
import { JsonSchemaDataTypes } from './JsonSchemaDataTypes';
import * as fromSubscribers from './JsonSchemaSubscribers';

class JsonSchemaParser {
    constructor() {
        /**
         * @type {SyncSeriesEventEmitter<{target: JsonSchemaParser, schema: import('json-schema').JSONSchema7, property: import('json-schema').JSONSchema7Definition, model: import('@themost/common').DataModelProperties, field: import('@themost/common').DataFieldBase}>}
         */
        this.beforeProperty = new SyncSeriesEventEmitter();
        this.beforeProperty.subscribe(fromSubscribers.onPropertyTypeRef);
        this.beforeProperty.subscribe(fromSubscribers.onPropertyTypeArray);
    }

    /**
     * Parses a JSON schema into a data model schema.
     * @param {import('json-schema').JSONSchema7} schema
     * @param {import('@themost/common').DataModelProperties=} template
     * @returns {import('@themost/common').DataModelProperties}
     */
    parse(schema, template) {

        const propertiesTemplate = cloneDeep(template || {});
        /**
         * @type {import('@themost/common').DataModelProperties}
         */
        const properties = assign({
            '$schema': 'https://themost-framework.github.io/themost/models/2018/2/schema.json',
            '@id': schema.$id,
            'caching': 'conditional',
            'hidden': true,
            'name': null,
            'title': schema.title,
            'description': schema.description,
            'version': schema.$version || '1.0.0',
            'fields': [],
            'constraints': [],
            'eventListeners': [],
            'privileges': [
                {
                    'type': 'global',
                    'mask': 15,
                },
                {
                    'type': 'global',
                    'mask': 15,
                    'account': 'Administrators'
                }
            ]
        }, propertiesTemplate);
        const keys = Object.keys(schema.properties);
        for (const key of keys) {
            const property = schema.properties[key];
            let { type } = property;
            const propertyType = JsonSchemaDataTypes.get(type);
            /**
             * @type {import('@themost/common').DataField}
             */
            const field = {
                '@id': `urn:themost:framework:schemas:${key}`,
                'name': key,
                'title': property.title,
                'description': property.description,
                'type': propertyType,
                'nullable': schema?.required?.includes(key) !== true,
                'many': property.type === 'array'
            };
            this.beforeProperty.emit({
                target: this,
                schema,
                property,
                model: properties,
                field
            });
            // remove null or undefined attributes
            Object.keys(field).forEach(key => {
                if (field[key] == null) {
                    delete field[key];
                }
            });
            properties.fields.push(field);
        }
        return properties;
    }

    /**
     * 
     * @param {import('json-schema').JSONSchema7} jsonSchema schema 
     * @param {string} referencePath
     * @returns {{ import('./JsonSchemaParserBase').JSONSchema7DefinitionWithName } | undefined}
     */
    getDefinition(jsonSchema, referencePath) {
        const match = referencePath.match(/#\/(.+?)\/(.+)/);
        if (match) {
            const definitionsProperty = match[1];
            const definitionType = match[2];
            if (Object.prototype.hasOwnProperty.call(jsonSchema, definitionsProperty)) {
                const definitions = jsonSchema[definitionsProperty];
                if (definitions) {
                    const definition = definitions[definitionType];
                    if (definition) {
                        return Object.assign({ $name: definitionType }, definition);
                    }
                }
            }
        }
    }

    /**
     * @type {import('json-schema').JSONSchema7Definition} definition
     * @returns {string | undefined}
     */
    getType(definition) {
        const format = definition.format;
        if (definition.format) {
            const res = JsonSchemaDataTypes.get(definition.format);
            if (res) {
                return res;
            }
        }
        return JsonSchemaDataTypes.get(definition.type);
    }

}

export {
    JsonSchemaParser
}