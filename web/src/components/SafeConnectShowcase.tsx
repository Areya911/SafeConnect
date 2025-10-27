// web/src/components/SafeConnectShowcase.tsx
import React, { useEffect, useRef, useState } from "react";
import { loadScript } from "../utils/loadScript";
import "../styles/showcase.css"; // small custom CSS file (below)

const SDK_PATHS = [
  // adjust these paths to where your SDK actually lives. If you used the original:
  "/_sdk/element_sdk.js",
  "/_sdk/data_sdk.js",
];

export default function SafeConnectShowcase() {
  const [activeMobileScreen, setActiveMobileScreen] = useState<
    "login" | "home" | "alerts" | "sos"
  >("login");

  const defaultConfig = useRef({
    app_name: "SafeConnect",
    tagline: "Community Safety Network for Women",
    welcome_message: "Stay safe, stay connected",
    sos_button_text: "SOS Emergency",
  });

  // load external SDKs on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // load sdk scripts one by one; ignore errors if they aren't critical
        for (const path of SDK_PATHS) {
          try {
            await loadScript(path, `sdk-${path}`);
          } catch (err) {
            // Non-fatal: SDK may not be needed in local dev
            // console.warn(err);
          }
        }

        // initialize elementSdk if present (mirrors your old code)
        const cfg = defaultConfig.current;
        if ((window as any).elementSdk && mounted) {
          (window as any).elementSdk.init({
            defaultConfig: cfg,
            onConfigChange: (config: any) => {
              // update title text in DOM - but in React we'll update state instead
              // You could extend this to set React state to re-render; for now update document
              if (mounted) {
                document.title = config.app_name || cfg.app_name;
                // optional: broadcast event for UI updates if needed
              }
            },
            mapToCapabilities: () => ({ recolorables: [], borderables: [] }),
            mapToEditPanelValues: () =>
              new Map([
                ["app_name", cfg.app_name],
                ["tagline", cfg.tagline],
                ["welcome_message", cfg.welcome_message],
                ["sos_button_text", cfg.sos_button_text],
              ]),
          });
        }
      } catch (e) {
        // SDK load failed - still fine for dev
        // console.warn("SDK load failed", e);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // small UI interactions that were in the original HTML
  useEffect(() => {
    // nothing heavy - we keep UI state in React
  }, [activeMobileScreen]);

  const showMobileScreen = (name: "login" | "home" | "alerts" | "sos") => {
    setActiveMobileScreen(name);
  };

  const handleSOS = () => {
    // playful tactile effect + placeholder for actual SOS logic
    const el = document.getElementById("sos-button");
    if (el) {
      el.style.transform = "scale(0.95)";
      setTimeout(() => (el.style.transform = "scale(1)"), 150);
    }
    // TODO: wire real SOS: call API, Firestore doc + notifications + trusted contacts
    alert("SOS triggered (demo). Integrate real SOS logic in Auth context & Firestore.");
  };

  const handleFloating = (btn: HTMLElement | null) => {
    if (!btn) return;
    btn.style.transform = "scale(0.9) rotate(45deg)";
    setTimeout(() => (btn.style.transform = "scale(1) rotate(0deg)"), 200);
    // Example action: open report modal / route to report page
    // navigate('/report') if using react-router
  };

  return (
    <div className="safeconnect-showcase container mx-auto p-6">
      <div className="header text-center mb-10">
        <h1 className="app-title text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 mb-2">
          SafeConnect
        </h1>
        <p className="app-subtitle text-slate-700">Community Safety Network for Women</p>
      </div>

      <div className="device-showcase grid md:grid-cols-[1fr_2fr] gap-10">
        {/* Mobile Mockup */}
        <div className="mobile-mockup bg-slate-900 rounded-3xl p-4 shadow-2xl">
          <div className="mobile-screen bg-white rounded-2xl overflow-hidden relative h-[600px]">
            <div className="screen-tabs flex justify-center gap-2 p-3">
              {(["login", "home", "alerts", "sos"] as const).map((s) => (
                <button
                  key={s}
                  className={`tab-btn px-4 py-2 rounded-full border ${
                    activeMobileScreen === s ? "bg-purple-600 text-white" : "bg-white"
                  }`}
                  onClick={() => showMobileScreen(s)}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Mobile Screens */}
            <div className={`screen-content ${activeMobileScreen === "login" ? "block" : "hidden"}`} id="mobile-login">
              <div className="login-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center h-full p-6">
                <div className="login-card bg-white rounded-xl p-8 max-w-md mx-auto shadow">
                  <h2 className="login-title text-2xl font-bold mb-4">Stay safe, stay connected</h2>
                  <input className="input-field w-full p-3 border rounded mb-3" placeholder="Email address" />
                  <input type="password" className="input-field w-full p-3 border rounded mb-3" placeholder="Password" />
                  <button className="btn-primary w-full py-3 rounded mb-3">Sign in</button>
                  <button className="btn-secondary w-full py-3 rounded mb-2">📱 Sign in with Phone</button>
                  <button className="btn-secondary w-full py-3 rounded">🔍 Sign in with Google</button>
                </div>
              </div>
            </div>

            <div className={`screen-content ${activeMobileScreen === "home" ? "block" : "hidden"}`} id="mobile-home">
              <div className="home-screen p-0 h-full flex flex-col">
                <div className="top-bar bg-white p-4 flex items-center justify-between shadow">
                  <div className="logo text-purple-600 font-bold">SafeConnect</div>
                  <div className="profile-avatar w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white">A</div>
                </div>

                <div className="map-container h-72 bg-gradient-to-br from-sky-100 to-violet-50 relative flex items-center justify-center">
                  <div className="map-placeholder text-slate-600 text-lg">📍 Interactive Safety Map</div>
                  <div className="map-pin pin-1 absolute top-[20%] left-[30%] w-7 h-7 rounded-full bg-red-500 flex items-center justify-center text-white">⚠️</div>
                  <div className="map-pin pin-2 absolute top-[60%] left-[70%] w-7 h-7 rounded-full bg-red-500 flex items-center justify-center text-white">⚠️</div>
                </div>

                <div className="stats-bar grid grid-cols-3 gap-4 p-4 bg-white rounded-xl shadow -mt-6 mx-4">
                  <div className="stat-item text-center">
                    <div className="stat-number text-2xl font-bold text-purple-600">24</div>
                    <div className="stat-label text-sm text-slate-500">Active Alerts</div>
                  </div>
                  <div className="stat-item text-center">
                    <div className="stat-number text-2xl font-bold text-purple-600">156</div>
                    <div className="stat-label text-sm text-slate-500">Community</div>
                  </div>
                  <div className="stat-item text-center">
                    <div className="stat-number text-2xl font-bold text-purple-600">98%</div>
                    <div className="stat-label text-sm text-slate-500">Safe Areas</div>
                  </div>
                </div>
              </div>
              <button
                className="floating-btn fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 text-white text-2xl shadow-lg"
                onClick={(e) => handleFloating(e.currentTarget as HTMLElement)}
              >
                +
              </button>
            </div>

            <div className={`screen-content ${activeMobileScreen === "alerts" ? "block" : "hidden"}`} id="mobile-alerts">
              <div className="p-4 h-full overflow-auto">
                <div className="top-bar flex items-center justify-between p-3 bg-white shadow rounded">
                  <div className="logo font-bold">Safety Alerts</div>
                  <div className="profile-avatar w-9 h-9 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center">A</div>
                </div>

                <div className="alerts-section mt-4">
                  <h3 className="section-title text-lg font-semibold mb-3">Recent Alerts Near You</h3>

                  <div className="alert-card bg-white rounded-lg p-4 shadow mb-3 flex gap-3 items-start">
                    <div className="alert-icon alert-warning w-10 h-10 rounded-full flex items-center justify-center bg-yellow-100">⚠️</div>
                    <div className="alert-content">
                      <div className="alert-title font-semibold">Unsafe Area Reported</div>
                      <div className="alert-description text-sm text-slate-500">Poor lighting and suspicious activity reported</div>
                      <div className="alert-meta text-xs text-slate-400">Oak Street • 2 hours ago • 0.3 miles away</div>
                    </div>
                  </div>

                  {/* add more cards similarly */}
                </div>
              </div>
            </div>

            <div className={`screen-content ${activeMobileScreen === "sos" ? "block" : "hidden"}`} id="mobile-sos">
              <div className="sos-screen h-full flex flex-col items-center justify-center p-4">
                <div id="sos-button" className="sos-button w-44 h-44 rounded-full bg-white flex items-center justify-center text-2xl font-bold text-red-600 shadow-lg cursor-pointer" onClick={handleSOS}>
                  <span id="sos-button-text">SOS Emergency</span>
                </div>
                <div className="sos-text text-white mt-4 mb-6">Tap to alert emergency contacts and authorities</div>

                <div className="emergency-contacts bg-white/10 p-4 rounded-lg w-full max-w-xs">
                  <h4 className="text-white mb-2">Emergency Contacts</h4>
                  <div className="contact-item text-white flex items-center gap-3 py-2">👤 <span>Mom - (555) 123-4567</span></div>
                  <div className="contact-item text-white flex items-center gap-3 py-2">👤 <span>Sarah - (555) 987-6543</span></div>
                  <div className="contact-item text-white flex items-center gap-3 py-2">🚨 <span>Local Police - 911</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Web Mockup */}
        <div className="web-mockup bg-white rounded-2xl shadow h-[520px] overflow-hidden">
          <div className="web-layout grid grid-cols-[300px_1fr] h-full">
            <aside className="sidebar bg-slate-900 text-white p-6">
              <div className="sidebar-logo text-xl font-bold text-purple-500">SafeConnect</div>
              <nav className="mt-6 space-y-2">
                {["Dashboard", "Safety Map", "Alerts", "Report Incident", "Community", "Emergency", "Settings"].map((n, i) => (
                  <div key={n} className={`nav-item flex items-center gap-3 p-3 rounded ${i === 0 ? "bg-gradient-to-r from-purple-500 to-pink-500" : "hover:bg-purple-900/30"}`}>
                    <span>{["🏠","📍","⚠️","📝","👥","🚨","⚙️"][i]}</span>
                    <span className="ml-1">{n}</span>
                  </div>
                ))}
              </nav>
            </aside>

            <main className="main-content p-4 bg-slate-50 overflow-auto">
              <div className="top-bar flex items-center justify-between bg-white p-3 rounded shadow mb-4">
                <div className="logo font-bold">Dashboard Overview</div>
                <div className="profile-avatar w-9 h-9 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center">A</div>
              </div>

              <div className="web-map h-64 bg-gradient-to-br from-sky-100 to-violet-50 rounded flex items-center justify-center mb-4">
                <div className="map-placeholder text-slate-600">🗺️ Interactive Community Safety Map</div>
                <div className="map-pin pin-1 absolute top-[20%] left-[30%] w-7 h-7 rounded-full bg-red-500 flex items-center justify-center text-white">⚠️</div>
              </div>

              <div className="stats-bar grid grid-cols-4 gap-4 p-4 bg-white rounded-xl shadow">
                <div className="stat-item text-center">
                  <div className="stat-number text-2xl font-bold text-purple-600">24</div>
                  <div className="stat-label text-sm text-slate-500">Active Alerts</div>
                </div>
                <div className="stat-item text-center">
                  <div className="stat-number text-2xl font-bold text-purple-600">156</div>
                  <div className="stat-label text-sm text-slate-500">Community Members</div>
                </div>
                <div className="stat-item text-center">
                  <div className="stat-number text-2xl font-bold text-purple-600">98%</div>
                  <div className="stat-label text-sm text-slate-500">Safe Areas</div>
                </div>
                <div className="stat-item text-center">
                  <div className="stat-number text-2xl font-bold text-purple-600">4.8</div>
                  <div className="stat-label text-sm text-slate-500">Trust Score</div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
