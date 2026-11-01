import type { Img } from '@/lib/payload'
import { PHOTO_SIZES } from '@/lib/photo-sizes'

const ALT: Record<string, string> = {
  'eliane-gange': 'Eliane au bord du Gange, dans l’Himalaya',
  'eliane-portrait': 'Portrait d’Eliane',
  'puja-gange': 'Offrandes de fleurs au bord du Gange',
  'bouddha-bougie': 'Statue de Bouddha et bougie',
  'kumbh-bain': 'Bain sacré dans le Gange pendant la Kumbha Mela',
  'ladakh-monastere': 'Moines dans un monastère du Ladakh',
}

/** A bundled photo from /public/images/photos. */
export function photo(name: string, alt?: string): Img | null {
  const s = PHOTO_SIZES[name]
  if (!s) return null
  return { url: `/images/photos/${name}.jpg`, alt: alt ?? ALT[name] ?? '', width: s[0], height: s[1] }
}

/** Default photo for each offering / trip / page, used when no image is set in the dashboard. */
export const OFFERING_PHOTO: Record<string, string> = {
  'consultation-decouverte': 'eliane-rishikesh',
  'seance-individuelle-en-ligne': 'bouddha-bougie',
  'seance-individuelle-presentiel': 'autel',
  'suivi-personnalise': 'notes',
  'meditation-son-primordial': 'meditation-groupe',
  'formation-ayurveda-sante': 'formation-groupe',
  'conference-bien-etre': 'anatomie',
  'kumbha-mela-2027': 'kumbh-bain',
  'ladakh-entre-ciel-et-silence': 'ladakh-monastere',
}

export const TRIP_GALLERY: Record<string, string[]> = {
  'kumbha-mela-2027': ['kumbh-sadhus', 'kumbh-foule', 'sadhu-benediction', 'puja-gange', 'taj-mahal', 'kumbh-carte'],
  'ladakh-entre-ciel-et-silence': ['ladakh-village', 'ladakh-dunes', 'ladakh-montagnes', 'ladakh-enfants', 'ladakh-bouddha', 'ladakh-ancienne'],
}

export const POST_PHOTO: Record<string, string> = {
  'comprendre-les-4-grands-cousins': 'blog-029',
  'laisser-ses-limitations-derriere-soi': 'blog-031',
  'nous-avons-deja-tout': 'blog-033',
  'nourrir-ses-sens': 'blog-032',
  'ecouter-son-coeur-et-son-corps': 'blog-034',
  'fiu-de-tourner-en-rond': 'meditation-groupe',
  'revision-et-vidange': 'blog-030',
}

export const offeringPhoto = (slug?: string | null) => (slug && OFFERING_PHOTO[slug] ? photo(OFFERING_PHOTO[slug]) : null)
export const postPhoto = (slug?: string | null) => (slug && POST_PHOTO[slug] ? photo(POST_PHOTO[slug]) : null)
