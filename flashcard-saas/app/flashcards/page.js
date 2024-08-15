'use client'

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"

import { CollectionReference, doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/firebase"
import { useRouter } from "next/navigation"
import { Container, Grid, Card, CardActionArea, CardContent, Typography } from "@mui/material"
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

export default function Flashcards() {
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const router = useRouter()

    useEffect(() => {
        async function getFlashcards(){
            if (!user) return
                const docRef = doc(db, 'users', user.id)
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    const collections = docSnap.data().flashcards || []
                    setFlashcards(collections)
                }
                else{
                    await setDoc(docRef, {flashcards: []})
                }
        }

        getFlashcards()
    }, [user])

    if (!isLoaded || !isSignedIn){
        return <></>
    }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`)
    }

    return(
        <Container maxWidth="100vw">
            <Typography variant="h2" component="h1" sx={{mt: 4, textAlign: "center", position: "relative"}}>Saved Flashcard Sets</Typography>
            <Grid container spacing={3} sx={{ mt: 4 }}>
            {flashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{backgroundColor: theme.palette.secondary.contrastText, color: theme.palette.primary.main}}>
                    <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                        {flashcard.name}
                        </Typography>
                    </CardContent>
                    </CardActionArea>
                </Card>
                </Grid>
            ))}
            </Grid>
        </Container>
    )
}