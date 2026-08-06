import type { Lang } from '@/i18n/config'
import type { ServiceKey } from './site'

/**
 * Portfolio content, PLANKI edition. Projects are framed prints with print
 * captions "Place · Year · Wood". Real photography arrives from the client;
 * until then every frame renders a PhotoSlot.
 */

export type Project = {
  title: string
  location: string
  /** Stable service key: display label comes from `ui.serviceNames`. */
  service: ServiceKey
  description: string
  tag: string
  year: string
  /** Wood / finish note for the print caption, e.g. "Eik · Plankar". */
  wood: string
}

type Intro = { title: string; lead: string }
type SeoText = { title: string; description: string }
/** Caption row under the full-bleed break that splits the project grid. */
type Break = { caption: string; note: string }

export const portfolioSeo: Record<Lang, SeoText> = {
  is: {
    title: 'Verkefni | Parketlögn, slípun og málun | Expert Parket og Mál',
    description:
      'Nýleg verkefni í parketlögn, slípun og málun á höfuðborgarsvæðinu, merkt eftir hverfi, ári og viði. Frítt verðtilboð í síma 785 7079.',
  },
  en: {
    title: 'Projects | Parquet laying, sanding and painting | Expert Parket og Mál',
    description:
      'Recent parquet laying, sanding and painting projects in the Reykjavík area, listed by neighbourhood, year and wood. Free quote on 785 7079.',
  },
  pl: {
    title: 'Realizacje | Układanie parkietu, cyklinowanie i malowanie | Expert Parket og Mál',
    description:
      'Ostatnie realizacje układania parkietu, cyklinowania i malowania w rejonie Reykjavíku, oznaczone dzielnicą, rokiem i drewnem. Darmowa wycena pod 785 7079.',
  },
}

export const portfolioIntro: Record<Lang, Intro> = {
  is: {
    title: 'Verkefni',
    lead: 'Raunveruleg verk um allt höfuðborgarsvæðið, merkt eftir stað, ári og viði. Hafðu samband ef þú vilt sjá dæmi sem líkist þínu verki.',
  },
  en: {
    title: 'Projects',
    lead: 'Real jobs across the capital region, listed by place, year and wood. Get in touch if you want to see an example close to your own project.',
  },
  pl: {
    title: 'Realizacje',
    lead: 'Prawdziwe prace w całym rejonie stołecznym, oznaczone miejscem, rokiem i drewnem. Napisz, jeśli chcesz zobaczyć przykład podobny do Twojego projektu.',
  },
}

export const portfolioBreak: Record<Lang, Break> = {
  is: {
    caption: 'Höfuðborgarsvæðið · 2019 til 2025 · Eik, fura og harðparket',
    note: 'Úr verkbókinni',
  },
  en: {
    caption: 'Capital region · 2019 to 2025 · Oak, pine and laminate',
    note: 'From the job book',
  },
  pl: {
    caption: 'Region stołeczny · 2019 do 2025 · Dąb, sosna i panele',
    note: 'Z księgi robót',
  },
}

export const projects: Record<Lang, Project[]> = {
  is: [
    {
      title: 'Nýtt eikarparket í einbýli',
      location: 'Garðabær',
      service: 'parket',
      description:
        'Gegnheilt eikarparket lagt í stofu og hol, tæplega 90 fermetrar. Undirlagið flotað og jafnað, lögnin olíuborin í lokin.',
      tag: 'Gegnheil eik',
      year: '2024',
      wood: 'Eik · Plankar',
    },
    {
      title: 'Upprunalegt stofugólf endurlífgað',
      location: 'Vesturbær',
      service: 'slipun',
      description:
        'Gamalt gólf í eldra timburhúsi slípað með rykfríum vélum og lakkað upp á nýtt. Djúpar rispur hurfu og upprunalegi liturinn kom fram.',
      tag: 'Endurnýjun',
      year: '2023',
      wood: 'Fura · Lakk',
    },
    {
      title: 'Málun á nýbyggðri íbúð',
      location: 'Kársnes',
      service: 'malun',
      description:
        'Heildarmálun á þriggja herbergja íbúð, veggir og loft. Sparsl, grunnur og tvær yfirferðir, skilað fyrir innflutning á umsömdum degi.',
      tag: 'Ný íbúð',
      year: '2024',
      wood: 'Innimálning',
    },
    {
      title: 'Parket á tveimur hæðum',
      location: 'Mosfellsbær',
      service: 'parket',
      description:
        'Harðparket í öllum svefnherbergjum og á stigagangi. Samfelld lögn milli hæða og snyrtileg tenging við flísar.',
      tag: 'Heilt hús',
      year: '2023',
      wood: 'Eik · Harðparket',
    },
    {
      title: 'Slípun og olíuburður í raðhúsi',
      location: 'Setberg',
      service: 'slipun',
      description:
        'Slitið stofuparket slípað niður í grunn og borið olíu í þrígang. Matt, náttúruleg áferð sem er auðveld í viðhaldi.',
      tag: 'Olíuborið',
      year: '2024',
      wood: 'Eik · Olía',
    },
    {
      title: 'Málun á sameign fjölbýlis',
      location: 'Grafarvogur',
      service: 'malun',
      description:
        'Stigagangur og sameiginleg rými máluð í samráði við húsfélagið. Umgangur hélst opinn og verkinu skilað með lágmarks raski.',
      tag: 'Húsfélag',
      year: '2025',
      wood: 'Sameign',
    },
  ],
  en: [
    {
      title: 'New oak parquet in a detached house',
      location: 'Garðabær',
      service: 'parket',
      description:
        'Solid oak parquet laid in the living room and hall, close to 90 square metres. The subfloor levelled with compound, the floor oiled at handover.',
      tag: 'Solid oak',
      year: '2024',
      wood: 'Oak · Planks',
    },
    {
      title: 'Original living room floor revived',
      location: 'Vesturbær',
      service: 'slipun',
      description:
        'An old floor in an older timber house sanded with dust-free machines and re-lacquered. Deep scratches gone, the original colour back.',
      tag: 'Renovation',
      year: '2023',
      wood: 'Pine · Lacquer',
    },
    {
      title: 'Painting a newly built apartment',
      location: 'Kársnes',
      service: 'malun',
      description:
        'A complete repaint of a three room apartment, walls and ceilings. Filler, primer and two coats, handed over before move-in on the agreed day.',
      tag: 'New apartment',
      year: '2024',
      wood: 'Interior paint',
    },
    {
      title: 'Parquet across two floors',
      location: 'Mosfellsbær',
      service: 'parket',
      description:
        'Laminate laid in all bedrooms and on the staircase. A continuous lay between floors and a neat transition to the tiles.',
      tag: 'Whole house',
      year: '2023',
      wood: 'Oak · Laminate',
    },
    {
      title: 'Sanding and oiling in a terraced house',
      location: 'Setberg',
      service: 'slipun',
      description:
        'A worn living room parquet sanded back to bare wood and oiled three times. A matt, natural finish that is easy to maintain.',
      tag: 'Oiled',
      year: '2024',
      wood: 'Oak · Oil',
    },
    {
      title: 'Painting the common areas of an apartment block',
      location: 'Grafarvogur',
      service: 'malun',
      description:
        'The stairwell and shared spaces repainted in consultation with the residents association. Access stayed open, disruption stayed minimal.',
      tag: 'Residents association',
      year: '2025',
      wood: 'Common areas',
    },
  ],
  pl: [
    {
      title: 'Nowy parkiet dębowy w domu jednorodzinnym',
      location: 'Garðabær',
      service: 'parket',
      description:
        'Parkiet z litego dębu ułożony w salonie i przedpokoju, prawie 90 metrów kwadratowych. Podłoże wyrównane wylewką, podłoga olejowana przy odbiorze.',
      tag: 'Lity dąb',
      year: '2024',
      wood: 'Dąb · Deski',
    },
    {
      title: 'Odnowiona oryginalna podłoga w salonie',
      location: 'Vesturbær',
      service: 'slipun',
      description:
        'Stara podłoga w starszym drewnianym domu wycyklinowana bezpyłowo i na nowo polakierowana. Głębokie rysy zniknęły, pierwotny kolor wrócił.',
      tag: 'Renowacja',
      year: '2023',
      wood: 'Sosna · Lakier',
    },
    {
      title: 'Malowanie nowo wybudowanego mieszkania',
      location: 'Kársnes',
      service: 'malun',
      description:
        'Kompleksowe malowanie trzypokojowego mieszkania, ściany i sufity. Szpachla, grunt i dwie warstwy, oddane przed wprowadzeniem w umówionym dniu.',
      tag: 'Nowe mieszkanie',
      year: '2024',
      wood: 'Farba wewnętrzna',
    },
    {
      title: 'Parkiet na dwóch kondygnacjach',
      location: 'Mosfellsbær',
      service: 'parket',
      description:
        'Panele ułożone we wszystkich sypialniach i na klatce schodowej. Ciągłe układanie między kondygnacjami i schludne połączenie z płytkami.',
      tag: 'Cały dom',
      year: '2023',
      wood: 'Dąb · Panele',
    },
    {
      title: 'Cyklinowanie i olejowanie w szeregowcu',
      location: 'Setberg',
      service: 'slipun',
      description:
        'Zużyty parkiet w salonie wycyklinowany do surowego drewna i trzykrotnie olejowany. Matowe, naturalne wykończenie, łatwe w utrzymaniu.',
      tag: 'Olejowany',
      year: '2024',
      wood: 'Dąb · Olej',
    },
    {
      title: 'Malowanie części wspólnych bloku',
      location: 'Grafarvogur',
      service: 'malun',
      description:
        'Klatka schodowa i pomieszczenia wspólne pomalowane w porozumieniu ze wspólnotą. Dostęp pozostał otwarty, utrudnienia minimalne.',
      tag: 'Wspólnota',
      year: '2025',
      wood: 'Części wspólne',
    },
  ],
}
