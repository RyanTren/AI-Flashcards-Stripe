'use client'

import './globals.css';

import { Image } from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Box, AppBar, Button, Container, Toolbar, Typography, Grid } from "@mui/material";
import Head from "next/head";
import { checkCustomRoutes } from "next/dist/lib/load-custom-routes";
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#676fgd',
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

      <AppBar position="static" sx={{backgroundColor: theme.palette.primary.dark, color:theme.palette.primary.contrastText}}>
        <Toolbar>
          <Typography variant="h6" style={{flexGrow: 1}} sx={{color: theme.palette.primary.contrastText}}>Flasher.io</Typography>
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
          my: 4,
        }}
      >
        <Typography variant="h2" gutterBottom>Welcome to Flasher.io</Typography>
        <Typography variant="h5" gutterBottom>
          {' '}
          The easiest way to make flash cards from your custom input
        </Typography>

        <Button 
        variant="contained" 
        color = "primary" 
        sx = {{mt: 2, 
          backgroundColor: theme.palette.secondary.contrastText, 
          color: theme.palette.primary.main, 
          '&:hover': {
          backgroundColor: theme.palette.secondary.contrastText,
          color: theme.palette.primary.main,
          },
        }} 
        
        href="/generate">
          Get Started
        </Button>
      </Box>

      <Box
        sx={{
          my: 25,
          textAlign: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>Features</Typography>

        <Grid container spacing = {0} gap = {5}>
        <Box
              sx={{
                p: 4,
                border: '1px solid',
                borderColor: theme.palette.primary.light,
                backgroundColor: theme.palette.primary.light,
                borderRadius: 2,
                textAlign: "center",
                alignItems: "center",
                alignContent: "center",
                position: "relative",
              }}
        >
          <Grid item xs={6} md={8} sx={{textAlign: "center", alignItems: "center", alignContent: "center"}}>
            <Typography variant="h6" gutterBottom>Easy Text Input</Typography>  
            <Typography> 
              {' '}
              Simply input your text and our software will do the rest. Create flashcards faster than ever
            </Typography>
          </Grid>
        </Box>
        

        <Box
              sx={{
                p: 4,
                border: '1px solid',
                borderColor: theme.palette.primary.light,
                backgroundColor: theme.palette.primary.light,
                borderRadius: 2,
                textAlign: "center",
                alignItems: "center",
                alignContent: "center",
                position: "relative",
              }}
        >
          <Grid item xs={6} md={8} sx={{textAlign: "center", alignItems: "center", alignContent: "center"}}>
            <Typography variant="h6" gutterBottom>Smart Flashcards</Typography>  
            <Typography>
              {' '} 
              Our AI breaks down your text into flashcards, making it easier to study
            </Typography>
          </Grid>
        </Box>
        
        
        <Box
              sx={{
                p: 4,
                border: '1px solid',
                borderColor: theme.palette.primary.light,
                backgroundColor: theme.palette.primary.light,
                borderRadius: 2,
                textAlign: "center",
                alignItems: "center",
                alignContent: "center",
                position: "relative",
              }}
        >
          <Grid item xs={6} md={8} sx={{textAlign: "center", alignItems: "center", alignContent: "center"}}>
            <Typography variant="h6" gutterBottom>Accessible Anywhere</Typography>  
            <Typography>
              {' '}
              Access your flashcards from anywhere in the world, no need to carry around physical cards
            </Typography>
          </Grid>
        </Box>
        </Grid>
      </Box>
    

      <Box
        sx={{
          my: 25,
          textAlign: "center",
        }}
      >

        <Typography variant="h4" gutterBottom>Pricing</Typography>

        <Grid container spacing = {4}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: theme.palette.primary.light,
                backgroundColor: theme.palette.primary.light,
                borderRadius: 2,
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
    </Container>
  );
}
