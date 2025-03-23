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

// 4월 15일 시작 → 앞에 두 칸 빈 칸
for (let j = 0; j < 2; j++) {
  const emptyDiv = document.createElement('div');
  emptyDiv.className = 'day';
  emptyDiv.style.visibility = 'hidden';
  grid.appendChild(emptyDiv);
}

// 캘린더 생성
for (let i = 0; i < 30; i++) {
  const dayBtn = document.createElement('div');
  dayBtn.className = 'day';

  // 아이콘
  const iconImg = document.createElement('img');
  iconImg.src = `icons/${iconImages[i]}`;
  iconImg.className = 'icon-img';
  dayBtn.appendChild(iconImg);

  // 날짜 텍스트
  const dateObj = new Date(2025, 3, 15 + i); // 4월 = 3월
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const dayNumber = document.createElement('span');
  dayNumber.textContent = `${month}월 ${day}일`;
  dayBtn.appendChild(dayNumber);

  // === 클릭 이벤트 ===
  if (openedDays[i]) {
    dayBtn.classList.add('opened');
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

    // === 이미지 1~8장 랜덤 확장자 ===
    let hasContent = false;
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

      // Swiper 초기화
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

    // Swiper 이미지만 있어도 초기화
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

  grid.appendChild(dayBtn);
}

// 모달 닫기
closeBtn.onclick = function () {
  modal.style.display = 'none';
};
