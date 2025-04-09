const grid = document.getElementById('calendar-grid');
let openedDays = JSON.parse(localStorage.getItem('openedDays')) || Array(30).fill(false);

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

// 한국 시간 계산
function getKoreaDate() {
  const utc = new Date().getTime() + (new Date().getTimezoneOffset() * 60000);
  return new Date(utc + 9 * 60 * 60 * 1000);
}

// D-day 칸 (두 칸 합치기)
const dDayDiv = document.createElement('div');
dDayDiv.className = 'day dday-cell';
dDayDiv.style.gridColumn = 'span 2'; // 두 칸 병합
dDayDiv.innerHTML = `
  <div id="d-day-text" class="d-day-text"></div>
  <div id="countdown-text" class="countdown-text"></div>
  <div class="anniv-text">3주년을 향하여</div>
`;
grid.appendChild(dDayDiv);


// === 캘린더 생성 ===
for (let i = 0; i < 30; i++) {
  const dayBtn = document.createElement('div');
  dayBtn.className = 'day';

  // 아이콘
  const iconImg = document.createElement('img');
  iconImg.src = `icons/${iconImages[i]}`;
  iconImg.className = 'icon-img';
  dayBtn.appendChild(iconImg);

  // 날짜 텍스트
  const dateObj = new Date(2025, 3, 15 + i);
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const dayNumber = document.createElement('span');
  dayNumber.textContent = `${month}월 ${day}일`;
  dayBtn.appendChild(dayNumber);

  // 날짜 제한
  const today = getKoreaDate();
  const targetDate = new Date(2025, 3, 15 + i);

  if (today < targetDate) {
    dayBtn.style.opacity = '0.5';
    dayBtn.style.cursor = 'not-allowed';
  } else {
    if (openedDays[i]) {
      dayBtn.classList.add('opened');
    }
    if (!openedDays[i] && today.toDateString() === targetDate.toDateString()) {
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
      }

      // 모달 열기
      modal.style.display = 'flex';
      modalContent.innerHTML = '';

      let hasContent = false;

      // === 이미지 시도 ===
      for (let count = 1; count <= 8; count++) {
        const baseFile = `icons/day${i + 1}_${count}`;
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';

        const img = document.createElement('img');
        img.style.width = '80%';
        img.style.margin = '10px';

        const extensions = ['.png', '.jpg', '.gif'];
        let extIndex = 0;

        const tryLoad = () => {
          if (extIndex >= extensions.length) {
            slide.remove();
            return;
          }
          img.src = `${baseFile}${extensions[extIndex]}`;
          img.onerror = () => {
            extIndex++;
            tryLoad();
          };
          img.onload = () => {
            hasContent = true;
          };
        };
        tryLoad();

        slide.appendChild(img);
        modalContent.appendChild(slide);
      }

      // === PDF 바로 로드 ===
      const pdfURL = `pdfs/day${i + 1}.pdf`;
      pdfjsLib.getDocument(pdfURL).promise.then(function (pdf) {
        hasContent = true;

        for (let p = 1; p <= pdf.numPages; p++) {
          const slide = document.createElement('div');
          slide.className = 'swiper-slide';
          slide.style.overflow = 'auto';
          slide.style.display = 'flex';
          slide.style.flexDirection = 'column';
          slide.style.alignItems = 'center';
          slide.style.padding = '20px';
          slide.style.backgroundColor = '#f9f9f9';
          slide.style.borderRadius = '8px';

          const canvas = document.createElement('canvas');
          slide.appendChild(canvas);
          modalContent.appendChild(slide);

          pdf.getPage(p).then(function (page) {
            const viewport = page.getViewport({ scale: 1 });
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            page.render({ canvasContext: context, viewport: viewport });
          });
        }

        setTimeout(() => {
          if (window.swiperInstance) {
            window.swiperInstance.destroy(true, true);
          }
          window.swiperInstance = new Swiper('.swiper', {
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            },
            loop: false,
          });
        }, 600);
      }).catch(() => {});

      setTimeout(() => {
        if (hasContent) {
          if (window.swiperInstance) {
            window.swiperInstance.destroy(true, true);
          }
          window.swiperInstance = new Swiper('.swiper', {
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            },
            loop: false,
          });
        } else {
          modalContent.innerHTML = '<p>해당 날짜에 표시할 미디어가 없습니다.</p>';
        }
      }, 700);
    });
  }

  grid.appendChild(dayBtn);
}

// 모달 닫기
closeBtn.onclick = function () {
  modal.style.display = 'none';
};

function updateDDay() {
  const now = new Date(new Date().getTime() + (new Date().getTimezoneOffset() * 60000) + 9 * 60 * 60 * 1000);
  const target = new Date(2025, 4, 14, 0, 0, 0); // 5월 14일 자정

  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const dDayText = document.getElementById('d-day-text');
  const countdownText = document.getElementById('countdown-text');

  if (diffDays > 0) {
    dDayText.textContent = `D-${diffDays}`;
  } else if (diffDays === 0) {
    dDayText.textContent = `🎉 오늘은 3주년! 🎉`;
  } else {
    dDayText.textContent = `3주년이 지났습니다`;
  }

  // 자정까지 카운트다운
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const remain = midnight - now;

  const hours = String(Math.floor((remain / (1000 * 60 * 60)) % 24)).padStart(2, '0');
  const minutes = String(Math.floor((remain / (1000 * 60)) % 60)).padStart(2, '0');
  const seconds = String(Math.floor((remain / 1000) % 60)).padStart(2, '0');

  countdownText.textContent = `-${hours}:${minutes}:${seconds}`;
}

updateDDay();
setInterval(updateDDay, 1000);
