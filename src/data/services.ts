import type { Lang } from '@/i18n/config'
import type { ServiceKey } from './site'

/**
 * Services page content, PLANKI edition. Concrete craftsman voice, no dashes,
 * no formula copy. Icelandic first; en/pl translate faithfully.
 */

export type Service = {
  key: ServiceKey
  title: string
  /** One concrete positioning line under the title. */
  intro: string
  paragraphs: [string, string]
  includes: string[]
  /** Label for the per-service quote link. */
  cta: string
  /** Caption for the sticky photo slot while this service is active. */
  photoCaption: string
}

type Intro = {
  title: string
  /** Small-caps label for the SectionIndex opening the service ledger. */
  label: string
  lead: string
}
type SeoText = { title: string; description: string }
/** Copy for the espresso contact band sitting under the last service block. */
type Band = { line: string; italic: string }

export const servicesIntro: Record<Lang, Intro> = {
  is: {
    title: 'Þjónusta',
    label: 'Sérgreinar',
    lead: 'Þrjár sérgreinar undir sama þaki: parketlögn, parketslípun og málun. Sama teymið sér verkið frá skoðun að verklokum.',
  },
  en: {
    title: 'Services',
    label: 'Trades',
    lead: 'Three trades under one roof: parquet laying, floor sanding and painting. The same team follows the job from the first visit to handover.',
  },
  pl: {
    title: 'Usługi',
    label: 'Specjalności',
    lead: 'Trzy specjalności pod jednym dachem: układanie parkietu, cyklinowanie i malowanie. Ten sam zespół prowadzi pracę od oględzin do odbioru.',
  },
}

/**
 * The one full-bleed espresso band on the Services page: a single Fraunces
 * statement with the phone set large beside it. Contact intent, concrete.
 */
export const servicesBand: Record<Lang, Band> = {
  is: {
    line: 'Segðu okkur fermetrana, við mælum og gerum tilboð innan ',
    italic: 'vikunnar.',
  },
  en: {
    line: 'Tell us the square metres, we measure and quote within the ',
    italic: 'week.',
  },
  pl: {
    line: 'Podaj metraż, mierzymy i wyceniamy w ciągu ',
    italic: 'tygodnia.',
  },
}

export const servicesSeo: Record<Lang, SeoText> = {
  is: {
    title: 'Þjónusta | Parketlögn, parketslípun og málun | Expert Parket og Mál',
    description:
      'Parketlögn á undirbúið undirlag, slípun með rykfríum vélum og málun í sömu verkferð. Skriflegt verðtilboð eftir fría skoðun á höfuðborgarsvæðinu.',
  },
  en: {
    title: 'Services | Parquet laying, floor sanding and painting | Expert Parket og Mál',
    description:
      'Parquet laid on properly prepared subfloors, dust-free sanding and painting in the same visit. Written quote after a free visit in the Reykjavík area.',
  },
  pl: {
    title: 'Usługi | Układanie parkietu, cyklinowanie i malowanie | Expert Parket og Mál',
    description:
      'Parkiet układany na przygotowanym podłożu, bezpyłowe cyklinowanie i malowanie podczas tych samych prac. Pisemna wycena po darmowych oględzinach w rejonie Reykjavíku.',
  },
}

export const servicesPriceNote: Record<Lang, string> = {
  is: 'Verð fer eftir fermetrum og ástandi gólfsins. Skoðun er frí og verðtilboðið er skriflegt. Það sem stendur í tilboðinu gildir.',
  en: 'Pricing depends on square metres and the condition of the floor. The visit is free and the quote is written. What the quote says is what applies.',
  pl: 'Cena zależy od metrażu i stanu podłogi. Oględziny są darmowe, a wycena pisemna. To, co jest w wycenie, obowiązuje.',
}

export const services: Record<Lang, Service[]> = {
  is: [
    {
      key: 'parket',
      title: 'Parketlögn',
      intro: 'Gólf sem liggur slétt af því að undirlagið var rétt frá byrjun.',
      paragraphs: [
        'Við byrjum undir gólfinu: mælum rakastig, flotum þar sem þarf og jöfnum undirlagið áður en fyrsta borðið fer niður. Síðan er lagt með réttri þenslurauf við veggi svo viðurinn geti hreyft sig eftir árstíðum án þess að lyfta sér eða gapa.',
        'Við leggjum gegnheilt parket, spónlagt og harðparket, sem planka, síldarbein eða stafamynstur. Við segjum þér hreint út hvað hentar rýminu, umferðinni og gólfhitanum, líka þegar ódýrari kosturinn er sá rétti.',
      ],
      includes: [
        'Rakamæling og mat á undirlagi',
        'Flotun og jöfnun þar sem þarf',
        'Lögn: plankar, síldarbein, stafaparket',
        'Þenslurauf og frágangur við veggi',
        'Gólflistar og þröskuldar settir upp',
      ],
      cta: 'Fáðu tilboð í parketlögn',
      photoCaption: 'Parketlögn · Síldarbein · Eik',
    },
    {
      key: 'slipun',
      title: 'Parketslípun',
      intro: 'Slitið gólf verður aftur að viðargólfi, án þess að rífa neitt upp.',
      paragraphs: [
        'Við slípum í þremur til fjórum umferðum, frá 40 korna pappír upp í 120, með vélum með beinu ryksogi. Kantvél nær alveg upp að veggjum og inn í horn. Rispur, blettir og gamalt lakk fara af og hreinn viðurinn kemur fram.',
        'Svo velur þú áferðina: sterkt lakk fyrir mikla umferð, náttúruleg olía fyrir hlýrri viðarblæ, eða hvíttun fyrir ljósari tón. Flest gólf eru slípuð, meðhöndluð og tilbúin á 2 til 3 dögum.',
      ],
      includes: [
        'Slípun í 3 til 4 umferðum, 40 til 120 korn',
        'Rykfríar vélar með beinu sogi',
        'Kantslípun að veggjum og hornum',
        'Viðgerðir á rispum og minni skemmdum',
        'Lakk, olía eða hvíttun, matt eða silkimatt',
      ],
      cta: 'Fáðu tilboð í slípun',
      photoCaption: 'Parketslípun · 120 korn · Olía',
    },
    {
      key: 'malun',
      title: 'Málun',
      intro: 'Loft, veggir og listar kláraðir í sömu verkferð og gólfið.',
      paragraphs: [
        'Þegar gólfvinnan er búin er rétti tíminn til að mála: engin hætta á málningarslettum á nýslípað gólf og heimilið raskast bara einu sinni. Við spörtlum, grunnum og málum loft, veggi og gólflista með hreinni línu.',
        'Við notum vandaða innimálningu sem þolir þrif og segjum þér nákvæmlega hvaða litakerfi og gljástig hentar hverju rými. Verkinu er skilað með hreinum köntum og engum slettum.',
      ],
      includes: [
        'Spörtlun og grunnvinna',
        'Loft, veggir og gólflistar',
        'Hrein lína við kanta og samskeyti',
        'Vönduð innimálning sem þolir þrif',
        'Þrif og frágangur eftir verkið',
      ],
      cta: 'Fáðu tilboð í málun',
      photoCaption: 'Málun · Innimálning · Hrein lína',
    },
  ],
  en: [
    {
      key: 'parket',
      title: 'Parquet laying',
      intro: 'A floor that lies flat because the subfloor was right from the start.',
      paragraphs: [
        'We start under the floor: we measure moisture, level with compound where needed and prepare the subfloor before the first board goes down. Then we lay with a proper expansion gap at the walls so the wood can move with the seasons without lifting or gapping.',
        'We lay solid parquet, engineered boards and laminate, as planks, herringbone or mosaic patterns. We tell you straight what suits the room, the traffic and your underfloor heating, including when the cheaper option is the right one.',
      ],
      includes: [
        'Moisture measurement and subfloor assessment',
        'Levelling compound where needed',
        'Laying: planks, herringbone, mosaic parquet',
        'Expansion gaps and wall detailing',
        'Skirting boards and thresholds fitted',
      ],
      cta: 'Get a quote for parquet laying',
      photoCaption: 'Parquet laying · Herringbone · Oak',
    },
    {
      key: 'slipun',
      title: 'Floor sanding',
      intro: 'A worn floor becomes a wood floor again, without tearing anything out.',
      paragraphs: [
        'We sand in three to four passes, from 40 grit up to 120, with machines running direct dust extraction. An edge sander reaches right up to walls and into corners. Scratches, stains and old lacquer come off and clean wood comes through.',
        'Then you choose the finish: hard lacquer for heavy traffic, natural oil for a warmer tone, or whitening for a lighter look. Most floors are sanded, finished and ready within 2 to 3 days.',
      ],
      includes: [
        'Sanding in 3 to 4 passes, 40 to 120 grit',
        'Dust-free machines with direct extraction',
        'Edge sanding to walls and corners',
        'Repairs of scratches and minor damage',
        'Lacquer, oil or whitening, matt or silk',
      ],
      cta: 'Get a quote for sanding',
      photoCaption: 'Floor sanding · 120 grit · Oil',
    },
    {
      key: 'malun',
      title: 'Painting',
      intro: 'Ceilings, walls and trim finished in the same visit as the floor.',
      paragraphs: [
        'Once the floor work is done, that is the right moment to paint: no risk of splatter on a freshly sanded floor and your home is disrupted only once. We fill, prime and paint ceilings, walls and skirting with clean lines.',
        'We use quality interior paint that stands up to cleaning and tell you exactly which colour system and sheen suits each room. The job is handed over with clean edges and no spatter.',
      ],
      includes: [
        'Filling and priming',
        'Ceilings, walls and skirting boards',
        'Clean lines at edges and joints',
        'Quality washable interior paint',
        'Cleanup and finish after the job',
      ],
      cta: 'Get a quote for painting',
      photoCaption: 'Painting · Interior · Clean line',
    },
  ],
  pl: [
    {
      key: 'parket',
      title: 'Układanie parkietu',
      intro: 'Podłoga leży równo, bo podłoże było dobre od początku.',
      paragraphs: [
        'Zaczynamy pod podłogą: mierzymy wilgotność, wylewamy masę samopoziomującą tam, gdzie trzeba, i przygotowujemy podłoże, zanim położymy pierwszą deskę. Układamy z właściwą szczeliną dylatacyjną przy ścianach, żeby drewno mogło pracować z porami roku bez unoszenia się i szczelin.',
        'Układamy parkiet lity, deski warstwowe i panele, jako deski, jodełkę lub wzór mozaikowy. Mówimy wprost, co pasuje do pomieszczenia, ruchu i ogrzewania podłogowego, także wtedy, gdy tańsza opcja jest tą właściwą.',
      ],
      includes: [
        'Pomiar wilgotności i ocena podłoża',
        'Wylewka samopoziomująca w razie potrzeby',
        'Układanie: deski, jodełka, mozaika',
        'Dylatacje i wykończenie przy ścianach',
        'Montaż listew i progów',
      ],
      cta: 'Wycena układania parkietu',
      photoCaption: 'Układanie parkietu · Jodełka · Dąb',
    },
    {
      key: 'slipun',
      title: 'Cyklinowanie',
      intro: 'Zużyta podłoga znów staje się drewnianą podłogą, bez zrywania czegokolwiek.',
      paragraphs: [
        'Szlifujemy w trzech do czterech przejściach, od ziarna 40 do 120, maszynami z bezpośrednim odsysaniem pyłu. Szlifierka krawędziowa dochodzi do samych ścian i narożników. Rysy, plamy i stary lakier schodzą, a czyste drewno wychodzi na wierzch.',
        'Potem wybierasz wykończenie: twardy lakier do dużego ruchu, naturalny olej dla cieplejszego tonu albo bielenie dla jaśniejszego wyglądu. Większość podłóg jest wycyklinowana, wykończona i gotowa w 2 do 3 dni.',
      ],
      includes: [
        'Szlifowanie w 3 do 4 przejściach, ziarno 40 do 120',
        'Maszyny bezpyłowe z bezpośrednim odsysaniem',
        'Szlifowanie krawędzi przy ścianach i w rogach',
        'Naprawy rys i drobnych uszkodzeń',
        'Lakier, olej lub bielenie, mat lub półmat',
      ],
      cta: 'Wycena cyklinowania',
      photoCaption: 'Cyklinowanie · Ziarno 120 · Olej',
    },
    {
      key: 'malun',
      title: 'Malowanie',
      intro: 'Sufity, ściany i listwy wykończone podczas tych samych prac co podłoga.',
      paragraphs: [
        'Gdy prace podłogowe są skończone, to właściwy moment na malowanie: bez ryzyka plam na świeżo cyklinowanej podłodze, a dom przechodzi remont tylko raz. Szpachlujemy, gruntujemy i malujemy sufity, ściany i listwy z czystą linią.',
        'Używamy dobrej farby wewnętrznej, która wytrzymuje mycie, i mówimy dokładnie, jaki system kolorów i stopień połysku pasuje do każdego pomieszczenia. Pracę oddajemy z czystymi krawędziami i bez plam.',
      ],
      includes: [
        'Szpachlowanie i gruntowanie',
        'Sufity, ściany i listwy przypodłogowe',
        'Czysta linia przy krawędziach i łączeniach',
        'Dobra zmywalna farba wewnętrzna',
        'Sprzątanie i wykończenie po pracy',
      ],
      cta: 'Wycena malowania',
      photoCaption: 'Malowanie · Wnętrza · Czysta linia',
    },
  ],
}
