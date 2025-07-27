import { useStudio } from "../../lib/stores/useStudio";
import { useObjects } from "../../lib/stores/useObjects";
import { exportRBLX } from "../../lib/rblxExporter";
import { saveProject, loadProject } from "../../lib/projectManager";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import * as THREE from "three";

export function Toolbar() {
  const { 
    selectedTool, 
    setSelectedTool, 
    toggleExplorer, 
    toggleProperties, 
    toggleScriptEditor,
    projectName,
    setProjectName,
    isDirty,
    markClean
  } = useStudio();
  
  const { addObject, objects, clearAll, loadObjects } = useObjects();

  const tools = [
    { id: 'select', name: 'Select', icon: '🖱️', type: 'select' as const, active: false },
    { id: 'move', name: 'Move', icon: '🔄', type: 'move' as const, active: false },
    { id: 'rotate', name: 'Rotate', icon: '🔃', type: 'rotate' as const, active: false },
    { id: 'scale', name: 'Scale', icon: '📏', type: 'scale' as const, active: false },
  ];

  const insertPart = (shape: 'Block' | 'Ball' | 'Cylinder') => {
    addObject({
      name: `${shape}`,
      type: 'Part',
      shape,
      parent: 'workspace',
      position: new THREE.Vector3(0, 5, 0),
      rotation: new THREE.Euler(0, 0, 0),
      scale: new THREE.Vector3(2, 2, 2),
      color: '#a0a0a0',
      material: 'Plastic',
      properties: {},
      children: [],
      visible: true,
      locked: false,
      canCollide: true,
      anchored: false,
      transparency: 0,
    });
  };

  const handleSave = async () => {
    try {
      await saveProject({
        name: projectName,
        objects,
        scripts: {},
        settings: {
          lighting: { ambient: '#404040', brightness: 1, outdoor: 0.5 },
          workspace: { gravity: 196.2, filteringEnabled: false }
        },
        lastModified: new Date()
      });
      markClean();
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  const handleLoad = async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const project = await loadProject(file);
          if (project) {
            loadObjects(project.objects);
            setProjectName(project.name);
            markClean();
          }
        }
      };
      input.click();
    } catch (error) {
      console.error('Failed to load project:', error);
    }
  };

  const handleExport = async () => {
    try {
      await exportRBLX({
        name: projectName,
        objects,
        scripts: {},
        settings: {
          lighting: { ambient: '#404040', brightness: 1, outdoor: 0.5 },
          workspace: { gravity: 196.2, filteringEnabled: false }
        },
        lastModified: new Date()
      });
    } catch (error) {
      console.error('Failed to export RBLX:', error);
    }
  };

  return (
    <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center px-4 gap-2">
      {/* File Menu */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => clearAll()}>
          New
        </Button>
        <Button variant="ghost" size="sm" onClick={handleLoad}>
          Open
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleSave}
          className={isDirty ? "text-blue-400" : ""}
          title="Save project to device"
        >
          💾 Save {isDirty && "*"}
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleExport}
          title="Export as RBLX file for Roblox Studio"
        >
          📤 Export RBLX
        </Button>
      </div>
      
      <Separator orientation="vertical" className="h-6" />
      
      {/* Tools */}
      <div className="flex items-center gap-1">
        {tools.map(tool => (
          <Button
            key={tool.id}
            variant={selectedTool?.id === tool.id ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedTool(tool)}
            title={tool.name}
          >
            {tool.icon}
          </Button>
        ))}
      </div>
      
      <Separator orientation="vertical" className="h-6" />
      
      {/* Insert Objects */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" onClick={() => insertPart('Block')}>
          📦 Part
        </Button>
        <Button variant="ghost" size="sm" onClick={() => insertPart('Ball')}>
          ⚽ Ball
        </Button>
        <Button variant="ghost" size="sm" onClick={() => insertPart('Cylinder')}>
          🔧 Cylinder
        </Button>
      </div>
      
      <Separator orientation="vertical" className="h-6" />
      
      {/* Project Name */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400">Project:</span>
        <Input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="w-48 h-8 bg-gray-700 border-gray-600 text-white"
        />
      </div>
      
      <div className="flex-1" />
      
      {/* View Toggles */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" onClick={toggleExplorer}>
          📁 Explorer
        </Button>
        <Button variant="ghost" size="sm" onClick={toggleProperties}>
          🔧 Properties
        </Button>
        <Button variant="ghost" size="sm" onClick={toggleScriptEditor}>
          📝 Script
        </Button>
      </div>
    </div>
  );
}
