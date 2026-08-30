import type { Lang } from '@/i18n/config'

export type ParquetPattern = 'plank' | 'herringbone'

export type Product = {
  name: string
  category: string
  woodTone: string
  description: string
  pricePerM2: number
  thickness: string
  finish: string
  bestFor: string
  badge?: string
  /** Base wood colour for the generated SVG swatch. */
  tone: string
  /** Board layout for the generated SVG swatch. */
  pattern: ParquetPattern
}

type SeoText = { title: string; description: string }
type Category = { key: string; label: string }
type CatalogContent = {
  intro: { title: string; subtitle: string; priceNote: string }
  categories: Category[]
  products: Product[]
}

export const catalogSeo: Record<Lang, SeoText> = {
  is: {
    title: 'Vöruúrval | Parket og verð á m² | Expert Parket og Mál',
    description:
      'Gegnheilt parket, harðparket, vínyl og fiskibein frá traustum framleiðendum. Viðmiðunarverð á fermetra og skriflegt tilboð eftir fría skoðun.',
  },
  en: {
    title: 'Flooring | Parquet and prices per m² | Expert Parket og Mál',
    description:
      'Solid parquet, laminate, vinyl and herringbone from trusted manufacturers. Indicative prices per square metre and a written quote after a free visit.',
  },
  pl: {
    title: 'Parkiety | Parkiet i ceny za m² | Expert Parket og Mál',
    description:
      'Parkiet lity, laminowany, winylowy i jodełka od zaufanych producentów. Ceny orientacyjne za metr kwadratowy i pisemna wycena po darmowych oględzinach.',
  },
}

export const catalog: Record<Lang, CatalogContent> = {
  is: {
    intro: {
      title: 'Parket fyrir hvert heimili',
      subtitle:
        'Gegnheilt, spónlagt, harðparket og vínyl frá framleiðendum sem við höfum unnið með árum saman. Við leggjum allt sem við seljum og segjum þér hvað hentar þínu rými.',
      priceNote:
        'Verð eru til viðmiðunar á m² og geta breyst eftir magni, undirvinnu og aðstæðum. Hafðu samband fyrir nákvæmt og óskuldbindandi tilboð. expertparket2024@gmail.com eða 785 7079.',
    },
    categories: [
      { key: 'gegnheilt', label: 'Gegnheilt parket' },
      { key: 'hardparket', label: 'Harðparket / laminat' },
      { key: 'vinyl', label: 'Vínylparket' },
      { key: 'fiskibein', label: 'Fiskibein' },
    ],
    products: [
      {
        name: 'Reykjavík Eik',
        category: 'hardparket',
        woodTone: 'Ljós eik',
        description:
          'Slitsterkt harðparket sem líkir fullkomlega eftir ljósri eik. Auðvelt í umhirðu og hentar vel þar sem mikið er gengið.',
        pricePerM2: 4290,
        thickness: '8 mm',
        finish: 'Matt yfirborð',
        bestFor: 'Íbúðir og leiguhúsnæði þar sem slitþol skiptir máli',
        badge: 'Vinsælt',
        tone: '#CBA36A',
        pattern: 'plank',
      },
      {
        name: 'Katla Hnota',
        category: 'hardparket',
        woodTone: 'Dökk hnota',
        description: 'Hlýlegt harðparket í djúpum hnotutón sem gefur rýminu notalega og heimilislega áferð.',
        pricePerM2: 5690,
        thickness: '10 mm',
        finish: 'Matt yfirborð',
        bestFor: 'Stofur og svefnherbergi þar sem hlýleiki ræður för',
        tone: '#6E4A2C',
        pattern: 'plank',
      },
      {
        name: 'Esja Grátt',
        category: 'vinyl',
        woodTone: 'Grátt',
        description:
          'Vatnshelt SPC vínylparket í nútímalegum gráum tón. Tilvalið þar sem raki og bleyta geta verið til staðar.',
        pricePerM2: 6490,
        thickness: '5 mm',
        finish: 'Matt lakk',
        bestFor: 'Eldhús, baðherbergi, þvottahús og forstofur',
        badge: 'Nýtt',
        tone: '#A6A096',
        pattern: 'plank',
      },
      {
        name: 'Askja Eik',
        category: 'vinyl',
        woodTone: 'Ljós eik',
        description:
          'Þægilegt vínylparket með mjúkri áferð og hljóðdempandi undirlagi sem gerir heimilið hljóðlátara.',
        pricePerM2: 8290,
        thickness: '6 mm',
        finish: 'Matt lakk',
        bestFor: 'Fjölbýli og heimili þar sem hljóðvist skiptir máli',
        tone: '#C8A877',
        pattern: 'plank',
      },
      {
        name: 'Þingvellir Eik',
        category: 'gegnheilt',
        woodTone: 'Náttúruleg eik',
        description:
          'Gegnheilt eikarparket úr völdum viði sem má slípa upp á nýtt aftur og aftur. Gólf sem endist kynslóðir.',
        pricePerM2: 13900,
        thickness: '15 mm',
        finish: 'Olíuborið',
        bestFor: 'Vönduð heimili sem vilja fjárfestingu til framtíðar',
        tone: '#C1904E',
        pattern: 'plank',
      },
      {
        name: 'Snæfell Hvítolíu Eik',
        category: 'gegnheilt',
        woodTone: 'Ljós hvítolíuborin eik',
        description:
          'Ljóst gegnheilt eikarparket með hvítolíu sem heldur birtu og undirstrikar náttúrulega áferð viðarins.',
        pricePerM2: 14900,
        thickness: '15 mm',
        finish: 'Hvítolíuborið',
        bestFor: 'Björt rými í hreinum norrænum stíl',
        tone: '#E3D3B2',
        pattern: 'plank',
      },
      {
        name: 'Hekla Fiskibein Eik',
        category: 'fiskibein',
        woodTone: 'Ljós eik',
        description:
          'Klassískt fiskibeinamynstur í ljósri eik sem setur glæsilegan og tímalausan svip á rýmið.',
        pricePerM2: 15900,
        thickness: '14 mm',
        finish: 'Matt lakk',
        bestFor: 'Stofur og anddyri þar sem mynstrið á að njóta sín',
        badge: 'Vinsælt',
        tone: '#CBA46A',
        pattern: 'herringbone',
      },
      {
        name: 'Vatnajökull Fiskibein Hnota',
        category: 'fiskibein',
        woodTone: 'Dökk hnota',
        description: 'Fiskibein úr dökkri hnotu sem skapar dramatíska, glæsilega og tímalausa umgjörð.',
        pricePerM2: 16900,
        thickness: '14 mm',
        finish: 'Olíuborið',
        bestFor: 'Glæsileg heimili og fyrirtæki sem vilja skera sig úr',
        tone: '#5E3F27',
        pattern: 'herringbone',
      },
    ],
  },
  en: {
    intro: {
      title: 'Flooring for every home',
      subtitle:
        'Solid, engineered, laminate and vinyl from manufacturers we have worked with for years. We lay everything we sell and tell you what suits your space.',
      priceNote:
        'Prices are indicative per m² and may change depending on quantity, preparation work and circumstances. Get in touch for an exact, no-obligation quote. expertparket2024@gmail.com or 785 7079.',
    },
    categories: [
      { key: 'gegnheilt', label: 'Solid parquet' },
      { key: 'hardparket', label: 'Laminate' },
      { key: 'vinyl', label: 'Vinyl flooring' },
      { key: 'fiskibein', label: 'Herringbone' },
    ],
    products: [
      {
        name: 'Reykjavík Oak',
        category: 'hardparket',
        woodTone: 'Light oak',
        description:
          'Hard-wearing laminate that perfectly imitates light oak. Easy to care for and ideal where there is a lot of foot traffic.',
        pricePerM2: 4290,
        thickness: '8 mm',
        finish: 'Matt surface',
        bestFor: 'Apartments and rentals where wear resistance matters',
        badge: 'Popular',
        tone: '#CBA36A',
        pattern: 'plank',
      },
      {
        name: 'Katla Walnut',
        category: 'hardparket',
        woodTone: 'Dark walnut',
        description: 'Warm laminate in a deep walnut tone that gives the room a cosy, homely feel.',
        pricePerM2: 5690,
        thickness: '10 mm',
        finish: 'Matt surface',
        bestFor: 'Living rooms and bedrooms where warmth sets the tone',
        tone: '#6E4A2C',
        pattern: 'plank',
      },
      {
        name: 'Esja Grey',
        category: 'vinyl',
        woodTone: 'Grey',
        description:
          'Waterproof SPC vinyl flooring in a modern grey tone. Ideal where moisture and damp can be present.',
        pricePerM2: 6490,
        thickness: '5 mm',
        finish: 'Matt lacquer',
        bestFor: 'Kitchens, bathrooms, laundry rooms and hallways',
        badge: 'New',
        tone: '#A6A096',
        pattern: 'plank',
      },
      {
        name: 'Askja Oak',
        category: 'vinyl',
        woodTone: 'Light oak',
        description:
          'Comfortable vinyl flooring with a soft feel and a sound-dampening underlay that makes the home quieter.',
        pricePerM2: 8290,
        thickness: '6 mm',
        finish: 'Matt lacquer',
        bestFor: 'Apartment blocks and homes where acoustics matter',
        tone: '#C8A877',
        pattern: 'plank',
      },
      {
        name: 'Þingvellir Oak',
        category: 'gegnheilt',
        woodTone: 'Natural oak',
        description:
          'Solid oak parquet made from selected wood that can be sanded again and again. A floor that lasts for generations.',
        pricePerM2: 13900,
        thickness: '15 mm',
        finish: 'Oiled',
        bestFor: 'Quality homes that want an investment for the future',
        tone: '#C1904E',
        pattern: 'plank',
      },
      {
        name: 'Snæfell White-Oiled Oak',
        category: 'gegnheilt',
        woodTone: 'Light white-oiled oak',
        description:
          'Light solid oak parquet with a white oil that keeps it bright and underlines the natural texture of the wood.',
        pricePerM2: 14900,
        thickness: '15 mm',
        finish: 'White-oiled',
        bestFor: 'Bright spaces in a clean Nordic style',
        tone: '#E3D3B2',
        pattern: 'plank',
      },
      {
        name: 'Hekla Herringbone Oak',
        category: 'fiskibein',
        woodTone: 'Light oak',
        description:
          'A classic herringbone pattern in light oak that gives the room an elegant, timeless character.',
        pricePerM2: 15900,
        thickness: '14 mm',
        finish: 'Matt lacquer',
        bestFor: 'Living rooms and entrance halls where the pattern can shine',
        badge: 'Popular',
        tone: '#CBA46A',
        pattern: 'herringbone',
      },
      {
        name: 'Vatnajökull Herringbone Walnut',
        category: 'fiskibein',
        woodTone: 'Dark walnut',
        description: 'Herringbone in dark walnut that creates a dramatic, elegant and timeless setting.',
        pricePerM2: 16900,
        thickness: '14 mm',
        finish: 'Oiled',
        bestFor: 'Elegant homes and businesses that want to stand out',
        tone: '#5E3F27',
        pattern: 'herringbone',
      },
    ],
  },
  pl: {
    intro: {
      title: 'Parkiet do każdego domu',
      subtitle:
        'Parkiet lity, warstwowy, panele i winyl od producentów, z którymi pracujemy od lat. Układamy wszystko, co sprzedajemy, i mówimy, co pasuje do Twojego wnętrza.',
      priceNote:
        'Ceny są orientacyjne za m² i mogą się zmieniać w zależności od ilości, prac przygotowawczych i warunków. Skontaktuj się, aby otrzymać dokładną, niezobowiązującą wycenę. expertparket2024@gmail.com lub 785 7079.',
    },
    categories: [
      { key: 'gegnheilt', label: 'Parkiet lity' },
      { key: 'hardparket', label: 'Panele laminowane' },
      { key: 'vinyl', label: 'Panele winylowe' },
      { key: 'fiskibein', label: 'Jodełka' },
    ],
    products: [
      {
        name: 'Reykjavík Dąb',
        category: 'hardparket',
        woodTone: 'Jasny dąb',
        description:
          'Wytrzymały panel laminowany, który doskonale imituje jasny dąb. Łatwy w pielęgnacji i idealny tam, gdzie panuje duży ruch.',
        pricePerM2: 4290,
        thickness: '8 mm',
        finish: 'Powierzchnia matowa',
        bestFor: 'Mieszkania i lokale na wynajem, gdzie liczy się odporność na ścieranie',
        badge: 'Popularne',
        tone: '#CBA36A',
        pattern: 'plank',
      },
      {
        name: 'Katla Orzech',
        category: 'hardparket',
        woodTone: 'Ciemny orzech',
        description: 'Ciepły panel laminowany w głębokim odcieniu orzecha, który nadaje wnętrzu przytulny, domowy charakter.',
        pricePerM2: 5690,
        thickness: '10 mm',
        finish: 'Powierzchnia matowa',
        bestFor: 'Salony i sypialnie, gdzie liczy się ciepło',
        tone: '#6E4A2C',
        pattern: 'plank',
      },
      {
        name: 'Esja Szary',
        category: 'vinyl',
        woodTone: 'Szary',
        description:
          'Wodoodporny panel winylowy SPC w nowoczesnym szarym odcieniu. Idealny tam, gdzie może występować wilgoć.',
        pricePerM2: 6490,
        thickness: '5 mm',
        finish: 'Lakier matowy',
        bestFor: 'Kuchnie, łazienki, pralnie i przedpokoje',
        badge: 'Nowość',
        tone: '#A6A096',
        pattern: 'plank',
      },
      {
        name: 'Askja Dąb',
        category: 'vinyl',
        woodTone: 'Jasny dąb',
        description:
          'Wygodny panel winylowy o miękkiej fakturze i wygłuszającym podkładzie, który sprawia, że dom jest cichszy.',
        pricePerM2: 8290,
        thickness: '6 mm',
        finish: 'Lakier matowy',
        bestFor: 'Bloki mieszkalne i domy, w których liczy się akustyka',
        tone: '#C8A877',
        pattern: 'plank',
      },
      {
        name: 'Þingvellir Dąb',
        category: 'gegnheilt',
        woodTone: 'Naturalny dąb',
        description:
          'Parkiet z litego dębu z wyselekcjonowanego drewna, który można cyklinować wielokrotnie. Podłoga na pokolenia.',
        pricePerM2: 13900,
        thickness: '15 mm',
        finish: 'Olejowany',
        bestFor: 'Domy z klasą, które szukają inwestycji na przyszłość',
        tone: '#C1904E',
        pattern: 'plank',
      },
      {
        name: 'Snæfell Dąb Bielony',
        category: 'gegnheilt',
        woodTone: 'Jasny dąb bielony olejem',
        description:
          'Jasny parkiet z litego dębu z białym olejem, który zachowuje jasność i podkreśla naturalną fakturę drewna.',
        pricePerM2: 14900,
        thickness: '15 mm',
        finish: 'Olejowany na biało',
        bestFor: 'Jasne wnętrza w czystym nordyckim stylu',
        tone: '#E3D3B2',
        pattern: 'plank',
      },
      {
        name: 'Hekla Jodełka Dąb',
        category: 'fiskibein',
        woodTone: 'Jasny dąb',
        description:
          'Klasyczny wzór jodełki w jasnym dębie, który nadaje wnętrzu elegancki, ponadczasowy charakter.',
        pricePerM2: 15900,
        thickness: '14 mm',
        finish: 'Lakier matowy',
        bestFor: 'Salony i przedsionki, gdzie wzór może się w pełni zaprezentować',
        badge: 'Popularne',
        tone: '#CBA46A',
        pattern: 'herringbone',
      },
      {
        name: 'Vatnajökull Jodełka Orzech',
        category: 'fiskibein',
        woodTone: 'Ciemny orzech',
        description: 'Jodełka z ciemnego orzecha, która tworzy dramatyczną, elegancką i ponadczasową oprawę.',
        pricePerM2: 16900,
        thickness: '14 mm',
        finish: 'Olejowany',
        bestFor: 'Eleganckie domy i firmy, które chcą się wyróżnić',
        tone: '#5E3F27',
        pattern: 'herringbone',
      },
    ],
  },
}
