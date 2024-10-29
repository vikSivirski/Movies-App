import React, { createContext, useState, useEffect } from "react";

export const SessionContext = createContext();

const SessionProvider = ({ children }) => {
  const [guestSessionId, setGuestSessionId] = useState(() => {
    return localStorage.getItem("guestSessionId") || null;
  });

  useEffect(() => {
    if (!guestSessionId) {
      createGuestSession();
    }
  }, [guestSessionId]);

  const createGuestSession = async () => {
    try {
      const response = await fetch(
        "https://api.themoviedb.org/3/authentication/guest_session/new?api_key=8490441a780d696323472e0a8e97e0ca&query",
      );
      const data = await response.json();
      if (data.guest_session_id) {
        setGuestSessionId(data.guest_session_id);
        localStorage.setItem("guestSessionId", data.guest_session_id);
      }
    } catch (error) {
      console.error("Failed to create guest session", error);
    }
  };

  return (
    <SessionContext.Provider value={{ guestSessionId }}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionProvider;
