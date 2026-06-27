module.exports = ({ css, gifBase64 }) => {
  const init = () => {
    if (document.getElementById('demo-notification-styles')) return;

    const style = document.createElement('style');
    style.id = 'demo-notification-styles';
    style.textContent = css;
    document.head.appendChild(style);

    const wrapper = document.createElement('div');
    wrapper.id = 'demoNotificationWrapper';
    wrapper.style.pointerEvents = 'none';
    document.body.appendChild(wrapper);

    window.demoNotification = {
      show: (text) => {
        const wrapperEl = document.getElementById('demoNotificationWrapper');
        if (!wrapperEl) return;
        const el = document.createElement('div');
        el.className = 'demo-notification';
        el.innerHTML = `<img class="avatar" src="${gifBase64}" /><div class="box"><div class="nameplate">SYSTEM</div><div class="msg"></div></div>`;
        el.querySelector('.msg').textContent = text;
        wrapperEl.appendChild(el);
        requestAnimationFrame(() => el.classList.add('show'));
        setTimeout(() => el.remove(), 10000);
      }
    };
  };

  // If page is already loaded, run immediately. If not, wait for event.
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    window.addEventListener('DOMContentLoaded', init);
  }
};
