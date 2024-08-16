'use client'

import './globals.css';
import Logo from '../public/assets/logo.png';

import React from 'react';
import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Box, AppBar, Button, Container, Toolbar, Typography, Grid } from "@mui/material";
import Head from "next/head";
import { checkCustomRoutes } from "next/dist/lib/load-custom-routes";
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#676f8d',
      main: '#424769',
      dark: '#2d3250',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#AD81A7',
      main: '#6C5E82',
      dark: '#2E365A',
      contrastText: '#F8C19B',
    },
  },
});

export default function Home() {
  const handleSubmit = async () => {
    const checkoutSession = await fetch("/api/checkout_session", {
      method: "POST",
      headers: {
        origin: 'http://localhost:3000',
      },
    });

  const checkout_session = await checkoutSession.json();

  if (checkoutSession.statusCode === 500){
    console.error(checkoutSession.message);
    return
  }

  const stripe = await getStripe();
  const { error } = await stripe.redirectToCheckout({
    sessionId: checkout_session.id,
  });

  if (error){
    console.warn(error.message);
  }
  }

  return (
    <Container maxWidth="100vw" sx={{backgroundColor: theme.palette.primary.main, color:theme.palette.primary.contrastText}}>
      <Head maxWidth="100vw">
        <title>Flasher.io</title>
        <meta name = "description" content = "Create Flashcard from your text" />
      </Head>

      <AppBar position="static" sx={{backgroundColor: theme.palette.primary.dark, color:theme.palette.primary.contrastText, borderRadius: 2}}>
        <Toolbar>
          <Typography variant="h6" style={{flexGrow: 1}} sx={{color: theme.palette.primary.light}}>Flasher.io</Typography>
          <SignedOut>
            <Button color="inherit" href="sign-in" sx={{color: theme.palette.primary.light}}> Login</Button>
            <Button color="inherit" href="sign-up" sx={{color: theme.palette.primary.light}}> Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box 
        sx={{
          textAlign: "center",
          py: 4,
          mb: 4,
          borderRadius: 2,
          backgroundColor: theme.palette.secondary.dark
        }}
      >

        <Image src={Logo} alt="Flasher.io Logo" width={300} height="120vh" sx={{textAlign: "center"}} />

        <Typography variant="h5" gutterBottom>
          {' '}
          the easiest way to make flashcards from your custom input
        </Typography>

        <Button 
        variant="contained" 
        color = "primary" 
        sx = {{
          mt: 2, 
          backgroundColor: theme.palette.secondary.contrastText, 
          color: theme.palette.primary.main, 
          '&:hover': {
          backgroundColor: theme.palette.secondary.contrastText,
          color: theme.palette.primary.main,
          },
        }} 
        
        href="/generate">
          Get Started For Free
        </Button>
      </Box>

      <Box
        sx={{
          my: 3,
          pt: 5,
          pb: 5,
          px: 3,
          borderRadius: 2,
          textAlign: "center",
          backgroundColor: theme.palette.secondary.dark
        }}
      >
        <Typography variant="h4" gutterBottom>Features</Typography>
        <Grid container spacing = {3}>
          <Grid item xs={12} md={6}>  
            <Box
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: theme.palette.primary.light,
                backgroundColor: theme.palette.primary.light,
                borderRadius: 2,
                height: "160px"
              }}
            >
              <Typography variant="h5" gutterBottom>Custom Prompt Creation</Typography>  
              <Typography> 
                {' '}
                Create personalized flashcards by inputting your own prompts. Our AI adapts to your specific needs, generating content that perfectly aligns with your study goals.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>  
            <Box
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: theme.palette.primary.light,
                backgroundColor: theme.palette.primary.light,
                borderRadius: 2,
                height: "160px"
              }}
            >
              <Typography variant="h5" gutterBottom>AI-Powered Flashcard Creation</Typography>  
              <Typography> 
                {' '}
                Generate personalized flashcards from your study materials using cutting-edge AI. Upload your notes, and our AI will create questions and answers that help you retain key concepts efficiently.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>  
            <Box
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: theme.palette.primary.light,
                backgroundColor: theme.palette.primary.light,
                borderRadius: 2,
                height: "160px"
              }}
            >
              <Typography variant="h5" gutterBottom>Interactive Learning Experience</Typography>  
              <Typography> 
                {' '}
                Engage with your flashcards in a dynamic, interactive environment. Test yourself with various quiz modes, track your progress, and stay motivated with real-time feedback and performance insights.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>  
            <Box
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: theme.palette.primary.light,
                backgroundColor: theme.palette.primary.light,
                borderRadius: 2,
                height: "160px"
              }}
            >
              <Typography variant="h5" gutterBottom>Seamless Integration with Firebase</Typography>  
              <Typography> 
                {' '}
                Your data is securely stored and easily accessible across all devices, thanks to Firebase's robust cloud infrastructure. Sync your flashcards and study sessions effortlessly, anytime, anywhere.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    

      <Box
        sx={{
          my: 8,
          textAlign: "center",
          pt: 5,
          pb: 5,
          px: 3,
          borderRadius: 2,
          backgroundColor: theme.palette.secondary.dark
        }}
      >
        <Typography variant="h4" gutterBottom>Pricing</Typography>
        <Grid container spacing = {3}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: theme.palette.primary.light,
                backgroundColor: theme.palette.primary.light,
                borderRadius: 2,
                height: "225px"
              }}
            >
              <Typography variant="h5" gutterBottom>Basic</Typography>  
              <Typography variant="h6" gutterBottom>0$ / Month</Typography>  
              <Typography> 
                {' '}
                Access to basic features, text customization, limited storage, and threads.
              </Typography>
              <Button 
              variant="contained" 
              color = "primary" 
              href="/generate"
              sx={{
                mt: 2,
                backgroundColor: theme.palette.secondary.contrastText, 
                color: theme.palette.primary.main, 
                '&:hover': {
                backgroundColor: theme.palette.secondary.contrastText,
                color: theme.palette.primary.main,
                },
              }}>
                Choose Basic
              </Button>
            </Box>
          </Grid>
        
          <Grid item xs={12} md={6}>  
            <Box
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: theme.palette.primary.light,
                backgroundColor: theme.palette.primary.light,
                borderRadius: 2,
                height: "225px"
              }}
            >
              <Typography variant="h5" gutterBottom>Pro</Typography>  
              <Typography variant="h6" gutterBottom>5$ / month</Typography>  
              <Typography> 
                {' '}
                Unlock advanced AI features, increased storage, 
                and AI support to enhance your learning experience.
              </Typography>
              <Button 
              variant="contained" 
              color = "primary" 
              sx={{
                mt: 2,
                backgroundColor: theme.palette.secondary.contrastText, 
                color: theme.palette.primary.main, 
                '&:hover': {
                backgroundColor: theme.palette.secondary.contrastText,
                color: theme.palette.primary.main,
                },
              }} 
              onClick={handleSubmit}>
                Choose Pro
              </Button>
            </Box>
          </Grid>

        </Grid>
      </Box>

      <footer>
        <Typography variant="body1" align="center" width="100%" fontSize={20} sx={{backgroundColor: theme.palette.secondary.dark, color: theme.palette.primary.light}}>
          Ryan, Mason, Jeremiah, & Nabit © 2021 Flasher.io. All rights reserved.
        </Typography>
      </footer>
    </Container>
  );
}
