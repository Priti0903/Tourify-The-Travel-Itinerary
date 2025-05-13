import React from 'react'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GetPlaceDetails } from '@/service/GlobalApi';
import { getImageUrl } from '@/service/GlobalApi';

export default function UserTripCardItem({ trip }) {
  const [photoUrl, setPhotoUrl] = useState('/placeholder.jpg');

  useEffect(() => {
    const label = trip?.userSelection?.location?.label;
    if (!label || typeof label !== 'string' || label.trim() === '') {
      console.warn("⚠️ No location label available yet, skipping photo fetch.");
      return;
    }

    console.log("📦 Fetching photo for:", label);
    GetPlacePhoto(label);
  }, [trip]);

  const GetPlacePhoto = async (label) => {
    console.log("📦 Sending to API:", label);

    try {
      const resp = await GetPlaceDetails(label);
      console.log("✅ API response:", resp);
      const result = resp?.places?.[0];

      if (!result) {
        console.warn("⚠️ No result found in API response.");
        setPhotoUrl('/placeholder.jpg');
        return;
      }

      const photoName = result.photos?.[0]?.name;
      const photoRef = photoName?.split('/').pop();

      if (photoRef) {
        console.log("🖼️ Setting photo URL:", getImageUrl(photoRef));
        setPhotoUrl(getImageUrl(photoRef));


      } else {
        console.warn("⚠️ No photoRef found.");
        setPhotoUrl('/placeholder.jpg');
      }

    } catch (err) {
      console.error("❌ Failed to get place details:", err?.response?.data || err.message);
      setPhotoUrl('/placeholder.jpg');
    }
  };

  return (
    <Link to={'/view-trip/' + trip?.id}>
      <div className='hover:scale-105 transition-all'>
        <img
          src={photoUrl}
          alt={trip.id}
          loading="lazy"
          onError={(e) => { e.target.src = '/placeholder.jpg'; }}

          className="w-[130px] h-[130px] rounded-xl"

        />

        <div>
          <h2 className='font-bold text-lg'>
            {trip?.userSelection?.location?.label}
          </h2>
          <h2 className='text-sm text-black-500'>{trip?.userSelection?.noOfDays} Day Trip with {trip?.userSelection?.budget} Budget</h2>
        </div>
      </div>
    </Link>
  )
}
