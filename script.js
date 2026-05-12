(function(){
  const modal = document.getElementById('videoModal');
  const modalPanel = document.getElementById('modalPanel');
  const modalVideo = document.getElementById('modalVideo');
  const modalTitle = document.getElementById('modalTitle');
  const closeModalBtn = document.getElementById('closeModal');
  document.querySelectorAll('.open-video').forEach((button) => {
    button.addEventListener('click', () => {
      if (!modal) return;
      const src = button.getAttribute('data-video');
      const title = button.getAttribute('data-title') || 'Video';
      const ratio = button.getAttribute('data-ratio') || 'landscape';
      modalTitle.textContent = title;
      modalVideo.className = `modal-video ${ratio}`;
      modalPanel.className = 'modal-panel';
      if (ratio === 'portrait') modalPanel.classList.add('portrait');
      if (ratio === 'square') modalPanel.classList.add('square');
      modalVideo.innerHTML = `<iframe src="${src}" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    });
  });
  function closeModal(){
    if (!modal) return;
    modal.classList.remove('show');
    document.body.style.overflow = '';
    if (modalVideo) modalVideo.innerHTML = '';
  }
  closeModalBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', e => { if(e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });

  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  function setTab(target){
    tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === target));
    tabPanels.forEach(panel => panel.classList.toggle('active', panel.id === target));
    const url = new URL(window.location.href);
    if (url.searchParams.get('tab') !== target) {
      url.searchParams.set('tab', target);
      history.replaceState(null, '', url.toString());
    }
  }
  tabButtons.forEach(button => button.addEventListener('click', () => setTab(button.dataset.tab)));
  const tabParam = new URLSearchParams(window.location.search).get('tab');
  if (tabParam && document.getElementById(tabParam)) setTab(tabParam);

  const serviceType = document.getElementById('serviceType');
  const videoFields = document.querySelectorAll('.video-field');
  const webFields = document.querySelectorAll('.web-field');
  const priceForm = document.getElementById('priceForm');
  const estimatePrice = document.getElementById('estimatePrice');
  const quoteLink = document.getElementById('quoteLink');
  function valueOf(id){ return Number(document.getElementById(id)?.value || 0); }
  function updateEstimate(){
    if (!serviceType || !estimatePrice) return;
    const isVideo = serviceType.value === 'video';
    videoFields.forEach(field => field.classList.toggle('hidden', !isVideo));
    webFields.forEach(field => field.classList.toggle('hidden', isVideo));
    let total = 0;
    if (isVideo) total = valueOf('videoLength') + valueOf('filming') + valueOf('editLevel') + valueOf('graphics');
    else total = valueOf('webPackage') + valueOf('webRevision');
    estimatePrice.textContent = `£${total}`;
    const notes = document.getElementById('notes')?.value.trim() || '';
    const subject = encodeURIComponent('Cut by Chip Quote Request');
    const service = isVideo ? 'Video Editing' : 'Website Design';
    const body = encodeURIComponent(`Hi Chip,\n\nI’d like a quote for: ${service}\nGuide price shown: £${total}\n\nProject notes:\n${notes || '[Add project notes here]'}\n\nPlease can you give me a bespoke quote?`);
    if (quoteLink) quoteLink.href = `mailto:jameschipbutt@hotmail.com?subject=${subject}&body=${body}`;
  }
  serviceType?.addEventListener('change', updateEstimate);
  priceForm?.addEventListener('input', updateEstimate);
  priceForm?.addEventListener('change', updateEstimate);
  updateEstimate();

  const contactForm = document.getElementById('contactForm');
  contactForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('name')?.value.trim() || '';
    const email = document.getElementById('email')?.value.trim() || '';
    const service = document.getElementById('service')?.value.trim() || '';
    const message = document.getElementById('message')?.value.trim() || '';
    const subject = encodeURIComponent(`Cut by Chip enquiry${service ? ' - ' + service : ''}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nService: ${service}\n\nProject details:\n${message}`);
    window.location.href = `mailto:jameschipbutt@hotmail.com?subject=${subject}&body=${body}`;
  });
})();
