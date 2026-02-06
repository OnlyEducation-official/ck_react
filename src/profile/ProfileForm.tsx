import SimpleTextField from "@/GlobalComponent/SimpleTextField";
import {
  profileFormSchema,
  ProfileFormValues,
} from "@/validation/profile.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Avatar,
  Box,
  Button,
  Grid,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { MuiTelInput } from "mui-tel-input";
import { MuiFileInput } from "mui-file-input";
import GlobalModal from "@/GlobalComponent/GlobalModal";
import { GlobalDateField } from "@/GlobalComponent/GlobalDateField";
import { toast } from "react-toastify";
import { AuthContext } from "@/context/AuthContext.js";
import { format, parseISO, isValid } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toastResponse } from "@/util/toastResponse.js";

type user = {
  "teacher_name": string | null,
  "teacher_surname": string | null,
  "teacher_bio": string | null,
  "teacher_contact": number | null,
  "teacher_email": string | null,
  "teacher_dob": Date | null
}


export default function ProfileForm() {

  const [open, setOpen] = useState(false);
  const onClose = () => setOpen(false);
  const [user, setUser] = useState<user | null>(null);


  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      surname: "",
      bio: "",
      contact: "",
      email: "",
      dob: "",
    },
  });

  const GENDER_OPTIONS = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const photoFile = useWatch({
    control,
    name: "photo",
  });

  const [preview, setPreview] = useState<string | null>(null);
  const jwt_token = localStorage.getItem("auth_token");
  const navigate = useNavigate();


  useEffect(() => {


    const fetchItem = async () => {

      if (jwt_token === "") return;


      let url = `${import.meta.env.VITE_BASE_URL}users/me?fields[0]=teacher_name&fields[1]=teacher_surname&fields[2]=teacher_bio&fields[3]=teacher_contact&fields[4]=teacher_email&fields[5]=teacher_dob&fields[6]=teacher_gender`

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${jwt_token}`,
        },
      });

      const json = await res.json();

      console.log("item:", json)

      reset({
        name: json.teacher_name,
        surname: json.teacher_surname,
        bio: json.teacher_bio,
        contact: json.teacher_contact,
        email: json.teacher_email,
        dob: json.teacher_dob
          ? format(parseISO(json.teacher_dob), 'dd/MM/yyyy')
          : undefined,
        gender: json.teacher_gender
      });
    };

    fetchItem();
  }, []);

  useEffect(() => {
    if (!photoFile) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(photoFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [photoFile]);

  const onSubmit = async (data: ProfileFormValues) => {

    console.log("FORM DATA", data);

    try {

      // const url = `${import.meta.env.VITE_BASE_URL}users/me`

      // if (jwt_token === "") return;

      // const response = await fetch(url, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${jwt_token}`,
      //   },
      //   body: JSON.stringify({ data: data }),
      // });
      // const success = await toastResponse(
      //   response,
      //   "Profile Updated!!",
      //   "Profile Updated!!"
      // );

      // if (!success) {
      //   return
      // } else {
      //   reset();
      //   navigate("/profile");
      // }

    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }

  };


  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: "100%" }}>
      <Typography variant="h6" mb={2} fontWeight="bold">
        User Details
      </Typography>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <SimpleTextField name="name" control={control} label="First Name" />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <SimpleTextField name="surname" control={control} label="Surname" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <GlobalDateField name="dob" control={control} label="Date of Birth" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="gender"
            control={control}
            rules={{ required: "Gender is required" }}
            render={({ field, fieldState }) => (
              <FormControl fullWidth size="small" error={!!fieldState.error}>
                <InputLabel>Gender</InputLabel>

                <Select
                  size="medium"
                  {...field}
                  label="Gender"
                  value={field.value ?? ""}
                >
                  <MenuItem value="">
                    <em>Select gender</em>
                  </MenuItem>

                  {GENDER_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={watch('gender') === opt.label ? watch('gender') : opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>

                {fieldState.error && (
                  <FormHelperText>{fieldState.error.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <SimpleTextField
            name="bio"
            control={control}
            label="Personal Bio"
            type="textarea"
            rows={3}
          />
        </Grid>

        <Grid
          size={{ xs: 12, sm: 6 }}
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 2,
          }}
        >
          {/* 🔥 This is the line you mentioned */}
          {/* <SimpleTextField
            name="contact"
            control={control}
            label="Mobile Number"
            type="number"
          /> */}
          <Controller
            name="contact"
            control={control}
            render={({ field }) => (
              <MuiTelInput
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                defaultCountry="IN"
                fullWidth
                size="small"
                onlyCountries={["IN"]}
                label="Phone Number"
                placeholder="eg: 9876543210"
                disableDropdown
                error={!!errors?.contact}
                helperText={errors.contact?.message}
                forceCallingCode
                sx={{
                  "& input": {
                    backgroundColor: "#fff",
                  },

                  "& input:-webkit-autofill": {
                    WebkitBoxShadow: "0 0 0 1000px #fff inset",
                    WebkitTextFillColor: "#000",
                    caretColor: "#000",
                    transition: "background-color 9999s ease-out",
                  },

                  "& input:-webkit-autofill:focus": {
                    WebkitBoxShadow: "0 0 0 1000px #fff inset",
                  },
                }}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <SimpleTextField
            name="email"
            control={control}
            label="Email"
            type="email"
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Controller
            name="photo"
            control={control}
            rules={{
              required: "Photo is required",
              validate: (file: File | null) =>
                file && file.type.startsWith("image/")
                  ? true
                  : "Only image files are allowed",
            }}
            render={({ field, fieldState }) => (
              <Stack spacing={2}>
                <MuiFileInput
                  {...field}
                  value={field.value || null}
                  onChange={(file) => field.onChange(file)}
                  label="Upload Photo"
                  placeholder="Choose an image"
                  inputProps={{ accept: "image/*" }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                />

                {/* ✅ Responsive Image Preview */}
                {preview && (
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems={{ xs: "center", sm: "flex-start" }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Preview
                    </Typography>

                    <Avatar
                      src={preview}
                      sx={{
                        width: { xs: 96, sm: 120, md: 140 },
                        height: { xs: 96, sm: 120, md: 140 },
                        borderRadius: "50%",
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    />
                  </Box>
                )}
              </Stack>
            )}
          />
        </Grid>

        {/* <Grid size={{ xs: 12, sm: 6 }}>
          <SimpleTextField
            name="aadhaar"
            control={control}
            label="Aadhaar Number"
            type="number" 
          />
        </Grid> */}

        {/* <Grid size={{ xs: 12, sm: 6 }}>
          <SimpleTextField name="pan" control={control} label="PAN Number" />
        </Grid> */}

        {/* Photo Upload */}

        <Grid size={{ xs: 12 }}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

//  <Grid size={{ xs: 12 }}>
//           {/* <Button variant="outlined" component="label">
//             Upload Photo
//             <input
//               type="file"
//               hidden
//               accept="image/*"
//               onChange={(e) => {
//                 if (e.target.files?.[0]) {
//                   setValue("photo", e.target.files[0], {
//                     shouldValidate: true,
//                   });
//                 }
//               }}
//             />
//           </Button> */}
//           <Controller
//             name="photo"
//             control={control}
//             rules={{
//               required: "Photo is required",
//               validate: (file: File | null) =>
//                 file && file.type.startsWith("image/")
//                   ? true
//                   : "Only image files are allowed",
//             }}
//             render={({ field, fieldState }) => (
//               <Box>
//                 <MuiFileInput
//                   {...field}
//                   value={field.value || null}
//                   onChange={(file) => field.onChange(file)}
//                   label="Upload Photo"
//                   placeholder="Choose an image"
//                   inputProps={{ accept: "image/*" }}
//                   error={!!fieldState.error}
//                   helperText={fieldState.error?.message}
//                   fullWidth
//                 />
//               </Box>
//             )}
//           />
//         </Grid>
