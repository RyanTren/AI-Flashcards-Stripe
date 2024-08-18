// src/app/api/webhook/route.js

import { NextResponse } from 'next/server';
import { db } from '@/firebase'
import { doc, setDoc } from 'firebase/firestore'



// This function handles POST requests
export async function POST(req) {
  try {
    const body = await req.json();
    //console.log('Webhook event body:', body); // Log the whole body

    // Handle the event
    switch (body.type) {
      case 'checkout.session.completed':
            const session = body.data.object;
            console.log('Checkout Session Metadata:', session.metadata);
            console.log("Payment Status: ", session.payment_status);

            if(session.payment_status == "paid")
            {
                const userDocRef = doc(db, 'users', session.metadata.userId);
                await setDoc(userDocRef, { 
                    membershipStatus: "Pro" 
                }, { merge: true });
            }
            break;

      default:
        console.log(`Unhandled event type ${body.type}`);
    }

    // Return a response to acknowledge receipt of the event
    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Error handling webhook event:', error);
    return NextResponse.json({ error: 'Webhook handler error' }, { status: 500 });
  }
}
