import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Form, Dropdown as BsDropdown } from 'react-bootstrap';
import classes from './Dropdown.module.scss';
import DropdownIcon from './components/DropdownIcon';

const Dropdown = (props) => {
    const { large = false } = props;

    const optionsMap = useMemo(() => {
        const tempMap = {};

        props.options.forEach(option => {
            tempMap[option[props.valueProp]] = option[props.labelProp];
        });

        return tempMap;
    }, [props.options]);

    const dropdownClass = props.error || (props.required && props.touched && !props.value)
        ? `${classes.dropdown} ${classes.formControlError}`
        : classes.dropdown;

    const handleDropdownChange = (value) => {
        if (props.onChange) {
            props.onChange({ target: { type: 'dropdown', value } });
        }
    };

    return (
        <Form.Group
            controlId={props.controlId}
            className={`${classes.formGroup} ${props.className}`}>
            <Form.Label>{props.label}</Form.Label>
            {props.required &&
            <Form.Text className={(props.touched && !props.value) || props.error ? classes.formRequiredError : classes.formRequired}>
                *
            </Form.Text>
            }
            <Form.Text className={classes.formError}>
                {props.error}
            </Form.Text>
            <BsDropdown as="div" onSelect={handleDropdownChange}>
                <BsDropdown.Toggle
                    className={`form-control ${dropdownClass} ${large ? classes.large : null}`}
                    as="div"
                    tabIndex={0}
                    id={props.controlId}
                    data-test={props.controlId}
                    onBlur={props.onBlur}
                >
                    {optionsMap[props.value] || props.placeholder || ''}
                    <DropdownIcon className={classes.dropdownIcon}/>
                </BsDropdown.Toggle>
                <BsDropdown.Menu className={classes.dropdownMenu}>
                    {props.options.map(option => {
                        return (
                            <BsDropdown.Item
                                disabled={props.disabled}
                                className={classes.dropdownItem}
                                key={option[props.valueProp]}
                                eventKey={option[props.valueProp]}
                            >
                                {option[props.labelProp]}
                            </BsDropdown.Item>
                        );
                    })}
                </BsDropdown.Menu>
            </BsDropdown>
        </Form.Group>
    );
};

Dropdown.propTypes = {
    className: PropTypes.string,
    controlId: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    error: PropTypes.string,
    label: PropTypes.string,
    labelProp: PropTypes.string,
    large: PropTypes.bool,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    options: PropTypes.array,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    touched: PropTypes.bool,
    value: PropTypes.string,
    valueProp: PropTypes.string
};

Dropdown.defaultProps = {
    className: '',
    error: '',
    disabled: false,
    label: '',
    labelProp: 'label',
    onBlur: () => {},
    onChange: () => {},
    options: [],
    placeholder: '',
    required: false,
    touched: false,
    value: '',
    valueProp: 'value'
};

export default Dropdown;
