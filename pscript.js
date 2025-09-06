  // Navbar background on scroll
  const nav = document.querySelector('.navbar');
  const handleNav = ()=> nav.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', handleNav); handleNav();

  // Animated counters
  const counters = document.querySelectorAll('.stat');
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const el = entry.target;
        const end = parseInt(el.dataset.count,10);
        let cur = 0;
        const step = Math.max(1, Math.round(end/60));
        const tick = setInterval(()=>{
          cur += step;
          if(cur >= end){ cur = end; clearInterval(tick); }
          el.textContent = cur.toLocaleString();
        }, 20);
        obs.unobserve(el);
      }
    });
  },{threshold:.4});
  counters.forEach(c=>obs.observe(c));

  // Notices ticker (duplicate list for seamless loop)
  (function(){
    const list = document.getElementById('noticeList');
    if(!list) return;
    const clone = list.cloneNode(true);
    list.parentNode.appendChild(clone);
    const items = list.querySelectorAll('li').length;
    const duration = Math.max(12, items * 2);
    list.style.animationDuration = duration + 's';
    clone.style.animation = list.style.animation = `tickerMove ${duration}s linear infinite`;
  })();

  // Gallery modal
  const lb = document.getElementById('lightbox');
  if(lb){
    lb.addEventListener('show.bs.modal', (e)=>{
      const trigger = e.relatedTarget;
      const src = trigger?.getAttribute('data-src');
      document.getElementById('lightboxImg').src = src || '';
    });
  }

  // Year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // ======== Chatbot UI + Backend call to /api/chat ========
  const chatToggle = document.getElementById('chatToggle');
  const chatPanel  = document.getElementById('chatbotPanel');
  const closeChat  = document.getElementById('closeChat');
  const chatBody   = document.getElementById('chatBody');
  const chatInput  = document.getElementById('chatInput');
  const sendBtn    = document.getElementById('sendBtn');

  const messages = [
    { role: "system", content: "You are HIET campus assistant. Keep answers short and helpful. If asked policy or contact, use the page content and general knowledge. If not sure, ask the user to check official sources." }
  ];

  function appendMsg(text, who='bot'){
    const div = document.createElement('div');
    div.className = 'chat-msg ' + (who==='user'?'user':'bot');
    div.textContent = text;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function appendTyping(){
    const t = document.createElement('div');
    t.className = 'typing text-white-50';
    t.id = 'typing';
    t.textContent = 'Assistant is typing...';
    chatBody.appendChild(t);
    chatBody.scrollTop = chatBody.scrollHeight;
  }
  function removeTyping(){
    const t = document.getElementById('typing'); if(t) t.remove();
  }

  // Demo chatbot - simple FAQ responses without backend
async function sendToBackend(userText){
  messages.push({ role:'user', content: userText.toLowerCase() });

  appendTyping();

  setTimeout(()=>{
    removeTyping();
    let reply = "I'm not sure about that. Please contact the admin office.";

    if(userText.toLowerCase().includes("placement")){
      reply = "Our students are placed in TCS, Infosys, Wipro, HCL, Accenture and more!";
    } 
    else if(userText.toLowerCase().includes("department")){
      reply = "We have CSE, Mechanical, Civil, ECE, BBA, BCA, BHM and Applied Sciences.";
    } 
    else if(userText.toLowerCase().includes("contact")){
      reply = "You can reach us at info@hiet.ac.in or call +91 9876543210.";
    } 
    else if(userText.toLowerCase().includes("event")){
      reply = "Upcoming events: Tech Fest 2025 and Industry Seminar Series!";
    } 
      else if(userText.toLowerCase().includes("admission")){
      reply = "Please contact us on our SocialS !";
    } 
    else if(userText.toLowerCase().includes("hi") || userText.toLowerCase().includes("hello")){
      reply = "Hello! I'm your HIET assistant 🤖. Ask me about placements, departments, events, or contact info.";
    }

    messages.push({ role:'assistant', content: reply });
    appendMsg(reply, 'bot');
  }, 600);
}


  function handleSend(){
    const text = chatInput.value.trim();
    if(!text) return;
    appendMsg(text, 'user');
    chatInput.value = '';
    sendToBackend(text);
  }

  chatToggle.addEventListener('click', ()=>{ chatPanel.style.display='flex'; });
  closeChat.addEventListener('click', ()=>{ chatPanel.style.display='none'; });
  sendBtn.addEventListener('click', handleSend);
  chatInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter') handleSend(); });