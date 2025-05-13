import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { FaMapLocationDot } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { GetPlaceDetails, getImageUrl } from '@/service/GlobalApi';

function PlaceCardItem({ place }) {
  const [photoUrl, setPhotoUrl] = useState('/placeholder.jpg');

  useEffect(() => {
    const label = place?.placeName;
    if (!label || typeof label !== 'string' || label.trim() === '') {
      console.warn("⚠️ No location label available yet, skipping photo fetch.");
      return;
    }

    console.log("📦 Fetching photo for:", label);
    GetPlacePhoto(label);
  }, [place]);

  const GetPlacePhoto = async (label) => {
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
      if (photoName) {
        const imageUrl = getImageUrl(photoName, true); // ✅ isV1 = true
        console.log("🖼️ Setting photo URL:", imageUrl);
        setPhotoUrl(imageUrl);
      } else {
        setPhotoUrl('/placeholder.jpg');
      }
    } catch (err) {
      console.error("❌ Failed to get place details:", err?.response?.data || err.message);
      setPhotoUrl('/placeholder.jpg');
    }
  };

  return (
    <Link
      to={`https://www.google.com/maps/search/?api=1&query=${place?.placeName},${place?.bestTimeToVisit},${place?.rating},${place?.details},${place?.geoCoordinates}`}
      target="_blank"
    >
      <div className="border rounded-xl p-3 mt-2 flex gap-5 hover:scale-105 transition-all hover:shadow-md cursor-pointer">
        <img
          src={photoUrl}
          alt={place.placeName}
          loading="lazy"
          onError={(e) => { e.target.src = '/placeholder.jpg'; }}
          className="w-[130px] h-[130px] rounded-xl"
        />
        <div>
          <h2 className="font-bold text-lg">{place.placeName}</h2>
          <p className="text-sm text-black-400">{place.details}</p>
          <h2 className="mt-2">🕙 {place.bestTimeToVisit}</h2>
          <Button size="sm">
            <FaMapLocationDot />
          </Button>
        </div>
      </div>
    </Link>
  );
}

export default PlaceCardItem;
