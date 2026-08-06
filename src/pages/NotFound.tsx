import { site } from '@/data/site'
import { useLang, useUi } from '@/i18n/context'
import { Seo } from '@/components/Seo'
import { TextLink } from '@/components/TextLink'
import { LineReveal, DrawRule } from '@/components/motionPrimitives'

export default function NotFound() {
  const { path } = useLang()
  const t = useUi()
  return (
    <>
      <Seo title={t.notFound.seoTitle} noindex />
      <section className="container-x flex min-h-[70vh] flex-col justify-center py-20">
        <DrawRule />
        <LineReveal
          as="h1"
          lines={['404']}
          className="num-outline tnum pt-6 font-display text-[clamp(6rem,22vw,14rem)] font-bold leading-[0.9]"
        />
        <p className="pt-4 font-display text-2xl font-bold text-espresso">{t.notFound.title}</p>
        <p className="max-w-md pt-3 leading-relaxed text-taupe">{t.notFound.text}</p>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-8">
          <TextLink to={path('home')}>{t.notFound.backHome}</TextLink>
          <a
            href={`tel:${site.phoneRaw}`}
            className="tnum font-display text-xl font-bold text-espresso transition-colors hover:text-gold-deep"
          >
            {site.phone}
          </a>
        </div>
        <div className="pt-10">
          <DrawRule delay={0.1} />
        </div>
      </section>
    </>
  )
}
