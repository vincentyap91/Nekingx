(() => {
    const includeCache = new Map();
    let includeIndex = 0;

    const authKey = "nekingx-auth-state";
    const casinoGames = new Set([
        "chicken-route", "vortex-powerplay", "vortex-2", "vortex-safari",
        "doggo-balloon", "vortex-halloween", "chicken-route-2", "tap-pinata",
        "mysteco", "rings-of-olympus", "cricket-boom", "catanza",
        "jewel-clicker", "pumpedx", "donny-king", "crystal-poker",
        "book-of", "itap-mines", "vortex", "aero", "bubbles",
        "jewel-clicker-2", "fst-fielder", "wicket-blast", "spin-strike",
        "hi-lo", "fruit-towers"
    ]);

    const pageName = () => {
        const name = window.location.pathname.split("/").pop();
        return name || "index.html";
    };

    const resolveIncludeUrl = (path) => {
        if (!path.startsWith("/")) {
            return path;
        }
        return path;
    };

    const fetchInclude = async (path) => {
        const url = resolveIncludeUrl(path);
        if (!includeCache.has(url)) {
            const response = await fetch(url, { cache: "no-cache" });
            if (!response.ok) {
                throw new Error(`Unable to include ${url}: ${response.status}`);
            }
            includeCache.set(url, await response.text());
        }
        return includeCache.get(url);
    };

    const selectVariant = (html, variant) => {
        if (!variant) {
            return html;
        }

        const doc = new DOMParser().parseFromString(html, "text/html");
        const template = doc.querySelector(`template[data-component-variant="${variant}"]`);
        return template ? template.innerHTML.trim() : html;
    };

    const loadIncludes = async (root = document) => {
        const placeholders = Array.from(root.querySelectorAll("[data-include]"));
        if (!placeholders.length) {
            return;
        }

        await Promise.all(placeholders.map(async (placeholder) => {
            const source = placeholder.getAttribute("data-include");
            const variant = placeholder.getAttribute("data-variant");
            const uniquePrefix = `include${++includeIndex}`;
            let html = await fetchInclude(source);

            html = selectVariant(html, variant).replaceAll("__INCLUDE_ID__", uniquePrefix);
            placeholder.removeAttribute("data-include");
            placeholder.innerHTML = html;
        }));

        await loadIncludes(root);
    };

    const setAuthState = () => {
        const onProfilePage = Boolean(document.querySelector(".profile-page"));
        const loggedIn = onProfilePage || window.localStorage.getItem(authKey) === "logged-in";

        document.querySelectorAll(".auth-logged-in, .auth-logged-out").forEach((root) => {
            root.classList.toggle("auth-logged-in", loggedIn);
            root.classList.toggle("auth-logged-out", !loggedIn);
        });

        document.querySelectorAll(".drawer-logout").forEach((button) => {
            if (button.dataset.logoutBound === "true") {
                return;
            }

            button.dataset.logoutBound = "true";
            button.addEventListener("click", (event) => {
                event.preventDefault();
                window.localStorage.removeItem(authKey);
                document.querySelectorAll(".nav-drawer-toggle").forEach((toggle) => {
                    toggle.checked = false;
                });
                setAuthState();
            });
        });
    };

    const navKeyForPage = () => {
        const page = pageName();

        if (page === "crash.html") {
            return "crash";
        }
        if (page === "casino.html") {
            return "casino";
        }
        if (page === "e-sports.html") {
            return "esports";
        }
        if (page === "virtual.html") {
            return "virtual";
        }
        if (page === "bet-game.html") {
            return "betgame";
        }
        if (page === "game-detail.html") {
            const game = new URLSearchParams(window.location.search).get("game") || "aviator";
            return casinoGames.has(game) ? "casino" : "crash";
        }

        return "home";
    };

    const setActiveNavigation = () => {
        const key = navKeyForPage();
        const page = pageName();

        document.querySelectorAll(".desktop-nav a").forEach((link) => {
            link.classList.remove("active", "nav-crash-active");
        });

        document.querySelectorAll(`.desktop-nav [data-nav="${key}"]`).forEach((link) => {
            if (key === "crash") {
                link.classList.add("nav-crash-active");
            } else {
                link.classList.add("active");
            }
        });

        document.querySelectorAll(".drawer-home").forEach((link) => {
            link.classList.toggle("active", page === "index.html" || page === "");
        });

        document.querySelectorAll(".mobile-top-nav a").forEach((link) => {
            const href = link.getAttribute("href") || "";
            const isCurrent = (key === "home" && (href === "#" || href.includes("index.html"))) ||
                (key === "crash" && href.includes("crash.html")) ||
                (key === "casino" && href.includes("casino.html")) ||
                (key === "esports" && href.includes("e-sports.html")) ||
                (key === "virtual" && href.includes("virtual.html")) ||
                (key === "betgame" && href.includes("bet-game.html"));
            link.classList.toggle("active", isCurrent);
        });

        document.querySelectorAll(".bottom-nav a").forEach((link) => link.classList.remove("active"));
        document.querySelectorAll(".bottom-nav").forEach((nav) => {
            const activeSelector = page === "promotion.html" ? ".promotion-link" :
                page === "index.html" || page === "" ? ".affiliate-link" :
                    ".home-link";
            nav.querySelector(activeSelector)?.classList.add("active");
        });
    };

    const initIncludes = async () => {
        try {
            await loadIncludes();
            setAuthState();
            setActiveNavigation();
            window.dispatchEvent(new CustomEvent("nekingx:includes-loaded"));
        } catch (error) {
            console.error(error);
        }
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initIncludes);
    } else {
        initIncludes();
    }
})();
