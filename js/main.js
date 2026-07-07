(() => {
    const authKey = "nekingx-auth-state";
    const authRoots = document.querySelectorAll(".auth-logged-in, .auth-logged-out");

    const setAuthState = (loggedIn) => {
        authRoots.forEach((root) => {
            root.classList.toggle("auth-logged-in", loggedIn);
            root.classList.toggle("auth-logged-out", !loggedIn);
        });
    };

    const isLoggedIn = window.localStorage.getItem(authKey) === "logged-in";
    setAuthState(isLoggedIn);

    document.querySelectorAll(".login-form, .register-form").forEach((form) => {
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            window.localStorage.setItem(authKey, "logged-in");
            window.location.href = "index.html";
        });
    });

    document.querySelectorAll(".drawer-logout").forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            window.localStorage.removeItem(authKey);
            setAuthState(false);
            document.querySelectorAll(".nav-drawer-toggle").forEach((toggle) => {
                toggle.checked = false;
            });
        });
    });

    const gameTitle = document.querySelector("[data-game-title]");
    if (gameTitle) {
        const gameNames = {
            aviator: "Aviator",
            dice: "Dice",
            goal: "Goal",
            hilo: "Hi Lo",
            hotline: "Hotline",
            keno: "Keno",
            mines: "Mines",
            "mini-roulette": "Mini Roulette",
            plinko: "Plinko",
            "chicken-route": "Chicken Route",
            "vortex-powerplay": "Vortex Powerplay",
            "vortex-2": "Vortex 2",
            "vortex-safari": "Vortex Safari",
            "doggo-balloon": "Doggo Balloon",
            "vortex-halloween": "Vortex Halloween",
            "chicken-route-2": "Chicken Route",
            "tap-pinata": "Tap Pinata",
            mysteco: "Mysteco",
            "rings-of-olympus": "Rings of Olympus",
            "cricket-boom": "Cricket Boom",
            catanza: "Catanza",
            "jewel-clicker": "Jewel Clicker",
            pumpedx: "Pumped X",
            "donny-king": "Donny King",
            "crystal-poker": "Crystal Poker",
            "book-of": "Book Of",
            "itap-mines": "iTap Mines",
            vortex: "Vortex",
            aero: "Aero",
            bubbles: "Bubbles",
            "jewel-clicker-2": "Jewel Clicker",
            "fst-fielder": "FST Fielder",
            "wicket-blast": "Wicket Blast",
            "spin-strike": "Spin Strike",
            "hi-lo": "Hi Lo",
            "fruit-towers": "Fruit Towers"
        };
        const params = new URLSearchParams(window.location.search);
        const game = params.get("game") || "aviator";
        gameTitle.textContent = gameNames[game] || "Aviator";
        document.title = `${gameTitle.textContent} - NEKINGX`;

        const casinoGames = new Set([
            "chicken-route", "vortex-powerplay", "vortex-2", "vortex-safari",
            "doggo-balloon", "vortex-halloween", "chicken-route-2", "tap-pinata",
            "mysteco", "rings-of-olympus", "cricket-boom", "catanza",
            "jewel-clicker", "pumpedx", "donny-king", "crystal-poker",
            "book-of", "itap-mines", "vortex", "aero", "bubbles",
            "jewel-clicker-2", "fst-fielder", "wicket-blast", "spin-strike",
            "hi-lo", "fruit-towers"
        ]);
        const crashNav = document.querySelector(".detail-crash-nav");
        const casinoNav = document.querySelector(".detail-casino-nav");
        if (casinoGames.has(game) && crashNav && casinoNav) {
            crashNav.classList.remove("active");
            casinoNav.classList.add("active");
        }
    }

    const sliders = document.querySelectorAll("[data-slider]");

    sliders.forEach((slider) => {
        const slides = Array.from(slider.querySelectorAll(".hero-slides img"));
        const dots = Array.from(slider.querySelectorAll(".hero-slider-dots button"));
        let activeIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains("active")));
        let timer = null;

        const showSlide = (index) => {
            activeIndex = (index + slides.length) % slides.length;
            slides.forEach((slide, slideIndex) => {
                slide.classList.toggle("active", slideIndex === activeIndex);
            });
            dots.forEach((dot, dotIndex) => {
                dot.classList.toggle("active", dotIndex === activeIndex);
            });
        };

        const start = () => {
            window.clearInterval(timer);
            timer = window.setInterval(() => showSlide(activeIndex + 1), 4000);
        };

        dots.forEach((dot, dotIndex) => {
            dot.addEventListener("click", () => {
                showSlide(dotIndex);
                start();
            });
        });

        if (slides.length > 1) {
            showSlide(activeIndex);
            start();
        }
    });

    // Welcome Promotion Popup logic
    const welcomePopup = document.getElementById("welcomePopup");
    const welcomePopupCard = document.getElementById("welcomePopupCard");
    const closeWelcomePopupBtn = document.getElementById("closeWelcomePopup");
    const popupBetNowBtn = document.getElementById("popupBetNowBtn");
    const dontShowPopupTodayCheckbox = document.getElementById("dontShowPopupToday");

    if (welcomePopup && welcomePopupCard) {
        const getLocalDateString = () => {
            const d = new Date();
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const hidePopupTodayKey = "nekingx-hide-popup-date";

        const showPopup = () => {
            welcomePopup.classList.remove("hidden");
            welcomePopup.classList.add("flex");
            void welcomePopup.offsetWidth; // Force reflow
            welcomePopup.classList.add("opacity-100");
            welcomePopupCard.classList.add("scale-100", "opacity-100");
            welcomePopupCard.classList.remove("scale-95", "opacity-0");
        };

        const hidePopup = () => {
            welcomePopup.classList.remove("opacity-100");
            welcomePopupCard.classList.remove("scale-100", "opacity-100");
            welcomePopupCard.classList.add("scale-95", "opacity-0");

            setTimeout(() => {
                welcomePopup.classList.remove("flex");
                welcomePopup.classList.add("hidden");
            }, 300);

            if (dontShowPopupTodayCheckbox && dontShowPopupTodayCheckbox.checked) {
                localStorage.setItem(hidePopupTodayKey, getLocalDateString());
            }
        };

        const savedDate = localStorage.getItem(hidePopupTodayKey);
        const todayDate = getLocalDateString();

        if (savedDate !== todayDate) {
            setTimeout(showPopup, 800);
        }

        if (closeWelcomePopupBtn) {
            closeWelcomePopupBtn.addEventListener("click", hidePopup);
        }

        if (popupBetNowBtn) {
            popupBetNowBtn.addEventListener("click", hidePopup);
        }

        welcomePopup.addEventListener("click", (event) => {
            if (event.target === welcomePopup) {
                hidePopup();
            }
        });
    }
})();
