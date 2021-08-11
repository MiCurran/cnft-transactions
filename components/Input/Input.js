import React from 'react';

import {
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
    FormHelperText,
  } from "@chakra-ui/react"

const CustomInput = (props) => {
    return (
<FormControl id={props.id} marginY="8">
  <FormLabel>{props.label}</FormLabel>
  <Input onChange={props.onChange} type={props.type} value={props.value}/>
  {props.helperText && 
    <FormHelperText>{props.helperText}</FormHelperText> 
    }
</FormControl>
    );
};

export default CustomInput;

