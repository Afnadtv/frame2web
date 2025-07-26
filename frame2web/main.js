// This code will run after the HTML and all external libraries are fully loaded.
gsap.registerPlugin(ScrollTrigger);

// --- Scene Setup ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#webgl-canvas'), antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ReinhardToneMapping;

// --- Post-processing ---
const renderScene = new THREE.RenderPass(scene, camera);
const bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
const composer = new THREE.EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

// --- 3D Objects ---
const particleCount = 5000;
const positions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
}
const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particlesMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.02, sizeAttenuation: true, transparent: true, opacity: 0.5 });
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

const icosahedronGeometry = new THREE.IcosahedronGeometry(1.2, 1);
const wireframeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffff, wireframe: true, emissive: 0x00ffff, emissiveIntensity: 1 });
const wireframeObject = new THREE.Mesh(icosahedronGeometry, wireframeMaterial);
scene.add(wireframeObject);

const solidMaterial = new THREE.MeshStandardMaterial({ color: 0xffa500, metalness: 0.8, roughness: 0.2, emissive: 0xffa500, emissiveIntensity: 0 });
const solidObject = new THREE.Mesh(icosahedronGeometry, solidMaterial);
scene.add(solidObject);

const finalMaterial = new THREE.MeshPhysicalMaterial({
    metalness: 0.0,
    roughness: 0,
    transmission: 1.0,
    ior: 2.33,
    thickness: 1.0,
    specularIntensity: 1.0,
});
const finalObject = new THREE.Mesh(icosahedronGeometry, finalMaterial);
scene.add(finalObject);

const crystalLight = new THREE.PointLight(0xffffff, 5, 2);
scene.add(crystalLight);

// --- Unified Animation Timeline ---
gsap.set([wireframeObject.scale, solidObject.scale, finalObject.scale], { x: 0, y: 0, z: 0 });
crystalLight.intensity = 0;
gsap.set(".content-section > * > *", { opacity: 0, y: 50 });
gsap.set(".content-section > *", { opacity: 0, y: 50 });

const tl = gsap.timeline({
    scrollTrigger: {
        trigger: "#scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1
    }
});

// --- Text Animations ---
tl.to(["#welcome-span", "#to-span", "#frame2web-title"], { opacity: 1, y: 0, stagger: 0.2, duration: 0.5 }, 0)
  .to(["#welcome-span", "#to-span", "#frame2web-title"], { opacity: 0, y: -50, stagger: 0.1, duration: 0.5 }, 0.5);

tl.to("#slogan1", { opacity: 1, y: 0, duration: 0.5 }, 1)
  .to("#slogan1", { opacity: 0, y: -50, duration: 0.5 }, 1.5);

tl.to("#slogan2", { opacity: 1, y: 0, duration: 0.5 }, 2)
  .to("#slogan2", { opacity: 0, y: -50, duration: 0.5 }, 2.5);

tl.to(["#title-blueprint", "#sub-blueprint", ".action-button"], { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 }, 3)
  .to(["#title-blueprint", "#sub-blueprint", ".action-button"], { opacity: 0, y: -50, stagger: 0.1, duration: 0.5 }, 3.5);

tl.to(["#title-forge", "#sub-forge", ".action-button"], { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 }, 4)
  .to(["#title-forge", "#sub-forge", ".action-button"], { opacity: 0, y: -50, stagger: 0.1, duration: 0.5 }, 4.5);

tl.to(["#title-polish", "#sub-polish", ".action-button"], { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 }, 5)
  .to(["#title-polish", "#sub-polish", ".action-button"], { opacity: 0, y: -50, stagger: 0.1, duration: 0.5 }, 5.5);

tl.to("#contact-container", { opacity: 1, y: 0, duration: 0.5 }, 6);

// --- 3D Object & Background Animations ---
tl.to(particles.rotation, { y: Math.PI * 4, x: Math.PI * 2, duration: 8 }, 0);

tl.to(particles.material.color, { r: 0, g: 1, b: 1 }, 3)
  .to(bloomPass, { strength: 2.5 }, 3)
  .to(wireframeObject.scale, { x: 1, y: 1, z: 1 }, 3)
  .to(wireframeObject.scale, { x: 0, y: 0, z: 0 }, 4);

tl.to(particles.material.color, { r: 1, g: 0.65, b: 0 }, 4)
  .to(solidMaterial, { emissiveIntensity: 2 }, 4)
  .to(solidObject.scale, { x: 1, y: 1, z: 1 }, 4)
  .to(solidObject.scale, { x: 0, y: 0, z: 0 }, 5);

tl.to(particles.material.color, { r: 1, g: 1, b: 1 }, 5)
  .to(bloomPass, { strength: 1.5 }, 5)
  .to(solidMaterial, { emissiveIntensity: 0 }, 5)
  .to(crystalLight, { intensity: 5 }, 5)
  .to(finalObject.scale, { x: 1, y: 1, z: 1 }, 5);

tl.to(finalObject.scale, { x: 0.1, y: 0.1, z: 0.1 }, 6)
  .to(finalObject.position, { z: -5 }, 6)
  .to(crystalLight, { intensity: 0 }, 6)
  .to(particles.material, { opacity: 0.1 }, 6);

// --- Render Loop ---
const clock = new THREE.Clock();
function animate() {
    const elapsedTime = clock.getElapsedTime();
    particles.rotation.y += 0.0005; 
    crystalLight.position.x = Math.sin(elapsedTime * 2) * 0.5;
    crystalLight.position.y = Math.cos(elapsedTime * 2) * 0.5;
    composer.render();
    requestAnimationFrame(animate);
}
animate();

// --- Handle Window Resizing ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});
