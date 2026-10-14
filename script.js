
document.addEventListener("DOMContentLoaded", () => {
    const hero = document.querySelector(".hero");

    // Toutes les pages du portfolio, dans l'ordre de navigation.
    const pages = [
        hero,
        ...document.querySelectorAll("body > section[id]")
    ].filter(Boolean);

    const navLinks = document.querySelectorAll(".nav-links a");

    if (pages.length === 0) return;

    // Prépare les pages sans modifier leur contenu.
    pages.forEach((page) => {
        page.classList.add("page-panel");
        page.classList.remove("is-active");
    });

    function getPageIdFromHash() {
        const hash = window.location.hash.slice(1);

        // Le logo et le lien de retour en haut ouvrent la page d'accueil.
        if (!hash || hash === "top" || hash === "home") {
            return hero.id || "top";
        }

        return hash;
    }

    function showPage(id, updateHistory = true) {
        let target = pages.find((page) => page.id === id);

        // Si le lien ne correspond à aucune page, revenir à l'accueil.
        if (!target) {
            target = hero;
        }

        pages.forEach((page) => {
            page.classList.toggle("is-active", page === target);
        });

        // Met à jour l'onglet sélectionné en haut.
        navLinks.forEach((link) => {
            const linkId = link.getAttribute("href")?.slice(1);
            const isActive =
                linkId === target.id ||
                (target === hero && linkId === "top");

            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });

        // Chaque nouvelle page commence en haut.
        window.scrollTo({ top: 0, behavior: "auto" });

        // Conserve l'adresse de la page dans la barre du navigateur.
        if (updateHistory) {
            const newHash = target === hero
                ? "#top"
                : `#${target.id}`;

            if (window.location.hash !== newHash) {
                history.pushState(null, "", newHash);
            }
        }
    }

    // Les onglets, le logo et les boutons PREVIOUS/NEXT
    // utilisent tous le même système de navigation.
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const id = link.getAttribute("href").slice(1);

            const target = id === "top" || id === "home"
                ? hero
                : pages.find((page) => page.id === id);

            if (!target) return;

            event.preventDefault();
            showPage(target.id || "top");
        });
    });

    // Permet aux boutons Précédent/Suivant du navigateur de fonctionner.
    window.addEventListener("popstate", () => {
        showPage(getPageIdFromHash(), false);
    });

    // Ouvre directement la page correspondant au lien partagé.
    const initialId = getPageIdFromHash();
    showPage(initialId, false);
});
