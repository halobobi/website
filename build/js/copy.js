document.getElementById('copy').addEventListener('click',copyResp)

function copyResp(){
    navigator.clipboard.writeText(document.getElementById('resp').innerText)
    document.getElementById('success').classList.add('visible')
    setTimeout((e)=>{document.getElementById('success').classList.remove('visible')},1100)
}