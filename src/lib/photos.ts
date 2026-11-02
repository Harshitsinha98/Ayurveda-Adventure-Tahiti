import type { Img } from '@/lib/payload'
import { PHOTO_SIZES } from '@/lib/photo-sizes'

const ALT: Record<string, string> = {
  'eliane-gange': 'Eliane au bord du Gange, dans l’Himalaya',
  'eliane-portrait': 'Portrait d’Eliane',
  'puja-gange': 'Offrandes de fleurs au bord du Gange',
  'bouddha-bougie': 'Statue de Bouddha et bougie',
  'kumbh-bain': 'Bain sacré dans le Gange pendant la Kumbha Mela',
  'ladakh-monastere': 'Moines dans un monastère du Ladakh',
  'moorea-coucher-soleil': 'Coucher de soleil sur le lagon de Moorea',
  'tahiti-vue-moorea': 'Vue de Moorea depuis les hauteurs de Tahiti',
  'punaauia-plage': 'Le lagon de Punaauia au coucher du soleil',
  'ganga-aarti-haridwar': 'Ganga Aarti à Har ki Pauri, Haridwar',
  'rishikesh-gange': 'Le Gange à Rishikesh, au pied de l’Himalaya',
  'varanasi-barques': 'Barques au lever du soleil sur le Gange, Varanasi',
  'varanasi-ghat': 'Les ghats de Varanasi',
  'nubra-dunes': 'Dunes et peupliers de la vallée de la Nubra',
  'nubra-vallee': 'La vallée de la Nubra, Ladakh',
  'kumbh-procession': 'Procession de sadhus à la Kumbh Mela',
  'haridwar-aarti': 'Aarti du soir à Haridwar',
}

const ALT_EN: Record<string, string> = {
  'eliane-gange': 'Eliane by the Ganges, in the Himalayas',
  'eliane-portrait': 'Portrait of Eliane',
  'puja-gange': 'Flower offerings by the Ganges',
  'bouddha-bougie': 'Buddha statue and candle',
  'kumbh-bain': 'Sacred bath in the Ganges during the Kumbha Mela',
  'ladakh-monastere': 'Monks in a Ladakh monastery',
  'moorea-coucher-soleil': 'Sunset over the Moorea lagoon',
  'tahiti-vue-moorea': 'Moorea seen from the hills of Tahiti',
  'punaauia-plage': 'The Punaauia lagoon at sunset',
  'ganga-aarti-haridwar': 'Ganga Aarti at Har ki Pauri, Haridwar',
  'rishikesh-gange': 'The Ganges at Rishikesh, at the foot of the Himalayas',
  'varanasi-barques': 'Boats at sunrise on the Ganges, Varanasi',
  'varanasi-ghat': 'The ghats of Varanasi',
  'nubra-dunes': 'Dunes and poplars of the Nubra valley',
  'nubra-vallee': 'The Nubra valley, Ladakh',
  'kumbh-procession': 'A procession of sadhus at the Kumbh Mela',
  'haridwar-aarti': 'Evening aarti in Haridwar',
}

/** A bundled photo from /public/images/photos. */
export function photo(name: string, alt?: string, lang: 'fr' | 'en' = 'fr'): Img | null {
  const s = PHOTO_SIZES[name]
  if (!s) return null
  const a = alt ?? (lang === 'en' ? ALT_EN[name] : undefined) ?? ALT[name] ?? ''
  return { url: `/images/photos/${name}.jpg`, alt: a, width: s[0], height: s[1] }
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
  'kumbha-mela-2027': ['kumbh-sadhus', 'kumbh-foule', 'kumbh-procession', 'sadhu-benediction', 'ganga-aarti-haridwar', 'puja-gange', 'rishikesh-gange', 'varanasi-ghat', 'taj-mahal', 'kumbh-carte'],
  'ladakh-entre-ciel-et-silence': ['ladakh-village', 'nubra-vallee', 'ladakh-dunes', 'ladakh-montagnes', 'nubra-dunes', 'ladakh-enfants', 'ladakh-bouddha', 'ladakh-ancienne'],
}

/** Places gallery on the India journeys page (Wikimedia Commons, see /credits). */
export const INDIA_PLACES = ['ganga-aarti-haridwar', 'rishikesh-gange', 'varanasi-barques', 'varanasi-ghat', 'haridwar-aarti', 'kumbh-procession']

export const POST_PHOTO: Record<string, string> = {
  'comprendre-les-4-grands-cousins': 'blog-029',
  'laisser-ses-limitations-derriere-soi': 'blog-031',
  'nous-avons-deja-tout': 'blog-033',
  'nourrir-ses-sens': 'blog-032',
  'ecouter-son-coeur-et-son-corps': 'blog-034',
  'fiu-de-tourner-en-rond': 'meditation-groupe',
  'revision-et-vidange': 'blog-030',
}

export const offeringPhoto = (slug?: string | null, lang: 'fr' | 'en' = 'fr') => (slug && OFFERING_PHOTO[slug] ? photo(OFFERING_PHOTO[slug], undefined, lang) : null)
export const postPhoto = (slug?: string | null) => (slug && POST_PHOTO[slug] ? photo(POST_PHOTO[slug]) : null)
