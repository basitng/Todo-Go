import React, { useCallback, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid,
  CircularProgress,
} from "@mui/material";
import instance from "../../utils/axios";

const states = [
  {
    value: "alabama",
    label: "Alabama",
  },
  {
    value: "new-york",
    label: "New York",
  },
  {
    value: "san-francisco",
    label: "San Francisco",
  },
  {
    value: "los-angeles",
    label: "Los Angeles",
  },
];
const CURRENT_USER_API_URL = "/users/me";

export const AccountProfileDetails = () => {
  const [loading, setLoading] = useState(false);

  const [values, setValues] = useState({
    phone: "",
    state: "los-angeles",
    country: "USA",
    email: "",
    is_active: false,
    is_superuser: false,
    is_verify: false,
  });

  const handleChange = useCallback((event) => {
    setValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  }, []);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    setLoading(true);
    instance.patch("/users/me", { email: values.email }).then(() => {
      setLoading(false);
      alert("Profile successfully updated");
    });
  }, []);

  React.useEffect(() => {
    const fetchDataAndToggleEdited = async () => {
      const fetchData = async () => {
        try {
          const response = await instance.get(CURRENT_USER_API_URL);
          const userResponse = response.data;
          setValues((prevUserData) => ({ ...prevUserData, ...userResponse }));
          console.log(
            "🚀 ~ file: account-profile-details.js:58 ~ fetchData ~ response:",
            userResponse.is_active,
            values
          );
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    };

    fetchDataAndToggleEdited();
  }, []);

  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="The information can be edited" title="Profile" />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  onChange={handleChange}
                  required
                  value={values.email}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="IsActive"
                  name="phone"
                  onChange={handleChange}
                  value={values.is_active ? "Active" : "Inactive"}
                  defaultValue={values.is_active}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Is Superuser"
                  onChange={handleChange}
                  required
                  value={
                    values.is_superuser
                      ? "You are not a Superuser"
                      : "You are a Superuser"
                  }
                  defaultValue={values.is_superuser}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Is Verified"
                  name="phone"
                  onChange={handleChange}
                  value={
                    values.is_verify ? "User Verified" : "User Not Verified"
                  }
                  defaultValue={values.is_verify}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  onChange={handleChange}
                  required
                  value={values.country}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Select State"
                  name="state"
                  onChange={handleChange}
                  required
                  select
                  SelectProps={{ native: true }}
                  value={values.state}
                >
                  {states.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Save Details"
            )}
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
