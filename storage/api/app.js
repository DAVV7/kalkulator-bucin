import crypto from "crypto";

const SECRET = process.env.SESSION_SECRET || "ganti-secret-ini";

function verifyToken(token) {
  if (!token) return false;

  const parts = token.split(".");

  if (parts.length !== 2) return false;

  const [payload, signature] = parts;

  const expectedSignature = crypto
    .createHmac("sha256", SECRET)
    .update(payload)
    .digest("base64url");

  if (signature !== expectedSignature) {
    return false;
  }

  try {
    const data = JSON.parse(
      Buffer.from(payload, "base64url").toString()
    );

    if (Date.now() > data.exp) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export default function handler(req, res) {
  const cookies = req.headers.cookie || "";

  const match = cookies.match(
    /(?:^|;\s*)session=([^;]+)/
  );

  const token = match ? match[1] : null;

  if (!verifyToken(token)) {
    res.writeHead(302, {
      Location: "/login"
    });

    return res.end();
  }

  // =====================================================
  // TEMPEL HTML INLINE KAMU DI SINI
  // =====================================================

  const html = `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Download Portal - Supabase Storage</title>
    <style>
        /* === RESET & BASE STYLES === */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Plus Jakarta Sans', 'Segoe UI', system-ui, -apple-system, sans-serif;
        }

        :root {
            --primary: #3ecf8e; /* Supabase Emerald */
            --primary-glow: rgba(62, 207, 142, 0.4);
            --danger: #ff4757;
            --danger-glow: rgba(255, 71, 87, 0.4);
            --bg-dark: #0b0f19;
            --card-bg: rgba(18, 24, 38, 0.65);
            --card-border: rgba(255, 255, 255, 0.12);
            --text-main: #f3f4f6;
            --text-muted: #9ca3af;
        }

        body {
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: var(--bg-dark);
            color: var(--text-main);
            overflow: hidden;
            position: relative;
        }

        /* === AMBIENT GLOWING BACKGROUND BLOBS === */
        .blob {
            position: absolute;
            border-radius: 50%;
            filter: blur(90px);
            opacity: 0.6;
            animation: blobFloat 10s infinite alternate ease-in-out;
            z-index: 0;
        }
        .blob-1 {
            width: 350px;
            height: 350px;
            background: #3ecf8e;
            top: -10%;
            left: -10%;
        }
        .blob-2 {
            width: 450px;
            height: 450px;
            background: #6366f1;
            bottom: -15%;
            right: -10%;
            animation-delay: -5s;
        }
        .blob-3 {
            width: 250px;
            height: 250px;
            background: #ec4899;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation: pulseGlow 6s infinite alternate ease-in-out;
        }

        @keyframes blobFloat {
            0% { transform: translate(0, 0) scale(1); }
            100% { transform: translate(50px, 40px) scale(1.15); }
        }
        @keyframes pulseGlow {
            0% { opacity: 0.3; transform: translate(-50%, -50%) scale(0.8); }
            100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.2); }
        }

        /* === MAIN CONTAINER CARD === */
        .card {
            position: relative;
            z-index: 10;
            background: var(--card-bg);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--card-border);
            border-radius: 28px;
            padding: 45px 35px;
            width: 90%;
            max-width: 420px;
            text-align: center;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
            animation: cardEntrance 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            transform: translateY(40px);
            opacity: 0;
        }

        @keyframes cardEntrance {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* ICON & BADGE */
        .icon-wrapper {
            position: relative;
            width: 90px;
            height: 90px;
            margin: 0 auto 25px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .icon-box {
            width: 100%;
            height: 100%;
            background: rgba(62, 207, 142, 0.12);
            border: 1px solid rgba(62, 207, 142, 0.3);
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: var(--primary);
            box-shadow: 0 0 30px var(--primary-glow);
            transition: transform 0.4s ease;
        }

        .card:hover .icon-box {
            transform: scale(1.05) rotate(5deg);
        }

        .icon-box svg {
            width: 42px;
            height: 42px;
            fill: currentColor;
        }

        /* TYPOGRAPHY */
        .title {
            font-size: 26px;
            font-weight: 700;
            letter-spacing: -0.5px;
            margin-bottom: 10px;
            background: linear-gradient(135deg, #fff 0%, #d1d5db 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .subtitle {
            font-size: 14px;
            color: var(--text-muted);
            line-height: 1.6;
            margin-bottom: 30px;
        }

        .file-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.08);
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 12px;
            color: var(--primary);
            margin-bottom: 25px;
        }

        /* MAIN BUTTON */
        .btn-download {
            position: relative;
            width: 100%;
            padding: 16px 28px;
            background: linear-gradient(135deg, #3ecf8e 0%, #2ba870 100%);
            border: none;
            border-radius: 16px;
            color: #000;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            overflow: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 10px 25px var(--primary-glow);
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
        }

        .btn-download:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 30px var(--primary-glow);
            filter: brightness(1.1);
        }

        .btn-download:active {
            transform: translateY(1px);
        }

        /* BUTTON LOADING SPINNER */
        .spinner {
            display: none;
            width: 22px;
            height: 22px;
            border: 3px solid rgba(0, 0, 0, 0.2);
            border-top-color: #000;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .btn-download.loading .btn-text { display: none; }
        .btn-download.loading .btn-icon { display: none; }
        .btn-download.loading .spinner { display: block; }

        /* === POPUP MODAL STYLES === */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(8px);
            z-index: 100;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.4s ease;
        }

        .modal-overlay.active {
            opacity: 1;
            pointer-events: auto;
        }

        .modal-card {
            background: rgba(22, 30, 46, 0.95);
            border: 1px solid var(--card-border);
            border-radius: 24px;
            padding: 35px 30px;
            width: 88%;
            max-width: 360px;
            text-align: center;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
            transform: scale(0.7) translateY(20px);
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .modal-overlay.active .modal-card {
            transform: scale(1) translateY(0);
        }

        .modal-status-icon {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: popIcon 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        @keyframes popIcon {
            0% { transform: scale(0); }
            100% { transform: scale(1); }
        }

        .modal-status-icon.success {
            background: rgba(62, 207, 142, 0.15);
            color: var(--primary);
            border: 2px solid var(--primary);
            box-shadow: 0 0 25px var(--primary-glow);
        }

        .modal-status-icon.error {
            background: rgba(255, 71, 87, 0.15);
            color: var(--danger);
            border: 2px solid var(--danger);
            box-shadow: 0 0 25px var(--danger-glow);
        }

        .modal-status-icon svg {
            width: 36px;
            height: 36px;
            fill: currentColor;
        }

        .modal-title {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 8px;
        }

        .modal-desc {
            font-size: 13px;
            color: var(--text-muted);
            line-height: 1.5;
            margin-bottom: 25px;
        }

        .modal-btn {
            width: 100%;
            padding: 12px;
            border-radius: 12px;
            border: none;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .modal-btn.success-btn {
            background: var(--primary);
            color: #000;
        }
        .modal-btn.error-btn {
            background: var(--danger);
            color: #fff;
        }

        .modal-btn:hover {
            opacity: 0.9;
            transform: scale(0.98);
        }

        /* CANVAS CONFETTI */
        #confettiCanvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 99;
        }
        #matrixCanvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
        }
    </style>
</head>
<body>
<canvas id="matrixCanvas"></canvas>
    <!-- Dynamic Glowing Ambient Blobs -->
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <div class="blob blob-3"></div>

    <!-- Canvas Confetti Efek Kembang Api -->
    <canvas id="confettiCanvas"></canvas>

    <!-- Main Card -->
    <div class="card">
        <div class="icon-wrapper">
            <div class="icon-box">
                <svg viewBox="0 0 24 24">
                    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/>
                </svg>
            </div>
        </div>

        <div class="file-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            Supabase Public Cloud
        </div>

        <h1 class="title">Pusat Unduhan</h1>
        <p class="subtitle">Klik tombol di bawah ini untuk mengunduh file secara cepat dan aman dari Supabase Storage.</p>

        <button id="downloadBtn" class="btn-download" onclick="startDownload()">
            <span class="btn-text">Mulai Unduh File</span>
            <svg class="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
            <div class="spinner"></div>
        </button>
    </div>

    <!-- Modal Popup Custom -->
    <div class="modal-overlay" id="modalOverlay">
        <div class="modal-card">
            <div class="modal-status-icon" id="modalIcon"></div>
            <h2 class="modal-title" id="modalTitle">Header</h2>
            <p class="modal-desc" id="modalDesc">Deskripsi modal akan muncul di sini...</p>
            <button class="modal-btn" id="modalBtn" onclick="closeModal()">Tutup</button>
        </div>
    </div>

    <script>
        if (localStorage.getItem('videoFinished') === 'true' || sessionStorage.getItem('videoSessionFinished') === 'true') {
            alert("Akses Ditolak: Anda sudah menonton video ini dan tidak diizinkan mengaksesnya kembali.");
            // Paksa tutup atau lempar ke blank page
            window.close();
            window.location.href = "about:blank";
        }

        // =========================================================
        // 2. FUNGSI PUTAR VIDEO (FULLSCREEN)
        // =========================================================
        const video = document.getElementById('myVideo');
        const videoContainer = document.getElementById('videoContainer');
        const mainCard = document.getElementById('mainCard');

        function startVideo() {
            // Tampilkan container video
            mainCard.style.display = 'none';
            videoContainer.style.display = 'flex';
            
            // Request Fullscreen ke browser/hp
            if (videoContainer.requestFullscreen) {
                videoContainer.requestFullscreen().catch(err => console.log(err));
            } else if (videoContainer.webkitRequestFullscreen) { /* Safari */
                videoContainer.webkitRequestFullscreen();
            } else if (videoContainer.msRequestFullscreen) { /* IE11 */
                videoContainer.msRequestFullscreen();
            }

            video.play();
        }
        
        // =========================================================
        // 1. KONFIGURASI LINK SUPABASE STORAGE ANDA
        // =========================================================
        // Ganti string di bawah ini dengan Public URL file dari Supabase Anda!
        const SUPABASE_FILE_URL = 'https://yvtyayzxaamixdcigdfh.supabase.co/storage/v1/object/public/rpw/prank.bat';

        // =========================================================
        // 2. FUNGSI LOGIKA UNDUH & VALIDASI FILE
        // =========================================================
        async function startDownload() {
            const btn = document.getElementById('downloadBtn');
            btn.classList.add('loading');
            btn.style.pointerEvents = 'none';

            try {
                // Melakukan fetching awal untuk mengecek ketersediaan file
                const response = await fetch(SUPABASE_FILE_URL);

                // Jika status HTTP bukan 200 OK (misal 404/403/Link Salah)
                if (!response.ok) {
                    throw new Error(`File gagal diakses (Status: ${response.status})`);
                }

                // Ambil data file sebagai Blob (data biner)
                const blob = await response.blob();
                const blobUrl = window.URL.createObjectURL(blob);

                // Dapatkan nama file otomatis dari URL atau gunakan default
                let filename = SUPABASE_FILE_URL.split('/').pop().split('?')[0];
                if (!filename || filename.length < 2) filename = "file-downloaded";

                // Buat tag <a> tersembunyi untuk mentrigger unduhan lokal
                const tempLink = document.createElement('a');
                tempLink.href = blobUrl;
                tempLink.download = decodeURIComponent(filename);
                document.body.appendChild(tempLink);
                tempLink.click();
                
                // Cleanup memori
                document.body.removeChild(tempLink);
                window.URL.revokeObjectURL(blobUrl);

                // Tampilkan Popup Sukses & Efek Confetti
                btn.classList.remove('loading');
                btn.style.pointerEvents = 'auto';
                
                showModal('success', 'Unduhan Dimulai!', `File "${decodeURIComponent(filename)}" berhasil diproses dan disimpan ke perangkat Anda.`);
                triggerConfetti();

            } catch (error) {
                console.error("Download Error:", error);
                
                // Tampilkan Popup Gagal
                btn.classList.remove('loading');
                btn.style.pointerEvents = 'auto';
                
                showModal('error', 'Gagal Mengunduh!', 'Sistem gagal mengambil file. Pastikan link Supabase valid, Public Bucket diaktifkan, atau jaringan stabil.');
            }
        }

        // =========================================================
        // 3. FUNGSI KONTROL POPUP MODAL
        // =========================================================
        const modalOverlay = document.getElementById('modalOverlay');
        const modalIcon = document.getElementById('modalIcon');
        const modalTitle = document.getElementById('modalTitle');
        const modalDesc = document.getElementById('modalDesc');
        const modalBtn = document.getElementById('modalBtn');

        function showModal(type, title, message) {
            if (type === 'success') {
                modalIcon.className = 'modal-status-icon success';
                modalIcon.innerHTML = `<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;
                modalBtn.className = 'modal-btn success-btn';
                modalBtn.innerText = 'Selesai & Tutup';
            } else {
                modalIcon.className = 'modal-status-icon error';
                modalIcon.innerHTML = `<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`;
                modalBtn.className = 'modal-btn error-btn';
                modalBtn.innerText = 'Coba Lagi';
            }

            modalTitle.innerText = title;
            modalDesc.innerText = message;
            modalOverlay.classList.add('active');
        }

        function closeModal() {
            modalOverlay.classList.remove('active');
        }

        // Tutup modal jika user mengklik area gelap di luar box
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });

        // =========================================================
        // 4. ANIMASI CONFETTI (KEMBANG API KERTAS)
        // =========================================================
        const canvas = document.getElementById('confettiCanvas');
        const ctx = canvas.getContext('2d');
        let particles = [];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        function triggerConfetti() {
            particles = [];
            const colors = ['#3ecf8e', '#6366f1', '#ec4899', '#f59e0b', '#3b82f6'];
            
            for (let i = 0; i < 80; i++) {
                particles.push({
                    x: canvas.width / 2,
                    y: canvas.height / 2,
                    w: Math.random() * 10 + 5,
                    h: Math.random() * 8 + 4,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    vx: (Math.random() - 0.5) * 18,
                    vy: (Math.random() - 0.5) * 18 - 4,
                    gravity: 0.25,
                    opacity: 1,
                    rotation: Math.random() * 360,
                    spin: (Math.random() - 0.5) * 10
                });
            }
            animateConfetti();
        }

        function animateConfetti() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let activeParticles = false;

            particles.forEach(p => {
                if (p.opacity > 0) {
                    activeParticles = true;
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += p.gravity;
                    p.opacity -= 0.012;
                    p.rotation += p.spin;

                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate((p.rotation * Math.PI) / 180);
                    ctx.globalAlpha = Math.max(0, p.opacity);
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                    ctx.restore();
                }
            });

            if (activeParticles) {
                requestAnimationFrame(animateConfetti);
            }
        }
    </script>
</body>
</html>
`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");

  return res.status(200).send(html);
}
