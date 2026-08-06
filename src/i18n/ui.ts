import type { Lang } from './config'

/**
 * Shared UI microcopy: everything that isn't long-form page content lives here
 * (navigation, footer, buttons, labels, alt text, breadcrumbs). Long-form
 * marketing content lives in `src/data/*` instead.
 *
 * `{phone}` and `{n}` are simple placeholders the components interpolate.
 */

const is = {
  nav: {
    home: 'Heim',
    services: 'Þjónusta',
    portfolio: 'Verkefni',
    catalog: 'Vöruúrval',
    about: 'Um okkur',
    contact: 'Hafðu samband',
  },
  topbar: {
    hours: 'Mán til Fös 08:00 til 18:00',
    dateline: 'Reykjavík og nágrenni · Mán til Fös 08:00 til 18:00',
  },
  a11y: {
    menuMain: 'Aðalvalmynd',
    menuMobile: 'Farsímavalmynd',
    logoHome: 'Expert Parket og Mál, heim',
    openMenu: 'Opna valmynd',
    closeMenu: 'Loka valmynd',
    breadcrumb: 'Slóð',
    sliderCompare: 'Renna til að bera saman fyrir og eftir gólf',
    sliderValueText: '{n}% af eftir-myndinni sýnilegt',
    switcher: 'Velja tungumál',
  },
  common: {
    callPrefix: 'Hringdu í',
    callNow: 'Hringdu núna',
    skipToContent: 'Fara beint í efni',
    readMore: 'Lesa meira',
    viewAllServices: 'Skoða alla þjónustu',
    viewMoreProjects: 'Skoða fleiri verkefni',
    getQuote: 'Fá tilboð',
    getQuoteForPrefix: 'Fáðu tilboð í',
    perM2: 'á m²',
    filterAll: 'Allt',
    before: 'Fyrir',
    after: 'Eftir',
    alt: {
      hero: 'Fallegt parketgólf í bjartri stofu',
      craftsman: 'Fagmaður að störfum',
      floorLaid: 'Fagmannlega lagt parketgólf',
      beforeAfterBefore: 'Rýmið fyrir, óunnið gólf',
      beforeAfterAfter: 'Rýmið eftir, fullbúið parketgólf',
    },
  },
  quick: {
    open: 'Hafðu samband',
    close: 'Loka',
    whatsapp: 'WhatsApp',
    email: 'Netfang',
  },
  serviceNames: { parket: 'Parket', slipun: 'Slípun', malun: 'Málun' },
  serviceFull: { parket: 'Parketlögn', slipun: 'Parketslípun', malun: 'Málun' },
  catalog: {
    spec: { thickness: 'Þykkt', finish: 'Áferð', bestFor: 'Hentar fyrir', price: 'Verð' },
    ctaTitle: 'Við útvegum fleira en hér sést',
    ctaSubtitle:
      'Fleiri gerðir, litir og mynstur eru í boði en hér eru sýnd. Segðu okkur hvað þig vantar og við finnum rétta parketið á rétta verðinu.',
  },
  portfolio: {
    note: 'Þetta er aðeins úrval. Nýtt myndasafn með fleiri verkefnum er í vinnslu. Hafðu samband til að sjá dæmi sem líkjast þínu verki.',
  },
  contact: {
    labelPhone: 'Sími',
    labelEmail: 'Netfang',
    labelArea: 'Svæði',
    areaValue: 'Allt höfuðborgarsvæðið',
    sendAnother: 'Senda aðra fyrirspurn',
    selectService: 'Veldu þjónustu',
    mailtoSubjectPrefix: 'Fyrirspurn frá',
    mailtoName: 'Nafn',
    mailtoService: 'Þjónusta',
    mailtoProduct: 'Vara',
  },
  footer: {
    tagline:
      'Við sköpum falleg gólf. Parketlögn, slípun og málun af fagmennsku á höfuðborgarsvæðinu í meira en 25 ár.',
    hoursTitle: 'Opnunartími',
    hoursWeek: 'Mán til Fös: 08:00 til 18:00',
    hoursWeekend: 'Lau og Sun: lokað',
    colCompany: 'Fyrirtækið',
    colContact: 'Samskipti',
    linkCatalog: 'Vöruúrval & verð',
    rights: 'Allur réttur áskilinn.',
    areaLine: 'Höfuðborgarsvæðið og nágrenni',
    privacyLabel: 'Persónuverndarstefna',
  },
  closer: {
    label: 'Hafðu samband',
    line1: 'Segðu okkur frá',
    line2: 'gólfinu þínu.',
    support:
      'Frítt verðtilboð, við hringjum til baka innan virks dags og vinnum um allt höfuðborgarsvæðið.',
  },
  notFound: {
    seoTitle: 'Síða fannst ekki | Expert Parket og Mál',
    title: 'Þessi síða fannst ekki',
    text: 'Síðan sem þú leitaðir að er ekki til eða hefur verið færð. Farðu aftur á forsíðuna eða hafðu samband við okkur.',
    backHome: 'Til baka á forsíðu',
  },
}

type Ui = typeof is

const en: Ui = {
  nav: {
    home: 'Home',
    services: 'Services',
    portfolio: 'Projects',
    catalog: 'Flooring',
    about: 'About us',
    contact: 'Contact',
  },
  topbar: {
    hours: 'Mon to Fri 08:00 to 18:00',
    dateline: 'Reykjavík area · Mon to Fri 08:00 to 18:00',
  },
  a11y: {
    menuMain: 'Main menu',
    menuMobile: 'Mobile menu',
    logoHome: 'Expert Parket og Mál, home',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    breadcrumb: 'Breadcrumb',
    sliderCompare: 'Drag to compare the floor before and after',
    sliderValueText: '{n}% of the after image visible',
    switcher: 'Choose language',
  },
  common: {
    callPrefix: 'Call',
    callNow: 'Call now',
    skipToContent: 'Skip to content',
    readMore: 'Read more',
    viewAllServices: 'View all services',
    viewMoreProjects: 'View more projects',
    getQuote: 'Get a quote',
    getQuoteForPrefix: 'Get a quote for',
    perM2: 'per m²',
    filterAll: 'All',
    before: 'Before',
    after: 'After',
    alt: {
      hero: 'Beautiful parquet floor in a bright living room',
      craftsman: 'Craftsman at work',
      floorLaid: 'Professionally laid parquet floor',
      beforeAfterBefore: 'The space before, untreated floor',
      beforeAfterAfter: 'The space after, finished parquet floor',
    },
  },
  quick: {
    open: 'Contact us',
    close: 'Close',
    whatsapp: 'WhatsApp',
    email: 'Email',
  },
  serviceNames: { parket: 'Parquet', slipun: 'Sanding', malun: 'Painting' },
  serviceFull: { parket: 'Parquet laying', slipun: 'Floor sanding', malun: 'Painting' },
  catalog: {
    spec: { thickness: 'Thickness', finish: 'Finish', bestFor: 'Best for', price: 'Price' },
    ctaTitle: 'We supply more than shown here',
    ctaSubtitle:
      'More types, colours and patterns are available than shown here. Tell us what you need and we will find the right flooring at the right price.',
  },
  portfolio: {
    note: 'This is only a selection. A new gallery with more projects is in the works. Get in touch to see examples similar to yours.',
  },
  contact: {
    labelPhone: 'Phone',
    labelEmail: 'Email',
    labelArea: 'Area',
    areaValue: 'The whole capital region',
    sendAnother: 'Send another message',
    selectService: 'Choose a service',
    mailtoSubjectPrefix: 'Enquiry from',
    mailtoName: 'Name',
    mailtoService: 'Service',
    mailtoProduct: 'Product',
  },
  footer: {
    tagline:
      'We create beautiful floors. Professional parquet laying, sanding and painting across the capital region for more than 25 years.',
    hoursTitle: 'Opening hours',
    hoursWeek: 'Mon to Fri: 08:00 to 18:00',
    hoursWeekend: 'Sat and Sun: closed',
    colCompany: 'Company',
    colContact: 'Contact',
    linkCatalog: 'Flooring & prices',
    rights: 'All rights reserved.',
    areaLine: 'The capital region and surroundings',
    privacyLabel: 'Privacy policy',
  },
  closer: {
    label: 'Get in touch',
    line1: 'Tell us about',
    line2: 'your floor.',
    support:
      'Free quote, we call back within a working day and work across the whole capital region.',
  },
  notFound: {
    seoTitle: 'Page not found | Expert Parket og Mál',
    title: 'This page was not found',
    text: 'The page you were looking for does not exist or has been moved. Go back to the homepage or get in touch with us.',
    backHome: 'Back to homepage',
  },
}

const pl: Ui = {
  nav: {
    home: 'Strona główna',
    services: 'Usługi',
    portfolio: 'Realizacje',
    catalog: 'Parkiety',
    about: 'O nas',
    contact: 'Kontakt',
  },
  topbar: {
    hours: 'Pon do Pt 08:00 do 18:00',
    dateline: 'Rejon Reykjavíku · Pon do Pt 08:00 do 18:00',
  },
  a11y: {
    menuMain: 'Menu główne',
    menuMobile: 'Menu mobilne',
    logoHome: 'Expert Parket og Mál, strona główna',
    openMenu: 'Otwórz menu',
    closeMenu: 'Zamknij menu',
    breadcrumb: 'Ścieżka nawigacji',
    sliderCompare: 'Przeciągnij, aby porównać podłogę przed i po',
    sliderValueText: '{n}% obrazu „po” widoczne',
    switcher: 'Wybierz język',
  },
  common: {
    callPrefix: 'Zadzwoń pod',
    callNow: 'Zadzwoń teraz',
    skipToContent: 'Przejdź do treści',
    readMore: 'Czytaj więcej',
    viewAllServices: 'Zobacz wszystkie usługi',
    viewMoreProjects: 'Zobacz więcej realizacji',
    getQuote: 'Zamów wycenę',
    getQuoteForPrefix: 'Zamów wycenę na',
    perM2: 'za m²',
    filterAll: 'Wszystkie',
    before: 'Przed',
    after: 'Po',
    alt: {
      hero: 'Piękna podłoga parkietowa w jasnym salonie',
      craftsman: 'Rzemieślnik przy pracy',
      floorLaid: 'Profesjonalnie ułożona podłoga parkietowa',
      beforeAfterBefore: 'Wnętrze przed, surowa podłoga',
      beforeAfterAfter: 'Wnętrze po, gotowa podłoga parkietowa',
    },
  },
  quick: {
    open: 'Skontaktuj się',
    close: 'Zamknij',
    whatsapp: 'WhatsApp',
    email: 'E-mail',
  },
  serviceNames: { parket: 'Parkiet', slipun: 'Cyklinowanie', malun: 'Malowanie' },
  serviceFull: { parket: 'Układanie parkietu', slipun: 'Cyklinowanie parkietu', malun: 'Malowanie' },
  catalog: {
    spec: { thickness: 'Grubość', finish: 'Wykończenie', bestFor: 'Najlepsze do', price: 'Cena' },
    ctaTitle: 'Oferujemy więcej, niż widać tutaj',
    ctaSubtitle:
      'Dostępnych jest więcej rodzajów, kolorów i wzorów niż pokazano tutaj. Powiedz nam, czego potrzebujesz, a znajdziemy odpowiedni parkiet w odpowiedniej cenie.',
  },
  portfolio: {
    note: 'To tylko wybór. Nowa galeria z większą liczbą realizacji jest w przygotowaniu. Skontaktuj się, aby zobaczyć przykłady podobne do Twojego.',
  },
  contact: {
    labelPhone: 'Telefon',
    labelEmail: 'E-mail',
    labelArea: 'Obszar',
    areaValue: 'Cały region stołeczny',
    sendAnother: 'Wyślij kolejne zapytanie',
    selectService: 'Wybierz usługę',
    mailtoSubjectPrefix: 'Zapytanie od',
    mailtoName: 'Imię',
    mailtoService: 'Usługa',
    mailtoProduct: 'Produkt',
  },
  footer: {
    tagline:
      'Tworzymy piękne podłogi. Profesjonalne układanie parkietu, cyklinowanie i malowanie w regionie stołecznym od ponad 25 lat.',
    hoursTitle: 'Godziny otwarcia',
    hoursWeek: 'Pon do Pt: 08:00 do 18:00',
    hoursWeekend: 'Sob i Niedz: nieczynne',
    colCompany: 'Firma',
    colContact: 'Kontakt',
    linkCatalog: 'Parkiety i ceny',
    rights: 'Wszelkie prawa zastrzeżone.',
    areaLine: 'Region stołeczny i okolice',
    privacyLabel: 'Polityka prywatności',
  },
  closer: {
    label: 'Kontakt',
    line1: 'Opowiedz nam o',
    line2: 'swojej podłodze.',
    support:
      'Bezpłatna wycena, oddzwaniamy w ciągu dnia roboczego i pracujemy w całym regionie stołecznym.',
  },
  notFound: {
    seoTitle: 'Nie znaleziono strony | Expert Parket og Mál',
    title: 'Nie znaleziono tej strony',
    text: 'Strona, której szukasz, nie istnieje lub została przeniesiona. Wróć na stronę główną lub skontaktuj się z nami.',
    backHome: 'Powrót na stronę główną',
  },
}

export const ui: Record<Lang, Ui> = { is, en, pl }
