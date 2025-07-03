document.addEventListener('DOMContentLoaded', function() {

    // --- EFECTO MÁQUINA DE ESCRIBIR ---
    const titleElement = document.getElementById('typewriter-title');
    if (titleElement) {
        new Typed('#typewriter-title', {
            strings: ['Para la Dueña de Mi Corazón,', 'Para mi amor,', 'Para Jessica mi vida...'],
            typeSpeed: 70,
            backSpeed: 40,
            backDelay: 1500,
            loop: true,
            smartBackspace: true
        });
    }

    // --- LÓGICA DE ANIVERSARIO ---
    const hoy = new Date();
    const diaDelMes = hoy.getDate();
    if (diaDelMes === 3) {
        const seccionAniversario = document.getElementById('aniversario');
        if (seccionAniversario) {
            seccionAniversario.classList.remove('hidden-by-default');
        }
    }

    // --- LÓGICA DEL MENSAJE SECRETO ---
    const secretButton = document.getElementById('secret-button');
    const secretMessage = document.getElementById('secret-message');
    const message = "Y el secreto es... ¡que cada día me enamoro más de ti! ❤️";
    if (secretButton) {
        secretButton.addEventListener('click', function() {
            if (typeof confetti === 'function') {
                confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 }, colors: ['#d90429', '#ffcad4', '#ffffff'] });
            }
            secretMessage.textContent = message;
            secretMessage.classList.remove('hidden');
            secretButton.style.display = 'none';
        });
    }

    // --- ANIMACIONES AL HACER SCROLL ---
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    elementsToAnimate.forEach(element => { observer.observe(element); });

    // --- CREAR CORAZONES FLOTANTES ---
    const heartsContainer = document.getElementById('hearts-container');
    if (heartsContainer) {
        const createHeart = () => {
            const heart = document.createElement('div');
            heart.classList.add('heart');
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.animationDuration = Math.random() * 5 + 8 + 's';
            heartsContainer.appendChild(heart);
            setTimeout(() => { heart.remove(); }, 13000);
        };
        setInterval(createHeart, 1000);
    }

    // --- LÓGICA DEL CORAZÓN 3D DE PARTÍCULAS (RESTAURADA) ---
    function init3DHeart() {
        const container = document.getElementById('heart-canvas-container');
        if (!container || typeof THREE === 'undefined') return;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 35;
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);
        const particleCount = 2500;
        const positions = new Float32Array(particleCount * 3);
        const geometry = new THREE.BufferGeometry();
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const t = Math.random() * 2 * Math.PI;
            const r = Math.pow(Math.random(), 0.5);
            const scaleFactor = 0.9;
            const x = r * scaleFactor * (16 * Math.pow(Math.sin(t), 3));
            const y = r * scaleFactor * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
            const z = (Math.random() - 0.5) * 4;
            positions[i3] = x;
            positions[i3 + 1] = y + 5;
            positions[i3 + 2] = z;
        }
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({ color: 0xd90429, size: 0.2, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.9 });
        const heartParticles = new THREE.Points(geometry, material);
        scene.add(heartParticles);
        let mouseX = 0, mouseY = 0, isMouseDown = false;
        container.addEventListener('mousedown', () => { isMouseDown = true; });
        container.addEventListener('mouseup', () => { isMouseDown = false; });
        container.addEventListener('mousemove', (event) => {
            if (isMouseDown) {
                const rect = container.getBoundingClientRect();
                mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            }
        });
        const clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();
            const beatScale = 1 + 0.1 * Math.sin(elapsedTime * 3);
            heartParticles.scale.set(beatScale, beatScale, beatScale);
            heartParticles.rotation.y += 0.001;
            if (isMouseDown) {
                heartParticles.rotation.y += mouseX * 0.02;
                heartParticles.rotation.x += mouseY * 0.02;
            }
            renderer.render(scene, camera);
        }
        animate();
        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    }

    // Iniciar el corazón 3D
    init3DHeart();

});
