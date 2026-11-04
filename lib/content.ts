// Single source of truth for site content. Sourced from new.daffodilnet.com (Nov 2026).
// Values in [square brackets] are placeholders Daffodil must confirm before launch.

export const CONTACT = {
  sales: "+880 1847-334837",
  salesTel: "+8801847334837",
  office: "+8802-48119586",
  officeTel: "+880248119586",
  info: "info@daffodilnet.com",
  noc: "noc@daffodilnet.com",
  hours: "Sat–Thu, 9:00 AM–5:00 PM",
  address: "102/1 Shukrabad (2nd floor), Mirpur Road, Dhanmondi, Dhaka-1207",
  whatsapp: "https://wa.me/8801847334837",
};

export const HOME_PACKAGES = [
  { mbps: 15, price: 500, fit: "Browsing, social media and video calls" },
  { mbps: 20, price: 600, fit: "Online classes and HD streaming" },
  { mbps: 30, price: 700, fit: "A family streaming on several screens" },
  { mbps: 40, price: 750, fit: "Working from home while others stream" },
  { mbps: 50, price: 850, fit: "Many devices busy at the same time" },
  { mbps: 60, price: 1000, fit: "Gaming, large downloads and heavy use" },
];

export const HOSTING_PLANS = [
  { name: "Basic", fit: "For one small website", price: 2299, storage: "2 GB", bandwidth: "50 GB", sites: "1", email: "5", ram: "0.5 GB", cpu: "0.5 cores", io: "10 MB/s" },
  { name: "Starter", fit: "For a growing business", price: 4299, storage: "5 GB", bandwidth: "250 GB", sites: "3", email: "20", ram: "1 GB", cpu: "1 core", io: "20 MB/s", popular: true },
  { name: "Enterprise", fit: "For several active sites", price: 7299, storage: "10 GB", bandwidth: "500 GB", sites: "10", email: "50", ram: "2 GB", cpu: "1.5 cores", io: "[I/O]" },
  { name: "Ultimate", fit: "For busy, high-traffic sites", price: 12299, storage: "20 GB", bandwidth: "750 GB", sites: "20", email: "[email]", ram: "3 GB", cpu: "3 cores", io: "[I/O]" },
];
export const HOSTING_INCLUDES = ["Free SSL", "Daily backup", "Premium control panel", "99.9% uptime", "30-day money-back guarantee", "Free site migration"];

export const VPS_PLANS = [
  { name: "Basic", fit: "For testing and small apps", price: 1500, cpu: "1 vCPU", ram: "2 GB", disk: "20 GB", bw: "2 TB" },
  { name: "Standard", fit: "For a business website or app", price: 2200, cpu: "2 vCPU", ram: "3 GB", disk: "40 GB", bw: "2 TB" },
  { name: "Advanced", fit: "For busy apps and online stores", price: 3500, cpu: "4 vCPU", ram: "4 GB", disk: "60 GB", bw: "2 TB", popular: true },
  { name: "Professional", fit: "For apps that need more memory", price: 4200, cpu: "4 vCPU", ram: "8 GB", disk: "100 GB", bw: "3 TB" },
  { name: "Elite", fit: "For databases and heavy workloads", price: 5500, cpu: "4 vCPU", ram: "16 GB", disk: "200 GB", bw: "3 TB" },
  { name: "Ultimate", fit: "For the most demanding systems", price: 7500, cpu: "6 vCPU", ram: "32 GB", disk: "250 GB", bw: "4 TB" },
];
export const VPS_INCLUDES = ["1 Gbps BDIX port", "2.4 GHz vCPU", "Full root access", "Linux or Windows", "1 IPv4 address", "Monthly billing"];

export const COLO_PLANS = [
  { name: "1U", fit: "One server", price: 8000, ip: "IPv4 /30 subnet", global: "100 Mbps global internet" },
  { name: "2U", fit: "A larger server, or two", price: 15000, ip: "IPv4 /30 subnet", global: "100 Mbps global internet" },
  { name: "5U", fit: "A small stack of servers", price: 42000, ip: "IPv4 /29 subnet", global: "100 Mbps global internet", popular: true },
  { name: "Full cabinet", fit: "42U, locked and yours", price: 100000, ip: "IPv4 /29 subnet", global: "200 Mbps global internet" },
];
export const COLO_INCLUDES = ["1 Gbps BDIX port", "No power limit in year one", "Generator and UPS backup", "Biometric access and CCTV", "24/7 monitoring"];
export const DC_SITES = [
  { name: "Ashulia", where: "Daffodil Smart City, Ashulia, Dhaka", status: "Taking new servers", open: true, points: ["Built to the Tier III standard", "True N+1 redundancy", "Precision (PAC) cooling", "24/7 support"] },
  { name: "Dhanmondi", where: "Shukrabad, Dhanmondi, Dhaka", status: "Fully booked", open: false, points: ["Multiple upstream links", "Redundant UPS and generator power", "Central cooling", "24/7 support"] },
];

export const DOMAINS = [".com", ".net", ".org", ".com.bd"];

export type Pop = { name: string; area: string };
export const POPS: Record<string, Pop[]> = {
  Dhaka: [
    { name: "Monipuri Para", area: "Tejgaon, Dhaka" }, { name: "Aruna Polli", area: "Ashulia, Savar" },
    { name: "Dohar Nawabganj", area: "Dohar and Nawabganj, Dhaka" }, { name: "Shyamoli", area: "Adabor, Dhaka" },
    { name: "Keraniganj", area: "Keraniganj, Dhaka" }, { name: "Matikata", area: "Dhaka Cantonment" },
  ],
  Brahmanbaria: [
    { name: "Singerbill Bazar", area: "Bijoynagar, Brahmanbaria" }, { name: "Bodol Union", area: "Brahmanbaria Sadar" },
    { name: "Sarail", area: "Sarail, Brahmanbaria" }, { name: "Sreepur", area: "Bijoynagar, Brahmanbaria" },
  ],
  Rajshahi: [
    { name: "Rajshahi Sadar", area: "Boalia, Rajshahi" }, { name: "Chandipur", area: "Rajpara, Rajshahi" }, { name: "Rajshahi Sadar (Rafiq)", area: "Rajpara, Rajshahi" },
  ],
  Bogura: [{ name: "Nondigram", area: "Nandigram, Bogura" }, { name: "Hat Karai", area: "Nandigram, Bogura" }],
  Kushtia: [{ name: "Kumarkhali", area: "Kumarkhali, Kushtia" }, { name: "Kushtia", area: "Mirpur, Kushtia" }],
  Netrokona: [{ name: "Janjail", area: "Purbadhala, Netrokona" }, { name: "Netrokona", area: "Netrokona Sadar" }],
  Bhola: [{ name: "Bhola", area: "Bhola Sadar" }],
  Chandpur: [{ name: "Baburhat", area: "Chandpur Sadar" }],
  Chapainawabganj: [{ name: "Chapainawabganj Sadar", area: "Chapainawabganj Sadar" }],
  Cumilla: [{ name: "Burichang", area: "Burichang, Cumilla" }],
  Jashore: [{ name: "Jashore Sadar", area: "Jashore Sadar" }],
  Joypurhat: [{ name: "Kalai", area: "Kalai, Joypurhat" }],
  Madaripur: [{ name: "Kutubpur", area: "Shibchar, Madaripur" }],
  Natore: [{ name: "Bagatipara", area: "Bagatipara, Natore" }],
  Satkhira: [{ name: "Shyamnagar", area: "Shyamnagar, Satkhira" }],
};
export const POP_COUNT = Object.values(POPS).flat().length;

export type Person = { name: string; role: string; photo: string };
const p = (name: string, role: string, photo: string): Person => ({ name, role, photo: `/img/team/${photo}.webp` });
export const LEADERSHIP: Person[] = [
  p("Dr. Md. Sabur Khan", "Chairman", "dr-md-sabur-khan"),
  p("Md. Sabbir Ahamed", "General Manager", "md-sabbir-ahamed-gm"),
  p("Kazi Mahbubul Alam", "Deputy General Manager", "kazi-mahbubul-alam"),
];
export const TEAMS: { name: string; scope: string; people: Person[] }[] = [
  { name: "System & Network", scope: "Network planning, core operations, IP planning, routing, bandwidth & traffic management, infrastructure and systems.", people: [
    p("Mohammad Imran Hossain", "Senior Asst. Manager", "mohammad-imran-hossain"), p("Md. Kabirul Kaiyum", "Asst. Manager", "md-kabirul-kaiyum"),
    p("Md. Al-Amin Talukder", "System Admin", "md-al-amin-talukder"), p("Md. Asadullah Al Mamun", "Jr. System Admin", "md-asadullah-al-mamun"),
    p("Md. Moshfequr Rahman Maruf", "Jr. System Admin", "md-moshfequr-rahman-maruf"),
  ] },
  { name: "Network Operations & Customer Support", scope: "24/7 monitoring, incident handling, link/bandwidth monitoring, troubleshooting, customer support and escalation.", people: [
    p("Md. Al-Mustanjid", "Support Engineer", "md-al-mustanjid"), p("Md. Kamruzzaman", "Asst. Support Engineer", "md-kamruzzaman"),
    p("Md. Sha Alom", "Assistant Support Engineer", "md-sha-alom"), p("Md. Abdullah Al Mamun Khan", "Assistant Support Engineer", "md-abdullah-al-mamun-khan"),
    p("Md. Fatin Ilham", "Assistant Support Engineer", "md-fatin-ilham"), p("Tanvir Mahtab Rafi", "Assistant Support Engineer", "tanvir-mahtab-rafi"),
    p("Md. Mahfuj Islam Shanto", "Asst. Support Engineer (PTE)", "md-mahfuj-islam-shanto"), p("Md. Sabbir Ahmed", "Test Center Assistant (PTE)", "md-sabbir-ahmed-pte"),
    p("Rashed Ahmed", "Test Center Assistant (PTE)", "rashed-ahmed"),
  ] },
  { name: "Finance & Accounts", scope: "Billing, accounting records, payment coordination and financial control.", people: [p("Md. Nazmul Huda Mondol", "Officer (F&A)", "md-nazmul-huda-mondol")] },
  { name: "Sales & Marketing", scope: "Business development, customer relationships and responsible market growth.", people: [p("Md. Hossain Mia", "Business Development Officer", "md-hossain-mia")] },
  { name: "Cable & Field Operations", scope: "Fiber/cable installation, maintenance, repair, field support and last-mile connectivity.", people: [
    p("Md. Abdul Hannan", "Technical Supervisor", "md-abdul-hannan"), p("Md. Shahjahan Nazim", "Team Leader (Fiber/Cable)", "md-shahjahan-nazim"),
    p("Farhan Uddin", "Sr. Cable Man", "farhan-uddin"), p("Md. Ashadul Islam", "Support Assistant", "md-ashadul-islam"),
    p("Md. Asikur Rahaman", "Office Staff & Cable Man", "md-asikur-rahaman"), p("Md. Sajedul Islam Mithu", "Cable Man", "md-sajedul-islam-mithu"),
    p("Md. Shohag Mia", "Cable Man", "md-shohag-mia"),
  ] },
];

export const TIMELINE = [
  { n: "01", year: "2002", t: "Established", b: "Daffodil Online begins as an internet service provider in Bangladesh. The ISPAB directory records DOL as established on 21 July 2002." },
  { n: "02", year: "Growth", t: "Customer-led expansion", b: "Homes, campuses, hospitals and businesses join the network as reach grows beyond core Dhaka." },
  { n: "03", year: "Infra", t: "Broader capability", b: "Hosting, VPS and two data centers — Dhanmondi and Ashulia — extend DOL beyond connectivity." },
  { n: "04", year: "Now", t: "One operating model", b: "Internet, cloud, data centers, billing, support and solutions run as one accountable system." },
  { n: "05", year: "2035", t: "The next horizon", b: "Dependable internet in every corner of Bangladesh, and an AI-enabled digital-infrastructure company." },
];
export const PRINCIPLES = [
  { t: "Reach responsibly", b: "Expand access without turning ambition into an availability promise." },
  { t: "Build as one system", b: "Connect teams, data and workflows instead of creating new operational islands." },
  { t: "Keep people accountable", b: "Use AI to assist work; keep approval, escalation and trust with named owners." },
  { t: "Grow with evidence", b: "Expand capability after real demand, readiness and operating results are visible." },
];

export const COURSES = [
  { id: "isp", tag: "ISP Engineering", t: "ISP Setup and Administration using MikroTik, ONU, Cisco & Juniper", b: "A connected learning path for how an ISP network is planned, built, configured and operated.",
    topics: ["ISP architecture and service flow", "Routing, switching and network administration", "ONU and fiber-access fundamentals", "Operational troubleshooting and administration"],
    who: "Students, support engineers and practitioners who want an end-to-end view of ISP operations." },
  { id: "linux", tag: "Systems Foundation", t: "Linux: Learning from the Core", b: "A durable understanding of Linux from the command line, system structure and operating principles upward.",
    topics: ["Terminal, shell and command structure", "Files, permissions, users and processes", "Packages, services and networking basics", "A foundation for server, cloud and DevOps work"],
    who: "Beginners and working professionals who want fundamentals strong enough for deeper independent learning." },
];

export const CAREER_FIELDS = [
  { t: "System & Network", b: "Network architecture, routing, IP planning, infrastructure and systems" },
  { t: "NOC & Customer Support", b: "Monitoring, incident handling, troubleshooting, escalation and customer care" },
  { t: "Sales & Marketing", b: "Business development, customer relationships and responsible growth" },
  { t: "Finance & Accounts", b: "Billing coordination, accounting records, payments and financial control" },
  { t: "Cable & Field Operations", b: "Fiber installation, maintenance, repair, field support and last-mile delivery" },
];

export const KB_CATEGORIES = ["Internet & Wi-Fi", "Billing & payments", "Domain & hosting", "VPS & servers", "Data center", "Account & security"] as const;
export type KbCat = (typeof KB_CATEGORIES)[number];
export const KB: { cat: KbCat; t: string; b: string; steps: string[] }[] = [
  { cat: "Internet & Wi-Fi", t: "Set up home internet equipment safely", b: "Connect the ONU, router and devices without changing provider-managed settings.", steps: ["Place the ONU and router in an open, ventilated spot.", "Power up the ONU first, wait for its lights to settle, then the router.", "Don't reset provider-managed equipment unless DOL support asks you to."] },
  { cat: "Internet & Wi-Fi", t: "Understand common ONU indicator lights", b: "What PON, LOS and power lights usually mean, and when to call.", steps: ["Power steady: the unit has power.", "PON steady: the fibre link is registered.", "LOS red or blinking: the fibre signal is lost — report it to the NOC."] },
  { cat: "Internet & Wi-Fi", t: "Prepare a slow or intermittent connection report", b: "The details that help the NOC find the fault faster.", steps: ["Note when it started and whether it's constant or on/off.", "Test on a wired device if you can.", "Share your customer ID and area — never your password."] },
  { cat: "Billing & payments", t: "Prepare a billing or invoice question", b: "What to have ready before you contact Accounts.", steps: ["Your customer ID and invoice reference.", "The amount and date in question.", "Keep full card details out of the request."] },
  { cat: "Billing & payments", t: "Payment confirmation and receipt guidance", b: "How to confirm a payment reached DOL.", steps: ["Keep the transaction reference from your payment channel.", "Pay only through approved DOL channels.", "Ask Accounts for a receipt if one wasn't issued."] },
  { cat: "Domain & hosting", t: "Domain registration and ownership checklist", b: "Make sure the domain is registered in your name.", steps: ["Use an owner email you control long-term.", "Check registrant details before paying.", "Keep renewal dates in a shared calendar."] },
  { cat: "Domain & hosting", t: "Prepare a DNS or nameserver change", b: "Change records without taking your site or email down.", steps: ["Export current records first.", "Lower TTL a day before the change.", "Change one thing at a time and verify."] },
  { cat: "Domain & hosting", t: "Report a website or hosting issue", b: "Help support reproduce the problem quickly.", steps: ["The URL and exact error message.", "When it started and what changed.", "Screenshots — but no passwords."] },
  { cat: "VPS & servers", t: "Report a VPS or server incident securely", b: "Share impact and symptoms without exposing access.", steps: ["Server ID, service affected and start time.", "What monitoring or logs show.", "Never send root passwords or private keys."] },
  { cat: "VPS & servers", t: "Prepare a server change request", b: "Resize, OS or network changes with a rollback plan.", steps: ["What you want changed and why.", "A maintenance window that suits you.", "Confirm you have a current backup."] },
  { cat: "Data center", t: "Prepare a colocation enquiry", b: "What Sales needs to size rack space and power.", steps: ["Number of U and expected power draw.", "Bandwidth and IP needs.", "Preferred site and start date."] },
  { cat: "Data center", t: "Prepare a facility access request", b: "Visiting your equipment safely.", steps: ["Names and ID of each visitor.", "Date, time and the work planned.", "Your service reference."] },
  { cat: "Account & security", t: "What never to share with support", b: "DOL will never ask for these.", steps: ["Passwords and OTPs.", "Private keys or full payment card details.", "Unrelated personal documents."] },
  { cat: "Account & security", t: "Report suspected account or service misuse", b: "If you think an account or service is compromised.", steps: ["Contact DOL straight away by phone.", "Describe what you observed and when.", "Change passwords you control — don't share them."] },
];

export const LEGAL: Record<string, { eyebrow: string; title: string; sections: { h: string; p?: string[]; li?: string[] }[] }> = {
  privacy: {
    eyebrow: "Privacy", title: "Your information should have a clear purpose.",
    sections: [
      { h: "Scope of this notice", p: ["This notice covers information handled through the Daffodil Online website and its public journeys for internet coverage, services, support, careers and Academy.", "Separate contracts, service portals or partner platforms may provide additional notices. Where a service-specific notice applies, it takes precedence for that service."] },
      { h: "Information we may collect", p: ["Depending on the action you choose, DOL may need:"], li: ["Name, mobile number, email address and organisation details.", "Area, address, nearby landmark or postcode used to assess serviceability.", "Selected package, service requirement, technical need or support description.", "Account, order, payment and billing records when a commercial journey is connected.", "Career interests, preferred field and professional background.", "Academy course interest and preferred contact purpose.", "Basic technical records such as device, browser, security and service logs needed to operate and protect the website."] },
      { h: "What we never ask for", p: ["DOL should not ask for passwords, OTPs, full payment credentials or unrelated sensitive documents through ordinary public forms."] },
      { h: "Why information is used", li: ["Checking whether an internet or infrastructure request can be served.", "Preparing a quotation, order, installation, renewal or service change.", "Responding to support incidents, complaints and enquiries.", "Preventing fraud, abuse, security incidents and automated submissions.", "Reviewing a career expression of interest or Academy enquiry.", "Improving website reliability, accessibility and service journeys."] },
      { h: "Contact", p: [`Questions about this notice: ${CONTACT.info} or ${CONTACT.office}.`] },
    ],
  },
  terms: {
    eyebrow: "Terms & Conditions", title: "Clear terms for every service journey.",
    sections: [
      { h: "How these terms apply", p: ["These terms govern use of DOL's public website and form a general framework for service enquiries and transactions.", "If documents conflict, the final signed or otherwise accepted service-specific agreement states the order of precedence."] },
      { h: "Website information and eligibility", p: ["Website content helps visitors understand and compare services. It is not, by itself, a guaranteed offer, reservation or activation.", "DOL may reject fraudulent, automated, abusive or unverifiable submissions and may request further information."] },
      { h: "Prices, quotations, orders and payment", p: ["Published prices, discounts, taxes, installation charges, renewal rates and payment options are subject to their stated validity."], li: ["Quotations state scope, validity, taxes, one-time and recurring charges.", "Payment must be made through an approved DOL channel.", "Provisioning begins only after the required checks and payment conditions are satisfied.", "Refund, cancellation and adjustment rules follow the applicable service-specific terms."] },
      { h: "Coverage, feasibility and installation", p: ["A location result, nearby POP or stated coverage area starts qualification; it does not guarantee installation.", "The confirmed activation date, installation boundary, equipment responsibility and charges are communicated through the final order."] },
      { h: "Home and corporate internet", p: ["Internet plans are subject to approved tariff, fair and acceptable use, technical feasibility and installation conditions.", "Corporate or dedicated services may include separately agreed capacity, IP resources, redundancy, monitoring and support terms."] },
      { h: "Domain registration", p: ["Domain availability is not guaranteed until registration is completed by the registry or registrar.", "Registration, transfer, expiry, redemption, dispute and restoration are also governed by the applicable registry policies."] },
    ],
  },
  accessibility: {
    eyebrow: "Accessibility", title: "This website should work for everyone.",
    sections: [
      { h: "Our approach", p: ["DOL aims for this website to be usable by everyone, including people who use a keyboard, screen reader, magnification or a small screen.", "This is a goal we test against, not a certified conformance claim."] },
      { h: "What the website supports today", li: ["Keyboard navigation with a visible focus indicator and a “Skip to main content” link.", "Reduced animation when your device asks for reduced motion.", "Layouts checked from small phones (320 px) to large desktops, with comfortable touch targets.", "Labelled forms, landmark regions and descriptive image text."] },
      { h: "Known limitations", li: ["Bangla is not yet available across the whole website.", "Testing by people using screen readers and browser zoom has not yet been completed.", "Some request forms prepare details on the page only and do not send them. Each form states this."] },
      { h: "Report a barrier", p: ["If something is hard to use, tell DOL. Include the page address, what you were trying to do, and your device and browser."], li: [`Email ${CONTACT.info}`, `Call ${CONTACT.office}`, `Call or WhatsApp ${CONTACT.sales} (${CONTACT.hours})`] },
    ],
  },
};

export const NAV: { label: string; href: string; items?: { label: string; href: string; b: string }[] }[] = [
  { label: "Internet", href: "/internet", items: [
    { label: "Home Internet", href: "/internet", b: "Six packages from ৳500/month." },
    { label: "Corporate Internet", href: "/internet/corporate", b: "Dedicated bandwidth, backup, public IP." },
    { label: "Coverage", href: "/coverage", b: "28 network points in 15 districts." },
  ] },
  { label: "Cloud & Hosting", href: "/cloud-hosting", items: [
    { label: "Domain Registration", href: "/domain", b: "Find and register your name." },
    { label: "Web Hosting", href: "/web-hosting", b: "NVMe, free SSL, daily backups." },
    { label: "VPS", href: "/vps", b: "Your own server on BDIX." },
  ] },
  { label: "Data Center", href: "/data-center", items: [
    { label: "Colocation", href: "/data-center", b: "1U to a full cabinet in Dhaka." },
    { label: "AI Infrastructure", href: "/data-center/ai-infrastructure", b: "GPU systems you can order today." },
  ] },
  { label: "Solutions", href: "/solutions" },
  { label: "Support", href: "/support", items: [
    { label: "Support Center", href: "/support", b: "Guided checks and contact paths." },
    { label: "Knowledge Base", href: "/support/knowledge-base", b: "14 practical articles." },
    { label: "Service Status", href: "/status", b: "Check, then report a problem." },
    { label: "Complaints & Appeals", href: "/complaints", b: "Tell DOL when something's wrong." },
  ] },
];

export const FOOTER_COLS = [
  { h: "Internet", l: [["Home", "/internet"], ["Corporate", "/internet/corporate"], ["Coverage", "/coverage"]] },
  { h: "Cloud", l: [["Domains", "/domain"], ["Hosting", "/web-hosting"], ["VPS", "/vps"]] },
  { h: "Data Center", l: [["Colocation", "/data-center"], ["AI infrastructure", "/data-center/ai-infrastructure"], ["Solutions", "/solutions"]] },
  { h: "Support", l: [["My DOL", "/my-dol"], ["Support", "/support"], ["Knowledge Base", "/support/knowledge-base"], ["Status", "/status"], ["Complaints", "/complaints"]] },
  { h: "Company", l: [["About", "/about"], ["Academy", "/academy"], ["Career", "/career"]] },
] as const;
