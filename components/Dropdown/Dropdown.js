import React from 'react';

import {
 Select,
 FormControl,
 FormLabel,
 FormHelperText
  } from "@chakra-ui/react"

// options should be provided as an array of objects
// options = [{label: 'first option': value: 0},]

const Dropdown = (props) => {
    return (
<FormControl id={props.id}>
  <FormLabel>{props.label}</FormLabel>
  <Select 
  onChange={props.onChange}
  placeholder="Select common policies">
  {props.options.map((option,i) => (
    <option key={i} value={option.value}>{option.label}</option>
    ))}
</Select>
  {props.helperText && 
    <FormHelperText>{props.helperText}</FormHelperText> 
    }
</FormControl>
    );
};

export default Dropdown;

