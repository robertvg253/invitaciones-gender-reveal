const puppeteer = require('puppeteer');
const { spawn } = require('child_process');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');
const fs = require('fs');

async function record() {
  console.log('--- Iniciando grabación BRAG ---');
  const outputPath = path.join(__dirname, 'brag.mp4');
  const posterPath = path.join(__dirname, 'brag.jpg');

  // Configuración de FFmpeg para recibir frames mjpeg desde stdin
  const ffmpeg = spawn(ffmpegPath, [
    '-y',
    '-f', 'image2pipe',
    '-vcodec', 'mjpeg',
    '-r', '30',
    '-i', '-',
    '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
    '-c:v', 'libx264',
    '-preset', 'faster',
    '-crf', '22',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    outputPath
  ]);

  ffmpeg.stderr.on('data', (data) => {
    // Silencioso o debug si es necesario
  });

  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--window-size=430,932'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 414,
    height: 896,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });

  // Empezar screencast con CDP
  const client = await page.target().createCDPSession();
  await client.send('Page.startScreencast', {
    format: 'jpeg',
    quality: 90,
    everyNthFrame: 1
  });

  client.on('Page.screencastFrame', async ({ data, sessionId }) => {
    try {
      const buffer = Buffer.from(data, 'base64');
      ffmpeg.stdin.write(buffer);
      await client.send('Page.screencastFrameAck', { sessionId });
    } catch (e) {
      // Ignorar errores al cerrar stream
    }
  });

  console.log('1. Cargando invitación...');
  await page.goto('http://localhost:3000/babyshower/Susana', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });

  // 1. Gancho Visual: El sobre interactivo (2s)
  await new Promise(r => setTimeout(r, 800));
  
  // Tocar para abrir sobre si existe
  try {
    const envelope = await page.$('video, button, div[class*="Envelope"]');
    if (envelope) {
      await page.click('body');
    }
  } catch (err) {}
  
  await new Promise(r => setTimeout(r, 2200));

  // Guardar portada clave en alta calidad si ya se abrió la invitación
  await page.screenshot({ path: posterPath, quality: 95, type: 'jpeg' });
  console.log('Portada capturada en brag.jpg');

  // 2. Demostración de interfaz: Scroll suave hacia abajo (4s)
  console.log('2. Scroll por detalles del evento...');
  await page.evaluate(async () => {
    const smoothScroll = (targetY, duration) => {
      return new Promise((resolve) => {
        const startY = window.scrollY;
        const diff = targetY - startY;
        const startTime = performance.now();

        function step(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
          window.scrollTo(0, startY + diff * ease);
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            resolve();
          }
        }
        requestAnimationFrame(step);
      });
    };

    // Scroll hasta dresscode y mesa de regalos
    await smoothScroll(1400, 3500);
  });

  await new Promise(r => setTimeout(r, 1000));

  // 3. Mesa de Regalos: Click en el botón de ver lista de regalos (6s)
  console.log('3. Navegando a Mesa de Regalos...');
  try {
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Lista de Regalos'));
      if (btn) btn.click();
      else window.location.href = '/babyshower/wishlist';
    });
  } catch (e) {
    await page.goto('http://localhost:3000/babyshower/wishlist', { waitUntil: 'networkidle2' });
  }

  await new Promise(r => setTimeout(r, 2000));

  // Scroll suave por la cuadrícula de regalos
  console.log('4. Explorando cuadrícula de regalos...');
  await page.evaluate(async () => {
    const smoothScroll = (targetY, duration) => {
      return new Promise((resolve) => {
        const startY = window.scrollY;
        const diff = targetY - startY;
        const startTime = performance.now();

        function step(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          window.scrollTo(0, startY + diff * progress);
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            resolve();
          }
        }
        requestAnimationFrame(step);
      });
    };

    await smoothScroll(600, 2000);
  });

  await new Promise(r => setTimeout(r, 1200));

  // 4. Cierre: Volver y confirmar asistencia RSVP (3s)
  console.log('5. Volviendo para confirmar asistencia...');
  await page.goto('http://localhost:3000/babyshower/Susana', { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    // Si sobre pide abrir de nuevo, omitir
    sessionStorage.setItem('envelopeOpened', 'true');
    window.scrollTo(0, document.body.scrollHeight);
  });

  await new Promise(r => setTimeout(r, 1000));

  // Click en Confirmar Asistencia
  try {
    await page.evaluate(() => {
      const rsvpBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Confirmar Asistencia'));
      if (rsvpBtn) rsvpBtn.click();
    });
  } catch (e) {}

  await new Promise(r => setTimeout(r, 2000));

  // Detener captura
  console.log('6. Finalizando grabación...');
  await client.send('Page.stopScreencast');
  await browser.close();

  ffmpeg.stdin.end();

  await new Promise((resolve) => {
    ffmpeg.on('close', (code) => {
      console.log(`Video renderizado exitosamente: brag.mp4 (código ${code})`);
      resolve();
    });
  });
}

record().catch((err) => {
  console.error('Error durante la grabación:', err);
  process.exit(1);
});
