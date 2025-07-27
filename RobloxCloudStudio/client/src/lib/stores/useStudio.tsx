import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { Tool, ViewportCamera } from "../../types/studio";
import * as THREE from "three";

interface StudioState {
  // UI State
  selectedTool: Tool | null;
  showExplorer: boolean;
  showProperties: boolean;
  showScriptEditor: boolean;
  
  // Selection
  selectedObjectId: string | null;
  
  // Camera
  camera: ViewportCamera;
  
  // Project
  projectName: string;
  isDirty: boolean;
  
  // Actions
  setSelectedTool: (tool: Tool | null) => void;
  setSelectedObject: (id: string | null) => void;
  toggleExplorer: () => void;
  toggleProperties: () => void;
  toggleScriptEditor: () => void;
  setCameraPosition: (position: THREE.Vector3, target: THREE.Vector3) => void;
  setProjectName: (name: string) => void;
  markDirty: () => void;
  markClean: () => void;
}

const defaultTools: Tool[] = [
  { id: 'select', name: 'Select', icon: '🖱️', type: 'select', active: true },
  { id: 'move', name: 'Move', icon: '🔄', type: 'move', active: false },
  { id: 'rotate', name: 'Rotate', icon: '🔃', type: 'rotate', active: false },
  { id: 'scale', name: 'Scale', icon: '📏', type: 'scale', active: false },
];

export const useStudio = create<StudioState>()(
  subscribeWithSelector((set, get) => ({
    selectedTool: defaultTools[0],
    showExplorer: true,
    showProperties: true,
    showScriptEditor: false,
    selectedObjectId: null,
    camera: {
      position: new THREE.Vector3(10, 10, 10),
      target: new THREE.Vector3(0, 0, 0),
      zoom: 1,
    },
    projectName: "Untitled Project",
    isDirty: false,
    
    setSelectedTool: (tool) => set({ selectedTool: tool }),
    setSelectedObject: (id) => set({ selectedObjectId: id }),
    toggleExplorer: () => set((state) => ({ showExplorer: !state.showExplorer })),
    toggleProperties: () => set((state) => ({ showProperties: !state.showProperties })),
    toggleScriptEditor: () => set((state) => ({ showScriptEditor: !state.showScriptEditor })),
    setCameraPosition: (position, target) => set({
      camera: { ...get().camera, position, target }
    }),
    setProjectName: (name) => {
      set({ projectName: name });
      get().markDirty();
    },
    markDirty: () => set({ isDirty: true }),
    markClean: () => set({ isDirty: false }),
  }))
);
