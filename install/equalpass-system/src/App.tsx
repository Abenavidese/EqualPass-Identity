import { BrowserRouter, Routes } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"
// import LandingPage from "@/pages/landing-page"
// // import DemoPage from "@/pages/testno"
// import VerifierPage from "@/pages/verifier-page"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<LandingPage />} />
        {/* <Route path="/testno" element={<DemoPage />} /> */}
        {/* <Route path="/verifier" element={<VerifierPage />} /> */} 
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
