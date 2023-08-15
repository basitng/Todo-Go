import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";
import React from "react";

const CURRENT_USER_API_URL = "/users/me";
export const AccountProfile = () => {
  const [user, setUser] = React.useState({
    avatar: "/assets/avatars/avatar-anika-visser.png",
    timezone: "GTM-7",
    country: "USA",
    city: "Los Angeles",
  });

  React.useEffect(() => {
    const fetchDataAndToggleEdited = async () => {
      const fetchData = async () => {
        try {
          const response = await instance.get(CURRENT_USER_API_URL);
          const userResponse = response.data;
          setUser((prevUserData) => ({ ...prevUserData, user: userResponse }));
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    };

    fetchDataAndToggleEdited();
  });
  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Avatar
            src={user.avatar}
            sx={{
              height: 80,
              mb: 2,
              width: 80,
            }}
          />
          <Typography gutterBottom variant="h5">
            {user.name}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {user.city} {user.country}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {user.timezone}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button fullWidth variant="text">
          Upload picture
        </Button>
      </CardActions>
    </Card>
  );
};
