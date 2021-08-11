const handleOnChange = (e, name, props, index, property) => {
    const tempValues = { ...props.values };

    switch (e?.target?.type) {
        case 'checkbox':
            if (property) {
                tempValues[name][index][property] = e.target.checked;
            } else {
                tempValues[name] = e.target.checked;
            }
            break;
        case 'radio':
            if (property) {
                tempValues[name][index][property] = e.target.checked;
            } else {
                tempValues[name] = e.target.checked;
            }
            break;
        default:
            if (property) {
                tempValues[name][index][property] = e.target.value;
            } else {
                tempValues[name] = e.target.value;
            }
    }

    if (property) {
        if (props.effects[name][index][property]) {
            props.effects[name][index][property].forEach(effectField => {
                tempValues[effectField.field] = effectField.value;
            });
        }
    } else {
        if (props.effects[name]) {
            props.effects[name].forEach(effectField => {
                tempValues[effectField.field] = effectField.value;
            });
        }
    }

    props.setValues(tempValues);
};

const handleOnBlur = (name, props, index, property) => {
    const tempTouched = { ...props.touched };

    if (property) {
        tempTouched[name][index][property] = true;
    } else {
        tempTouched[name] = true;
    }

    props.setTouched(tempTouched);
};

const handleGetError = (name, props, index, property) => {
    let error = '';

    if (property) {
        if (props.validators[name][index][property] && props.values[name][index][property]) {
            error = props.validators[name][index][property](props.values[name][index][property], props.values);
        }
    } else {
        if (props.validators[name] && props.values[name]) {
            error = props.validators[name](props.values[name], props.values);
        }
    }

    return error;
};

export const setupAttributes = (name, props, index, property) => {
    return {
        controlId: name,
        key: name,
        error: handleGetError(name, props, index, property),
        value: property ? props.values[name][index][property] : props.values[name],
        onBlur: () => (handleOnBlur(name, props, index, property)),
        onChange: (e) => (handleOnChange(e, name, props, index, property)),
        required: property && props.requiredFields[name] ? props.requiredFields[name][index][property] : props.requiredFields[name],
        touched: property && props.touched[name] ? props.touched[name][index][property] : props.touched[name]
    };
};

export const setupValues = (fields) => {
    const values = {};

    Object.keys(fields).forEach(key => {
        if (Array.isArray(fields[key])) {
            values[key] = [];
            fields[key].forEach(arrayFields => {
                const tempArrayValue = {};
                Object.keys(arrayFields).forEach(fieldKey => {
                    if (arrayFields[fieldKey].value !== undefined) {
                        tempArrayValue[fieldKey] = arrayFields[fieldKey].value;
                    } else {
                        tempArrayValue[fieldKey] = arrayFields[fieldKey];
                    }
                });

                values[key].push(tempArrayValue);
            });
        } else {
            if (fields[key].value !== undefined) {
                values[key] = fields[key].value;
            } else {
                values[key] = fields[key];
            }
        }
    });

    return values;
};

export const setupTouched = (fields) => {
    const touched = {};
    Object.keys(fields).forEach(key => {
        if (Array.isArray(fields[key])) {
            touched[key] = [];
            fields[key].forEach(arrayFields => {
                const tempArrayValue = {};
                Object.keys(arrayFields).forEach(fieldKey => {
                    tempArrayValue[fieldKey] = false;
                });

                touched[key].push(tempArrayValue);
            });
        } else {
            touched[key] = false;
        }
    });

    return touched;
};

export const setupRequired = (fields) => {
    const required = {};
    Object.keys(fields).forEach(key => {
        if (Array.isArray(fields[key])) {
            required[key] = [];
            fields[key].forEach(arrayFields => {
                const tempArrayValue = {};
                Object.keys(arrayFields).forEach(fieldKey => {
                    tempArrayValue[fieldKey] = arrayFields[fieldKey].required;
                });

                required[key].push(tempArrayValue);
            });
        } else {
            required[key] = fields[key].required;
        }
    });

    return required;
};

export const setupValidators = (fields) => {
    const validators = {};
    Object.keys(fields).forEach(key => {
        if (Array.isArray(fields[key])) {
            validators[key] = [];
            fields[key].forEach(arrayFields => {
                const tempArrayValue = {};
                Object.keys(arrayFields).forEach(fieldKey => {
                    tempArrayValue[fieldKey] = arrayFields[fieldKey].validator;
                });

                validators[key].push(tempArrayValue);
            });
        } else {
            validators[key] = fields[key].validator;
        }
    });

    return validators;
};

export const setupEffects = (fields) => {
    const effects = {};
    Object.keys(fields).forEach(key => {
        if (Array.isArray(fields[key])) {
            effects[key] = [];
            fields[key].forEach(arrayFields => {
                const tempArrayValue = {};
                Object.keys(arrayFields).forEach(fieldKey => {
                    tempArrayValue[fieldKey] = arrayFields[fieldKey].effect;
                });

                effects[key].push(tempArrayValue);
            });
        } else {
            effects[key] = fields[key].effect;
        }
    });

    return effects;
};

export const touchAll = (fields) => {
    const touched = {};
    Object.keys(fields).forEach(key => {
        if (Array.isArray(fields[key])) {
            touched[key] = [];
            fields[key].forEach(arrayFields => {
                const tempArrayValue = {};
                Object.keys(arrayFields).forEach(fieldKey => {
                    tempArrayValue[fieldKey] = true;
                });

                touched[key].push(tempArrayValue);
            });
        } else {
            touched[key] = true;
        }
    });

    return touched;
};

export const isFormValid = (formProps) => {
    let formValid = true;
    let foundInvalidField = '';

    Object.keys(formProps.values).forEach(key => {
        if (!foundInvalidField) {
            let fieldValid = true;

            if (Array.isArray(formProps.values[key])) {
                formProps.values[key].forEach((field, index) => {
                    Object.keys(field).forEach(fieldKey => {
                        if (formProps.requiredFields[key][index][fieldKey]) {
                            fieldValid = formProps.values[key][index][fieldKey] &&
                                formProps.touched[key][index][fieldKey] &&
                                handleGetError(key, formProps, index, fieldKey) === '';
                        } else {
                            fieldValid = handleGetError(key, formProps, index, fieldKey) === '';
                        }
                    });
                });
            } else {
                if (formProps.requiredFields[key]) {
                    fieldValid = formProps.values[key] && formProps.touched[key] && handleGetError(key, formProps) === '';
                } else {
                    fieldValid = handleGetError(key, formProps) === '';
                }
            }

            if (!fieldValid) {
                foundInvalidField = key;
                formValid = false;
            }
        }
    });

    return formValid;
};
