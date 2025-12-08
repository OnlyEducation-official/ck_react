// import * as React from 'react';
// import Box from '@mui/material/Box';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';
// import FormHelperText from '@mui/material/FormHelperText';
// import { Controller } from 'react-hook-form';

// const alphabetArrayOptions = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

// export default function SelectComponent({ control, name, label = "Option Label", rules, defaultValue = '' }) {
//     return (
//         <Controller
//             name={name}
//             control={control}
//             defaultValue={defaultValue}
//             rules={rules}
//             render={({ field, fieldState: { error } }) => (
//                 <Box sx={{ minWidth: 120 }}>
//                     <FormControl fullWidth error={!!error}>
//                         <InputLabel id={`${name}-label`}>{label}</InputLabel>
//                         <Select
//                             {...field}
//                             labelId={`${name}-label`}
//                             id={name}
//                             label={label}
//                         >
//                             {alphabetArrayOptions.map((option) => (
//                                 <MenuItem key={option} value={option}>
//                                     {option}
//                                 </MenuItem>
//                             ))}
//                         </Select>
//                         {error && <FormHelperText>{error.message}</FormHelperText>}
//                     </FormControl>
//                 </Box>
//             )}
//         />
//     );
// }