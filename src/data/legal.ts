import type { Lang, RouteKey } from '@/i18n/config'

/**
 * The legal pages: terms, cookies and the right of withdrawal. The privacy
 * policy lives in privacy.ts and uses the same shape.
 *
 * Icelandic is the version that binds. Lög nr. 44/2026, 14. gr., requires the
 * general terms of a trader serving consumers in Iceland to be in Icelandic,
 * and lög nr. 16/2016, 5. gr., requires the pre-contract information to be in
 * Icelandic when the marketing is. English and Polish are faithful
 * translations for the visitor's convenience and say so.
 *
 * The facts these pages state were checked against the statutes on
 * althingi.is on 8 September 2026: nr. 16/2016 (neytendasamningar),
 * nr. 42/2000 (þjónustukaup), nr. 44/2026 (viðskiptahættir), nr. 30/2002
 * (rafræn viðskipti), nr. 70/2022 (fjarskipti, 88. gr.) and nr. 90/2018
 * (persónuvernd). The company details come from fyrirtækjaskrá.
 *
 * House rules apply here as everywhere: no dashes, ranges with "til"/"to"/"do".
 */
export type LegalSection = {
  heading: string
  paragraphs?: string[]
  bullets?: string[]
  /** A boxed block of lines, used for the standard withdrawal form. */
  block?: string[]
  /** A link to another page of the site, printed after the text. */
  link?: { key: RouteKey; label: string }
  /** An interactive control rendered by the page, by name. */
  control?: 'optout'
}

export type LegalContent = {
  seo: { title: string; description: string }
  /** Display title pre-split into LineReveal lines. */
  titleLines: string[]
  lead: string
  updated: string
  sections: LegalSection[]
}

const UPDATED: Record<Lang, string> = {
  is: 'Síðast uppfært: 8. september 2026',
  en: 'Last updated: 8 September 2026',
  pl: 'Ostatnia aktualizacja: 8 września 2026',
}

/* ================================ TERMS ================================= */

export const terms: Record<Lang, LegalContent> = {
  is: {
    seo: {
      title: 'Skilmálar | Expert Parket og Mál',
      description:
        'Almennir skilmálar Expert Parket og Mál ehf. fyrir parketlögn, parketslípun og málun: tilboð, verð, framkvæmd, gallar, ábyrgð og kvartanir.',
    },
    titleLines: ['Skilmálar'],
    lead: 'Hér eru skilmálarnir sem gilda um þjónustu Expert Parket og Mál ehf. við neytendur. Þeir eru skrifaðir á mannamáli og taka ekkert af þeim réttindum sem lög veita þér.',
    updated: UPDATED.is,
    sections: [
      {
        heading: 'Fyrirtækið',
        paragraphs: ['Þjónustan er veitt af:'],
        bullets: [
          'Expert Parket og Mál ehf.',
          'Kennitala 500123-1250',
          'Virðisaukaskattsnúmer 159068',
          'Álfholti 10, 220 Hafnarfjörður',
          'Sími 785 7079, netfang expertparket2024@gmail.com',
          'Skráð í fyrirtækjaskrá Skattsins, atvinnugreinaflokkun ÍSAT 43.33.0 og 43.99.0',
        ],
      },
      {
        heading: 'Gildissvið',
        paragraphs: [
          'Skilmálarnir gilda um alla þjónustu sem fyrirtækið veitir neytendum. Þeir eru hluti af hverjum samningi ásamt tilboðinu sjálfu. Sé misræmi milli íslensku útgáfunnar og þýðinga á ensku eða pólsku gildir íslenska útgáfan.',
        ],
      },
      {
        heading: 'Þjónustan',
        paragraphs: [
          'Við leggjum parket, slípum og meðhöndlum gólf og málum innanhúss á höfuðborgarsvæðinu. Efni, svo sem parket, lökk og olíur, koma frá framleiðendum og söluaðilum sem við vinnum með. Um efnið sjálft gilda ábyrgðarskilmálar framleiðanda til viðbótar við réttindi þín samkvæmt lögum.',
        ],
      },
      {
        heading: 'Skoðun og tilboð',
        bullets: [
          'Skoðun á staðnum og tilboðsgerð kostar ekkert og skuldbindur þig ekki.',
          'Tilboð er skriflegt og gildir í 30 daga frá dagsetningu þess nema annað sé tekið fram.',
          'Öll verð til neytenda eru með virðisaukaskatti.',
          'Tilboðið byggist á því sem sést við skoðun. Komi eitthvað ófyrirséð í ljós þegar verkið er hafið, svo sem raki í undirlagi, skemmt gólfefni undir eldra gólfi eða ójafna sem þarf að flota, stöðvum við þann verkþátt, sýnum þér málið og semjum um framhaldið skriflega áður en lengra er haldið.',
        ],
      },
      {
        heading: 'Samningur',
        paragraphs: [
          'Samningur kemst á þegar þú samþykkir tilboðið, hvort sem það er með undirskrift, í tölvupósti eða í skilaboðum. Þú færð staðfestingu á samningnum á varanlegum miðli, oftast í tölvupósti, ásamt þessum skilmálum og upplýsingum um rétt þinn til að falla frá samningnum.',
        ],
      },
      {
        heading: 'Réttur til að falla frá samningi',
        paragraphs: [
          'Sé samningurinn gerður heima hjá þér eða í fjarsölu, til dæmis í síma eða tölvupósti, hefur þú fjórtán daga frest til að falla frá honum án þess að gefa upp ástæðu, samkvæmt lögum um neytendasamninga nr. 16/2016. Fresturinn, tilkynningin, staðlað eyðublað og það sem gerist ef verk er hafið innan frestsins er útskýrt á sérstakri síðu.',
        ],
        link: { key: 'withdrawal', label: 'Réttur til að falla frá samningi' },
      },
      {
        heading: 'Framkvæmd verks',
        bullets: [
          'Umsaminn dagur stendur. Tefjist verk á undan færðu símtal með fyrirvara.',
          'Þú sérð til þess að aðgangur sé að rýminu, rafmagni og vatni og að lausir munir séu fjarlægðir úr rýminu nema um annað sé samið.',
          'Við verjum það sem eftir stendur í rýminu, tengjum vélar við ryksog og þrífum eftir okkur í lok hvers dags.',
          'Lökk og olíur þurfa þurrktíma. Við segjum þér hvenær má ganga á gólfið og hvenær má færa húsgögn inn aftur. Endingin veltur á því að farið sé eftir því.',
        ],
      },
      {
        heading: 'Verð og greiðsla',
        bullets: [
          'Verðið er það sem stendur í tilboðinu. Viðbótarverk eru aðeins unnin gegn skriflegu samþykki þínu og verð þeirra liggur fyrir áður en þau hefjast.',
          'Greitt er samkvæmt reikningi við verklok nema um annað sé samið skriflega. Gjalddagi kemur fram á reikningnum.',
          'Í stærri verkum getur verið samið um innborgun fyrir efni. Það kemur þá fram í tilboðinu.',
          'Dráttarvextir reiknast frá gjalddaga samkvæmt lögum um vexti og verðtryggingu nr. 38/2001.',
        ],
      },
      {
        heading: 'Gallar og ábyrgð',
        paragraphs: [
          'Um þjónustuna gilda lög um þjónustukaup nr. 42/2000. Sé þjónustan gölluð átt þú rétt á að fá úr því bætt, á afslætti eða á að rifta samningnum eftir því sem lögin segja til um, og eftir atvikum skaðabótum.',
        ],
        bullets: [
          'Láttu okkur vita eins fljótt og hægt er eftir að þú verður galla var. Kvörtunarfrestur samkvæmt lögum er tvö ár frá því verkinu var skilað.',
          'Ábyrgðaryfirlýsing okkar: komi fram galli sem rekja má til vinnu okkar innan tveggja ára frá verklokum lögum við hann þér að kostnaðarlausu. Þessi ábyrgð bætist við réttindi þín samkvæmt lögum og skerðir þau ekki. Ábyrgðaraðili er Expert Parket og Mál ehf., Álfholti 10, 220 Hafnarfjörður. Til að nýta ábyrgðina hefur þú samband í síma 785 7079 eða á expertparket2024@gmail.com, lýsir gallanum og við komum og skoðum.',
          'Ábyrgðin nær ekki til eðlilegs slits, skemmda af völdum raka eða leka úr húsinu sjálfu, atriða í undirlagi sem við bentum á fyrir verk og þú kaust að láta ekki laga, né tjóns sem aðrir valda eftir að verkinu var skilað.',
          'Um efni gildir ábyrgð framleiðanda til viðbótar.',
        ],
      },
      {
        heading: 'Skaðabætur',
        paragraphs: [
          'Við berum ábyrgð á tjóni sem rekja má til gáleysis okkar samkvæmt almennum reglum skaðabótaréttar og lögum um þjónustukaup.',
        ],
      },
      {
        heading: 'Kvartanir og úrlausn ágreinings',
        paragraphs: [
          'Sértu ósátt við eitthvað hefur þú fyrst samband við okkur í síma 785 7079 eða á expertparket2024@gmail.com. Við svörum innan fimm virkra daga og reynum að leysa málið beint.',
          'Náist ekki niðurstaða getur þú vísað málinu til kærunefndar vöru- og þjónustukaupa (kvth.is), óháðs úrskurðaraðila á sviði neytendamála samkvæmt lögum nr. 81/2019. Upplýsingar um málsmeðferð og kostnað eru á vef nefndarinnar.',
        ],
      },
      {
        heading: 'Persónuvernd',
        paragraphs: ['Um meðferð persónuupplýsinga gildir persónuverndarstefna okkar.'],
        link: { key: 'privacy', label: 'Persónuverndarstefna' },
      },
      {
        heading: 'Lög og varnarþing',
        paragraphs: [
          'Íslensk lög gilda um samninginn. Rísi mál sem ekki tekst að leysa má reka það fyrir Héraðsdómi Reykjaness, án þess að það skerði rétt neytanda til að höfða mál í sinni heimilisþinghá.',
        ],
      },
      {
        heading: 'Breytingar',
        paragraphs: [
          'Við kunnum að uppfæra skilmálana. Sú útgáfa sem var í gildi þegar samningur var gerður gildir um þann samning. Nýjasta útgáfan er ávallt hér ásamt dagsetningu síðustu uppfærslu.',
        ],
      },
    ],
  },
  en: {
    seo: {
      title: 'Terms of service | Expert Parket og Mál',
      description:
        'General terms of Expert Parket og Mál ehf. for parquet laying, floor sanding and painting: quotes, prices, the work itself, defects, guarantee and complaints.',
    },
    titleLines: ['Terms of service'],
    lead: 'These are the terms that apply to the services Expert Parket og Mál ehf. provides to consumers. They are written in plain language and take away none of the rights the law gives you. This is a translation; the Icelandic version is the one that binds.',
    updated: UPDATED.en,
    sections: [
      {
        heading: 'The company',
        paragraphs: ['The services are provided by:'],
        bullets: [
          'Expert Parket og Mál ehf.',
          'Icelandic ID number (kennitala) 500123-1250',
          'VAT number 159068',
          'Álfholti 10, 220 Hafnarfjörður, Iceland',
          'Phone 785 7079, email expertparket2024@gmail.com',
          'Entered in the Icelandic company register (fyrirtækjaskrá), activity codes ÍSAT 43.33.0 and 43.99.0',
        ],
      },
      {
        heading: 'Scope',
        paragraphs: [
          'These terms apply to every service the company provides to consumers. Together with the written quote they form the contract. Where this translation differs from the Icelandic version, the Icelandic version prevails.',
        ],
      },
      {
        heading: 'The services',
        paragraphs: [
          'We lay parquet, sand and finish floors, and paint interiors across the Reykjavík capital region. Materials such as parquet, lacquers and oils come from the manufacturers and suppliers we work with. The manufacturer\'s own warranty applies to the material itself, in addition to your statutory rights.',
        ],
      },
      {
        heading: 'Site visit and quote',
        bullets: [
          'The site visit and the quote are free and do not commit you to anything.',
          'The quote is in writing and is valid for 30 days from its date unless it says otherwise.',
          'All prices to consumers include VAT.',
          'The quote is based on what can be seen at the visit. If something unforeseen comes to light once work has started, such as moisture in the subfloor, damaged boards under an older floor or unevenness that needs levelling, we stop that part of the job, show you the problem and agree the way forward in writing before continuing.',
        ],
      },
      {
        heading: 'The contract',
        paragraphs: [
          'A contract is formed when you accept the quote, whether by signature, by email or by message. You receive a confirmation of the contract on a durable medium, usually by email, together with these terms and information about your right of withdrawal.',
        ],
      },
      {
        heading: 'Right of withdrawal',
        paragraphs: [
          'If the contract is made at your home or at a distance, for example by phone or email, you have fourteen days to withdraw from it without giving a reason, under the Icelandic Consumer Contracts Act No. 16/2016. The period, the notice, the standard form and what happens if work starts within the period are explained on a separate page.',
        ],
        link: { key: 'withdrawal', label: 'Right of withdrawal' },
      },
      {
        heading: 'Carrying out the work',
        bullets: [
          'The agreed date holds. If a previous job runs over, you get a phone call in good time.',
          'You make sure we have access to the room, to electricity and to water, and that loose items are moved out of the room unless agreed otherwise.',
          'We protect what stays in the room, connect the machines to dust extraction and clean up at the end of every day.',
          'Lacquers and oils need drying time. We tell you when the floor can be walked on and when furniture can come back in. The life of the floor depends on following that.',
        ],
      },
      {
        heading: 'Price and payment',
        bullets: [
          'The price is the one in the quote. Additional work is only carried out with your written approval, and its price is set before it starts.',
          'Payment is by invoice on completion unless agreed otherwise in writing. The due date is stated on the invoice.',
          'On larger jobs a deposit for materials may be agreed. If so, the quote says so.',
          'Late payment interest accrues from the due date under the Icelandic Interest Act No. 38/2001.',
        ],
      },
      {
        heading: 'Defects and guarantee',
        paragraphs: [
          'The Icelandic Service Purchases Act No. 42/2000 applies to the services. If the service is defective you are entitled to have it remedied, to a price reduction or to cancel the contract as the Act provides, and where applicable to damages.',
        ],
        bullets: [
          'Tell us as soon as you can after noticing a defect. The statutory complaint period is two years from the day the work was handed over.',
          'Our guarantee statement: if a defect attributable to our work appears within two years of completion, we put it right at no cost to you. This guarantee is in addition to your statutory rights and does not limit them. The guarantor is Expert Parket og Mál ehf., Álfholti 10, 220 Hafnarfjörður. To use the guarantee, contact us on 785 7079 or at expertparket2024@gmail.com, describe the defect, and we come and inspect.',
          'The guarantee does not cover normal wear, damage caused by moisture or leaks from the building itself, subfloor issues we pointed out before the job that you chose not to have fixed, or damage caused by others after handover.',
          'The manufacturer\'s warranty applies to materials in addition.',
        ],
      },
      {
        heading: 'Liability',
        paragraphs: [
          'We are liable for loss caused by our negligence under the general rules of Icelandic tort law and the Service Purchases Act.',
        ],
      },
      {
        heading: 'Complaints and disputes',
        paragraphs: [
          'If you are unhappy with anything, contact us first on 785 7079 or at expertparket2024@gmail.com. We reply within five working days and try to resolve it directly.',
          'If we cannot reach an agreement you can refer the matter to the Icelandic Consumer Complaints Committee for goods and services, kærunefnd vöru- og þjónustukaupa (kvth.is), an independent dispute resolution body under Act No. 81/2019. Procedure and costs are described on its website.',
        ],
      },
      {
        heading: 'Privacy',
        paragraphs: ['Our privacy policy governs how personal data is handled.'],
        link: { key: 'privacy', label: 'Privacy policy' },
      },
      {
        heading: 'Governing law and venue',
        paragraphs: [
          'Icelandic law governs the contract. A dispute that cannot be resolved may be brought before the District Court of Reykjanes, without prejudice to a consumer\'s right to sue in their home jurisdiction.',
        ],
      },
      {
        heading: 'Changes',
        paragraphs: [
          'We may update these terms. The version in force when a contract was made applies to that contract. The latest version is always here with the date of the last update.',
        ],
      },
    ],
  },
  pl: {
    seo: {
      title: 'Regulamin | Expert Parket og Mál',
      description:
        'Ogólne warunki Expert Parket og Mál ehf. dla układania parkietu, cyklinowania i malowania: wycena, ceny, wykonanie, wady, gwarancja i reklamacje.',
    },
    titleLines: ['Regulamin'],
    lead: 'Oto warunki, które obowiązują dla usług świadczonych konsumentom przez Expert Parket og Mál ehf. Są napisane prostym językiem i nie odbierają żadnych praw, które daje Ci ustawa. To tłumaczenie; wiążąca jest wersja islandzka.',
    updated: UPDATED.pl,
    sections: [
      {
        heading: 'Firma',
        paragraphs: ['Usługi świadczy:'],
        bullets: [
          'Expert Parket og Mál ehf.',
          'Islandzki numer identyfikacyjny (kennitala) 500123-1250',
          'Numer VAT 159068',
          'Álfholti 10, 220 Hafnarfjörður, Islandia',
          'Telefon 785 7079, e-mail expertparket2024@gmail.com',
          'Wpisana do islandzkiego rejestru firm (fyrirtækjaskrá), kody działalności ÍSAT 43.33.0 i 43.99.0',
        ],
      },
      {
        heading: 'Zakres',
        paragraphs: [
          'Warunki dotyczą każdej usługi, którą firma świadczy konsumentom. Razem z pisemną wyceną tworzą umowę. Jeśli to tłumaczenie różni się od wersji islandzkiej, obowiązuje wersja islandzka.',
        ],
      },
      {
        heading: 'Usługi',
        paragraphs: [
          'Układamy parkiet, cyklinujemy i wykańczamy podłogi oraz malujemy wnętrza w regionie stołecznym Reykjavíku. Materiały, takie jak parkiet, lakiery i oleje, pochodzą od producentów i dostawców, z którymi współpracujemy. Do samego materiału stosuje się gwarancja producenta, niezależnie od Twoich praw ustawowych.',
        ],
      },
      {
        heading: 'Oględziny i wycena',
        bullets: [
          'Oględziny na miejscu i wycena są bezpłatne i do niczego nie zobowiązują.',
          'Wycena jest pisemna i ważna przez 30 dni od jej daty, chyba że zaznaczono inaczej.',
          'Wszystkie ceny dla konsumentów zawierają VAT.',
          'Wycena opiera się na tym, co widać podczas oględzin. Jeśli po rozpoczęciu prac wyjdzie na jaw coś nieprzewidzianego, na przykład wilgoć w podłożu, uszkodzone deski pod starszą podłogą albo nierówności wymagające wylewki, przerywamy tę część prac, pokazujemy Ci problem i uzgadniamy dalsze kroki na piśmie, zanim ruszymy dalej.',
        ],
      },
      {
        heading: 'Umowa',
        paragraphs: [
          'Umowa zostaje zawarta, gdy akceptujesz wycenę, czy to podpisem, e-mailem, czy wiadomością. Otrzymujesz potwierdzenie umowy na trwałym nośniku, zwykle e-mailem, razem z tym regulaminem i informacją o prawie odstąpienia od umowy.',
        ],
      },
      {
        heading: 'Prawo odstąpienia od umowy',
        paragraphs: [
          'Jeśli umowa została zawarta u Ciebie w domu albo na odległość, na przykład telefonicznie lub e-mailem, masz czternaście dni na odstąpienie od niej bez podania przyczyny, zgodnie z islandzką ustawą o umowach konsumenckich nr 16/2016. Termin, sposób zawiadomienia, wzór formularza i to, co dzieje się, gdy prace rozpoczną się w tym okresie, opisane są na osobnej stronie.',
        ],
        link: { key: 'withdrawal', label: 'Prawo odstąpienia od umowy' },
      },
      {
        heading: 'Wykonanie prac',
        bullets: [
          'Uzgodniony termin obowiązuje. Jeśli poprzednie zlecenie się przeciągnie, dostaniesz telefon z wyprzedzeniem.',
          'Zapewniasz dostęp do pomieszczenia, prądu i wody oraz usuwasz z pomieszczenia luźne przedmioty, chyba że uzgodniono inaczej.',
          'Zabezpieczamy to, co zostaje w pomieszczeniu, podłączamy maszyny do odciągu pyłu i sprzątamy po sobie na koniec każdego dnia.',
          'Lakiery i oleje potrzebują czasu schnięcia. Mówimy Ci, kiedy można chodzić po podłodze i kiedy można wnieść meble. Trwałość podłogi zależy od przestrzegania tego.',
        ],
      },
      {
        heading: 'Cena i płatność',
        bullets: [
          'Cena to ta z wyceny. Prace dodatkowe wykonujemy tylko za Twoją pisemną zgodą, a ich cena jest ustalona przed rozpoczęciem.',
          'Płatność następuje na podstawie faktury po zakończeniu prac, chyba że uzgodniono inaczej na piśmie. Termin płatności podany jest na fakturze.',
          'Przy większych zleceniach można uzgodnić zaliczkę na materiały. Wtedy jest to zapisane w wycenie.',
          'Odsetki za zwłokę naliczane są od terminu płatności zgodnie z islandzką ustawą o odsetkach nr 38/2001.',
        ],
      },
      {
        heading: 'Wady i gwarancja',
        paragraphs: [
          'Do usług stosuje się islandzka ustawa o zakupie usług nr 42/2000. Jeśli usługa jest wadliwa, masz prawo do usunięcia wady, do obniżenia ceny albo do odstąpienia od umowy na zasadach ustawy, a w odpowiednich przypadkach do odszkodowania.',
        ],
        bullets: [
          'Poinformuj nas jak najszybciej po zauważeniu wady. Ustawowy termin na reklamację to dwa lata od dnia odbioru prac.',
          'Nasze oświadczenie gwarancyjne: jeśli w ciągu dwóch lat od zakończenia prac pojawi się wada wynikająca z naszej pracy, usuwamy ją bez kosztów dla Ciebie. Gwarancja ta jest dodatkiem do Twoich praw ustawowych i ich nie ogranicza. Gwarantem jest Expert Parket og Mál ehf., Álfholti 10, 220 Hafnarfjörður. Aby skorzystać z gwarancji, skontaktuj się z nami pod 785 7079 lub expertparket2024@gmail.com, opisz wadę, a my przyjedziemy i sprawdzimy.',
          'Gwarancja nie obejmuje normalnego zużycia, uszkodzeń spowodowanych wilgocią lub przeciekami z samego budynku, problemów z podłożem, na które zwróciliśmy uwagę przed pracami, a których nie chciałeś naprawić, ani szkód wyrządzonych przez innych po odbiorze.',
          'Do materiałów dodatkowo stosuje się gwarancja producenta.',
        ],
      },
      {
        heading: 'Odpowiedzialność',
        paragraphs: [
          'Odpowiadamy za szkody wynikające z naszego zaniedbania zgodnie z ogólnymi zasadami islandzkiego prawa odszkodowawczego i ustawą o zakupie usług.',
        ],
      },
      {
        heading: 'Reklamacje i spory',
        paragraphs: [
          'Jeśli coś Ci nie odpowiada, najpierw skontaktuj się z nami pod 785 7079 lub expertparket2024@gmail.com. Odpowiadamy w ciągu pięciu dni roboczych i staramy się rozwiązać sprawę bezpośrednio.',
          'Jeśli nie dojdziemy do porozumienia, możesz skierować sprawę do islandzkiej komisji ds. reklamacji towarów i usług, kærunefnd vöru- og þjónustukaupa (kvth.is), niezależnego organu rozstrzygania sporów na podstawie ustawy nr 81/2019. Procedura i koszty opisane są na jej stronie.',
        ],
      },
      {
        heading: 'Prywatność',
        paragraphs: ['Sposób przetwarzania danych osobowych określa nasza polityka prywatności.'],
        link: { key: 'privacy', label: 'Polityka prywatności' },
      },
      {
        heading: 'Prawo właściwe i sąd',
        paragraphs: [
          'Umowę reguluje prawo islandzkie. Spór, którego nie uda się rozwiązać, można wnieść do Sądu Rejonowego Reykjanes, bez uszczerbku dla prawa konsumenta do wniesienia sprawy w sądzie właściwym dla jego miejsca zamieszkania.',
        ],
      },
      {
        heading: 'Zmiany',
        paragraphs: [
          'Możemy aktualizować regulamin. Do danej umowy stosuje się wersja obowiązująca w chwili jej zawarcia. Najnowsza wersja jest zawsze tutaj, z datą ostatniej aktualizacji.',
        ],
      },
    ],
  },
}

/* =============================== COOKIES ================================ */

export const cookies: Record<Lang, LegalContent> = {
  is: {
    seo: {
      title: 'Vefkökur og geymsla í vafra | Expert Parket og Mál',
      description:
        'Þessi vefur notar engar vafrakökur og engin greiningartæki þriðju aðila. Hér er útskýrt nákvæmlega hvað er geymt í vafranum þínum og hvers vegna ekki þarf að biðja um samþykki.',
    },
    titleLines: ['Vefkökur'],
    lead: 'Stutta svarið: vefurinn notar engar vafrakökur, engin greiningar- eða auglýsingaforrit þriðju aðila og biður þess vegna ekki um samþykki. Hér er langa svarið, svo þú sjáir sjálf hvað er geymt í vafranum þínum.',
    updated: UPDATED.is,
    sections: [
      {
        heading: 'Engar vafrakökur',
        paragraphs: [
          'Vefurinn setur enga vafraköku (e. cookie) í vafrann þinn, hvorki sína eigin né frá öðrum. Hér eru engin Google Analytics, engir Facebook-pixlar, engar auglýsingar og engar leturgerðir sóttar frá þriðja aðila. Öryggisstefna vefsins (Content Security Policy) bannar vafranum beinlínis að hlaða forritum annars staðar frá.',
        ],
      },
      {
        heading: 'Það sem er geymt í vafranum',
        paragraphs: [
          'Vefurinn notar hins vegar geymslu vafrans sjálfs (sessionStorage og localStorage) fyrir fjögur atriði. Ekkert þeirra ber kennsl á þig og ekkert þeirra fer til þriðja aðila.',
        ],
        bullets: [
          'epm.session (sessionStorage): tilviljunarkennt númer sem er búið til þegar þú opnar vefinn í nýjum flipa og eyðist þegar þú lokar honum. Það er notað til að telja heimsóknina einu sinni en ekki á hverri síðu.',
          'epm.ref (sessionStorage): kóði kynningartengils, ef þú komst inn á vefinn í gegnum slíkan tengil. Eyðist með flipanum.',
          'epm.optout (localStorage): er aðeins til ef þú slekkur á heimsóknartalningu hér að neðan. Það geymir stillinguna þar til þú hreinsar gögn vefsins úr vafranum.',
          'epm.admin (localStorage): aðeins í vafra umsjónarmanns vefsins eftir innskráningu í stjórnborðið. Gestir fá þetta aldrei.',
        ],
      },
      {
        heading: 'Heimsóknartalningin',
        paragraphs: [
          'Vefurinn telur heimsóknir sjálfur, án þriðja aðila. Skráð er slóð síðunnar, tungumál, hvort tækið er sími, spjaldtölva eða tölva, lén þeirrar síðu sem vísaði þér hingað ef einhver var, og kóði kynningartengils. Ekki er skráð IP-tala, ekki fingrafar tækis og ekkert sem tengir heimsóknina við þig eða fylgir þér á milli vefja.',
        ],
      },
      {
        heading: 'Hvers vegna ekki er beðið um samþykki',
        paragraphs: [
          'Samkvæmt 88. gr. fjarskiptalaga nr. 70/2022 er tæknileg geymsla upplýsinga í tæki notanda heimil þegar hún er í lögmætum tilgangi og með vitund notandans. Geymslan sem lýst er hér að ofan er af því tagi: hún er tæknileg, hún þjónar rekstri vefsins og þessi síða er til þess að þú vitir af henni. Sé vafrakökum eða greiningartækjum þriðju aðila bætt við síðar verður beðið um samþykki áður og þessi síða uppfærð.',
        ],
      },
      {
        heading: 'Slökkva á talningu',
        paragraphs: [
          'Þú getur slökkt á heimsóknartalningu fyrir vafrann þinn hér. Stillingin er geymd í localStorage undir epm.optout og gildir þar til þú kveikir aftur eða hreinsar gögn vefsins.',
        ],
        control: 'optout',
      },
      {
        heading: 'Tenglar á aðra vefi',
        paragraphs: [
          'Á vefnum eru tenglar á Facebook og WhatsApp. Ekkert er sótt frá þeim fyrr en þú smellir á tengilinn, og þá gilda skilmálar og vafrakökur þeirra vefja, ekki okkar.',
        ],
      },
      {
        heading: 'Breytingar',
        paragraphs: [
          'Breytist það sem vefurinn geymir í vafranum verður þessi síða uppfærð og dagsetningin með.',
        ],
      },
    ],
  },
  en: {
    seo: {
      title: 'Cookies and browser storage | Expert Parket og Mál',
      description:
        'This website uses no cookies and no third-party analytics. Here is exactly what is stored in your browser and why no consent banner is needed.',
    },
    titleLines: ['Cookies'],
    lead: 'The short answer: this website uses no cookies, no third-party analytics or advertising scripts, and therefore does not ask for consent. Here is the long answer, so you can see for yourself what is stored in your browser.',
    updated: UPDATED.en,
    sections: [
      {
        heading: 'No cookies',
        paragraphs: [
          'The website sets no cookie in your browser, neither its own nor anyone else\'s. There is no Google Analytics, no Facebook pixel, no advertising and no fonts fetched from a third party. The site\'s security policy (Content Security Policy) explicitly forbids the browser from loading scripts from anywhere else.',
        ],
      },
      {
        heading: 'What is stored in the browser',
        paragraphs: [
          'The website does use the browser\'s own storage (sessionStorage and localStorage) for four things. None of them identifies you and none of them goes to a third party.',
        ],
        bullets: [
          'epm.session (sessionStorage): a random number created when you open the site in a new tab and deleted when you close it. It is used to count the visit once rather than on every page.',
          'epm.ref (sessionStorage): the code of a campaign link, if you arrived through one. Deleted with the tab.',
          'epm.optout (localStorage): only exists if you switch visit counting off below. It keeps that setting until you clear the site\'s data from your browser.',
          'epm.admin (localStorage): only in the browser of the site\'s administrator after signing in to the admin panel. Visitors never get this.',
        ],
      },
      {
        heading: 'The visit count',
        paragraphs: [
          'The website counts visits itself, without a third party. It records the page path, the language, whether the device is a phone, tablet or computer, the domain of the site that referred you here if any, and a campaign code. It does not record your IP address, a device fingerprint or anything that ties the visit to you or follows you across websites.',
        ],
      },
      {
        heading: 'Why no consent is asked for',
        paragraphs: [
          'Under Article 88 of the Icelandic Electronic Communications Act No. 70/2022, technical storage of information on a user\'s device is permitted when it serves a legitimate purpose and the user is aware of it. The storage described above is of that kind: it is technical, it serves the running of the site, and this page exists so that you know about it. If third-party cookies or analytics are ever added, consent will be asked for first and this page updated.',
        ],
      },
      {
        heading: 'Switch counting off',
        paragraphs: [
          'You can switch visit counting off for your browser here. The setting is kept in localStorage under epm.optout and holds until you switch it back on or clear the site\'s data.',
        ],
        control: 'optout',
      },
      {
        heading: 'Links to other websites',
        paragraphs: [
          'The site links to Facebook and WhatsApp. Nothing is fetched from them until you click the link, and from then on their terms and cookies apply, not ours.',
        ],
      },
      {
        heading: 'Changes',
        paragraphs: ['If what the site stores in the browser changes, this page and its date are updated.'],
      },
    ],
  },
  pl: {
    seo: {
      title: 'Pliki cookie i pamięć przeglądarki | Expert Parket og Mál',
      description:
        'Ta strona nie używa plików cookie ani zewnętrznej analityki. Tu jest dokładnie opisane, co jest zapisywane w Twojej przeglądarce i dlaczego nie potrzeba baneru zgody.',
    },
    titleLines: ['Pliki cookie'],
    lead: 'Krótka odpowiedź: ta strona nie używa plików cookie, zewnętrznej analityki ani skryptów reklamowych, więc nie prosi o zgodę. Oto długa odpowiedź, żebyś sam zobaczył, co jest zapisywane w Twojej przeglądarce.',
    updated: UPDATED.pl,
    sections: [
      {
        heading: 'Brak plików cookie',
        paragraphs: [
          'Strona nie zapisuje w Twojej przeglądarce żadnego pliku cookie, ani własnego, ani cudzego. Nie ma tu Google Analytics, piksela Facebooka, reklam ani czcionek pobieranych od podmiotów trzecich. Polityka bezpieczeństwa strony (Content Security Policy) wprost zabrania przeglądarce ładowania skryptów z innych miejsc.',
        ],
      },
      {
        heading: 'Co jest zapisywane w przeglądarce',
        paragraphs: [
          'Strona korzysta natomiast z własnej pamięci przeglądarki (sessionStorage i localStorage) do czterech rzeczy. Żadna z nich Cię nie identyfikuje i żadna nie trafia do podmiotów trzecich.',
        ],
        bullets: [
          'epm.session (sessionStorage): losowy numer tworzony, gdy otwierasz stronę w nowej karcie, i usuwany, gdy ją zamykasz. Służy do policzenia wizyty raz, a nie na każdej podstronie.',
          'epm.ref (sessionStorage): kod linku kampanii, jeśli przez taki link trafiłeś na stronę. Usuwany razem z kartą.',
          'epm.optout (localStorage): istnieje tylko wtedy, gdy wyłączysz poniżej zliczanie wizyt. Przechowuje to ustawienie, dopóki nie wyczyścisz danych strony w przeglądarce.',
          'epm.admin (localStorage): tylko w przeglądarce administratora strony po zalogowaniu do panelu. Odwiedzający nigdy tego nie dostają.',
        ],
      },
      {
        heading: 'Zliczanie wizyt',
        paragraphs: [
          'Strona sama zlicza wizyty, bez podmiotów trzecich. Zapisuje adres podstrony, język, czy urządzenie to telefon, tablet czy komputer, domenę strony, która Cię tu skierowała, jeśli była, oraz kod kampanii. Nie zapisuje adresu IP, odcisku urządzenia ani niczego, co wiąże wizytę z Tobą lub śledzi Cię między stronami.',
        ],
      },
      {
        heading: 'Dlaczego nie prosimy o zgodę',
        paragraphs: [
          'Zgodnie z art. 88 islandzkiej ustawy o łączności elektronicznej nr 70/2022 techniczne przechowywanie informacji w urządzeniu użytkownika jest dozwolone, gdy służy uzasadnionemu celowi i użytkownik o nim wie. Opisane wyżej przechowywanie jest właśnie takie: jest techniczne, służy działaniu strony, a ta podstrona istnieje po to, żebyś o nim wiedział. Jeśli kiedyś zostaną dodane zewnętrzne pliki cookie lub analityka, najpierw poprosimy o zgodę i zaktualizujemy tę stronę.',
        ],
      },
      {
        heading: 'Wyłącz zliczanie',
        paragraphs: [
          'Możesz tu wyłączyć zliczanie wizyt dla swojej przeglądarki. Ustawienie jest zapisane w localStorage pod epm.optout i obowiązuje, dopóki nie włączysz go ponownie lub nie wyczyścisz danych strony.',
        ],
        control: 'optout',
      },
      {
        heading: 'Linki do innych stron',
        paragraphs: [
          'Strona zawiera linki do Facebooka i WhatsAppa. Nic nie jest z nich pobierane, dopóki nie klikniesz linku, a od tego momentu obowiązują ich warunki i pliki cookie, nie nasze.',
        ],
      },
      {
        heading: 'Zmiany',
        paragraphs: ['Jeśli zmieni się to, co strona zapisuje w przeglądarce, ta podstrona i jej data zostaną zaktualizowane.'],
      },
    ],
  },
}

/* ============================= WITHDRAWAL =============================== */

export const withdrawal: Record<Lang, LegalContent> = {
  is: {
    seo: {
      title: 'Réttur til að falla frá samningi | Expert Parket og Mál',
      description:
        'Fjórtán daga réttur neytenda til að falla frá samningi sem gerður er heima hjá þeim eða í fjarsölu, samkvæmt lögum nr. 16/2016. Frestur, tilkynning, staðlað eyðublað og undantekningar.',
    },
    titleLines: ['Réttur til að falla', 'frá samningi'],
    lead: 'Sé samningur um verk gerður heima hjá þér, í síma eða í tölvupósti hefur þú fjórtán daga til að hætta við, án ástæðu. Hér er hvernig það virkar.',
    updated: UPDATED.is,
    sections: [
      {
        heading: 'Hvenær rétturinn gildir',
        paragraphs: [
          'Samkvæmt lögum um neytendasamninga nr. 16/2016 hefur neytandi rétt til að falla frá samningi sem er gerður utan fastrar starfsstöðvar seljanda, til dæmis heima hjá neytandanum eftir skoðun, og samningi sem er gerður í fjarsölu, til dæmis með því að samþykkja tilboð í síma, tölvupósti eða skilaboðum. Nær öll verk okkar eru samin með öðrum hvorum hætti, svo rétturinn gildir að öllum líkindum um þinn samning.',
        ],
      },
      {
        heading: 'Fresturinn',
        paragraphs: [
          'Fresturinn er fjórtán dagar frá þeim degi sem samningurinn var gerður. Nóg er að senda tilkynninguna áður en fresturinn rennur út.',
          'Hafi þér ekki verið sagt frá þessum rétti áður en samningurinn var gerður lengist fresturinn samkvæmt lögunum um tólf mánuði.',
        ],
      },
      {
        heading: 'Hvernig þú nýtir réttinn',
        bullets: [
          'Sendu okkur ótvíræða tilkynningu um að þú fallir frá samningnum, í tölvupósti á expertparket2024@gmail.com eða bréflega til Expert Parket og Mál ehf., Álfholti 10, 220 Hafnarfjörður.',
          'Þú þarft ekki að gefa upp ástæðu.',
          'Þú getur notað eyðublaðið hér að neðan en þarft þess ekki.',
          'Geymdu afrit af tilkynningunni. Það er neytandans að sýna fram á að hún hafi verið send.',
        ],
      },
      {
        heading: 'Ef verk hefst innan frestsins',
        paragraphs: [
          'Viljir þú að við byrjum áður en fjórtán dagarnir eru liðnir biðjum við þig um ótvíræða beiðni um það á varanlegum miðli, til dæmis í tölvupósti. Fallir þú síðan frá samningnum áður en verkinu er lokið greiðir þú fyrir þann hluta sem þegar hefur verið unninn, í hlutfalli við heildarverðið.',
          'Sé verkinu að fullu lokið samkvæmt þinni beiðni, og þú hafir staðfest að rétturinn falli þá niður, er ekki lengur hægt að falla frá samningnum.',
        ],
      },
      {
        heading: 'Endurgreiðsla',
        paragraphs: [
          'Höfum við tekið við greiðslu endurgreiðum við hana innan fjórtán daga frá því tilkynningin barst, með sama greiðslumáta og þú notaðir nema um annað sé samið, að frádregnu því sem greiða ber fyrir unnið verk samkvæmt liðnum hér á undan.',
        ],
      },
      {
        heading: 'Undantekningar',
        paragraphs: ['Rétturinn nær samkvæmt lögunum ekki til:'],
        bullets: [
          'bráðaviðgerða eða viðhalds sem þú hefur sérstaklega óskað eftir að við komum og sinnum,',
          'efnis sem er sérpantað eða sniðið eftir þínum forskriftum, að því marki sem ekki er hægt að skila því til birgja.',
        ],
      },
      {
        heading: 'Staðlað eyðublað',
        paragraphs: [
          'Fyllið út og sendið eyðublaðið aðeins ef þið óskið eftir að falla frá samningnum.',
        ],
        block: [
          'Til: Expert Parket og Mál ehf., Álfholti 10, 220 Hafnarfjörður, expertparket2024@gmail.com',
          'Ég tilkynni hér með að ég fell frá samningi mínum um kaup á eftirfarandi þjónustu:',
          'Samið þann:',
          'Nafn neytanda:',
          'Heimilisfang neytanda:',
          'Undirskrift neytanda (aðeins ef tilkynnt er á pappír):',
          'Dagsetning:',
        ],
      },
      {
        heading: 'Réttindi vegna galla',
        paragraphs: [
          'Rétturinn til að falla frá samningi er óháður réttindum þínum ef þjónustan reynist gölluð. Um þau gilda lög um þjónustukaup nr. 42/2000 og skilmálar okkar.',
        ],
        link: { key: 'terms', label: 'Skilmálar' },
      },
    ],
  },
  en: {
    seo: {
      title: 'Right of withdrawal | Expert Parket og Mál',
      description:
        'The fourteen-day right of consumers to withdraw from a contract made at their home or at a distance, under Icelandic Act No. 16/2016. Period, notice, standard form and exceptions.',
    },
    titleLines: ['Right of', 'withdrawal'],
    lead: 'If a contract for a job is made at your home, by phone or by email, you have fourteen days to change your mind, without giving a reason. Here is how it works. This is a translation; the Icelandic version binds.',
    updated: UPDATED.en,
    sections: [
      {
        heading: 'When the right applies',
        paragraphs: [
          'Under the Icelandic Consumer Contracts Act No. 16/2016 a consumer may withdraw from a contract made away from the seller\'s business premises, for example at the consumer\'s home after a site visit, and from a distance contract, for example one made by accepting a quote by phone, email or message. Almost all of our jobs are agreed in one of those two ways, so the right most likely applies to your contract.',
        ],
      },
      {
        heading: 'The period',
        paragraphs: [
          'The period is fourteen days from the day the contract was made. It is enough to send the notice before the period ends.',
          'If you were not told about this right before the contract was made, the Act extends the period by twelve months.',
        ],
      },
      {
        heading: 'How to withdraw',
        bullets: [
          'Send us an unambiguous notice that you are withdrawing from the contract, by email to expertparket2024@gmail.com or by letter to Expert Parket og Mál ehf., Álfholti 10, 220 Hafnarfjörður, Iceland.',
          'You do not have to give a reason.',
          'You may use the form below, but you do not have to.',
          'Keep a copy of the notice. It is for the consumer to show that it was sent.',
        ],
      },
      {
        heading: 'If work starts within the period',
        paragraphs: [
          'If you want us to start before the fourteen days are up, we ask you for an express request to that effect on a durable medium, for example by email. If you then withdraw before the job is finished, you pay for the part already done, in proportion to the total price.',
          'Once the job has been fully completed at your request, and you have acknowledged that the right lapses at that point, the contract can no longer be withdrawn from.',
        ],
      },
      {
        heading: 'Refund',
        paragraphs: [
          'If we have received a payment, we refund it within fourteen days of receiving your notice, by the same means of payment you used unless agreed otherwise, less what is owed for work already done as described above.',
        ],
      },
      {
        heading: 'Exceptions',
        paragraphs: ['Under the Act the right does not cover:'],
        bullets: [
          'urgent repairs or maintenance you have specifically asked us to come and carry out,',
          'materials specially ordered or made to your specifications, to the extent they cannot be returned to the supplier.',
        ],
      },
      {
        heading: 'Standard withdrawal form',
        paragraphs: ['Complete and return this form only if you wish to withdraw from the contract.'],
        block: [
          'To: Expert Parket og Mál ehf., Álfholti 10, 220 Hafnarfjörður, Iceland, expertparket2024@gmail.com',
          'I hereby give notice that I withdraw from my contract for the following service:',
          'Contract made on:',
          'Name of consumer:',
          'Address of consumer:',
          'Signature of consumer (only if this form is notified on paper):',
          'Date:',
        ],
      },
      {
        heading: 'Rights in case of defects',
        paragraphs: [
          'The right of withdrawal is separate from your rights if the service turns out to be defective. Those are governed by the Service Purchases Act No. 42/2000 and our terms.',
        ],
        link: { key: 'terms', label: 'Terms of service' },
      },
    ],
  },
  pl: {
    seo: {
      title: 'Prawo odstąpienia od umowy | Expert Parket og Mál',
      description:
        'Czternastodniowe prawo konsumenta do odstąpienia od umowy zawartej w jego domu lub na odległość, zgodnie z islandzką ustawą nr 16/2016. Termin, zawiadomienie, wzór formularza i wyjątki.',
    },
    titleLines: ['Prawo odstąpienia', 'od umowy'],
    lead: 'Jeśli umowa o wykonanie prac została zawarta u Ciebie w domu, telefonicznie lub e-mailem, masz czternaście dni, żeby się rozmyślić, bez podania przyczyny. Oto jak to działa. To tłumaczenie; wiążąca jest wersja islandzka.',
    updated: UPDATED.pl,
    sections: [
      {
        heading: 'Kiedy przysługuje prawo',
        paragraphs: [
          'Zgodnie z islandzką ustawą o umowach konsumenckich nr 16/2016 konsument może odstąpić od umowy zawartej poza lokalem przedsiębiorstwa sprzedawcy, na przykład w domu konsumenta po oględzinach, oraz od umowy zawartej na odległość, na przykład przez przyjęcie wyceny telefonicznie, e-mailem lub wiadomością. Niemal wszystkie nasze zlecenia są uzgadniane w jeden z tych dwóch sposobów, więc prawo to najprawdopodobniej dotyczy Twojej umowy.',
        ],
      },
      {
        heading: 'Termin',
        paragraphs: [
          'Termin wynosi czternaście dni od dnia zawarcia umowy. Wystarczy wysłać zawiadomienie przed jego upływem.',
          'Jeśli przed zawarciem umowy nie zostałeś poinformowany o tym prawie, ustawa wydłuża termin o dwanaście miesięcy.',
        ],
      },
      {
        heading: 'Jak odstąpić',
        bullets: [
          'Wyślij nam jednoznaczne zawiadomienie o odstąpieniu od umowy, e-mailem na expertparket2024@gmail.com lub listem na adres Expert Parket og Mál ehf., Álfholti 10, 220 Hafnarfjörður, Islandia.',
          'Nie musisz podawać przyczyny.',
          'Możesz użyć poniższego formularza, ale nie musisz.',
          'Zachowaj kopię zawiadomienia. To konsument wykazuje, że zostało wysłane.',
        ],
      },
      {
        heading: 'Jeśli prace zaczną się w tym okresie',
        paragraphs: [
          'Jeśli chcesz, żebyśmy zaczęli przed upływem czternastu dni, prosimy o wyraźne żądanie w tej sprawie na trwałym nośniku, na przykład e-mailem. Jeśli potem odstąpisz od umowy przed zakończeniem prac, płacisz za część już wykonaną, proporcjonalnie do całkowitej ceny.',
          'Gdy prace zostaną w pełni wykonane na Twoje żądanie, a Ty potwierdzisz, że w tym momencie prawo wygasa, od umowy nie można już odstąpić.',
        ],
      },
      {
        heading: 'Zwrot pieniędzy',
        paragraphs: [
          'Jeśli otrzymaliśmy płatność, zwracamy ją w ciągu czternastu dni od otrzymania zawiadomienia, tym samym sposobem płatności, którego użyłeś, chyba że uzgodniono inaczej, po odliczeniu należności za już wykonane prace, jak opisano wyżej.',
        ],
      },
      {
        heading: 'Wyjątki',
        paragraphs: ['Zgodnie z ustawą prawo nie obejmuje:'],
        bullets: [
          'pilnych napraw lub konserwacji, o których wykonanie wyraźnie nas poprosiłeś,',
          'materiałów zamówionych specjalnie lub wykonanych według Twoich specyfikacji, w zakresie, w jakim nie można ich zwrócić dostawcy.',
        ],
      },
      {
        heading: 'Wzór formularza odstąpienia',
        paragraphs: ['Wypełnij i odeślij ten formularz tylko wtedy, gdy chcesz odstąpić od umowy.'],
        block: [
          'Do: Expert Parket og Mál ehf., Álfholti 10, 220 Hafnarfjörður, Islandia, expertparket2024@gmail.com',
          'Niniejszym informuję o odstąpieniu od mojej umowy o świadczenie następującej usługi:',
          'Umowa zawarta dnia:',
          'Imię i nazwisko konsumenta:',
          'Adres konsumenta:',
          'Podpis konsumenta (tylko jeśli formularz jest przesyłany w wersji papierowej):',
          'Data:',
        ],
      },
      {
        heading: 'Prawa z tytułu wad',
        paragraphs: [
          'Prawo odstąpienia od umowy jest niezależne od Twoich praw, jeśli usługa okaże się wadliwa. Te reguluje ustawa o zakupie usług nr 42/2000 i nasz regulamin.',
        ],
        link: { key: 'terms', label: 'Regulamin' },
      },
    ],
  },
}
