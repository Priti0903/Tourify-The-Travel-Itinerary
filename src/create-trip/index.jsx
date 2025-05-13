import { Input } from "@/components/ui/input";
import React, { useState, useRef, useEffect } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { AI_PROMPT, SelectBudgetOptions, SelectTravelList } from "@/constants/options";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { chatSession } from "@/service/AIModel";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { db } from "@/service/firebaseConfig.jsx";
import { setDoc, doc } from "firebase/firestore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import JSON5 from "json5";

function CreateTrip() {
  const generateBtnRef = useRef();
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const generateAfterLogin = useRef(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const login = useGoogleLogin({
    scope: "openid email profile",
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );
        const user = res.data;
        localStorage.setItem('user', JSON.stringify(user));
        setOpenDialog(false);
        window.dispatchEvent(new Event("userLoggedIn"));
      } catch (error) {
        toast.error("Failed to fetch user info.");
        console.error("Google user fetch error:", error);
      }
    },
  });

  useEffect(() => {
    const handleUserLogin = () => {
      if (generateAfterLogin.current) {
        generateAfterLogin.current = false;
        if (generateBtnRef.current) {
          generateBtnRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          generateBtnRef.current.focus();
        }
        setTimeout(() => {
          OnGenerateTrip();
        }, 600);
      }
    };
    window.addEventListener("userLoggedIn", handleUserLogin);
    return () => window.removeEventListener("userLoggedIn", handleUserLogin);
  }, []);

  const OnGenerateTrip = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || !user.email) {
      generateAfterLogin.current = true;
      window.dispatchEvent(new Event("openLoginDialog")); // ✅ global trigger
      return;
    }

    if (!formData?.location || !formData?.budget || !formData?.traveller || formData?.noOfDays > 5) {
      toast("Please enter all fields and make sure days are less than or equal to 5");
      return;
    }

    setLoading(true);

    const FINAL_PROMPT = AI_PROMPT
      .replace('{location}', formData?.location?.label)
      .replace('{totalDays}', formData?.noOfDays)
      .replace('{traveller}', formData?.traveller)
      .replace('{budget}', formData?.budget);

    const result = await chatSession.sendMessage(FINAL_PROMPT);
    const responseText = await result?.response?.text();

    console.log("🧠 AI Raw Response:", responseText);

    try {
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
      let rawJson = jsonMatch ? jsonMatch[1] : responseText;
      const parsed = JSON5.parse(rawJson);
      SaveAiTrip(JSON.stringify(parsed));
    } catch (err) {
      toast.error("Failed to parse AI response.");
      console.error("❌ JSON5 parse error:", err);
      console.log("🧪 Raw AI Response:", responseText);
    }

    setLoading(false);
  };

  const normalizeTripData = (data) => {
    const toCamel = (str) => str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    const normalizeObject = (obj) => {
      if (Array.isArray(obj)) return obj.map(normalizeObject);
      if (obj !== null && typeof obj === 'object') {
        const newObj = {};
        for (const [key, value] of Object.entries(obj)) {
          let newKey = toCamel(key);
          if (newKey === 'travelTime') newKey = 'travelTimeFromPrevious';
          newObj[newKey] = normalizeObject(value);
        }
        return newObj;
      }
      return obj;
    };
    const normalized = normalizeObject(data);
    if (normalized.dailyItinerary) {
      normalized.dailyItinerary = normalized.dailyItinerary.map((day) => {
        day.activities = day.activities || day.schedule || day.locations || [];
        delete day.schedule;
        delete day.locations;
        return day;
      });
    }
    return normalized;
  };

  const SaveAiTrip = async (TripData) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));
    const docId = Date.now().toString();
    try {
      const parsedTrip = JSON.parse(TripData);
      const normalizedTrip = normalizeTripData(parsedTrip);
      await setDoc(doc(db, "AITrips", docId), {
        userSelection: formData,
        tripData: normalizedTrip,
        userEmail: user?.email,
        id: docId,
      });
      toast.success("Trip saved successfully!");
      navigate('/view-trip/' + docId);
    } catch (error) {
      toast.error("Failed to save trip.");
      console.error("Trip data save error:", error, "\nRaw JSON:", TripData);
    }
    setLoading(false);
  };

  return (
    <>
    <div className="page-background" />
    
    <div className="mx-auto max-w-4xl px-5 sm:px-10 md:px-16 lg:px-32 xl:px-40 mt-10 rounded-3xl border border-white/20 backdrop-blur-xl bg-white/10 shadow-2xl" >
      <h2 className='font-bold text-3xl'>Tell us your travel preferences 🏕️🌴</h2>
      <p className='mt-3 text-black-500 text-xl'>Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.</p>

      <div className='mt-20 space-y-10'>
        <div>
          <h3 className='text-xl my-3 font-medium'>What is destination of choice?</h3>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
            selectProps={{
              place,
              onChange: (v) => { setPlace(v); handleInputChange('location', v); }
            }}
          />
        </div>

        <div>
          <h3 className='text-xl my-3 font-medium '>How many days are you planning your trip?</h3>
          <Input type="number" placeholder="Ex. 3" className="w-full" onChange={(e) => handleInputChange('noOfDays', Number(e.target.value))} />
        </div>
      </div>

      <div>
        <h3 className='text-xl my-3 font-medium'>What is Your Budget?</h3>
        <div className="options-grid gap-4">
          {SelectBudgetOptions.map((item, index) => (
            <div key={index}
              onClick={() => handleInputChange('budget', item.title)}
              className={`p-4 border-2 cursor-pointer rounded-xl text-center transition ${formData?.budget === item.title ? 'border-black shadow-lg' : 'border-white hover:border-black'}`}>
              <h2 className="text-4xl">{item.icon}</h2>
              <h3 className="font-bold text-lg">{item.title}</h3>
              <h4 className="text-sm text-black-500">{item.desc}</h4>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className='text-xl my-3 font-medium'>Who are you traveling with?</h3>
        <div className="options-grid gap-4">
          {SelectTravelList.map((item, index) => (
            <div key={index}
              onClick={() => handleInputChange("traveller", item.people)}
              className={`p-4 border-2 cursor-pointer rounded-xl text-center transition ${formData?.traveller === item.people ? 'border-black shadow-lg' : 'border-white hover:border-black'}`}>
              <h2 className="text-4xl">{item.icon}</h2>
              <h3 className="font-bold text-lg">{item.title}</h3>
              <h4 className="text-sm text-black-500">{item.desc}</h4>
            </div>
          ))}
        </div>
      </div>

      <div className="my-10 justify-end flex">
        <Button ref={generateBtnRef} disabled={loading} onClick={OnGenerateTrip}>
          {loading ? <AiOutlineLoading3Quarters className='h-7 w-7 animate-spin' /> : 'Generate Trip'}
        </Button>
      </div>

      {/* 🔓 Sign-In Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl shadow-xl z-[100]">
          <DialogHeader>
            <DialogTitle className="text-black dark:text-white" />
            <DialogDescription className="text-gray-600 dark:text-gray-300">
              <img src="/logo.svg" className="mx-auto" />
              <h2 className="font-bold text-lg mt-7">Sign in with Google</h2>
              <p>Sign in to generate and save your trip.</p>
              <Button onClick={login} className="w-full mt-5 flex gap-4 items-center">
                <FcGoogle className="h-7 w-7" />Sign in with Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
    </>
  );
}

export default CreateTrip;
