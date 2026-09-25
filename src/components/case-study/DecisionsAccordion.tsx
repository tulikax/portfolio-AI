import type { CaseStudy } from '../../types/caseStudy'
import DecisionRounds from './DecisionRounds'

type KeyDecision = NonNullable<CaseStudy['projectTabs']>[number]['keyDecisions']

/** MAGIC's "Key decisions" — DecisionRounds with no verdict tags. */
export default function DecisionsAccordion({ decisions }: { decisions: KeyDecision }) {
  if (!decisions || decisions.length === 0) return null
  return <DecisionRounds items={decisions} />
}
