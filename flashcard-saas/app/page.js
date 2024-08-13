import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Box, AppBar, Button, Container, Toolbar, Typography } from "@mui/material";
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
    </Container>
  );
}
