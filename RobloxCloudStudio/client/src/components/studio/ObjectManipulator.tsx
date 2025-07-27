import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useObjects } from "../../lib/stores/useObjects";
import { useStudio } from "../../lib/stores/useStudio";
import * as THREE from "three";

export function ObjectManipulator() {
  const { selectedObjectId, selectedTool } = useStudio();
  const { getObject, updateObject } = useObjects();
  const { camera, gl } = useThree();
  
  const manipulatorRef = useRef<THREE.Group>(null);
  const isDragging = useRef(false);
  const startPosition = useRef(new THREE.Vector3());
  const startRotation = useRef(new THREE.Euler());
  const startScale = useRef(new THREE.Vector3());
  
  const selectedObject = selectedObjectId ? getObject(selectedObjectId) : null;

  useEffect(() => {
    if (!selectedObject || !manipulatorRef.current) return;
    
    // Position the manipulator at the selected object
    manipulatorRef.current.position.copy(selectedObject.position);
    manipulatorRef.current.rotation.copy(selectedObject.rotation);
  }, [selectedObject]);

  const handlePointerDown = (axis: 'x' | 'y' | 'z') => (e: any) => {
    e.stopPropagation();
    isDragging.current = true;
    
    if (selectedObject) {
      startPosition.current.copy(selectedObject.position);
      startRotation.current.copy(selectedObject.rotation);
      startScale.current.copy(selectedObject.scale);
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  useFrame((state) => {
    if (!isDragging.current || !selectedObject) return;
    
    // Simple drag logic - this would need more sophisticated implementation
    // for proper 3D manipulation in a real application
  });

  if (!selectedObject || !selectedTool || selectedTool.type === 'select') {
    return null;
  }

  const createArrow = (color: string, position: [number, number, number], rotation: [number, number, number]) => (
    <group position={position} rotation={rotation}>
      <mesh onPointerDown={handlePointerDown('x')} onPointerUp={handlePointerUp}>
        <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.6, 0]} onPointerDown={handlePointerDown('x')} onPointerUp={handlePointerUp}>
        <coneGeometry args={[0.1, 0.2, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );

  const createRotationRing = (color: string, rotation: [number, number, number]) => (
    <mesh rotation={rotation} onPointerDown={handlePointerDown('x')} onPointerUp={handlePointerUp}>
      <torusGeometry args={[1.2, 0.03, 8, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} />
    </mesh>
  );

  const createScaleCube = (color: string, position: [number, number, number]) => (
    <mesh position={position} onPointerDown={handlePointerDown('x')} onPointerUp={handlePointerUp}>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );

  return (
    <group ref={manipulatorRef}>
      {selectedTool.type === 'move' && (
        <group>
          {createArrow('#ff4444', [0, 0, 0], [0, 0, -Math.PI / 2])} {/* X axis - Red */}
          {createArrow('#44ff44', [0, 0, 0], [0, 0, 0])} {/* Y axis - Green */}
          {createArrow('#4444ff', [0, 0, 0], [Math.PI / 2, 0, 0])} {/* Z axis - Blue */}
        </group>
      )}
      
      {selectedTool.type === 'rotate' && (
        <group>
          {createRotationRing('#ff4444', [0, Math.PI / 2, 0])} {/* X rotation - Red */}
          {createRotationRing('#44ff44', [Math.PI / 2, 0, 0])} {/* Y rotation - Green */}
          {createRotationRing('#4444ff', [0, 0, 0])} {/* Z rotation - Blue */}
        </group>
      )}
      
      {selectedTool.type === 'scale' && (
        <group>
          {createArrow('#ff4444', [0, 0, 0], [0, 0, -Math.PI / 2])} {/* X axis - Red */}
          {createArrow('#44ff44', [0, 0, 0], [0, 0, 0])} {/* Y axis - Green */}
          {createArrow('#4444ff', [0, 0, 0], [Math.PI / 2, 0, 0])} {/* Z axis - Blue */}
          {createScaleCube('#ffff44', [1, 0, 0])} {/* X scale handle */}
          {createScaleCube('#ffff44', [0, 1, 0])} {/* Y scale handle */}
          {createScaleCube('#ffff44', [0, 0, 1])} {/* Z scale handle */}
        </group>
      )}
    </group>
  );
}
