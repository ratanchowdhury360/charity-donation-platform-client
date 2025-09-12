// Mock data for Charity Donation Platform

export const mockCampaigns = [
  {
    id: 1,
    title: "Emergency Relief for Flood Victims",
    description: "Help provide immediate relief to families affected by recent floods in Sylhet region. Your donation will provide food, clean water, and emergency shelter.",
    longDescription: "The recent floods in Sylhet have displaced thousands of families, leaving them without basic necessities. This campaign aims to provide immediate relief including food packages, clean drinking water, emergency shelter materials, and medical supplies. Every donation helps us reach more families in need.",
    category: "Emergency Relief",
    goal: 500000,
    raised: 325000,
    currency: "BDT",
    image: "/api/placeholder/400/300",
    images: [
      "/api/placeholder/400/300",
      "/api/placeholder/400/300",
      "/api/placeholder/400/300"
    ],
    charityId: 1,
    charityName: "Bangladesh Red Crescent Society",
    status: "active",
    urgency: "high",
    startDate: "2024-01-15",
    endDate: "2024-03-15",
    donors: 1250,
    verified: true,
    featured: true,
    tags: ["emergency", "flood", "relief", "sylhet"]
  },
  {
    id: 2,
    title: "Education for Underprivileged Children",
    description: "Support education for 100 children from low-income families. Help us provide school supplies, uniforms, and educational materials.",
    longDescription: "This campaign focuses on providing quality education to children from economically disadvantaged families. We will provide school supplies, uniforms, books, and cover tuition fees for 100 children for one academic year. Education is the key to breaking the cycle of poverty.",
    category: "Education",
    goal: 200000,
    raised: 150000,
    currency: "BDT",
    image: "/api/placeholder/400/300",
    images: [
      "/api/placeholder/400/300",
      "/api/placeholder/400/300"
    ],
    charityId: 2,
    charityName: "Teach for Bangladesh",
    status: "active",
    urgency: "medium",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    donors: 89,
    verified: true,
    featured: false,
    tags: ["education", "children", "school", "poverty"]
  },
  {
    id: 3,
    title: "Clean Water Wells for Rural Communities",
    description: "Build 5 clean water wells in rural areas where access to safe drinking water is limited.",
    longDescription: "Many rural communities in Bangladesh lack access to clean, safe drinking water. This campaign will fund the construction of 5 deep tube wells with proper filtration systems, benefiting over 500 families. Each well will be maintained by the local community.",
    category: "Health & Water",
    goal: 300000,
    raised: 180000,
    currency: "BDT",
    image: "/api/placeholder/400/300",
    images: [
      "/api/placeholder/400/300",
      "/api/placeholder/400/300",
      "/api/placeholder/400/300"
    ],
    charityId: 3,
    charityName: "WaterAid Bangladesh",
    status: "active",
    urgency: "high",
    startDate: "2024-02-01",
    endDate: "2024-06-30",
    donors: 67,
    verified: true,
    featured: true,
    tags: ["water", "wells", "rural", "health"]
  },
  {
    id: 4,
    title: "Medical Equipment for Rural Hospital",
    description: "Provide essential medical equipment to a rural hospital serving 50,000 people.",
    longDescription: "The rural hospital in Kushtia district serves over 50,000 people but lacks essential medical equipment. This campaign will provide vital equipment including X-ray machines, ultrasound devices, and laboratory equipment to improve healthcare services.",
    category: "Healthcare",
    goal: 800000,
    raised: 450000,
    currency: "BDT",
    image: "/api/placeholder/400/300",
    images: [
      "/api/placeholder/400/300",
      "/api/placeholder/400/300"
    ],
    charityId: 4,
    charityName: "Bangladesh Medical Association",
    status: "active",
    urgency: "medium",
    startDate: "2024-01-20",
    endDate: "2024-08-20",
    donors: 234,
    verified: true,
    featured: false,
    tags: ["medical", "hospital", "equipment", "healthcare"]
  },
  {
    id: 5,
    title: "Women's Empowerment Training Program",
    description: "Provide vocational training and microfinance opportunities for 200 women in rural areas.",
    longDescription: "This program aims to empower women through vocational training in tailoring, handicrafts, and small business management. Participants will also receive microfinance support to start their own businesses, creating sustainable income opportunities.",
    category: "Women Empowerment",
    goal: 400000,
    raised: 220000,
    currency: "BDT",
    image: "/api/placeholder/400/300",
    images: [
      "/api/placeholder/400/300",
      "/api/placeholder/400/300",
      "/api/placeholder/400/300"
    ],
    charityId: 5,
    charityName: "Women for Women Bangladesh",
    status: "active",
    urgency: "low",
    startDate: "2024-02-15",
    endDate: "2024-11-15",
    donors: 156,
    verified: true,
    featured: false,
    tags: ["women", "empowerment", "training", "microfinance"]
  }
];

export const mockCharities = [
  {
    id: 1,
    name: "Bangladesh Red Crescent Society",
    description: "Leading humanitarian organization providing emergency relief and disaster response services across Bangladesh.",
    logo: "/api/placeholder/100/100",
    coverImage: "/api/placeholder/800/400",
    verified: true,
    rating: 4.8,
    totalCampaigns: 45,
    totalRaised: 2500000,
    establishedYear: 1971,
    location: "Dhaka, Bangladesh",
    website: "https://www.bdrcs.org",
    email: "info@bdrcs.org",
    phone: "+880-2-9876543",
    categories: ["Emergency Relief", "Disaster Response", "Healthcare"],
    teamMembers: [
      { name: "Dr. Ahmed Hassan", role: "Director", image: "/api/placeholder/80/80" },
      { name: "Fatima Begum", role: "Program Manager", image: "/api/placeholder/80/80" },
      { name: "Mohammad Ali", role: "Field Coordinator", image: "/api/placeholder/80/80" }
    ]
  },
  {
    id: 2,
    name: "Teach for Bangladesh",
    description: "Dedicated to providing quality education to underprivileged children and improving educational outcomes.",
    logo: "/api/placeholder/100/100",
    coverImage: "/api/placeholder/800/400",
    verified: true,
    rating: 4.6,
    totalCampaigns: 32,
    totalRaised: 1800000,
    establishedYear: 2012,
    location: "Dhaka, Bangladesh",
    website: "https://www.teachforbangladesh.org",
    email: "contact@teachforbangladesh.org",
    phone: "+880-2-8765432",
    categories: ["Education", "Children", "Youth Development"],
    teamMembers: [
      { name: "Sarah Ahmed", role: "Executive Director", image: "/api/placeholder/80/80" },
      { name: "Rashid Khan", role: "Education Specialist", image: "/api/placeholder/80/80" }
    ]
  },
  {
    id: 3,
    name: "WaterAid Bangladesh",
    description: "Working to ensure everyone has access to clean water, decent toilets, and good hygiene.",
    logo: "/api/placeholder/100/100",
    coverImage: "/api/placeholder/800/400",
    verified: true,
    rating: 4.7,
    totalCampaigns: 28,
    totalRaised: 3200000,
    establishedYear: 1986,
    location: "Dhaka, Bangladesh",
    website: "https://www.wateraid.org/bd",
    email: "bangladesh@wateraid.org",
    phone: "+880-2-7654321",
    categories: ["Water", "Sanitation", "Health"],
    teamMembers: [
      { name: "Dr. Nasreen Begum", role: "Country Director", image: "/api/placeholder/80/80" },
      { name: "Karim Uddin", role: "Program Manager", image: "/api/placeholder/80/80" },
      { name: "Ayesha Rahman", role: "Community Coordinator", image: "/api/placeholder/80/80" }
    ]
  },
  {
    id: 4,
    name: "Bangladesh Medical Association",
    description: "Professional medical organization working to improve healthcare services and medical education.",
    logo: "/api/placeholder/100/100",
    coverImage: "/api/placeholder/800/400",
    verified: true,
    rating: 4.5,
    totalCampaigns: 38,
    totalRaised: 4500000,
    establishedYear: 1972,
    location: "Dhaka, Bangladesh",
    website: "https://www.bma.org.bd",
    email: "secretary@bma.org.bd",
    phone: "+880-2-6543210",
    categories: ["Healthcare", "Medical Education", "Public Health"],
    teamMembers: [
      { name: "Prof. Dr. Md. Iqbal Arslan", role: "President", image: "/api/placeholder/80/80" },
      { name: "Dr. Farhana Yasmin", role: "Secretary General", image: "/api/placeholder/80/80" }
    ]
  },
  {
    id: 5,
    name: "Women for Women Bangladesh",
    description: "Empowering women through education, training, and economic opportunities.",
    logo: "/api/placeholder/100/100",
    coverImage: "/api/placeholder/800/400",
    verified: true,
    rating: 4.4,
    totalCampaigns: 25,
    totalRaised: 1200000,
    establishedYear: 2005,
    location: "Dhaka, Bangladesh",
    website: "https://www.womenforwomenbd.org",
    email: "info@womenforwomenbd.org",
    phone: "+880-2-5432109",
    categories: ["Women Empowerment", "Education", "Economic Development"],
    teamMembers: [
      { name: "Nazma Akter", role: "Executive Director", image: "/api/placeholder/80/80" },
      { name: "Rokeya Begum", role: "Program Coordinator", image: "/api/placeholder/80/80" }
    ]
  }
];

export const mockUsers = [
  {
    id: 1,
    name: "Ahmed Rahman",
    email: "ahmed@example.com",
    role: "donor",
    avatar: "/api/placeholder/80/80",
    joinDate: "2023-06-15",
    totalDonations: 15000,
    campaignsSupported: 8,
    verified: true,
    location: "Dhaka, Bangladesh"
  },
  {
    id: 2,
    name: "Fatima Begum",
    email: "fatima@example.com",
    role: "charity",
    avatar: "/api/placeholder/80/80",
    joinDate: "2023-03-20",
    charityId: 1,
    verified: true,
    location: "Dhaka, Bangladesh"
  },
  {
    id: 3,
    name: "Admin User",
    email: "admin@charityplatform.com",
    role: "admin",
    avatar: "/api/placeholder/80/80",
    joinDate: "2023-01-01",
    verified: true,
    location: "Dhaka, Bangladesh"
  }
];

export const mockDonations = [
  {
    id: 1,
    donorId: 1,
    campaignId: 1,
    amount: 5000,
    currency: "BDT",
    paymentMethod: "bKash",
    status: "completed",
    date: "2024-01-20",
    transactionId: "TXN123456789",
    anonymous: false
  },
  {
    id: 2,
    donorId: 1,
    campaignId: 2,
    amount: 2000,
    currency: "BDT",
    paymentMethod: "PayPal",
    status: "completed",
    date: "2024-01-18",
    transactionId: "TXN987654321",
    anonymous: true
  }
];

export const mockCategories = [
  { id: 1, name: "Emergency Relief", icon: "🚨", description: "Immediate help during disasters" },
  { id: 2, name: "Education", icon: "📚", description: "Supporting education and learning" },
  { id: 3, name: "Healthcare", icon: "🏥", description: "Medical and health services" },
  { id: 4, name: "Women Empowerment", icon: "👩", description: "Empowering women and girls" },
  { id: 5, name: "Environment", icon: "🌱", description: "Environmental conservation" },
  { id: 6, name: "Children", icon: "👶", description: "Supporting children's welfare" },
  { id: 7, name: "Elderly Care", icon: "👴", description: "Caring for senior citizens" },
  { id: 8, name: "Animal Welfare", icon: "🐕", description: "Protecting and caring for animals" }
];

export const mockTestimonials = [
  {
    id: 1,
    name: "Sarah Ahmed",
    role: "Donor",
    image: "/api/placeholder/80/80",
    text: "This platform has made it so easy to support causes I care about. The transparency and regular updates give me confidence in my donations.",
    rating: 5
  },
  {
    id: 2,
    name: "Dr. Mohammad Ali",
    role: "Charity Representative",
    image: "/api/placeholder/80/80",
    text: "The platform has helped us reach more donors and raise funds more effectively. The verification process ensures trust and credibility.",
    rating: 5
  },
  {
    id: 3,
    name: "Fatima Begum",
    role: "Beneficiary",
    image: "/api/placeholder/80/80",
    text: "Thanks to the donors on this platform, my children can now go to school. We are forever grateful for this support.",
    rating: 5
  }
];

export const mockStats = {
  totalDonations: 12500000,
  totalCampaigns: 150,
  totalDonors: 2500,
  totalCharities: 45,
  successRate: 87,
  averageDonation: 5000
};
