let emailc = 0;

let emailbodyen
let emailbodyhu

fetch('https://raw.githubusercontent.com/halobobi/website/master/development/email_en.html').then(value=>{emailbodyen=value})
fetch('https://raw.githubusercontent.com/halobobi/website/master/development/email_hu.html').then(value=>{emailbodyhu=value})

addNew()

document.getElementById('add').addEventListener('click',addNew)

generatePreview()

document.getElementById(`furl`).addEventListener('input',generatePreview)
document.getElementById(`fname`).addEventListener('input',generatePreview) 
document.getElementById(`lang`).addEventListener('input',generatePreview)  

for (let index = 1; index < 5; index++) {
    document.getElementById(`email${index}`).addEventListener('input',generatePreview)   
}

function addNew(){
    console.log(emailc)
    emailc++
    let inp = document.createElement(`input`)
    inp.type=`email`
    inp.name=`email+${emailc}`
    inp.id=`email+${emailc}`
    inp.placeholder='Email'
    const es=document.getElementById('emails')
    es.appendChild(document.createElement('br'))
    es.appendChild(inp)
    inp.addEventListener('input',generatePreview)
}

function generatePreview(){
    let eads = []
    for (let index = 1; index < 5; index++) {
        if (document.getElementById(`email${index}`).checked){
            switch (index) {
                case 1:
                    eads.push('orosz.hanna.07.25@gmail.com')
                    break;
                case 2:
                    eads.push('andrasbir@gmail.com')
                    break;
                case 3:
                    eads.push('andrasbir2@gmail.com')
                    break;
                case 4:
                    eads.push('laandro3@gmail.com')
                    break;
            }
        }
    }
    for (let index = 1; index < emailc+1; index++) {
        const v= document.getElementById(`email+${index}`).value
        if(v!=''){eads.push(v)}
    }

    let foname= document.getElementById('fname').value
    const fourl= document.getElementById('furl').value

    if (foname == undefined || foname == '') {
        foname = fourl
        if (fourl.length > 20) foname = fourl.substring(0, 10) + '...' + fourl.substring(fourl.length - 10, fourl.length)
    }

    if(document.getElementById('lang').checked){
        document.getElementById('langu').innerText='EN - English'
        emailb=emailbodyen
    }else{
        document.getElementById('langu').innerText='HU - Hungarian'
        emailb=emailbodyhu
        
    }
    
    document.getElementById('cont').innerHTML=emailb.replace('${furl}', fourl)
        .replace('${fname}', foname)
        .replace('${element.email}', '#')
        .replace('${element.email}', '#')

    const ad = document.getElementById('addresses')
    ad.innerText=''
    for (let index = 0; index < eads.length; index++) {
        let li = document.createElement('li')
        li.innerText=eads[index]
        ad.appendChild(li)
    }
    if (ad.innerText==''){
        document.getElementById('noad').classList.remove('ads')
    }
    else{
        document.getElementById('noad').classList.add('ads')
    }
}