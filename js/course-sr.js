/* Serbian course text (Latin script, as on gamemob.eu). Quiz options keep the same order as in course-data.js. */
window.COURSE_TEXT = window.COURSE_TEXT || {};
window.COURSE_TEXT.sr = {
  title: "Igraj, uči, kreći se održivo",
  overview: {
    title: "O ovom kursu",
    body: `
      <p>Način na koji se krećemo po svojim gradovima utiče na našu bezbednost, zdravlje, vazduh koji udišemo i klimu. U ovom besplatnom kursu, koji pratite sopstvenim tempom, posmatraćete ulice i putovanja koja poznajete, isprobavati ideje u interaktivnim aktivnostima i predlagati kako da budu bolji.</p>

      <h2>Kome je namenjen</h2>
      <p>Učenicima uzrasta 12–19 godina, koji uče samostalno ili na času. Nije potrebno predznanje. Nastavnici će pronaći vodič u svakom modulu.</p>

      <h2>Šta ćete naučiti</h2>
      <p>Na kraju kursa moći ćete da:</p>
      <h3>1. Osnove održive mobilnosti</h3>
      <ul>
        <li>Navedete tri stuba održive mobilnosti i za svaki date primer</li>
        <li>Uporedite koliko ljudi mogu da prevezu traka za automobile, traka za autobuse i biciklistička staza</li>
        <li>Predložite uređenje ulice i objasnite ko dobija, a ko se nečega odriče</li>
      </ul>
      <h3>2. Bezbednost u saobraćaju</h3>
      <ul>
        <li>Objasnite razliku između puta reagovanja i puta kočenja</li>
        <li>Procenite na kojoj razdaljini automobil može da stane i zašto je brzina toliko važna</li>
        <li>Navedete mere koje smanjuju rizik u blizini škole</li>
      </ul>
      <h3>3. Uticaj na životnu sredinu</h3>
      <ul>
        <li>Izračunate emisiju CO₂ za jedno putovanje</li>
        <li>Prepoznate koja putovanja stvaraju najveći deo emisija jednog odeljenja</li>
        <li>Opišete mere na nivou škole koje smanjuju emisije i saobraćaj</li>
      </ul>
      <h3>4. Aktivna mobilnost</h3>
      <ul>
        <li>Definišete aktivnu mobilnost i navedete njene koristi</li>
        <li>Uporedite načine prevoza od vrata do vrata</li>
        <li>Ocenite stvarnu biciklističku rutu prema pet zahteva</li>
      </ul>
      <h3>5. Inovacije</h3>
      <ul>
        <li>Uporedite načine upravljanja pešačkim prelazom, sa njihovim prednostima i manama</li>
        <li>Postavljate kritička pitanja o pametnim sistemima, na primer o privatnosti, kvarovima i pristupačnosti</li>
        <li>Isplanirate mali pilot-projekat koji rešava lokalni problem mobilnosti</li>
      </ul>

      <h2>Kako izgleda svaki modul</h2>
      <ul>
        <li><strong>Lekcije:</strong> kratki uvodi u temu</li>
        <li><strong>Interaktivna aktivnost:</strong> simulacija u kojoj isprobavate odluke i vidite šta se dešava</li>
        <li><strong>Stranica za učenje:</strong> kratak tekst sa ključnim podacima i rečnikom pojmova</li>
        <li><strong>Radni list:</strong> aktivnost za štampanje, za vašu školu ili komšiluk</li>
        <li><strong>Kviz:</strong> šest pitanja sa objašnjenjem posle svakog odgovora</li>
        <li><strong>Vodič za nastavnike:</strong> plan časa i odgovori, za nastavnike</li>
      </ul>

      <h2>Dobro je znati</h2>
      <ul>
        <li>Kurs ima pet modula i traje oko 10–12 sati</li>
        <li>Možete stati kad god želite. Vaš napredak se čuva na ovom uređaju</li>
        <li>Registracija nije potrebna</li>
      </ul>
    `
  },
  modules: {
    m1: {
      title: "Osnove održive mobilnosti",
      lessons: {
        m1l1: {
          title: "Šta je održiva mobilnost?",
          body: `
            <p>Održiva mobilnost znači kretanje ljudi i robe na načine koji zadovoljavaju današnje potrebe, a ne ugrožavaju životnu sredinu, bezbednost ni kvalitet života budućih generacija.</p>
            <p>U ovoj lekciji istražićete tri stuba održivog saobraćaja (ekološki, društveni i ekonomski) i videti zašto gradovi širom Evrope iznova promišljaju kako se projektuju ulice.</p>
            <ul>
              <li>Zašto „više puteva“ ne rešava gužve</li>
              <li>Hijerarhija prevoza: pešačenje, bicikl, javni prevoz, zajednički prevoz, privatni automobili</li>
              <li>Kako su izbori u kretanju povezani sa klimatskim ciljevima</li>
            </ul>
          `
        },
        m1l2: {
          title: "Zašto gradovi moraju da promene način na koji se krećemo",
          body: `
            <p>Gradska područja brzo rastu, a sa njima rastu saobraćaj, buka i zagađenje vazduha. Ova lekcija razmatra stvarne primere iz RIS regiona u Grčkoj i Srbiji.</p>
            <p>Videćete kako se mali svakodnevni izbori, na primer pešačenje do škole umesto vožnje automobilom, sabiraju u merljivu promenu na nivou celog grada.</p>
          `
        }
      },
      material: { title: "Kako ulica deli svoj prostor" },
      activity: { title: "Preuredite ulicu", intro: "Preuredite ulicu široku 20 m za potrebe škole i pogledajte koliko ljudi svaki izbor može da preveze." },
      worksheet: { title: "Pregled ulice" },
      teacher: { title: "Vodič za nastavnike: Kako ulica deli svoj prostor" },
      quiz: {
        title: "Provera: modul 1",
        questions: [
          { q: "Šta od navedenog NIJE jedan od tri stuba održive mobilnosti?", options: ["Ekološki", "Društveni", "Zabavni", "Ekonomski"], explain: "Stubovi su ekološki, društveni i ekonomski." },
          { q: "Koji način kretanja u hijerarhiji prevoza po pravilu ima prvenstvo?", options: ["Privatni automobili", "Pešačenje", "Avionski prevoz", "Teretni kamioni"], explain: "Pešačenje zauzima najmanje prostora i nanosi najmanje štete, pa je na prvom mestu. Privatni automobil je na poslednjem." },
          { q: "U poređenju sa običnom trakom za automobile, koliko ljudi na sat može da preveze traka za autobuse?", options: ["Manje ljudi", "Približno isto", "Nekoliko puta više", "Tačno 100 više"], explain: "Priručnici za projektovanje ulica navode otprilike 600 do 1.600 ljudi na sat za traku za automobile i 4.000 do 8.000 za traku za autobuse." },
          { q: "Šta je indukovana potražnja?", options: ["Saobraćaj koji nestaje kada se putevi prošire", "Dodatni saobraćaj koji nastaje zato što je povećan kapacitet puta", "Porez na korišćenje automobila", "Potražnja za autobuskim kartama"], explain: "Više prostora na putu čini vožnju privlačnijom, pa saobraćaj raste dok ga ne popuni. Zato proširivanje puteva retko rešava gužve." },
          { q: "Koje rešenje stvarno štiti biciklističku traku?", options: ["Iscrtana linija pored saobraćaja u pokretu", "Parkirani automobili, ivičnjak ili žardinjere između trake i saobraćaja", "Znak da biciklisti imaju prvenstvo", "Šira traka za automobile"], explain: "Fizičko razdvajanje čini traku upotrebljivom za decu i manje sigurne vozače bicikla. Sama boja nije zaštita." },
          { q: "Održiva mobilnost se pre svega odnosi na to da…", options: ["automobili budu brži", "ljudi stignu tamo gde im je potrebno uz što manje štete", "se zabrane sva privatna vozila", "se gradi više puteva"], explain: "Ljudima je potrebna dostupnost, a ne putovanje samo po sebi. Cilj je da je ostvare uz manje zagađenja, opasnosti i zauzimanja zemljišta." }
        ]
      }
    },
    m2: {
      title: "Bezbednost u saobraćaju",
      lessons: {
        m2l1: {
          title: "Razumevanje rizika u saobraćaju",
          body: `
            <p>Povrede u saobraćaju i dalje su jedan od vodećih uzroka stradanja mladih. Ova lekcija razlaže najčešće faktore rizika u blizini škola i u stambenim ulicama.</p>
            <ul>
              <li>Brzina i zaustavni put</li>
              <li>Vidljivost i mrtvi uglovi</li>
              <li>Ometanje pažnje, i kod vozača i kod pešaka</li>
            </ul>
          `
        },
        m2l2: {
          title: "Bezbedno ponašanje pešaka i biciklista",
          body: `
            <p>Praktične navike koje smanjuju rizik: prelazak ulice na obeleženim mestima, kontakt očima sa vozačima, svetla i reflektujuća oprema pri vožnji bicikla u sumrak i izbor bezbednijih ruta.</p>
          `
        }
      },
      material: { title: "Zašto brzina odlučuje ko će preživeti" },
      activity: { title: "Hoće li stati na vreme?", intro: "Pronađite najveću brzinu pri kojoj automobil još uspeva da stane ispred deteta, u tri situacije." },
      worksheet: { title: "Provera brzine i pregled pešačkog prelaza" },
      teacher: { title: "Vodič za nastavnike: Zašto brzina odlučuje ko će preživeti" },
      quiz: {
        title: "Provera: modul 2",
        questions: [
          { q: "Koje je najbezbednije mesto za prelazak ulice?", options: ["Bilo gde gde postoji praznina u saobraćaju", "Obeleženi pešački prelaz", "Iza parkiranog autobusa", "Na sredini bloka, trčeći"], explain: "Obeleženi prelaz pokazuje vozačima gde da očekuju ljude i daje vam mesto sa kog vidite i bivate viđeni." },
          { q: "Tokom vremena reagovanja vozača automobil…", options: ["već počinje da usporava", "nastavlja da se kreće punom brzinom", "odmah staje", "ubrzava"], explain: "Kočenje počinje tek kada vozač primeti, odluči i pomeri stopalo. Za to vreme automobil pređe put jednak brzini pomnoženoj vremenom reagovanja." },
          { q: "Kada se brzina poveća sa 30 na 50 km/h, put kočenja…", options: ["poraste za 67%", "skoro se utrostruči", "ostaje isti", "tačno se udvostruči"], explain: "Put kočenja raste sa kvadratom brzine: (50 podeljeno sa 30) na kvadrat je oko 2,8." },
          { q: "Pri istoj brzini, u poređenju sa suvim putem, put kočenja na mokrom putu je…", options: ["kraći", "isti", "duži", "nemoguće je reći"], explain: "Trenje je manje na mokrom putu (oko 0,4 naspram 0,7), pa je automobilu za zaustavljanje potreban otprilike 1,75 puta duži put." },
          { q: "Dete izlazi na kolovoz 14 m ispred pažljivog vozača na suvom putu. Šta se dešava?", options: ["Automobil staje na vreme i pri 30 i pri 50 km/h", "Pri 30 km/h automobil staje na vreme; pri 50 km/h stiže do deteta skoro punom brzinom", "Automobil pri 50 km/h staje pre", "Brzina nije važna"], explain: "Pri 30 km/h ukupan zaustavni put je oko 13,4 m. Pri 50 km/h samo put reagovanja iznosi oko 13,9 m, pa kočnice jedva da počnu da deluju pre deteta." },
          { q: "Pristup „Bezbedan sistem“ polazi od ideje da…", options: ["ljudi nikada ne greše", "ljudi greše, pa sistem mora obezbediti da greške ne odnose živote", "su odgovorni samo vozači", "brzina nije važna"], explain: "Ovaj pristup prihvata ljudsku grešku i projektuje puteve, brzine i vozila tako da greška ne dovede do smrti." }
        ]
      }
    },
    m3: {
      title: "Uticaj na životnu sredinu",
      lessons: {
        m3l1: {
          title: "Saobraćaj i klimatske promene",
          body: `
            <p>Saobraćaj je jedan od najvećih izvora emisija gasova sa efektom staklene bašte u EU. Ova lekcija povezuje svakodnevne izbore u kretanju sa širom slikom o klimi.</p>
          `
        },
        m3l2: {
          title: "Kvalitet vazduha i život u gradu",
          body: `
            <p>Osim na klimu, izduvni gasovi vozila utiču na vazduh koji udišemo svakog dana. Videćete kako saobraćaj u blizini škola utiče na lokalni kvalitet vazduha i na zdravlje.</p>
          `
        }
      },
      material: { title: "Kako čitati emisije jednog putovanja" },
      activity: { title: "Put do škole, u gramima", intro: "Promenite kako 24 učenika dolaze u školu i pratite kako se menjaju godišnje emisije odeljenja." },
      worksheet: { title: "Anketa o dolasku u školu" },
      teacher: { title: "Vodič za nastavnike: Kako čitati emisije jednog putovanja" },
      quiz: {
        title: "Provera: modul 3",
        questions: [
          { q: "Koji je sektor među najvećim izvorima emisija CO₂ u EU?", options: ["Poljoprivreda", "Saobraćaj", "Tekstilna industrija", "Izdavaštvo"], explain: "Saobraćaj stvara otprilike četvrtinu emisija gasova sa efektom staklene bašte u EU, a najveći deo potiče iz drumskog saobraćaja." },
          { q: "Zašto automobil sa tri učenika emituje manje po učeniku nego automobil sa jednim?", options: ["Motor je manji", "Iste emisije dele se na više ljudi", "Teži automobili su čistiji", "Prelazi kraći put"], explain: "Emisije po putničkom kilometru opadaju kako raste popunjenost, jer se emisije automobila dele na više ljudi." },
          { q: "U odeljenju iz aktivnosti, koji učenici stvaraju najveći udeo emisija?", options: ["Oni koji stanuju na manje od 1 km", "Oni koji stanuju na 1 do 3 km", "Oni koji stanuju na više od 3 km", "Sve grupe stvaraju isto"], explain: "Učenici udaljeni više od 3 km čine četvrtinu odeljenja, a stvaraju oko 55% emisija, jer udaljenost umnožava faktor." },
          { q: "Šta od navedenog NIJE uključeno u podatke o emisijama u aktivnosti?", options: ["Dužina putovanja", "Način prevoza", "Emisije iz proizvodnje vozila", "Broj školskih dana"], explain: "Računaju se samo emisije tokom same vožnje do škole. Proizvodnja vozila i izgradnja puteva nisu uključene." },
          { q: "Zašto su automobili sa upaljenim motorom ispred škole zdravstveni problem?", options: ["Samo su bučni", "Stvaraju visoku koncentraciju izduvnih gasova baš kada deca dolaze", "Rad motora u mestu je svuda zabranjen", "Troše više goriva nego u vožnji"], explain: "Izduvni gasovi sadrže azot-dioksid i sitne čestice, a dečja pluća se još razvijaju." },
          { q: "Godišnja smernica SZO iz 2021. za sitne čestice (PM2.5) iznosi…", options: ["5 mikrograma po kubnom metru", "25 mikrograma po kubnom metru", "50 mikrograma po kubnom metru", "100 mikrograma po kubnom metru"], explain: "SZO je 2021. pooštrila smernicu na 5 mikrograma po kubnom metru. Mnogi evropski gradovi su iznad te vrednosti." }
        ]
      }
    },
    m4: {
      title: "Aktivna mobilnost",
      lessons: {
        m4l1: {
          title: "Pešačenje i bicikl kao svakodnevni prevoz",
          body: `
            <p>Aktivna mobilnost nije samo vežbanje. To je praktičan način kretanja koji učenicima poboljšava i koncentraciju, raspoloženje i samostalnost.</p>
          `
        },
        m4l2: {
          title: "Mikromobilnost: bicikli, trotineti i drugo",
          body: `
            <p>Pregled sve šireg izbora aktivnih i zajedničkih načina prevoza, kao i infrastrukture (biciklističke staze, parking, sistemi za deljenje) koja ih čini bezbednim i izvodljivim.</p>
          `
        }
      },
      material: { title: "Zašto kratka putovanja pripadaju ljudima" },
      activity: { title: "Od vrata do vrata", intro: "Pogodite kada automobil prestiže bicikl, pa proverite svoju procenu na modelu putovanja od vrata do vrata." },
      worksheet: { title: "Moj put od vrata do vrata" },
      teacher: { title: "Vodič za nastavnike: Zašto kratka putovanja pripadaju ljudima" },
      quiz: {
        title: "Provera: modul 4",
        questions: [
          { q: "Šta je od navedenog primer aktivne mobilnosti?", options: ["Vožnja automobila", "Vožnja bicikla do škole", "Putovanje avionom", "Vožnja taksijem"], explain: "Aktivna mobilnost je kretanje koje uglavnom pokreće sam putnik: pešačenje, bicikl, trotinet, invalidska kolica na ručni pogon." },
          { q: "Vreme putovanja od vrata do vrata obuhvata…", options: ["samo vreme dok se vozilo kreće", "hod do stanice, čekanje, parkiranje i hod na kraju", "samo vreme čekanja", "samo vreme provedeno u autobusu"], explain: "Svaki način prevoza ima minute bez kretanja, koji na kratkom putovanju mogu trajati koliko i sama vožnja." },
          { q: "U aktivnosti automobil u špicu prestiže bicikl na oko 4,5 km. Kada nema gužve, ta tačka je…", options: ["dalje (više od 4,5 km)", "približno na istom mestu", "bliže (oko 2,2 km)", "nigde"], explain: "Na praznim ulicama automobil je brži, pa prestiže bicikl ranije, na kraćoj udaljenosti." },
          { q: "Šta NIJE jedan od pet glavnih zahteva za dobru biciklističku rutu (CROW)?", options: ["Direktnost", "Bezbednost", "Niska cena", "Udobnost"], explain: "Pet zahteva su povezanost, direktnost, bezbednost, udobnost i privlačnost." },
          { q: "Koliko fizičke aktivnosti SZO u proseku preporučuje deci i adolescentima uzrasta od 5 do 17 godina?", options: ["15 minuta dnevno", "30 minuta dnevno", "60 minuta dnevno", "120 minuta dnevno"], explain: "SZO preporučuje u proseku 60 minuta umerene do intenzivne aktivnosti dnevno. Pešačenje ili vožnja bicikla do škole mogu biti deo toga." },
          { q: "Zašto je zaštićena biciklistička staza delotvornija od iscrtane linije?", options: ["Jeftinija je", "Više ljudi, uključujući decu, oseća se bezbedno da je koristi", "Automobili pored nje voze brže", "Nema raskrsnica"], explain: "Većina ljudi kaže da ih od bicikla odvraća ulica, a ne sopstvena veština. Razdvajanje menja to ko je spreman da vozi." }
        ]
      }
    },
    m5: {
      title: "Inovacije",
      lessons: {
        m5l1: {
          title: "Tehnologije pametne mobilnosti",
          body: `
            <p>Od aplikacija za javni prevoz u realnom vremenu do upravljanja saobraćajem pomoću senzora, tehnologija menja način na koji se gradovi kreću. Ova lekcija predstavlja inovacije koje stoje iza „pametne mobilnosti“.</p>
          `
        },
        m5l2: {
          title: "Osmišljavanje mobilnosti sutrašnjice",
          body: `
            <p>Kurs ćete zaokružiti tako što ćete osmisliti i skicirati sopstvenu ideju za održivije i bezbednije kretanje po svom gradu, na isti način razmišljanja koji stoji iza ozbiljne igre GAMEMOB.</p>
          `
        }
      },
      material: { title: "Tehnologija kao alat, a ne cilj" },
      activity: { title: "Naučite prelaz da sluša", intro: "Podesite fiksni tajmer, taster za pešake i senzor na pešačkom prelazu kod škole i uporedite rezultate." },
      worksheet: { title: "Ljudski semafor i plan pilot-projekta" },
      teacher: { title: "Vodič za nastavnike: Tehnologija kao alat, a ne cilj" },
      quiz: {
        title: "Provera: modul 5",
        questions: [
          { q: "Šta je primer tehnologije „pametne mobilnosti“?", options: ["Štampani red vožnje autobusa", "Aplikacija za javni prevoz u realnom vremenu", "Zaprežna kola", "Štampana mapa"], explain: "Pametna mobilnost koristi podatke uživo i digitalne alate kako bi saobraćaj bolje funkcionisao." },
          { q: "Pešački prelaz sa tasterom zna…", options: ["koliko ljudi čeka i da li je ulica prazna", "da neki pešak čeka, ali ne i koliko ih ima niti da li je ulica prazna", "baš ništa", "tačnu brzinu svakog automobila"], explain: "On dobija samo zahtev. Senzor može dodati podatke o tome ko čeka i o saobraćaju koji nailazi." },
          { q: "U aktivnosti, u čemu je upravljanje pomoću senzora bilo bolje od ostalih?", options: ["Automobili su čekali mnogo duže", "Čekanje pešaka smanjilo se otprilike upola, a automobili nisu čekali mnogo duže", "Semafori više nisu bili potrebni", "Bilo je jeftinije"], explain: "U špicu pred školom signal se menjao ranije kada nije bilo automobila, pa su pešaci kraće čekali. Ipak, košta više i zahteva održavanje." },
          { q: "Zašto je dugo čekanje pešaka važno za bezbednost?", options: ["Nije važno", "Ljudi mogu odustati od čekanja i preći na crveno", "Automobili postaju brži", "Štedi se struja"], explain: "U simulaciji ljudi koji čekaju 35 sekundi prelaze na crveno. Kratko čekanje je mera bezbednosti, a ne samo pogodnost." },
          { q: "Koji način otkrivanja pešaka na prelazu poštuje privatnost?", options: ["Trajno čuvanje snimaka lica", "Brojanje ljudi bez utvrđivanja identiteta", "Beleženje brojeva telefona", "Objavljivanje snimka na internetu"], explain: "Brojanje je moguće bez čuvanja podataka koji otkrivaju identitet. U skladu sa GDPR, pitajte šta se snima i koliko dugo se čuva." },
          { q: "Prema metodi sa stranice za učenje, koji je prvi korak u osmišljavanju sopstvene ideje?", options: ["Kupiti senzor", "Imenovati jedan konkretan problem i ljude na koje utiče", "Napisati aplikaciju", "Tražiti novac"], explain: "Konkretan problem omogućava da odlučite šta ćete meriti i koje je najjednostavnije rešenje." }
        ]
      }
    }
  }
};
