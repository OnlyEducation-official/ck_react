import * as React from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import Autocomplete, {
    AutocompleteProps,
} from '@mui/material/Autocomplete';
import {
    Control,
    Controller,
    FieldValues,
    Path,
} from 'react-hook-form';

type SimpleAutocompleteProps<
    TFieldValues extends FieldValues,
    TOption extends string | { label: string; value: string } = string
> = {
    name: Path<TFieldValues>;
    control: Control<TFieldValues>;
    label?: string;
    options: TOption[];
    textFieldProps?: TextFieldProps;
    autocompleteProps?: Omit<
        AutocompleteProps<TOption, false, false, false>,
        'options' | 'renderInput' | 'value' | 'onChange'
    >;
};

export function SimpleAutocomplete<
    TFieldValues extends FieldValues,
    TOption extends string | { label: string; value: string } = string
>({
    name,
    control,
    label = 'Select',
    options,
    textFieldProps,
    autocompleteProps,
}: SimpleAutocompleteProps<TFieldValues, TOption>) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => {
                // For string options, value is the string itself
                // For object options, you can store value or whole object based on your form setup
                const getOptionLabel = (option: TOption) =>
                    typeof option === 'string' ? option : option.label;

                return (
                    <Autocomplete
                        {...autocompleteProps}
                        options={options}
                        getOptionLabel={getOptionLabel}
                        value={
                            options.find((opt) =>
                                typeof opt === 'string'
                                    ? opt === field.value
                                    : opt.value === field.value || opt.label === field.value
                            ) || null
                        }
                        onChange={(_, newValue) => {
                            if (typeof newValue === 'string' || newValue === null) {
                                field.onChange(newValue);
                            } else {
                                // store `value` in form; change if you want to store whole object
                                field.onChange(newValue.value);
                            }
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={label}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                {...textFieldProps}
                            />
                        )}
                    />
                );
            }}
        />
    );
}
