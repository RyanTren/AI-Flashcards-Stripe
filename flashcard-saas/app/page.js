import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Box, AppBar, Button, Container, Toolbar, Typography, Grid } from "@mui/material";
import Head from "next/head";

export default function Home() {
  return (
    <Container>
      <Head>
        <title>Flasher.io</title>
        <meta name = "description" content = "Create Flashcard from your text" />
      </Head>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{flexGrow: 1}}>Flasher.io</Typography>
          <SignedOut>
            <Button color="inherit" href="sign-in"> Login</Button>
            <Button color="inherit" href="sign-up"> Sign Up</Button>
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

        <Button variant="contained" color = "primary" sx = {{mt: 2}} href="/generate">
          Get Started
        </Button>
      </Box>

      <Box
        sx={{
          my: 6,
        }}
      >
        <Typography variant="h4" gutterBottom>Features</Typography>

        <Grid container spacing = {4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Easy Text Input</Typography>  
            <Typography> 
              {' '}
              Simply input your text and our software will do the rest. Create flashcards faster than ever
            </Typography>
          </Grid>
        

        
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Smart Flashcards</Typography>  
            <Typography>
              {' '} 
              Our AI breaks down your text into flashcards, making it easier to study
            </Typography>
          </Grid>
        
        
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Accessible Anywhere</Typography>  
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
                borderColor: 'grey.300',
                borderRadius: 2,
              }}
            >
              <Typography variant="h5" gutterBottom>Basic</Typography>  
              <Typography variant="h6" gutterBottom>5$ / month</Typography>  
              <Typography> 
                {' '}
                Access to basic features, text customization, limited storage, and threads.
              </Typography>
              <Button variant="contained" color = "primary" sx={{mt: 2,}}>
                Choose Basic
              </Button>
            </Box>
          </Grid>
        

        
          <Grid item xs={12} md={6}>  
            <Box
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
              }}
            >
              <Typography variant="h5" gutterBottom>Pro</Typography>  
              <Typography variant="h6" gutterBottom>15$ / month</Typography>  
              <Typography> 
                {' '}
                Unlock advanced AI features, increased storage, 
                and AI support to enhance your learning experience.
              </Typography>
              <Button variant="contained" color = "primary" sx={{mt: 2,}}>
                Choose Pro
              </Button>
            </Box>
          </Grid>

        </Grid>

      </Box>
    </Container>
  );
}
