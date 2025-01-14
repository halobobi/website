import func from './functions.js'
import status from './status.js'

export default {
    async fetch(request, env, params) {

        let irsz={'Békés':'5630','Csanádapáca':'5662','Szekszárd':'7100','Tiszakécske':'6060','Fót':'2151','Vámospércs':'4287','Miskolc':'3500','Dombóvár':'7200','Gyomaendrőd':'5500','Jászfényszaru':'5126','Bábolna':'2943','Monor':'2200','Balatonkeresztúr':'8648','Jánossomorja':'9167','Nagymaros':'2626','Kistelek':'6760','Kiskunfélegyháza':'6100','Tatabánya':'2800','Tiszaújváros':'3580','Visegrád':'2025','Szentendre':'2000','Oroszlány':'2840','Vecsés':'2220','Zalalövő':'8999','Vásárosnamény':'4800','Ráckeve':'2300','Újszász':'5052','Balatonalmádi':'8220','Orosháza':'5900','Marcali':'8700','Veresegyház':'2112','Pilisvörösvár':'2085','Celldömölk':'9500','Dorog':'2510','Kőszeg':'9730','Tiszafüred':'5350','Somogyszob':'7563','Baktalórántháza':'4561','Tata':'2835','Sárospatak':'3950','Kiskőrös':'6200','Nagykanizsa':'8800','Tiszavasvári':'4440','Érsekvadkert':'2659','Sátoraljaújhely':'3944','Sárvár':'9600','Nagykáta':'2760','Bonyhád':'7150','Kiskunmajsa':'6120','Kunmadaras':'5321','Jászberény':'5100','Pásztó':'3060','Jánosháza':'9545','Balassagyarmat':'2660','Nagykálló':'4320','Lenti':'8960','Eger':'3300','Mosonmagyaróvár':'9200','Mezőberény':'5650','Várpalota':'8100','Encs':'3860','Tótkomlós':'5940','Siófok':'8600','Tököl':'2316','Felcsút':'8086','Nyíregyháza':'4246','Sopron':'9400','Kaposvár':'7400','Cegléd':'2700','Zsámbék':'2072','Lajosmizse':'6050','Dabas':'2370','Tolna':'7130','Szeged':'6700','Békéscsaba':'5600','Kunszentmiklós':'6090','Csorna':'9168','Hévíz':'8380','Balatonboglár':'8630','Göd':'2131','Tinnye':'2086','Pálháza':'3994','Csepreg':'9735','Vác':'2600','Berettyóújfalu':'4100','Törökszentmiklós':'5200','Komló':'7300','Budaörs':'2040','Sándorfalva':'6762','Somoskőújfalu':'3121','Herend':'8440','Pápa':'8500','Gönc':'3895','Edelény':'3780','Nagylak':'6933','Gyula':'5700','Csákvár':'8083','Mezőtúr':'5400','Bátaszék':'7140','Győr':'9000','Szécsény':'3170','Dévaványa':'5510','Salgótarján':'3100','Budakalász':'2011','Mezőkövesd':'3400','Balatonberény':'8649','Piliscsaba':'2081','Földes':'4177','Nyírbátor':'4300','Pilisszentiván':'2084','Albertirsa':'2730','Esztergom':'2500','Biharkeresztes':'4110','Nagyréde':'3214','Ózd':'3600','Ajka':'8400','Nagyatád':'7500','Túrkeve':'5420','Alsózsolca':'3571','Mórahalom':'6782','Kunhegyes':'5340','Szombathely':'9700','Püspökladány':'4150','Komárom':'2900','Kisvárda':'4600','Karcag':'5300','Szigliget':'8264','Nagykőrös':'2750','Zalaegerszeg':'8900','Balmazújváros':'4060','Debrecen':'4000','Abony':'2740','Mohács':'7700','Kiskunhalas':'6400','Balatonfüred':'8230','Verpelét':'3351','Dunaújváros':'2400','Sárbogárd':'7000','Kisújszállás':'5310','Veszprém':'8200','Sarkad':'5720','Letenye':'8868','Bicske':'2060','Baja':'6500','Gyöngyös':'3200','Pannonhalma':'9090','Balatonvilágos':'8171','Paks':'7027','Martfű':'5435','Balatonlelle':'8638','Keszthely':'8360','Pilismarót':'2028','Kalocsa':'6300','Simontornya':'7081','Tapolca':'8297','Tápiószentmárton':'2711','Tiszaföldvár':'5430','Kazincbarcika':'3700','Bátonyterenye':'3070','Szigetvár':'7900','Nagybajom':'7561','Szendrő':'3752','Tamási':'7090','Siklós':'7800','Zirc':'8420','Sümeg':'8330','Enying':'8130','Hódmezővásárhely':'6800','Pilisszentkereszt':'2098','Székesfehérvár':'8000','Mindszent':'6630','Érd':'2030','Pilis':'2721','Dunaföldvár':'7020','Somogyjád':'7443','Pécs':'7600','Gödöllő':'2100','Makó':'6900','Kecskemét':'6000','Szigetszentmiklós':'2310','Hatvan':'3000','Bélapátfalva':'3346','Dunaharaszti':'2330','Őrbottyán':'2162'}

        let paramKeys = Array.from(new Set(params.keys()))

        if (paramKeys.length==0){
            return func.returnStatus('API error', `URL '/flowpro/zip' does not handle requests without a parameter.`)
        }

        if (paramKeys.length>1){
            return func.returnStatus('API error', `URL '/flowpro/zip' only handles one parameter, but received {paramKeys.length}.`)
        }

        if (paramKeys[0]!="cityName"){
            return func.returnStatus('API error', `URL '/flowpro/zip' received unknown parameter.`)
        }

        let city=decodeURI(params.get(paramKeys[0]))

        console.log(city)

        if (!Array.from(new Set(Object.keys(irsz))).includes(city)){
            return new Response(JSON.stringify({ 'response': "Not found.",success:false}), { headers: { "content-type": "application/json;charset=UTF-8", }, status: 200 })
        }

        return new Response(JSON.stringify({ 'response': {city:city,zip:irsz[city]},success:true}), { headers: { "content-type": "application/json;charset=UTF-8", }, status: 200 })
    }
}