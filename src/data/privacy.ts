import type { Lang } from '@/i18n/config'
import type { LegalContent, LegalSection } from './legal'

export type PrivacySection = LegalSection
export type PrivacyContent = LegalContent

/**
 * The privacy policy, rewritten on 8 September 2026 to say what the site
 * actually does. The previous text named Formspree, which was never wired
 * up, and left out Resend, Gmail, Supabase and Anthropic, which are. It also
 * said nothing about the fact that every one of those is a US company, which
 * Art. 13(1)(f) GDPR requires. Everything below was checked against the code:
 * api/kontakt.ts, src/lib/analytics.ts, src/lib/db and api/translate.ts.
 */
const UPDATED: Record<Lang, string> = {
  is: 'Síðast uppfært: 8. september 2026',
  en: 'Last updated: 8 September 2026',
  pl: 'Ostatnia aktualizacja: 8 września 2026',
}

export const privacy: Record<Lang, PrivacyContent> = {
  is: {
    seo: {
      title: 'Persónuverndarstefna | Expert Parket og Mál',
      description:
        'Persónuverndarstefna Expert Parket og Mál ehf. Hvaða upplýsingum vefurinn safnar, hvers vegna, hverjir vinna þær fyrir okkur, hve lengi þær eru geymdar og hver réttindi þín eru samkvæmt lögum nr. 90/2018 og GDPR.',
    },
    titleLines: ['Persónuvernd'],
    lead: 'Hér er útskýrt hvaða upplýsingum þessi vefur safnar, í hvaða tilgangi, hverjir vinna þær fyrir okkur og hver réttindi þín eru samkvæmt lögum um persónuvernd nr. 90/2018 og persónuverndarreglugerðinni (GDPR).',
    updated: UPDATED.is,
    sections: [
      {
        heading: 'Ábyrgðaraðili',
        paragraphs: [
          'Ábyrgðaraðili vinnslu persónuupplýsinga á þessum vef er Expert Parket og Mál ehf., kennitala 500123-1250, Álfholti 10, 220 Hafnarfjörður. Spurningar um persónuvernd má senda í síma 785 7079 eða á expertparket2024@gmail.com. Fyrirtækið er lítið og hefur ekki sérstakan persónuverndarfulltrúa, enda ekki skylt.',
        ],
      },
      {
        heading: 'Hvaða upplýsingum söfnum við?',
        paragraphs: [
          'Við söfnum aðeins því sem þú sendir okkur sjálf og þeim tæknilegu lágmarksupplýsingum sem fylgja notkun vefsins:',
        ],
        bullets: [
          'Fyrirspurnarform: nafn, sími eða netfang, valin þjónusta og skilaboðin þín. Með fylgir slóð síðunnar sem formið var sent af, tungumál vefsins og kóði kynningartengils ef þú komst í gegnum slíkan.',
          'Samskipti sem þú átt frumkvæði að: símtöl, tölvupóstur og WhatsApp-skilaboð, ásamt því sem þú sendir okkur þar, til dæmis myndir af gólfinu.',
          'Verði af viðskiptum: heimilisfang verkstaðar, tilboð, samningur og reikningar.',
          'Heimsóknartalning: slóð síðunnar, tungumál, tækjaflokkur, lén tilvísandi síðu og kynningarkóði, ásamt tilviljunarkenndu lotunúmeri sem lifir aðeins meðan flipinn er opinn. Engin IP-tala, engar vafrakökur og ekkert sem tengir heimsóknina við þig.',
          'Tæknilegar færslur hýsingaraðila: IP-tala, tími og slóð, skráð sjálfkrafa í öryggis- og rekstrarskyni.',
        ],
      },
      {
        heading: 'Tilgangur og lagagrundvöllur',
        bullets: [
          'Fyrirspurnir og samskipti: til að svara þér, skoða og gera tilboð. Byggist á b-lið 1. mgr. 6. gr. GDPR, ráðstöfunum að þinni beiðni áður en samningur er gerður.',
          'Samningur og reikningar: til að efna samninginn (b-liður) og til að uppfylla bókhaldslög nr. 145/1994 (c-liður, lagaskylda).',
          'Heimsóknartalning og öryggisfærslur: lögmætir hagsmunir okkar af því að vita hvaða síður eru notaðar og verja vefinn gegn misnotkun (f-liður). Þú getur andmælt þeirri vinnslu og slökkt á talningunni á síðunni um vefkökur.',
          'Við notum upplýsingarnar ekki til markaðssetningar, seljum þær ekki og miðlum þeim ekki til auglýsenda.',
        ],
      },
      {
        heading: 'Hverjir vinna upplýsingarnar fyrir okkur?',
        paragraphs: [
          'Nokkur fyrirtæki hýsa eða flytja gögn fyrir okkur sem vinnsluaðilar, samkvæmt vinnslusamningum. Ekkert þeirra má nota upplýsingarnar í eigin þágu.',
        ],
        bullets: [
          'Vercel Inc. (Bandaríkin): hýsir vefinn og keyrir fyrirspurnarþjónustuna. Sér tæknilegar færslur og fyrirspurnir á leið í gegn.',
          'Resend Inc. (Bandaríkin): sendir fyrirspurn þína sem tölvupóst til okkar. Fær nafn, samskiptaupplýsingar og skilaboð.',
          'Google LLC (Bandaríkin): pósthólf fyrirtækisins er hjá Gmail, svo fyrirspurnir og tölvupóstur frá þér eru geymd þar.',
          'Supabase Inc. (Bandaríkin): gagnagrunnur vefsins, þar sem fyrirspurnir og heimsóknartalning eru geymd fyrir stjórnborð vefsins, sé hann tengdur.',
          'Anthropic PBC (Bandaríkin): þýðir greinar sem við skrifum í stjórnborðinu á milli tungumála. Fær aðeins texta greinanna, aldrei upplýsingar um gesti.',
          'Meta Platforms og WhatsApp: aðeins ef þú velur sjálf að hafa samband við okkur þar. Þá gilda þeirra skilmálar um þau samskipti.',
        ],
      },
      {
        heading: 'Flutningur út fyrir EES',
        paragraphs: [
          'Vinnsluaðilarnir hér að ofan eru bandarísk fyrirtæki. Flutningur til þeirra byggist á ákvörðun framkvæmdastjórnar ESB um fullnægjandi vernd samkvæmt rammanum um gagnavernd milli ESB og Bandaríkjanna (EU-US Data Privacy Framework) þar sem viðkomandi fyrirtæki er vottað samkvæmt honum, og að öðrum kosti á stöðluðum samningsskilmálum framkvæmdastjórnarinnar, sbr. 46. gr. GDPR. Afrit af skilmálunum má fá með því að hafa samband.',
        ],
      },
      {
        heading: 'Varðveislutími',
        bullets: [
          'Fyrirspurnir sem ekki leiða til viðskipta: eytt eigi síðar en tólf mánuðum eftir síðustu samskipti.',
          'Tilboð, samningar og reikningar: geymd í sjö ár frá lokum reikningsárs samkvæmt bókhaldslögum.',
          'Heimsóknartalning: færslur geymdar í mesta lagi 24 mánuði. Þær innihalda ekkert sem ber kennsl á þig.',
          'Tæknilegar færslur hýsingaraðila: samkvæmt reglum hans, að jafnaði í nokkra daga til vikur.',
        ],
      },
      {
        heading: 'Vafrakökur og geymsla í vafra',
        paragraphs: [
          'Vefurinn notar engar vafrakökur og engin greiningar- eða auglýsingaforrit þriðju aðila. Hann geymir fáein tæknileg atriði í vafranum þínum og þau eru talin upp, eitt af öðru, á síðunni um vefkökur.',
        ],
        link: { key: 'cookies', label: 'Vefkökur og geymsla í vafra' },
      },
      {
        heading: 'Réttindi þín',
        paragraphs: ['Samkvæmt persónuverndarlögum átt þú rétt á:'],
        bullets: [
          'aðgangi að þeim persónuupplýsingum sem við vinnum um þig,',
          'leiðréttingu á röngum eða ófullkomnum upplýsingum,',
          'eyðingu upplýsinga,',
          'takmörkun á vinnslu og að andmæla vinnslu sem byggist á lögmætum hagsmunum,',
          'að fá eigin gögn afhent á tölvutæku formi,',
          'að draga samþykki til baka, hvíli vinnsla á samþykki.',
        ],
      },
      {
        heading: 'Hvernig þú nýtir réttindin',
        paragraphs: [
          'Beiðnir sendast á expertparket2024@gmail.com. Við svörum innan mánaðar. Þú getur einnig kvartað til Persónuverndar, Rauðarárstíg 10, 105 Reykjavík, personuvernd.is, eða til persónuverndaryfirvalda í þínu heimalandi innan EES.',
        ],
      },
      {
        heading: 'Öryggi',
        paragraphs: [
          'Öll samskipti við vefinn eru dulkóðuð með TLS. Vefurinn keyrir stranga öryggisstefnu (Content Security Policy og fleiri öryggishausa) sem bannar forrit frá þriðju aðilum, fyrirspurnarformið er varið gegn sjálfvirkum sendingum og aðgangur að stjórnborði er bundinn við innskráningu. Við söfnum eins litlu og komist verður af með.',
        ],
      },
      {
        heading: 'Myndir á vefnum',
        paragraphs: [
          'Hluti ljósmyndanna á vefnum er af verkum Expert Parket og Mál ehf. Þær sýna rými sem við höfum unnið í og, á einstaka mynd, okkur sjálf við vinnu. Aðrar myndir, meðal annars á forsíðu og í vöruúrvali, eru til myndskreytingar: þær sýna viðartegundir og lagnamynstur en ekki tiltekin verk okkar. Hvorki heimilisföng né fólk utan fyrirtækisins er sýnt á neinni mynd.',
        ],
      },
      {
        heading: 'Breytingar á stefnunni',
        paragraphs: [
          'Við uppfærum þessa stefnu þegar vinnsla eða virkni vefsins breytist. Nýjasta útgáfan er ávallt birt hér ásamt dagsetningu síðustu uppfærslu.',
        ],
      },
    ],
  },
  en: {
    seo: {
      title: 'Privacy policy | Expert Parket og Mál',
      description:
        'Privacy policy of Expert Parket og Mál ehf. What this website collects, why, who processes it for us, how long it is kept and what your rights are under Icelandic Act No. 90/2018 and the GDPR.',
    },
    titleLines: ['Privacy policy'],
    lead: 'This page explains what data this website collects, for what purpose, who processes it on our behalf and what your rights are under the Icelandic Data Protection Act No. 90/2018 and the General Data Protection Regulation (GDPR). This is a translation; the Icelandic version binds.',
    updated: UPDATED.en,
    sections: [
      {
        heading: 'Data controller',
        paragraphs: [
          'The controller of personal data processed on this website is Expert Parket og Mál ehf., Icelandic ID number 500123-1250, Álfholti 10, 220 Hafnarfjörður, Iceland. Questions about privacy can be sent by phone to 785 7079 or by email to expertparket2024@gmail.com. The company is small and has no separate data protection officer, as none is required.',
        ],
      },
      {
        heading: 'What information do we collect?',
        paragraphs: [
          'We collect only what you send us yourself, plus the minimal technical data that comes with using any website:',
        ],
        bullets: [
          'Contact form: name, phone or email, the chosen service and your message. With it come the path of the page the form was sent from, the site language and a campaign code if you arrived through a campaign link.',
          'Contact you initiate: phone calls, email and WhatsApp messages, together with whatever you send us there, for example photos of the floor.',
          'If a job follows: the address of the job, the quote, the contract and invoices.',
          'Visit counting: the page path, language, device class, the domain of the referring site and a campaign code, together with a random session id that lives only while the tab is open. No IP address, no cookies and nothing that ties the visit to you.',
          'Technical logs of the hosting provider: IP address, time and path, recorded automatically for security and operational purposes.',
        ],
      },
      {
        heading: 'Purpose and legal basis',
        bullets: [
          'Enquiries and contact: to answer you, inspect and quote. Based on Art. 6(1)(b) GDPR, steps taken at your request before a contract is made.',
          'Contract and invoices: to perform the contract (Art. 6(1)(b)) and to comply with the Icelandic Accounting Act No. 145/1994 (Art. 6(1)(c), legal obligation).',
          'Visit counting and security logs: our legitimate interest in knowing which pages are used and in protecting the site from abuse (Art. 6(1)(f)). You can object to that processing and switch counting off on the cookies page.',
          'We do not use the data for marketing, do not sell it and do not pass it to advertisers.',
        ],
      },
      {
        heading: 'Who processes the data for us?',
        paragraphs: [
          'A few companies host or transmit data for us as processors, under data processing agreements. None of them may use the data for their own purposes.',
        ],
        bullets: [
          'Vercel Inc. (USA): hosts the website and runs the enquiry service. Sees technical logs and enquiries in transit.',
          'Resend Inc. (USA): delivers your enquiry to us as an email. Receives your name, contact details and message.',
          'Google LLC (USA): the company mailbox is on Gmail, so enquiries and emails from you are stored there.',
          'Supabase Inc. (USA): the site database, where enquiries and the visit count are kept for the site\'s admin panel, when connected.',
          'Anthropic PBC (USA): translates articles we write in the admin panel between languages. Receives only the article text, never visitor data.',
          'Meta Platforms and WhatsApp: only if you choose to contact us there. Their terms then govern that conversation.',
        ],
      },
      {
        heading: 'Transfers outside the EEA',
        paragraphs: [
          'The processors above are US companies. Transfers to them rely on the European Commission\'s adequacy decision under the EU-US Data Privacy Framework where the company is certified under it, and otherwise on the Commission\'s standard contractual clauses under Art. 46 GDPR. A copy of the clauses is available on request.',
        ],
      },
      {
        heading: 'Retention',
        bullets: [
          'Enquiries that do not lead to a job: deleted no later than twelve months after the last contact.',
          'Quotes, contracts and invoices: kept for seven years from the end of the financial year, as the Accounting Act requires.',
          'Visit counting: records kept for at most 24 months. They contain nothing that identifies you.',
          'Hosting provider logs: according to its own rules, typically days to weeks.',
        ],
      },
      {
        heading: 'Cookies and browser storage',
        paragraphs: [
          'The website uses no cookies and no third-party analytics or advertising scripts. It keeps a few technical items in your browser, and they are listed one by one on the cookies page.',
        ],
        link: { key: 'cookies', label: 'Cookies and browser storage' },
      },
      {
        heading: 'Your rights',
        paragraphs: ['Under data protection law you have the right:'],
        bullets: [
          'to access the personal data we process about you,',
          'to have inaccurate or incomplete data corrected,',
          'to have data erased,',
          'to restrict processing and to object to processing based on legitimate interest,',
          'to receive your own data in a machine-readable form,',
          'to withdraw consent, where processing relies on consent.',
        ],
      },
      {
        heading: 'How to exercise them',
        paragraphs: [
          'Send requests to expertparket2024@gmail.com. We reply within a month. You can also complain to the Icelandic Data Protection Authority, Persónuvernd, Rauðarárstígur 10, 105 Reykjavík, personuvernd.is, or to the supervisory authority in your own EEA country.',
        ],
      },
      {
        heading: 'Security',
        paragraphs: [
          'All communication with the website is encrypted with TLS. The site runs a strict security policy (Content Security Policy and further security headers) that forbids third-party scripts, the enquiry form is protected against automated submissions, and the admin panel requires sign-in. We collect as little as we can get by with.',
        ],
      },
      {
        heading: 'Images on this site',
        paragraphs: [
          'Part of the photographs on this site are of work by Expert Parket og Mál ehf. They show rooms we have worked in and, in a few frames, ourselves at work. The other pictures, on the home page and in the catalogue, are there to illustrate: they show wood types and laying patterns, not particular jobs of ours. No photograph on the site shows an address or a person outside the company.',
        ],
      },
      {
        heading: 'Changes to this policy',
        paragraphs: [
          'We update this policy when the processing or the functionality of the website changes. The latest version is always published here with the date of the last update.',
        ],
      },
    ],
  },
  pl: {
    seo: {
      title: 'Polityka prywatności | Expert Parket og Mál',
      description:
        'Polityka prywatności Expert Parket og Mál ehf. Co zbiera ta strona, po co, kto przetwarza dane dla nas, jak długo są przechowywane i jakie masz prawa zgodnie z islandzką ustawą nr 90/2018 i RODO.',
    },
    titleLines: ['Polityka', 'prywatności'],
    lead: 'Ta strona wyjaśnia, jakie dane zbiera ten serwis, w jakim celu, kto przetwarza je w naszym imieniu i jakie masz prawa zgodnie z islandzką ustawą o ochronie danych nr 90/2018 i ogólnym rozporządzeniem o ochronie danych (RODO). To tłumaczenie; wiążąca jest wersja islandzka.',
    updated: UPDATED.pl,
    sections: [
      {
        heading: 'Administrator danych',
        paragraphs: [
          'Administratorem danych osobowych przetwarzanych na tej stronie jest Expert Parket og Mál ehf., islandzki numer identyfikacyjny 500123-1250, Álfholti 10, 220 Hafnarfjörður, Islandia. Pytania dotyczące prywatności można kierować telefonicznie pod 785 7079 lub e-mailem na expertparket2024@gmail.com. Firma jest mała i nie ma osobnego inspektora ochrony danych, bo nie jest to wymagane.',
        ],
      },
      {
        heading: 'Jakie informacje zbieramy?',
        paragraphs: [
          'Zbieramy tylko to, co sam nam przekazujesz, oraz minimalne dane techniczne związane z korzystaniem z każdej strony:',
        ],
        bullets: [
          'Formularz kontaktowy: imię i nazwisko, telefon lub e-mail, wybrana usługa i treść wiadomości. Dołączany jest adres podstrony, z której wysłano formularz, język strony i kod kampanii, jeśli trafiłeś przez link kampanii.',
          'Kontakt, który sam inicjujesz: rozmowy telefoniczne, e-maile i wiadomości WhatsApp, razem z tym, co nam tam wysyłasz, na przykład zdjęcia podłogi.',
          'Jeśli dojdzie do zlecenia: adres miejsca prac, wycena, umowa i faktury.',
          'Zliczanie wizyt: adres podstrony, język, rodzaj urządzenia, domena strony odsyłającej i kod kampanii, wraz z losowym identyfikatorem sesji, który istnieje tylko dopóki karta jest otwarta. Bez adresu IP, bez plików cookie i bez niczego, co wiąże wizytę z Tobą.',
          'Logi techniczne dostawcy hostingu: adres IP, czas i adres, zapisywane automatycznie ze względów bezpieczeństwa i operacyjnych.',
        ],
      },
      {
        heading: 'Cel i podstawa prawna',
        bullets: [
          'Zapytania i kontakt: żeby Ci odpowiedzieć, obejrzeć i wycenić. Podstawa: art. 6 ust. 1 lit. b RODO, działania na Twoje żądanie przed zawarciem umowy.',
          'Umowa i faktury: wykonanie umowy (art. 6 ust. 1 lit. b) i obowiązek wynikający z islandzkiej ustawy o rachunkowości nr 145/1994 (art. 6 ust. 1 lit. c, obowiązek prawny).',
          'Zliczanie wizyt i logi bezpieczeństwa: nasz prawnie uzasadniony interes, żeby wiedzieć, które podstrony są używane, i chronić stronę przed nadużyciami (art. 6 ust. 1 lit. f). Możesz się temu sprzeciwić i wyłączyć zliczanie na stronie o plikach cookie.',
          'Nie używamy danych do marketingu, nie sprzedajemy ich i nie przekazujemy reklamodawcom.',
        ],
      },
      {
        heading: 'Kto przetwarza dane dla nas?',
        paragraphs: [
          'Kilka firm hostuje lub przesyła dane dla nas jako podmioty przetwarzające, na podstawie umów powierzenia. Żadna z nich nie może używać danych do własnych celów.',
        ],
        bullets: [
          'Vercel Inc. (USA): hostuje stronę i obsługuje usługę zapytań. Widzi logi techniczne i zapytania w tranzycie.',
          'Resend Inc. (USA): dostarcza Twoje zapytanie do nas jako e-mail. Otrzymuje imię i nazwisko, dane kontaktowe i wiadomość.',
          'Google LLC (USA): skrzynka firmowa jest w Gmailu, więc zapytania i e-maile od Ciebie są tam przechowywane.',
          'Supabase Inc. (USA): baza danych strony, w której zapytania i zliczanie wizyt są przechowywane dla panelu administracyjnego, jeśli jest podłączona.',
          'Anthropic PBC (USA): tłumaczy artykuły, które piszemy w panelu, między językami. Otrzymuje tylko tekst artykułów, nigdy dane odwiedzających.',
          'Meta Platforms i WhatsApp: tylko jeśli sam zdecydujesz się tam z nami skontaktować. Wtedy tę rozmowę regulują ich warunki.',
        ],
      },
      {
        heading: 'Przekazywanie poza EOG',
        paragraphs: [
          'Wymienione wyżej podmioty to firmy amerykańskie. Przekazywanie danych do nich opiera się na decyzji Komisji Europejskiej stwierdzającej odpowiedni stopień ochrony w ramach EU-US Data Privacy Framework, gdy dana firma jest w nim certyfikowana, a w pozostałych przypadkach na standardowych klauzulach umownych Komisji zgodnie z art. 46 RODO. Kopię klauzul można otrzymać na żądanie.',
        ],
      },
      {
        heading: 'Okres przechowywania',
        bullets: [
          'Zapytania, które nie prowadzą do zlecenia: usuwane najpóźniej dwanaście miesięcy po ostatnim kontakcie.',
          'Wyceny, umowy i faktury: przechowywane przez siedem lat od końca roku obrotowego, jak wymaga ustawa o rachunkowości.',
          'Zliczanie wizyt: wpisy przechowywane najwyżej 24 miesiące. Nie zawierają niczego, co Cię identyfikuje.',
          'Logi dostawcy hostingu: według jego zasad, zwykle od kilku dni do kilku tygodni.',
        ],
      },
      {
        heading: 'Pliki cookie i pamięć przeglądarki',
        paragraphs: [
          'Strona nie używa plików cookie ani zewnętrznej analityki i skryptów reklamowych. Zapisuje w Twojej przeglądarce kilka elementów technicznych, wymienionych jeden po drugim na stronie o plikach cookie.',
        ],
        link: { key: 'cookies', label: 'Pliki cookie i pamięć przeglądarki' },
      },
      {
        heading: 'Twoje prawa',
        paragraphs: ['Zgodnie z przepisami o ochronie danych masz prawo:'],
        bullets: [
          'dostępu do danych osobowych, które przetwarzamy na Twój temat,',
          'sprostowania nieprawidłowych lub niekompletnych danych,',
          'usunięcia danych,',
          'ograniczenia przetwarzania i sprzeciwu wobec przetwarzania opartego na prawnie uzasadnionym interesie,',
          'otrzymania własnych danych w formie nadającej się do odczytu maszynowego,',
          'wycofania zgody, gdy przetwarzanie opiera się na zgodzie.',
        ],
      },
      {
        heading: 'Jak z nich skorzystać',
        paragraphs: [
          'Wnioski wysyłaj na expertparket2024@gmail.com. Odpowiadamy w ciągu miesiąca. Możesz też złożyć skargę do islandzkiego organu ochrony danych Persónuvernd, Rauðarárstígur 10, 105 Reykjavík, personuvernd.is, lub do organu nadzorczego w swoim kraju EOG.',
        ],
      },
      {
        heading: 'Bezpieczeństwo',
        paragraphs: [
          'Cała komunikacja ze stroną jest szyfrowana protokołem TLS. Strona stosuje rygorystyczną politykę bezpieczeństwa (Content Security Policy i inne nagłówki), która zabrania skryptów podmiotów trzecich, formularz jest chroniony przed automatycznymi wysyłkami, a panel administracyjny wymaga logowania. Zbieramy tak mało, jak się da.',
        ],
      },
      {
        heading: 'Zdjęcia w serwisie',
        paragraphs: [
          'Część zdjęć w serwisie przedstawia prace firmy Expert Parket og Mál ehf. Pokazują one pomieszczenia, w których pracowaliśmy, a na kilku ujęciach nas samych przy pracy. Pozostałe zdjęcia, na stronie głównej i w katalogu, mają charakter poglądowy: pokazują gatunki drewna i wzory układania, a nie konkretne nasze realizacje. Żadne zdjęcie w serwisie nie pokazuje adresu ani osoby spoza firmy.',
        ],
      },
      {
        heading: 'Zmiany polityki',
        paragraphs: [
          'Aktualizujemy tę politykę, gdy zmienia się przetwarzanie lub funkcjonalność strony. Najnowsza wersja jest zawsze publikowana tutaj z datą ostatniej aktualizacji.',
        ],
      },
    ],
  },
}
