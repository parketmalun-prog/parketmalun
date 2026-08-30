import type { Post } from '@/lib/db/types'

/**
 * Starter articles for the blog.
 *
 * They are seeded into browser storage the first time the site runs, so the
 * blog is never empty and the editor has a worked example of the shape a post
 * takes in all three languages. Delete them from the admin whenever the client
 * has posts of their own. When Supabase is connected these are replaced by the
 * rows in the `posts` table.
 */
export const blogSeed: Post[] = [
  {
    id: 'seed-slipun-eda-nytt-parket',
    status: 'published',
    sourceLang: 'is',
    cover: null,
    tags: ['slipun', 'parket'],
    createdAt: Date.UTC(2026, 6, 28, 9, 0),
    updatedAt: Date.UTC(2026, 6, 28, 9, 0),
    publishedAt: Date.UTC(2026, 6, 28, 9, 0),
    translations: {
      is: {
        title: 'Slípun eða nýtt parket',
        slug: 'slipun-eda-nytt-parket',
        excerpt: 'Slitlagið ræður úrslitum. Við mælum þykktina áður en við gefum verð.',
        seoTitle: 'Slípun eða nýtt parket | Expert Parket og Mál',
        seoDescription:
          'Hvenær borgar sig að slípa gólfið og hvenær þarf nýtt parket. Þykkt slitlags, merki um slit og tímarammi verksins.',
        body: `## Hvað ræður valinu

Gegnheilt parket og þykkt spónlagt parket þolir slípun oftar en einu sinni. Þumalputtareglan er einföld: slitlagið þarf að vera 2,5 mm eða meira svo óhætt sé að slípa. Þynnra lag þolir eina létta yfirferð, stundum enga.

## Svona mælum við

Við losum einn gólflista eða skoðum brúnina við þröskuld. Þar sést sniðið í gegn og þykktin á slitlaginu. Um leið sjáum við hvort undirlagið er þurrt og slétt.

## Þrjú merki um að slípun dugi

- Rispur og mattir blettir sem ná ekki niður úr lakkinu
- Gólfið er heilt, engin brotin borð og engin laus samskeyti
- Rakinn í rýminu er í lagi, engir dökkir vatnsblettir

## Þrjú merki um að skipta þurfi um gólf

- Borð eru sprungin eða skekkt eftir vatn
- Slitlagið er komið niður í fjöðrina
- Gólfið hefur þegar verið slípað tvisvar eða oftar

## Verkið sjálft

Slípun á 60 m² tekur venjulega tvo til þrjá daga. Við förum þrjár yfirferðir með 40, 80 og 120 korni, ryksugum á milli og setjum svo lakk eða olíu. Lakk þarf einn dag á milli umferða. Rýmið er tilbúið til notkunar daginn eftir síðustu umferð.

Hringdu í 785 7079 og við kíkjum á gólfið án endurgjalds.`,
      },
      en: {
        title: 'Sanding or a new floor',
        slug: 'sanding-or-a-new-floor',
        excerpt: 'The wear layer decides it. We measure the thickness before we quote.',
        seoTitle: 'Sanding or a new floor | Expert Parket og Mál',
        seoDescription:
          'When sanding is worth it and when the floor has to be replaced. Wear layer thickness, signs of wear and how long the work takes.',
        body: `## What decides it

Solid parquet and thick engineered parquet can be sanded more than once. The rule of thumb is simple: the wear layer has to be 2.5 mm or more before sanding is safe. A thinner layer takes one light pass, sometimes none.

## How we measure it

We lift one skirting board or look at the edge by a threshold. The profile shows there, and with it the thickness of the wear layer. At the same time we can see whether the subfloor is dry and level.

## Three signs sanding is enough

- Scratches and dull patches that stop inside the lacquer
- The floor is intact, no broken boards and no loose joints
- Moisture in the room is normal, no dark water stains

## Three signs the floor has to go

- Boards are cracked or cupped after water damage
- The wear layer has reached the tongue
- The floor has already been sanded twice or more

## The work itself

Sanding 60 m² usually takes two to three days. We make three passes at 40, 80 and 120 grit, vacuum between them, then apply lacquer or oil. Lacquer needs one day between coats. The room is ready to use the day after the final coat.

Call 785 7079 and we will look at the floor free of charge.`,
      },
      pl: {
        title: 'Cyklinowanie czy nowy parkiet',
        slug: 'cyklinowanie-czy-nowy-parkiet',
        excerpt: 'Decyduje warstwa użytkowa. Mierzymy jej grubość, zanim podamy cenę.',
        seoTitle: 'Cyklinowanie czy nowy parkiet | Expert Parket og Mál',
        seoDescription:
          'Kiedy warto cyklinować podłogę, a kiedy trzeba ją wymienić. Grubość warstwy użytkowej, oznaki zużycia i czas pracy.',
        body: `## Co o tym decyduje

Parkiet lity i gruby parkiet warstwowy można cyklinować więcej niż raz. Zasada jest prosta: warstwa użytkowa musi mieć 2,5 mm lub więcej, żeby cyklinowanie było bezpieczne. Cieńsza warstwa zniesie jedno lekkie przejście, czasem żadnego.

## Jak to mierzymy

Zdejmujemy jedną listwę przypodłogową albo oglądamy krawędź przy progu. Widać tam przekrój, a razem z nim grubość warstwy użytkowej. Przy okazji sprawdzamy, czy podłoże jest suche i równe.

## Trzy znaki, że cyklinowanie wystarczy

- Rysy i matowe miejsca, które kończą się w lakierze
- Podłoga jest cała, bez pękniętych desek i luźnych złączy
- Wilgotność w pomieszczeniu jest w normie, bez ciemnych plam po wodzie

## Trzy znaki, że podłogę trzeba wymienić

- Deski są pęknięte lub wypaczone po zalaniu
- Warstwa użytkowa doszła do pióra
- Podłoga była już cyklinowana dwa razy lub więcej

## Sama praca

Cyklinowanie 60 m² zajmuje zwykle dwa do trzech dni. Robimy trzy przejścia papierem 40, 80 i 120, odkurzamy pomiędzy nimi, potem nakładamy lakier albo olej. Lakier potrzebuje jednego dnia między warstwami. Pomieszczenie jest gotowe do użytku dzień po ostatniej warstwie.

Zadzwoń pod 785 7079, a obejrzymy podłogę bezpłatnie.`,
      },
    },
  },
  {
    id: 'seed-thrju-skref-fyrir-parketlogn',
    status: 'published',
    sourceLang: 'is',
    cover: null,
    tags: ['parketlogn', 'undirbuningur'],
    createdAt: Date.UTC(2026, 7, 11, 9, 0),
    updatedAt: Date.UTC(2026, 7, 11, 9, 0),
    publishedAt: Date.UTC(2026, 7, 11, 9, 0),
    translations: {
      is: {
        title: 'Þrjú skref fyrir parketlögn',
        slug: 'thrju-skref-fyrir-parketlogn',
        excerpt:
          'Rakamæling, jöfnun og aðlögun. Þessi þrjú atriði ráða því hvernig gólfið lítur út eftir fimm ár.',
        seoTitle: 'Þrjú skref fyrir parketlögn | Expert Parket og Mál',
        seoDescription:
          'Undirbúningur fyrir parketlögn: rakamæling í steypu, jöfnun undirlags og aðlögun efnis. Tímarammi fyrir 70 m² íbúð.',
        body: `## 1. Rakamæling

Við mælum raka í steypunni áður en nokkuð er lagt. Fyrir parket þarf gildið að vera komið niður fyrir mörkin sem framleiðandinn setur, oftast 85% rakastig. Nýtt gólfplan þarf gjarnan margar vikur í viðbót. Sé rakinn of hár leggjum við rakasperru eða bíðum.

## 2. Jöfnun undirlags

Ójöfnur yfir 2 mm undir tveggja metra réttskeið koma fram síðar sem hljóð og laus samskeyti. Við flotum lægðir og slípum niður toppa þar til flöturinn stenst mælinguna.

## 3. Aðlögun efnis

Parketið stendur óopnað inni í rýminu í 48 klukkustundir, við sama hita og raka og verður eftir lögn. Þannig hreyfist efnið ekki eftir að það er komið niður.

## Tímarammi

Íbúð upp á 70 m² tekur tvo til fjóra daga: einn dagur í undirbúning, einn til tveir dagar í lögn og einn dagur í lista og frágang. Við skilum rýminu hreinu.`,
      },
      en: {
        title: 'Three steps before laying parquet',
        slug: 'three-steps-before-laying-parquet',
        excerpt:
          'Moisture reading, levelling and acclimatisation. These three decide how the floor looks in five years.',
        seoTitle: 'Three steps before laying parquet | Expert Parket og Mál',
        seoDescription:
          'Preparing for a parquet installation: moisture readings in the slab, levelling the subfloor and acclimatising the boards. Timeline for a 70 m² flat.',
        body: `## 1. Moisture reading

We measure moisture in the slab before anything is laid. For parquet the reading has to be below the limit the manufacturer sets, usually 85% relative humidity. A fresh slab often needs several more weeks. If the reading is too high we lay a moisture barrier or wait.

## 2. Levelling the subfloor

Deviations over 2 mm under a two metre straight edge show up later as noise and loose joints. We fill the dips and grind down the high spots until the surface passes the check.

## 3. Acclimatising the boards

The parquet stands unopened inside the room for 48 hours, at the same temperature and humidity it will live in. That way the material stops moving before it goes down, not after.

## Timeline

A 70 m² flat takes two to four days: one day of preparation, one to two days of laying, one day for skirting and finishing. We hand the room back clean.`,
      },
      pl: {
        title: 'Trzy kroki przed układaniem parkietu',
        slug: 'trzy-kroki-przed-ukladaniem-parkietu',
        excerpt:
          'Pomiar wilgotności, wyrównanie i aklimatyzacja. Te trzy rzeczy decydują, jak podłoga wygląda po pięciu latach.',
        seoTitle: 'Trzy kroki przed układaniem parkietu | Expert Parket og Mál',
        seoDescription:
          'Przygotowanie do układania parkietu: pomiar wilgotności wylewki, wyrównanie podłoża i aklimatyzacja desek. Harmonogram dla mieszkania 70 m².',
        body: `## 1. Pomiar wilgotności

Mierzymy wilgotność wylewki, zanim cokolwiek zostanie ułożone. Dla parkietu wynik musi być poniżej granicy podanej przez producenta, zwykle 85% wilgotności względnej. Świeża wylewka potrzebuje często kilku tygodni więcej. Jeśli wynik jest za wysoki, kładziemy paroizolację albo czekamy.

## 2. Wyrównanie podłoża

Odchyłki powyżej 2 mm pod dwumetrową łatą dają później hałas i luźne złącza. Wylewamy masę w zagłębieniach i szlifujemy wypukłości, aż powierzchnia przejdzie pomiar.

## 3. Aklimatyzacja desek

Parkiet stoi nieotwarty w pomieszczeniu przez 48 godzin, w tej samej temperaturze i wilgotności, w jakiej będzie leżał. Dzięki temu materiał przestaje pracować przed ułożeniem, a nie po nim.

## Harmonogram

Mieszkanie 70 m² zajmuje dwa do czterech dni: jeden dzień przygotowania, jeden do dwóch dni układania, jeden dzień na listwy i wykończenie. Oddajemy pomieszczenie posprzątane.`,
      },
    },
  },
]
