import React, { useState, ChangeEvent, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { observer } from 'mobx-react-lite';

const invalid: number = -1;

interface NumberFieldProps {
    value: number;
    min?: number | undefined;
    max?: number | undefined;
    onChange: (name:string, value: number) => void;
    label?: string;
    [key: string]: any;
}

const NumberField: React.FC<NumberFieldProps> = observer(({ value, min, max, onChange, ...props }) => {
    const [internalValue, setInternalValue] = useState<string>(value.toString());

    const internalNumber = parseFloat(internalValue);

    useEffect(() => {
        if(value != invalid)
            setInternalValue(value.toString());
    }, [value]);
    

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const numericValue = parseFloat(value);
        setInternalValue(value);
        if (!isNaN(numericValue) && ((min == undefined || numericValue >= min) && (max == undefined || numericValue <= max))) {
            onChange(name, numericValue);
        } else {
            onChange(name, invalid);
        }
    };

    return (
        <TextField
            value={internalValue}
            onChange={handleChange}
            {...props}
            error={isNaN(internalNumber) || ((min != undefined && internalNumber < min) || (max != undefined && internalNumber > max))}
        />
    );
});

export default NumberField;
