import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface SinglePlaneVisualizationProps {
  data: Array<{ name: string; x: number; y: number; z: number }>;
  xAxis: 'x' | 'y' | 'z';
  yAxis: 'x' | 'y' | 'z';
}

const SinglePlaneVisualization: React.FC<SinglePlaneVisualizationProps> = ({ data, xAxis, yAxis }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = 180;
    const height = 180;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Create a plane
    const planeGeometry = new THREE.PlaneGeometry(2, 2);
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(plane);

    // Add points
    const pointsGeometry = new THREE.BufferGeometry();
    const pointsMaterial = new THREE.PointsMaterial({ color: 0xff0000, size: 0.05 });

    const positions = data.map(point => [
      (point[xAxis] - 0.5) * 2,
      (point[yAxis] - 0.5) * 2,
      0
    ]).flat();

    pointsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(points);

    // Position camera
    camera.position.z = 3;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      plane.rotation.x += 0.01;
      plane.rotation.y += 0.01;
      points.rotation.x += 0.01;
      points.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [data, xAxis, yAxis]);

  return <div ref={mountRef} />;
};

export default SinglePlaneVisualization;