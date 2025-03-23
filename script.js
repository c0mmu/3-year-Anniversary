const grid = document.getElementById('calendar-grid');
let openedDays = JSON.parse(localStorage.getItem('openedDays')) || Array(30).fill(false);
const music = document.getElementById('bg-music');

// 한국 시간 계산
function getKoreaDate() {
  const utc = new Date().getTime() + (new Date().getTimezoneOffset() * 60000);
  return new Date(utc + 9 * 60 * 60 * 1000);
}

// 고정된 아이콘 이미지
const iconImages = [
  '에비님1.png', '에비님2.png', '에비씨님1.png', '에비씨님2.png', '에비씨님3.png', '에비씨님4.png',
  '에비님1.png', '에비님2.png', '에비씨님1.png', '에비씨님2.png', '에비씨님3.png', '에비씨님4.png',
  '에비님1.png', '에비님2.png', '에비씨님1.png', '에비씨님2.png', '에비씨님3.png', '에비씨님4.png',
  '에비님1.png', '에비님2.png', '에비씨님1.png', '에비씨님2.png', '에비씨님3.png', '에비씨님4.png',
  '에비님1.png', '에비님2.png', '에비씨님1.png', '에비씨님2.png', '에비씨님3.png', '에비씨님4.png'
];

// 모달 요소
const modal = document.getElementById('image-modal');
const modalContent = document.getElementById('modal-img');
const closeBtn = document.getElementById('close-btn');

// 캘린더 생성
for (let i = 0; i < 30; i++) {
  const dayBtn = document.createElement('div');
  dayBtn.className = 'day';

  // 아이콘
  const iconImg = document.createElement('img');
  iconImg.src = `icons/${iconImages[i]}`;
  iconImg.className = 'icon-img';
  dayBtn.appendChild(iconImg);

  const dayNumber = document.createElement('span');
  dayNumber.textContent = i + 1;
  dayBtn.appendChild(dayNumber);

  // 팝업 클릭 이벤트
  iconImg.addEventListener('click', (e) => {
    e.stopPropagation();
    modal.style.display = 'flex';
    modalContent.innerHTML = '';

    for (let count = 1; count <= 8; count++) {
      const baseFile = `icons/day${i + 1}_${count}`;
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';

      const img = document.createElement('img');
      img.style.width = '80%';
      img.style.margin = '10px';

      // 확장자 순서대로 시도
      const extensions = ['.png', '.jpg', '.gif'];
      let extIndex = 0;

      const tryLoad = () => {
        if (extIndex >= extensions.length) {
          slide.remove(); // 모두 실패 시 슬라이드 제거
          return;
        }
        img.src = `${baseFile}${extensions[extIndex]}`;
        img.onerror = () => {
          extIndex++;
          tryLoad(); // 다음 확장자 재시도
        };
      };

      tryLoad(); // 첫 시도 시작

      slide.appendChild(img);
      modalContent.appendChild(slide);
    }

    // Swiper 초기화 (기존 인스턴스 제거)
    setTimeout(() => {
      if (window.swiperInstance) {
        window.swiperInstance.destroy(true, true);
      }
      window.swiperInstance = new Swiper('.swiper', {
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        loop: true,
      });
    }, 300);
  });

  // 날짜 제한
  const today = getKoreaDate();
  const month = today.getMonth() + 1;
  const date = today.getDate();

  if (month !== 3 || (month === 3 && date < i + 1)) {
    dayBtn.style.opacity = '0.5';
    dayBtn.style.cursor = 'not-allowed';
  } else {
    if (openedDays[i]) {
      dayBtn.classList.add('opened');
    }

    if (!openedDays[i] && date === i + 1) {
      setTimeout(() => {
        dayBtn.classList.add('opened');
        openedDays[i] = true;
        localStorage.setItem('openedDays', JSON.stringify(openedDays));
      }, 500);
    }

    dayBtn.addEventListener('click', () => {
      if (!openedDays[i]) {
        openedDays[i] = true;
        dayBtn.classList.add('opened');
        localStorage.setItem('openedDays', JSON.stringify(openedDays));
        alert(`📅 March ${i + 1} Unlocked!`);
      }
    });
  }

  grid.appendChild(dayBtn);
}

// 모달 닫기
closeBtn.onclick = function() {
  modal.style.display = 'none';
};
