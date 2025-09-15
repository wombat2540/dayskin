// 전역 변수
let isScrolling = false;
const sections = document.querySelectorAll('.section');
const navBtns = document.querySelectorAll('.gnb-btn');
const indicators = document.querySelectorAll('.indicator-dot');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const gnb = document.querySelector('.gnb');


// 모바일 메뉴 토글 기능
if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        gnb.classList.toggle('active');
        
        // 메뉴가 열린 상태에서 body 스크롤 방지
        if (gnb.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
}

// 모바일에서 메뉴 항목 클릭 시 메뉴 닫기
navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            mobileMenuToggle.classList.remove('active');
            gnb.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});


// 화면 크기 변경 시 메뉴 상태 초기화
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        mobileMenuToggle.classList.remove('active');
        gnb.classList.remove('active');
        document.body.style.overflow = '';
    }
});


// 슬라이딩 박스 위치 업데이트 함수 - 모바일에서는 비활성화
function updateSlidingBox(activeId) {
    // 모바일에서는 슬라이딩 박스 효과 비활성화
    if (window.innerWidth <= 768) return;
    
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
        }, 600);
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

    // 슬라이딩 박스 위치 업데이트 (데스크톱에서만)
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


// 스무스 스크롤 함수
function smoothScrollTo(targetSection) {
    if (!targetSection) return;
    
    isScrolling = true;
    window.removeEventListener('scroll', handleScroll);
    
    gsap.to(window, {
        duration: 0.6, // 1.2초
        scrollTo: {
            y: targetSection,
            offsetY: 0
        },
        ease: "power2.in", // 처음에 빠르게 시작, 끝에서 감속
        onComplete: () => {
            isScrolling = false;
            window.addEventListener('scroll', () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(handleScroll, 100);
            });
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
            smoothScrollTo(targetSection);
            updateActiveStates(targetId);
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
            smoothScrollTo(targetSection);
            updateActiveStates(targetId);
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
    const delay = window.innerWidth <= 768 ? 30 : 50; // 모바일에서는 더 빠른 반응
    scrollTimeout = setTimeout(handleScroll, delay);
});

// 키보드 내비게이션 (화살표 키) - 데스크톱에서만 활성화
document.addEventListener('keydown', (e) => {
    // 모바일에서는 키보드 내비게이션 비활성화
    if (window.innerWidth <= 768 || isScrolling) return;

    const currentActive = document.querySelector('.section.active');
    let targetSection = null;

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        targetSection = currentActive.nextElementSibling;
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        targetSection = currentActive.previousElementSibling;
    }

    if (targetSection && targetSection.classList.contains('section')) {
        smoothScrollTo(targetSection);
        updateActiveStates(targetSection.id);
    }
});

// 터치 이벤트 처리 (모바일 스와이프)
let touchStartY = 0;
let touchEndY = 0;

function handleTouchStart(e) {
    touchStartY = e.changedTouches[0].screenY;
}

function handleTouchEnd(e) {
    if (isScrolling) return;
    
    touchEndY = e.changedTouches[0].screenY;
    const touchDiff = touchStartY - touchEndY;
    
    // 최소 스와이프 거리
    const minSwipeDistance = 50;
    
    if (Math.abs(touchDiff) < minSwipeDistance) return;
    
    const currentActive = document.querySelector('.section.active');
    let targetSection = null;
    
    if (touchDiff > 0) {
        // 위로 스와이프 - 다음 섹션
        targetSection = currentActive.nextElementSibling;
    } else {
        // 아래로 스와이프 - 이전 섹션
        targetSection = currentActive.previousElementSibling;
    }
    
    if (targetSection && targetSection.classList.contains('section')) {
        smoothScrollTo(targetSection);
        updateActiveStates(targetSection.id);
    }
}

// 모바일에서만 터치 이벤트 활성화
if (window.innerWidth <= 768) {
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
}

// 윈도우 리사이즈 시 터치 이벤트 재설정
window.addEventListener('resize', () => {
    // 기존 터치 이벤트 제거
    document.removeEventListener('touchstart', handleTouchStart);
    document.removeEventListener('touchend', handleTouchEnd);
    
    // 모바일에서만 터치 이벤트 다시 활성화
    if (window.innerWidth <= 768) {
        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
});

// GSAP ScrollTrigger 애니메이션 - 반응형 대응
function createScrollTriggers() {
    // 기존 ScrollTrigger 제거
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    
    const isMobile = window.innerWidth <= 768;
    const triggerStart = isMobile ? "top 70%" : "bottom 50%";
    
    // 섹션1 → 섹션2 애니메이션 효과
    ScrollTrigger.create({
        trigger: "#home",
        start: triggerStart,
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
        start: triggerStart,
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
        start: triggerStart,
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
        start: triggerStart,
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
        start: triggerStart,
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
        start: triggerStart,
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
        start: triggerStart,
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
        start: isMobile ? "top 90%" : "top 80%",
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
}

// 초기 ScrollTrigger 생성
createScrollTriggers();

// 윈도우 리사이즈 시 ScrollTrigger 재생성
window.addEventListener('resize', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        createScrollTriggers();
        // 슬라이딩 박스 위치 재조정
        if (window.innerWidth > 768) {
            const activeSection = document.querySelector('.section.active');
            if (activeSection) {
                updateSlidingBox(activeSection.id);
            }
        }
    }, 250);
});

// 페이지 로드 시 초기화
window.addEventListener('load', () => {
    updateActiveStates('home');
    
    // 초기 슬라이딩 박스 위치 설정 (데스크톱에서만)
    if (window.innerWidth > 768) {
        setTimeout(() => {
            updateSlidingBox('home');
        }, 100);
    }
    
    // 로딩 후 ScrollTrigger 새로고침
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 500);
});

// 페이지 가시성 변경 시 처리 (모바일 브라우저 대응)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // 페이지가 다시 보일 때 ScrollTrigger 새로고침
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 100);
    }
});

// 모바일 주소창 높이 변경 대응
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});

// 성능 최적화: Intersection Observer를 사용한 섹션 감지 (선택사항)
if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
        if (isScrolling) return;
        
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                const sectionId = entry.target.id;
                if (!entry.target.classList.contains('active')) {
                    updateActiveStates(sectionId);
                }
            }
        });
    }, {
        threshold: [0.5],
        rootMargin: '-10% 0px -10% 0px'
    });
    
    // 모든 섹션 관찰 시작
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}