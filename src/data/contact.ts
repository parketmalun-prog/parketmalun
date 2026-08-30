import type { Lang } from '@/i18n/config'

type SeoText = { title: string; description: string }
type ContactContent = {
  /** H1 pre-split into LineReveal lines. */
  titleLines: string[]
  lead: string
  /** SectionIndex label for the form section. */
  indexLabel: string
  form: {
    panelTitle: string
    nameLabel: string
    namePlaceholder: string
    contactLabel: string
    contactPlaceholder: string
    /** Label of the service select restored from the old site. */
    serviceLabel: string
    /** Options of the service select, in site order: laying, sanding, painting, other. */
    serviceOptions: string[]
    messageLabel: string
    messagePlaceholder: string
    submitLabel: string
    sendingLabel: string
    /** GDPR notice under the submit button; the privacy link follows it. */
    consentPrefix: string
    consentLink: string
    successTitle: string
    successText: string
    mailtoTitle: string
    mailtoText: string
    errorText: string
    privacyNote: string
  }
  /** The contact ledger on the espresso plinth. */
}

export const contactSeo: Record<Lang, SeoText> = {
  is: {
    title: 'Hafðu samband | Frítt verðtilboð | Expert Parket og Mál',
    description:
      'Frítt og óskuldbindandi verðtilboð í parketlögn, slípun eða málun á höfuðborgarsvæðinu. Sími 785 7079, opið mán til fös 08:00 til 18:00. Við svörum samdægurs á virkum dögum.',
  },
  en: {
    title: 'Contact | Free quote | Expert Parket og Mál',
    description:
      'Free, no obligation quote for parquet laying, floor sanding or painting across the capital region. Phone 785 7079, open Mon to Fri 08:00 to 18:00. We reply the same working day.',
  },
  pl: {
    title: 'Kontakt | Bezpłatna wycena | Expert Parket og Mál',
    description:
      'Bezpłatna i niezobowiązująca wycena układania parkietu, cyklinowania lub malowania w regionie stołecznym. Telefon 785 7079, czynne pon do pt 08:00 do 18:00. Odpowiadamy tego samego dnia roboczego.',
  },
}

export const contact: Record<Lang, ContactContent> = {
  is: {
    titleLines: ['Talaðu', 'við okkur'],
    lead:
      'Verðtilboð kostar ekkert og bindur þig ekki. Hringdu í 785 7079 á vinnutíma eða sendu okkur línu og við svörum samdægurs á virkum dögum.',
    indexLabel: 'Verkbeiðni',
    form: {
      panelTitle: 'Segðu okkur stuttlega frá verkinu',
      nameLabel: 'Nafn',
      namePlaceholder: 'Fullt nafn',
      contactLabel: 'Sími eða netfang',
      contactPlaceholder: '785 7079 eða netfangið þitt',
      serviceLabel: 'Þjónusta',
      serviceOptions: ['Parketlögn', 'Parketslípun', 'Málun', 'Annað'],
      messageLabel: 'Skilaboð',
      messagePlaceholder: 'Til dæmis: 60 m² stofa í Kópavogi, slípun og lökkun, laus í ágúst.',
      submitLabel: 'Senda verkbeiðni',
      sendingLabel: 'Sendi …',
      consentPrefix: 'Með því að senda samþykkir þú',
      consentLink: 'persónuverndarstefnu okkar',
      successTitle: 'Móttekið, takk fyrir',
      successText:
        'Skilaboðin þín eru komin til okkar. Við hringjum eða skrifum til baka samdægurs á virkum dögum.',
      mailtoTitle: 'Pósthólfið þitt ætti að opnast',
      mailtoText:
        'Við útbjuggum tölvupóst með skilaboðunum þínum. Ef pósthólfið opnaðist ekki, sendu okkur línu beint á expertparket2024@gmail.com eða hringdu í 785 7079.',
      errorText: 'Sendingin mistókst. Hringdu í 785 7079 eða reyndu aftur eftir smástund.',
      privacyNote:
        'Upplýsingarnar eru aðeins notaðar til að svara fyrirspurninni og fara aldrei til þriðja aðila.',
    },
  },
  en: {
    titleLines: ['Talk', 'to us'],
    lead:
      'A quote costs nothing and does not commit you to anything. Call 785 7079 during working hours or send us a line and we reply the same working day.',
    indexLabel: 'Job enquiry',
    form: {
      panelTitle: 'Tell us briefly about the job',
      nameLabel: 'Name',
      namePlaceholder: 'Full name',
      contactLabel: 'Phone or email',
      contactPlaceholder: '785 7079 or your email',
      serviceLabel: 'Service',
      serviceOptions: ['Parquet laying', 'Floor sanding', 'Painting', 'Something else'],
      messageLabel: 'Message',
      messagePlaceholder: 'For example: 60 m² living room in Kópavogur, sanding and lacquer, free in August.',
      submitLabel: 'Send the enquiry',
      sendingLabel: 'Sending …',
      consentPrefix: 'By sending you agree to our',
      consentLink: 'privacy policy',
      successTitle: 'Received, thank you',
      successText:
        'Your message has reached us. We call or write back the same working day.',
      mailtoTitle: 'Your email client should open',
      mailtoText:
        'We prepared an email with your message. If your email client did not open, write to us directly at expertparket2024@gmail.com or call 785 7079.',
      errorText: 'The message did not go through. Call 785 7079 or try again in a moment.',
      privacyNote:
        'Your details are used only to answer the enquiry and never go to a third party.',
    },
  },
  pl: {
    titleLines: ['Porozmawiaj', 'z nami'],
    lead:
      'Wycena nic nie kosztuje i do niczego nie zobowiązuje. Zadzwoń pod 785 7079 w godzinach pracy lub napisz do nas, a odpowiemy tego samego dnia roboczego.',
    indexLabel: 'Zapytanie o zlecenie',
    form: {
      panelTitle: 'Opisz nam krótko swoje zlecenie',
      nameLabel: 'Imię i nazwisko',
      namePlaceholder: 'Imię i nazwisko',
      contactLabel: 'Telefon lub e-mail',
      contactPlaceholder: '785 7079 lub Twój adres e-mail',
      serviceLabel: 'Usługa',
      serviceOptions: ['Układanie parkietu', 'Cyklinowanie parkietu', 'Malowanie', 'Coś innego'],
      messageLabel: 'Wiadomość',
      messagePlaceholder: 'Na przykład: salon 60 m² w Kópavogur, cyklinowanie i lakierowanie, termin w sierpniu.',
      submitLabel: 'Wyślij zapytanie',
      consentPrefix: 'Wysyłając zapytanie akceptujesz naszą',
      consentLink: 'politykę prywatności',
      sendingLabel: 'Wysyłanie …',
      successTitle: 'Otrzymaliśmy, dziękujemy',
      successText:
        'Twoja wiadomość do nas dotarła. Oddzwonimy lub odpiszemy tego samego dnia roboczego.',
      mailtoTitle: 'Twój program pocztowy powinien się otworzyć',
      mailtoText:
        'Przygotowaliśmy e-mail z Twoją wiadomością. Jeśli program pocztowy się nie otworzył, napisz do nas bezpośrednio na expertparket2024@gmail.com lub zadzwoń pod 785 7079.',
      errorText: 'Wysyłka nie powiodła się. Zadzwoń pod 785 7079 lub spróbuj ponownie za chwilę.',
      privacyNote:
        'Twoje dane służą wyłącznie do odpowiedzi na zapytanie i nigdy nie trafiają do osób trzecich.',
    },
  },
}
