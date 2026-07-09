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
    setAuthState(document.querySelector(".profile-page, .dw-page") ? true : isLoggedIn);

    document.querySelectorAll(".login-form, .register-form").forEach((form) => {
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            window.localStorage.setItem(authKey, "logged-in");
            window.location.href = "index.html";
        });
    });

    const syncDrawerState = () => {
        const open = Boolean(document.querySelector(".nav-drawer-toggle:checked"));
        document.body.classList.toggle("drawer-open", open);
    };

    const bindDrawerControls = () => {
        document.querySelectorAll(".drawer-logout").forEach((button) => {
            if (button.dataset.drawerLogoutBound === "true") {
                return;
            }
            button.dataset.drawerLogoutBound = "true";
            button.addEventListener("click", (event) => {
                event.preventDefault();
                window.localStorage.removeItem(authKey);
                setAuthState(false);
                document.querySelectorAll(".nav-drawer-toggle").forEach((toggle) => {
                    toggle.checked = false;
                });
                syncDrawerState();
            });
        });

        document.querySelectorAll(".nav-drawer-toggle").forEach((toggle) => {
            if (toggle.dataset.drawerToggleBound === "true") {
                return;
            }
            toggle.dataset.drawerToggleBound = "true";
            toggle.addEventListener("change", syncDrawerState);
        });

        syncDrawerState();
    };

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") {
            return;
        }
        document.querySelectorAll(".nav-drawer-toggle:checked").forEach((toggle) => {
            toggle.checked = false;
        });
        syncDrawerState();
    });

    bindDrawerControls();
    window.addEventListener("nekingx:includes-loaded", bindDrawerControls);

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

    // ---- Profile / Personal Center: modals, sheets, avatar picker ----
    const profilePage = document.querySelector(".profile-page");
    if (profilePage) {
        const mobileRoot = document.querySelector(".profile-mobile");

        const setMobileView = (view) => {
            if (!mobileRoot) {
                return;
            }
            const next = view || "home";
            mobileRoot.setAttribute("data-m-view", next);

            mobileRoot.querySelectorAll(".profile-m-view, .profile-sheet").forEach((panel) => {
                const panelName = panel.getAttribute("data-m-panel");
                panel.classList.toggle("is-active", panelName === next);
            });

            if (next === "home" || next === "detail") {
                mobileRoot.querySelectorAll("[data-profile-root]").forEach((root) => {
                    root.classList.remove("avatar-editing");
                });
            }

            window.scrollTo(0, 0);
            mobileRoot.scrollTop = 0;
            const active = mobileRoot.querySelector(".profile-m-view.is-active, .profile-sheet.is-active");
            if (active) {
                active.scrollTop = 0;
                const body = active.querySelector(".profile-m-body, .profile-sheet-body");
                if (body) body.scrollTop = 0;
            }
        };

        if (mobileRoot) {
            setMobileView(mobileRoot.getAttribute("data-m-view") || "home");
        }

        document.querySelectorAll("[data-m-open]").forEach((trigger) => {
            trigger.addEventListener("click", (event) => {
                event.preventDefault();
                setMobileView(trigger.getAttribute("data-m-open") || "home");
            });
        });

        document.querySelectorAll("[data-m-logout]").forEach((button) => {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                window.localStorage.removeItem(authKey);
                window.location.href = "index.html";
            });
        });

        const openDialog = (name) => {
            const modal = document.getElementById("modal-" + name);
            if (modal) {
                modal.classList.add("is-open");
                document.body.style.overflow = "hidden";
            }
        };

        const closeDialog = (dialog) => {
            if (dialog) dialog.classList.remove("is-open");
            if (!document.querySelector(".profile-modal.is-open")) {
                document.body.style.overflow = "";
            }
        };

        document.querySelectorAll("[data-profile-open]").forEach((trigger) => {
            trigger.addEventListener("click", (event) => {
                event.preventDefault();
                openDialog(trigger.getAttribute("data-profile-open"));
            });
        });

        document.querySelectorAll("[data-profile-close]").forEach((btn) => {
            btn.addEventListener("click", (event) => {
                event.preventDefault();
                closeDialog(btn.closest("[data-profile-dialog]"));
            });
        });

        document.querySelectorAll(".profile-modal").forEach((modal) => {
            modal.addEventListener("click", (event) => {
                if (event.target === modal) closeDialog(modal);
            });
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                document.querySelectorAll(".profile-modal.is-open").forEach(closeDialog);
                if (mobileRoot && mobileRoot.querySelector(".profile-sheet.is-active")) {
                    setMobileView("detail");
                }
            }
        });

        // Avatar picker (inline swap within each profile root)
        document.querySelectorAll("[data-profile-root]").forEach((root) => {
            const target = root.querySelector("[data-avatar-target]");
            const preview = root.querySelector("[data-avatar-preview]");
            const grid = root.querySelector("[data-avatar-grid]");
            let pendingSrc = target ? target.getAttribute("src") : null;

            root.querySelectorAll("[data-avatar-edit]").forEach((btn) => {
                btn.addEventListener("click", (event) => {
                    event.preventDefault();
                    root.classList.add("avatar-editing");
                });
            });

            if (grid) {
                grid.querySelectorAll(".avatar-option").forEach((option) => {
                    option.addEventListener("click", () => {
                        grid.querySelectorAll(".avatar-option").forEach((o) => o.classList.remove("is-selected"));
                        option.classList.add("is-selected");
                        pendingSrc = option.getAttribute("data-avatar-src");
                        if (preview) preview.setAttribute("src", pendingSrc);
                    });
                });
            }

            const cancelBtn = root.querySelector("[data-avatar-cancel]");
            if (cancelBtn) {
                cancelBtn.addEventListener("click", () => {
                    root.classList.remove("avatar-editing");
                });
            }

            const saveBtn = root.querySelector("[data-avatar-save]");
            if (saveBtn) {
                saveBtn.addEventListener("click", () => {
                    if (target && pendingSrc) target.setAttribute("src", pendingSrc);
                    root.classList.remove("avatar-editing");
                });
            }
        });
    }

    // ---- Notice page tabs ----
    document.querySelectorAll(".notice-page").forEach((root) => {
        const setTab = (tab) => {
            const next = tab || "platform";
            root.setAttribute("data-notice-tab", next);
            root.querySelectorAll(".notice-tab").forEach((btn) => {
                const active = btn.getAttribute("data-notice-tab") === next;
                btn.classList.toggle("is-active", active);
                btn.setAttribute("aria-selected", active ? "true" : "false");
            });
            root.querySelectorAll(".notice-panel").forEach((panel) => {
                const active = panel.getAttribute("data-notice-panel") === next;
                panel.classList.toggle("is-active", active);
                if (active) {
                    panel.removeAttribute("hidden");
                } else {
                    panel.setAttribute("hidden", "");
                }
            });
        };

        root.querySelectorAll("[data-notice-tab]").forEach((btn) => {
            if (!btn.classList.contains("notice-tab")) {
                return;
            }
            btn.addEventListener("click", (event) => {
                event.preventDefault();
                setTab(btn.getAttribute("data-notice-tab"));
            });
        });

        root.querySelectorAll("[data-notice-mark-all]").forEach((btn) => {
            btn.addEventListener("click", (event) => {
                event.preventDefault();
                root.querySelectorAll(".notice-panel.is-active .notice-action:not(.is-read)").forEach((action) => {
                    action.classList.add("is-read");
                    action.innerHTML = 'READ <img src="/assets/figma-export/neking/notice-shield-tick.svg" alt="">';
                });
            });
        });

        root.querySelectorAll(".notice-action:not(.is-read)").forEach((action) => {
            action.addEventListener("click", () => {
                if (action.classList.contains("is-read")) {
                    return;
                }
                const label = action.textContent.includes("Collect") ? "READ" : "READ";
                action.classList.add("is-read");
                action.innerHTML = `${label} <img src="/assets/figma-export/neking/notice-shield-tick.svg" alt="">`;
            });
        });

        setTab(root.getAttribute("data-notice-tab") || "platform");
    });

    // ---- History Record tabs / ranges ----
    document.querySelectorAll(".history-page").forEach((root) => {
        const setTab = (tab) => {
            const next = tab || "transaction";
            root.setAttribute("data-history-tab", next);
            root.querySelectorAll(".history-tab").forEach((btn) => {
                const active = btn.getAttribute("data-history-tab") === next;
                btn.classList.toggle("is-active", active);
                btn.setAttribute("aria-selected", active ? "true" : "false");
            });
        };
        const setRange = (range) => {
            const next = range || "24h";
            root.setAttribute("data-history-range", next);
            root.querySelectorAll(".history-range-btn").forEach((btn) => {
                btn.classList.toggle("is-active", btn.getAttribute("data-history-range") === next);
            });
        };

        root.querySelectorAll(".history-tab").forEach((btn) => {
            btn.addEventListener("click", (event) => {
                event.preventDefault();
                setTab(btn.getAttribute("data-history-tab"));
            });
        });
        root.querySelectorAll(".history-range-btn").forEach((btn) => {
            btn.addEventListener("click", (event) => {
                event.preventDefault();
                setRange(btn.getAttribute("data-history-range"));
            });
        });

        setTab(root.getAttribute("data-history-tab") || "transaction");
        setRange(root.getAttribute("data-history-range") || "24h");
    });

    // ---- Affiliate page ----
    document.querySelectorAll(".affiliate-page").forEach((root) => {
        const setAffTab = (tab) => {
            const next = tab || "overview";
            root.setAttribute("data-aff-tab", next);
            root.querySelectorAll(".aff-tab, .aff-m-tab").forEach((btn) => {
                const active = btn.getAttribute("data-aff-tab") === next;
                btn.classList.toggle("is-active", active);
                if (btn.classList.contains("aff-tab")) {
                    btn.setAttribute("aria-selected", active ? "true" : "false");
                }
            });
            root.querySelectorAll(".aff-panel[data-aff-panel]").forEach((panel) => {
                const active = panel.getAttribute("data-aff-panel") === next;
                panel.classList.toggle("is-active", active);
                if (active) {
                    panel.removeAttribute("hidden");
                } else {
                    panel.setAttribute("hidden", "");
                }
            });
        };

        root.querySelectorAll("[data-aff-tab]").forEach((btn) => {
            if (!btn.classList.contains("aff-tab") && !btn.classList.contains("aff-m-tab")) {
                return;
            }
            btn.addEventListener("click", (event) => {
                event.preventDefault();
                setAffTab(btn.getAttribute("data-aff-tab"));
            });
        });

        root.querySelectorAll(".aff-qa-item .aff-qa-q").forEach((btn) => {
            btn.addEventListener("click", (event) => {
                event.preventDefault();
                const item = btn.closest(".aff-qa-item");
                if (item) {
                    item.classList.toggle("is-open");
                }
            });
        });

        root.querySelectorAll(".aff-copy, .aff-copy-btn").forEach((btn) => {
            btn.addEventListener("click", async (event) => {
                event.preventDefault();
                const text = btn.getAttribute("data-copy");
                if (!text) {
                    return;
                }
                try {
                    await navigator.clipboard.writeText(text);
                    const original = btn.getAttribute("aria-label") || btn.textContent || "Copy";
                    btn.setAttribute("aria-label", "Copied");
                    btn.classList.add("is-copied");
                    if (btn.classList.contains("aff-copy-btn")) {
                        btn.textContent = "COPIED";
                    }
                    window.setTimeout(() => {
                        btn.setAttribute("aria-label", original);
                        btn.classList.remove("is-copied");
                        if (btn.classList.contains("aff-copy-btn")) {
                            btn.textContent = "COPY";
                        }
                    }, 1500);
                } catch (err) {
                    console.error(err);
                }
            });
        });

        root.querySelectorAll(".aff-comm-expand").forEach((btn) => {
            btn.addEventListener("click", (event) => {
                event.preventDefault();
                const card = btn.closest(".aff-comm-table-card");
                if (!card) {
                    return;
                }
                const expanded = card.classList.toggle("is-expanded");
                btn.setAttribute("aria-expanded", expanded ? "true" : "false");
                const title = btn.querySelector(".aff-comm-expand-title");
                const sub = btn.querySelector(".aff-comm-expand-sub");
                if (title) {
                    title.textContent = expanded ? "Hide Stage 6-10" : "Show Stage 6-10";
                }
                if (sub) {
                    sub.textContent = expanded
                        ? "Click to collapse and hide more levels"
                        : "Click to expand and view more levels";
                }
            });
        });

        const openQrModal = () => {
            const modal = root.querySelector(".aff-qr-modal");
            if (modal) {
                modal.removeAttribute("hidden");
                document.body.style.overflow = "hidden";
            }
        };

        const closeQrModal = () => {
            const modal = root.querySelector(".aff-qr-modal");
            if (modal) {
                modal.setAttribute("hidden", "");
                if (!document.querySelector(".aff-qr-modal:not([hidden])")) {
                    document.body.style.overflow = "";
                }
            }
        };

        root.querySelectorAll(".aff-qr-trigger").forEach((trigger) => {
            trigger.addEventListener("click", (event) => {
                event.preventDefault();
                openQrModal();
            });
        });

        root.querySelectorAll("[data-aff-qr-close]").forEach((btn) => {
            btn.addEventListener("click", (event) => {
                event.preventDefault();
                closeQrModal();
            });
        });

        const setRewardTab = (tab) => {
            const next = tab || "referral";
            root.querySelectorAll(".aff-reward-subtab").forEach((btn) => {
                btn.classList.toggle("is-active", btn.getAttribute("data-aff-reward-tab") === next);
            });
            root.querySelectorAll(".aff-reward-panel[data-aff-reward-panel]").forEach((panel) => {
                const active = panel.getAttribute("data-aff-reward-panel") === next;
                panel.classList.toggle("is-active", active);
                if (active) {
                    panel.removeAttribute("hidden");
                } else {
                    panel.setAttribute("hidden", "");
                }
            });
        };

        root.querySelectorAll(".aff-reward-subtab").forEach((btn) => {
            btn.addEventListener("click", (event) => {
                event.preventDefault();
                setRewardTab(btn.getAttribute("data-aff-reward-tab"));
            });
        });

        root.querySelectorAll(".aff-date-btn").forEach((btn) => {
            btn.addEventListener("click", (event) => {
                event.preventDefault();
                root.querySelectorAll(".aff-date-btn").forEach((b) => {
                    b.classList.toggle("is-active", b === btn);
                });
            });
        });

        setAffTab(root.getAttribute("data-aff-tab") || "overview");
        setRewardTab("referral");
    });

    // ---- VIP Club page ----
    document.querySelectorAll(".vip-page").forEach((root) => {
        const carousel = root.querySelector("[data-vip-carousel]");
        const prevBtn = root.querySelector(".vip-arrow-prev");
        const nextBtn = root.querySelector(".vip-arrow-next");

        const getStep = () => {
            if (!carousel) return 250;
            const card = carousel.querySelector(".vip-level-card");
            if (!card) return 250;
            const styles = window.getComputedStyle(carousel);
            const gap = parseFloat(styles.columnGap || styles.gap || "20") || 20;
            return Math.round(card.getBoundingClientRect().width + gap);
        };

        const updateArrowState = () => {
            if (!carousel) return;
            const maxScroll = Math.max(0, carousel.scrollWidth - carousel.clientWidth);
            const left = carousel.scrollLeft;
            const atStart = left <= 2;
            const atEnd = left >= maxScroll - 2;
            if (prevBtn) {
                prevBtn.disabled = atStart;
                prevBtn.setAttribute("aria-disabled", atStart ? "true" : "false");
            }
            if (nextBtn) {
                nextBtn.disabled = atEnd || maxScroll <= 0;
                nextBtn.setAttribute("aria-disabled", atEnd || maxScroll <= 0 ? "true" : "false");
            }
        };

        if (carousel) {
            root.querySelectorAll("[data-vip-scroll]").forEach((btn) => {
                btn.addEventListener("click", (event) => {
                    event.preventDefault();
                    if (btn.disabled) return;
                    const dir = Number(btn.getAttribute("data-vip-scroll") || "1");
                    carousel.scrollBy({ left: dir * getStep(), behavior: "smooth" });
                });
            });

            carousel.addEventListener("scroll", updateArrowState, { passive: true });
            window.addEventListener("resize", updateArrowState);
            updateArrowState();

            // Mouse drag scroll (desktop preview); keep native touch swipe
            let isDown = false;
            let startX = 0;
            let startScroll = 0;
            let moved = false;

            carousel.addEventListener("mousedown", (event) => {
                if (event.button !== 0) return;
                isDown = true;
                moved = false;
                startX = event.pageX;
                startScroll = carousel.scrollLeft;
                carousel.classList.add("is-dragging");
            });

            const endDrag = () => {
                if (!isDown) return;
                isDown = false;
                carousel.classList.remove("is-dragging");
            };

            carousel.addEventListener("mousemove", (event) => {
                if (!isDown) return;
                event.preventDefault();
                const dx = event.pageX - startX;
                if (Math.abs(dx) > 3) moved = true;
                carousel.scrollLeft = startScroll - dx;
                updateArrowState();
            });

            carousel.addEventListener("mouseup", endDrag);
            carousel.addEventListener("mouseleave", endDrag);

            carousel.addEventListener("click", (event) => {
                if (moved) {
                    event.preventDefault();
                    event.stopPropagation();
                    moved = false;
                }
            }, true);
        }

        root.querySelectorAll(".vip-qa-item .vip-qa-q").forEach((btn) => {
            btn.addEventListener("click", (event) => {
                event.preventDefault();
                const item = btn.closest(".vip-qa-item");
                if (item) {
                    item.classList.toggle("is-open");
                }
            });
        });
    });

    document.querySelectorAll(".dw-page").forEach((root) => {
        const mode = root.getAttribute("data-dw-mode") || "deposit";
        const step1 = root.querySelector('[data-dw-step="1"]');
        const step2 = root.querySelector('[data-dw-step="2"]');
        const bankSelect = root.querySelector("[data-dw-bank-select]");
        const amountInput = root.querySelector("[data-dw-amount]");
        const modal = root.querySelector("[data-dw-modal]");
        const balance = 100;

        const showStep = (step) => {
            [step1, step2].forEach((el) => {
                if (!el) return;
                const active = el.getAttribute("data-dw-step") === String(step);
                el.classList.toggle("is-active", active);
                if (active) el.removeAttribute("hidden");
                else el.setAttribute("hidden", "");
            });
        };

        const setBank = (name) => {
            root.querySelectorAll("[data-dw-bank]").forEach((card) => {
                card.classList.toggle("is-selected", card.getAttribute("data-dw-bank") === name);
            });
            if (bankSelect) bankSelect.value = name;
        };

        const updateSummary = () => {
            if (!amountInput) return;
            const amount = Number(amountInput.value) || 0;
            const fee = amount > 0 ? 2 : 0;
            const total = Math.max(amount - fee, 0);
            const applyEl = root.querySelector(".dw-summary div:nth-child(1) strong");
            const feeEl = root.querySelector(".dw-summary div:nth-child(2) strong");
            const totalEl = root.querySelector(".dw-summary .dw-total strong");
            if (applyEl) applyEl.textContent = `RM ${amount.toFixed(2)}`;
            if (feeEl) feeEl.textContent = `RM ${fee.toFixed(2)}`;
            if (totalEl) totalEl.textContent = `RM ${total.toFixed(2)}`;
        };

        root.querySelectorAll("[data-dw-accordion-toggle]").forEach((btn) => {
            btn.addEventListener("click", (event) => {
                event.preventDefault();
                const item = btn.closest("[data-dw-accordion]");
                if (!item) return;
                const open = item.classList.toggle("is-open");
                const chevron = btn.querySelector(".dw-acc-chevron");
                if (chevron) {
                    chevron.src = open
                        ? "/assets/figma-export/neking/icon-chevron-up.svg"
                        : "/assets/figma-export/neking/icon-chevron-down.svg";
                }
            });
        });

        root.querySelectorAll("[data-dw-bank]").forEach((card) => {
            card.addEventListener("click", (event) => {
                event.preventDefault();
                const name = card.getAttribute("data-dw-bank") || "ABA BANK";
                setBank(name);
                showStep(2);
            });
        });

        root.querySelectorAll("[data-dw-quick]").forEach((btn) => {
            btn.addEventListener("click", (event) => {
                event.preventDefault();
                if (!amountInput) return;
                const kind = btn.getAttribute("data-dw-quick");
                let value = Number(amountInput.value) || 0;
                if (kind === "min") value = 3;
                else if (kind === "max") value = Math.min(100000, balance);
                else if (kind === "50") value = Math.max(3, Math.round(balance * 0.5 * 100) / 100);
                else if (kind === "75") value = Math.max(3, Math.round(balance * 0.75 * 100) / 100);
                amountInput.value = String(value);
                updateSummary();
            });
        });

        if (amountInput) {
            amountInput.addEventListener("input", updateSummary);
            updateSummary();
        }

        root.querySelectorAll("[data-dw-tab]").forEach((tab) => {
            tab.addEventListener("click", (event) => {
                event.preventDefault();
                const group = tab.parentElement;
                if (!group) return;
                group.querySelectorAll("[data-dw-tab]").forEach((el) => {
                    const on = el === tab;
                    el.classList.toggle("is-active", on);
                    el.setAttribute("aria-selected", on ? "true" : "false");
                });
            });
        });

        root.querySelectorAll("[data-dw-form]").forEach((form) => {
            form.addEventListener("submit", (event) => {
                event.preventDefault();
                if (mode === "deposit" && modal) {
                    modal.removeAttribute("hidden");
                    modal.classList.add("is-open");
                }
            });
        });

        root.querySelectorAll("[data-dw-modal-close]").forEach((el) => {
            el.addEventListener("click", (event) => {
                event.preventDefault();
                if (!modal) return;
                modal.setAttribute("hidden", "");
                modal.classList.remove("is-open");
            });
        });
    });
})();
