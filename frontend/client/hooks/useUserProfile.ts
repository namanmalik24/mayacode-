// hooks/useUserProfile.ts
import { useState, useEffect } from "react";
import { apiService } from "../services/api";
import { UserProfile, DEFAULT_USER_PROFILE } from "../constants";

export function useUserProfile() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const userResponse = await apiService.getUser();
        if (userResponse.success) {
          setUserProfile({
            name: userResponse.data.Name || DEFAULT_USER_PROFILE.name,
            alias: userResponse.data.Alias || DEFAULT_USER_PROFILE.alias,
            countryOfOrigin: userResponse.data.OriginCountry || DEFAULT_USER_PROFILE.countryOfOrigin,
            dateOfRegistration: userResponse.data.ArrivalDate || "2024-07-01",
            email: userResponse.data.Email || DEFAULT_USER_PROFILE.email,
            phone: userResponse.data.Phone || DEFAULT_USER_PROFILE.phone,
            bio: userResponse.data.LongTermPlans || DEFAULT_USER_PROFILE.bio,
            onboardingSummary: userResponse.data.MigrationReason || DEFAULT_USER_PROFILE.onboardingSummary,
            age: userResponse.data.Age || DEFAULT_USER_PROFILE.age,
            gender: userResponse.data.Gender || DEFAULT_USER_PROFILE.gender,
            dateOfBirth: userResponse.data.DateOfBirth || DEFAULT_USER_PROFILE.dateOfBirth,
            challenges: userResponse.data.Challenges || DEFAULT_USER_PROFILE.challenges,
          });
        } else {
          setUserProfile(DEFAULT_USER_PROFILE);
        }
      } catch {
        setUserProfile(DEFAULT_USER_PROFILE);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  return { userProfile, isLoading, setUserProfile };
}