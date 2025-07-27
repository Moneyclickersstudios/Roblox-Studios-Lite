import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { GameObject } from "../../types/studio";
import * as THREE from "three";

interface ObjectsState {
  objects: GameObject[];
  
  // Actions
  addObject: (object: Omit<GameObject, 'id'>) => string;
  removeObject: (id: string) => void;
  updateObject: (id: string, updates: Partial<GameObject>) => void;
  getObject: (id: string) => GameObject | undefined;
  getObjectsByParent: (parentId?: string) => GameObject[];
  duplicateObject: (id: string) => string | null;
  clearAll: () => void;
  loadObjects: (objects: GameObject[]) => void;
}

let objectCounter = 1;

const createDefaultObject = (type: GameObject['type'], name: string): Omit<GameObject, 'id'> => ({
  name,
  type,
  position: new THREE.Vector3(0, 0, 0),
  rotation: new THREE.Euler(0, 0, 0),
  scale: new THREE.Vector3(1, 1, 1),
  color: '#a0a0a0',
  material: 'Plastic',
  shape: 'Block',
  properties: {},
  children: [],
  visible: true,
  locked: false,
  canCollide: true,
  anchored: false,
  transparency: 0,
});

export const useObjects = create<ObjectsState>()(
  subscribeWithSelector((set, get) => ({
    objects: [
      // Default workspace objects
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
      },
      {
        id: 'spawn-location',
        name: 'SpawnLocation',
        type: 'SpawnLocation',
        position: new THREE.Vector3(0, 0.5, 0),
        rotation: new THREE.Euler(0, 0, 0),
        scale: new THREE.Vector3(4, 1, 4),
        color: '#00ff00',
        material: 'Neon',
        shape: 'Block',
        properties: { Duration: 10, Enabled: true },
        children: [],
        parent: 'workspace',
        visible: true,
        locked: false,
        canCollide: true,
        anchored: true,
        transparency: 0.5,
      },
    ],
    
    addObject: (objectData) => {
      const id = `object_${objectCounter++}`;
      const newObject: GameObject = {
        id,
        ...createDefaultObject(objectData.type, objectData.name),
        ...objectData,
      };
      
      set((state) => ({
        objects: [...state.objects, newObject]
      }));
      
      return id;
    },
    
    removeObject: (id) => {
      set((state) => ({
        objects: state.objects.filter(obj => obj.id !== id && obj.parent !== id)
      }));
    },
    
    updateObject: (id, updates) => {
      set((state) => ({
        objects: state.objects.map(obj => 
          obj.id === id ? { ...obj, ...updates } : obj
        )
      }));
    },
    
    getObject: (id) => {
      return get().objects.find(obj => obj.id === id);
    },
    
    getObjectsByParent: (parentId) => {
      return get().objects.filter(obj => obj.parent === parentId);
    },
    
    duplicateObject: (id) => {
      const original = get().getObject(id);
      if (!original) return null;
      
      const newId = get().addObject({
        ...original,
        name: `${original.name} (Copy)`,
        position: new THREE.Vector3(
          original.position.x + 2,
          original.position.y,
          original.position.z
        ),
      });
      
      return newId;
    },
    
    clearAll: () => {
      set(() => ({
        objects: [get().objects.find(obj => obj.id === 'workspace')!]
      }));
    },
    
    loadObjects: (objects) => {
      set({ objects });
    },
  }))
);
