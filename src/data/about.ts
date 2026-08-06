import type { Lang } from '@/i18n/config'

type SeoText = { title: string; description: string }
type TitleText = { title: string; text: string }
type QA = { q: string; a: string }
type About = {
  /** H1 pre-split into LineReveal lines. */
  titleLines: string[]
  lead: string
  story: { label: string; photoCaption: string; paragraphs: string[] }
  values: { label: string; items: TitleText[] }
  why: { label: string; titleLines: string[]; photoCaption: string; items: TitleText[] }
  faq: { label: string; support: string; items: QA[] }
}

export const aboutSeo: Record<Lang, SeoText> = {
  is: {
    title: 'Um okkur | Expert Parket og Mál | Yfir 25 ár í parketi og málun',
    description:
      'Expert Parket og Mál ehf. er rekið af einum fagmanni sem hefur lagt parket, slípað gólf og málað á höfuðborgarsvæðinu í meira en 25 ár. Frí skoðun og skriflegt tilboð, sími 785 7079.',
  },
  en: {
    title: 'About us | Expert Parket og Mál | Over 25 years of parquet and painting',
    description:
      'Expert Parket og Mál ehf. is run by one craftsman who has laid parquet, sanded floors and painted across the capital region for more than 25 years. Free site visit and a written quote, phone 785 7079.',
  },
  pl: {
    title: 'O nas | Expert Parket og Mál | Ponad 25 lat parkietów i malowania',
    description:
      'Expert Parket og Mál ehf. prowadzi jeden fachowiec, który od ponad 25 lat układa parkiety, cyklinuje podłogi i maluje w regionie stołecznym. Bezpłatne oględziny i pisemna wycena, telefon 785 7079.',
  },
}

export const about: Record<Lang, About> = {
  is: {
    titleLines: ['Eigandinn leggur', 'gólfið sjálfur'],
    lead: 'Expert Parket og Mál ehf. hefur lagt parket, slípað gólf og málað á höfuðborgarsvæðinu í meira en 25 ár, alltaf með sama fagmanninn í verkinu.',
    story: {
      label: 'Sagan',
      photoCaption: 'Eigandinn að störfum',
      paragraphs: [
        'Fyrirtækið er rekið af einum eiganda sem hefur unnið við parket og málun í meira en 25 ár. Sá sem svarar í símann 785 7079 er sami maðurinn og mætir með vélarnar, leggur gólfið og gengur frá.',
        'Verkdagurinn byrjar klukkan átta. Slípivélin er tengd við ryksugu svo rykið endar í vélinni en ekki í skápunum, lakkað er í þremur umferðum og lakkið fær að þorna á milli. Áttatíu fermetra íbúð tekur yfirleitt tvo til fjóra daga.',
        'Verkin dreifast um allt svæðið: stofugólf í Kópavogi, stigahús í Hafnarfirði, nýtt eikarparket í Garðabæ. Tilboðið er skriflegt, upphæðin stendur og rýmið er þrifið áður en lyklunum er skilað.',
      ],
    },
    values: {
      label: 'Gildin',
      items: [
        {
          title: 'Fast verð',
          text: 'Tilboðið er skriflegt og upphæðin á blaðinu er sú sem þú borgar. Komi eitthvað óvænt í ljós undir gamla gólfefninu er það rætt og samþykkt áður en haldið er áfram.',
        },
        {
          title: 'Þrif',
          text: 'Vinnusvæðið er sópað og ryksugað í lok hvers dags, ekki bara í verklok. Afgangar og umbúðir fara í kerruna, ekki í tunnuna þína.',
        },
        {
          title: 'Trygging',
          text: 'Fyrirtækið er með ábyrgðartryggingu. Komi fram galli sem rekja má til vinnu okkar er hann lagaður á okkar kostnað, án málalenginga.',
        },
        {
          title: 'Stundvísi',
          text: 'Umsaminn dagur stendur og mætt er klukkan átta. Ef verk á undan hnikast til færðu símtal með fyrirvara, ekki tóman stigapall.',
        },
      ],
    },
    why: {
      label: 'Af hverju okkur',
      titleLines: ['Af hverju', 'Expert Parket'],
      photoCaption: 'Kópavogur · 2024 · Slípun og lökkun',
      items: [
        {
          title: 'Allt í sömu hendi',
          text: 'Parket, slípun og málun hjá sama fagmanni. Einn maður raðar verkþáttunum og enginn bendir á annan þegar spurt er hver klárar hvað.',
        },
        {
          title: 'Frí skoðun, skriflegt tilboð',
          text: 'Við mætum, mælum fermetrana, skoðum undirlagið og sendum skriflegt tilboð innan tveggja virkra daga. Skoðunin kostar ekkert og skuldbindur þig ekki.',
        },
        {
          title: 'Endurtekin viðskipti',
          text: 'Stór hluti nýrra verkefna kemur frá fyrri viðskiptavinum og nágrönnum þeirra, oft í sama stigahúsi eða sömu götu.',
        },
      ],
    },
    faq: {
      label: 'Spurt og svarað',
      support: 'Fleiri spurningar · 785 7079',
      items: [
        {
          q: 'Hvað kostar að leggja parket?',
          a: 'Verðið ræðst af fermetrafjölda, gerð parketsins og ástandi undirlagsins. Algengt bil fyrir venjulega lögn er 2.500 til 4.500 kr. á fermetra. Við komum á staðinn og gerum frítt, skriflegt tilboð áður en verkið hefst.',
        },
        {
          q: 'Er hægt að slípa gamalt parket í stað þess að skipta um það?',
          a: 'Já, í flestum tilfellum. Gegnheilan við og þykkt spónlagt parket má oftast slípa niður, gera við rispur og lakka upp á nýtt fyrir mun lægri kostnað en ný lögn. Við mælum þykkt slitlagsins við skoðun og segjum þér hreint út hvort slípun borgi sig.',
        },
        {
          q: 'Hvað tekur langan tíma að slípa og lakka, og get ég búið heima á meðan?',
          a: 'Venjuleg íbúð tekur tvo til fjóra daga, meðal annars af því að lakkið þarf að þorna á milli umferða. Hægt er að búa í íbúðinni ef vinnusvæðið er afmarkað, en fyrstu dagana er best að stíga sem minnst á nýlökkuð gólf á meðan lakkið harðnar.',
        },
        {
          q: 'Hversu oft þarf að endurslípa parket?',
          a: 'Gott parket á heimili þarf yfirleitt aðeins að endurslípa á 10 til 20 ára fresti, eftir umgangi og gerð lakks. Á milli má fríska gólfið upp með léttri yfirlökkun sem lengir líftímann án þess að slípa niður í viðinn.',
        },
        {
          q: 'Þarf ég að undirbúa eitthvað fyrir málun?',
          a: 'Við sjáum um spörtlun, slípun, grunnun, límbandsvinnu og að verja gólf og innréttingar. Það hjálpar ef lausir munir og myndir fara af veggjunum, en við göngum frá öllu öðru og skilum rýminu hreinu.',
        },
        {
          q: 'Gegnheilt, spónlagt eða harðparket, hvað hentar mér?',
          a: 'Gegnheill viður og spónlagt parket gefa náttúrulegt yfirborð og má slípa upp aftur og aftur. Harðparket er ódýrara og þolir vel mikinn umgang og raka. Við förum yfir kostina með þér út frá herbergi, umferð og fjárhag áður en þú velur.',
        },
        {
          q: 'Er ábyrgð á vinnunni og fæ ég frítt tilboð?',
          a: 'Já. Skoðun og tilboðsgerð kostar ekkert og skuldbindur þig ekki. Við ábyrgjumst framkvæmdina, komi upp galli sem rekja má til vinnu okkar lögum við hann. Hringdu í 785 7079 eða sendu línu á expertparket2024@gmail.com.',
        },
      ],
    },
  },
  en: {
    titleLines: ['The owner lays', 'the floor himself'],
    lead: 'Expert Parket og Mál ehf. has laid parquet, sanded floors and painted across the capital region for more than 25 years, always with the same craftsman on the job.',
    story: {
      label: 'The story',
      photoCaption: 'The owner at work',
      paragraphs: [
        'The company is run by one owner who has worked with parquet and paint for more than 25 years. The man who answers the phone on 785 7079 is the same one who arrives with the machines, lays the floor and finishes the job.',
        'A working day starts at eight. The sander is hooked to a dust extractor so the dust ends up in the machine, not in your cupboards, lacquer goes on in three coats and each coat gets time to dry. An eighty square metre apartment usually takes two to four days.',
        'The jobs are spread across the region: a living room floor in Kópavogur, a stairwell in Hafnarfjörður, new oak parquet in Garðabær. The quote is written, the figure stands and the space is cleaned before the keys are handed back.',
      ],
    },
    values: {
      label: 'Values',
      items: [
        {
          title: 'Fixed price',
          text: 'The quote is written and the figure on the paper is what you pay. If something unexpected turns up under the old flooring, it is discussed and agreed before work continues.',
        },
        {
          title: 'Clean site',
          text: 'The work area is swept and vacuumed at the end of every day, not just when the job is done. Offcuts and packaging go in the trailer, not in your bin.',
        },
        {
          title: 'Insured work',
          text: 'The company carries liability insurance. If a fault traceable to our work appears, it is fixed at our cost, without a long discussion.',
        },
        {
          title: 'Punctuality',
          text: 'The agreed date holds and the day starts at eight. If a previous job runs over, you get a phone call in good time, not an empty hallway.',
        },
      ],
    },
    why: {
      label: 'Why us',
      titleLines: ['Why', 'Expert Parket'],
      photoCaption: 'Kópavogur · 2024 · Sanding and lacquer',
      items: [
        {
          title: 'One pair of hands',
          text: 'Parquet, sanding and painting handled by the same tradesman. One person sequences the work and nobody points at another contractor when you ask who finishes what.',
        },
        {
          title: 'Free visit, written quote',
          text: 'We come out, measure the square metres, check the subfloor and send a written quote within two working days. The visit costs nothing and commits you to nothing.',
        },
        {
          title: 'Repeat customers',
          text: 'A large share of new jobs comes from earlier customers and their neighbours, often in the same stairwell or the same street.',
        },
      ],
    },
    faq: {
      label: 'Questions and answers',
      support: 'More questions · 785 7079',
      items: [
        {
          q: 'How much does it cost to lay parquet?',
          a: 'The price depends on the square metres, the type of parquet and the condition of the subfloor. A common range for a standard installation is ISK 2,500 to 4,500 per square metre. We come out and give you a free written quote before the work begins.',
        },
        {
          q: 'Can old parquet be sanded instead of replaced?',
          a: 'Yes, in most cases. Solid wood and thick engineered parquet can usually be sanded down, scratches repaired and the floor lacquered again for far less than a new installation. We measure the wear layer during the visit and tell you straight whether sanding is worth it.',
        },
        {
          q: 'How long does sanding and lacquering take, and can I stay at home?',
          a: 'A typical apartment takes two to four days, partly because the lacquer has to dry between coats. You can live in the flat if the work area is sectioned off, but for the first days it is best to walk on the fresh floors as little as possible while the lacquer hardens.',
        },
        {
          q: 'How often does parquet need to be sanded again?',
          a: 'Good parquet in a home usually only needs a full sanding every 10 to 20 years, depending on traffic and the type of lacquer. In between, a light fresh coat revives the floor and extends its life without sanding into the wood.',
        },
        {
          q: 'Do I need to prepare anything before painting?',
          a: 'We handle filling, sanding, priming, masking and protecting floors and fittings. It helps if loose items and pictures come off the walls, but we take care of the rest and hand the space back clean.',
        },
        {
          q: 'Solid, engineered or laminate, which one suits me?',
          a: 'Solid wood and engineered parquet give a natural surface and can be sanded again and again. Laminate costs less and copes well with heavy traffic and moisture. We go through the options with you based on the room, the traffic and the budget before you choose.',
        },
        {
          q: 'Is the work guaranteed and is the quote free?',
          a: 'Yes. The visit and the quote cost nothing and commit you to nothing. We stand behind the work: if a fault traceable to it appears, we fix it. Call 785 7079 or write to expertparket2024@gmail.com.',
        },
      ],
    },
  },
  pl: {
    titleLines: ['Właściciel sam', 'układa podłogę'],
    lead: 'Expert Parket og Mál ehf. od ponad 25 lat układa parkiety, cyklinuje podłogi i maluje w regionie stołecznym, zawsze z tym samym fachowcem na miejscu.',
    story: {
      label: 'Historia',
      photoCaption: 'Właściciel przy pracy',
      paragraphs: [
        'Firmę prowadzi jeden właściciel, który od ponad 25 lat pracuje przy parkietach i malowaniu. Człowiek, który odbiera telefon pod numerem 785 7079, to ten sam, który przyjeżdża z maszynami, układa podłogę i kończy robotę.',
        'Dzień pracy zaczyna się o ósmej. Cykliniarka jest podłączona do odkurzacza, więc pył zostaje w maszynie, a nie w szafkach, lakier kładziemy w trzech warstwach i każda warstwa ma czas wyschnąć. Mieszkanie o powierzchni osiemdziesięciu metrów kwadratowych zajmuje zwykle dwa do czterech dni.',
        'Zlecenia rozkładają się po całym regionie: podłoga w salonie w Kópavogur, klatka schodowa w Hafnarfjörður, nowy dębowy parkiet w Garðabær. Wycena jest pisemna, kwota się nie zmienia, a wnętrze jest posprzątane przed oddaniem kluczy.',
      ],
    },
    values: {
      label: 'Zasady',
      items: [
        {
          title: 'Stała cena',
          text: 'Wycena jest pisemna i kwota na papierze to kwota, którą płacisz. Jeśli pod starą podłogą wyjdzie coś nieprzewidzianego, omawiamy to i uzgadniamy, zanim praca ruszy dalej.',
        },
        {
          title: 'Czysty plac',
          text: 'Miejsce pracy jest zamiatane i odkurzane na koniec każdego dnia, nie dopiero po zakończeniu zlecenia. Ścinki i opakowania trafiają na przyczepę, nie do Twojego kosza.',
        },
        {
          title: 'Ubezpieczenie',
          text: 'Firma ma ubezpieczenie OC. Jeśli pojawi się usterka wynikająca z naszej pracy, naprawiamy ją na własny koszt, bez zbędnych dyskusji.',
        },
        {
          title: 'Punktualność',
          text: 'Umówiony termin obowiązuje, a dzień zaczyna się o ósmej. Jeśli poprzednie zlecenie się przeciągnie, dostajesz telefon z wyprzedzeniem, a nie pustą klatkę schodową.',
        },
      ],
    },
    why: {
      label: 'Dlaczego my',
      titleLines: ['Dlaczego', 'Expert Parket'],
      photoCaption: 'Kópavogur · 2024 · Cyklinowanie i lakier',
      items: [
        {
          title: 'Wszystko w jednych rękach',
          text: 'Parkiet, cyklinowanie i malowanie robi ten sam fachowiec. Jedna osoba ustala kolejność prac i nikt nie wskazuje na innego wykonawcę, gdy pytasz, kto co kończy.',
        },
        {
          title: 'Bezpłatne oględziny, pisemna wycena',
          text: 'Przyjeżdżamy, mierzymy metry kwadratowe, sprawdzamy podłoże i wysyłamy pisemną wycenę w ciągu dwóch dni roboczych. Oględziny nic nie kosztują i do niczego nie zobowiązują.',
        },
        {
          title: 'Stali klienci',
          text: 'Duża część nowych zleceń pochodzi od wcześniejszych klientów i ich sąsiadów, często z tej samej klatki schodowej lub tej samej ulicy.',
        },
      ],
    },
    faq: {
      label: 'Pytania i odpowiedzi',
      support: 'Więcej pytań · 785 7079',
      items: [
        {
          q: 'Ile kosztuje ułożenie parkietu?',
          a: 'Cena zależy od liczby metrów kwadratowych, rodzaju parkietu i stanu podłoża. Typowy przedział przy standardowym układaniu to 2 500 do 4 500 ISK za metr kwadratowy. Przyjeżdżamy na miejsce i przygotowujemy bezpłatną pisemną wycenę przed rozpoczęciem prac.',
        },
        {
          q: 'Czy stary parkiet można cyklinować zamiast wymieniać?',
          a: 'Tak, w większości przypadków. Lite drewno i gruby parkiet warstwowy zwykle da się wycyklinować, naprawić zarysowania i polakierować na nowo za znacznie mniej, niż kosztuje nowa podłoga. Podczas oględzin mierzymy warstwę użytkową i mówimy wprost, czy cyklinowanie się opłaca.',
        },
        {
          q: 'Ile trwa cyklinowanie i lakierowanie i czy mogę wtedy mieszkać w domu?',
          a: 'Typowe mieszkanie zajmuje dwa do czterech dni, między innymi dlatego, że lakier musi wyschnąć między warstwami. Można mieszkać w lokalu, jeśli obszar prac jest wydzielony, ale przez pierwsze dni najlepiej jak najmniej chodzić po świeżych podłogach, gdy lakier twardnieje.',
        },
        {
          q: 'Jak często trzeba ponownie cyklinować parkiet?',
          a: 'Dobry parkiet w domu wymaga pełnego cyklinowania zwykle tylko co 10 do 20 lat, zależnie od ruchu i rodzaju lakieru. W międzyczasie lekkie przelakierowanie odświeża podłogę i wydłuża jej życie bez zdzierania drewna.',
        },
        {
          q: 'Czy muszę coś przygotować przed malowaniem?',
          a: 'Zajmujemy się szpachlowaniem, szlifowaniem, gruntowaniem, oklejaniem taśmą oraz zabezpieczeniem podłóg i zabudowy. Pomaga, jeśli luźne przedmioty i obrazy znikną ze ścian, resztą zajmujemy się my i oddajemy wnętrze czyste.',
        },
        {
          q: 'Parkiet lity, warstwowy czy panele, co wybrać?',
          a: 'Lite drewno i parkiet warstwowy dają naturalną powierzchnię i można je cyklinować wielokrotnie. Panele kosztują mniej i dobrze znoszą duży ruch oraz wilgoć. Przechodzimy z Tobą przez opcje na podstawie pomieszczenia, ruchu i budżetu, zanim wybierzesz.',
        },
        {
          q: 'Czy praca jest objęta gwarancją i czy wycena jest bezpłatna?',
          a: 'Tak. Oględziny i wycena nic nie kosztują i do niczego nie zobowiązują. Stoimy za naszą pracą: jeśli pojawi się usterka z niej wynikająca, naprawiamy ją. Zadzwoń pod 785 7079 lub napisz na expertparket2024@gmail.com.',
        },
      ],
    },
  },
}
