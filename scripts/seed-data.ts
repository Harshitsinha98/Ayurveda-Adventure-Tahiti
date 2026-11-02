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
      'Bien plus qu’un voyage, cette immersion de 20 jours est une invitation à découvrir une Inde que peu de voyageurs ont la chance d’approcher. Au cœur de la Kumbha Mela, le plus grand rassemblement spirituel au monde, nous vivrons une véritable retraite de yoga, de méditation, de kriyas et de cercles sacrés, entourés des sages, yogis et ascètes venus de tout l’Himalaya.',
      'Accompagnés par Sanjeev Mehta, maître tantrique originaire d’Haridwar, nous pénétrerons au cœur d’une tradition vivante, dans une atmosphère d’une intensité spirituelle exceptionnelle.',
      'Après cette immersion unique, notre voyage nous conduira à travers quelques-uns des lieux les plus emblématiques de l’Inde sacrée : Rishikesh, Varanasi, Khajuraho, Orchha et Agra.',
      'Un voyage en petit groupe (12 participants maximum), conçu pour celles et ceux qui souhaitent vivre l’Inde autrement. « Une expérience hors du temps, au cœur de l’Inde des mystiques. »',
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
      ['Jour 1 · 26.02', 'Arrivée à Delhi, route vers Haridwar · Tigris Estate', 'Accueil à l’aéroport de Delhi puis départ vers les contreforts de l’Himalaya, près de Haridwar. Lodge privé en pleine nature dans la réserve du Tigre de Rajaji : un endroit parfait pour arriver en Inde en douceur.\nEn soirée : conférence de Sanjeev sur le « Cercle Sacré ». Méditation de l’Aura : une pratique qui vise à éveiller les énergies dormantes du chakra racine (Muladhara) en activant les sept chakras majeurs le long de la colonne vertébrale, par le toucher et la visualisation. Des rituels sacrés en cercle ou en binôme créent l’unité et l’harmonie en reliant chacun à l’énergie divine intérieure. Dîner et nuit au Tigris Estate (petit-déjeuner, déjeuner, dîner).'],
      ['Jour 2 · 27.02', 'Tigris Estate', 'Méditation et yoga matinal. Temps libre pour profiter de la nature, se promener et peut-être voir des éléphants sauvages. Petite randonnée vers un temple. Yoga de l’après-midi puis méditation de cercle sacré, la suite de la méditation de l’Aura. Feu de camp au coucher du soleil, avec la possibilité de voir des animaux sauvages.'],
      ['Jour 3 · 28.02', 'Les villages Gujjars et la vallée du Gange, Rishikesh', 'En route vers Rishikesh, nous partons à la rencontre des Gujjars, peuple pastoral vivant au cœur des forêts himalayennes : une occasion rare de découvrir une Inde authentique, loin des circuits habituels. Arrivée à Rishikesh, installation à l’hôtel et première immersion dans cette ville vibrante. Entre ashrams, ponts suspendus et rives du Gange, Rishikesh est un lieu où l’on ralentit naturellement. Nous visiterons plusieurs lieux emblématiques et poursuivrons les séances de yoga, de kriyas et de méditation.'],
      ['Jour 4 · 01.03', 'Les grottes des sages et préparation intérieure', 'Nous monterons jusqu’à une grotte de méditation située au bord du Gange, un lieu d’une grande puissance où de nombreux yogis ont pratiqué pendant des décennies.'],
      ['Jour 5 · 02.03', 'Rishikesh', 'Pratiques à l’hôtel et découverte de la capitale du yoga, nichée au pied de l’Himalaya et baignée par les eaux turquoise du Gange sacré, qui sort ici de la montagne. Visite de l’ashram d’Anandamayi Ma, grande sage, qui a laissé un héritage énergétique puissant.'],
      ['Jour 6 · 03.03', 'En route vers Haridwar, ville sacrée', 'Départ vers Haridwar, l’une des quatre villes les plus sacrées de l’Inde et un haut lieu de pèlerinage depuis des millénaires. L’après-midi, visite du Hari Har Ashram (temple du mercure) et de l’ashram Geeta Kutir, où des centaines de sadhus prennent leurs repas ensemble : un spectacle impressionnant et une belle leçon de vie communautaire. Ensuite, balade au marché coloré Moti Bazaar (objets spirituels, malas, rudrakshas…). Retour à l’hôtel à pied ou en e-rickshaw.'],
      ['Jour 7 · 04.03', 'Randonnée au village de Ramjiwala', 'Une route de montagne traverse une forêt dense de saal et passe sous de majestueux banians centenaires, avec une vue plongeante sur le parc national de Rajaji. Au village reculé de Ramjiwala, niché au pied de l’Himalaya, randonnée à travers les champs en terrasse biologiques de ce village de montagne traditionnel. Nous rencontrerons des familles locales et nous reconnecterons à la nature sur les sentiers de montagne : une expérience accessible à tous, axée sur la pleine conscience.\nAu coucher du soleil, de retour à Haridwar, nous assisterons à la Ganga Aarti avant de nous préparer à entrer dans l’univers unique de la Kumbha Mela.'],
      ['Jour 8 · 05.03', 'Installation à la Kumbha Mela', 'Nous nous installons dans notre camp au cœur de la Kumbha Mela. La journée est consacrée à la découverte des premiers Akharas et des ashrams, et à nos pratiques quotidiennes de yoga, méditation, kriyas et cercles sacrés. En soirée, nous irons à la rencontre des Naga Sadhus pour ressentir l’atmosphère particulière qui précède le grand jour.'],
      ['Jour 9 · 06.03', 'Shahi Snan : le jour le plus sacré de la Kumbha Mela', 'Vers 4 heures du matin, nous rejoindrons l’un des akharas pour assister à l’un des moments les plus extraordinaires de la Kumbha Mela : la procession des Naga Sadhus vers le Gange, suivie du Shahi (ou Amrit) Snan, le Bain Royal. Des milliers de sadhus avancent en procession, au son des conques et des tambours, avant de s’élancer dans les eaux sacrées du fleuve. Un spectacle d’une intensité spirituelle exceptionnelle, que très peu de voyageurs ont la chance de vivre.'],
      ['Jour 10 · 07.03', 'Immersion au cœur de la Kumbha Mela', 'Une journée pour prendre le temps : flâner entre les camps, assister aux enseignements des maîtres spirituels, échanger avec les sadhus, méditer au bord du Gange et vivre pleinement cette expérience hors du commun.'],
      ['Jour 11 · 08.03', 'Deuxième Amrit Snan, puis en route vers la ville éternelle', 'Dernière journée à la Kumbha Mela : Phalgun / Somvati Amavasya, deuxième Amrit Snan (bain dans le Gange). Ensuite, séance de yoga, méditation et cercle sacré, puis chacun·e peut encore se promener sur le festival pour prendre des photos et aller à la rencontre des sadhus et sadhvis.\nEn soirée, nous rejoignons la gare de Haridwar pour le train de nuit vers Varanasi. Voyager en train fait partie intégrante de l’expérience indienne : un moment privilégié pour voir le pays défiler au rythme de ses paysages et de ses rencontres.'],
      ['Jour 12 · 09.03', 'Varanasi, la cité de Shiva', 'En milieu de journée, arrivée à Varanasi, aussi appelée Kashi ou Bénarès, considérée comme la plus ancienne ville habitée au monde et le cœur spirituel de l’Inde. Depuis des millénaires, pèlerins, ascètes et chercheurs spirituels viennent y célébrer le Gange et le dieu Shiva. Après l’installation, découverte des premiers quartiers de la ville puis, au coucher du soleil, le célèbre Dashashwamedh Ghat pour la spectaculaire Ganga Aarti, cérémonie de lumière où les prêtres offrent le feu sacré au fleuve dans une chorégraphie de chants, de cloches et d’encens.'],
      ['Jour 13 · 10.03', 'Sarnath, sur les pas du Bouddha', 'Après le petit-déjeuner, départ pour Sarnath, lieu où le Bouddha donna son premier enseignement après son Éveil. Dans ce havre de paix, nous découvrirons les stupas, les monastères et les jardins qui font de Sarnath l’un des hauts lieux du bouddhisme.'],
      ['Jour 14 · 11.03', 'Khajuraho, l’art du Tantra', 'Très tôt le matin, nous partons pour Khajuraho. Classés au patrimoine mondial de l’UNESCO, ses temples comptent parmi les plus extraordinaires chefs-d’œuvre de l’architecture indienne. Bien au-delà de leur réputation, leurs sculptures racontent une vision profondément spirituelle de l’existence, où le corps, l’amour, la méditation et le sacré ne font qu’un. Inspirés par la philosophie tantrique, ces temples célèbrent la vie dans toutes ses dimensions. En soirée, spectacle son et lumière retraçant l’histoire de ce site exceptionnel.'],
      ['Jour 15 · 12.03', 'Khajuraho et la cité hors du temps d’Orchha', 'La matinée est consacrée à la découverte approfondie des temples de Khajuraho. Nous poursuivons vers Orchha, ancienne capitale des rois Bundela. Bordée par la rivière Betwa et entourée de forêt, cette petite cité semble figée dans le temps, avec ses palais majestueux, ses cénotaphes et ses temples qui témoignent encore de la grandeur de son passé.'],
      ['Jour 16 · 13.03', 'D’Orchha à Agra', 'Après le petit-déjeuner, départ pour Agra, ville de l’amour éternel. Si les conditions le permettent, nous admirerons le Taj Mahal au coucher du soleil, lorsque le marbre blanc se pare de nuances dorées et rosées : l’un des plus beaux spectacles de l’Inde.'],
      ['Jour 17 · 14.03', 'Le Taj Mahal au lever du soleil', 'À l’aube, nous découvrirons le Taj Mahal dans la lumière douce du matin, lorsque le monument révèle toute sa magie. Symbole universel de l’amour, il demeure l’un des chefs-d’œuvre architecturaux les plus admirés au monde. Après le petit-déjeuner, visite du majestueux Fort Rouge d’Agra, ancienne résidence des empereurs moghols, puis route vers Delhi et nuit à l’hôtel près de l’aéroport.'],
      ['Jour 18 · 15.03', 'Au revoir, Inde…', 'Après ces semaines d’immersion au cœur de l’Inde sacrée, transfert vers l’aéroport international de Delhi pour votre vol retour. Nous repartons avec bien plus que des souvenirs : des rencontres inoubliables, des enseignements précieux et l’expérience unique d’avoir vécu la Kumbha Mela de l’intérieur.'],
    ],
    included: [
      'L’hébergement pendant tout le séjour en chambre double / twin (selon disponibilité) : hôtels, camp de la Kumbha Mela, lodges',
      'La pension complète : petit-déjeuner, déjeuner et dîner',
      'Tous les transferts et déplacements à partir de Delhi : train, tuk-tuk, cyclo-pousse, minibus ou autocar selon les étapes',
      'Toutes les visites et excursions prévues dans l’itinéraire',
      'Les services de notre guide local à partir de Haridwar',
      'Le portage des bagages si nécessaire, les frais de parking et de péage',
      '3 ateliers préparatoires en présentiel à Tahiti : la Kumbha Mela, son contexte spirituel et culturel, la tradition védique et différentes pratiques de méditation',
      'Tout au long du voyage : yoga, kriyas et méditations guidés par Eliane',
      'Cercles sacrés, méditations et enseignements des sagesses védiques avec Sanjeev Mehta, maître tantrique d’Haridwar',
      'La participation aux pratiques et cérémonies spirituelles proposées au camp de la Kumbha Mela',
      'L’adhésion à l’association Ayurveda Adventure Tahiti (AAT) pour l’année en cours',
    ],
    notIncluded: [
      'Les vols internationaux Papeete – Delhi – Papeete',
      'Les frais de visa et l’assurance voyage',
      'Les boissons, la blanchisserie et les appels téléphoniques',
      'Les dépenses personnelles',
      'Les excursions ou prestations facultatives',
      'Les massages et soins proposés en supplément',
      'Les pourboires (merci de prévoir une petite somme pour les chauffeurs, guides et personnels des hôtels)',
      'Toute prestation non mentionnée dans le programme',
    ],
    sections: [
      {
        title: 'Hébergement au cœur de la Kumbha Mela',
        text: 'Pendant la Kumbha Mela, nous séjournerons dans un camp spécialement aménagé au cœur de l’événement, pour vivre une véritable immersion tout en bénéficiant d’un bon niveau de confort. Selon les disponibilités, l’hébergement se fera en tentes suisses de style cottage ou en chambres d’hôtel à proximité du site.\n\nNotre partenaire local possède une longue expérience de la Kumbha Mela et organise ce type de camps depuis de nombreuses éditions, en accueillant des voyageurs venus du monde entier.',
        items: [
          'Tentes spacieuses adaptées aux différentes conditions climatiques',
          'Salle de bain et toilettes privatives avec eau chaude et froide',
          'Restauration végétarienne sattvique, indienne et internationale',
          'Wi-Fi et service de premiers secours',
          'Visites guidées des lieux sacrés',
          'Rencontres accompagnées avec les sadhus',
          'Aarti, prières, enseignements spirituels, yoga et méditation',
          'Massages ayurvédiques et soins bien-être sur demande, en supplément',
        ],
      },
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
      'Le Ladakh, ce n’est pas seulement des montagnes et des monastères. C’est un souffle ancien, encore vivant.',
      'C’est une terre où l’on médite à 4 000 mètres d’altitude, où les anciens lisent le ciel et où le silence devient maître. C’est aussi un thé fumant partagé avec une nonne, un enfant qui chante des mantras à l’école, une femme qui récolte l’abricot sacré. C’est un désert de sable à flanc d’Himalaya, des dunes où marchent encore les caravanes du Cachemire, une vallée où les chameaux ont deux bosses et les prières mille ans. Et puis, soudain, l’éclat turquoise d’un lac sacré, aussi vaste qu’un rêve.',
      'Nous serons guidés par Sanjeev Mehta, maître de la sagesse védique, qui nous accompagnera tout au long de cette aventure spirituelle. Nous traverserons des villages traditionnels isolés, visiterons des monastères millénaires perchés dans les montagnes et entrerons dans des lieux de silence et de prière où méditent encore aujourd’hui les moines bouddhistes. Nous marcherons dans les paysages spectaculaires de l’Himalaya, explorerons la vallée de la Nubra, le plus haut désert du monde, et nous reconnecterons à l’essentiel.',
      'Mais ce voyage ne sera pas qu’une exploration du monde extérieur. Il sera aussi un retour à soi : cours de méditation et pratiques yogiques guidés par Sanjeev Mehta et Eliane Koller, cercles sacrés et temps de silence, immersion dans la sagesse bouddhiste et védique, et l’hospitalité ladakhie, entre simplicité, beauté et puissance des traditions vivantes. Un voyage rare, comme suspendu dans le temps, pour retrouver la paix intérieure loin du bruit du monde.',
    ],
    tripStart: '2026-09-06',
    tripEnd: '2026-09-24',
    price: 307000,
    priceNote: 'hors vols Tahiti – Delhi – Tahiti',
    extras: [{ label: 'Extension 3 jours à Agra et au Taj Mahal', price: 30000 }],
    image: 'ladakh-monastere',
    gallery: ['ladakh-village', 'ladakh-dunes', 'ladakh-montagnes', 'ladakh-enfants', 'ladakh-bouddha', 'ladakh-ancienne'],
    highlights: [
      'Accompagnement par Sanjeev Mehta, maître de la sagesse védique (cercles sacrés)',
      'Méditations quotidiennes guidées par Eliane Koller',
      'Lieux rares et puissants, entre désert, sommets himalayens et monastères millénaires',
      'Un groupe intime et authentique, pour vivre une transformation intérieure profonde',
    ],
    itinerary: [
      ['Jour 1', 'Delhi, porte d’entrée vers l’Inde intérieure', 'Arrivée à Delhi et repos dans un hôtel paisible. Première immersion dans l’énergie vibrante de la capitale indienne.'],
      ['Jour 2', 'Envol vers Leh, atterrissage sur le toit du monde', 'Vol spectaculaire au-dessus de l’Himalaya. Arrivée à Leh, acclimatation douce à l’altitude et premier contact avec la paix du Ladakh.'],
      ['Jour 3', 'Monastères de Shey, Thiksey et Hemis : entrée dans le sacré', 'Découverte des grands lieux de sagesse bouddhiste. Méditation dans les gompas et enseignements sur la tradition du Vajrayana.'],
      ['Jours 4–5', 'Vallée de Temisgam : hospitalité ladakhie et silence vibrant', 'Immersion dans la vie locale, partages avec les familles, cercles sacrés, balades dans une nature hors du temps.'],
      ['Jour 6', 'Lamayuru, le « Moonland » et la liberté intérieure', 'Exploration du monastère de Lamayuru, haut lieu de méditation. Paysages lunaires et pratiques spirituelles guidées.'],
      ['Jour 7', 'Retour vers Leh, entre montagnes et mantras', 'Passage par les monastères d’Alchi et de Likir. Contemplation au bord de l’Indus et halte à la colline magnétique.'],
      ['Jours 8–9', 'Vallée de la Nubra, le désert céleste', 'Traversée du col de Khardung-La (5 600 m). Rencontres dans la vallée de la Nubra, dunes de sable, monastères suspendus, chameaux de Bactriane. Méditation face aux sommets.'],
      ['Jour 10', 'Diskit et Hunder, au cœur des traditions', 'Visite du monastère de Diskit et temps libre dans les villages. Observation de la vie quotidienne, prière, silence.'],
      ['Jour 11', 'Retour à Leh : intégration et ressourcement', 'Temps d’intégration. Shopping, repos, cafés tibétains, temple intérieur et extérieur.'],
      ['Jours 12–13', 'Shanti Stupa et rituels de clôture', 'Cérémonie de clôture au stupa de la paix. Derniers enseignements de Sanjeev, partages, gratitude.'],
      ['Jour 14', 'Vol retour vers Delhi', 'Transfert à l’aéroport. Nuit à Delhi avant les vols internationaux : une aventure intérieure touche à sa fin…'],
      ['Option · jours 15–17', 'Agra et le Taj Mahal, beauté intemporelle de l’Inde', 'Prolongez le voyage avec une nuit magique à Agra et la visite du Taj Mahal, symbole éternel d’amour. Un moment de grâce pour conclure cette aventure spirituelle (supplément de 30 000 XPF).'],
    ],
    included: [
      'L’adhésion à l’association Ayurveda Adventure Tahiti (AAT)',
      'Le vol Delhi – Leh – Delhi',
      'L’hébergement pendant tout le séjour en chambre double / twin (selon disponibilité) et la pension complète',
      'Tous les transferts et déplacements, en véhicule de type Ertiga, Innova, Xylo ou Tempo Traveller dans tout le Ladakh (selon le nombre de participants)',
      'Le permis spécial « Innerline », les droits d’entrée au Ladakh et dans les parcs nationaux',
      'Trois séances préparatoires à Tahiti, pour s’initier à la méditation et à la tradition védique',
      'Des méditations régulières, des cours de yoga et, sur demande, des cercles sacrés et l’enseignement des sagesses védiques avec Sanjeev Mehta',
    ],
    notIncluded: [
      'Le billet Papeete – Delhi – Papeete',
      'L’assurance voyage, les taxes d’aéroport et les frais de visa',
      'Les excursions ou programmes facultatifs et les suppléments pour l’option choisie',
      'Les frais personnels, les frais de porteur et les pourboires',
      'La TPS (taxe touristique, à régler sur place, environ 8 000 XPF) et toutes autres taxes applicables',
    ],
    sections: [
      {
        title: 'Chambres individuelles',
        text: 'S’il reste des chambres supplémentaires, il sera possible de les réserver directement sur place en réglant le supplément correspondant. C’est généralement le cas, mais pas toujours.',
      },
    ],
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

// ---------------------------------------------------------------------------
// English translations (stored in the `en` locale of the CMS).
// Translated from Eliane's French texts; Eliane can refine them in the dashboard.
// ---------------------------------------------------------------------------

export const i18nEn = {
  home: {
    eyebrow: 'Ayurveda · Meditation · Yoga · Vedic sciences',
    headline: ['Clear your mind.', 'Restore your energy.', 'Transform your life.'],
    intro:
      'Through Ayurveda and meditation, I help people build simple, powerful rituals to live with more clarity and calm, in Tahiti or online.',
    manifesto:
      'Life is beautiful. Truly beautiful. Fascinating. Sometimes we find it a little too intense. Sometimes a little dull, or unfair, even cruel. But all of this is only a story. The stories we tell ourselves, we choose them. Often without even realising it.',
    manifestoAside: 'Come and learn to tell yourself the story you really want to hear.',
    ritual: {
      title: 'Your day begins long before you open your eyes.',
      text: 'The first 20 minutes after waking influence your mood, your hormones, and even your digestion. A few aligned gestures can transform your daily life, your energy, your way of living.',
    },
    pillars: [
      { title: 'Food', text: 'Nourishing the body according to its constitution.' },
      { title: 'Movement', text: 'A living, supple and present body.' },
      { title: 'Sleep', text: 'Finding the natural rhythm of rest.' },
      { title: 'Emotions', text: 'Welcoming, understanding, letting go.' },
      { title: 'Routine', text: 'Simple rituals, morning and evening.' },
      { title: 'Meditation', text: 'The silence that clears the mind.' },
    ],
  },
  about: {
    lead: 'My path is that of a bridge between worlds.',
    paragraphs: [
      'As a child, I perceived things that no one else seemed to see. But in the Austrian-German setting where I grew up, there was no place for that. Later, living in Kuwait taught me that what we hold to be “real” depends mostly on what we have been taught to believe.',
      'I studied ethnology to understand the many ways of seeing the world, and I went to meet living spiritualities, such as Candomblé in Brazil. There, I saw the invisible take shape again.',
      'It is in Tahiti, where I have lived for 22 years, that I discovered another wisdom: that of the body, of the ancestors, of deep bonds. To learn more, I completed a Master’s year in Oceanian Languages, Cultures and Societies in Tahiti.',
      'In 2020, I trained with Chopra Global, which introduced me to a living, grounded and accessible Ayurveda. I reconnected with India, and with Sanjeev, a long-time guide I had met twenty years earlier.',
      'Today, I teach meditation (Primordial Sound) and Ayurveda as an art of living. I accompany people seeking alignment, and I organise spiritual journeys in the Himalayas, to rediscover silence, strength and the sacred.',
      'Welcome to this space where traditions meet, where the body is listened to, and where every experience is a door to knowledge.',
    ],
    chapters: [
      { place: 'Austria · Germany', text: 'A childhood sensitive to the invisible, in a setting where it had no place.' },
      { place: 'Kuwait · Brazil', text: 'Ethnology, the many ways of seeing the world, Candomblé.' },
      { place: 'Tahiti, for 22 years', text: 'The wisdom of the body, the ancestors and bonds. A Master’s in Oceanian cultures.' },
      { place: 'Chopra Global · India', text: 'Living Ayurveda, Primordial Sound Meditation, and reuniting with Sanjeev.' },
    ],
    credentials: ['Chopra Ayurvedic Health Instructor', 'Chopra Meditation Instructor (Primordial Sound)', 'Master’s year · Oceanian Languages, Cultures and Societies'],
  },
  testimonials: [
    {
      name: 'Patricia S.',
      highlight: 'More serenity, confidence and better balance in daily life.',
      quote:
        'Eliane really helped me manage my emotions better and find a balance between my body and mind. She also taught me relaxation, exercise and nutrition techniques that helped me a lot. I loved the holistic approach of her classes, combining emotional management, meditation, exercise and nutrition. These tools helped me handle stress better, have more energy and improve my sleep.',
    },
    {
      name: 'Sandra F.',
      highlight: 'Every class begins with a meditation that I loved.',
      context: 'Ayurveda Health course',
      quote:
        'Eliane gave me an understanding of what Ayurveda is, of how to listen to my body, and of how to set up a morning and evening routine, time for myself! Knowing the Doshas helped me eat in a less inflammatory way. Understanding how stress affects us, its link with sleep, food and the mind… Eliane gives many tips and advice, with kindness and gentleness. A very enriching course, I recommend it!',
    },
    { name: 'Fanny P.', highlight: 'For finding balance again when life seems to slip away.', quote: 'Very good for learning to rebalance when it feels like life is slipping away from you.' },
  ],
  offerings: {
    'consultation-decouverte': {
      title: 'Discovery consultation',
      kicker: 'A first conversation',
      summary:
        'Before any commitment, an online conversation to get to know each other, share what you are looking for and receive my advice on the guidance that would suit you best.',
      body: ['A caring, listening space to lay the first stone of your path.'],
      cancellationPolicy: 'To cancel or reschedule, please contact me at least 24 hours in advance.',
    },
    'seance-individuelle-en-ligne': {
      title: 'Individual session online',
      kicker: 'A space for transformation',
      summary:
        'Through the lens of Ayurveda, we identify your constitution, your imbalances and the practical levers to restore energy, clarity and balance.',
      body: [
        'We work with the 6 pillars of health: food, movement, sleep, emotions, routine and meditation.',
        'Every session is unique, and sometimes one is enough to tip things over.',
      ],
      cancellationPolicy: 'To cancel or reschedule, please contact me at least 24 hours in advance.',
    },
    'seance-individuelle-presentiel': {
      title: 'Individual session in Punaauia',
      kicker: 'In person, in Tahiti',
      summary: 'The same session, in the calm of my space in Punaauia: your constitution, your imbalances and practical rituals to put in place.',
      body: ['We work with the 6 pillars of health: food, movement, sleep, emotions, routine and meditation.'],
      cancellationPolicy: 'To cancel or reschedule, please contact me at least 24 hours in advance.',
    },
    'suivi-personnalise': {
      title: 'Personal follow-up',
      kicker: 'Ongoing guidance',
      summary: 'A series of sessions for a real, stable and conscious transformation: body, emotions, rhythm, energy.',
      body: [
        'Session after session, we explore the key areas of your life together, drawing on the principles of Ayurveda and mindfulness coaching tools.',
        'You benefit from a caring outside view and practical rituals to apply between sessions. The follow-up is booked with a 4- or 10-session package.',
      ],
      priceNote: 'With a 4- or 10-session package',
      cancellationPolicy: 'To cancel or reschedule, please contact me at least 24 hours in advance.',
    },
    'meditation-son-primordial': {
      title: 'Primordial Sound Meditation course',
      kicker: '10 hours · 5 sessions of 2 hours',
      summary:
        'Learn Primordial Sound Meditation, as taught by Chopra Global: a personal mantra and a simple practice to clear the mind every day.',
      body: ['The 10 hours are spread over 5 sessions of 2 hours. Sessions can be held over two full days, or spread over several weeks.'],
    },
    'formation-ayurveda-sante': {
      title: 'Ayurveda Health course',
      kicker: '10 hours in a small group',
      summary: 'Understand your body, its needs, its rhythm, and learn to take care of it with the essential foundations of Ayurveda.',
      body: [
        'You will discover your constitution, the causes of imbalance, and practical tools to adapt your food, sleep, energy and daily routine.',
        'Living, applicable knowledge to take your health in hand on every level: body, mind, emotions and environment.',
      ],
    },
    'conference-bien-etre': {
      title: 'Wellbeing talk',
      kicker: 'For a team or a group',
      summary: 'An interactive 2-hour talk on Ayurveda or meditation, for a company, a circle of friends or a wellbeing event.',
      body: [
        'These gatherings combine living teaching, concrete examples, simple practices and time for discussion. The talk adapts to your audience and your space.',
        'I bring my projector: all that is needed is a white wall, electricity and a calm place. Between Papara and Papenoo.',
      ],
    },
  } as Record<string, { title: string; kicker: string; summary: string; body: string[]; priceNote?: string; cancellationPolicy?: string }>,
  packages: {
    'carnet-4-seances': { title: '4-session package', summary: 'A single package to commit to the whole journey and keep the guidance consistent.' },
    'carnet-10-seances': {
      title: '10-session package',
      summary: 'Personal follow-up, a caring outside view and practical rituals between sessions. A real, stable and conscious transformation.',
    },
  } as Record<string, { title: string; summary: string }>,
  trips: {
    'kumbha-mela-2027': {
      title: 'Kumbha Mela · The secret India of the mystics',
      kicker: '24 February – 15 March 2027',
      tripRegion: 'Haridwar · Rishikesh · Varanasi · Khajuraho · Orchha · Agra',
      guide: 'With Sanjeev Mehta, tantric master from Haridwar, and Eliane',
      summary:
        'Much more than a journey: a 20-day immersion at the heart of the Kumbha Mela, the largest spiritual gathering in the world, then through some of the most iconic places of sacred India.',
      body: [
        'Much more than a journey, this 20-day immersion is an invitation to discover an India that few travellers ever get close to. At the heart of the Kumbha Mela, the largest spiritual gathering in the world, we will live a true retreat of yoga, meditation, kriyas and sacred circles, surrounded by sages, yogis and ascetics who have come from all over the Himalayas.',
        'Guided by Sanjeev Mehta, a tantric master from Haridwar, we will enter the heart of a living tradition, in an atmosphere of exceptional spiritual intensity.',
        'After this unique immersion, our journey will take us through some of the most iconic places of sacred India: Rishikesh, Varanasi, Khajuraho, Orchha and Agra.',
        'A small-group journey (12 participants maximum), designed for those who wish to experience India differently. “A timeless experience, at the heart of the India of the mystics.”',
      ],
      priceNote: 'excluding international flights Papeete – Delhi – Papeete',
      highlights: [
        'The Shahi Snan, the royal bath of the Naga Sadhus in the Ganges',
        'A comfortable camp at the heart of the Kumbha Mela',
        'Yoga, kriyas and meditations guided every day by Eliane',
        'Sacred circles and Vedic wisdom with Sanjeev Mehta',
        '3 preparatory workshops in person in Tahiti',
      ],
      itinerary: [
        ['Day 1 · 26.02', 'Arrival in Delhi, road to Haridwar · Tigris Estate', 'Welcome at Delhi airport, then departure for the Himalayan foothills near Haridwar. A private lodge in the wild, in the Rajaji Tiger Reserve: the perfect place to arrive gently in India.\nIn the evening: Sanjeev’s talk on the “Sacred Circle”. Aura meditation: a practice that aims to awaken the dormant energies of the root chakra (Muladhara) by activating the seven major chakras along the spine, through touch and visualisation. Sacred rituals in a circle or in pairs create unity and harmony by connecting each person to the divine energy within. Dinner and night at Tigris Estate (breakfast, lunch, dinner).'],
        ['Day 2 · 27.02', 'Tigris Estate', 'Morning meditation and yoga. Free time to enjoy nature, go for a walk and perhaps see wild elephants. A short walk to a temple. Afternoon yoga, then a sacred circle meditation continuing the Aura meditation. A campfire at sunset, with a chance to see wild animals.'],
        ['Day 3 · 28.02', 'The Gujjar villages and the Ganges valley, Rishikesh', 'On the way to Rishikesh, we meet the Gujjars, a pastoral people living deep in the Himalayan forests: a rare chance to discover an authentic India, far from the usual routes. Arrival in Rishikesh, check-in at the hotel and a first immersion in this vibrant town. Between ashrams, suspension bridges and the banks of the Ganges, Rishikesh is a place where you naturally slow down. We visit several iconic places and continue our yoga, kriya and meditation sessions.'],
        ['Day 4 · 01.03', 'The caves of the sages and inner preparation', 'We climb to a meditation cave on the banks of the Ganges, a place of great power where many yogis have practised for decades.'],
        ['Day 5 · 02.03', 'Rishikesh', 'Practice at the hotel and discovery of the yoga capital, nestled at the foot of the Himalayas and bathed by the turquoise waters of the sacred Ganges as it leaves the mountains. A visit to the ashram of Anandamayi Ma, a great sage who left a powerful energetic legacy.'],
        ['Day 6 · 03.03', 'On to Haridwar, the sacred city', 'Departure for Haridwar, one of the four holiest cities in India and a place of pilgrimage for thousands of years. In the afternoon, a visit to the Hari Har Ashram (the mercury temple) and the Geeta Kutir ashram, where hundreds of sadhus eat together: an impressive sight and a lesson in community life. Then a stroll through the colourful Moti Bazaar (spiritual objects, malas, rudrakshas…). Back to the hotel on foot or by e-rickshaw.'],
        ['Day 7 · 04.03', 'Walk to the village of Ramjiwala', 'A mountain road crosses a dense sal forest and passes under majestic century-old banyans, with a view over Rajaji National Park. In the remote village of Ramjiwala, at the foot of the Himalayas, we walk through the organic terraced fields of this traditional mountain village. We meet local families and reconnect with nature on the mountain paths: an experience open to all, centred on mindfulness.\nAt sunset, back in Haridwar, we attend the Ganga Aarti before preparing to enter the unique world of the Kumbha Mela.'],
        ['Day 8 · 05.03', 'Settling in at the Kumbha Mela', 'We settle into our camp at the heart of the Kumbha Mela. The day is devoted to discovering the first Akharas and ashrams, and to our daily practice of yoga, meditation, kriyas and sacred circles. In the evening, we meet the Naga Sadhus to feel the special atmosphere before the great day.'],
        ['Day 9 · 06.03', 'Shahi Snan: the holiest day of the Kumbha Mela', 'Around 4 a.m., we join one of the akharas to witness one of the most extraordinary moments of the Kumbha Mela: the procession of the Naga Sadhus to the Ganges, followed by the Shahi (or Amrit) Snan, the Royal Bath. Thousands of sadhus walk in procession to the sound of conches and drums before plunging into the sacred waters. A sight of exceptional spiritual intensity that very few travellers ever experience.'],
        ['Day 10 · 07.03', 'Immersion at the heart of the Kumbha Mela', 'A day to take your time: wander between the camps, attend the teachings of spiritual masters, talk with the sadhus, meditate by the Ganges and fully live this extraordinary experience.'],
        ['Day 11 · 08.03', 'Second Amrit Snan, then on to the eternal city', 'Last day at the Kumbha Mela: Phalgun / Somvati Amavasya, the second Amrit Snan (bath in the Ganges). Then yoga, meditation and a sacred circle, after which everyone is free to explore the festival, take photos and meet the sadhus and sadhvis.\nIn the evening, we head to Haridwar station for the night train to Varanasi. Travelling by train is part of the Indian experience: a special moment to watch the country go by, with its landscapes and encounters.'],
        ['Day 12 · 09.03', 'Varanasi, the city of Shiva', 'Around midday, we arrive in Varanasi, also called Kashi or Benares, considered the oldest inhabited city in the world and the spiritual heart of India. For thousands of years, pilgrims, ascetics and seekers have come here to celebrate the Ganges and the god Shiva. After settling in, we explore the first neighbourhoods, then at sunset go to the famous Dashashwamedh Ghat for the spectacular Ganga Aarti, a ceremony of light in which priests offer sacred fire to the river amid chants, bells and incense.'],
        ['Day 13 · 10.03', 'Sarnath, in the footsteps of the Buddha', 'After breakfast, we leave for Sarnath, where the Buddha gave his first teaching after his Awakening. In this haven of peace, we discover the stupas, monasteries and gardens that make Sarnath one of the great places of Buddhism.'],
        ['Day 14 · 11.03', 'Khajuraho, the art of Tantra', 'Very early in the morning, we leave for Khajuraho. Listed as a UNESCO World Heritage Site, its temples are among the most extraordinary masterpieces of Indian architecture. Far beyond their reputation, their sculptures express a deeply spiritual vision of life, in which body, love, meditation and the sacred are one. Inspired by tantric philosophy, these temples celebrate life in all its dimensions. In the evening, a sound and light show tells the story of this exceptional site.'],
        ['Day 15 · 12.03', 'Khajuraho and the timeless town of Orchha', 'The morning is devoted to an in-depth visit of the Khajuraho temples. We continue to Orchha, the former capital of the Bundela kings. On the Betwa river and surrounded by forest, this small town seems frozen in time, with majestic palaces, cenotaphs and temples that still show the grandeur of its past.'],
        ['Day 16 · 13.03', 'From Orchha to Agra', 'After breakfast, we leave for Agra, the city of eternal love. If conditions allow, we admire the Taj Mahal at sunset, when the white marble turns golden and pink: one of the most beautiful sights in India.'],
        ['Day 17 · 14.03', 'The Taj Mahal at sunrise', 'At dawn, we discover the Taj Mahal in the soft morning light, when the monument reveals all its magic. A universal symbol of love, it remains one of the most admired architectural masterpieces in the world. After breakfast, we visit Agra’s majestic Red Fort, former residence of the Mughal emperors, then drive to Delhi for a night at a hotel near the airport.'],
        ['Day 18 · 15.03', 'Farewell, India…', 'After these weeks of immersion in sacred India, transfer to Delhi international airport for your flight home. We leave with much more than memories: unforgettable encounters, precious teachings and the unique experience of having lived the Kumbha Mela from the inside.'],
      ],
      included: [
        'Accommodation for the whole stay in double / twin rooms (subject to availability): hotels, Kumbha Mela camp, lodges',
        'Full board: breakfast, lunch and dinner',
        'All transfers and travel from Delhi: train, tuk-tuk, cycle rickshaw, minibus or coach depending on the stage',
        'All visits and excursions in the itinerary',
        'The services of our local guide from Haridwar',
        'Luggage porterage when needed, parking and toll fees',
        '3 preparatory workshops in person in Tahiti: the Kumbha Mela, its spiritual and cultural context, the Vedic tradition and several meditation practices',
        'Throughout the journey: yoga, kriyas and meditations guided by Eliane',
        'Sacred circles, meditations and Vedic teachings with Sanjeev Mehta, tantric master from Haridwar',
        'Taking part in the spiritual practices and ceremonies offered at the Kumbha Mela camp',
        'Membership of the association Ayurveda Adventure Tahiti (AAT) for the current year',
      ],
      notIncluded: [
        'International flights Papeete – Delhi – Papeete',
        'Visa fees and travel insurance',
        'Drinks, laundry and phone calls',
        'Personal expenses',
        'Optional excursions or services',
        'Massages and treatments offered as extras',
        'Tips (please plan a small amount for drivers, guides and hotel staff)',
        'Any service not mentioned in the programme',
      ],
      sections: [
        {
          title: 'Staying at the heart of the Kumbha Mela',
          text: 'During the Kumbha Mela, we will stay in a camp set up at the heart of the event, to live a true immersion while enjoying a good level of comfort. Depending on availability, accommodation will be in cottage-style Swiss tents or in hotel rooms close to the site.\n\nOur local partner has long experience of the Kumbha Mela and has run this kind of camp for many editions, welcoming travellers from all over the world.',
          items: [
            'Spacious tents suited to different weather conditions',
            'Private bathroom and toilet with hot and cold water',
            'Sattvic vegetarian food, Indian and international',
            'Wi-Fi and first-aid service',
            'Guided visits of sacred places',
            'Accompanied meetings with sadhus',
            'Aarti, prayers, spiritual teachings, yoga and meditation',
            'Ayurvedic massages and wellbeing treatments on request, at extra cost',
          ],
        },
      ],
      cancellationPolicy: 'Journey cancellation conditions: see the terms of sale. Travel insurance is strongly recommended.',
    },
    'ladakh-entre-ciel-et-silence': {
      title: 'Ladakh · Between sky and silence',
      kicker: '6 – 24 September 2026',
      tripRegion: 'Leh · Nubra · Lamayuru · Himalaya',
      guide: 'With Sanjeev Mehta and Eliane Koller',
      summary:
        'A land where one meditates at 4,000 metres, where the elders read the sky and where silence becomes the teacher. Ancient monasteries, remote villages and the Nubra desert.',
      body: [
        'Ladakh is not only mountains and monasteries. It is an ancient breath, still alive.',
        'It is a land where people meditate at 4,000 metres, where the elders read the sky and where silence becomes the teacher. It is also a steaming tea shared with a nun, a child singing mantras at school, a woman harvesting the sacred apricot. It is a sand desert on the flank of the Himalayas, dunes still crossed by caravans from Kashmir, a valley where camels have two humps and prayers are a thousand years old. And then, suddenly, the turquoise gleam of a sacred lake, as vast as a dream.',
        'We will be guided by Sanjeev Mehta, a master of Vedic wisdom, throughout this spiritual adventure. We will cross remote traditional villages, visit ancient monasteries perched in the mountains and enter places of silence and prayer where Buddhist monks still meditate today. We will walk through spectacular Himalayan landscapes, explore the Nubra valley, the highest desert in the world, and reconnect with what matters.',
        'But this journey will not only be an exploration of the outer world. It will also be a return to oneself: meditation classes and yogic practice guided by Sanjeev Mehta and Eliane Koller, sacred circles and times of silence, immersion in Buddhist and Vedic wisdom, and Ladakhi hospitality, between simplicity, beauty and the power of living traditions. A rare journey, as if suspended in time, to find inner peace far from the noise of the world.',
      ],
      priceNote: 'excluding flights Tahiti – Delhi – Tahiti',
      highlights: [
        'Guidance by Sanjeev Mehta, master of Vedic wisdom (sacred circles)',
        'Daily meditations guided by Eliane Koller',
        'Rare and powerful places, between desert, Himalayan peaks and ancient monasteries',
        'An intimate, genuine group, for a deep inner transformation',
      ],
      itinerary: [
        ['Day 1', 'Delhi, gateway to inner India', 'Arrival in Delhi and rest in a peaceful hotel. A first immersion in the vibrant energy of the Indian capital.'],
        ['Day 2', 'Flight to Leh, landing on the roof of the world', 'A spectacular flight over the Himalayas. Arrival in Leh, gentle acclimatisation to altitude and a first taste of the peace of Ladakh.'],
        ['Day 3', 'The monasteries of Shey, Thiksey and Hemis: entering the sacred', 'Discovering the great places of Buddhist wisdom. Meditation in the gompas and teachings on the Vajrayana tradition.'],
        ['Days 4–5', 'Temisgam valley: Ladakhi hospitality and vibrant silence', 'Immersion in local life, sharing with families, sacred circles, walks in timeless nature.'],
        ['Day 6', 'Lamayuru, the “Moonland” and inner freedom', 'Exploring Lamayuru monastery, a great place of meditation. Lunar landscapes and guided spiritual practice.'],
        ['Day 7', 'Back towards Leh, between mountains and mantras', 'Stops at the monasteries of Alchi and Likir. Contemplation on the banks of the Indus and a halt at Magnetic Hill.'],
        ['Days 8–9', 'Nubra valley, the celestial desert', 'Crossing the Khardung La pass (5,600 m). Encounters in the Nubra valley, sand dunes, hanging monasteries and Bactrian camels. Meditation facing the peaks.'],
        ['Day 10', 'Diskit and Hunder, at the heart of tradition', 'A visit to Diskit monastery and free time in the villages. Observing daily life, prayer, silence.'],
        ['Day 11', 'Back to Leh: integration and renewal', 'Time for integration. Shopping, rest, Tibetan cafés, inner and outer temples.'],
        ['Days 12–13', 'Shanti Stupa and closing rituals', 'Closing ceremony at the peace stupa. Sanjeev’s final teachings, sharing and gratitude.'],
        ['Day 14', 'Flight back to Delhi', 'Transfer to the airport. A night in Delhi before international flights: an inner adventure comes to an end…'],
        ['Option · days 15–17', 'Agra and the Taj Mahal, the timeless beauty of India', 'Extend the journey with a magical night in Agra and a visit to the Taj Mahal, the eternal symbol of love. A moment of grace to close this spiritual adventure (extra 30,000 XPF).'],
      ],
      included: [
        'Membership of the association Ayurveda Adventure Tahiti (AAT)',
        'The flight Delhi – Leh – Delhi',
        'Accommodation for the whole stay in double / twin rooms (subject to availability) and full board',
        'All transfers and travel, by Ertiga, Innova, Xylo or Tempo Traveller-type vehicle throughout Ladakh (depending on group size)',
        'The special “Inner Line” permit, entrance fees to Ladakh and the national parks',
        'Three preparatory sessions in Tahiti, as an introduction to meditation and the Vedic tradition',
        'Regular meditations, yoga classes and, on request, sacred circles and Vedic teachings with Sanjeev Mehta',
      ],
      notIncluded: [
        'The ticket Papeete – Delhi – Papeete',
        'Travel insurance, airport taxes and visa fees',
        'Optional excursions or programmes and extras for the chosen option',
        'Personal expenses, porter fees and tips',
        'The TPS (tourist tax, paid on site, about 8,000 XPF) and any other applicable taxes',
      ],
      sections: [
        {
          title: 'Single rooms',
          text: 'If extra rooms are available, they can be booked directly on site by paying the corresponding supplement. This is usually the case, but not always.',
        },
      ],
      extras: ['3-day extension to Agra and the Taj Mahal'],
    },
  } as Record<string, Record<string, unknown>>,
  categories: { Ayurveda: 'Ayurveda', 'Carnet de voyage': 'Travel notes', Méditation: 'Meditation', 'Sagesse védique': 'Vedic wisdom' } as Record<string, string>,
  posts: {
    'comprendre-les-4-grands-cousins': {
      title: 'Understanding the 4 great cousins: Ayurveda, Yoga, Tantra, Vedanta',
      excerpt: 'Ayurveda is the practical foundation for keeping body and mind healthy, the basis of all the other paths…',
    },
    'laisser-ses-limitations-derriere-soi': { title: 'You can only grow if you leave your limitations behind.', excerpt: 'So there we were in the Himalayas, driving for hours on winding roads…' },
    'nous-avons-deja-tout': { title: 'We always seek more, when we already have everything.', excerpt: '28 hours after leaving Tahiti, here I am at exit 4 of Delhi’s international airport…' },
    'nourrir-ses-sens': { title: 'We become what we feed our senses.', excerpt: 'Slowly arriving in India. A 15-hour time difference to absorb…' },
    'ecouter-son-coeur-et-son-corps': { title: 'Learning to listen to your heart… and your body!', excerpt: 'In The Alchemist, Paulo Coelho speaks of the soul of the world and of the heart learning to communicate with it…' },
    'fiu-de-tourner-en-rond': { title: '“Fiu” of going round in circles?', excerpt: 'You are capable of far more than you imagine! A seven-week journey through the seven chakras…' },
    'revision-et-vidange': { title: 'Service and oil change', excerpt: 'Vivek sits on his sofa and presents the Panchakarma programme I will follow over the next two weeks…' },
  } as Record<string, { title: string; excerpt: string }>,
}
