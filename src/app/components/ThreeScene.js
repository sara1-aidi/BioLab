// components/ThreeScene.js
"use client";
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeScene({ particleCount = 200, particleSize = 0.1 }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true
    });

    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // Geometric Particles
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];

    for(let i = 0; i < particleCount; i++) {
      positions.push(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      
      colors.push(
        0.4 + Math.random() * 0.6, // R
        0.6 + Math.random() * 0.4, // G
        0.8 + Math.random() * 0.2  // B
      );
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: particleSize,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 15;

    // Animation
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      particles.rotation.x += 0.001;
      particles.rotation.y += 0.002;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      mount.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
    };
  }, [particleCount, particleSize]);

  return <div ref={mountRef} className="absolute inset-0" />;
}