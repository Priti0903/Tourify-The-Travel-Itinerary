import React, { useState, useEffect } from 'react';
import { IoIosSend } from "react-icons/io";
import { GetPlaceDetails, getImageUrl } from '@/service/GlobalApi';

function InfoSection({ trip }) {
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
        const imageUrl = getImageUrl(photoRef);
        console.log("🖼️ Setting photo URL to:", imageUrl);
        setPhotoUrl(imageUrl);
      } else {
        console.warn("⚠️ No photo reference found.");
        setPhotoUrl('/placeholder.jpg');
      }

    } catch (err) {
      console.error("❌ Failed to get place details:", err?.response?.data || err.message);
      setPhotoUrl('/placeholder.jpg');
    }
  };

  return (
    <div>
      <img
        src={photoUrl}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/placeholder.jpg';
        }}
        className='h-[500px] w-full object-cover rounded-xl'
        alt='destination'
      />

      <div className='flex justify-between items-center'>
        <div className='my-5 flex flex-col gap-2'>
          <h2 className='font-bold text-2xl'>
            {trip?.userSelection?.location?.label}
          </h2>
          <div className='flex gap-5 flex-wrap'>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-lg md:text-md font-bold'>
              📆 {trip.userSelection?.noOfDays} Days
            </h2>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-lg md:text-md font-bold'>
              💰 Budget Type: {trip.userSelection?.budget}
            </h2>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-lg md:text-md font-bold'>
              🧑🏻‍🤝‍🧑🏽 Travelers: {trip.userSelection?.traveller}
            </h2>
          </div>
        </div>
        <button className="text-2xl text-gray-600 hover:text-black">
          <IoIosSend />
        </button>
      </div>
    </div>
  );
}

export default InfoSection;
