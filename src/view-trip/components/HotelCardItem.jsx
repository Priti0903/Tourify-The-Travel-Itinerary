import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '@/service/GlobalApi';
import { GetPlaceDetails } from '@/service/GlobalApi';

export default function HotelCardItem({ hotel }) {
  const [photoUrl, setPhotoUrl] = useState('/placeholder.jpg');

  useEffect(() => {
    const label = hotel?.name;
    if (!label || typeof label !== 'string' || label.trim() === '') {
      console.warn("⚠️ No location label available yet, skipping photo fetch.");
      return;
    }

    console.log("📦 Fetching photo for:", label);
    GetPlacePhoto(label);
  }, [hotel]);

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
        console.log("🖼️ Setting photo URL:", imageUrl);
        setPhotoUrl(imageUrl);
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
    <Link
      to={
        'https://www.google.com/maps/search/?api=1&query=' +
        [hotel?.name, hotel?.address, hotel?.rating, hotel?.placeName, hotel?.geoCoordinates].join(',')
      }
      target="_blank"
    >
      <div className="hover:scale-105 transition-all cursor-pointer">
        <img src={photoUrl} className="rounded-xl h-[180px] w-full object-cover" />
        <div className="my-2 flex flex-col gap-2">
          <h2 className="font-medium">{hotel?.name}</h2>
          <h2 className="text-xs text-black-500">📍 {hotel?.address}</h2>
          <h2 className="text-sm">💰 Click to know more</h2>
          <h2 className="text-sm">⭐ {hotel?.rating}</h2>
        </div>
      </div>
    </Link>
  );
}
