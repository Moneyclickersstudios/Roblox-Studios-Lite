import { Canvas } from "@react-three/fiber";
import { Toolbar } from "./Toolbar";
import { Explorer } from "./Explorer";
import { Properties } from "./Properties";
import { ScriptEditor } from "./ScriptEditor";
import { Viewport3D } from "./Viewport3D";
import { useStudio } from "../../lib/stores/useStudio";

export function StudioInterface() {
  const { showExplorer, showProperties, showScriptEditor } = useStudio();

  return (
    <div className="w-full h-full flex flex-col bg-gray-800">
      {/* Top Toolbar */}
      <Toolbar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Explorer */}
        {showExplorer && (
          <div className="w-64 bg-gray-900 border-r border-gray-700 flex flex-col">
            <Explorer />
          </div>
        )}
        
        {/* Center - 3D Viewport */}
        <div className="flex-1 relative">
          <Canvas
            shadows
            camera={{
              position: [10, 10, 10],
              fov: 45,
              near: 0.1,
              far: 1000
            }}
            gl={{
              antialias: true,
              powerPreference: "high-performance"
            }}
            style={{ background: '#3a3a3a' }}
          >
            <Viewport3D />
          </Canvas>
        </div>
        
        {/* Right Panel - Properties */}
        {showProperties && (
          <div className="w-64 bg-gray-900 border-l border-gray-700 flex flex-col">
            <Properties />
          </div>
        )}
      </div>
      
      {/* Bottom Panel - Script Editor */}
      {showScriptEditor && (
        <div className="h-64 bg-gray-900 border-t border-gray-700">
          <ScriptEditor />
        </div>
      )}
    </div>
  );
}
