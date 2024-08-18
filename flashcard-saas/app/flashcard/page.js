'use client'

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import {collection, doc, getDocs, setDoc, deleteDoc, addDoc, getDoc} from "firebase/firestore"
import { db } from "@/firebase"

import { useSearchParams } from "next/navigation"

import { Container, Grid, Box, Typography, Card, CardActionArea, CardContent, Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, TextField } from "@mui/material"
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
    const [open, setOpen] = useState(false)

    const [flashcardFront, setFlashcardFront] = useState()
    const [flashcardBack, setFlashcardBack] = useState()

    const [membership, setMembership] = useState("Free")

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

    useEffect (() => {
        if (!user?.id) {
            return; // Exit early if user.id is not available
        }
    
        const checkMembership = async () => {
            const userDocRef = doc(collection(db, "users"), user.id);
            const docSnap = await getDoc(userDocRef);
            setMembership(docSnap.data().membershipStatus);
            console.log("Membership Status: ", membership);
        }
        
        checkMembership();
      }, [user])


    const addFlashcard = async (newFront, newBack) => {
        const colRef = collection(doc(db, 'users', user.id), search)
        const newFlashcard = {front: newFront, back: newBack}

        const docRef = await addDoc(colRef, newFlashcard);
        setFlashcards((prevState) => [...prevState, { id: docRef.id, ...newFlashcard }]);
    }

    const removeFlashcard = async (index) => {
        const colRef = collection(doc(db, "users", user.id), search)
        const docsSnapshot = await getDocs(colRef)
        await deleteDoc(docsSnapshot.docs[index].ref)

        const updatedSnapshot = await getDocs(colRef);
        const updatedCards = updatedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFlashcards(updatedCards);
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    if(!isLoaded || !isSignedIn){
        return <></>
    }


    return(
        <Container maxWidth="100vw">

            <Button href="/flashcards"
                sx={{
                    mt: 2, 
                    mr: 2,
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
            
            {membership === "Pro" && <Button onClick={() => {handleOpen()}} 
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
                Add Flashcard
            </Button>}

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
                            {membership === "Pro" && <Button onClick={() => removeFlashcard(index)}><img src="removeIcon.png" height="36px" width="36px"/></Button>}
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
					<DialogTitle>Add Flashcard</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Flashcard Front
						</DialogContentText>
						<TextField
						autoFocus
						margin = 'dense'
						label = 'Title'
						type = 'text'
						fullWidth
						value={flashcardFront}
						onChange={(e) => setFlashcardFront(e.target.value)}
						variant='outlined'
						mb={50}
						/>
						<DialogContentText>
							Flashcard Backs
						</DialogContentText>
						<TextField
						multiline
						rows={6}
						autoFocus
						margin = 'dense'
						label = 'Description'
						type = 'text'
						fullWidth
						value={flashcardBack}
						onChange={(e) => setFlashcardBack(e.target.value)}
						variant='outlined'
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose}>Cancel</Button>
						<Button onClick={() => {addFlashcard(flashcardFront, flashcardBack); handleClose();}} color="primary">Add</Button>
					</DialogActions>
				</Dialog>
        </Container>
    )
}