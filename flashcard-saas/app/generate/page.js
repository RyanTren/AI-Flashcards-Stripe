'use client'

import { useRouter } from 'next/navigation'
import { use, useState } from 'react'
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
	Grid,
	Card,
	CardActionArea,
	CardContent,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
} from '@mui/material'
import { useUser } from '@clerk/nextjs'
import { db } from '@/firebase'
import { doc, collection, setDoc, getDoc, writeBatch } from 'firebase/firestore'
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

export default function Generate() {
  const {isLoading, isSignedIn, user} = useUser()
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [text, setText] = useState('')
  const [name, setName] = useState('')
  const [open, setOpen] = useState(false)
  const router = useRouter();

   // Handle cases where user is not signed in or still loading
	if (isLoading) {
    return <Typography variant="h5" my={50} sx={{position: "relative", textAlign: "center", alignContent: "center", alignItems: "center"}} color="white">Loading...</Typography>;
  }

  if (!isSignedIn) {
    return(
		<Typography variant="h5" my={50} sx={{position: "relative", textAlign: "center", alignContent: "center", alignItems: "center"}} color="white">You must be signed in to generate flashcards.</Typography>
	);
  }

  const handleSubmit = async () => {
    // We'll implement the API call here

		fetch ('api/generate', {
        method: 'POST',
        body: text,
        })
        .then((res) => res.json())
        .then((data) => setFlashcards(data))
	}
    

		const handleCardClick = (id) => {
			setFlipped((prev) => ({
				...prev,
				[id]: !prev[id],
			}))
		}

		const handleOpen = () => {
			setOpen(true)
		}

		const handleClose = () => {
			setOpen(false)
		}

		const saveFlashcards = async () => {
			if (!isSignedIn || isLoading) {
				alert("User is not logged in");
				console.error("User is not signed in or still loading");
				return;
			}

			if (!name){
				alert('Please enter a name')
				return
			}

			if (!user?.id) {
				console.error("User ID is not available");
				return;
			}

			const batch = writeBatch(db)
			const userDocRef = doc(collection(db, 'users'), user.id)
			const docSnap = await getDoc(userDocRef)

			if(docSnap.exists()){
				const collections = docSnap.data().flashcards || []
				if (collections.find((f) => f.name === name)){
					alert('Flashcard collection with the same name already exists')
					return
				}
				else{
					collections.push({name});
					batch.set(userDocRef, {flashcards: collections}, {merge: true})
				}
			}
			else{
				batch.set(userDocRef, {flashcards: [{name}]})
			}
			
			const colref = collection(userDocRef, name)
			flashcards.forEach((flashcards) => {
				const cardDocRef = doc(colref)
				batch.set(cardDocRef, flashcards)
			})
	
			await batch.commit()
			handleClose()
			router.push('/flashcards')
		}

		

		return (
			<Container maxWidth="md">
				<Box sx={{ my: 4 }}>
					<Typography variant="h3" component="h1" my = {10} gutterBottom sx={{color: theme.palette.primary.contrastText, textAlign: "center", position: "relative"}}>
						Generate Flashcards
					</Typography>
					<TextField
						value={text}
						onChange={(e) => setText(e.target.value)}
						label="Enter text"
						fullWidth
						multiline
						rows={6}
						variant="outlined"
						sx={{ mb: 2, backgroundColor: theme.palette.primary.contrastText, color: theme.palette.primary.contrastText, borderRadius: 2 }}
						
					/>
					<Button
						variant="contained"
						color="primary"
						sx={{
							backgroundColor: theme.palette.secondary.contrastText, 
							color: theme.palette.primary.main, 
							'&:hover': {
							backgroundColor: theme.palette.secondary.contrastText,
							color: theme.palette.primary.main,
							},
						}}
						onClick={handleSubmit}
						fullWidth
					>
						{' '}
						Submit
					</Button>
				</Box>
				
				{flashcards.length > 0 && (
					<Box sx={{ mt: 4 }}>
						<Typography variant="h5" component="h2" gutterBottom>Generated Flashcard Preview</Typography>
						<Grid container spacing = {2}>
							{flashcards.map((flashcard, index) => (
								<Grid item xs = {12} sm = {6} md = {4} key = {index}>
									<Card>
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
						<Box sx={{mt: 4, display: 'flex', justifyContent: 'center'}}>
							<Button variant='container' color='primary' onClick={handleOpen}>Save</Button>
						</Box>
					</Box>
				)}

				<Dialog open={open} onClose={handleClose}>
					<DialogTitle>Save Flashcard Set</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Please enter a name for your flashcard collection.
						</DialogContentText>
						<TextField
						autoFocus
						margin = 'dense'
						label = 'Collection Name'
						type = 'text'
						fullWidth
						value={name}
						onChange={(e) => setName(e.target.value)}
						variant='outlined'
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose}>Cancel</Button>
						<Button onClick={saveFlashcards} color="primary">Save</Button>
					</DialogActions>
				</Dialog>
			</Container>
		)
}



	
