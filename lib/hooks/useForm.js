import { useEffect, useState } from 'react';
import {
    isFormValid,
    setupEffects,
    setupRequired,
    setupTouched,
    setupValidators,
    setupValues,
    touchAll
} from '../formUtils';

const useForm = (formFields) => {
    const [values, setValues] = useState(setupValues(formFields));
    const [touched, setTouched] = useState(setupTouched(formFields));
    const [requiredFields, setRequiredFields] = useState(setupRequired(formFields));
    const [validators, setValidators] = useState(setupValidators(formFields));
    const [effects, setEffects] = useState(setupEffects(formFields));
    const [valid, setValid] = useState(true);
    const formProps = {
        valid,
        values,
        setValues,
        touched,
        setTouched,
        requiredFields,
        validators,
        effects
    };

    useEffect(() => {
        setValid(isFormValid(formProps));
    }, [values, touched]);

    const validateForm = () => {
        const tempTouched = touchAll(touched);
        setTouched(tempTouched);
        const tempFormProps = { ...formProps };
        tempFormProps.touched = tempTouched;
        const isValid = isFormValid(tempFormProps);

        if (!isValid) {
            setTouched(tempTouched);
        }

        return isValid;
    };

    const updateField = (fieldId, value) => {
        const tempValues = { ...values };
        tempValues[fieldId] = value;
        setValues(tempValues);
    };

    const resetForm = (formFields) => {
        setValues(setupValues(formFields));
        setTouched(setupTouched(formFields));
        setValid(true);
    };

    const addToArrayField = (name, fields) => {
        const tempValues = { ...values };
        const tempTouched = { ...touched };
        const tempRequiredFields = { ...requiredFields };
        const tempValidators = { ...validators };
        const tempEffects = { ...effects };
        const newValue = {};
        const newTouched = {};
        const newRequired = {};
        const newValidators = {};
        const newEffects = {};

        Object.keys(fields).forEach(key => {
            newValue[key] = fields[key].value || '';
            newTouched[key] = false;
            newRequired[key] = fields[key].required;
            newValidators[key] = fields[key].validator;
            newEffects[key] = fields[key].effect;
        });

        tempValues[name].push(newValue);
        tempTouched[name].push(newTouched);
        tempRequiredFields[name].push(newRequired);
        tempValidators[name].push(newValidators);
        tempEffects[name].push(newEffects);

        setRequiredFields(tempRequiredFields);
        setValidators(tempValidators);
        setEffects(tempEffects);
        setTouched(tempTouched);
        setValues(tempValues);
    };

    const removeFromArrayField = (name, index) => {
        const tempValues = { ...values };
        const tempTouched = { ...touched };
        const tempRequiredFields = { ...requiredFields };
        const tempValidators = { ...validators };
        const tempEffects = { ...effects };

        tempValues[name].splice(index, 1);
        tempTouched[name].splice(index, 1);
        tempRequiredFields[name].splice(index, 1);
        tempValidators[name].splice(index, 1);
        tempEffects[name].splice(index, 1);

        setRequiredFields(tempRequiredFields);
        setValidators(tempValidators);
        setEffects(tempEffects);
        setTouched(tempTouched);
        setValues(tempValues);
    };

    return { formProps, validateForm, resetForm, addToArrayField, removeFromArrayField, updateField };
};

export default useForm;
