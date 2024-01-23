function playSound(){
    sound.currentTime=0
    sound.play()
}

const sound = new Audio('//www.andrasbiro.work/sounds/pour.mp3')

document.getElementsByTagName('img')[0].addEventListener('click',playSound)
document.getElementById('details').addEventListener('click',playSound)