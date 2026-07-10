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
        const name = window.location.pathname.replace(/\\/g, "/").split("/").pop();
        return name || "index.html";
    };

    const resolveIncludeUrl = (path) => {
        if (!path.startsWith("/")) {
            return path;
        }
        return path;
    };

    const resolvePageHref = (page) => {
        const name = String(page || "").replace(/^\/+/, "");
        return name || "index.html";
    };

    const resolveHomeHref = () => resolvePageHref("index.html");

    const fixHomeLinks = () => {
        const homeHref = resolveHomeHref();
        document.querySelectorAll("a.desktop-logo, a.drawer-home, a.home-link, a.nav-aviator-badge").forEach((link) => {
            link.setAttribute("href", homeHref);
        });
    };

    const fixSideMenuLinks = () => {
        const noticeHref = resolvePageHref("notice.html");
        document.querySelectorAll("a.drawer-inbox").forEach((link) => {
            link.setAttribute("href", noticeHref);
        });
    };

    const applyMobileHeaderVariant = () => {
        const headerType = document.body.getAttribute("data-header-type") === "home" ? "home" : "inner";
        document.querySelectorAll(".mobile-header-stack").forEach((stack) => {
            stack.classList.toggle("header--home", headerType === "home");
            stack.classList.toggle("header--inner", headerType === "inner");
        });
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

    const replaceIncludeIds = (html, uniquePrefix) => html.split("__INCLUDE_ID__").join(uniquePrefix);

    const unwrapInclude = (placeholder, html) => {
        const host = document.createElement("div");
        host.innerHTML = html;
        const nodes = Array.from(host.childNodes);
        placeholder.replaceWith(...nodes);
    };

    // Nested includes (e.g. sidemenu inside header) must reuse the parent prefix
    // so drawer toggle IDs still match backdrop/close `for` attributes.
    const loadIncludes = async (root = document, sharedPrefix) => {
        const topPlaceholders = Array.from(root.querySelectorAll("[data-include]")).filter((placeholder) => {
            const ancestor = placeholder.parentElement && placeholder.parentElement.closest("[data-include]");
            return !ancestor;
        });

        if (!topPlaceholders.length) {
            return;
        }

        await Promise.all(topPlaceholders.map(async (placeholder) => {
            const source = placeholder.getAttribute("data-include");
            const variant = placeholder.getAttribute("data-variant");
            const uniquePrefix = sharedPrefix || `include${++includeIndex}`;
            const host = document.createElement("div");
            host.innerHTML = selectVariant(await fetchInclude(source), variant);
            await loadIncludes(host, uniquePrefix);
            unwrapInclude(placeholder, replaceIncludeIds(host.innerHTML, uniquePrefix));
        }));
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
                document.body.classList.remove("drawer-open");
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
            const nav = link.getAttribute("data-nav") || "";
            const isCurrent = (key === "home" && (nav === "home" || href === "#" || href.includes("index.html"))) ||
                (key === "crash" && (nav === "crash" || href.includes("crash.html"))) ||
                (key === "casino" && (nav === "casino" || href.includes("casino.html"))) ||
                (key === "esports" && (nav === "esports" || href.includes("e-sports.html"))) ||
                (key === "virtual" && (nav === "virtual" || href.includes("virtual.html"))) ||
                (key === "betgame" && (nav === "betgame" || href.includes("bet-game.html")));
            link.classList.toggle("active", isCurrent);
        });

        document.querySelectorAll(".bottom-nav a").forEach((link) => link.classList.remove("active"));
        document.querySelectorAll(".bottom-nav").forEach((nav) => {
            const activeSelector = page === "promotion.html" ? ".promotion-link" :
                page === "affiliate.html" ? ".affiliate-link" :
                page === "index.html" || page === "" ? ".home-link" :
                ".home-link";
            nav.querySelector(activeSelector)?.classList.add("active");
        });
    };

    const initIncludes = async () => {
        try {
            await loadIncludes();
            setAuthState();
            applyMobileHeaderVariant();
            setActiveNavigation();
            fixHomeLinks();
            fixSideMenuLinks();
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
