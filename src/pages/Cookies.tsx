import { cookies } from '@/data/legal'
import { useContent } from '@/i18n/context'
import { LegalPage } from '@/components/LegalPage'

export default function Cookies() {
  return <LegalPage content={useContent(cookies)} />
}
