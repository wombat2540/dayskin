// 전역 변수
let isScrolling = false;
const sections = document.querySelectorAll('.section');
const navBtns = document.querySelectorAll('.gnb-btn');
const indicators = document.querySelectorAll('.indicator-dot');

// 슬라이딩 박스 위치 업데이트 함수 - 타이밍 조정
function updateSlidingBox(activeId) {
    const activeBtn = document.querySelector(`.gnb-btn[data-section="${activeId}"]`);
    const gnb = document.querySelector('.gnb');

    if (activeBtn && gnb) {
        const currentLeft = gnb.style.getPropertyValue('--slide-left') || '0px';
        const currentWidth = gnb.style.getPropertyValue('--slide-width') || '0px';

        const leftPosition = activeBtn.offsetLeft;
        const width = activeBtn.offsetWidth;

        // 현재 위치를 시작점으로 설정
        gnb.style.setProperty('--start-left', currentLeft);
        gnb.style.setProperty('--start-width', currentWidth);
        gnb.style.setProperty('--slide-left', `${leftPosition}px`);
        gnb.style.setProperty('--slide-width', `${width}px`);

        // 애니메이션 실행
        gnb.classList.remove('animating');
        setTimeout(() => {
            gnb.classList.add('animating');
        }, 10);

        // 애니메이션 완료 후 클래스 제거
        setTimeout(() => {
            gnb.classList.remove('animating');
        },600);
    }
}

// 활성 상태 업데이트 함수
function updateActiveStates(activeId) {
    // 섹션 활성화
    sections.forEach(section => {
        if (section.id === activeId) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });

    // 네비게이션 버튼 활성화
    navBtns.forEach(btn => {
        if (btn.getAttribute('data-section') === activeId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // 슬라이딩 박스 위치 업데이트
    updateSlidingBox(activeId);

    // 인디케이터 활성화
    indicators.forEach(indicator => {
        if (indicator.getAttribute('data-target') === activeId) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

// 네비게이션 버튼 클릭 이벤트
navBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const targetId = btn.getAttribute('data-section');
        const targetSection = document.getElementById(targetId);
        const currentActiveSection = document.querySelector('.section.active');

        if (targetSection && currentActiveSection && currentActiveSection.id !== targetId) {
            isScrolling = true;
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            updateActiveStates(targetId);

            setTimeout(() => {
                isScrolling = false;
            }, 1000);
        } else if (targetSection) {
            updateActiveStates(targetId);
        }
    });
});

// 인디케이터 클릭 이벤트
indicators.forEach(indicator => {
    indicator.addEventListener('click', () => {
        const targetId = indicator.getAttribute('data-target');
        const targetSection = document.getElementById(targetId);
        const currentActiveSection = document.querySelector('.section.active');

        if (targetSection && currentActiveSection && currentActiveSection.id !== targetId) {
            isScrolling = true;
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            updateActiveStates(targetId);

            setTimeout(() => {
                isScrolling = false;
            }, 1000);
        } else if (targetSection) {
            updateActiveStates(targetId);
        }
    });
});

// 스크롤 감지로 활성 섹션 추적
function handleScroll() {
    if (isScrolling) return;

    const scrollPosition = window.scrollY + window.innerHeight / 2;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            const sectionId = section.id;

            // 현재 활성화된 섹션이 아닌 경우에만 업데이트
            if (!section.classList.contains('active')) {
                updateActiveStates(sectionId);
            }
        }
    });
}

// 스크롤 이벤트 리스너 (쓰로틀링 적용)
let scrollTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(handleScroll, 50);
});

// 키보드 내비게이션 (화살표 키) - 완성
document.addEventListener('keydown', (e) => {
    if (isScrolling) return;

    const currentActive = document.querySelector('.section.active');
    let targetSection = null;

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        targetSection = currentActive.nextElementSibling;
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        targetSection = currentActive.previousElementSibling;
    }

    if (targetSection && targetSection.classList.contains('section')) {
        isScrolling = true;
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        updateActiveStates(targetSection.id);

        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    }
});

// 섹션1 → 섹션2 애니메이션 효과
ScrollTrigger.create({
    trigger: "#home",
    start: "bottom 50%",
    onEnter: () => {
        const section2 = document.getElementById('skin_trouble');
        section2.classList.add('animate-in');
    },
    onLeaveBack: () => {
        const section2 = document.getElementById('skin_trouble');
        section2.classList.remove('animate-in');
    }
});

// 섹션2 → 섹션3 애니메이션 효과
ScrollTrigger.create({
    trigger: "#skin_trouble",
    start: "bottom 50%",
    onEnter: () => {
        const section3 = document.getElementById('with_dayskin');
        section3.classList.add('animate-in');
    },
    onLeaveBack: () => {
        const section3 = document.getElementById('with_dayskin');
        section3.classList.remove('animate-in');
    }
});

// 섹션3 → 섹션4 애니메이션 효과
ScrollTrigger.create({
    trigger: "#with_dayskin",
    start: "bottom 50%",
    onEnter: () => {
        const section4 = document.getElementById('skin_diagnosis');
        section4.classList.add('animate-in');
    },
    onLeaveBack: () => {
        const section4 = document.getElementById('skin_diagnosis');
        section4.classList.remove('animate-in');
    }
});

// 섹션4 → 섹션5 애니메이션 효과
ScrollTrigger.create({
    trigger: "#skin_diagnosis",
    start: "bottom 50%",
    onEnter: () => {
        const section5 = document.getElementById('diary');
        section5.classList.add('animate-in');
    },
    onLeaveBack: () => {
        const section5 = document.getElementById('diary');
        section5.classList.remove('animate-in');
    }
});

// 섹션5 → 섹션6 애니메이션 효과
ScrollTrigger.create({
    trigger: "#diary",
    start: "bottom 50%",
    onEnter: () => {
        const section6 = document.getElementById('subun_tree');
        section6.classList.add('animate-in');
    },
    onLeaveBack: () => {
        const section6 = document.getElementById('subun_tree');
        section6.classList.remove('animate-in');
    }
});

// 섹션6 → 섹션7 애니메이션 효과
ScrollTrigger.create({
    trigger: "#subun_tree",
    start: "bottom 50%",
    onEnter: () => {
        const section7 = document.getElementById('conmmunity');
        section7.classList.add('animate-in');
    },
    onLeaveBack: () => {
        const section7 = document.getElementById('conmmunity');
        section7.classList.remove('animate-in');
    }
});

// 섹션7 → 섹션8 애니메이션 효과
ScrollTrigger.create({
    trigger: "#conmmunity",
    start: "bottom 50%",
    onEnter: () => {
        const section8 = document.getElementById('download');
        section8.classList.add('animate-in');
    },
    onLeaveBack: () => {
        const section8 = document.getElementById('download');
        section8.classList.remove('animate-in');
    }
});

// 푸터 무한 파도타기 애니메이션
ScrollTrigger.create({
    trigger: "footer",
    start: "top 80%",
    onEnter: () => {
        const footerLogo = document.querySelector('.footer_logo');
        if (footerLogo) {
            footerLogo.classList.add('wave-animate');
        }
    },
    onLeaveBack: () => {
        const footerLogo = document.querySelector('.footer_logo');
        if (footerLogo) {
            footerLogo.classList.remove('wave-animate');
        }
    }
});

// 초기 로드 시 첫 번째 섹션 활성화
window.addEventListener('load', () => {
    updateActiveStates('home');
    // 초기 슬라이딩 박스 위치 설정
    setTimeout(() => {
        updateSlidingBox('home');
    }, 100);
});