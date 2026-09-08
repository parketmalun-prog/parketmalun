import { privacy } from '@/data/privacy'
import { useContent } from '@/i18n/context'
import { LegalPage } from '@/components/LegalPage'

export default function Privacy() {
  return <LegalPage content={useContent(privacy)} />
}
