import React from 'react'
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import InfoSection from '/src/view-trip/components/InfoSection.jsx';
import Hotels from '/src/view-trip/components/Hotels.jsx';
import { doc } from 'firebase/firestore';
import { db } from '@/service/firebaseConfig';
import { getDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import PlacesToVisit from '/src/view-trip/components/PlacesToVisit.jsx';
import Footer from '../components/Footer';

function Viewtrip(){
    const { tripId } = useParams();
    const[ trip,setTrip]=useState({});

    useEffect(()=>{
       tripId&&GetTripData();

    },[tripId])
    const GetTripData=async() =>{
        const docRef= doc(db,'AITrips',tripId);
        const docSnap=  await getDoc(docRef);

        if(docSnap.exists()){
            console.log("Document:",docSnap.data());
            setTrip(docSnap.data());
        }
        else{
            console.log("No such Doucment");
            toast('No trip Found!')
        }
    }
    return(
        <>
        <div className="page-background3" />
    
    <div className="mx-auto max-w-4xl px-5 sm:px-10 md:px-16 lg:px-32 xl:px-40 mt-10 rounded-3xl border border-white/20 backdrop-blur-xl bg-white/10 shadow-2xl" ></div>
        <div className='p-10 md:px-20 lg:px-44 xl:px-56'>
        {/*information section*/}
            <InfoSection trip={trip}/>

        {/* recommended hotels*/}
            <Hotels trip={trip}/> 


        {/*daily plan*/}
            <PlacesToVisit trip={trip}/>            

        {/*footer*/}
            <Footer trip={trip}/>

        </div>
        </>
    )
}

export default Viewtrip