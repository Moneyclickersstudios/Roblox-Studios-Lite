import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Grid, GizmoHelper, GizmoViewport } from "@react-three/drei";
import { useObjects } from "../../lib/stores/useObjects";
import { useStudio } from "../../lib/stores/useStudio";
import { ObjectManipulator } from "./ObjectManipulator";
import * as THREE from "three";

function SceneObject({ object }: { object: any }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { selectedObjectId, setSelectedObject } = useStudio();
  
  // Update object properties when they change
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.copy(object.position);
      meshRef.current.rotation.copy(object.rotation);
      meshRef.current.scale.copy(object.scale);
      meshRef.current.visible = object.visible;
      
      // Update material color and properties
      if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
        meshRef.current.material.color.setStyle(object.color);
        meshRef.current.material.transparent = object.transparency > 0;
        meshRef.current.material.opacity = 1 - object.transparency;
        
        // Set material properties based on type
        switch (object.material) {
          case 'Metal':
            meshRef.current.material.metalness = 0.8;
            meshRef.current.material.roughness = 0.2;
            break;
          case 'Neon':
            meshRef.current.material.emissive.setStyle(object.color);
            meshRef.current.material.emissiveIntensity = 0.5;
            break;
          case 'Glass':
            meshRef.current.material.transparent = true;
            meshRef.current.material.opacity = 0.3;
            break;
          default:
            meshRef.current.material.metalness = 0;
            meshRef.current.material.roughness = 0.8;
            meshRef.current.material.emissive.setHex(0x000000);
        }
      }
    }
  }, [object]);

  const getGeometry = () => {
    switch (object.shape) {
      case 'Ball':
        return <sphereGeometry args={[1, 32, 32]} />;
      case 'Cylinder':
        return <cylinderGeometry args={[1, 1, 1, 32]} />;
      case 'Wedge':
        // Simple wedge using a custom geometry
        const wedgeGeometry = new THREE.ConeGeometry(1, 1, 4);
        return <primitive object={wedgeGeometry} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    setSelectedObject(object.id);
  };

  if (object.id === 'workspace') return null;

  const isSelected = selectedObjectId === object.id;

  return (
    <group>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        position={[object.position.x, object.position.y, object.position.z]}
        rotation={[object.rotation.x, object.rotation.y, object.rotation.z]}
        scale={[object.scale.x, object.scale.y, object.scale.z]}
        visible={object.visible}
      >
        {getGeometry()}
        <meshStandardMaterial
          color={object.color}
          transparent={object.transparency > 0}
          opacity={1 - object.transparency}
        />
      </mesh>
      
      {isSelected && (
        <mesh
          position={[object.position.x, object.position.y, object.position.z]}
          rotation={[object.rotation.x, object.rotation.y, object.rotation.z]}
          scale={[object.scale.x * 1.05, object.scale.y * 1.05, object.scale.z * 1.05]}
        >
          {getGeometry()}
          <meshBasicMaterial
            color="#00aaff"
            wireframe
            transparent
            opacity={0.5}
          />
        </mesh>
      )}
    </group>
  );
}

export function Viewport3D() {
  const { objects } = useObjects();
  const { setSelectedObject } = useStudio();

  const handleBackgroundClick = () => {
    setSelectedObject(null);
  };

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Ground Grid */}
      <Grid
        position={[0, 0, 0]}
        args={[100, 100]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#444444"
        sectionSize={10}
        sectionThickness={1}
        sectionColor="#666666"
        fadeDistance={50}
        fadeStrength={1}
        infiniteGrid
      />
      
      {/* Invisible ground plane for click detection */}
      <mesh
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={handleBackgroundClick}
      >
        <planeGeometry args={[1000, 1000]} />
        <meshBasicMaterial visible={false} />
      </mesh>
      
      {/* Render all objects */}
      {objects.map(object => (
        <SceneObject key={object.id} object={object} />
      ))}
      
      {/* Object manipulation controls */}
      <ObjectManipulator />
      
      {/* Camera controls */}
      <OrbitControls
        makeDefault
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={1}
        maxDistance={100}
        target={[0, 0, 0]}
      />
      
      {/* Gizmo */}
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewport
          axisColors={['#ff4444', '#44ff44', '#4444ff']}
          labelColor="white"
        />
      </GizmoHelper>
    </>
  );
}
