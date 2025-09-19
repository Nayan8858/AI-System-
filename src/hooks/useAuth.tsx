import { useUser, useClerk } from "@clerk/clerk-react";

export const useAuth = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  return {
    user,
    session: user ? { user } : null,
    loading: !isLoaded,
    signOut,
  };
};