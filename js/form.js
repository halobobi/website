let emailc = 0;

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
    let lab = document.createElement(`label`)
    lab.htmlFor=`email+${emailc}`
    lab.innerText=`+${emailc}`
    let inp = document.createElement(`input`)
    inp.type=`email`
    inp.name=`email+${emailc}`
    inp.id=`email+${emailc}`
    const es=document.getElementById('emails')
    es.appendChild(document.createElement('br'))
    es.appendChild(lab)
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

    if(document.getElementById('lang').checked){
        document.getElementById('cont').innerHTML=`<div style="margin-left:auto;margin-right:auto;width:80%;; border-bottom: lightgray 1px solid;">
        <h3> <i>Dear Recipient!</i> </h3>
        <p style="text-align:center;">You have received this email, because</p>
        <p> <b><i>András Lajos Biró</i></b> </p>
        <p> has shared the following item with you: </p>
        <p> </p>
        <p>
            <a id="button-link" style="display:block;margin-left:auto;margin-right:auto;padding:10px;width:fit-content;max-width:85%;background-color: #30b891; border-radius: 5px;color: white; text-decoration: none; word-wrap: break-word;" href="#" target="_blank"></a>
        </p>
        <p style="font-size: 12px;">
        In case of this email displays incorrectly, please click <a href="#" target="_blank">here</a>.
        </p>
    </div>
    <div style="font-size: 10px;margin-left:auto;margin-right:auto;width:80%">
        <p> This email was sent automatically, all links use the <i>https</i> protocol. </p>
        <p> Recipient <b><a
                    href="mailto:#"
                    target="_blank">#</a></b>. </p>
        <p> Sender: <b><a href="mailto:sharing@mail.andrasbiro.work" target="_blank">sharing@mail.andrasbiro.work</a></b>. </p>
        <p><b>If you received this email and you are not the intended recipient immediately notify the sender and disregard this email!</b></p>
            <p>This email address does receive emails. Should you have any issue reply to this email.</p>
    </div>`
    }else{
        document.getElementById('cont').innerHTML=`<div style="margin-left:auto;margin-right:auto;width:80%;; border-bottom: lightgray 1px solid;">
        <h3> <i>Kedves Címzett!</i> </h3>
        <p style="text-align:center;"> Ezt az üzenetet azért kapta, mert </p>
        <p> <b><i>Biró András Lajos</i></b> </p>
        <p> megosztotta Önnel a következőt: </p>
        <p> </p>
        <p>
            <a id="button-link" style="display:block;margin-left:auto;margin-right:auto;padding:10px;width:fit-content;max-width:85%;background-color: #30b891; border-radius: 5px;color: white; text-decoration: none; word-wrap: break-word;" href="#" target="_blank"></a>
        </p>
        <p style="font-size: 12px;">
            Ha az üzenet helytelenül jelenne meg, kérem kattintson <a href="#" target="_blank">ide</a>.
        </p>
    </div>
    <div style="font-size: 10px;margin-left:auto;margin-right:auto;width:80%">
        <p> Jelen e-mail automatikusan készült, a benne található hivatkozások biztonságosak, <i>https</i> szabványt
            használnak. </p>
        <p> Az e-mail címzettje: <b><a
                    href="mailto:#"
                    target="_blank">#</a></b>. </p>
        <p> Az e-mail feladója: <b><a href="mailto:sharing@mail.andrasbiro.work" target="_blank">sharing@mail.andrasbiro.work</a></b>. </p>
        <p><b>Figyelem! Amennyiben nem Ön a címzett, hagyja figyelmen kívül ezt az e-mailt és haladéktalanul értesítse a
                feladót!</b></p>
        <p> Ez az e-mail cím fogad válaszokat. Probléma esetén erre az e-mailre válaszoljon. </p>
    </div>`
    }

    if(document.getElementById('lang').checked){
        document.getElementById('langu').innerText='English'
    }
    else{
        document.getElementById('langu').innerText='Hungarian'
    }

    const ad = document.getElementById('addresses')
    ad.innerText=''
    for (let index = 0; index < eads.length; index++) {
        let li = document.createElement('li')
        li.innerText=eads[index]
        ad.appendChild(li)
    }
    if (ad.innerText==''){
        ad.innerText='There are no addresses selected!'
    }

    const foname= document.getElementById('fname').value
    const fourl= document.getElementById('furl').value
    const btn=document.getElementById("button-link")
    btn.href=fourl
    if(foname!=''){
        btn.innerText=foname
    }
    else{
        btn.innerText=fourl.substring(0,10)+'...'+fourl.substring(fourl.length-10,fourl.length)
    }
}