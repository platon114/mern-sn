import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    useTheme,
    useMediaQuery,
    TextField,
    Button,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import Navbar from "scenes/navbar";
import { setSearchText } from "state";

const updateProfileSchema = yup.object().shape({
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    location: yup.string().required("required"),
    occupation: yup.string().required("required"),
    picture: yup.string(),
});


const UpdateProfile = () => {
    const dispatch = useDispatch();
    const { palette } = useTheme();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const { _id, email: currentUserEmail } = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const navigate = useNavigate();
    const [isImage, setIsImage] = useState(false);
    const [image, setImage] = useState(null);
    const searchText = useSelector((state) => state.searchText);

    const [formValues, setFormValues] = useState({
        firstName: "",
        lastName: "",
        email: currentUserEmail, // Set the email to the existing email
        location: "",
        occupation: "",
        picturePath: "",
    });
    const [formErrors, setFormErrors] = useState({});
    const [touchedFields, setTouchedFields] = useState({});

    useEffect(() => {
        // Fetch user data and set formValues when the component mounts
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:3001/users/${_id}`, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                });
                const userData = await response.json();

                setFormValues((prevValues) => ({
                    ...prevValues,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    location: userData.location,
                    occupation: userData.occupation,
                    // The email is already set to the existing email above
                }));
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [_id, currentUserEmail]);

    useEffect(() => {
        updateProfileSchema
            .validate(formValues, { abortEarly: false })
            .then(() => setFormErrors({}))
            .catch((err) => {
                const errors = {};
                err.inner.forEach((error) => {
                    errors[error.path] = error.message;
                });
                setFormErrors(errors);
            });
    }, [formValues]);

    const handleFieldChange = (field, value) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [field]: value,
        }));
        setTouchedFields((prevTouched) => ({
            ...prevTouched,
            [field]: true,
        }));
    };




    const handleUpdateProfile = async () => {
        try {
            const requestBody = {
                id: _id,
                firstName: formValues.firstName,
                lastName: formValues.lastName,
                email: formValues.email,
                occupation: formValues.occupation,
                picturePath: formValues.picturePath,
            };
    
            const response = await fetch(`http://localhost:3001/users/${_id}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),  // Преобразуем объект в JSON
            });
    
            const responseData = await response.json();
            console.log("Response from server:", responseData);
            navigate("/home");
        } catch (error) {
            console.error("Error:", error);
        }
    };





    const isFieldError = (field) =>
        Boolean(touchedFields[field] && formErrors[field]);

    return (
        <Box>
            <Navbar onSearch={(text) => dispatch(setSearchText(text))} />
            <Box
                width={isNonMobile ? "50%" : "93%"}
                p="2rem"
                m="2rem auto"
                borderRadius="1.5rem"
                backgroundColor={palette.background.alt}
            >

                <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
                    Обновление профиля
                </Typography>
                <form onSubmit={(e) => e.preventDefault()}>
                    <Box
                        display="grid"
                        gap="30px"
                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                        sx={{
                            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                        }}
                    >
                        <TextField
                            label="Имя"
                            onBlur={() => setTouchedFields({ ...touchedFields, firstName: true })}
                            onChange={(e) => handleFieldChange("firstName", e.target.value)}
                            value={formValues.firstName}
                            name="firstName"
                            error={isFieldError("firstName")}
                            helperText={isFieldError("firstName") && formErrors.firstName}
                            sx={{ gridColumn: "span 2" }}
                        />
                        <TextField
                            label="Фамилия"
                            onBlur={() => setTouchedFields({ ...touchedFields, lastName: true })}
                            onChange={(e) => handleFieldChange("lastName", e.target.value)}
                            value={formValues.lastName}
                            name="lastName"
                            error={isFieldError("lastName")}
                            helperText={isFieldError("lastName") && formErrors.lastName}
                            sx={{ gridColumn: "span 2" }}
                        />
                        <TextField
                            label="Локация"
                            onBlur={() => setTouchedFields({ ...touchedFields, location: true })}
                            onChange={(e) => handleFieldChange("location", e.target.value)}
                            value={formValues.location}
                            name="location"
                            error={isFieldError("location")}
                            helperText={isFieldError("location") && formErrors.location}
                            sx={{ gridColumn: "span 4" }}
                        />
                        <TextField
                            label="Занятие"
                            onBlur={() => setTouchedFields({ ...touchedFields, occupation: true })}
                            onChange={(e) => handleFieldChange("occupation", e.target.value)}
                            value={formValues.occupation}
                            name="occupation"
                            error={isFieldError("occupation")}
                            helperText={isFieldError("occupation") && formErrors.occupation}
                            sx={{ gridColumn: "span 4" }}
                        />
                    </Box>

                    {/* BUTTON */}
                    <Box>
                        <Button
                            fullWidth
                            onClick={handleUpdateProfile}
                            sx={{
                                m: "2rem 0",
                                p: "1rem",
                                backgroundColor: palette.primary.main,
                                color: palette.background.alt,
                                "&:hover": { color: palette.primary.main },
                            }}
                        >
                            Обновить профиль
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    );
};

export default UpdateProfile;
