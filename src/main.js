import './style.css'
import * as THREE from 'three'

// --- Three.js Background Animation Setup ---
const container = document.getElementById('canvas-container');

// Scene setup
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 30;

// Renderer setup
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Create Web3/Blockchain looking nodes and connections
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 200;

const posArray = new Float32Array(particlesCount * 3);
const colorsArray = new Float32Array(particlesCount * 3);

const color1 = new THREE.Color('#ff7b00');
const color2 = new THREE.Color('#ff3a00');

for(let i = 0; i < particlesCount * 3; i+=3) {
    // Spread particles over a large area
    posArray[i] = (Math.random() - 0.5) * 100;
    posArray[i+1] = (Math.random() - 0.5) * 100;
    posArray[i+2] = (Math.random() - 0.5) * 100;

    // Mix colors
    const mixedColor = color1.clone().lerp(color2, Math.random());
    colorsArray[i] = mixedColor.r;
    colorsArray[i+1] = mixedColor.g;
    colorsArray[i+2] = mixedColor.b;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

// Points material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Add lines connecting close particles to simulate a network
const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xff3a00,
    transparent: true,
    opacity: 0.15
});

// We'll update lines in the render loop for dynamic effect, 
// but for performance, let's just create a static wireframe sphere as a core element.

const coreGeometry = new THREE.IcosahedronGeometry(15, 2);
const coreMaterial = new THREE.MeshBasicMaterial({
    color: 0xff7b00,
    wireframe: true,
    transparent: true,
    opacity: 0.1
});
const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
scene.add(coreMesh);


// Mouse Interaction
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) - 0.5;
    mouseY = (event.clientY / window.innerHeight) - 0.5;
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Rotate particles
    particlesMesh.rotation.y = elapsedTime * 0.05;
    particlesMesh.rotation.x = elapsedTime * 0.02;

    // Rotate core
    coreMesh.rotation.y = elapsedTime * 0.1;
    coreMesh.rotation.z = elapsedTime * 0.05;

    // Mouse parallax effect
    camera.position.x += (mouseX * 10 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 10 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

animate();

// Handle Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
