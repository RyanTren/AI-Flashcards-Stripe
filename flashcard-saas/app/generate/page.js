'use client'

import { useRouter } from 'next/navigation'
import { use, useState, useEffect } from 'react'
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Head,
  AppBar,
  Toolbar,
	Grid,
	Card,
	CardActionArea,
	CardContent,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,

	Stack,
	// CircularProgress

} from '@mui/material'
import { useUser } from '@clerk/nextjs'
import { db } from '@/firebase'
import { doc, collection, setDoc, getDoc, writeBatch, memoryEagerGarbageCollector } from 'firebase/firestore'
import { createTheme } from '@mui/material/styles';
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import CircularProgress from '@mui/material/CircularProgress';


import Image from "next/image";
import { FlipWords } from '@/components/ui/flip-words'

import SmallLogo from '../../public/assets/SmallHomeScreenLogo.png';
import { Flip } from 'gsap/all'


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

const words = ["Better ", "Fast ", "Detailed ", "Simple "];

export default function Generate() {
  const {isLoading, isSignedIn, user} = useUser()
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [text, setText] = useState('')
  const [cardDescription, setCardDescription] = useState({topic: "", cardNum: 9})
  const [name, setName] = useState('')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [membership, setMembership] = useState("Free")
  const router = useRouter();

  const [openAdd, setOpenAdd] = useState(false)
  const [flashcardFront, setFlashcardFront] = useState("")
  const [flashcardBack, setFlashcardBack] = useState("")


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
  }, [user, membership]);

   // Handle cases where user is not signed in or still loading
	if (isLoading) {
    return (
	<Typography variant="h5" my={50} sx={{position: "relative", textAlign: "center", alignContent: "center", alignItems: "center"}} color="white">
		<CircularProgress />
		Loading...
	</Typography>
	);
	}

	if (!isSignedIn) {
		return(
			<Container maxWidth="100vw" sx={{backgroundColor: theme.palette.primary.main, color:theme.palette.primary.contrastText}}>

				<AppBar position="static" sx={{backgroundColor: theme.palette.primary.dark, color:theme.palette.primary.contrastText}}>
					<Toolbar>
					<Typography variant="h6" style={{flexGrow: 1}} sx={{color: theme.palette.primary.contrastText}}><Image src={SmallLogo} alt="Flasher.io Logo" width={25} sx={{textAlign: "center"}}/></Typography>
					<SignedOut>
						<Button color="inherit" href="sign-in" sx={{color: theme.palette.primary.light}}> Login</Button>
						<Button color="inherit" href="sign-up" sx={{color: theme.palette.primary.light}}> Sign Up</Button>
					</SignedOut>
					<SignedIn>
						<UserButton />
					</SignedIn>
					</Toolbar> 
				</AppBar>
			<Typography variant="h5" my={50} sx={{position: "relative", textAlign: "center", alignContent: "center", alignItems: "center"}} color="white">
				You must be signed in to generate flashcards.
			</Typography>
			</Container>
		);
	}



  

  const updateTopic = (newTopic) =>
	{
		setCardDescription((prevState) => ({
			...prevState,
			topic: newTopic
		}))
	}

  const updateNum = (newNum) =>
  {
	setCardDescription((prevState) => ({
		...prevState,
		cardNum: newNum
	}))
  }

  const removeFlashcard = (indexToRemove) => {
	const updatedList = flashcards.filter((item, index) => index !== indexToRemove)
	setFlashcards(updatedList);
}

  const addFlashcard = (newFront, newBack) => {
	setFlashcards((prevState) => [
		...prevState,
		{front: newFront, back: newBack},
	])
  }


const handleSubmit = async () => {

    // We'll implement the API call here

		fetch ('api/generate', {
        method: 'POST',
		headers: {"Content-Type": "application/json"},
        body: JSON.stringify(cardDescription),
        })
        .then((res) => res.json())
        .then((data) => setFlashcards(data))
		.finally(() => {
			setLoading(false);
		});
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


		const handleAddOpen = () => {
			setOpenAdd(true)
		}

		const handleAddClose = () => {
			setOpenAdd(false)
		}




		const handleRefresh = () => {
			setFlashcards([])
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
			<Container maxWidth="100vw" >

			<AppBar position="static" sx={{backgroundColor: theme.palette.primary.dark, color:theme.palette.primary.contrastText, borderRadius: 2}}>
                <Toolbar>
                <Typography variant="h6" style={{flexGrow: 1}} sx={{color:theme.palette.primary.contrastText}}><Image src={SmallLogo} alt="Flasher.io Logo" width={25} sx={{textAlign: "center"}}/></Typography>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </Toolbar>
            </AppBar>


				<Button href="/" 
					sx={{
						mt: 2, 
						position: "flex",
						alignContent: "center",
						alignItems: "center",
						textAlign: "center",
						mr: 3,
						backgroundColor: theme.palette.secondary.contrastText, 
						color: theme.palette.primary.main, 
						'&:hover': {
						backgroundColor: theme.palette.secondary.contrastText,
						color: theme.palette.primary.main,
						},
					}}>
					Back Page
				</Button>
				<Button href="/flashcards" 
					sx={{
						mt: 2, 
						position: "absolute",
						right: 25,
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
					View Flashcard Sets
				</Button>


				<Box sx={{ my: 4 }}>
					<Typography variant="h3" component="h1" my = {10} gutterBottom sx={{color: theme.palette.primary.contrastText, textAlign: "center", position: "relative"}}>
						<FlipWords words={words} className='flip-words-text' /> 
						 AI Flashcard Generation
					</Typography>

					<Stack direction="row" mb={2} justifyContent={"space-between"} display="flex">
						{
							membership === "Pro" && (<><TextField type="number" inputProps={{ min: 1, max: 50 }} value = {cardDescription.cardNum} onChange={(e) => updateNum(e.target.value)} variant="outlined" label="# of Cards" sx={{backgroundColor: theme.palette.primary.contrastText, color: theme.palette.primary.contrastText, borderRadius: 2 }}/>
							</>)
						}
						{
							(loading ? <Box><CircularProgress/></Box> : null)
						}
						
					</Stack>



					<TextField
						value={cardDescription.topic}
						onChange={(e) => updateTopic(e.target.value)}
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
						onClick={() => {handleSubmit(); setLoading(true)}}
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
										{membership === "Pro" && <Button onClick={() => removeFlashcard(index)}><Image src="removeIcon.png" alt="remove" height="36px" width="36px"/></Button>}
									</Card>
								</Grid>
							))}
						</Grid>
						<Box sx={{mt: 4, display: 'flex', justifyContent: 'center'}}>
							{membership === "Pro" && <Button 
								onClick={handleAddOpen}
								variant='container' 
								color='primary'
								sx={{ 
									mt: 2, 
									my: 12,
									mr: 2,
									backgroundColor: theme.palette.secondary.main, 
									color: theme.palette.primary.contrastText,
									'&:hover': {
										backgroundColor: theme.palette.secondary.dark,
										color: theme.palette.primary.contrastText,
									}
								}} >Add Flashcard</Button>}
							
							<Button 
								variant='container' 
								color='primary'
								sx={{
									margin: 2, 
									mt: 2, 
									my: 12,
									backgroundColor: theme.palette.secondary.main, 
									color: theme.palette.primary.contrastText,
									'&:hover': {
										backgroundColor: theme.palette.secondary.dark,
										color: theme.palette.primary.contrastText,
									}
								}} 
								onClick={handleOpen}>Save Flashcard Set</Button>
							<Button 
								variant='container' 
								color='primary'
								sx={{ 
									mt: 2, 
									my: 12,
									backgroundColor: theme.palette.secondary.main, 
									color: theme.palette.primary.contrastText,
									'&:hover': {
										backgroundColor: theme.palette.secondary.dark,
										color: theme.palette.primary.contrastText,
									}
								}} 
								onClick={() => { handleRefresh(); handleSubmit(); }}> Refresh Flashcard Set</Button>
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

				<Dialog open={openAdd} onClose={handleAddClose} fullWidth maxWidth="sm">
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
						<Button onClick={handleAddClose}>Cancel</Button>
						<Button onClick={() => {addFlashcard(flashcardFront, flashcardBack); handleAddClose()}} color="primary">Add</Button>
					</DialogActions>
				</Dialog>
			</Container>
		)
}
