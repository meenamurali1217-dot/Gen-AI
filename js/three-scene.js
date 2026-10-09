/**
 * MEENA KOTA - Three.js Ambient 3D Engine
 * Connected neural nodes, floating digital particles, and subtle camera parallax.
 * Optimized for high performance and clean white/light blue palette.
 */

class AmbientThreeEngine {
    constructor() {
        this.canvas = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;

        this.neuralGroup = null;
        this.nodesGeometry = null;
        this.linesGeometry = null;
        this.particles = null;

        this.mouseX = 0;
        this.mouseY = 0;
        this.targetMouseX = 0;
        this.targetMouseY = 0;
        this.targetScrollY = 0;
        this.scrollY = 0;

        this.isMobile = window.innerWidth < 768;

        this.config = {
            nodeCount: this.isMobile ? 35 : 80,
            particleCount: this.isMobile ? 120 : 260,
            connectDist: 4.6,
            blueColor: 0x0878e8,
            yellowColor: 0xffd21f,
            navyColor: 0x063b66
        };

        this.init();
    }

    isWebGLAvailable() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }

    init() {
        if (!this.isWebGLAvailable()) return;

        this.canvas = document.createElement('canvas');
        this.canvas.id = 'webgl-bg';
        document.body.prepend(this.canvas);

        this.setupScene();
        this.createNeuralNetwork();
        this.createParticles();
        this.addEventListeners();
        this.animate();
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 0, 16);

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance'
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    createNeuralNetwork() {
        this.neuralGroup = new THREE.Group();
        const count = this.config.nodeCount;
        this.nodePositions = new Float32Array(count * 3);
        this.nodeVelocities = [];

        for (let i = 0; i < count; i++) {
            this.nodePositions[i * 3] = (Math.random() - 0.5) * 24;
            this.nodePositions[i * 3 + 1] = (Math.random() - 0.5) * 24;
            this.nodePositions[i * 3 + 2] = (Math.random() - 0.5) * 16 - 2;

            this.nodeVelocities.push({
                x: (Math.random() - 0.5) * 0.006,
                y: (Math.random() - 0.5) * 0.006,
                z: (Math.random() - 0.5) * 0.006
            });
        }

        this.nodesGeometry = new THREE.BufferGeometry();
        this.nodesGeometry.setAttribute('position', new THREE.BufferAttribute(this.nodePositions, 3));

        const nodeMat = new THREE.PointsMaterial({
            color: this.config.blueColor,
            size: this.isMobile ? 0.22 : 0.32,
            transparent: true,
            opacity: 0.7
        });

        const points = new THREE.Points(this.nodesGeometry, nodeMat);
        this.neuralGroup.add(points);

        this.linesGeometry = new THREE.BufferGeometry();
        this.linePositions = new Float32Array(count * count * 6);
        this.linesGeometry.setAttribute('position', new THREE.BufferAttribute(this.linePositions, 3));

        const lineMat = new THREE.LineBasicMaterial({
            color: this.config.blueColor,
            transparent: true,
            opacity: 0.18
        });

        this.linesMesh = new THREE.LineSegments(this.linesGeometry, lineMat);
        this.neuralGroup.add(this.linesMesh);

        this.scene.add(this.neuralGroup);
    }

    createParticles() {
        const count = this.config.particleCount;
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 32;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 4;
        }

        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

        const mat = new THREE.PointsMaterial({
            color: this.config.yellowColor,
            size: 0.16,
            transparent: true,
            opacity: 0.5
        });

        this.particles = new THREE.Points(geo, mat);
        this.scene.add(this.particles);
    }

    addEventListeners() {
        window.addEventListener('mousemove', (e) => {
            this.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 1.5;
            this.targetMouseY = -(e.clientY / window.innerHeight - 0.5) * 1.5;
        }, { passive: true });

        window.addEventListener('scroll', () => {
            this.targetScrollY = window.scrollY;
        }, { passive: true });

        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth < 768;
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });
    }

    updateLines() {
        const pos = this.nodesGeometry.attributes.position.array;
        const count = this.config.nodeCount;
        let lineIdx = 0;

        for (let i = 0; i < count; i++) {
            pos[i * 3] += this.nodeVelocities[i].x;
            pos[i * 3 + 1] += this.nodeVelocities[i].y;
            pos[i * 3 + 2] += this.nodeVelocities[i].z;

            if (Math.abs(pos[i * 3]) > 12) this.nodeVelocities[i].x *= -1;
            if (Math.abs(pos[i * 3 + 1]) > 12) this.nodeVelocities[i].y *= -1;
            if (Math.abs(pos[i * 3 + 2]) > 8) this.nodeVelocities[i].z *= -1;

            for (let j = i + 1; j < count; j++) {
                const dx = pos[i * 3] - pos[j * 3];
                const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
                const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < this.config.connectDist) {
                    this.linePositions[lineIdx * 6] = pos[i * 3];
                    this.linePositions[lineIdx * 6 + 1] = pos[i * 3 + 1];
                    this.linePositions[lineIdx * 6 + 2] = pos[i * 3 + 2];

                    this.linePositions[lineIdx * 6 + 3] = pos[j * 3];
                    this.linePositions[lineIdx * 6 + 4] = pos[j * 3 + 1];
                    this.linePositions[lineIdx * 6 + 5] = pos[j * 3 + 2];

                    lineIdx++;
                }
            }
        }

        this.nodesGeometry.attributes.position.needsUpdate = true;
        this.linesGeometry.setDrawRange(0, lineIdx * 2);
        this.linesGeometry.attributes.position.needsUpdate = true;
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
        this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;
        this.scrollY += (this.targetScrollY - this.scrollY) * 0.06;

        const scrollProgress = this.scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1);

        this.updateLines();

        if (this.neuralGroup) {
            this.neuralGroup.rotation.y = this.mouseX * 0.25 + scrollProgress * 0.8;
            this.neuralGroup.rotation.x = this.mouseY * 0.2;
        }

        if (this.particles) {
            this.particles.rotation.y += 0.0008;
            const p = this.particles.geometry.attributes.position.array;
            for (let i = 1; i < p.length; i += 3) {
                p[i] += 0.012;
                if (p[i] > 20) p[i] = -20;
            }
            this.particles.geometry.attributes.position.needsUpdate = true;
        }

        this.camera.position.x = this.mouseX * 0.8;
        this.camera.position.y = -scrollProgress * 3 + this.mouseY * 0.6;
        this.camera.lookAt(0, -scrollProgress * 2, 0);

        this.renderer.render(this.scene, this.camera);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.ambientThree = new AmbientThreeEngine();
});
