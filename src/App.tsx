import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import IdeaInput from "@/pages/IdeaInput";
import DesignStudio from "@/pages/DesignStudio";
import CodeWorkspace from "@/pages/CodeWorkspace";
import TestingCenter from "@/pages/TestingCenter";
import PerformanceMonitor from "@/pages/PerformanceMonitor";
import PitchGenerator from "@/pages/PitchGenerator";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/idea-input" element={<IdeaInput />} />
        <Route path="/design-studio" element={<DesignStudio />} />
        <Route path="/code-workspace" element={<CodeWorkspace />} />
        <Route path="/testing-center" element={<TestingCenter />} />
        <Route path="/performance-monitor" element={<PerformanceMonitor />} />
        <Route path="/pitch-generator" element={<PitchGenerator />} />
      </Routes>
    </Router>
  );
}
