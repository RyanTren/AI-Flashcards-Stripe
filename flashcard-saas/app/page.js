import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Box, AppBar, Button, Container, Toolbar, Typography, Grid } from "@mui/material";
import Head from "next/head";

export default function Home() {
  return (
    <Container>
      <Head>
        <title>Flashcard Saas</title>
        <meta name = "description" content = "Create Flashcard from your text" />
      </Head>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{flexGrow: 1}}>Flashcard Saas</Typography>
          <SignedOut>
            <Button color="inherit"> Login</Button>
            <Button color="inherit"> Sign Up</Button>
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
        <Typography variant="h2">Welcome to Flasher.io</Typography>

        <Typography variant="h5">
          {' '}
          The easiest way to make flash cards from your custom input
        </Typography>

        <Button variant="contained" color = "primary" sx = {{mt: 2}}>
          Get Started
        </Button>

      </Box>

      <Box
        sx={{
          my: 6,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom components="2">
          Features
        </Typography>

        <Grid container spacing = {4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6">
              Easy Text Input
            </Typography>  
            <Typography> 
              {' '}
              Simply input your text and our software will do the rest. Create flashcards faster than ever
            </Typography>
          </Grid>
        </Grid>

        <Grid contained spacing = {4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6">
              Smart Flashcards
            </Typography>  
            <Typography>
              {' '} 
              Our AI breaks down your text into flashcards, making it easier to study
            </Typography>
          </Grid>
        </Grid>

        <Grid contained spacing = {4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6">
              Accessible Anywhere
            </Typography>  
            <Typography>
              {' '}
              Access your flashcards from anywhere in the world, no need to carry around physical cards
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          my: 6,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom components="2">
          Pricing
        </Typography>

        <Grid container spacing = {4}>
          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
              }}
            >
              <Typography variant="h5">
                Basic
              </Typography>  
              <Typography variant="h6">
                5$ / month
              </Typography>  
              <Typography> 
                {' '}
                Access to basic features and limited storage.
              </Typography>
              <Button variant="contained" color = "primary">
                Choose Basic
              </Button>
            </Box>

            <Box
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
              }}
            >
              <Typography variant="h5">
                Pro
              </Typography>  
              <Typography variant="h6">
                15$ / month
              </Typography>  
              <Typography> 
                {' '}
                Unlock advanced AI features, increased storage, customizable flashcards, 
                and priority support to enhance your learning experience.
              </Typography>
              <Button variant="contained" color = "primary">
                Choose Pro
              </Button>
            </Box>

            <Box
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
              }}
            >
              <Typography variant="h5">
                Elite
              </Typography>  
              <Typography variant="h6">
                35$ / month
              </Typography>  
              <Typography> 
                {' '}
                Enjoy unlimited storage, AI-generated insights, collaborative tools, personalized coaching, 
                and VIP support for the ultimate learning experience.
              </Typography>
              <Button variant="contained" color = "primary">
                Choose Elite
              </Button>
            </Box>
          </Grid>
        </Grid>

      </Box>
    </Container>
  );
}
