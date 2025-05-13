import React from 'react';
import PlaceCardItem from './PlaceCardItem';

function PlacesToVisit({ trip }) {
  const itinerary = trip?.tripData?.dailyItinerary ?? [];

  return (
    <div className="mt-8">
      <h2 className="font-bold text-xl mb-4">🗺️ Places to Visit</h2>

      {itinerary.length === 0 ? (
        <p className="text-gray-500 mt-3">No places found for this trip.</p>
      ) : (
        itinerary.map((item, index) => (
          <div key={`day-${index}`} className="mt-6 border-b pb-4 last:border-none">
            <h2 className="font-semibold text-lg text-blue-700 mb-3">Day {item.day}</h2>

            {item.activities?.length ? (
              <div className="grid md:grid-cols-2 gap-5">
                {item.activities
                  ?.filter((place) => place && place.placeName)
                  .map((place, idx) => (
                    <div key={`${place.placeName}-${idx}`} className="break-inside-avoid">
                      {place.travelTimeFromPrevious && (
                        <h2 className="text-sm text-black-600 mb-1">
                          🚗 {place.travelTimeFromPrevious}
                        </h2>
                      )}
                      <PlaceCardItem place={place} />
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-black-500">No activities listed for this day.</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default PlacesToVisit;
