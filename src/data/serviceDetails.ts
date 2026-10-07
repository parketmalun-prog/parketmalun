import type { Lang } from '@/i18n/config'
import type { ServiceKey, serviceRoute } from './site'

export type ServiceRoute = typeof serviceRoute[ServiceKey]

type Detail = {
  title: string
  description: string
  heading: string
  lead: string
  sections: { title: string; body: string }[]
  faq: { q: string; a: string }[]
}

export const serviceDetails: Record<Lang, Record<ServiceRoute, Detail>> = {
  is: {
    installation: {
      title: 'Parketlögn í Reykjavík: verð og tilboð | Expert Parket',
      description: 'Parketlögn í Reykjavík, Kópavogi og um Ísland. Plankar og síldarbein, undirbúningur og listar. Sjáðu hvað ræður verði og fáðu frítt tilboð í parketlögn.',
      heading: 'Parketlögn í Reykjavík og víðar á Íslandi',
      lead: 'Við leggjum parket á heimilum og í atvinnuhúsnæði í Reykjavík, Kópavogi, Hafnarfirði og víðar um Ísland. Gólfefni, undirlag, mynstur og frágangur eru metin saman. Sendu okkur myndir og fermetrafjölda og fáðu frítt tilboð í parketlögn.',
      sections: [
        { title: 'Undirlagið kemur fyrst', body: 'Ójöfnur og raki geta haft áhrif á nýtt gólf. Við metum undirlagið og hvort þurfi að fjarlægja eldra gólfefni eða jafna yfirborðið. Ef gólfhiti er til staðar þarf val á parketi, undirlagi og lagningaraðferð að fylgja leiðbeiningum framleiðanda.' },
        { title: 'Plankar, síldarbein og frágangur', body: 'Val á mynstri breytir bæði útliti og vinnu við lögn. Við ræðum stefnu borðanna, skurði við dyr og tengingar milli herbergja. Gólflistar, þröskuldar og nauðsynlegar þensluraufar eru hluti af skipulagningu verksins.' },
        { title: 'Val á parketi fyrir rýmið', body: 'Við bjóðum eikarparket í plönkum, fiskibeini og chevron í vöruúrvalinu okkar. Ræðum notkun rýmisins, áferð og umhirðu áður en efnið er valið. Ef þú hefur þegar keypt gólfefni skaltu senda vöruheiti og upplýsingar svo hægt sé að meta lagningaraðferð og undirbúning.' },
      ],
      faq: [
        { q: 'Hvað kostar parketlögn á fermetra?', a: 'Verðið fer eftir gólfefni, mynstri, ástandi undirlags og frágangi. Fermetraverð án verklýsingar segir ekki hvort efni, afrif, jöfnun og listar séu innifalin. Við metum umfangið og gerum tilboð fyrir þitt verk.' },
        { q: 'Leggið þið síldarbeinaparket?', a: 'Já. Við leggjum bæði planka og síldarbein. Mynstur, gólfefni og undirlag eru metin áður en endanlegt tilboð er gert.' },
        { q: 'Má leggja parket yfir gólfhita?', a: 'Það fer eftir parketinu og hitakerfinu. Við skoðum upplýsingar um gólfefnið og fylgjum kröfum framleiðanda um hita, raka og lagningu.' },
        { q: 'Hvað þarf að senda til að fá tilboð?', a: 'Sendu staðsetningu, áætlaðan fermetrafjölda, myndir af rýminu og hvaða gólfefni eða mynstur þú hefur í huga. Láttu einnig vita hvort fjarlægja eigi eldra gólf.' },
        { q: 'Er parketið sjálft innifalið í verðinu?', a: 'Það þarf að koma skýrt fram í tilboðinu. Við getum rætt val á parketi úr vöruúrvalinu og lögn þess saman. Ef efnið er þegar til þarf að staðfesta tegund, magn og hvort það henti aðstæðum.' },
        { q: 'Hvað tekur langan tíma að leggja parket?', a: 'Verktími ræðst af flatarmáli, herbergjafjölda, undirbúningi og lagningaraðferð. Bið eftir þurrkun undirlags eða herðingu líms getur bæst við vinnudagana. Fáðu verkáætlun og staðfestingu á því hvenær má færa húsgögn inn áður en þú ákveður flutningadag.' },
      ],
    },
    sanding: {
      title: 'Parketslípun í Reykjavík og um allt Ísland | Expert Parket',
      description: 'Parketslípun og gólfslípun í Reykjavík og víðar á Íslandi. Við metum slitlag, viðgerðir, lökkun og olíuburð. Sendu myndir og fáðu tilboð.',
      heading: 'Parketslípun og yfirborðsmeðferð',
      lead: 'Slitið viðargólf getur oft nýst áfram. Við metum hvort það þoli gólfslípun og ræðum viðgerðir, lökkun eða olíuburð áður en unnið er í gólfinu.',
      sections: [
        { title: 'Mat á gólfinu áður en slípað er', body: 'Tegund gólfs, þykkt slitlags og fyrri slípun skipta máli. Djúpar skemmdir, laus borð eða rakablettir geta kallað á viðgerðir eða skipti á einstökum borðum. Ekki er hægt að lofa að allir blettir hverfi við slípun.' },
        { title: 'Slípun, lakk eða olía', body: 'Við notum slípivélar með ryksogi og vinnum einnig kanta og horn. Ryksog dregur úr dreifingu ryks en rýmið þarf samt að undirbúa. Val á lakki eða olíu fer eftir æskilegu útliti, notkun og því viðhaldi sem hentar þér.' },
        { title: 'Verð og tími við parketslípun', body: 'Kostnaður ræðst meðal annars af stærð, aðgengi, viðgerðum og valinni áferð. Verktími og þurrktími eru ekki það sama: hvenær má ganga á gólfinu, færa inn húsgögn eða leggja niður mottur fer eftir efninu sem er notað. Þetta er rætt þegar verkið er skipulagt.' },
      ],
      faq: [
        { q: 'Er hægt að slípa öll parketgólf?', a: 'Nei. Gegnheilt parket og sumt spónlagt parket má slípa ef nægilegt slitlag er eftir. Harðparket og vínyl eru ekki slípuð með sama hætti og viðargólf.' },
        { q: 'Er slípun alveg ryklaus?', a: 'Vélarnar eru tengdar ryksogi sem dregur úr ryki. Það kemur þó ekki í stað þess að tæma rýmið og verja nálæga fleti og muni eftir þörfum.' },
        { q: 'Hvenær má setja húsgögn aftur á gólfið?', a: 'Það fer eftir lakki eða olíu og aðstæðum í rýminu. Fylgja þarf þurrk- og herðingartíma framleiðanda; ekki miða aðeins við hvenær yfirborðið virðist þurrt.' },
      ],
    },
    painting: {
      title: 'Málun innanhúss í Reykjavík | Expert Parket og Mál',
      description: 'Málun innanhúss í Reykjavík, Kópavogi og Hafnarfirði. Við málum veggi, loft og lista, spörtlum og verjum gólf. Sendu myndir og fáðu tilboð.',
      heading: 'Málun innanhúss',
      lead: 'Við málum veggi, loft og lista í Reykjavík, á höfuðborgarsvæðinu og víðar um Ísland. Við undirbúum fletina áður en málað er og getum skipulagt málun og parketvinnu saman.',
      sections: [
        { title: 'Undirbúningur veggja og lofta', body: 'Við skoðum ástand flata, göt, sprungur og eldri málningu. Spörtlun, slípun og grunnun ráðast af undirlaginu. Raki eða skemmdir sem eiga sér aðra orsök þurfa mat áður en málað er yfir.' },
        { title: 'Áferð, litir og verndun rýmis', body: 'Gljástig og þvottþol skipta máli fyrir daglega notkun. Við ræðum hvaða fleti á að mála og hvernig verja á gólf, húsgögn og aðliggjandi svæði. Ef parketvinna er hluti af verkinu er verkáætlunin samræmd svo frágangur verði varinn.' },
        { title: 'Tilboð í málningarvinnu', body: 'Segðu okkur hvar verkið er, hvaða herbergi og fleti á að mála og í hvaða ástandi þeir eru. Myndir hjálpa við fyrsta mat. Umfang undirbúnings, aðgengi, efnisval og ferðakostnaður ef við á hafa áhrif á tilboðið.' },
      ],
      faq: [
        { q: 'Má panta málun án parketvinnu?', a: 'Já, hægt er að óska eftir málun einni og sér eða samhliða parketlögn eða slípun. Sendu okkur lýsingu á því sem þarf að gera.' },
        { q: 'Málið þið bæði veggi og loft?', a: 'Já, þjónustan nær til veggja, lofta og lista innanhúss. Við skilgreinum hvaða fletir og undirbúningur eru innifalin í tilboðinu.' },
        { q: 'Þarf að tæma herbergin?', a: 'Gott aðgengi auðveldar undirbúning og málun. Við ræðum fyrirfram hvað þarf að færa og hvernig verja á þá hluti sem verða eftir í rýminu.' },
      ],
    },
  },
  en: {
    installation: {
      title: 'Parquet Installation Reykjavík: Cost & Quotes | Expert Parket',
      description: 'Parquet and herringbone installation in Reykjavík and across Iceland. Compare preparation, fitting and finishing costs. Send photos for a free quote.',
      heading: 'Parquet installation in Reykjavík and across Iceland',
      lead: 'We install parquet in homes and commercial spaces in Reykjavík, Kópavogur, Hafnarfjörður and elsewhere in Iceland. Flooring, subfloor, pattern and finishing details are assessed together. Send photographs and the approximate area for a free installation quote.',
      sections: [
        { title: 'Start with the subfloor', body: 'Uneven surfaces and moisture can affect a new floor. We assess whether existing flooring needs removal or the base needs levelling. Where underfloor heating is present, the flooring, underlay and installation method must meet the manufacturer’s requirements.' },
        { title: 'Planks, herringbone and finishing details', body: 'The pattern affects both the appearance and the work involved. We discuss board direction, cuts around doorways and transitions between rooms. Skirting, thresholds and expansion gaps are included in planning the installation.' },
        { title: 'Choose flooring for the room', body: 'Our range includes oak planks, herringbone and chevron. Discuss room use, finish and care before choosing the material. If you already have flooring, send the product name and details so the installation method and preparation can be assessed.' },
      ],
      faq: [
        { q: 'How much does parquet installation cost per square metre?', a: 'The cost depends on the flooring, pattern, subfloor and finishing details. A rate without a scope does not tell you whether materials, removal, levelling and skirting are included. We assess the work and prepare a quote for your project.' },
        { q: 'Do you install herringbone parquet?', a: 'Yes. We install planks and herringbone. The pattern, flooring and subfloor are assessed before a final quote is prepared.' },
        { q: 'Can parquet be fitted over underfloor heating?', a: 'It depends on the flooring and heating system. We check the product information and follow the manufacturer’s temperature, moisture and installation requirements.' },
        { q: 'What should I send for a quote?', a: 'Send your location, approximate floor area, room photographs and the flooring or pattern you have in mind. Tell us whether old flooring needs removing.' },
        { q: 'Does the price include the flooring itself?', a: 'The quotation should state this explicitly. We can discuss flooring from our range together with its installation. If you already have the material, its type, quantity and suitability need confirming.' },
        { q: 'How long does parquet installation take?', a: 'Area, room layout, preparation and installation method determine the working time. Subfloor drying or adhesive curing may add waiting time. Agree the schedule and when furniture can return before booking a moving date.' },
      ],
    },
    sanding: {
      title: 'Floor Sanding in Iceland | Expert Parket og Mál',
      description: 'Wood floor sanding, lacquering and oil finishing across Iceland. Get an assessment and quote based on your floor’s condition, size and finish. Call 785 7079.',
      heading: 'Wood floor sanding and refinishing',
      lead: 'A worn wooden floor can often be kept. We assess whether it can be sanded and discuss repairs and finishes before work begins.',
      sections: [
        { title: 'Assess the floor before sanding', body: 'Floor type, wear-layer thickness and previous sanding matter. Deep damage, loose boards or moisture stains may need repairs or replacement boards. Sanding cannot be guaranteed to remove every stain.' },
        { title: 'Sanding, lacquer or oil', body: 'Our sanding machines use dust extraction, and we also work on edges and corners. Extraction reduces airborne dust, but the room still needs preparation. The choice of lacquer or oil depends on the look, use and maintenance you prefer.' },
        { title: 'Sanding cost and drying time', body: 'Area, access, repairs and finish all affect the quote. Working time and drying time are different: walking on the floor, returning furniture and laying rugs depend on the product used. We discuss these stages when planning the job.' },
      ],
      faq: [
        { q: 'Can every parquet floor be sanded?', a: 'No. Solid wood and some engineered floors can be sanded if enough wear layer remains. Laminate and vinyl cannot be sanded in the same way as wooden floors.' },
        { q: 'Is sanding completely dust free?', a: 'The machines use extraction to reduce dust. You still need to clear the room and protect nearby surfaces and belongings where necessary.' },
        { q: 'When can furniture go back?', a: 'This depends on the lacquer or oil and room conditions. Follow the manufacturer’s drying and curing instructions, rather than judging only by whether the surface feels dry.' },
      ],
    },
    painting: {
      title: 'Interior Painting in Iceland | Expert Parket og Mál',
      description: 'Interior wall, ceiling and trim painting with preparation and finishing. Projects across Iceland, also alongside floor work. Contact us for a quote.',
      heading: 'Interior painting',
      lead: 'We paint walls, ceilings and trim, preparing the surfaces before applying paint. Painting and parquet work can be planned together.',
      sections: [
        { title: 'Prepare walls and ceilings', body: 'We assess surface condition, holes, cracks and existing paint. Filling, sanding and priming depend on the substrate. Moisture or damage with an underlying cause needs assessment before it is painted over.' },
        { title: 'Finish, colour and protection', body: 'Sheen and washability affect everyday use. We discuss which surfaces need painting and how floors, furniture and surrounding areas will be protected. When floor work is included, the schedule is coordinated to protect the finished surfaces.' },
        { title: 'Request a painting quote', body: 'Tell us the location, rooms and surfaces to be painted and their condition. Photographs help with the first assessment. Preparation, access, materials and any travel costs affect the quote.' },
      ],
      faq: [
        { q: 'Can I book painting without floor work?', a: 'Yes. You can request painting on its own or alongside installation or sanding. Send us a description of the work required.' },
        { q: 'Do you paint walls and ceilings?', a: 'Yes, we paint interior walls, ceilings and trim. The surfaces and preparation included are set out in the quote.' },
        { q: 'Do rooms need to be empty?', a: 'Clear access makes preparation and painting easier. We agree in advance what needs moving and how any remaining belongings will be protected.' },
      ],
    },
  },
  pl: {
    installation: {
      title: 'Układanie parkietu Reykjavík: cena i wycena | Expert Parket',
      description: 'Układanie parkietu i jodełki w Reykjavíku i całej Islandii. Przygotowanie podłoża, montaż, listwy i koszty. Wyślij zdjęcia po bezpłatną wycenę.',
      heading: 'Układanie parkietu w Reykjavíku i całej Islandii',
      lead: 'Układamy parkiet w domach i lokalach użytkowych w Reykjavíku, Kópavogur, Hafnarfjörður i innych częściach Islandii. Wspólnie oceniamy materiał, podłoże, wzór i wykończenie. Prześlij zdjęcia i przybliżony metraż po bezpłatną wycenę montażu.',
      sections: [
        { title: 'Najpierw podłoże', body: 'Nierówności i wilgoć mogą wpływać na nową podłogę. Oceniamy potrzebę usunięcia starej okładziny lub wyrównania podłoża. Przy ogrzewaniu podłogowym parkiet, podkład i sposób montażu muszą spełniać wymagania producenta.' },
        { title: 'Deski, jodełka i wykończenie', body: 'Wzór wpływa na wygląd oraz nakład pracy. Omawiamy kierunek desek, docinki przy drzwiach i przejścia między pomieszczeniami. Listwy, progi i szczeliny dylatacyjne uwzględniamy przy planowaniu montażu.' },
        { title: 'Dobór parkietu do pomieszczenia', body: 'W naszej ofercie są dębowe deski, jodełka i chevron. Przed wyborem omawiamy przeznaczenie pomieszczenia, wykończenie i pielęgnację. Jeśli masz już materiał, prześlij nazwę i dane produktu, aby można było ocenić sposób montażu i przygotowanie podłoża.' },
      ],
      faq: [
        { q: 'Ile kosztuje układanie parkietu za metr kwadratowy?', a: 'Cena zależy od materiału, wzoru, podłoża i wykończenia. Sama stawka nie określa, czy obejmuje parkiet, demontaż, wyrównanie i listwy. Oceniamy zakres prac i przygotowujemy wycenę konkretnego zlecenia.' },
        { q: 'Czy układacie parkiet w jodełkę?', a: 'Tak, układamy deski i jodełkę. Przed ostateczną wyceną oceniamy wzór, materiał i podłoże.' },
        { q: 'Czy parkiet można ułożyć na ogrzewaniu podłogowym?', a: 'Zależy to od materiału i systemu grzewczego. Sprawdzamy dane produktu oraz wymagania producenta dotyczące temperatury, wilgotności i montażu.' },
        { q: 'Co przesłać do wyceny?', a: 'Lokalizację, przybliżony metraż, zdjęcia i wybrany materiał lub wzór. Napisz też, czy trzeba usunąć starą podłogę.' },
        { q: 'Czy cena obejmuje sam parkiet?', a: 'Powinno to być wyraźnie określone w ofercie. Możemy omówić wybór parkietu z naszego katalogu razem z montażem. Jeśli masz już materiał, trzeba potwierdzić jego rodzaj, ilość i przydatność do danych warunków.' },
        { q: 'Jak długo trwa układanie parkietu?', a: 'Czas pracy zależy od powierzchni, układu pomieszczeń, przygotowania i sposobu montażu. Schnięcie podłoża lub utwardzanie kleju może wymagać dodatkowego czasu. Przed ustaleniem przeprowadzki uzgodnij harmonogram i termin wniesienia mebli.' },
      ],
    },
    sanding: {
      title: 'Cyklinowanie parkietu na Islandii | Expert Parket',
      description: 'Cyklinowanie, lakierowanie i olejowanie podłóg w całej Islandii. Ocena i wycena według stanu, powierzchni i wykończenia. Zadzwoń: 785 7079.',
      heading: 'Cyklinowanie i renowacja parkietu',
      lead: 'Zużytą drewnianą podłogę często można zachować. Oceniamy możliwość cyklinowania oraz omawiamy naprawy i wykończenie przed rozpoczęciem prac.',
      sections: [
        { title: 'Ocena podłogi przed cyklinowaniem', body: 'Znaczenie mają rodzaj podłogi, grubość warstwy użytkowej i wcześniejsze szlifowanie. Głębokie uszkodzenia, luźne deski i plamy po wilgoci mogą wymagać napraw lub wymiany elementów. Cyklinowanie nie gwarantuje usunięcia wszystkich plam.' },
        { title: 'Szlifowanie, lakier lub olej', body: 'Używamy maszyn z odsysaniem pyłu i obrabiamy także krawędzie oraz narożniki. Odsysanie ogranicza pylenie, ale pomieszczenie nadal wymaga przygotowania. Lakier lub olej dobieramy do oczekiwanego wyglądu, użytkowania i pielęgnacji.' },
        { title: 'Cena i czas schnięcia', body: 'Na wycenę wpływają metraż, dostęp, naprawy i wykończenie. Czas pracy różni się od czasu schnięcia. Termin chodzenia po podłodze, wniesienia mebli i rozłożenia dywanów zależy od zastosowanego produktu. Ustalamy to przy planowaniu prac.' },
      ],
      faq: [
        { q: 'Czy każdą podłogę można cyklinować?', a: 'Nie. Lite drewno i niektóre podłogi warstwowe można szlifować, jeśli pozostała wystarczająca warstwa użytkowa. Laminatu i winylu nie cyklinuje się tak jak drewna.' },
        { q: 'Czy cyklinowanie jest całkowicie bezpyłowe?', a: 'Odsysanie ogranicza ilość pyłu. Trzeba jednak opróżnić pomieszczenie i w razie potrzeby zabezpieczyć pobliskie powierzchnie oraz przedmioty.' },
        { q: 'Kiedy można wnieść meble?', a: 'Zależy to od lakieru lub oleju oraz warunków w pomieszczeniu. Należy przestrzegać zaleceń producenta dotyczących schnięcia i utwardzania, nawet jeśli powierzchnia wydaje się już sucha.' },
      ],
    },
    painting: {
      title: 'Malowanie wnętrz na Islandii | Expert Parket og Mál',
      description: 'Malowanie ścian, sufitów i listew z przygotowaniem powierzchni. Prace w całej Islandii, również razem z renowacją podłóg. Poproś o wycenę.',
      heading: 'Malowanie wnętrz',
      lead: 'Malujemy ściany, sufity i listwy, przygotowując powierzchnie przed nakładaniem farby. Malowanie i prace podłogowe można zaplanować wspólnie.',
      sections: [
        { title: 'Przygotowanie ścian i sufitów', body: 'Oceniamy stan powierzchni, ubytki, pęknięcia i starą farbę. Szpachlowanie, szlifowanie i gruntowanie zależą od podłoża. Wilgoć lub uszkodzenia mające głębszą przyczynę wymagają oceny przed zamalowaniem.' },
        { title: 'Kolor, wykończenie i zabezpieczenie', body: 'Połysk i odporność na mycie mają znaczenie w codziennym użytkowaniu. Omawiamy zakres malowania oraz ochronę podłóg, mebli i otoczenia. Jeśli wykonujemy też podłogi, uzgadniamy kolejność prac tak, aby chronić gotowe powierzchnie.' },
        { title: 'Wycena malowania', body: 'Podaj lokalizację, pomieszczenia i powierzchnie do malowania oraz ich stan. Zdjęcia pomagają we wstępnej ocenie. Przygotowanie, dostęp, materiały i ewentualne koszty dojazdu wpływają na wycenę.' },
      ],
      faq: [
        { q: 'Czy można zamówić samo malowanie?', a: 'Tak, malowanie można zamówić osobno lub razem z układaniem czy cyklinowaniem podłogi. Prześlij opis potrzebnych prac.' },
        { q: 'Czy malujecie ściany i sufity?', a: 'Tak, malujemy ściany, sufity i listwy wewnątrz budynków. W wycenie określamy powierzchnie oraz zakres przygotowania.' },
        { q: 'Czy trzeba opróżnić pomieszczenia?', a: 'Swobodny dostęp ułatwia przygotowanie i malowanie. Uzgadniamy wcześniej, co trzeba przenieść i jak zabezpieczyć pozostałe przedmioty.' },
      ],
    },
  },
}

export const serviceLabels = {
  is: { included: 'Innifalið eftir umfangi verks', faq: 'Spurt um þjónustuna', related: 'Önnur þjónusta', work: 'Skoða verkefni', guide: 'Lesa um kostnað og undirbúning slípunar', area: 'Verk um allt Ísland', areaBody: 'Við tökum að okkur verkefni í Reykjavík, Kópavogi, Hafnarfirði, Garðabæ og Mosfellsbæ, auk Reykjaness og annarra landshluta. Sendu staðsetningu með fyrirspurninni. Við förum yfir aðgengi, tímasetningu og ferðakostnað ef við á áður en verk er staðfest.' },
  en: { included: 'Scope agreed for your project', faq: 'Questions about the service', related: 'Related services', work: 'See our projects', guide: 'Read the sanding cost and preparation guide', area: 'Projects across Iceland', areaBody: 'We take on projects throughout Iceland, including the Reykjavík capital region, Reykjanes and other regions. Include the location in your enquiry. Access, scheduling and any travel costs are discussed before confirming the work.' },
  pl: { included: 'Zakres ustalany dla Twojego projektu', faq: 'Pytania o usługę', related: 'Pozostałe usługi', work: 'Zobacz realizacje', guide: 'Przeczytaj poradnik o cenie i przygotowaniu do cyklinowania', area: 'Prace w całej Islandii', areaBody: 'Przyjmujemy zlecenia w całej Islandii, w tym w regionie Reykjavíku, na Reykjanes i w pozostałych regionach. Podaj lokalizację w zapytaniu. Dostęp, termin i ewentualne koszty dojazdu omawiamy przed potwierdzeniem prac.' },
} satisfies Record<Lang, Record<string, string>>
