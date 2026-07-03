/**
 * Portfolio Architecture Script
 * Handles animations, canvas effects, and interactions without external libraries.
 */

class PortfolioSystem {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupTypewriter();
        this.setupScrollReveal();
        this.setupCounters();
        this.setupTiltEffect();
        this.setupHeroCanvas();
        this.setupSkillsCanvas();
        this.setupCopyEmail();
        this.setupBackToTop();
    }

    // 1. Navigation & Mobile Menu
    setupNavigation() {
        const navbar = document.getElementById('navbar');
        const mobileToggle = document.querySelector('.mobile-toggle');
        const navLinks = document.querySelector('.nav-links');
        const links = document.querySelectorAll('.nav-links a');
        const sections = document.querySelectorAll('section');

        // Scroll styling
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Scroll Spy
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= (sectionTop - sectionHeight / 3)) {
                    current = section.getAttribute('id');
                }
            });

            links.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').includes(current)) {
                    link.classList.add('active');
                }
            });
        }, { passive: true });

        // Mobile Toggle
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            mobileToggle.querySelector('.hamburger').classList.toggle('toggle');
        });

        // Close mobile menu on click
        links.forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('nav-active')) {
                    navLinks.classList.remove('nav-active');
                    mobileToggle.querySelector('.hamburger').classList.remove('toggle');
                }
            });
        });
    }

    // 2. Typewriter Effect
    setupTypewriter() {
        const textElement = document.getElementById('typewriter');
        if (!textElement) return;

        const phrases = [
            "Building Intelligent Systems",
            "Deploying scalable LLMs",
            "Optimizing ML Pipelines",
            "Turning Research into Products"
        ];
        
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        const type = () => {
            const currentPhrase = phrases[phraseIndex];
            
            if (isDeleting) {
                textElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                textElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true;
                typingSpeed = 2000; // Pause at end
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 500; // Pause before new word
            }

            setTimeout(type, typingSpeed);
        };

        setTimeout(type, 1000); // Initial delay
    }

    // 3. Scroll Reveal via Intersection Observer
    setupScrollReveal() {
        const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
        
        // Respect prefers-reduced-motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            reveals.forEach(el => el.classList.add('active'));
            return;
        }

        const revealOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, revealOptions);

        reveals.forEach(reveal => {
            revealObserver.observe(reveal);
        });
    }

    // 4. Animated Counters
    setupCounters() {
        const counters = document.querySelectorAll('.metric-number');
        let hasCounted = false;

        const counterObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasCounted) {
                hasCounted = true;
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const duration = 2000; // 2 seconds
                    const increment = target / (duration / 16); // 60fps
                    let current = 0;

                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.innerText = Math.ceil(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCounter();
                });
            }
        }, { threshold: 0.5 });

        const metricsSection = document.getElementById('metrics');
        if (metricsSection) counterObserver.observe(metricsSection);
    }

    // 5. 3D Mouse Tilt Effect for Project Cards
    setupTiltEffect() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const cards = document.querySelectorAll('.tilt-element');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; // x position within the element
                const y = e.clientY - rect.top;  // y position within the element
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -5; // Max rotation 5deg
                const rotateY = ((x - centerX) / centerX) * 5;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            });
        });
    }

    // 6. Neural Network Canvas Background (Hero)
    setupHeroCanvas() {
        const canvas = document.getElementById('hero-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        let width, height, particles;

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        };

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx = -this.vx;
                if (this.y < 0 || this.y > height) this.vy = -this.vy;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(59, 130, 246, 0.5)';
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            const numParticles = Math.min(Math.floor(width * height / 15000), 100);
            for (let i = 0; i < numParticles; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 150) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(59, 130, 246, ${0.2 * (1 - distance/150)})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        resize();
        animate();
    }

    // 7. Interactive Skills Constellation Canvas
    setupSkillsCanvas() {
        const canvas = document.getElementById('skills-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let width, height, nodes = [];

        const technologies = [
            "Python", "PyTorch", "TensorFlow", "FastAPI", "Docker",
            "PostgreSQL", "LangChain", "CUDA", "AWS", "K8s", "Git", "MLflow"
        ];

        let mouse = { x: null, y: null, radius: 100 };

        const resize = () => {
            const container = canvas.parentElement;
            width = canvas.width = container.clientWidth;
            height = canvas.height = container.clientHeight;
            initNodes();
        };

        class Node {
            constructor(label) {
                this.label = label;
                this.x = Math.random() * (width - 40) + 20;
                this.y = Math.random() * (height - 40) + 20;
                this.vx = (Math.random() - 0.5) * 0.8;
                this.vy = (Math.random() - 0.5) * 0.8;
                this.radius = 4;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 10 || this.x > width - 10) this.vx = -this.vx;
                if (this.y < 10 || this.y > height - 10) this.vy = -this.vy;

                // Mouse interaction
                if (mouse.x != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        this.x -= dx * 0.02;
                        this.y -= dy * 0.02;
                    }
                }
            }
            draw() {
                // Draw dot
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = '#06B6D4';
                ctx.fill();
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#06B6D4';

                // Draw Text
                ctx.font = "12px 'JetBrains Mono'";
                ctx.fillStyle = "rgba(248, 250, 252, 0.7)";
                ctx.shadowBlur = 0;
                ctx.fillText(this.label, this.x + 8, this.y + 4);
            }
        }

        const initNodes = () => {
            nodes = [];
            technologies.forEach(tech => nodes.push(new Node(tech)));
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw connecting lines
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    let dx = nodes[i].x - nodes[j].x;
                    let dy = nodes[i].y - nodes[j].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(139, 92, 246, ${0.4 * (1 - distance/120)})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
                nodes[i].update();
                nodes[i].draw();
            }
            requestAnimationFrame(animate);
        };

        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        canvas.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        window.addEventListener('resize', resize);
        resize();
        animate();
    }

    // 8. Copy Email to Clipboard
    setupCopyEmail() {
        const copyBtn = document.getElementById('copy-email');
        const emailText = document.getElementById('email-text');
        
        if (!copyBtn || !emailText) return;

        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(emailText.innerText);
                const icon = copyBtn.querySelector('i');
                icon.className = 'fa-solid fa-check';
                icon.style.color = 'var(--success)';
                
                setTimeout(() => {
                    icon.className = 'fa-regular fa-copy';
                    icon.style.color = '';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy: ', err);
            }
        });
    }

    // 9. Back to Top Button
    setupBackToTop() {
        const btt = document.getElementById('back-to-top');
        if (!btt) return;

        btt.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Initialize system on DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioSystem();
});