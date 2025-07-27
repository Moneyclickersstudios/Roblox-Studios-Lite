import * as THREE from "three";

export interface GameObject {
  id: string;
  name: string;
  type: 'Part' | 'SpawnLocation' | 'Script' | 'LocalScript' | 'Camera' | 'Light';
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
  color: string;
  material: string;
  shape: 'Block' | 'Ball' | 'Cylinder' | 'Wedge';
  properties: Record<string, any>;
  children: GameObject[];
  parent?: string;
  script?: string;
  mesh?: THREE.Mesh;
  visible: boolean;
  locked: boolean;
  canCollide: boolean;
  anchored: boolean;
  transparency: number;
}

export interface StudioProject {
  name: string;
  objects: GameObject[];
  scripts: Record<string, string>;
  settings: ProjectSettings;
  lastModified: Date;
}

export interface ProjectSettings {
  lighting: {
    ambient: string;
    brightness: number;
    outdoor: number;
  };
  workspace: {
    gravity: number;
    filteringEnabled: boolean;
  };
}

export interface Tool {
  id: string;
  name: string;
  icon: string;
  type: 'select' | 'move' | 'rotate' | 'scale' | 'insert';
  active: boolean;
}

export interface ViewportCamera {
  position: THREE.Vector3;
  target: THREE.Vector3;
  zoom: number;
}
