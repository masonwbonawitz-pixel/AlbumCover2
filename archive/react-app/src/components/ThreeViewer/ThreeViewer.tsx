import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useImageContext } from '../../context/ImageContext';
import './ThreeViewer.css';

interface ThreeViewerProps {
  stlUrl: string;
  onBack: () => void;
}

const ThreeViewer: React.FC<ThreeViewerProps> = ({ stlUrl, onBack }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { imageData, gridSize } = useImageContext();
  const sceneRef = useRef<THREE.Scene | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    if (!containerRef.current || !stlUrl || !imageData) return;

    // Setup scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.offsetWidth / containerRef.current.offsetHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      containerRef.current.offsetWidth,
      containerRef.current.offsetHeight
    );
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Load STL
    const loader = new STLLoader();
    loader.load(stlUrl, (geometry) => {
      // Apply colors from image
      applyColorsToMesh(geometry, imageData, gridSize);
      
      const material = new THREE.MeshStandardMaterial({
        vertexColors: true,
        flatShading: true
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Center camera
      geometry.computeBoundingBox();
      const box = geometry.boundingBox;
      if (box) {
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        cameraZ *= 1.5; // Add some padding
        camera.position.set(center.x, center.y, center.z + cameraZ);
        controls.target.copy(center);
        controls.update();
      }
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      camera.aspect = containerRef.current.offsetWidth / containerRef.current.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        containerRef.current.offsetWidth,
        containerRef.current.offsetHeight
      );
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current && containerRef.current) {
        try {
          containerRef.current.removeChild(rendererRef.current.domElement);
        } catch (e) {
          // Element may already be removed
        }
        rendererRef.current.dispose();
      }
    };
  }, [stlUrl, imageData, gridSize]);

  const applyColorsToMesh = (geometry: THREE.BufferGeometry, imageData: ImageData, gridSize: number) => {
    const positions = geometry.attributes.position;
    const count = positions.count;
    const colors: number[] = [];

    // Get image data
    const imgData = imageData.data;
    const imgWidth = imageData.width;
    const imgHeight = imageData.height;

    // Calculate bounds
    const positionsArray = positions.array as Float32Array;
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    
    for (let i = 0; i < positionsArray.length; i += 3) {
      minX = Math.min(minX, positionsArray[i]);
      maxX = Math.max(maxX, positionsArray[i]);
      minY = Math.min(minY, positionsArray[i + 1]);
      maxY = Math.max(maxY, positionsArray[i + 1]);
    }

    // Map each vertex to image pixel
    for (let i = 0; i < count; i++) {
      const x = positionsArray[i * 3];
      const y = positionsArray[i * 3 + 1];
      
      // Map to image coordinates
      const pixelX = Math.floor(((x - minX) / (maxX - minX)) * imgWidth);
      const pixelY = Math.floor((1 - (y - minY) / (maxY - minY)) * imgHeight);
      
      const px = Math.max(0, Math.min(imgWidth - 1, pixelX));
      const py = Math.max(0, Math.min(imgHeight - 1, pixelY));
      
      const pixelIndex = (py * imgWidth + px) * 4;
      const r = imgData[pixelIndex] / 255;
      const g = imgData[pixelIndex + 1] / 255;
      const b = imgData[pixelIndex + 2] / 255;
      
      colors.push(r, g, b);
    }

    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  };

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="three-viewer-container" ref={containerRef}>
      <div className="viewer-controls">
        <button className="viewer-btn" onClick={onBack}>
          Back to Editor
        </button>
        <button className="viewer-btn" onClick={handleResetCamera}>
          Reset Camera
        </button>
      </div>
    </div>
  );
};

export default ThreeViewer;

