import type { Lang } from '@/i18n/config'

export type PrivacySection = { heading: string; paragraphs?: string[]; bullets?: string[] }
export type PrivacyContent = {
  seo: { title: string; description: string }
  /** Display title pre-split into LineReveal lines (print control over wrapping). */
  titleLines: string[]
  lead: string
  updated: string
  sections: PrivacySection[]
}

export const privacy: Record<Lang, PrivacyContent> = {
  is: {
    seo: {
      title: 'Persónuverndarstefna | Expert Parket og Mál',
      description:
        'Persónuverndarstefna Expert Parket og Mál ehf. Hvaða upplýsingum vefurinn safnar, hvernig þær eru notaðar og hver réttindi þín eru samkvæmt persónuverndarlögum.',
    },
    titleLines: ['Persónuvernd'],
    lead: 'Hér er útskýrt hvaða upplýsingum þessi vefur safnar, í hvaða tilgangi og hver réttindi þín eru samkvæmt lögum nr. 90/2018 og persónuverndarreglugerðinni (GDPR).',
    updated: 'Síðast uppfært: 30. ágúst 2026',
    sections: [
      {
        heading: 'Ábyrgðaraðili',
        paragraphs: [
          'Ábyrgðaraðili vinnslu persónuupplýsinga á þessari vefsíðu er Expert Parket og Mál ehf. Ef þú hefur spurningar um persónuvernd getur þú haft samband í síma 785 7079 eða með tölvupósti á expertparket2024@gmail.com.',
        ],
      },
      {
        heading: 'Hvaða upplýsingum söfnum við?',
        paragraphs: [
          'Við söfnum aðeins þeim upplýsingum sem þú sendir okkur að eigin frumkvæði og þeim tæknilegu lágmarksupplýsingum sem fylgja notkun vefsins:',
        ],
        bullets: [
          'Fyrirspurnarform: nafn, símanúmer, netfang (valfrjálst), valin þjónusta og skilaboðin þín. Fyrirspurnin er líka geymd í stjórnborði vefsins svo hægt sé að svara henni og fylgja henni eftir.',
          'Heimsóknartalning: slóð síðunnar, tungumál, tækjagerð og hvaðan þú komst inn á vefinn. Talningin notar engar vafrakökur og geymir hvorki IP tölu né neitt sem tengir heimsóknina við þig.',
          'Tæknilegar upplýsingar: hýsingaraðili vefsins skráir sjálfkrafa IP tölur og tæknilegar færslur (e. server logs) í öryggis- og rekstrarskyni.',
        ],
      },
      {
        heading: 'Tilgangur og lagagrundvöllur vinnslu',
        paragraphs: [
          'Upplýsingar úr fyrirspurnarformi eru eingöngu notaðar til að svara fyrirspurn þinni og gera þér verðtilboð. Sú vinnsla byggist á b-lið 1. mgr. 6. gr. GDPR (ráðstafanir að beiðni þinni áður en samningur er gerður). Vinnsla tæknilegra færslna byggist á lögmætum hagsmunum okkar af öruggum rekstri vefsins (f-liður 1. mgr. 6. gr. GDPR).',
        ],
      },
      {
        heading: 'Vafrakökur og greiningartæki',
        paragraphs: [
          'Þessi vefsíða notar engar vafrakökur og engin greiningar- eða auglýsingaforrit þriðju aðila. Vefurinn telur þó heimsóknir sjálfur, eins og lýst er hér að ofan: talningin er nafnlaus, notar engar vafrakökur og geymir hvorki IP tölu né neitt sem tengir heimsóknina við þig. Leturgerðir eru hýstar á vefnum sjálfum svo engin beiðni fer til utanaðkomandi leturveitna.',
        ],
      },
      {
        heading: 'Þriðju aðilar og vinnsluaðilar',
        bullets: [
          'Hýsing: vefsíðan er hýst hjá Vercel Inc. Hýsingaraðilinn kann að vinna tæknilegar færslur (þ. á m. IP tölur) til að birta vefinn á öruggan hátt.',
          'Fyrirspurnarform: sé formsendingarþjónusta (Formspree Inc.) virk er efni formsins sent í gegnum hana á netfangið okkar. Að öðrum kosti opnast tölvupóstforritið þitt og engin gögn fara um þriðja aðila.',
        ],
      },
      {
        heading: 'Varðveislutími',
        paragraphs: [
          'Fyrirspurnir eru aðeins varðveittar á meðan unnið er úr þeim og eins lengi og nauðsynlegt er vegna hugsanlegs verks eða tilboðs. Upplýsingum sem ekki er lengur þörf á er eytt.',
        ],
      },
      {
        heading: 'Réttindi þín',
        paragraphs: ['Samkvæmt persónuverndarlögum átt þú m.a. eftirfarandi réttindi:'],
        bullets: [
          'Rétt til aðgangs að þeim persónuupplýsingum sem við vinnum um þig.',
          'Rétt til leiðréttingar á röngum eða ófullkomnum upplýsingum.',
          'Rétt til eyðingar upplýsinga („rétturinn til að gleymast“).',
          'Rétt til takmörkunar á vinnslu og andmælarétt.',
          'Rétt til að flytja eigin gögn (e. data portability).',
          'Rétt til að leggja fram kvörtun hjá Persónuvernd (personuvernd.is) eða hjá persónuverndaryfirvöldum í þínu heimalandi innan EES.',
        ],
      },
      {
        heading: 'Öryggi',
        paragraphs: [
          'Öll samskipti við vefinn eru dulkóðuð með TLS (https). Við söfnum eins litlum upplýsingum og mögulegt er og beitum viðurkenndum öryggisráðstöfunum, þ. á m. ströngum öryggishausum (Content Security Policy o.fl.).',
        ],
      },
      {
        heading: 'Breytingar á stefnunni',
        paragraphs: [
          'Við kunnum að uppfæra þessa stefnu ef vinnsla eða virkni vefsins breytist. Nýjasta útgáfan er ávallt birt á þessari síðu ásamt dagsetningu síðustu uppfærslu.',
        ],
      },
          {
        heading: 'Myndir á vefnum',
        paragraphs: [
          'Myndefni á vefnum er af tvennum toga: okkar eigin verkmyndir og aðkeyptar safnmyndir. Safnmyndirnar eru notaðar samkvæmt leyfisskilmálum Unsplash og Pexels, sem heimila birtingu á vefsíðum án frekari merkingar. Safnmyndir eru til skýringar og sýna ekki alltaf verk fyrirtækisins sjálfs.',
        ],
      },
    ],
  },
  en: {
    seo: {
      title: 'Privacy policy | Expert Parket og Mál',
      description:
        'Privacy policy of Expert Parket og Mál ehf. What information this website collects, how it is used and what your rights are under data protection law.',
    },
    titleLines: ['Privacy policy'],
    lead: 'This page explains what data this website collects, for what purpose, and what your rights are under Icelandic Act No. 90/2018 and the General Data Protection Regulation (GDPR).',
    updated: 'Last updated: 30 August 2026',
    sections: [
      {
        heading: 'Data controller',
        paragraphs: [
          'The controller of personal data processed on this website is Expert Parket og Mál ehf. If you have any questions about privacy, you can reach us on 785 7079 or at expertparket2024@gmail.com.',
        ],
      },
      {
        heading: 'What information do we collect?',
        paragraphs: [
          'We only collect the information you send us yourself, plus the minimal technical data that comes with using any website:',
        ],
        bullets: [
          'Contact form: name, phone number, email (optional), chosen service and your message. The enquiry is also stored in the site admin so it can be answered and followed up.',
          'Visit counting: the page path, language, device class and where you arrived from. The counting uses no cookies and stores neither an IP address nor anything that ties the visit to you.',
          'Technical data: our hosting provider automatically keeps technical server logs, including IP addresses, for security and operational purposes.',
        ],
      },
      {
        heading: 'Purpose and legal basis',
        paragraphs: [
          'Information from the contact form is used solely to answer your enquiry and prepare a quote. This processing is based on Art. 6(1)(b) GDPR (steps taken at your request prior to entering into a contract). Technical logs are based on our legitimate interest in operating the website securely (Art. 6(1)(f) GDPR).',
        ],
      },
      {
        heading: 'Cookies and analytics',
        paragraphs: [
          'This website uses no cookies and runs no third-party analytics or advertising scripts. It does keep its own visit count, as described above: that count is anonymous, uses no cookies, and stores neither your IP address nor anything that ties a visit to you. Fonts are self-hosted, so no requests are sent to external font providers.',
        ],
      },
      {
        heading: 'Third parties and processors',
        bullets: [
          'Hosting: the website is hosted by Vercel Inc. The hosting provider may process technical logs (including IP addresses) to deliver the site securely.',
          'Contact form: if a form delivery service (Formspree Inc.) is enabled, the form content is transmitted through it to our email address. Otherwise your own email client opens and no data passes through a third party.',
        ],
      },
      {
        heading: 'Retention',
        paragraphs: [
          'Enquiries are kept only while they are being handled and for as long as necessary for a potential job or quote. Information that is no longer needed is deleted.',
        ],
      },
      {
        heading: 'Your rights',
        paragraphs: ['Under data protection law you have, among others, the following rights:'],
        bullets: [
          'The right of access to the personal data we process about you.',
          'The right to rectification of inaccurate or incomplete data.',
          'The right to erasure (“the right to be forgotten”).',
          'The right to restriction of processing and the right to object.',
          'The right to data portability.',
          'The right to lodge a complaint with the Icelandic Data Protection Authority, Persónuvernd (personuvernd.is), or with the supervisory authority in your EEA country.',
        ],
      },
      {
        heading: 'Security',
        paragraphs: [
          'All communication with the website is encrypted with TLS (https). We collect as little data as possible and apply recognised security measures, including strict security headers (Content Security Policy and others).',
        ],
      },
      {
        heading: 'Changes to this policy',
        paragraphs: [
          'We may update this policy if the processing or functionality of the website changes. The latest version is always published on this page together with the date of the last update.',
        ],
      },
          {
        heading: 'Images on this site',
        paragraphs: [
          'The imagery on this site is of two kinds: our own project photography and licensed stock photography. Stock images are used under the Unsplash and Pexels licences, which permit publication on websites without further attribution. Stock images are illustrative and do not always show the company\'s own work.',
        ],
      },
    ],
  },
  pl: {
    seo: {
      title: 'Polityka prywatności | Expert Parket og Mál',
      description:
        'Polityka prywatności Expert Parket og Mál ehf. Jakie informacje zbiera ta strona, jak są wykorzystywane i jakie masz prawa zgodnie z przepisami o ochronie danych.',
    },
    titleLines: ['Polityka', 'prywatności'],
    lead: 'Ta strona wyjaśnia, jakie dane zbiera ten serwis, w jakim celu oraz jakie masz prawa zgodnie z islandzką ustawą nr 90/2018 i ogólnym rozporządzeniem o ochronie danych (RODO).',
    updated: 'Ostatnia aktualizacja: 30 sierpnia 2026',
    sections: [
      {
        heading: 'Administrator danych',
        paragraphs: [
          'Administratorem danych osobowych przetwarzanych na tej stronie jest Expert Parket og Mál ehf. W sprawach dotyczących prywatności możesz skontaktować się z nami pod numerem telefonu 785 7079 lub pod adresem e-mail expertparket2024@gmail.com.',
        ],
      },
      {
        heading: 'Jakie informacje zbieramy?',
        paragraphs: [
          'Zbieramy wyłącznie informacje, które samodzielnie nam przekazujesz, oraz minimalne dane techniczne związane z korzystaniem z każdej strony internetowej:',
        ],
        bullets: [
          'Formularz kontaktowy: imię i nazwisko, numer telefonu, e-mail (opcjonalnie), wybrana usługa i treść wiadomości. Zapytanie jest też przechowywane w panelu administracyjnym strony, żeby można było na nie odpowiedzieć i je obsłużyć.',
          'Zliczanie wizyt: adres strony, język, rodzaj urządzenia i miejsce, z którego trafiłeś na stronę. Zliczanie nie używa plików cookie i nie zapisuje ani adresu IP, ani niczego, co wiąże wizytę z Tobą.',
          'Dane techniczne: dostawca hostingu automatycznie zapisuje adresy IP i techniczne logi serwera ze względów bezpieczeństwa oraz w celach związanych z utrzymaniem strony.',
        ],
      },
      {
        heading: 'Cel i podstawa prawna',
        paragraphs: [
          'Informacje z formularza kontaktowego są wykorzystywane wyłącznie do odpowiedzi na Twoje zapytanie i przygotowania wyceny. Podstawą tego przetwarzania jest art. 6 ust. 1 lit. b RODO (działania na Twoje żądanie przed zawarciem umowy). Przetwarzanie logów technicznych opiera się na naszym prawnie uzasadnionym interesie, polegającym na bezpiecznym prowadzeniu strony (art. 6 ust. 1 lit. f RODO).',
        ],
      },
      {
        heading: 'Pliki cookie i analityka',
        paragraphs: [
          'Ta strona nie używa plików cookie ani zewnętrznych narzędzi analitycznych i reklamowych. Prowadzi natomiast własne, anonimowe zliczanie odwiedzin opisane powyżej: bez plików cookie, bez zapisywania adresu IP i bez czegokolwiek, co wiązałoby wizytę z Tobą. Czcionki są hostowane lokalnie, więc żadne zapytania nie trafiają do zewnętrznych dostawców czcionek.',
        ],
      },
      {
        heading: 'Podmioty trzecie i podmioty przetwarzające',
        bullets: [
          'Hosting: strona jest hostowana przez Vercel Inc. Dostawca hostingu może przetwarzać logi techniczne (w tym adresy IP) w celu bezpiecznego udostępniania strony.',
          'Formularz kontaktowy: jeśli włączona jest usługa przesyłania formularzy (Formspree Inc.), treść formularza jest przekazywana za jej pośrednictwem na nasz adres e-mail. W przeciwnym razie otwiera się Twój program pocztowy i żadne dane nie przechodzą przez podmiot trzeci.',
        ],
      },
      {
        heading: 'Okres przechowywania',
        paragraphs: [
          'Zapytania są przechowywane tylko na czas ich obsługi oraz tak długo, jak jest to konieczne w związku z potencjalnym zleceniem lub wyceną. Informacje, które nie są już potrzebne, są usuwane.',
        ],
      },
      {
        heading: 'Twoje prawa',
        paragraphs: ['Zgodnie z przepisami o ochronie danych przysługują Ci m.in. następujące prawa:'],
        bullets: [
          'Prawo dostępu do danych osobowych, które przetwarzamy na Twój temat.',
          'Prawo do sprostowania nieprawidłowych lub niekompletnych danych.',
          'Prawo do usunięcia danych („prawo do bycia zapomnianym”).',
          'Prawo do ograniczenia przetwarzania oraz prawo sprzeciwu.',
          'Prawo do przenoszenia danych.',
          'Prawo do wniesienia skargi do islandzkiego organu ochrony danych Persónuvernd (personuvernd.is) lub do organu nadzorczego w Twoim kraju EOG.',
        ],
      },
      {
        heading: 'Bezpieczeństwo',
        paragraphs: [
          'Cała komunikacja ze stroną jest szyfrowana protokołem TLS (https). Zbieramy jak najmniej danych i stosujemy uznane środki bezpieczeństwa, w tym rygorystyczne nagłówki bezpieczeństwa (Content Security Policy i inne).',
        ],
      },
      {
        heading: 'Zmiany polityki',
        paragraphs: [
          'Możemy aktualizować tę politykę, jeśli zmieni się sposób przetwarzania danych lub funkcjonalność strony. Najnowsza wersja jest zawsze publikowana na tej stronie wraz z datą ostatniej aktualizacji.',
        ],
      },
          {
        heading: 'Zdjęcia w serwisie',
        paragraphs: [
          'Materiał zdjęciowy w serwisie jest dwojakiego rodzaju: nasze własne zdjęcia z realizacji oraz licencjonowane zdjęcia stockowe. Zdjęcia stockowe wykorzystujemy zgodnie z licencjami Unsplash i Pexels, które pozwalają na publikację na stronach internetowych bez dodatkowego oznaczania. Zdjęcia stockowe mają charakter poglądowy i nie zawsze przedstawiają realizacje firmy.',
        ],
      },
    ],
  },
}
