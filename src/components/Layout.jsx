import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "./BottomNav";
import SplashScreen from "./SplashScreen";
import ParticipantGate from "./ParticipantGate";

const SPLASH_KEY = "jornada1212_splash_seen";

export default function Layout() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const [showSplash, setShowSplash] = useState(
    () => !localStorage.getItem(SPLASH_KEY)
  );

  return (
    <>
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}

      {!showSplash && (
        <ParticipantGate>
          <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50/30">
            <div className={`mx-auto max-w-md ${isHome ? "" : "pb-24"}`}>
              <Outlet />
            </div>

            {!isHome && <BottomNav />}
          </div>
        </ParticipantGate>
      )}
    </>
  );
}