let isScrolled = false;
let isMenuOpen = false;

window.onscroll = function() {
    isMenuOpen=true;
    toggleMenu();
    scrollPC();
};
const icon= document.getElementById("menu-icon")
icon.addEventListener("click",toggleMenu)

function toggleMenu(){
    const nav = document.querySelector("nav")
    if(isMenuOpen){
        nav.classList.add('hidden')
        isMenuOpen = false
        icon.innerText="☰";

    }
    else{
        nav.classList.remove('hidden')
        isMenuOpen = true
        icon.innerText="✖";
    }  
}

function scrollPC() {
    const header = document.querySelector("header");
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        if (!isScrolled) {
            header.classList.add('scroll')

            isScrolled = true;
        }
    } else {
        header.classList.remove('scroll')
        
        isScrolled = false;
    }
}