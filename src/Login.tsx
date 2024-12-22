import * as React from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import {  useNavigate } from "react-router-dom";

export default function Login({ handleLogin, handleLogout }) {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const onSubmit = async (e:React.SyntheticEvent) => {
    e.preventDefault();
    // const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          // "X-CSRF-TOKEN": csrfToken,
        },
        body: JSON.stringify({
          user_name: username,
          password: password,
        }),
      });

      const content = await response.json();

      if(content.statusCode == 200){
        console.log(content.data.token);
        // Storing the token in local storage
          // localStorage.setItem('userToken');
          const imageUrlBase = 'http://localhost:8000/image/';

          localStorage.setItem('user_token',content.data.token)
          localStorage.setItem('full_name',content.data.user.first_name + ' ' + content.data.user.last_name)
          localStorage.setItem('personal_photo',`${imageUrlBase}${content.data.user.personal_photo}`)
            // navigate('/dashboard');
            handleLogin();
   
      }else{
        console.log(content);


      }
      // console.log(content);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <form onSubmit={onSubmit}>
        <Stack sx={{ gap: 2, width: 500 }} direction={"column"}>
          <Typography sx={{ fontWeight: "bold" }} variant="h5">
            welcome to salon
          </Typography>
          <Typography variant="body1">please sign in </Typography>
        
          <TextField
            sx={{ flex: 1 }}
            label="user name"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
          />
          <TextField
            value={password}
            sx={{ flex: 1 }}
            label="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="contained" type="submit">
            Sign in
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
