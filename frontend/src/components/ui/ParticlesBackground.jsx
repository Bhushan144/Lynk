import { useEffect, useRef } from "react";
import * as THREE from "three";

const ParticlesBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            canvas: canvasRef.current, 
            alpha: true,
            antialias: true 
        });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        camera.position.z = 5;

        // --- Particles ---
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 1500;
        const posArray = new Float32Array(particlesCount * 3);
        const colorArray = new Float32Array(particlesCount * 3);

        for(let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 10;
        }

        for(let i = 0; i < particlesCount; i++) {
            const t = Math.random();
            const brightness = 0.6 + t * 0.4;
            colorArray[i * 3] = brightness;
            colorArray[i * 3 + 1] = brightness;
            colorArray[i * 3 + 2] = brightness;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.015,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // --- Wave ---
        const waveGeometry = new THREE.PlaneGeometry(15, 15, 50, 50);
        const waveMaterial = new THREE.MeshBasicMaterial({
            color: 0xcccccc, 
            wireframe: true,
            transparent: true,
            opacity: 0.15
        });
        const wave = new THREE.Mesh(waveGeometry, waveMaterial);
        wave.rotation.x = -Math.PI / 3;
        wave.position.z = -3;
        scene.add(wave);

        // --- Animation Loop ---
        let mouseX = 0;
        let mouseY = 0;

        const handleMouseMove = (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        };

        window.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
            requestAnimationFrame(animate);

            particlesMesh.rotation.y += 0.001;
            particlesMesh.rotation.x += 0.0005;

            const positions = wave.geometry.attributes.position;
            const time = Date.now() * 0.001;
            
            for(let i = 0; i < positions.count; i++) {
                const x = positions.getX(i);
                const y = positions.getY(i);
                const wave1 = Math.sin(x + time) * 0.3;
                const wave2 = Math.sin(y + time * 0.5) * 0.3;
                positions.setZ(i, wave1 + wave2);
            }
            positions.needsUpdate = true;

            camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
            camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
            particlesGeometry.dispose();
            particlesMaterial.dispose();
            waveGeometry.dispose();
            waveMaterial.dispose();
        };
    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full"
            style={{ background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d2d2d 100%)' }}
        />
    );
};

export default ParticlesBackground;