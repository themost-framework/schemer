import assign from 'lodash/assign';
import cloneDeep from 'lodash/cloneDeep';

class JsonEnumSchemaParser {
  constructor() {
    //
  }

  /**
     * Parses a JSON schema which represents an enumeration -where properties are values of enum model- and generates a data model schema.
     * @param {import('json-schema').JSONSchema7} schema
     * @param {import('@themost/common').DataModelProperties=} template
     * @returns {Map<string, import('@themost/common').DataModelProperties>}
     */
  parse(schema, template) {

    const enumTemplate = cloneDeep(template || {});

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
      'source': null,
      'view': null,
      'version': schema.$version || '1.0.0',
      'fields': [
        {
          '@id': 'https://universis.io/schemas/name',
          'name': 'name',
          'title': 'Name',
          'type': 'Text',
          'nullable': false,
          'size': 36,
          'primary': true
        },
        {
          '@id': 'https://universis.io/schemas/description',
          'name': 'description',
          'title': 'Description',
          'type': 'Note'
        }
      ],
      'constraints': [],
      'eventListeners': [],
      'privileges': [
        {
          'type': 'global',
          'mask': 1,
          'account': '*'
        },
        {
          'type': 'global',
          'mask': 14,
          'account': 'Administrators'
        }
      ]
    }, enumTemplate);

    if (model.view == null && model.source == null && model.name != null) {
      // assign default source and view for enum models
      assign(model, {
        'source': model.name,
        'view': model.name
      });
    }

    model.seed = Object.keys(schema.properties).map((property) => {
      return {
        'name': property,
        'description': schema.properties[property].description
      };
    });
    return new Map([
      [model.name,
        model]
    ]);
  }
}
export { JsonEnumSchemaParser };
