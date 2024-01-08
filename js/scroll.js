let isScrolled = false;

window.onscroll = function() {
            scrollFunction();
        };

function scrollFunction() {
    const header = document.querySelector("header");
    const nav = document.querySelector("nav")
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        if (!isScrolled) {
            header.style.padding = "0.5em 0";
            header.style.height = "fit-content";
            header.style.flexDirection = "row";
            nav.style.flexWrap="wrap";

            isScrolled = true;
        }
    } else {
        header.style.padding = "1em 0";
        header.style.height = "auto";
        header.style.flexDirection = "column";
        nav.style.flexWrap="nowrap";
        
        isScrolled = false;
    }
}