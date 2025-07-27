import { StudioProject } from "../types/studio";
import * as THREE from "three";

export async function saveProject(project: StudioProject): Promise<void> {
  try {
    const projectData = JSON.stringify(project, null, 2);
    const blob = new Blob([projectData], { type: 'application/json' });
    
    // Use the modern File System Access API if available, fallback to download
    if ('showSaveFilePicker' in window) {
      try {
        const fileHandle = await (window as any).showSaveFilePicker({
          suggestedName: `${project.name.replace(/[^a-z0-9]/gi, '_')}.json`,
          types: [{
            description: 'Studio Project Files',
            accept: { 'application/json': ['.json'] }
          }]
        });
        
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
        
        console.log('Project saved to device successfully');
        return;
      } catch (err) {
        // User cancelled or API not supported, fall back to download
      }
    }
    
    // Fallback to download method
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.replace(/[^a-z0-9]/gi, '_')}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    console.log('Project saved to Downloads folder successfully');
  } catch (error) {
    console.error('Failed to save project:', error);
    throw error;
  }
}

export async function loadProject(file: File): Promise<StudioProject | null> {
  try {
    const text = await file.text();
    const project: StudioProject = JSON.parse(text);
    
    // Validate the project structure
    if (!project.name || !Array.isArray(project.objects)) {
      throw new Error('Invalid project file format');
    }
    
    // Restore Vector3 and Euler objects from plain objects
    project.objects = project.objects.map(obj => ({
      ...obj,
      position: new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z),
      rotation: new THREE.Euler(obj.rotation.x, obj.rotation.y, obj.rotation.z),
      scale: new THREE.Vector3(obj.scale.x, obj.scale.y, obj.scale.z),
    }));
    
    console.log('Project loaded successfully');
    return project;
  } catch (error) {
    console.error('Failed to load project:', error);
    alert('Failed to load project file. Please check the file format.');
    return null;
  }
}

export function createNewProject(name: string = "New Project"): StudioProject {
  return {
    name,
    objects: [
      {
        id: 'workspace',
        name: 'Workspace',
        type: 'Part',
        position: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Euler(0, 0, 0),
        scale: new THREE.Vector3(1, 1, 1),
        color: '#ffffff',
        material: 'Plastic',
        shape: 'Block',
        properties: {},
        children: [],
        visible: true,
        locked: false,
        canCollide: false,
        anchored: true,
        transparency: 1,
      }
    ],
    scripts: {},
    settings: {
      lighting: {
        ambient: '#404040',
        brightness: 1,
        outdoor: 0.5,
      },
      workspace: {
        gravity: 196.2,
        filteringEnabled: false,
      },
    },
    lastModified: new Date(),
  };
}
