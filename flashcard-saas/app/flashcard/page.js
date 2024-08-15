'use client'

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import {collection, doc, getDocs, setDoc} from "firebase/firestore"
import { db } from "@/firebase"

import { useSearchParams } from "next/navigation"

import { Container, Grid, Box, Typography, Card, CardActionArea, CardContent, Button } from "@mui/material"
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


export default function Flashcard() {
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])

    const searchParams = useSearchParams()
    const search = searchParams.get('id')

    useEffect(() => {
        async function getFlashcard(){
            if (!search || !user) return
                const colRef = collection(doc(db, 'users', user.id), search)
                const docSnap = await getDocs(colRef)
                const flashcards = []

                docSnap.forEach((doc) => {
                    flashcards.push({id: doc.id, ...doc.data()})
                });
                setFlashcards(flashcards)
        }

        getFlashcard()
    }, [user, search])


    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    if(!isLoaded || !isSignedIn){
        return <></>
    }


    return(
        <Container maxWidth="100vw">
            <Typography variant="h2" component="h1" sx={{mt: 4, textAlign: "center", position: "relative"}} gutterBottom>Generated Flashcard Preview</Typography>
            <Grid container spacing={3} sx={{mt: 4}}>
                {flashcards.map((flashcard, index) => (
                    <Grid item xs = {12} sm = {6} md = {4} key = {index}>
                        <Card sx={{color: theme.palette.primary.main}}>
                            <CardActionArea onClick={() => handleCardClick(index)}>
                                <CardContent>
                                    <Box sx={{
                                        perspective: '1000px',
                                        '& > div': {
                                            transition: 'transform 0.6s',
                                            transformStyle: 'preserve-3d',
                                            position: 'relative',
                                            width: '100%',
                                            height: '200px',
                                            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                                            transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                        },
                                        '& > div > div': {
                                            position: 'absolute',
                                            width: '100%',
                                            height: '100%',
                                            backfaceVisibility: 'hidden',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            padding: 2,
                                            boxSizing: 'border-box',
                                        },
                                        '& > div > div:nth-of-type(2)': {
                                            transform: 'rotateY(180deg)',
                                        },
                                    }}>
                                        <div>
                                            <div>
                                            <Typography variant="h5" component="div">{flashcard.front}</Typography>
                                            </div>
                                            <div>
                                            <Typography variant="h5" component="div">{flashcard.back}</Typography>
                                            </div>
                                        </div>
                                    </Box>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Button href="/flashcards" 
            sx={{
                mt: 2, 
                position: "flex",
                alignContent: "center",
                alignItems: "center",
                textAlign: "center",
                backgroundColor: theme.palette.secondary.contrastText, 
                color: theme.palette.primary.main, 
                '&:hover': {
                backgroundColor: theme.palette.secondary.contrastText,
                color: theme.palette.primary.main,
                },
            }}>
            Back Page
            </Button>
        </Container>
    )
}