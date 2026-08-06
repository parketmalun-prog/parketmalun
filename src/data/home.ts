import type { Lang } from '@/i18n/config'
import type { ServiceKey } from './site'

/**
 * Home page content, PLANKI edition. Icelandic is the primary voice; en/pl
 * translate it faithfully. House rules: no dashes of any kind, no formula
 * copy, concrete craftsman facts only. Photo captions follow the style
 * "Place · Year · Wood".
 */

type HomeContent = {
  seo: { title: string; description: string }
  hero: {
    /** The three stacked display words, e.g. Parket. / Slípun. / Málun. */
    lines: [string, string, string]
    lead: string
    cta: string
    photoCaption: string
    strip: Array<{ value: string; label: string }>
  }
  services: {
    label: string
    title: string
    items: Array<{ key: ServiceKey; name: string; line: string }>
  }
  why: {
    label: string
    title: string
    items: Array<{ title: string; text: string }>
  }
  beforeAfter: {
    label: string
    title: string
    lines: string[]
  }
  interlude: { before: string; italic: string }
  process: {
    label: string
    title: string
    steps: Array<{ title: string; text: string }>
  }
  portfolioStrip: {
    label: string
    title: string
    captions: string[]
  }
  testimonials: {
    label: string
    title: string
    items: Array<{ name: string; location: string; quote: string }>
  }
  area: {
    label: string
    title: string
    lead: string
    places: string[]
  }
  faq: {
    label: string
    title: string
    items: Array<{ q: string; a: string }>
  }
}

const is: HomeContent = {
  seo: {
    title: 'Expert Parket og Mál | Parketlögn, slípun og málun á höfuðborgarsvæðinu',
    description:
      'Leggjum, slípum og málum gólf á höfuðborgarsvæðinu. Sami eigandi og sama símanúmer í meira en 25 ár. Frítt verðtilboð í síma 785 7079.',
  },
  hero: {
    lines: ['Parket.', 'Slípun.', 'Málun.'],
    lead: 'Við leggjum, slípum og málum gólf á höfuðborgarsvæðinu. Sami eigandi og sama símanúmer í meira en 25 ár.',
    cta: 'Fáðu frítt tilboð',
    photoCaption: 'Eikarparket · Höfuðborgarsvæðið',
    strip: [
      { value: '25+', label: 'ára reynsla' },
      { value: 'Höfuðborgarsvæðið', label: 'þjónustusvæði' },
      { value: 'Parket · Slípun · Málun', label: 'þrjár sérgreinar' },
      { value: '785 7079', label: 'síminn okkar' },
    ],
  },
  services: {
    label: 'Þjónusta',
    title: 'Þrjár sérgreinar',
    items: [
      {
        key: 'parket',
        name: 'Parketlögn',
        line: 'Ný gólf lögð á undirlag sem við undirbúum sjálfir. Plankar, síldarbein eða stafaparket.',
      },
      {
        key: 'slipun',
        name: 'Parketslípun',
        line: 'Slípað í þrepum, 40 til 120 korn, með rykfríum vélum. Olía eða lakk eftir vali.',
      },
      {
        key: 'malun',
        name: 'Málun',
        line: 'Loft, veggir og gólflistar málaðir í sömu verkferð og gólfvinnan. Hrein lína og jafn litur.',
      },
    ],
  },
  why: {
    label: 'Af hverju okkur',
    title: 'Þrjú atriði sem skipta máli',
    items: [
      {
        title: 'Allt í sömu hendi',
        text: 'Parket, slípun og málun hjá sama fagmanni. Enginn bendir á annan þegar spurt er hver klárar hvað.',
      },
      {
        title: 'Tilboðið stendur',
        text: 'Skoðun er frí og tilboðið skriflegt. Upphæðin á blaðinu er sú sem þú borgar.',
      },
      {
        title: 'Hreint heimili',
        text: 'Vélarnar eru tengdar við sog og vinnusvæðið er sópað í lok hvers dags, ekki bara í verklok.',
      },
    ],
  },
  beforeAfter: {
    label: 'Slípun í verki',
    title: 'Slitið gólf, slípað og olíuborið',
    lines: [
      'Slípað í þremur umferðum, 40, 80 og 120 korn.',
      'Rykfrí slípivél með beinu sogi, heimilið helst hreint.',
      'Olíuborið tvisvar og gengið frá á 2 til 3 dögum.',
    ],
  },
  interlude: { before: 'Gólf sem eldast ', italic: 'fallega.' },
  process: {
    label: 'Ferlið',
    title: 'Svona vinnum við',
    steps: [
      { title: 'Þú hefur samband', text: 'Hringdu í 785 7079 eða sendu línu. Við bókum skoðun sem hentar þér.' },
      { title: 'Skoðun og tilboð', text: 'Við mætum, mælum og skiljum eftir skriflegt verðtilboð. Það stendur.' },
      { title: 'Verkið unnið', text: 'Mætum á umsömdum tíma og vinnum verkið með virðingu fyrir heimilinu.' },
      { title: 'Verklok og þrif', text: 'Gólflistar og þröskuldar frágengnir, hreinsað eftir okkur, verkinu skilað.' },
    ],
  },
  portfolioStrip: {
    label: 'Verkefni',
    title: 'Nýleg verk',
    captions: [
      'Garðabær · 2024 · Eik',
      'Vesturbær · 2023 · Síldarbein',
      'Kársnes · 2024 · Askur',
      'Mosfellsbær · 2023 · Eik',
      'Grafarvogur · 2025 · Hnota',
    ],
  },
  testimonials: {
    label: 'Ummæli',
    title: 'Það sem viðskiptavinir segja',
    items: [
      {
        name: 'Guðrún Halldórsdóttir',
        location: 'Garðabær',
        quote:
          'Þeir lögðu eikarparket í alla hæðina hjá okkur og útkoman er hreint út sagt glæsileg. Vönduð vinnubrögð, stundvísir og gengu vel frá öllu. Ég mæli eindregið með þeim.',
      },
      {
        name: 'Sigurður Þór Jónsson',
        location: 'Reykjavík',
        quote:
          'Gamla stofugólfið var orðið ansi þreytt en eftir slípun og olíuburð lítur það út eins og nýtt. Ótrúlegur munur og nánast ekkert ryk á meðan. Frábær þjónusta.',
      },
      {
        name: 'Anna Kristín Sigurðardóttir',
        location: 'Kópavogur',
        quote:
          'Þeir máluðu alla íbúðina fyrir okkur áður en við fluttum inn. Hreinar línur, jafnir fletir og allt klárt á umsömdum tíma. Fagmenn fram í fingurgóma.',
      },
      {
        name: 'Ólafur Magnússon',
        location: 'Hafnarfjörður',
        quote:
          'Áreiðanlegir menn sem standa við orð sín. Verðið sem þeir gáfu stóðst og verkið var unnið hratt og vel. Maður finnur að þarna er 25 ára reynsla að baki.',
      },
    ],
  },
  area: {
    label: 'Þjónustusvæði',
    title: 'Við mætum um allt höfuðborgarsvæðið',
    lead: 'Sami bíll, sömu vélar og sami fagmaður, hvort sem verkið er í Vesturbænum eða uppi í Mosfellsbæ.',
    places: [
      'Reykjavík',
      'Kópavogur',
      'Hafnarfjörður',
      'Garðabær',
      'Mosfellsbær',
      'Seltjarnarnes',
      'Álftanes',
      'Kjalarnes',
    ],
  },
  faq: {
    label: 'Spurt og svarað',
    title: 'Það sem flestir spyrja um',
    items: [
      {
        q: 'Hvað tekur slípun langan tíma?',
        a: 'Áttatíu fermetra íbúð tekur yfirleitt tvo til fjóra daga, slípun og yfirborðsmeðferð með þurrktíma á milli umferða.',
      },
      {
        q: 'Verður mikið ryk?',
        a: 'Slípivélin er tengd við sog svo mesta rykið endar í vélinni. Við sópum og ryksugum í lok hvers vinnudags.',
      },
      {
        q: 'Kostar skoðunin eitthvað?',
        a: 'Nei. Við mætum, mælum fermetrana, skoðum undirlagið og skiljum eftir skriflegt tilboð án skuldbindingar.',
      },
      {
        q: 'Get ég fengið parket og málun í sama verki?',
        a: 'Já, og það er yfirleitt skynsamlegast. Málað er eftir gólfvinnuna svo heimilið raskast bara einu sinni.',
      },
    ],
  },
}

const en: HomeContent = {
  seo: {
    title: 'Expert Parket og Mál | Parquet laying, sanding and painting in the Reykjavík area',
    description:
      'We lay, sand and paint floors across the Reykjavík capital region. Same owner and same phone number for more than 25 years. Free quote on 785 7079.',
  },
  hero: {
    lines: ['Parquet.', 'Sanding.', 'Painting.'],
    lead: 'We lay, sand and paint floors across the capital region. Same owner and same phone number for more than 25 years.',
    cta: 'Get a free quote',
    photoCaption: 'Oak parquet · Reykjavík area',
    strip: [
      { value: '25+', label: 'years of experience' },
      { value: 'Capital region', label: 'service area' },
      { value: 'Parquet · Sanding · Painting', label: 'three trades' },
      { value: '785 7079', label: 'our phone' },
    ],
  },
  services: {
    label: 'Services',
    title: 'Three trades',
    items: [
      {
        key: 'parket',
        name: 'Parquet laying',
        line: 'New floors laid on subfloors we prepare ourselves. Planks, herringbone or mosaic parquet.',
      },
      {
        key: 'slipun',
        name: 'Floor sanding',
        line: 'Sanded in stages, 40 to 120 grit, with dust-free machines. Oil or lacquer finish.',
      },
      {
        key: 'malun',
        name: 'Painting',
        line: 'Ceilings, walls and skirting boards painted in the same visit as the floor work. Clean lines, even colour.',
      },
    ],
  },
  why: {
    label: 'Why us',
    title: 'Three things that matter',
    items: [
      {
        title: 'One pair of hands',
        text: 'Parquet, sanding and painting from the same craftsman. Nobody points at anybody else about who finishes what.',
      },
      {
        title: 'The quote holds',
        text: 'The visit is free and the quote is written. The figure on the paper is the figure you pay.',
      },
      {
        title: 'A clean home',
        text: 'The machines run on extraction and the work area is swept at the end of every day, not just at handover.',
      },
    ],
  },
  beforeAfter: {
    label: 'Sanding shown',
    title: 'A worn floor, sanded and oiled',
    lines: [
      'Sanded in three passes, 40, 80 and 120 grit.',
      'Dust-free sander with direct extraction, the home stays clean.',
      'Oiled twice and handed over within 2 to 3 days.',
    ],
  },
  interlude: { before: 'Floors that age ', italic: 'beautifully.' },
  process: {
    label: 'The process',
    title: 'How we work',
    steps: [
      { title: 'You get in touch', text: 'Call 785 7079 or send a line. We book a visit that suits you.' },
      { title: 'Visit and quote', text: 'We come, measure and leave a written quote. It stands.' },
      { title: 'The work', text: 'We arrive at the agreed time and do the job with respect for your home.' },
      { title: 'Handover and cleanup', text: 'Skirting and thresholds finished, everything cleaned, the job handed over.' },
    ],
  },
  portfolioStrip: {
    label: 'Projects',
    title: 'Recent work',
    captions: [
      'Garðabær · 2024 · Oak',
      'Vesturbær · 2023 · Herringbone',
      'Kársnes · 2024 · Ash',
      'Mosfellsbær · 2023 · Oak',
      'Grafarvogur · 2025 · Walnut',
    ],
  },
  testimonials: {
    label: 'Reviews',
    title: 'What our customers say',
    items: [
      {
        name: 'Guðrún Halldórsdóttir',
        location: 'Garðabær',
        quote:
          'They laid oak parquet across our whole floor and the result is simply stunning. Quality workmanship, punctual and they finished everything neatly. I highly recommend them.',
      },
      {
        name: 'Sigurður Þór Jónsson',
        location: 'Reykjavík',
        quote:
          'Our old living room floor was looking pretty tired, but after sanding and oiling it looks like new. An incredible difference and almost no dust during the work. Excellent service.',
      },
      {
        name: 'Anna Kristín Sigurðardóttir',
        location: 'Kópavogur',
        quote:
          'They painted the whole apartment for us before we moved in. Clean lines, even surfaces and everything ready on the agreed date. Professionals to their fingertips.',
      },
      {
        name: 'Ólafur Magnússon',
        location: 'Hafnarfjörður',
        quote:
          'Reliable people who keep their word. The price they quoted held and the work was done quickly and well. You can tell there are 25 years of experience behind it.',
      },
    ],
  },
  area: {
    label: 'Service area',
    title: 'We come out across the whole capital region',
    lead: 'Same van, same machines and the same craftsman, whether the job is in Vesturbær or up in Mosfellsbær.',
    places: [
      'Reykjavík',
      'Kópavogur',
      'Hafnarfjörður',
      'Garðabær',
      'Mosfellsbær',
      'Seltjarnarnes',
      'Álftanes',
      'Kjalarnes',
    ],
  },
  faq: {
    label: 'Questions',
    title: 'What most people ask',
    items: [
      {
        q: 'How long does sanding take?',
        a: 'An eighty square metre apartment usually takes two to four days, sanding and finishing with drying time between coats.',
      },
      {
        q: 'Will there be a lot of dust?',
        a: 'The sander runs on extraction so most of the dust ends up in the machine. We sweep and vacuum at the end of every working day.',
      },
      {
        q: 'Does the visit cost anything?',
        a: 'No. We come out, measure the square metres, check the subfloor and leave a written quote with no obligation.',
      },
      {
        q: 'Can I have parquet and painting in one job?',
        a: 'Yes, and it usually makes the most sense. We paint after the floor work so your home is disrupted only once.',
      },
    ],
  },
}

const pl: HomeContent = {
  seo: {
    title: 'Expert Parket og Mál | Układanie parkietu, cyklinowanie i malowanie w rejonie Reykjavíku',
    description:
      'Układamy, cyklinujemy i malujemy podłogi w rejonie stołecznym Reykjavíku. Ten sam właściciel i ten sam numer telefonu od ponad 25 lat. Darmowa wycena pod numerem 785 7079.',
  },
  hero: {
    lines: ['Parkiet.', 'Cyklinowanie.', 'Malowanie.'],
    lead: 'Układamy, cyklinujemy i malujemy podłogi w rejonie stołecznym. Ten sam właściciel i ten sam numer telefonu od ponad 25 lat.',
    cta: 'Darmowa wycena',
    photoCaption: 'Parkiet dębowy · Rejon Reykjavíku',
    strip: [
      { value: '25+', label: 'lat doświadczenia' },
      { value: 'Rejon stołeczny', label: 'obszar usług' },
      { value: 'Parkiet · Cyklinowanie · Malowanie', label: 'trzy specjalności' },
      { value: '785 7079', label: 'nasz telefon' },
    ],
  },
  services: {
    label: 'Usługi',
    title: 'Trzy specjalności',
    items: [
      {
        key: 'parket',
        name: 'Układanie parkietu',
        line: 'Nowe podłogi na podłożu, które sami przygotowujemy. Deski, jodełka lub parkiet mozaikowy.',
      },
      {
        key: 'slipun',
        name: 'Cyklinowanie',
        line: 'Szlifowanie etapami, ziarno 40 do 120, maszynami bezpyłowymi. Olej lub lakier do wyboru.',
      },
      {
        key: 'malun',
        name: 'Malowanie',
        line: 'Sufity, ściany i listwy malowane podczas tych samych prac co podłoga. Czysta linia, równy kolor.',
      },
    ],
  },
  why: {
    label: 'Dlaczego my',
    title: 'Trzy rzeczy, które mają znaczenie',
    items: [
      {
        title: 'Wszystko w jednych rękach',
        text: 'Parkiet, cyklinowanie i malowanie u tego samego fachowca. Nikt nie wskazuje na kogoś innego, kto co kończy.',
      },
      {
        title: 'Wycena obowiązuje',
        text: 'Oględziny są darmowe, a wycena pisemna. Kwota na papierze to kwota, którą płacisz.',
      },
      {
        title: 'Czysty dom',
        text: 'Maszyny pracują z odsysaniem, a miejsce pracy zamiatamy na koniec każdego dnia, nie tylko przy odbiorze.',
      },
    ],
  },
  beforeAfter: {
    label: 'Cyklinowanie w praktyce',
    title: 'Zużyta podłoga, wycyklinowana i olejowana',
    lines: [
      'Szlifowana w trzech przejściach, ziarno 40, 80 i 120.',
      'Szlifierka bezpyłowa z bezpośrednim odsysaniem, dom zostaje czysty.',
      'Dwukrotnie olejowana i oddana w 2 do 3 dni.',
    ],
  },
  interlude: { before: 'Podłogi, które starzeją się ', italic: 'pięknie.' },
  process: {
    label: 'Proces',
    title: 'Tak pracujemy',
    steps: [
      { title: 'Kontakt', text: 'Zadzwoń pod 785 7079 lub napisz. Umówimy oględziny w dogodnym terminie.' },
      { title: 'Oględziny i wycena', text: 'Przyjeżdżamy, mierzymy i zostawiamy pisemną wycenę. Ona obowiązuje.' },
      { title: 'Praca', text: 'Przychodzimy o umówionej porze i pracujemy z szacunkiem dla Twojego domu.' },
      { title: 'Odbiór i sprzątanie', text: 'Listwy i progi wykończone, wszystko posprzątane, praca oddana.' },
    ],
  },
  portfolioStrip: {
    label: 'Realizacje',
    title: 'Ostatnie prace',
    captions: [
      'Garðabær · 2024 · Dąb',
      'Vesturbær · 2023 · Jodełka',
      'Kársnes · 2024 · Jesion',
      'Mosfellsbær · 2023 · Dąb',
      'Grafarvogur · 2025 · Orzech',
    ],
  },
  testimonials: {
    label: 'Opinie',
    title: 'Co mówią nasi klienci',
    items: [
      {
        name: 'Guðrún Halldórsdóttir',
        location: 'Garðabær',
        quote:
          'Ułożyli dębowy parkiet na całym piętrze, a efekt jest po prostu wspaniały. Solidna praca, punktualność i wszystko dopięte na ostatni guzik. Gorąco polecam.',
      },
      {
        name: 'Sigurður Þór Jónsson',
        location: 'Reykjavík',
        quote:
          'Stara podłoga w salonie była mocno zmęczona, ale po cyklinowaniu i olejowaniu wygląda jak nowa. Niesamowita różnica i prawie żadnego kurzu podczas prac. Świetna obsługa.',
      },
      {
        name: 'Anna Kristín Sigurðardóttir',
        location: 'Kópavogur',
        quote:
          'Pomalowali nam całe mieszkanie przed przeprowadzką. Czyste linie, równe powierzchnie i wszystko gotowe w umówionym terminie. Fachowcy w każdym calu.',
      },
      {
        name: 'Ólafur Magnússon',
        location: 'Hafnarfjörður',
        quote:
          'Rzetelni ludzie, którzy dotrzymują słowa. Podana cena się zgadzała, a praca została wykonana szybko i dobrze. Czuć, że stoi za tym 25 lat doświadczenia.',
      },
    ],
  },
  area: {
    label: 'Obszar usług',
    title: 'Dojeżdżamy w całym rejonie stołecznym',
    lead: 'Ten sam samochód, te same maszyny i ten sam fachowiec, czy praca jest w Vesturbær, czy w Mosfellsbær.',
    places: [
      'Reykjavík',
      'Kópavogur',
      'Hafnarfjörður',
      'Garðabær',
      'Mosfellsbær',
      'Seltjarnarnes',
      'Álftanes',
      'Kjalarnes',
    ],
  },
  faq: {
    label: 'Pytania',
    title: 'O co pytają najczęściej',
    items: [
      {
        q: 'Ile trwa cyklinowanie?',
        a: 'Mieszkanie osiemdziesięciometrowe zajmuje zwykle dwa do czterech dni, szlifowanie i wykończenie z czasem schnięcia między warstwami.',
      },
      {
        q: 'Czy będzie dużo kurzu?',
        a: 'Szlifierka pracuje z odsysaniem, więc większość pyłu trafia do maszyny. Zamiatamy i odkurzamy na koniec każdego dnia pracy.',
      },
      {
        q: 'Czy oględziny kosztują?',
        a: 'Nie. Przyjeżdżamy, mierzymy metry, sprawdzamy podłoże i zostawiamy pisemną wycenę bez zobowiązań.',
      },
      {
        q: 'Czy mogę zamówić parkiet i malowanie w jednej pracy?',
        a: 'Tak i zwykle to ma największy sens. Malujemy po pracach podłogowych, więc dom przechodzi remont tylko raz.',
      },
    ],
  },
}

export const home: Record<Lang, HomeContent> = { is, en, pl }
