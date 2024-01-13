document.getElementById('copy').addEventListener('click',copyResp)

function copyResp(){
    navigator.clipboard.writeText(document.getElementById('resp').innerText.substring(9))
    alert('Copied response!')
}