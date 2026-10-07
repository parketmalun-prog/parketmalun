import type { Lang } from '@/i18n/config'

type InstallationContent = {
  nav: { price: string; work: string; quote: string }
  price: {
    title: string
    lead: string
    items: { title: string; body: string }[]
    example: string
  }
  work: { title: string; lead: string; captions: [string, string]; link: string }
  process: { title: string; steps: { title: string; body: string }[] }
  quote: { title: string; lead: string; items: string[]; cta: string; catalog: string }
}

/** Last substantive content revision, shared by all translated installation pages. */
export const installationUpdated = '2026-10-07'

export const installationContent: Record<Lang, InstallationContent> = {
  is: {
    nav: { price: 'Verð á parketlögn', work: 'Myndir úr verkum', quote: 'Tilboð í parketlögn' },
    price: {
      title: 'Verð á parketlögn og hvað tilboðið nær yfir',
      lead: 'Verð á fermetra nýtist aðeins ef ljóst er hvaða vinna og efni fylgja með. Við metum verkið áður en endanlegt tilboð er gert. Biddu um sundurliðun og heildarverð með virðisaukaskatti.',
      items: [
        { title: 'Gólfefni og magn', body: 'Tegund parkets, stærð borða og lagningarmynstur hafa áhrif á efnisþörf. Reikna þarf með skurði og afskurði út frá skipulagi rýmisins. Láttu koma fram hvort parketið sjálft og afhending þess séu innifalin.' },
        { title: 'Afrif og undirbúningur', body: 'Fjarlæging eldra gólfefnis, förgun, rakamæling og jöfnun undirlags eru sérstakir verkþættir. Þörfin kemur í ljós við mat á gólfinu. Ójafnt eða rakt undirlag þarf að leysa áður en ný lögn hefst.' },
        { title: 'Lögn og mynstur', body: 'Bein plankalögn og síldarbeinaparket krefjast ólíkrar skipulagningar og skurðarvinnu. Mörg lítil herbergi, horn og dyr geta líka breytt vinnunni þótt fermetrafjöldinn sé sá sami.' },
        { title: 'Listar og lokafrágangur', body: 'Skilgreindu gólflista, þröskulda, tengingar við flísar, flutning húsgagna og þrif. Aðgengi og ferðakostnaður, ef við á, eiga einnig að koma fram áður en verkið er samþykkt.' },
      ],
      example: 'Dæmi um samanburð: tvö 50 m² gólf geta þurft ólíka vinnu. Annað er eitt opið rými á tilbúnu undirlagi, hitt skiptist í nokkur herbergi og þarf afrif og jöfnun. Berðu saman tilboð fyrir sama verkumfang, ekki aðeins fermetraverðið.',
    },
    work: {
      title: 'Parketvinna úr verkefnasafninu',
      lead: 'Ljósmyndir úr fyrirliggjandi verkefnasafni Expert Parket og Mál. Skoðaðu lagningarmynstur og frágang þegar þú velur útlit fyrir þitt rými.',
      captions: ['Plankaparket við stóra glugga.', 'Mynsturlagt parket í forstofu.'],
      link: 'Skoða fleiri myndir úr verkum',
    },
    process: {
      title: 'Svona skipuleggjum við parketlögnina',
      steps: [
        { title: 'Myndir og fyrsta mat', body: 'Þú sendir staðsetningu, áætlaðar stærðir og myndir. Við ræðum gólfefni, mynstur og hvort fjarlægja þurfi gamla gólfið.' },
        { title: 'Undirlag, tilboð og tími', body: 'Við metum undirlagið og þörf fyrir skoðun á staðnum. Umfang, efni, frágangur og tímasetningar eru skýrð áður en þú staðfestir verkið.' },
        { title: 'Lögn og afhending', body: 'Verkið er unnið samkvæmt samþykktu umfangi og leiðbeiningum framleiðanda. Við förum yfir frágang, umhirðu og hvenær má taka gólfið í notkun.' },
      ],
    },
    quote: {
      title: 'Fáðu frítt tilboð í parketlögn',
      lead: 'Þessar upplýsingar hjálpa okkur að meta verkið og spyrja réttu spurninganna strax:',
      items: [
        'Staðsetning, fjöldi herbergja og áætlaðir fermetrar.',
        'Yfirlitsmyndir af gólfinu og nærmyndir við dyr og samskeyti.',
        'Parketið eða mynstrið sem þú vilt, eða ósk um aðstoð við val.',
        'Hvort þurfi að fjarlægja gamla gólfið og endurnýja lista.',
        'Upplýsingar um gólfhita, þekktan raka og aðgengi.',
        'Óskatími og hvort húsgögn séu í rýminu.',
      ],
      cta: 'Senda fyrirspurn um parketlögn',
      catalog: 'Skoða parketúrvalið',
    },
  },
  en: {
    nav: { price: 'Installation cost', work: 'Work photographs', quote: 'Request a quote' },
    price: {
      title: 'Parquet installation cost and what the quote covers',
      lead: 'A price per square metre is useful only when the materials and work included are clear. We assess the project before preparing a final quote. Ask for a breakdown and the total including VAT.',
      items: [
        { title: 'Flooring and quantity', body: 'Flooring type, board size and laying pattern affect material requirements. Cutting and waste must be allowed for according to the room layout. Check whether the boards themselves and delivery are included.' },
        { title: 'Removal and preparation', body: 'Removing old flooring, disposal, moisture checks and subfloor levelling are separate tasks. The assessment establishes what is needed. An uneven or damp base must be addressed before installation.' },
        { title: 'Installation and pattern', body: 'Straight planks and herringbone parquet require different planning and cutting. Several small rooms, corners and doorways can also change the work even when the total floor area is identical.' },
        { title: 'Skirting and completion', body: 'Define the skirting, thresholds, transitions to tiles, furniture moving and cleanup. Access and any travel costs should also be clear before you approve the project.' },
      ],
      example: 'Comparison example: two 50 m² floors can require different work. One is an open room on a prepared base; the other has several rooms and needs removal and levelling. Compare quotes for the same scope, rather than the square-metre rate alone.',
    },
    work: {
      title: 'Parquet work from our project gallery',
      lead: 'Photographs from the existing Expert Parket og Mál project gallery. Look at the patterns and finishing details when choosing the appearance of your floor.',
      captions: ['Plank flooring beside large windows.', 'Patterned parquet in an entrance hall.'],
      link: 'See more work photographs',
    },
    process: {
      title: 'How we plan your parquet installation',
      steps: [
        { title: 'Photographs and initial assessment', body: 'Send the location, approximate dimensions and photographs. We discuss the flooring, pattern and whether the existing floor needs removing.' },
        { title: 'Subfloor, quotation and schedule', body: 'We assess the base and whether a site visit is needed. Scope, materials, finishing details and timing are clarified before you confirm the work.' },
        { title: 'Installation and handover', body: 'The work follows the agreed scope and manufacturer instructions. We go through the finishing details, care and when the floor can be used.' },
      ],
    },
    quote: {
      title: 'Get a free parquet installation quote',
      lead: 'These details help us assess the project and ask the right questions from the start:',
      items: [
        'Location, number of rooms and approximate floor area.',
        'Room photographs and close-ups of doorways and transitions.',
        'Your preferred flooring or pattern, or a request for help choosing.',
        'Whether old flooring needs removing and skirting needs replacing.',
        'Underfloor heating, known moisture issues and access.',
        'Preferred timing and whether the rooms contain furniture.',
      ],
      cta: 'Enquire about parquet installation',
      catalog: 'Explore the flooring range',
    },
  },
  pl: {
    nav: { price: 'Cena układania', work: 'Zdjęcia realizacji', quote: 'Zapytaj o wycenę' },
    price: {
      title: 'Cena układania parkietu i zakres wyceny',
      lead: 'Stawka za metr kwadratowy ma znaczenie, gdy wiadomo, jakie materiały i prace obejmuje. Przed ostateczną wyceną oceniamy zakres zlecenia. Poproś o rozbicie kosztów i cenę całkowitą z VAT.',
      items: [
        { title: 'Materiał i ilość', body: 'Rodzaj parkietu, wielkość desek i wzór wpływają na ilość materiału. Docinki i odpady trzeba uwzględnić zgodnie z układem pomieszczeń. Sprawdź, czy cena obejmuje parkiet i jego dostawę.' },
        { title: 'Demontaż i przygotowanie', body: 'Usunięcie starej podłogi, wywóz odpadów, pomiar wilgotności i wyrównanie podłoża to osobne prace. Ocena podłogi pozwala określić potrzeby. Nierówności lub wilgoć należy usunąć przed rozpoczęciem montażu.' },
        { title: 'Układanie i wzór', body: 'Proste deski i jodełka wymagają innego planowania i docinania. Kilka małych pomieszczeń, narożniki i przejścia drzwiowe mogą zmienić nakład pracy nawet przy identycznym metrażu.' },
        { title: 'Listwy i wykończenie', body: 'Ustal zakres listew, progów, połączeń z płytkami, przesuwania mebli i sprzątania. Dostęp oraz ewentualne koszty dojazdu również powinny być znane przed zatwierdzeniem zlecenia.' },
      ],
      example: 'Przykład porównania: dwie podłogi po 50 m² mogą wymagać różnych prac. Jedna to otwarte pomieszczenie z gotowym podłożem, druga obejmuje kilka pokoi oraz demontaż i wyrównanie. Porównuj oferty o tym samym zakresie, a nie samą stawkę za metr.',
    },
    work: {
      title: 'Prace parkieciarskie z naszej galerii',
      lead: 'Zdjęcia z dotychczasowej galerii realizacji Expert Parket og Mál. Przy wyborze wyglądu swojej podłogi zwróć uwagę na wzory i detale wykończenia.',
      captions: ['Podłoga z desek przy dużych oknach.', 'Parkiet ułożony we wzór w przedpokoju.'],
      link: 'Zobacz więcej zdjęć realizacji',
    },
    process: {
      title: 'Jak planujemy układanie parkietu',
      steps: [
        { title: 'Zdjęcia i wstępna ocena', body: 'Prześlij lokalizację, przybliżone wymiary i zdjęcia. Omawiamy materiał, wzór oraz ewentualną konieczność usunięcia starej podłogi.' },
        { title: 'Podłoże, wycena i harmonogram', body: 'Oceniamy podłoże i potrzebę oględzin na miejscu. Wyjaśniamy zakres, materiały, wykończenie i terminy, zanim potwierdzisz zlecenie.' },
        { title: 'Montaż i odbiór', body: 'Pracujemy zgodnie z uzgodnionym zakresem i instrukcjami producenta. Omawiamy wykończenie, pielęgnację i moment rozpoczęcia użytkowania podłogi.' },
      ],
    },
    quote: {
      title: 'Bezpłatna wycena układania parkietu',
      lead: 'Te informacje pomogą nam ocenić zlecenie i od razu zadać właściwe pytania:',
      items: [
        'Lokalizacja, liczba pomieszczeń i przybliżony metraż.',
        'Zdjęcia pomieszczeń i zbliżenia progów oraz połączeń podłóg.',
        'Wybrany parkiet lub wzór albo prośba o pomoc w wyborze.',
        'Informacja o demontażu starej podłogi i wymianie listew.',
        'Ogrzewanie podłogowe, znane problemy z wilgocią i dostęp.',
        'Preferowany termin i informacja, czy w pokojach są meble.',
      ],
      cta: 'Wyślij zapytanie o układanie parkietu',
      catalog: 'Zobacz ofertę parkietów',
    },
  },
}
