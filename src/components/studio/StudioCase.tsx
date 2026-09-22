import { useParams } from 'react-router-dom'
import CasePage from './layouts/case/CasePage'

/**
 * A studio case study.
 *
 * Both remaining layouts share the bento-summary template, so there is nothing
 * to branch on here — the five-beat template that the Quiet layout used was
 * removed with it.
 */
export default function StudioCase() {
  const { slug } = useParams<{ slug: string }>()

  return <CasePage slug={slug ?? ''} />
}
