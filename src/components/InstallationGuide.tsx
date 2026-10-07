import { useLang } from '@/i18n/context'
import { installationContent } from '@/data/installation'
import { photos } from '@/data/photos'
import { PhotoSlot } from './PhotoSlot'
import { Button } from './Button'
import { TextLink } from './TextLink'

/** Buying information and existing work photographs for the installation page. */
export function InstallationGuide() {
  const { lang, path } = useLang()
  const content = installationContent[lang]

  return (
    <>
      <section id="verd" className="scroll-mt-28 bg-sand-light py-14 md:py-20" aria-labelledby="installation-price-heading">
        <div className="container-x">
          <h2 id="installation-price-heading" className="max-w-[28ch] font-display text-3xl font-semibold leading-tight text-espresso md:text-4xl">{content.price.title}</h2>
          <p className="mt-6 max-w-[72ch] leading-relaxed text-ink/80">{content.price.lead}</p>
          <dl className="mt-10 grid gap-x-14 gap-y-8 md:grid-cols-2">
            {content.price.items.map((item) => (
              <div key={item.title}>
                <dt className="font-display text-xl font-semibold text-espresso">{item.title}</dt>
                <dd className="mt-3 max-w-[60ch] leading-relaxed text-ink/80">{item.body}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-10 max-w-[76ch] font-medium leading-relaxed text-walnut">{content.price.example}</p>
        </div>
      </section>

      <section id="verk" className="container-x scroll-mt-28 py-14 md:py-20" aria-labelledby="installation-work-heading">
        <h2 id="installation-work-heading" className="font-display text-3xl font-semibold text-espresso md:text-4xl">{content.work.title}</h2>
        <p className="mt-5 max-w-[68ch] leading-relaxed text-ink/80">{content.work.lead}</p>
        <div className="mt-9 grid gap-8 md:grid-cols-2">
          {content.work.captions.map((caption, index) => (
            <PhotoSlot key={caption} src={photos.work.parket[index]} alt={caption} caption={caption} aspect="4/3" sizes="(min-width: 1280px) 600px, (min-width: 768px) 46vw, 100vw" />
          ))}
        </div>
        <TextLink to={path('portfolio')} className="mt-7 inline-block">{content.work.link}</TextLink>
      </section>

      <section className="container-x grid gap-12 pb-14 lg:grid-cols-2 lg:gap-16 md:pb-20">
        <div>
          <h2 className="font-display text-3xl font-semibold text-espresso md:text-4xl">{content.process.title}</h2>
          <ol className="mt-8 list-decimal space-y-7 pl-6 marker:font-semibold marker:text-gold-deep">
            {content.process.steps.map((step) => (
              <li key={step.title} className="pl-2">
                <h3 className="font-display text-xl font-semibold text-espresso">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-ink/80">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
        <div id="tilbod" className="scroll-mt-28 self-start bg-sand p-6 sm:p-9">
          <h2 className="font-display text-2xl font-semibold text-espresso sm:text-3xl">{content.quote.title}</h2>
          <p className="mt-5 leading-relaxed text-ink/80">{content.quote.lead}</p>
          <ul className="mt-6 list-disc space-y-3 pl-5 leading-relaxed text-ink/80">
            {content.quote.items.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <div className="mt-8 flex flex-col items-start gap-6">
            <Button to={path('contact')} className="max-w-full whitespace-normal text-left">{content.quote.cta}</Button>
            <TextLink to={path('catalog')}>{content.quote.catalog}</TextLink>
          </div>
        </div>
      </section>
    </>
  )
}
