import { withdrawal } from '@/data/legal'
import { useContent } from '@/i18n/context'
import { LegalPage } from '@/components/LegalPage'

export default function Withdrawal() {
  return <LegalPage content={useContent(withdrawal)} />
}
