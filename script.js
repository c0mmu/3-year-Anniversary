// 로고 클릭 이벤트
document.getElementById('logo').addEventListener('click', () => {
  document.getElementById('logo-screen').classList.add('hidden');
  document.getElementById('calendar-screen').classList.remove('hidden');
});

// Countdown Timer
const countdownElement = document.getElementById('countdown');
const targetDate = new Date(2025, 4, 14, 0, 0, 0); // May 14, 2025

function updateCountdown() {
  const now = new Date();
  let difference = targetDate - now;

  if (difference > 0) {
    const months = targetDate.getMonth() - now.getMonth() + (12 * (targetDate.getFullYear() - now.getFullYear()));
    const days = Math.floor(difference / (1000 * 60 * 60 * 24)) % 30; // Approximation for days in a month
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    countdownElement.textContent = `${months}m ${days}d ${hours}h ${minutes}m ${seconds}s`;
  } else {
    countdownElement.textContent = "The countdown is over!";
  }
}

setInterval(updateCountdown, 1000);

// Generate Calendar for 30 Days
const calendar = document.querySelector('.calendar');
const messages = Array.from({ length: 30 }, (_, i) => `Message for Day ${i + 1}`);

for (let i = 1; i <= 30; i++) {
  const door = document.createElement('div');
  door.className = 'door';

  const front = document.createElement('div');
  front.className = 'front';
  front.textContent = i;

  const back = document.createElement('div');
  back.className = 'back';

  const message = document.createElement('p');
  message.textContent = messages[i - 1];
  back.appendChild(message);

  door.appendChild(front);
  door.appendChild(back);

  door.addEventListener('click', () => {
    showPopup(`image/day${i}.png`, `Day ${i} Image`);
  });

  calendar.appendChild(door);
}

// Popup Function
function showPopup(imageSrc, altText) {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';

  const popup = document.createElement('div');
  popup.className = 'popup';

  const img = document.createElement('img');
  img.src = imageSrc;
  img.alt = altText;

  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Close';
  closeBtn.className = 'close-btn';
  closeBtn.addEventListener('click', () => {
    document.body.removeChild(overlay);
  });

  popup.appendChild(img);
  popup.appendChild(closeBtn);
  overlay.appendChild(popup);
  document.body.appendChild(overlay);
}
