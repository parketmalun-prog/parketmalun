import { terms } from '@/data/legal'
import { useContent } from '@/i18n/context'
import { LegalPage } from '@/components/LegalPage'

export default function Terms() {
  return <LegalPage content={useContent(terms)} />
}
