import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import { FormControlLabel } from '@mui/material';

export default function CheckBox({ checked, setValue, name }) {

    const handleChange = () => {
        setValue(name, !checked);
    };

    return (
        <FormControlLabel control={
            <Checkbox
                checked={checked}
                onChange={() => handleChange()}
                slotProps={{
                    input: { 'aria-label': 'controlled' },
                }}
            />
        } label="is_correct" />

    );
}