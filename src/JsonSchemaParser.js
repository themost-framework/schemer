import { SyncSeriesEventEmitter } from '@themost/events';
import assign from 'lodash/assign'
import cloneDeep from 'lodash/cloneDeep';
import { JsonSchemaDataTypes } from './JsonSchemaDataTypes';
import * as fromSubscribers from './JsonSchemaSubscribers';

class JsonSchemaParser {
    constructor() {
        /**
         * @type {SyncSeriesEventEmitter<import('./JsonSchemaSubscribers').JsonSchemaParserPropertyEvent>}
         */
        this.resolvingProperty = new SyncSeriesEventEmitter();
        this.resolvingProperty.subscribe(fromSubscribers.onPropertyTypeRef);
        this.resolvingProperty.subscribe(fromSubscribers.onPropertyTypeArray);
        this.resolvingProperty.subscribe(fromSubscribers.onPropertyDynamicRef);
        /**
         * @type {SyncSeriesEventEmitter<import('./JsonSchemaSubscribers').JsonSchemaParserResolveEvent>}
         */
        this.resolvingSchema = new SyncSeriesEventEmitter();
    }

    /**
     * Parses a JSON schema into a data model schema.
     * @param {import('json-schema').JSONSchema7} schema
     * @param {import('@themost/common').DataModelProperties=} template
     * @returns {Map<string, import('@themost/common').DataModelProperties>}
     */
    parse(schema, template) {

        /**
         * @type {Map<string, import('@themost/common').DataModelProperties>}
         */
        const additionalModels = new Map();
        const modelTemplate = cloneDeep(template || {});
        /**
         * @type {import('@themost/common').DataModelProperties}
         */
        const model = assign({
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
        }, modelTemplate);
        const keys = Object.keys(schema.properties);
        for (const key of keys) {
            const property = schema.properties[key];
            const propertyType = this.getType(property);
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
            /**
             * @type {import('./JsonSchemaSubscribers').JsonSchemaParserPropertyEvent}
             */
            const propertyEvent = {
                target: this,
                schema,
                property,
                model: model,
                additionalSchema: [],
                field
            };
            this.resolvingProperty.emit(propertyEvent);
            for (const item of propertyEvent.additionalSchema) {
                if (item.$name !== model.name) {
                    // check if the schema already exists
                    const exists = additionalModels.get(item.$name);
                    // if not exists then parse it
                    if (exists == null) {
                        const intermediateModelTemplate = {
                            name: item.$name,
                            title: item.title || item.$name,
                            description: item.description
                        };
                        // get results
                        const intermediateModels = this.parse(item, intermediateModelTemplate);
                        // merge results
                        intermediateModels.forEach(model => additionalModels.set(model.name, model));
                    }
                }
            }
            // remove null or undefined attributes
            Object.keys(field).forEach(key => {
                if (field[key] == null) {
                    delete field[key];
                }
            });
            model.fields.push(field);
        }
        // return the current model and additional results added by the processing
        return new Map([[model.name, model], ...additionalModels]);
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
        if (definition.format) {
            const res = JsonSchemaDataTypes.get(definition.format);
            if (res) {
                return res;
            }
        }
        return JsonSchemaDataTypes.get(definition.type);
    }

    /**
     * 
     * @param {string} id 
     * @returns {import('./JsonSchemaParserBase').JSONSchema7WithName | undefined}
     */
    getSchema(id) {
        /**
         * @type {import('./JsonSchemaSubscribers').JsonSchemaParserResolveEvent}
         */
        const event = {
            target: this,
            schema: [],
            id
        };
        // resolve schema
        this.resolvingSchema.emit(event);
        return event.schema.find(schema => schema.$id === id);
    }

}

export {
    JsonSchemaParser
}