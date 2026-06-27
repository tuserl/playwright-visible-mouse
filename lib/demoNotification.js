module.exports = (cssContent) => {
  window.addEventListener('DOMContentLoaded', () => {
    // Inject CSS
    const style = document.createElement('style');
    style.textContent = cssContent;
    document.head.appendChild(style);

    // Inject Wrapper
    if (!document.getElementById('demoNotificationWrapper')) {
      const wrapper = document.createElement('div');
      wrapper.id = 'demoNotificationWrapper';
      document.body.appendChild(wrapper);
    }

    // Define Global Show Function
    window.demoNotification = {
      show: (text) => {
        const wrapperEl = document.getElementById('demoNotificationWrapper');
        const el = document.createElement('div');
        el.className = 'demo-notification';
        el.innerHTML = `<div class="avatar"></div><div class="content"><div class="title">Test</div><div class="msg"></div></div>`;
        el.querySelector('.msg').textContent = text;
        wrapperEl.appendChild(el);
        requestAnimationFrame(() => el.classList.add('show'));
        setTimeout(() => el.remove(), 4000);
      }
    };
  });
};
