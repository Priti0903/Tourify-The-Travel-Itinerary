import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '@/service/firebaseConfig';
import UserTripCardItem from './components/UserTripCardItem';

function MyTrips() {
    const navigate = useNavigate();
    const [userTrips, setUserTrips] = useState([]);

    useEffect(() => {
        GetUserTrips();
    }, []);

    const GetUserTrips = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        console.log("Logged in user:", user); // ✅ Log once, early
        console.log(JSON.parse(localStorage.getItem('user')));

        if (!user) {
            navigate('/');
            return;
        }

        try {
            const q = query(
                collection(db, "AITrips"),
                where("userEmail", "==", user.email)
            );
            const querySnapshot = await getDocs(q);
            console.log("Query snapshot size:", querySnapshot.size); // ✅ Log result size

            const trips = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                console.log("Trip doc data:", data); // ✅ Log each trip
                trips.push(data);
            });

            setUserTrips(trips);
        } catch (error) {
            console.error("Error fetching trips:", error);
        }
    };

    return (
        <>
        <div className="page-background1" />
        
        <div className="mx-auto max-w-6xl px-5 sm:px-10 md:px-16 lg:px-32 xl:px-40 mt-10 rounded-3xl border border-white/20 backdrop-blur-l bg-white/10 shadow-2xl">
            <h2 className='text-2xl font-bold mb-4'>My Trips</h2>
            <div className='grid grid-cols-2 mt-10 md:grid-cols-3 gap-5'>
                {userTrips.length > 0 ? (
                    userTrips.map((trip, index) => (
                        <UserTripCardItem key={index} trip={trip} />
                    ))
                ) : ([1,2,3,4,5,6].map((item,index)=>
                {
                    <div key={index} className='h-220px w-full bg-slate-200 animate-pulse rounded-xl'>
                        
                    </div>
                })

                )}
            </div>
        </div>
        </>
    );
    
}

export default MyTrips;
