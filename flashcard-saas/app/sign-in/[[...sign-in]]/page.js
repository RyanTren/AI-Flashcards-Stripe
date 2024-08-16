import React from 'react'
import { Container, Box, Typography, AppBar, Toolbar, Button } from '@mui/material'
import { SignIn, SignUp } from '@clerk/nextjs'
import Link from 'next/link'

export default function SignInPage(){
    return(
    <Container maxWidth="100vw">
        <AppBar position="static" sx={{backgroundColor: '#3f51b5'}}>
            <Toolbar>
                <Typography variant="h6" sx={{flexGrow: 1}}>
                Flasher.io
                </Typography>
                <Button href="/login" passHref color="inherit" sx={{color: '#676fgd'}}>
                    Login
                </Button>
                <Button href="/sign-up" passHref color="inherit" sx={{color: '#676fgd'}}>
                    Sign Up
                </Button>
            </Toolbar>
        </AppBar>


        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            sx={{textAlign: 'center', my: 4}}
            >
            <Typography variant="h4" component="h1" gutterBottom>
                Sign In
            </Typography>
            <SignIn />
        </Box>
    </Container>
    );
}