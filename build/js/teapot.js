const sound = new Audio('//www.andrasbiro.work/sounds/pour.mp3')
document.getElementsByTagName('img')[0].addEventListener('click',()=>{sound.currentTime=0;sound.play()})