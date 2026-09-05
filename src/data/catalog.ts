import type { Lang } from '@/i18n/config'

export type ParquetPattern = 'plank' | 'herringbone' | 'chevron'

export type Product = {
  name: string
  category: string
  woodTone: string
  description: string
  thickness: string
  finish: string
  bestFor: string
  badge?: string
  /** Swatch in public/photos, built by scripts/build-parquet-swatches.py. */
  photo: string
  /** How this product is laid. Decides which swatch was composed for it. */
  pattern: ParquetPattern
}

type SeoText = { title: string; description: string }
type Category = { key: string; label: string }
type CatalogContent = {
  intro: { title: string; subtitle: string }
  categories: Category[]
  products: Product[]
}

/**
 * The range is the Real Dutch Floor collections the client lays, reached
 * through Planki Parket ehf. in Kópavogur, who import them into Iceland
 * (client, 2026-09-01). It replaced eight invented products whose swatches
 * were drawn in SVG from one hex colour: the names, thicknesses, finishes and
 * patterns here are the manufacturer's own, and every card carries a
 * photograph of that board laid in the pattern it is sold in.
 *
 * NO PRICES. The cards used to carry a per-m2 figure, but those numbers were
 * placeholders shaped like the old ladder and Planki's real list never
 * arrived; the client asked for them off the page (2026-09-04). Every card
 * ends at the quote button, so the written quote after the free visit is the
 * only price the visitor is ever given.
 */
export const catalogSeo: Record<Lang, SeoText> = {
  is: {
    title: 'Vöruúrval | Eikarparket, fiskibein og chevron | Expert Parket og Mál',
    description:
      'Hollenskt eikarparket frá Real Dutch Floor: plankar, fiskibein og chevron. Frí skoðun á staðnum og skriflegt tilboð sem stendur.',
  },
  en: {
    title: 'Flooring | Oak parquet, herringbone and chevron | Expert Parket og Mál',
    description:
      'Dutch oak parquet by Real Dutch Floor: planks, herringbone and chevron. A free visit to your home and a written quote that holds.',
  },
  pl: {
    title: 'Parkiety | Parkiet dębowy, jodełka i chevron | Expert Parket og Mál',
    description:
      'Holenderski parkiet dębowy Real Dutch Floor: deski, jodełka i chevron. Darmowe oględziny na miejscu i pisemna wycena, która obowiązuje.',
  },
}

export const catalog: Record<Lang, CatalogContent> = {
  is: {
    intro: {
      title: 'Parket fyrir hvert heimili',
      subtitle:
        'Hollenskt eikarparket frá Real Dutch Floor, í plönkum, fiskibeini og chevron, í gegnum samstarfsaðila okkar Planka í Kópavogi. Við leggjum allt sem við seljum og segjum þér hvað hentar þínu rými.',
    },
    categories: [
      { key: 'plankar', label: 'Plankar' },
      { key: 'fiskibein', label: 'Fiskibein' },
      { key: 'chevron', label: 'Chevron' },
    ],
    products: [
      {
        name: 'Eco Desert',
        category: 'plankar',
        woodTone: 'Ljós eik',
        description:
          'Eco línan er þynnri og léttari plata á vinsamlegra verði, með sama eikaryfirborði og dýrari línurnar. Desert er hlýr, ljós tónn sem opnar rýmið.',
        thickness: '8 mm',
        finish: 'Burstað og olíuborið',
        bestFor: 'Íbúðir og leiguhúsnæði þar sem verðið skiptir máli',
        badge: 'Vinsælt',
        photo: '/photos/parket-eco-desert.jpg',
        pattern: 'plank',
      },
      {
        name: 'Classic Latte',
        category: 'plankar',
        woodTone: 'Náttúruleg eik',
        description:
          'Classic línan er vandlega slípuð evrópsk eik með mjúku yfirborði. Latte heldur náttúrulegum lit eikarinnar og passar við nánast hvaða innréttingu sem er.',
        thickness: '15 mm',
        finish: 'Slípað og olíuborið',
        bestFor: 'Stofur og opin rými sem eiga að endast',
        photo: '/photos/parket-classic-latte.jpg',
        pattern: 'plank',
      },
      {
        name: 'Classic Mist',
        category: 'plankar',
        woodTone: 'Ljós hvítolíuborin eik',
        description:
          'Hvítolían dregur gula tóninn úr eikinni og heldur rýminu björtu allt árið. Mist er ljósasti tónninn í Classic línunni.',
        thickness: '15 mm',
        finish: 'Hvítolíuborið',
        bestFor: 'Björt rými og herbergi sem snúa í norður',
        photo: '/photos/parket-classic-mist.jpg',
        pattern: 'plank',
      },
      {
        name: 'Forest Bronze',
        category: 'plankar',
        woodTone: 'Dökk eik',
        description:
          'Forest línan er reykt og burstuð þannig að æðarnar standa upp úr. Bronze er dýpsti tónninn, hlýr og dökkur án þess að verða svartur.',
        thickness: '15 mm',
        finish: 'Burstað, reykt og olíuborið',
        bestFor: 'Stór rými sem þola dökkt gólf',
        photo: '/photos/parket-forest-bronze.jpg',
        pattern: 'plank',
      },
      {
        name: 'Eco Night',
        category: 'fiskibein',
        woodTone: 'Djúpsvört eik',
        description:
          'Fiskibein í dökkasta tóninum úr Eco línunni. Mynstrið gefur rýminu takt og svarti tónninn dregur húsgögnin fram.',
        thickness: '8 mm',
        finish: 'Burstað og olíuborið',
        bestFor: 'Anddyri og rými sem eiga að hafa karakter',
        badge: 'Nýtt',
        photo: '/photos/parket-eco-night.jpg',
        pattern: 'herringbone',
      },
      {
        name: 'Classic Ash',
        category: 'fiskibein',
        woodTone: 'Gráleit eik',
        description:
          'Ash er mildur, gráleitur eikartónn sem gerir fiskibeinsmynstrið skýrt án þess að yfirgnæfa rýmið.',
        thickness: '15 mm',
        finish: 'Slípað og olíuborið',
        bestFor: 'Stofur og borðstofur',
        badge: 'Vinsælt',
        photo: '/photos/parket-classic-ash.jpg',
        pattern: 'herringbone',
      },
      {
        name: 'Classic Mocha',
        category: 'fiskibein',
        woodTone: 'Hlý miðbrún eik',
        description:
          'Mocha er hlýr miðtónn sem gefur fiskibeininu dýpt. Klassískt val þar sem gólfið á að vera aðalatriðið.',
        thickness: '15 mm',
        finish: 'Slípað og olíuborið',
        bestFor: 'Eldri íbúðir og rými með háum loftum',
        photo: '/photos/parket-classic-mocha.jpg',
        pattern: 'herringbone',
      },
      {
        name: 'Design Taupe',
        category: 'chevron',
        woodTone: 'Grábrún eik',
        description:
          'Design línan er hefluð þannig að yfirborðið verður slétt og hreint. Taupe er grábrúnn tónn sem passar við nútímalegar innréttingar.',
        thickness: '15 mm',
        finish: 'Heflað og olíuborið',
        bestFor: 'Nútímaleg rými og skrifstofur',
        photo: '/photos/parket-design-taupe.jpg',
        pattern: 'chevron',
      },
      {
        name: 'Royal Ridge',
        category: 'chevron',
        woodTone: 'Dökk reykt eik',
        description:
          'Royal línan kemur með Royal Protect, hlífðarlagi sem þarf hvorki slípun né olíu. Ridge er dökkur, reyktur tónn í chevron mynstri.',
        thickness: '15 mm',
        finish: 'Royal Protect, viðhaldsfrítt',
        bestFor: 'Rými í mikilli notkun þar sem viðhald á að vera í lágmarki',
        photo: '/photos/parket-royal-ridge.jpg',
        pattern: 'chevron',
      },
    ],
  },
  en: {
    intro: {
      title: 'Flooring for every home',
      subtitle:
        'Dutch oak parquet by Real Dutch Floor, in planks, herringbone and chevron, through our partner Planki in Kópavogur. We lay everything we sell and tell you what suits your room.',
    },
    categories: [
      { key: 'plankar', label: 'Planks' },
      { key: 'fiskibein', label: 'Herringbone' },
      { key: 'chevron', label: 'Chevron' },
    ],
    products: [
      {
        name: 'Eco Desert',
        category: 'plankar',
        woodTone: 'Light oak',
        description:
          'The Eco line is a thinner, lighter board at a friendlier price, with the same oak surface as the dearer lines. Desert is a warm, light tone that opens a room up.',
        thickness: '8 mm',
        finish: 'Brushed and oiled',
        bestFor: 'Flats and rentals where the price matters',
        badge: 'Popular',
        photo: '/photos/parket-eco-desert.jpg',
        pattern: 'plank',
      },
      {
        name: 'Classic Latte',
        category: 'plankar',
        woodTone: 'Natural oak',
        description:
          'The Classic line is meticulously sanded European oak with a velvety surface. Latte keeps the natural colour of the oak and sits well with almost any interior.',
        thickness: '15 mm',
        finish: 'Sanded and oiled',
        bestFor: 'Living rooms and open plans meant to last',
        photo: '/photos/parket-classic-latte.jpg',
        pattern: 'plank',
      },
      {
        name: 'Classic Mist',
        category: 'plankar',
        woodTone: 'Light white-oiled oak',
        description:
          'The white oil takes the yellow out of the oak and keeps a room bright the year round. Mist is the lightest tone in the Classic line.',
        thickness: '15 mm',
        finish: 'White oiled',
        bestFor: 'Bright rooms and north-facing spaces',
        photo: '/photos/parket-classic-mist.jpg',
        pattern: 'plank',
      },
      {
        name: 'Forest Bronze',
        category: 'plankar',
        woodTone: 'Dark oak',
        description:
          'The Forest line is smoked and brushed so the grain stands proud. Bronze is the deepest tone, warm and dark without going black.',
        thickness: '15 mm',
        finish: 'Brushed, smoked and oiled',
        bestFor: 'Large rooms that can carry a dark floor',
        photo: '/photos/parket-forest-bronze.jpg',
        pattern: 'plank',
      },
      {
        name: 'Eco Night',
        category: 'fiskibein',
        woodTone: 'Deep black oak',
        description:
          'Herringbone in the darkest tone of the Eco line. The pattern gives a room its rhythm and the black throws the furniture forward.',
        thickness: '8 mm',
        finish: 'Brushed and oiled',
        bestFor: 'Hallways and rooms that need character',
        badge: 'New',
        photo: '/photos/parket-eco-night.jpg',
        pattern: 'herringbone',
      },
      {
        name: 'Classic Ash',
        category: 'fiskibein',
        woodTone: 'Greyed oak',
        description:
          'Ash is a soft, greyed oak that lets the herringbone read clearly without shouting over the room.',
        thickness: '15 mm',
        finish: 'Sanded and oiled',
        bestFor: 'Living and dining rooms',
        badge: 'Popular',
        photo: '/photos/parket-classic-ash.jpg',
        pattern: 'herringbone',
      },
      {
        name: 'Classic Mocha',
        category: 'fiskibein',
        woodTone: 'Warm mid-brown oak',
        description:
          'Mocha is a warm mid tone that gives the herringbone depth. The classic choice where the floor is meant to be the subject.',
        thickness: '15 mm',
        finish: 'Sanded and oiled',
        bestFor: 'Older flats and rooms with high ceilings',
        photo: '/photos/parket-classic-mocha.jpg',
        pattern: 'herringbone',
      },
      {
        name: 'Design Taupe',
        category: 'chevron',
        woodTone: 'Grey-brown oak',
        description:
          'The Design line is planed to a clean, level surface. Taupe is a grey-brown tone that suits modern interiors.',
        thickness: '15 mm',
        finish: 'Planed and oiled',
        bestFor: 'Modern spaces and offices',
        photo: '/photos/parket-design-taupe.jpg',
        pattern: 'chevron',
      },
      {
        name: 'Royal Ridge',
        category: 'chevron',
        woodTone: 'Dark smoked oak',
        description:
          'The Royal line comes with Royal Protect, a protective layer that needs neither sanding nor oil. Ridge is a dark, smoked tone in a chevron pattern.',
        thickness: '15 mm',
        finish: 'Royal Protect, maintenance free',
        bestFor: 'Busy rooms where upkeep should be minimal',
        photo: '/photos/parket-royal-ridge.jpg',
        pattern: 'chevron',
      },
    ],
  },
  pl: {
    intro: {
      title: 'Parkiet do każdego domu',
      subtitle:
        'Holenderski parkiet dębowy Real Dutch Floor, w deskach, jodełce i chevronie, przez naszego partnera Planki w Kópavogur. Kładziemy wszystko, co sprzedajemy, i doradzamy, co pasuje do wnętrza.',
    },
    categories: [
      { key: 'plankar', label: 'Deski' },
      { key: 'fiskibein', label: 'Jodełka' },
      { key: 'chevron', label: 'Chevron' },
    ],
    products: [
      {
        name: 'Eco Desert',
        category: 'plankar',
        woodTone: 'Jasny dąb',
        description:
          'Linia Eco to cieńsza i lżejsza deska w przyjaźniejszej cenie, z tą samą dębową powierzchnią co droższe linie. Desert to ciepły, jasny ton, który otwiera wnętrze.',
        thickness: '8 mm',
        finish: 'Szczotkowany i olejowany',
        bestFor: 'Mieszkania i lokale na wynajem, gdzie liczy się cena',
        badge: 'Popularne',
        photo: '/photos/parket-eco-desert.jpg',
        pattern: 'plank',
      },
      {
        name: 'Classic Latte',
        category: 'plankar',
        woodTone: 'Naturalny dąb',
        description:
          'Linia Classic to starannie szlifowany dąb europejski o aksamitnej powierzchni. Latte zachowuje naturalny kolor dębu i pasuje niemal do każdego wnętrza.',
        thickness: '15 mm',
        finish: 'Szlifowany i olejowany',
        bestFor: 'Salony i otwarte przestrzenie na lata',
        photo: '/photos/parket-classic-latte.jpg',
        pattern: 'plank',
      },
      {
        name: 'Classic Mist',
        category: 'plankar',
        woodTone: 'Jasny dąb bielony',
        description:
          'Biały olej wygasza żółty ton dębu i utrzymuje jasność wnętrza przez cały rok. Mist to najjaśniejszy odcień w linii Classic.',
        thickness: '15 mm',
        finish: 'Olejowany na biało',
        bestFor: 'Jasne wnętrza i pokoje od północy',
        photo: '/photos/parket-classic-mist.jpg',
        pattern: 'plank',
      },
      {
        name: 'Forest Bronze',
        category: 'plankar',
        woodTone: 'Ciemny dąb',
        description:
          'Linia Forest jest wędzona i szczotkowana, dzięki czemu słoje wychodzą na wierzch. Bronze to najgłębszy odcień, ciepły i ciemny, ale nie czarny.',
        thickness: '15 mm',
        finish: 'Szczotkowany, wędzony i olejowany',
        bestFor: 'Duże wnętrza, które udźwigną ciemną podłogę',
        photo: '/photos/parket-forest-bronze.jpg',
        pattern: 'plank',
      },
      {
        name: 'Eco Night',
        category: 'fiskibein',
        woodTone: 'Głęboko czarny dąb',
        description:
          'Jodełka w najciemniejszym odcieniu linii Eco. Wzór nadaje wnętrzu rytm, a czerń wysuwa meble na pierwszy plan.',
        thickness: '8 mm',
        finish: 'Szczotkowany i olejowany',
        bestFor: 'Przedpokoje i wnętrza z charakterem',
        badge: 'Nowość',
        photo: '/photos/parket-eco-night.jpg',
        pattern: 'herringbone',
      },
      {
        name: 'Classic Ash',
        category: 'fiskibein',
        woodTone: 'Szarawy dąb',
        description:
          'Ash to miękki, szarawy dąb, przy którym jodełka jest czytelna, ale nie krzyczy.',
        thickness: '15 mm',
        finish: 'Szlifowany i olejowany',
        bestFor: 'Salony i jadalnie',
        badge: 'Popularne',
        photo: '/photos/parket-classic-ash.jpg',
        pattern: 'herringbone',
      },
      {
        name: 'Classic Mocha',
        category: 'fiskibein',
        woodTone: 'Ciepły brązowy dąb',
        description:
          'Mocha to ciepły średni ton, który dodaje jodełce głębi. Klasyczny wybór tam, gdzie podłoga ma być bohaterem.',
        thickness: '15 mm',
        finish: 'Szlifowany i olejowany',
        bestFor: 'Starsze mieszkania i wnętrza z wysokimi sufitami',
        photo: '/photos/parket-classic-mocha.jpg',
        pattern: 'herringbone',
      },
      {
        name: 'Design Taupe',
        category: 'chevron',
        woodTone: 'Szarobrązowy dąb',
        description:
          'Linia Design jest strugana do czystej, równej powierzchni. Taupe to szarobrązowy ton pasujący do nowoczesnych wnętrz.',
        thickness: '15 mm',
        finish: 'Strugany i olejowany',
        bestFor: 'Nowoczesne wnętrza i biura',
        photo: '/photos/parket-design-taupe.jpg',
        pattern: 'chevron',
      },
      {
        name: 'Royal Ridge',
        category: 'chevron',
        woodTone: 'Ciemny wędzony dąb',
        description:
          'Linia Royal ma Royal Protect, warstwę ochronną, która nie wymaga cyklinowania ani olejowania. Ridge to ciemny, wędzony ton we wzorze chevron.',
        thickness: '15 mm',
        finish: 'Royal Protect, bezobsługowy',
        bestFor: 'Intensywnie używane wnętrza z minimalną konserwacją',
        photo: '/photos/parket-royal-ridge.jpg',
        pattern: 'chevron',
      },
    ],
  },
}
