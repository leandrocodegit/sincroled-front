function initCapturador() {

  console.log('Inicializando captura de tela...');

  let stream = null;
  let recorder = null;
  let chunks = [];
  let startTime = null;
  let timerId = null;

  // trava para não pedir permissão 2x
  let isSettingUp = false;

  const btnInit = document.getElementById('btnInit');
  const btnAction = document.getElementById('btnAction');
  const statusTxt = document.getElementById('statusTxt');
  const statusBox = document.getElementById('statusBox');
  const timerDisplay = document.getElementById('timer');
  const micStatus = document.getElementById('micStatus');

  async function setupMidia() {
    // evita disparos duplos
    if (isSettingUp || stream) return;

    isSettingUp = true;

    try {
      // 1. Microfone
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStatus.innerText = "🎤 Microfone: Ativado";
      micStatus.style.color = "#16a34a";

      // 2. Captura do ecrã (usuário escolhe)
      const videoStream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 30 },
        audio: true
      });

      const tracks = [
        ...videoStream.getVideoTracks(),
        ...audioStream.getAudioTracks()
      ];

      stream = new MediaStream(tracks);

      btnAction.disabled = false;
      btnInit.disabled = true;
      statusTxt.innerText = "Pronto para gravar";

      // se o usuário parar o compartilhamento pelo navegador
      const vt = videoStream.getVideoTracks()[0];
      if (vt) {
        vt.onended = () => {
          if (recorder?.state === 'recording') stopRec();
          else stopRec(); // garante reset UI mesmo se não estiver gravando
        };
      }

    } catch (err) {
      console.error(err);
      alert("Erro: Dê permissão ao microfone e escolha a tela/janela/aba.");
    } finally {
      isSettingUp = false;
    }
  }

  // Clique manual no botão (impede cair no window click também)
  btnInit.addEventListener('click', async (e) => {
    e.stopPropagation();
    await setupMidia();
  });

  // ✅ Ao abrir a tela: prepara para disparar no primeiro clique do usuário
  window.addEventListener('click', async function autoStartOnce(e) {
    // se o clique foi no botão (ou dentro dele), ignora
    if (e.target === btnInit || btnInit.contains(e.target)) return;

    // remove logo pra garantir 1x
    window.removeEventListener('click', autoStartOnce);

    // só se ainda não configurou
    if (!stream && !btnInit.disabled) {
      await setupMidia();
    }
  }, { once: true });

  btnAction.addEventListener('click', () => {
    if (!recorder || recorder.state === "inactive") {
      startRec();
    } else {
      stopRec();
    }
  });

  function startRec() {
    if (!stream) {
      alert("Configure a captura primeiro (passo 1).");
      return;
    }

    chunks = [];

    // fallback de mimeType caso vp9 não esteja disponível
    let options = {};
    const preferred = 'video/webm; codecs=vp9';
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported?.(preferred)) {
      options = { mimeType: preferred };
    } else if (MediaRecorder.isTypeSupported?.('video/webm; codecs=vp8')) {
      options = { mimeType: 'video/webm; codecs=vp8' };
    } else {
      options = {}; // deixa o browser escolher
    }

    recorder = new MediaRecorder(stream, options);

    recorder.ondataavailable = (e) => { if (e.data && e.data.size > 0) chunks.push(e.data); };
    recorder.onstop = exportVideo;

    recorder.start();

    startTime = Date.now();
    timerId = setInterval(updateTimer, 1000);

    btnAction.innerText = "Parar gravação";
    statusTxt.innerText = "GRAVANDO...";

    const event = new CustomEvent('startCaptura', { detail: true });
    window.dispatchEvent(event);
  }

  function stopRec() {
    try {
      // para o MediaRecorder (se estiver gravando)
      if (recorder && recorder.state !== "inactive") {
        recorder.stop();
      }
    } catch (e) {
      console.warn("Erro ao parar recorder:", e);
    }

    // para o cronômetro
    if (timerId) clearInterval(timerId);
    timerId = null;
    startTime = null;

    // PARA TUDO (tela + microfone)
    if (stream) {
      stream.getTracks().forEach(track => {
        try { track.stop(); } catch (e) { }
      });
      stream = null;
    }

    // reset do recorder
    recorder = null;

    // UI Reset
    btnAction.disabled = true;
    btnInit.disabled = false;

    btnAction.innerText = "2. Iniciar Gravação";
    statusTxt.innerText = "Aguardando Configuração";

    timerDisplay.innerText = "00:00:00";

    micStatus.innerText = "🎤 Microfone: Pendente";
    micStatus.style.color = "#111827";

    const event = new CustomEvent('startCaptura', { detail: false });
    window.dispatchEvent(event);
    btnInit.removeEventListener('click', {});
  }

  function updateTimer() {
    if (!startTime) return;
    const elapsed = Date.now() - startTime;
    const d = new Date(elapsed);
    const h = String(d.getUTCHours()).padStart(2, '0');
    const m = String(d.getUTCMinutes()).padStart(2, '0');
    const s = String(d.getUTCSeconds()).padStart(2, '0');
    timerDisplay.innerText = `${h}:${m}:${s}`;
  }

  function exportVideo() {
    const blob = new Blob(chunks, { type: 'video/webm' });
    const file = new File([blob], `captura-${Date.now()}.webm`, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);

    const event = new CustomEvent('capturaFinalizada', {
      detail: { blob, file, url }
    });
    window.dispatchEvent(event);

    statusTxt.innerText = "Vídeo enviado para o chamado!";
    timerDisplay.innerText = "00:00:00";
  }
}
