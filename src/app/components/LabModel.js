// components/LabModel.js
"use client";
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export default function LabModel() {
  const groupRef = useRef();
  const { scene } = useGLTF('/models/lab_equipment.glb');

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]} scale={0.8}>
      <primitive object={scene} />
    </group>
  );
}