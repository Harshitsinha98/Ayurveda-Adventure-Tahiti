/**
 * Content migrated from www.ayurveda-tahiti.com (Wix), October 2026.
 * Texts are Eliane's own. Values marked TODO(Eliane) must be confirmed by her.
 */

export const testimonials = [
  {
    name: 'Patricia S.',
    highlight: 'Plus de sérénité, de confiance et un meilleur équilibre au quotidien.',
    quote:
      "Eliane m'a vraiment aidée à mieux gérer mes émotions et à trouver un équilibre entre mon corps et mon esprit. Elle m'a aussi appris des techniques de relaxation, de sport et d'alimentation qui m'ont beaucoup apporté. J'ai aimé l'approche globale de ses cours, qui combine gestion des émotions, méditation, sport et alimentation. Ces outils m'ont aidée à mieux gérer le stress, à avoir plus d'énergie et à améliorer mon sommeil.",
  },
  {
    name: 'Sandra F.',
    highlight: 'Chaque cours commence par une méditation que j’ai adorée.',
    context: 'Formation Ayurveda Santé',
    quote:
      "Eliane m'a permis d'avoir une approche de ce qu'est l'Ayurveda, de pouvoir être à l'écoute de mon corps, pour mettre en place une routine matinale et du soir, un temps pour Soi ! La connaissance des Doshas m'a aidée à m'alimenter de manière moins inflammatoire. Comprendre comment le stress nous affecte, le rapport avec le sommeil, la nourriture et le mental… Eliane donne beaucoup d'astuces, de conseils, tout en bienveillance et douceur. Une formation très enrichissante, je la recommande !",
  },
  {
    name: 'Fanny P.',
    highlight: 'Pour se rééquilibrer quand on a l’impression que la vie nous échappe.',
    quote: "Très bien pour apprendre à se rééquilibrer quand on a l'impression que la vie nous échappe.",
  },
]

export const home = {
  eyebrow: 'Ayurveda · Méditation · Yoga · Sciences védiques',
  headline: ['Clarifie ton esprit.', 'Retrouve ton énergie.', 'Transforme ta vie.'],
  intro:
    "Grâce à l’Ayurveda et à la méditation, j’aide les personnes à instaurer des rituels simples et puissants pour vivre avec plus de clarté et de calme, à Tahiti ou en ligne.",
  manifesto:
    "La vie est belle. Vraiment belle. Passionnante. Parfois, nous la trouvons un peu trop intense. Parfois aussi un peu ennuyeuse, ou injuste, voire cruelle. Mais tout cela n’est qu’une histoire. Les histoires que nous nous racontons, nous les choisissons. Souvent sans même nous en rendre compte.",
  manifestoAside: 'Viens apprendre à te raconter l’histoire que tu as vraiment envie d’entendre.',
  ritual: {
    title: 'Ta journée commence bien avant l’ouverture de tes yeux.',
    text: 'Les premières 20 minutes après le réveil influencent ton humeur, tes hormones, et même ta digestion. Quelques gestes alignés peuvent transformer ton quotidien, ton énergie, ta façon de vivre.',
  },
  pillars: [
    { title: 'Alimentation', text: 'Nourrir le corps selon sa constitution.' },
    { title: 'Mouvement', text: 'Un corps vivant, souple et présent.' },
    { title: 'Sommeil', text: 'Retrouver le rythme naturel du repos.' },
    { title: 'Émotions', text: 'Accueillir, comprendre, se libérer.' },
    { title: 'Routine', text: 'Des rituels simples, matin et soir.' },
    { title: 'Méditation', text: 'Le silence qui clarifie l’esprit.' },
  ],
}

export const about = {
  title: 'Eliane Poeauru Koller Valadier',
  lead: 'Mon parcours est celui d’un pont entre les mondes.',
  paragraphs: [
    'Enfant, je percevais des choses que personne ne semblait voir. Mais dans le cadre austro-allemand où j’ai grandi, cela n’avait pas sa place. Plus tard, vivre au Koweït m’a appris que ce que l’on tient pour « réel » dépend surtout de ce qu’on nous a appris à croire.',
    'J’ai étudié l’ethnologie pour comprendre la multiplicité des visions du monde, et je suis allée à la rencontre de spiritualités vivantes, comme le Candomblé au Brésil. Là-bas, j’ai vu l’invisible reprendre forme.',
    'C’est à Tahiti, où je vis depuis 22 ans, que j’ai découvert une autre sagesse : celle du corps, des ancêtres, des liens profonds. Pour en savoir plus, j’ai fait un Master 1 en Langues, Cultures et Sociétés Océaniennes à Tahiti.',
    'En 2020, j’ai suivi une formation auprès de Chopra Global, qui m’a initiée à une Ayurveda vivante, enracinée et accessible. J’ai renoué avec l’Inde, et avec Sanjeev, un guide de longue date rencontré 20 ans plus tôt.',
    'Aujourd’hui, j’enseigne la méditation (Primordial Sound) et l’Ayurveda comme art de vivre. J’accompagne des personnes en quête d’alignement, et j’organise des voyages spirituels dans l’Himalaya, pour retrouver le silence, la force et le sacré.',
    'Bienvenue dans cet espace où les traditions se rencontrent, où le corps est écouté, et où chaque expérience est une porte vers la connaissance.',
  ],
  chapters: [
    { place: 'Autriche · Allemagne', text: 'Une enfance sensible à l’invisible, dans un cadre où il n’avait pas sa place.' },
    { place: 'Koweït · Brésil', text: 'L’ethnologie, la multiplicité des visions du monde, le Candomblé.' },
    { place: 'Tahiti, depuis 22 ans', text: 'La sagesse du corps, des ancêtres et des liens. Un Master en cultures océaniennes.', image: 'salle-punaauia' },
    { place: 'Chopra Global · Inde', text: 'L’Ayurveda vivante, la méditation Primordial Sound, et les retrouvailles avec Sanjeev.', image: 'eliane-rishikesh' },
  ],
}

const cancel24 = 'Pour annuler ou reprogrammer, merci de me contacter au moins 24 h à l’avance.'

export const offerings = [
  {
    slug: 'consultation-decouverte',
    title: 'Consultation découverte',
    kind: 'seance',
    mode: 'en-ligne',
    kicker: 'Un premier échange',
    summary:
      "Avant tout engagement, un entretien en ligne pour faire connaissance, exprimer ce que tu cherches et recevoir mon conseil sur l'accompagnement qui te conviendrait le mieux.",
    body: ["Un espace d'écoute bienveillant pour poser la première pierre de ton chemin."],
    price: 0,
    durationMinutes: 20,
    bookingMode: 'free',
    cancellationPolicy: cancel24,
    image: 'eliane-rishikesh',
    order: 1,
    featured: true,
  },
  {
    slug: 'seance-individuelle-en-ligne',
    title: 'Séance individuelle en ligne',
    kind: 'seance',
    mode: 'en-ligne',
    kicker: 'Un espace de transformation',
    summary:
      'À travers le prisme de l’Ayurveda, nous identifions ta constitution, tes déséquilibres et les leviers concrets pour retrouver énergie, clarté et équilibre.',
    body: [
      'Nous travaillons avec les 6 piliers de la santé : alimentation, mouvement, sommeil, émotions, routine et méditation.',
      'Chaque séance est unique, et parfois, une seule suffit à faire basculer les choses.',
    ],
    price: 8700,
    durationMinutes: 90,
    bookingMode: 'online',
    creditEligible: true,
    cancellationPolicy: cancel24,
    image: 'bouddha-bougie',
    order: 2,
    featured: true,
  },
  {
    slug: 'seance-individuelle-presentiel',
    title: 'Séance individuelle à Punaauia',
    kind: 'seance',
    mode: 'presentiel',
    kicker: 'En présence, à Tahiti',
    summary:
      'La même séance, dans le calme de mon espace à Punaauia : ta constitution, tes déséquilibres et des rituels concrets à mettre en place.',
    body: ['Nous travaillons avec les 6 piliers de la santé : alimentation, mouvement, sommeil, émotions, routine et méditation.'],
    price: 8700,
    durationMinutes: 90,
    bookingMode: 'online',
    creditEligible: true,
    location: 'Punaauia, Tahiti',
    cancellationPolicy: cancel24,
    image: 'autel',
    order: 3,
  },
  {
    slug: 'suivi-personnalise',
    title: 'Suivi personnalisé',
    kind: 'seance',
    mode: 'hybride',
    kicker: 'Un accompagnement continu',
    summary:
      'Un parcours de séances pour une transformation réelle, stable et consciente : corps, émotions, rythme, énergie.',
    body: [
      'Séance après séance, nous explorons ensemble les domaines clés de ta vie en nous appuyant sur les principes de l’Ayurveda et les outils du coaching de pleine conscience.',
      'Tu bénéficies d’un regard extérieur bienveillant, et de rituels concrets à mettre en œuvre entre les séances. Le suivi se réserve avec un carnet de 4 ou 10 séances.',
    ],
    price: 8700,
    priceNote: 'Avec un carnet de 4 ou 10 séances',
    durationMinutes: 90,
    bookingMode: 'online',
    creditEligible: true,
    location: 'Punaauia, Tahiti ou en ligne',
    cancellationPolicy: cancel24,
    image: 'notes',
    order: 4,
  },
  {
    slug: 'meditation-son-primordial',
    title: 'Formation Méditation au Son Primordial',
    kind: 'formation',
    mode: 'presentiel',
    kicker: '10 heures · 5 séances de 2 h',
    summary:
      'Apprendre la méditation Primordial Sound, transmise par Chopra Global : un mantra personnel et une pratique simple pour clarifier l’esprit au quotidien.',
    body: [
      'Les 10 heures sont réparties en 5 séances de 2 heures. Les séances peuvent être organisées sur deux journées complètes, ou réparties sur plusieurs semaines.',
    ],
    price: 19700,
    bookingMode: 'online',
    maxPerBooking: 2,
    location: 'Punaauia, Tahiti',
    image: 'meditation-groupe',
    gallery: ['meditation-groupe', 'bouddha-bougie'],
    order: 5,
    featured: true,
  },
  {
    slug: 'formation-ayurveda-sante',
    title: 'Formation Ayurveda Santé',
    kind: 'formation',
    mode: 'presentiel',
    kicker: '10 heures en petit groupe',
    summary:
      'Comprendre son corps, ses besoins, son rythme, et apprendre à en prendre soin grâce aux bases essentielles de l’Ayurveda.',
    body: [
      'Tu découvriras ta constitution, les causes des déséquilibres, et des outils concrets pour adapter ton alimentation, ton sommeil, ton énergie et ta routine au quotidien.',
      'Un savoir vivant, applicable, pour reprendre en main ta santé sur tous les plans : corps, esprit, émotions et environnement.',
    ],
    price: 19700, // TODO(Eliane): confirmer le prix (non affiché sur Wix)
    bookingMode: 'online',
    maxPerBooking: 2,
    location: 'Punaauia, Tahiti',
    image: 'formation-groupe',
    gallery: ['formation-groupe', 'anatomie', 'epices'],
    order: 6,
  },
  {
    slug: 'conference-bien-etre',
    title: 'Conférence bien-être',
    kind: 'conference',
    mode: 'presentiel',
    kicker: 'Pour une équipe ou un groupe',
    summary:
      'Une conférence interactive de 2 heures autour de l’Ayurveda ou de la méditation, pour une entreprise, un cercle de proches ou un événement bien-être.',
    body: [
      'Ces rencontres mêlent transmission vivante, exemples concrets, pratiques simples et temps d’échange. La conférence s’adapte à votre public et à votre espace.',
      'J’apporte mon vidéoprojecteur : il suffit d’un mur blanc, de l’électricité et d’un lieu calme. Entre Papara et Papenoo.',
    ],
    price: 27000,
    durationMinutes: 120,
    bookingMode: 'request',
    location: 'Entre Papara et Papenoo',
    image: 'anatomie',
    order: 7,
  },
]

export const packages = [
  {
    slug: 'carnet-4-seances',
    title: 'Carnet de 4 séances',
    sessionsCount: 4,
    price: 19700,
    validityMonths: 12,
    summary:
      'Un forfait unique pour s’engager sur l’ensemble du parcours et garantir la cohérence de l’accompagnement.',
    order: 1,
  },
  {
    slug: 'carnet-10-seances',
    title: 'Carnet de 10 séances',
    sessionsCount: 10,
    price: 70000,
    validityMonths: 12,
    summary:
      'Un suivi personnalisé, un regard extérieur bienveillant et des rituels concrets entre les séances. Une transformation réelle, stable et consciente.',
    order: 2,
  },
]

export const trips = [
  {
    slug: 'kumbha-mela-2027',
    title: 'Kumbha Mela · L’Inde secrète des mystiques',
    kicker: '24 février – 15 mars 2027',
    tripRegion: 'Haridwar · Rishikesh · Varanasi · Khajuraho · Orchha · Agra',
    guide: 'Avec Sanjeev Mehta, maître tantrique d’Haridwar, et Eliane',
    summary:
      'Bien plus qu’un voyage : une immersion de 20 jours au cœur de la Kumbha Mela, le plus grand rassemblement spirituel au monde, puis à travers les lieux les plus emblématiques de l’Inde sacrée.',
    body: [
      'Une véritable retraite de yoga, de méditation, de kriyas et de cercles sacrés, entourés des sages, yogis et ascètes venus de tout l’Himalaya.',
      'Un voyage en petit groupe (12 participants maximum), conçu pour celles et ceux qui souhaitent vivre l’Inde autrement.',
    ],
    tripStart: '2027-02-24',
    tripEnd: '2027-03-15',
    price: 327000,
    priceNote: 'hors vols internationaux Papeete – Delhi – Papeete',
    depositPercent: 30, // TODO(Eliane): confirmer le montant de l'acompte
    balanceDueDaysBefore: 45, // TODO(Eliane): confirmer la date du solde
    maxPerBooking: 2,
    capacity: 12,
    image: 'kumbh-bain',
    gallery: ['kumbh-sadhus', 'kumbh-foule', 'sadhu-benediction', 'puja-gange', 'taj-mahal', 'kumbh-carte'],
    highlights: [
      'Le Shahi Snan, le bain royal des Naga Sadhus dans le Gange',
      'Un camp confortable au cœur de la Kumbha Mela',
      'Yoga, kriyas et méditations guidés chaque jour par Eliane',
      'Cercles sacrés et sagesse védique avec Sanjeev Mehta',
      '3 ateliers préparatoires en présentiel à Tahiti',
    ],
    itinerary: [
      ['Jour 1', 'Arrivée à Delhi, route vers Haridwar', 'Lodge privé dans la réserve du Tigre de Rajaji. En soirée, conférence de Sanjeev sur le Cercle Sacré et méditation de l’Aura.'],
      ['Jour 2', 'Tigris Estate', 'Méditation et yoga matinal, randonnée vers un temple, cercle sacré et feu de camp au coucher du soleil.'],
      ['Jour 3', 'Villages Gujjars, Rishikesh', 'Rencontre des Gujjars, peuple pastoral des forêts himalayennes, puis première immersion dans la capitale du yoga.'],
      ['Jour 4', 'Les grottes des sages', 'Montée jusqu’à une grotte de méditation au bord du Gange, où de nombreux yogis ont pratiqué pendant des décennies.'],
      ['Jour 5', 'Rishikesh', 'Pratiques à l’hôtel, ashram d’Ananda Mai, eaux turquoise du Gange sacré qui sort de la montagne.'],
      ['Jour 6', 'Haridwar, ville sacrée', 'Hari Har Ashram, Geeta Kutir où des centaines de sadhus partagent leur repas, marché Moti Bazaar.'],
      ['Jour 7', 'Randonnée au village de Ramjiwala', 'Forêts de saal, banians centenaires, cultures en terrasse et rencontres. Ganga Aarti au coucher du soleil.'],
      ['Jour 8', 'Installation à la Kumbha Mela', 'Découverte des Akharas et des ashrams, rencontre des Naga Sadhus à la veille du grand jour.'],
      ['Jour 9', 'Shahi Snan', 'Vers 4 h, la procession des Naga Sadhus vers le Gange et le Bain Royal, au son des conques et des tambours.'],
      ['Jour 10', 'Immersion', 'Flâner entre les camps, écouter les maîtres, méditer au bord du Gange.'],
      ['Jour 11', 'Deuxième Amrit Snan, train de nuit', 'Dernière journée à la Kumbha Mela, puis train de nuit vers Varanasi.'],
      ['Jour 12', 'Varanasi, la cité de Shiva', 'La plus ancienne ville habitée au monde. Ganga Aarti au Dashashwamedh Ghat.'],
      ['Jour 13', 'Sarnath', 'Sur les pas du Bouddha, là où il donna son premier enseignement.'],
      ['Jour 14', 'Khajuraho, l’art du Tantra', 'Temples classés à l’UNESCO, où le corps, l’amour, la méditation et le sacré ne font qu’un.'],
      ['Jour 15', 'Orchha', 'Ancienne capitale des rois Bundela, figée dans le temps au bord de la rivière Betwa.'],
      ['Jour 16', 'D’Orchha à Agra', 'Si les conditions le permettent, le Taj Mahal au coucher du soleil.'],
      ['Jour 17', 'Le Taj Mahal au lever du soleil', 'Puis le Fort Rouge d’Agra et la route vers Delhi.'],
      ['Jour 18', 'Au revoir, Inde', 'Transfert vers l’aéroport international de Delhi.'],
    ],
    included: [
      'Hébergement en chambre double / twin (hôtels, camp de la Kumbha Mela, lodges)',
      'Pension complète : petit-déjeuner, déjeuner et dîner',
      'Tous les transferts et déplacements à partir de Delhi',
      'Toutes les visites et excursions prévues',
      'Guide local à partir de Haridwar',
      '3 ateliers préparatoires en présentiel à Tahiti',
      'Yoga, kriyas et méditations guidés par Eliane',
      'Cercles sacrés et enseignements avec Sanjeev Mehta',
      'Adhésion à l’association Ayurveda Adventure Tahiti pour l’année',
    ],
    notIncluded: [
      'Vols internationaux Papeete – Delhi – Papeete',
      'Visa et assurance voyage',
      'Boissons, blanchisserie et dépenses personnelles',
      'Excursions facultatives, massages et soins en supplément',
      'Pourboires',
    ],
    order: 1,
    featured: true,
    bookingMode: 'online',
  },
  {
    slug: 'ladakh-entre-ciel-et-silence',
    title: 'Ladakh · Entre ciel et silence',
    kicker: '6 – 24 septembre 2026',
    tripRegion: 'Leh · Nubra · Lamayuru · Himalaya',
    guide: 'Avec Sanjeev Mehta et Eliane Koller',
    summary:
      'Une terre où l’on médite à 4 000 mètres, où les anciens lisent le ciel et où le silence devient maître. Monastères millénaires, villages isolés et désert de Nubra.',
    body: [
      'Ce voyage ne sera pas qu’une exploration du monde extérieur. Il sera aussi un retour à soi : méditation, pratiques yogiques, cercles sacrés et temps de silence.',
    ],
    tripStart: '2026-09-06',
    tripEnd: '2026-09-24',
    price: 307000,
    priceNote: 'hors vols Tahiti – Delhi – Tahiti',
    extras: [{ label: 'Extension 3 jours à Agra et au Taj Mahal', price: 30000 }],
    image: 'ladakh-monastere',
    gallery: ['ladakh-village', 'ladakh-dunes', 'ladakh-montagnes', 'ladakh-enfants', 'ladakh-bouddha', 'ladakh-ancienne'],
    highlights: [
      'Monastères de Shey, Thiksey, Hemis, Lamayuru, Alchi et Diskit',
      'Le col de Khardung-La et la vallée de la Nubra',
      'Méditations quotidiennes guidées par Eliane',
      'Un groupe intime et authentique',
    ],
    itinerary: [
      ['Jour 1', 'Delhi', 'Arrivée et repos, première immersion dans l’énergie de la capitale.'],
      ['Jour 2', 'Envol vers Leh', 'Vol au-dessus de l’Himalaya, acclimatation douce à l’altitude.'],
      ['Jour 3', 'Shey, Thiksey & Hemis', 'Méditation dans les gompas et enseignements sur le Vajrayana.'],
      ['Jours 4–5', 'Vallée de Temisgam', 'Hospitalité ladakhie, cercles sacrés, balades hors du temps.'],
      ['Jour 6', 'Lamayuru, le « Moonland »', 'Paysages lunaires et pratiques spirituelles guidées.'],
      ['Jour 7', 'Alchi et Likir', 'Contemplation au bord de l’Indus.'],
      ['Jours 8–9', 'Vallée de la Nubra', 'Col de Khardung-La, dunes de sable et chameaux de Bactriane.'],
      ['Jour 10', 'Diskit & Hunder', 'Monastère de Diskit, vie des villages, prière et silence.'],
      ['Jour 11', 'Retour à Leh', 'Temps d’intégration et de repos.'],
      ['Jours 12–13', 'Shanti Stupa', 'Cérémonie de clôture et derniers enseignements de Sanjeev.'],
      ['Jour 14', 'Retour à Delhi', 'Nuit à Delhi avant les vols internationaux.'],
    ],
    included: [
      'Adhésion à l’association Ayurveda Adventure Tahiti',
      'Vol Delhi – Leh – Delhi',
      'Hébergement en chambre double / twin, pension complète',
      'Tous les transferts et véhicules au Ladakh',
      'Permis « Innerline » et droits d’entrée',
      'Trois séances préparatoires à Tahiti',
    ],
    notIncluded: ['Billet Papeete – Delhi – Papeete', 'Assurance voyage, visa et taxes', 'Pourboires et dépenses personnelles'],
    order: 2,
    bookingMode: 'closed',
  },
]

export const categories = ['Ayurveda', 'Carnet de voyage', 'Méditation', 'Sagesse védique']

export const postSlugs: Record<string, { slug: string; category: string }> = {
  '/post/comprendre-les-4-grands-cousins-ayurveda-yoga-tantra-vedanta': { slug: 'comprendre-les-4-grands-cousins', category: 'Sagesse védique' },
  '/post/tu-ne-peux-grandir-que-si-tu-laisses-tes-limitations-derrière-toi': { slug: 'laisser-ses-limitations-derriere-soi', category: 'Carnet de voyage' },
  '/post/nous-cherchons-toujours-plus-alors-que-nous-avons-déjà-tout': { slug: 'nous-avons-deja-tout', category: 'Carnet de voyage' },
  '/post/nous-devenons-ce-avec-quoi-nous-nourrissons-nos-sens': { slug: 'nourrir-ses-sens', category: 'Ayurveda' },
  '/post/apprendre-a-écouter-son-coeur-et-son-corps': { slug: 'ecouter-son-coeur-et-son-corps', category: 'Carnet de voyage' },
  '/post/fiu-de-tourner-en-rond': { slug: 'fiu-de-tourner-en-rond', category: 'Méditation' },
  '/post/révision-et-vidange': { slug: 'revision-et-vidange', category: 'Ayurveda' },
}
