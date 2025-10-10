import "./App.css";
import TestPage from "./pages/TestPage";
import LandingPage from "./pages/LandingPage";

export default function App() {
  if (typeof window !== "undefined") {
    if (window.location.pathname === "/test") return <TestPage />;
    if (window.location.pathname === "/") return <LandingPage />;
  }

  return (
    <div className="container p-8">
      <h2 className="text-xl font-semibold">EqualPass</h2>
      <p className="text-sm text-slate-600">Open <a className="underline" href="/test">/test</a> to see the demo or visit the root / to see the landing page.</p>
    </div>
  );
}
