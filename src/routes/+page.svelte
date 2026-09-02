<script lang="ts">
  import { onMount } from "svelte";
  import { Github, Linkedin, Code, Terminal } from "lucide-svelte";
  import { base } from "$app/paths";

  let canvas: HTMLCanvasElement;
  let windowSize = { width: 0, height: 0 };
  let mouse = { x: 0, y: 0 };
  let particles: Particle[] = [];

  class Particle {
    x: number;
    y: number;
    size: number;
    baseSize: number;
    speedX: number;
    speedY: number;
    color: string;
    angle: number;
    pulseFactor: number;

    constructor() {
      this.x = Math.random() * windowSize.width;
      this.y = Math.random() * windowSize.height;
      this.baseSize = Math.random() * 4 + 2;
      this.size = this.baseSize;
      this.speedX = Math.random() * 2 - 1;
      this.speedY = Math.random() * 2 - 1;
      this.color = "rgba(100, 255, 218, 0.9)";
      this.angle = Math.random() * Math.PI * 2;
      this.pulseFactor = Math.random() * 0.1 + 0.95;
    }

    update() {
      this.angle += 0.02;
      this.size = this.baseSize * (Math.sin(this.angle) * 0.5 + 1);

      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 120) {
        const force = (120 - distance) / 120;
        this.speedX += dx * force * 0.01;
        this.speedY += dy * force * 0.01;
        this.color = `hsla(${Math.floor((1 - force) * 170)}, 100%, 65%, 0.95)`;
      } else {
        this.color = "rgba(100, 255, 218, 0.9)";
      }

      this.x += this.speedX;
      this.y += this.speedY;

      this.speedX *= 0.99;
      this.speedY *= 0.99;

      if (this.x > windowSize.width) this.x = 0;
      else if (this.x < 0) this.x = windowSize.width;
      if (this.y > windowSize.height) this.y = 0;
      else if (this.y < 0) this.y = windowSize.height;
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = this.color;
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 1.5;

      ctx.shadowBlur = 15;
      ctx.shadowColor = this.color;

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();

      ctx.shadowBlur = 0;
    }
  }

  function init() {
    const particleCount = Math.floor(
      (windowSize.width * windowSize.height) / 10000
    );
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, windowSize.width, windowSize.height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw(ctx);
      for (let j = i; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(100, 255, 218, ${(1 - distance / 100) * 0.8})`;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  function handleResize() {
    windowSize = { width: window.innerWidth, height: window.innerHeight };
    canvas.width = windowSize.width;
    canvas.height = windowSize.height;
    init();
  }

  function handleMouseMove(event: MouseEvent) {
    mouse = { x: event.clientX, y: event.clientY };
  }

  onMount(() => {
    handleResize();
    animate();

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  });
</script>

<link rel="icon" type="image/svg+xml" href="%sveltekit.assets%/favicon.svg" />

<div class="relative w-full h-screen overflow-hidden bg-gray-900">
  <canvas bind:this={canvas} class="absolute top-0 left-0 w-full h-full"
  ></canvas>
  <div
    class="relative z-10 flex flex-col items-center justify-center h-full text-white"
  >
    <div
      class="bg-gray-800 bg-opacity-50 p-8 rounded-lg backdrop-filter backdrop-blur-lg max-w-2xl w-full"
    >
      <img
        src="{base}/FCD66788-1C58-48AA-9CC5-87A52BAE84A9.jpeg"
        alt="Nikos Skliris"
        class="rounded-full mx-auto mb-4 border-4 border-teal-400"
        style="width: 150px; height: 150px; object-fit: cover;"
      />
      <h1 class="text-4xl font-bold mb-2 text-center">Nikos Skliris</h1>
      <p class="text-xl mb-4 text-center text-teal-400">
        Full Stack Software Engineer
      </p>
      <div class="flex justify-center space-x-4 mb-6">
        <a
          href="https://github.com/skliris"
          target="_blank"
          class="text-teal-400 hover:text-teal-300 transition-colors"
        >
          <Github size={24} />
        </a>
        <a
          href="https://gr.linkedin.com/in/nikolaos-skliris-40b3b219b"
          target="_blank"
          class="text-teal-400 hover:text-teal-300 transition-colors"
        >
          <Linkedin size={24} />
        </a>
      </div>
      <p class="text-center max-w-md mx-auto mb-6">
        Passionate about creating robust and scalable web applications.
        Experienced in both frontend and backend technologies, with a keen eye
        for user experience and performance optimization.
      </p>
      <div class="flex flex-wrap justify-center gap-2">
        {#each ["JavaScript", "TypeScript", "Svelte", "Node.js", "Python", "Docker", "Google Cloud", "PostgreSQL"] as skill}
          <span
            class="bg-teal-700 text-teal-100 px-3 py-1 rounded-full text-sm"
          >
            {skill}
          </span>
        {/each}
      </div>
    </div>
  </div>
</div>
