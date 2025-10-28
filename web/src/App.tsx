// web/src/App.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Loader2, Shield, Heart, Map, Settings, Zap, LogOut, MessageSquare, Menu, X, Trash2 } from 'lucide-react';

// --- Types ---
type IncidentType = 'Harassment' | 'Suspicious Activity' | 'Medical Emergency' | 'Other';
type Language = 'en' | 'es' | 'hi';

interface IncidentReport {
  id: string;
  type: IncidentType;
  description: string;
  location: { lat: number; lng: number; };
  timestamp: number;
  photoUrl?: string;
  credibilityScore: number;
  userId: string;
}

interface UserSettings {
  language: Language;
  notificationsEnabled: boolean;
  isAnon: boolean;
}

// --- Constants & Translations (Mock) ---
const API_KEY_GMAPS = "AIzaSyDxIBa1jraQa8ZLYsCEfnCawtgEaUKKHAQ";
const FIREBASE_CONFIG = {}; // Mock Config
const FCM_VAPID_KEY = "BF8yClNO2XrpuXKJ2V5kj9lrMbjY_zAvgkBdzi2prBBw7vjrhyG19zVNPcccLNmgt6iEff1_c5UdKuu3z3y-5P4";
const INITIAL_CENTER = { lat: 28.6139, lng: 77.2090 }; // New Delhi
const translations: Record<Language, Record<string, string>> = {
  en: {
    appName: "SafeConnect",
    home: "Home",
    reportIncident: "Report Incident",
    alerts: "Alerts",
    heatmap: "Heatmap",
    sos: "SOS",
    settings: "Settings",
    login: "Anonymous Login",
    logout: "Logout",
    welcome: "Welcome to SafeConnect",
    safetyIsPriority: "Your safety is our priority. Report incidents or use the SOS button instantly.",
    selectIncidentType: "Select Incident Type",
    harassment: "Harassment",
    suspiciousActivity: "Suspicious Activity",
    medicalEmergency: "Medical Emergency",
    other: "Other",
    describeIncident: "Describe the incident (max 200 chars)",
    pinLocation: "Location Pinned",
    uploadPhoto: "Upload Photo (Optional)",
    submitReport: "Submit Report",
    incidentReported: "Incident Reported Successfully!",
    emergencyAlert: "Emergency Alert Sent!",
    alertNearbyUsers: "Alerting nearby users and trusted contacts.",
    privacyPolicy: "Privacy Policy",
    language: "Language",
    notifications: "Real-time Alerts",
    saveSettings: "Save Settings",
    mockAuthSuccess: "Logged in anonymously as User ID: ",
    mockLogout: "Logged out.",
    incidentsList: "Recent Incidents",
    credibility: "Credibility Score",
    anonWarning: "You are currently logged in anonymously. Reports will not be linked to a persistent profile.",
    reportSuccessTitle: "Report Submitted",
    reportSuccessMessage: "Thank you for making our community safer. Your report will be verified.",
    trustedContacts: "Trusted Contacts",
    mockContact1: "Mom (M. Sharma)",
    mockContact2: "Friend (A. Khan)",
    toggleNotifications: "Enable Notifications",
    reportLocationInstruction: "Please ensure your device location is enabled.",
    heatmapDescription: "Unsafe zones based on recent incident frequency.",
    dangerZone: "High-Risk Zone",
    safeZone: "Low-Risk Zone",
    reportDetail: "Incident Details",
    type: "Type",
    description: "Description",
    time: "Time",
    userId: "Reporter ID",
    deleteReport: "Delete Report (Admin Mock)",
    reportDeleted: "Report Deleted.",
  },
  es: {
    appName: "SafeConnect",
    home: "Inicio",
    reportIncident: "Reportar Incidente",
    alerts: "Alertas",
    heatmap: "Mapa de Calor",
    sos: "SOS",
    settings: "Configuración",
    login: "Inicio de Sesión Anónimo",
    logout: "Cerrar Sesión",
    welcome: "Bienvenido a SafeConnect",
    safetyIsPriority: "Tu seguridad es nuestra prioridad. Reporta incidentes o usa el botón SOS al instante.",
    selectIncidentType: "Selecciona Tipo de Incidente",
    harassment: "Acoso",
    suspiciousActivity: "Actividad Sospechosa",
    medicalEmergency: "Emergencia Médica",
    other: "Otro",
    describeIncident: "Describe el incidente (máx. 200 caracteres)",
    pinLocation: "Ubicación Marcada",
    uploadPhoto: "Subir Foto (Opcional)",
    submitReport: "Enviar Reporte",
    incidentReported: "¡Incidente Reportado con Éxito!",
    emergencyAlert: "¡Alerta de Emergencia Enviada!",
    alertNearbyUsers: "Alertando a usuarios cercanos y contactos de confianza.",
    privacyPolicy: "Política de Privacidad",
    language: "Idioma",
    notifications: "Alertas en Tiempo Real",
    saveSettings: "Guardar Configuración",
    mockAuthSuccess: "Sesión iniciada anónimamente como ID de Usuario: ",
    mockLogout: "Sesión cerrada.",
    incidentsList: "Incidentes Recientes",
    credibility: "Puntuación de Credibilidad",
    anonWarning: "Actualmente has iniciado sesión de forma anónima. Los informes no estarán vinculados a un perfil persistente.",
    reportSuccessTitle: "Reporte Enviado",
    reportSuccessMessage: "Gracias por hacer nuestra comunidad más segura. Tu informe será verificado.",
    trustedContacts: "Contactos de Confianza",
    mockContact1: "Mamá (M. Sharma)",
    mockContact2: "Amigo (A. Khan)",
    toggleNotifications: "Habilitar Notificaciones",
    reportLocationInstruction: "Por favor, asegúrate de que la ubicación de tu dispositivo esté habilitada.",
    heatmapDescription: "Zonas inseguras basadas en la frecuencia de incidentes recientes.",
    dangerZone: "Zona de Alto Riesgo",
    safeZone: "Zona de Bajo Riesgo",
    reportDetail: "Detalles del Incidente",
    type: "Tipo",
    description: "Descripción",
    time: "Hora",
    userId: "ID del Reportero",
    deleteReport: "Eliminar Reporte (Mock Admin)",
    reportDeleted: "Reporte Eliminado.",
  },
  hi: {
    appName: "सेफकनेक्ट",
    home: "होम",
    reportIncident: "घटना रिपोर्ट करें",
    alerts: "अलर्ट",
    heatmap: "हीटमैप",
    sos: "एसओएस",
    settings: "सेटिंग्स",
    login: "अनाम लॉगिन",
    logout: "लॉगआउट",
    welcome: "सेफकनेक्ट में आपका स्वागत है",
    safetyIsPriority: "आपकी सुरक्षा हमारी प्राथमिकता है। तुरंत घटनाओं की रिपोर्ट करें या एसओएस बटन का उपयोग करें।",
    selectIncidentType: "घटना का प्रकार चुनें",
    harassment: "उत्पीड़न",
    suspiciousActivity: "संदिग्ध गतिविधि",
    medicalEmergency: "चिकित्सा आपातकाल",
    other: "अन्य",
    describeIncident: "घटना का वर्णन करें (अधिकतम 200 वर्ण)",
    pinLocation: "स्थान पिन किया गया",
    uploadPhoto: "फोटो अपलोड करें (वैकल्पिक)",
    submitReport: "रिपोर्ट सबमिट करें",
    incidentReported: "घटना सफलतापूर्वक रिपोर्ट की गई!",
    emergencyAlert: "आपातकालीन अलर्ट भेजा गया!",
    alertNearbyUsers: "आस-पास के उपयोगकर्ताओं और विश्वसनीय संपर्कों को अलर्ट करना।",
    privacyPolicy: "गोपनीयता नीति",
    language: "भाषा",
    notifications: "रीयल-टाइम अलर्ट",
    saveSettings: "सेटिंग्स सहेजें",
    mockAuthSuccess: "उपयोगकर्ता आईडी के रूप में अनामित रूप से लॉग इन किया गया: ",
    mockLogout: "लॉग आउट किया गया।",
    incidentsList: "हाल की घटनाएं",
    credibility: "विश्वसनीयता स्कोर",
    anonWarning: "आप वर्तमान में गुमनाम रूप से लॉग इन हैं। रिपोर्ट किसी स्थायी प्रोफ़ाइल से लिंक नहीं होंगी।",
    reportSuccessTitle: "रिपोर्ट सबमिट की गई",
    reportSuccessMessage: "हमारे समुदाय को सुरक्षित बनाने के लिए धन्यवाद। आपकी रिपोर्ट सत्यापित की जाएगी।",
    trustedContacts: "विश्वसनीय संपर्क",
    mockContact1: "माँ (एम. शर्मा)",
    mockContact2: "दोस्त (ए. खान)",
    toggleNotifications: "सूचनाएं सक्षम करें",
    reportLocationInstruction: "कृपया सुनिश्चित करें कि आपके डिवाइस का स्थान सक्षम है।",
    heatmapDescription: "हाल की घटनाओं की आवृत्ति के आधार पर असुरक्षित क्षेत्र।",
    dangerZone: "उच्च जोखिम क्षेत्र",
    safeZone: "कम जोखिम क्षेत्र",
    reportDetail: "घटना विवरण",
    type: "प्रकार",
    description: "विवरण",
    time: "समय",
    userId: "रिपोर्टर आईडी",
    deleteReport: "रिपोर्ट हटाएं (मॉक व्यवस्थापक)",
    reportDeleted: "रिपोर्ट हटा दी गई।",
  },
};

// --- Mock Data ---
const mockIncidents: IncidentReport[] = [
  {
    id: 'inc1', type: 'Harassment', description: 'Street harassment near metro exit.',
    location: { lat: 28.6272, lng: 77.2281 }, timestamp: Date.now() - 3600000,
    credibilityScore: 4.5, userId: 'anon-7890',
  },
  {
    id: 'inc2', type: 'Suspicious Activity', description: 'Unattended bag at the bus stop.',
    location: { lat: 28.6139, lng: 77.2090 }, timestamp: Date.now() - 7200000,
    credibilityScore: 3.2, userId: 'user-001',
  },
  {
    id: 'inc3', type: 'Medical Emergency', description: 'Person collapsed near the market.',
    location: { lat: 28.6000, lng: 77.2000 }, timestamp: Date.now() - 10800000,
    credibilityScore: 5.0, userId: 'anon-1234',
  },
];

// --- Mock Firebase/Maps Hooks & Functions ---

// Mock Map Loader
const loadGoogleMapsScript = (apiKey: string) => {
  if ((window as any).google) return;
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=visualization`;
  script.async = true;
  document.head.appendChild(script);
};

// Mock Firebase Auth Hook
const useAuth = (settings: UserSettings, showToast: (message: string, type: 'success' | 'error' | 'info' | 'alert') => void) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isAnon, setIsAnon] = useState(false);

  // Global variables provided by the canvas environment
  const appId = typeof (window as any).__app_id !== 'undefined' ? (window as any).__app_id : 'default-app-id';
  const firebaseConfig = typeof (window as any).__firebase_config !== 'undefined' ? JSON.parse((window as any).__firebase_config) : FIREBASE_CONFIG;
  const initialAuthToken = typeof (window as any).__initial_auth_token !== 'undefined' ? (window as any).__initial_auth_token : undefined;

  useEffect(() => {
    const mockSignIn = async () => {
      console.log("Firebase App ID:", appId);
      let mockUid;
      if (initialAuthToken) {
        mockUid = 'user-001';
        setIsAnon(false);
        console.log("Mock: Signed in with custom token.");
      } else {
        mockUid = `anon-${crypto.randomUUID().substring(0, 8)}`;
        setIsAnon(true);
        console.log("Mock: Signed in anonymously.");
      }
      setUserId(mockUid);
    };
    mockSignIn();
  }, [appId, initialAuthToken]);

  const mockAnonLogin = () => {
    const mockUid = `anon-${crypto.randomUUID().substring(0, 8)}`;
    setUserId(mockUid);
    setIsAnon(true);
    showToast(translations[settings.language].mockAuthSuccess + mockUid, 'success');
  };

  const mockLogout = () => {
    setUserId(null);
    setIsAnon(false);
    showToast(translations[settings.language].mockLogout, 'info');
  };

  return { userId, isAnon, mockAnonLogin, mockLogout };
};

// Mock Firestore + FCM
const mockFirestore = {
  addIncident: (report: Omit<IncidentReport, 'id' | 'timestamp' | 'credibilityScore'>, userId: string): Promise<IncidentReport> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const newReport: IncidentReport = {
          ...report,
          id: `inc-${Date.now()}`,
          timestamp: Date.now(),
          credibilityScore: report.type === 'Harassment' ? 3.0 : 4.0,
          userId: userId || 'anon-unknown',
        };
        mockIncidents.push(newReport);
        resolve(newReport);
      }, 500);
    });
  },
  subscribeToFCM: (token: string) => {
    console.log("Mock FCM: Subscribing with token:", token);
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 300));
  },
  triggerSOS: (userId: string, location: { lat: number; lng: number; }) => {
    console.log(`Mock SOS: Triggered by ${userId} at ${location.lat}, ${location.lng}`);
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
  },
};

// --- Map Component ---
const MapContainer: React.FC<{ center: { lat: number, lng: number }, markers: IncidentReport[], isHeatmap: boolean, onMapClick?: (lat: number, lng: number) => void }> = ({ center, markers, isHeatmap, onMapClick }) => {
  const mapRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!(window as any).google || !mapRef.current) return;

    const map = new (window as any).google.maps.Map(mapRef.current, {
      center,
      zoom: 12,
      disableDefaultUI: true,
      styles: [
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
        { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
        { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
        { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
        { featureType: "transit", elementType: "geometry.fill", stylers: [{ color: "#2f3948" }] },
        { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
      ],
    });

    if (onMapClick) {
      map.addListener("click", (e: any) => onMapClick(e.latLng.lat(), e.latLng.lng()));
    }

    // clear overlays
    const existingLayers = map.overlayMapTypes.getArray();
    existingLayers.forEach(layer => map.overlayMapTypes.remove(layer));

    if (isHeatmap) {
      const heatMapData = markers.map(m => new (window as any).google.maps.LatLng(m.location.lat, m.location.lng));
      new (window as any).google.maps.visualization.HeatmapLayer({ data: heatMapData, map, radius: 30, opacity: 0.8 });
    } else {
      markers.forEach(incident => {
        new (window as any).google.maps.Marker({
          position: incident.location,
          map,
          title: `${incident.type} (Score: ${incident.credibilityScore})`,
          icon: {
            path: (window as any).google.maps.SymbolPath.CIRCLE,
            fillColor: incident.type === 'Harassment' ? '#f87171' : '#facc15',
            fillOpacity: 0.9,
            strokeWeight: 0,
            scale: 8,
          },
        });
      });
    }
  }, [center, markers, isHeatmap, onMapClick]);

  return <div ref={mapRef} className="w-full h-full min-h-[300px] rounded-lg shadow-xl" />;
};

// --- App Component ---
const App: React.FC = () => {
  // Global State
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [settings, setSettings] = useState<UserSettings>({ language: 'en', notificationsEnabled: true, isAnon: true });
  const [currentIncidents, setCurrentIncidents] = useState<IncidentReport[]>(mockIncidents);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'alert' } | null>(null);
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'alert') => {
    setToast({ message, type }); setTimeout(() => setToast(null), 3000);
  }, []);

  // Auth
  const { userId, isAnon, mockAnonLogin, mockLogout } = useAuth(settings, showToast);

  // Translations
  const t = useMemo(() => translations[settings.language], [settings.language]);

  // Load Google Maps
  useEffect(() => { loadGoogleMapsScript(API_KEY_GMAPS); }, []);

  // Incident reporting state
  const [reportType, setReportType] = useState<IncidentType>('Harassment');
  const [reportDescription, setReportDescription] = useState('');
  const [reportLocation, setReportLocation] = useState<{ lat: number; lng: number; } | null>(null);
  const [reportPhoto, setReportPhoto] = useState<File | null>(null);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) { showToast('Geolocation is not supported by this browser.', 'error'); return; }
    navigator.geolocation.getCurrentPosition((position) => {
      setReportLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
      showToast('Location pinned successfully!', 'success');
    }, (error) => {
      console.error("Geolocation error:", error);
      showToast(t.reportLocationInstruction, 'error');
    }, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });
  }, [t.reportLocationInstruction, showToast]);

  useEffect(() => { if (currentPage === 'reportIncident' && !reportLocation) getCurrentLocation(); }, [currentPage, reportLocation, getCurrentLocation]);

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportLocation || !userId) { showToast('Please ensure location is pinned and you are logged in.', 'error'); return; }
    setIsLoading(true);
    const newReport: Omit<IncidentReport, 'id' | 'timestamp' | 'credibilityScore'> = { type: reportType, description: reportDescription, location: reportLocation, photoUrl: reportPhoto ? 'mock-storage-url' : undefined };
    try {
      const addedReport = await mockFirestore.addIncident(newReport, userId);
      setCurrentIncidents(prev => [...prev, addedReport]);
      showToast(t.reportSuccessTitle, 'success');
      setReportType('Harassment'); setReportDescription(''); setReportLocation(null); setReportPhoto(null); setCurrentPage('alerts');
    } catch (err) {
      showToast('Failed to submit report. Please try again.', 'error');
    } finally { setIsLoading(false); }
  };

  const handleSOS = async () => {
    if (!userId) { showToast('Please login to use SOS feature.', 'error'); return; }
    if (!navigator.geolocation) { showToast('Geolocation is required for SOS.', 'error'); return; }
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const location = { lat: position.coords.latitude, lng: position.coords.longitude };
      await mockFirestore.triggerSOS(userId!, location);
      showToast(t.emergencyAlert, 'alert'); setIsLoading(false);
    }, (error) => { console.error("SOS Geolocation error:", error); showToast('Could not get location. SOS not sent.', 'error'); setIsLoading(false); }, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });
  };

  const handleSaveSettings = (e: React.FormEvent) => { e.preventDefault(); showToast(t.saveSettings + '!', 'success'); if (settings.notificationsEnabled) mockFirestore.subscribeToFCM(FCM_VAPID_KEY); };

  const handleMapClick = (lat: number, lng: number) => { if (currentPage === 'reportIncident') { setReportLocation({ lat, lng }); showToast('New location selected on map.', 'info'); } };

  const handleDeleteReport = (id: string) => { setCurrentIncidents(prev => prev.filter(i => i.id !== id)); showToast(t.reportDeleted, 'info'); };

  // --- UI Components ---
  const Navbar = () => (
    <div className="flex justify-between items-center p-4 bg-gray-900 shadow-lg text-white fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
        <Shield className="w-6 h-6 text-red-400" />
        <span className="text-xl font-bold tracking-wider">{t.appName}</span>
      </div>
      <div className="md:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-full hover:bg-gray-700 transition">
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>
      <nav className="hidden md:flex space-x-6 text-sm font-medium">
        <NavItem page="home" icon={Zap} label={t.home} />
        <NavItem page="reportIncident" icon={MessageSquare} label={t.reportIncident} />
        <NavItem page="alerts" icon={Zap} label={t.alerts} />
        <NavItem page="heatmap" icon={Map} label={t.heatmap} />
        <NavItem page="settings" icon={Settings} label={t.settings} />
        {userId ? (
          <button onClick={mockLogout} className="flex items-center space-x-1 text-red-400 hover:text-red-300 transition">
            <LogOut className="w-4 h-4" />
            <span>{t.logout}</span>
          </button>
        ) : (
          <button onClick={mockAnonLogin} className="flex items-center space-x-1 text-green-400 hover:text-green-300 transition">
            <LogOut className="w-4 h-4 transform rotate-180" />
            <span>{t.login}</span>
          </button>
        )}
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-gray-800 shadow-xl flex flex-col p-4 md:hidden">
          <NavItem page="home" icon={Zap} label={t.home} />
          <NavItem page="reportIncident" icon={MessageSquare} label={t.reportIncident} />
          <NavItem page="alerts" icon={Zap} label={t.alerts} />
          <NavItem page="heatmap" icon={Map} label={t.heatmap} />
          <NavItem page="settings" icon={Settings} label={t.settings} />
          {userId ? (
            <button onClick={mockLogout} className="flex items-center space-x-2 text-red-400 p-2 hover:bg-gray-700 transition rounded-lg w-full text-left">
              <LogOut className="w-5 h-5" />
              <span>{t.logout}</span>
            </button>
          ) : (
            <button onClick={mockAnonLogin} className="flex items-center space-x-2 text-green-400 p-2 hover:bg-gray-700 transition rounded-lg w-full text-left">
              <LogOut className="w-5 h-5 transform rotate-180" />
              <span>{t.login}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );

  const NavItem: React.FC<{ page: string; icon: React.ElementType; label: string }> = ({ page, icon: Icon, label }) => (
    <button
      onClick={() => { setCurrentPage(page); setMenuOpen(false); }}
      className={`flex items-center space-x-1 p-2 rounded-lg transition ${currentPage === page ? 'text-red-400 bg-gray-700' : 'text-gray-300 hover:text-red-400 hover:bg-gray-700'}`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );

  const HomeView = () => (
    <div className="text-center p-6 space-y-8">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl space-y-4">
        <Shield className="w-16 h-16 text-red-400 mx-auto" />
        <h1 className="text-3xl font-extrabold text-white">{t.welcome}</h1>
        <p className="text-gray-400 max-w-lg mx-auto">{t.safetyIsPriority}</p>
      </div>

      <button
        onClick={handleSOS}
        disabled={isLoading || !userId}
        className="w-full max-w-md mx-auto h-40 bg-red-600 hover:bg-red-700 text-white font-black text-3xl rounded-full shadow-red-500/50 shadow-2xl transform active:scale-95 transition duration-150 flex items-center justify-center relative overflow-hidden group disabled:opacity-50"
      >
        <div className="absolute w-full h-full bg-red-800 opacity-20 blur-xl group-hover:opacity-40 transition" />
        {isLoading ? (
          <Loader2 className="w-10 h-10 animate-spin mr-2" />
        ) : (
          <Heart className="w-10 h-10 mr-4 animate-pulse" />
        )}
        {t.sos}
      </button>

      {isAnon && (
        <div className="bg-yellow-900/50 text-yellow-300 p-4 rounded-lg border border-yellow-800 text-sm max-w-md mx-auto">
          {t.anonWarning}
          <button onClick={mockAnonLogin} className="underline ml-2 font-semibold hover:text-yellow-100">{t.login}</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
        <button onClick={() => setCurrentPage('reportIncident')} className="p-4 bg-red-400/20 text-red-300 rounded-xl hover:bg-red-400/30 transition shadow-lg flex flex-col items-center space-y-2">
          <MessageSquare className="w-6 h-6" />
          <span className="font-semibold">{t.reportIncident}</span>
        </button>
        <button onClick={() => setCurrentPage('alerts')} className="p-4 bg-blue-400/20 text-blue-300 rounded-xl hover:bg-blue-400/30 transition shadow-lg flex flex-col items-center space-y-2">
          <Zap className="w-6 h-6" />
          <span className="font-semibold">{t.alerts}</span>
        </button>
      </div>
    </div>
  );

  const ReportIncidentView = () => (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white border-b border-gray-700 pb-2">{t.reportIncident}</h2>

      <form onSubmit={handleReportSubmit} className="space-y-6">
        {/* Type Selection */}
        <div className="space-y-2">
          <label className="block text-gray-300 font-medium">{t.selectIncidentType}</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(['Harassment', 'Suspicious Activity', 'Medical Emergency', 'Other'] as IncidentType[]).map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setReportType(type)}
                className={`py-3 px-2 text-sm font-semibold rounded-lg transition duration-150 ${reportType === type ? 'bg-red-600 text-white shadow-lg shadow-red-500/50' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                {t[type.replace(/\s/g, '').toLowerCase() as keyof typeof t] || type}
              </button>
            ))}
          </div>
        </div>

        {/* Location & Map */}
        <div className="space-y-2">
          <label className="block text-gray-300 font-medium">{t.pinLocation}</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={reportLocation ? `${reportLocation.lat.toFixed(4)}, ${reportLocation.lng.toFixed(4)}` : 'Click Map to Pin or use GPS'}
              readOnly
              className="flex-grow p-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
            />
            <button
              type="button"
              onClick={getCurrentLocation}
              className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center disabled:opacity-50"
              disabled={isLoading}
            >
              <Zap className="w-5 h-5" />
            </button>
          </div>
          <div className="w-full h-64">
            <MapContainer center={reportLocation || INITIAL_CENTER} markers={[]} isHeatmap={false} onMapClick={handleMapClick} />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="description" className="block text-gray-300 font-medium">{t.describeIncident}</label>
          <textarea
            id="description"
            rows={3}
            value={reportDescription}
            onChange={(e) => setReportDescription(e.target.value)}
            maxLength={200}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-red-500 focus:border-red-500 transition"
            placeholder="e.g., A person was following me for three blocks..."
            required
          />
          <span className="text-xs text-gray-500 float-right">{reportDescription.length}/200</span>
        </div>

        {/* Photo Upload (Mock) */}
        <div className="space-y-2 pt-4">
          <label htmlFor="photo" className="block text-gray-300 font-medium">{t.uploadPhoto}</label>
          <input
            type="file"
            id="photo"
            accept="image/*"
            onChange={(e) => setReportPhoto(e.target.files ? e.target.files[0] : null)}
            className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-500 file:text-white hover:file:bg-red-600"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !reportLocation || !reportDescription.trim()}
          className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-200 flex items-center justify-center disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Shield className="w-5 h-5 mr-2" />}
          {t.submitReport}
        </button>
      </form>
    </div>
  );

  const AlertsView = () => (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white border-b border-gray-700 pb-2">{t.incidentsList}</h2>

      <div className="space-y-4">
        {currentIncidents.length === 0 && (
          <div className="text-center p-10 bg-gray-800 rounded-xl text-gray-400">No recent incidents reported. Stay safe!</div>
        )}

        {currentIncidents.sort((a, b) => b.timestamp - a.timestamp).map(incident => (
          <div key={incident.id} className="bg-gray-800 p-4 rounded-lg shadow-lg border-l-4 border-red-500 space-y-2">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold text-white">{t.reportDetail}: {t[incident.type.replace(/\s/g, '').toLowerCase() as keyof typeof t] || incident.type}</h3>
              <button onClick={() => handleDeleteReport(incident.id)} className="text-gray-500 hover:text-red-400 transition" title={t.deleteReport}>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-gray-400 text-sm italic">{incident.description}</p>
            <div className="grid grid-cols-2 text-sm text-gray-500 pt-2 border-t border-gray-700">
              <span className="flex items-center space-x-1">
                <Heart className="w-4 h-4 text-yellow-400" />
                <span>{t.credibility}: <span className="text-yellow-300 font-bold">{incident.credibilityScore.toFixed(1)}</span></span>
              </span>
              <span className="text-right">{new Date(incident.timestamp).toLocaleString(settings.language)}</span>
            </div>
            <p className="text-xs text-gray-600">
              {t.userId}: {incident.userId}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const HeatmapView = () => (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white border-b border-gray-700 pb-2">{t.heatmap}</h2>
      <p className="text-gray-400 text-sm">{t.heatmapDescription}</p>

      <div className="w-full h-[500px] rounded-xl shadow-2xl">
        <MapContainer center={INITIAL_CENTER} markers={currentIncidents} isHeatmap={true} />
      </div>

      <div className="flex justify-center space-x-8 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-600 rounded-full" />
          <span className="text-white">{t.dangerZone}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-600 rounded-full" />
          <span className="text-white">{t.safeZone}</span>
        </div>
      </div>
    </div>
  );

  const SettingsView = () => (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white border-b border-gray-700 pb-2">{t.settings}</h2>

      <form onSubmit={handleSaveSettings} className="space-y-6 bg-gray-800 p-6 rounded-xl shadow-xl">
        <div className="space-y-2">
          <label htmlFor="language" className="block text-gray-300 font-medium">{t.language}</label>
          <select
            id="language"
            value={settings.language}
            onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value as Language }))}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-red-500 focus:border-red-500 transition"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="hi">हिंदी</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
          <label htmlFor="notifications" className="text-gray-300 font-medium">{t.notifications}</label>
          <input
            type="checkbox"
            id="notifications"
            checked={settings.notificationsEnabled}
            onChange={(e) => setSettings(prev => ({ ...prev, notificationsEnabled: e.target.checked }))}
            className="h-6 w-11 rounded-full appearance-none bg-gray-600 checked:bg-red-500 transition duration-200 cursor-pointer relative"
            style={{
              backgroundImage: settings.notificationsEnabled ? 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 20 20\' fill=\'white\'%3E%3Cpath d=\'M10 2a8 8 0 100 16A8 8 0 0010 2zM8.28 13.78a.75.75 0 001.06 0l4-4a.75.75 0 00-1.06-1.06L9 11.44l-2.72-2.72a.75.75 0 00-1.06 1.06l3.25 3.25z\' clip-rule=\'evenodd\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' : 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 20 20\' fill=\'gray\'%3E%3Cpath d=\'M10 2a8 8 0 100 16A8 8 0 0010 2zM6.53 14.53a.75.75 0 011.06 0l6-6a.75.75 0 011.06 1.06L7.59 15.59a.75.75 0 01-1.06 0l-4-4a.75.75 0 011.06-1.06l3.47 3.47z\' clip-rule=\'evenodd\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: settings.notificationsEnabled ? 'right 2px center' : 'left 2px center',
              backgroundSize: '15px',
            }}
          />
        </div>

        <div className="space-y-2 pt-4 border-t border-gray-700">
          <label className="block text-gray-300 font-medium">{t.trustedContacts}</label>
          <div className="bg-gray-700 p-3 rounded-lg text-gray-300 text-sm">
            <p>{t.mockContact1}</p>
            <p>{t.mockContact2}</p>
            <p className="text-xs text-red-400 mt-2">To update, please use the dedicated contact management page (Not implemented in this single-file mock).</p>
          </div>
        </div>

        <div className="pt-4">
          <a href="#" className="text-red-400 hover:underline text-sm block text-center">{t.privacyPolicy}</a>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-200 flex items-center justify-center disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Settings className="w-5 h-5 mr-2" />}
          {t.saveSettings}
        </button>
      </form>
    </div>
  );

  // Route to view
  let PageComponent;
  switch (currentPage) {
    case 'reportIncident': PageComponent = ReportIncidentView; break;
    case 'alerts': PageComponent = AlertsView; break;
    case 'heatmap': PageComponent = HeatmapView; break;
    case 'settings': PageComponent = SettingsView; break;
    case 'home':
    default: PageComponent = HomeView; break;
  }

  return (
    <div className="min-h-screen bg-gray-900 font-sans antialiased text-white">
      {/* Tailwind CDN fallback: remove if using compiled CSS */}
      <script src="https://cdn.tailwindcss.com"></script>

      {/* Inter font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap'); body { font-family: 'Inter', sans-serif; }`}</style>

      {/* Navbar */}
      <Navbar />

      {/* Main */}
      <main className="pt-20 pb-8">
        <PageComponent />
      </main>

      {/* Fixed SOS Button */}
      {userId && (
        <button
          onClick={handleSOS}
          disabled={isLoading}
          className="fixed bottom-6 right-6 w-16 h-16 bg-red-700 rounded-full shadow-2xl shadow-red-500/80 flex items-center justify-center border-4 border-red-900 z-50 transform hover:scale-110 active:scale-95 transition duration-150 disabled:opacity-50"
          title={t.sos}
        >
          {isLoading ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Zap className="w-7 h-7 text-white animate-pulse" />}
        </button>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-2xl text-white z-[60] transition-opacity duration-300 ${toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-600' : toast.type === 'alert' ? 'bg-yellow-600 animate-bounce' : 'bg-blue-600'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default App;

// Required for Google Maps API to be available globally in the component
declare global {
  interface Window {
    google: any;
  }
}
