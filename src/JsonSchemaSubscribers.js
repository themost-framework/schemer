/**
 * 
 * @param {import('./JsonSchemaSubscribers').JsonSchemaParserPropertyEvent} event
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
        field.type = target.getType(property.items);
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
 * @param {import('./JsonSchemaSubscribers').JsonSchemaParserPropertyEvent} event
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

/**
 * 
 * @param {import('./JsonSchemaSubscribers').JsonSchemaParserPropertyEvent} event
 * @returns 
 */
function onPropertyDynamicRef(event) {
  const { target, additionalSchema, property, field } = event;
  if (property == null) {
    return;
  }
  if (property.$ref && property.$ref.startsWith('#') === false) {
    // resolve dynamic schema
    const otherSchema = target.getSchema(property.$ref);
    if (otherSchema) {
      additionalSchema.push(otherSchema);
      field.type = otherSchema.$name;
      delete field.additionalType;
    }
  }
}
  
export {
  onPropertyTypeArray,
  onPropertyTypeRef,
  onPropertyDynamicRef
}