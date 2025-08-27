/**
 * 
 * @param {import('./JsonSchemaSubscribers').JsonSchemaParserEvent} event
 * @returns 
 */
function onPropertyTypeArray(event) {
  const { target, schema, property, field } = event;
  if (property == null) {
    return;
  }
  if (property.type === 'array') {
    if (property.items != null) {
      const itemType = property.items.type;
      if (itemType) {
        field.type = target.getType(itemType);
      }
      if (property.items.$ref) {
        const definition = target.getDefinition(schema, property.items.$ref);
        if (definition) {
          if (definition.type !== 'object') {
            field.type = target.getType(definition);
            return;
          }
          // get field additional type
          field.additionalType = definition.$name;
          // set field type to Json
          field.type = 'Json';
        }
      }
    }
  }
}


/**
 * 
 * @param {import('./JsonSchemaSubscribers').JsonSchemaParserEvent} event
 * @returns 
 */
function onPropertyTypeRef(event) {
  const { target, schema, property, field } = event;
  if (property == null) {
    return;
  }
  if (property.$ref != null) {
    const definition = target.getDefinition(schema, property.$ref);
    if (definition) {
      if (definition.type !== 'object') {
        field.type = target.getType(definition);
        return;
      }
      // get field additional type
      field.additionalType = definition.$name;
      // set field type to Json
      field.type = 'Json';
    }
  }
}

export {
  onPropertyTypeArray,
  onPropertyTypeRef
}