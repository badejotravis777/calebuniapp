// utils/dummyData.ts
// NOTE: Removed `export {}` — it was conflicting with named exports and causing redeclaration errors.

// ─── TRIVIA ──────────────────────────────────────────────────────────────────

export const triviaGames = [
    {
      id: "t1",
      question: "Which of these is NOT a college in Caleb University?",
      options: ["COPAS", "COSMAS", "COLENVIT", "COLMED"],
      answer: "COLMED",
    },
    {
      id: "t2",
      question: "What is the primary motto associated with Caleb University?",
      options: [
        "Knowledge and Truth",
        "For God and Humanity",
        "Excellence in Character",
        "Learning and Culture",
      ],
      answer: "For God and Humanity",
    },
  ];
  
  // ─── SCHEDULE GENERATOR ──────────────────────────────────────────────────────
  
  const generateSchedule = (courses: any[]) => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const locations = [
      "Hall A",
      "Main Auditorium",
      "Science Lab",
      "Block B",
      "Lecture Theater",
    ];
    const times = [
      "08:00 - 10:00",
      "10:00 - 12:00",
      "13:00 - 15:00",
      "15:00 - 17:00",
    ];
  
    return courses.map((course, index) => ({
      id: `s-${Math.random().toString(36).substring(7)}`,
      title: course.title.split(":")[0],
      time: times[index % times.length],
      location: locations[index % locations.length],
      day: days[index % days.length],
      lecturer: "TBA",
    }));
  };
  
  // ─── UNIVERSITY DATA ─────────────────────────────────────────────────────────
  // Structure: universityData[Department][Level] = { courses[], schedule[] }
  // Real 100L CSC data is sourced from the official course registration form.
  // All other departments use professional placeholder data following Nigerian
  // university course naming conventions. Update with real data when available.
  
  export const universityData: Record<string, Record<string, { courses: any[]; schedule?: any[] }>> = {
  
    // ═══════════════════════════════════════════════════════════════════════════
    // COLLEGE OF PURE AND APPLIED SCIENCES (COPAS)
    // ═══════════════════════════════════════════════════════════════════════════
  
    "Computer Science": {
      "100": {
        // ✅ REAL DATA — sourced from official 2025/2026 first semester registration form
        courses: [
          { id: "cos101",     title: "COS 101: Introduction to Computing Sciences" },
          { id: "ctc101",     title: "CTC 101: Fundamentals of Tech Plus" },
          { id: "cul-cyb171", title: "CUL-CYB 171: Introduction to Cyber Hygiene" },
          { id: "gst111",     title: "GST 111: Communication in English" },
          { id: "gst121",     title: "GST 121: Character in Leadership I" },
          { id: "mth101",     title: "MTH 101: Elementary Mathematics I" },
          { id: "phy101",     title: "PHY 101: General Physics I" },
          { id: "phy107",     title: "PHY 107: General Practical Physics I" },
          { id: "sta111",     title: "STA 111: Descriptive Statistics" },
        ],
      },
      "200": {
        courses: [
          { id: "csc201", title: "CSC 201: Computer Programming I (Java)" },
          { id: "csc202", title: "CSC 202: Data Structures and Algorithms" },
          { id: "csc203", title: "CSC 203: Object-Oriented Programming" },
          { id: "csc204", title: "CSC 204: Discrete Mathematics" },
          { id: "mth201", title: "MTH 201: Mathematical Methods I" },
          { id: "csc205", title: "CSC 205: Logic Design and Digital Electronics" },
          { id: "gst201", title: "GST 201: Entrepreneurship Skills I" },
        ],
      },
      "300": {
        courses: [
          { id: "csc301", title: "CSC 301: Structured Systems Analysis & Design" },
          { id: "csc302", title: "CSC 302: Operating Systems" },
          { id: "csc303", title: "CSC 303: Database Design and Management" },
          { id: "csc304", title: "CSC 304: Computer Architecture and Organization" },
          { id: "csc305", title: "CSC 305: Computer Networks" },
          { id: "csc306", title: "CSC 306: Theory of Computation" },
          { id: "mth301", title: "MTH 301: Numerical Analysis I" },
        ],
      },
      "400": {
        courses: [
          { id: "csc401", title: "CSC 401: Software Engineering" },
          { id: "csc402", title: "CSC 402: Artificial Intelligence" },
          { id: "csc403", title: "CSC 403: Project Management" },
          { id: "csc404", title: "CSC 404: Information Security" },
          { id: "csc405", title: "CSC 405: Human-Computer Interaction" },
          { id: "csc499", title: "CSC 499: Research Project" },
        ],
      },
    },
  
    "Biochemistry": {
      "100": {
        courses: [
          { id: "bch101", title: "BCH 101: Introduction to Biochemistry" },
          { id: "bio101", title: "BIO 101: General Biology I" },
          { id: "chm101", title: "CHM 101: General Chemistry I" },
          { id: "chm103", title: "CHM 103: Practical Chemistry I" },
          { id: "mth101", title: "MTH 101: Elementary Mathematics I" },
          { id: "gst111", title: "GST 111: Communication in English" },
          { id: "gst121", title: "GST 121: Character in Leadership I" },
          { id: "phy101", title: "PHY 101: General Physics I" },
        ],
      },
      "200": {
        courses: [
          { id: "bch201", title: "BCH 201: General Biochemistry I" },
          { id: "bch202", title: "BCH 202: Metabolism of Carbohydrates" },
          { id: "bch203", title: "BCH 203: Biochemistry Practical I" },
          { id: "chm201", title: "CHM 201: Organic Chemistry I" },
          { id: "bio201", title: "BIO 201: Cell Biology" },
          { id: "gst201", title: "GST 201: Entrepreneurship Skills I" },
        ],
      },
      "300": {
        courses: [
          { id: "bch301", title: "BCH 301: Enzymology" },
          { id: "bch302", title: "BCH 302: Nutritional Biochemistry" },
          { id: "bch303", title: "BCH 303: Molecular Biology I" },
          { id: "bch304", title: "BCH 304: Biochemistry of Hormones" },
          { id: "bch305", title: "BCH 305: Metabolic Biochemistry" },
          { id: "bch306", title: "BCH 306: Biochemistry Practical III" },
        ],
      },
      "400": {
        courses: [
          { id: "bch401", title: "BCH 401: Advanced Molecular Biology" },
          { id: "bch402", title: "BCH 402: Clinical Biochemistry" },
          { id: "bch403", title: "BCH 403: Biotechnology" },
          { id: "bch404", title: "BCH 404: Biochemical Toxicology" },
          { id: "bch499", title: "BCH 499: Research Project" },
        ],
      },
    },
  
    "Chemistry": {
      "100": {
        courses: [
          { id: "chm101", title: "CHM 101: General Chemistry I" },
          { id: "chm103", title: "CHM 103: Practical Chemistry I" },
          { id: "mth101", title: "MTH 101: Elementary Mathematics I" },
          { id: "phy101", title: "PHY 101: General Physics I" },
          { id: "bio101", title: "BIO 101: General Biology I" },
          { id: "gst111", title: "GST 111: Communication in English" },
          { id: "gst121", title: "GST 121: Character in Leadership I" },
        ],
      },
      "200": {
        courses: [
          { id: "chm201", title: "CHM 201: Organic Chemistry I" },
          { id: "chm203", title: "CHM 203: Inorganic Chemistry I" },
          { id: "chm205", title: "CHM 205: Physical Chemistry I" },
          { id: "chm207", title: "CHM 207: Analytical Chemistry I" },
          { id: "mth201", title: "MTH 201: Mathematical Methods I" },
          { id: "gst201", title: "GST 201: Entrepreneurship Skills I" },
        ],
      },
      "300": {
        courses: [
          { id: "chm301", title: "CHM 301: Advanced Organic Chemistry" },
          { id: "chm303", title: "CHM 303: Advanced Inorganic Chemistry" },
          { id: "chm305", title: "CHM 305: Chemical Thermodynamics" },
          { id: "chm307", title: "CHM 307: Instrumental Methods of Analysis" },
          { id: "chm309", title: "CHM 309: Industrial Chemistry" },
        ],
      },
      "400": {
        courses: [
          { id: "chm401", title: "CHM 401: Polymer Chemistry" },
          { id: "chm403", title: "CHM 403: Environmental Chemistry" },
          { id: "chm405", title: "CHM 405: Spectroscopic Methods" },
          { id: "chm407", title: "CHM 407: Chemical Kinetics" },
          { id: "chm499", title: "CHM 499: Research Project" },
        ],
      },
    },
  
    "Mathematics": {
      "100": {
        courses: [
          { id: "mth101", title: "MTH 101: Elementary Mathematics I" },
          { id: "mth103", title: "MTH 103: Elementary Mathematics II" },
          { id: "sta101", title: "STA 101: Introduction to Statistics" },
          { id: "csc101", title: "COS 101: Introduction to Computing Sciences" },
          { id: "phy101", title: "PHY 101: General Physics I" },
          { id: "gst111", title: "GST 111: Communication in English" },
          { id: "gst121", title: "GST 121: Character in Leadership I" },
        ],
      },
      "200": {
        courses: [
          { id: "mth201", title: "MTH 201: Mathematical Methods I" },
          { id: "mth203", title: "MTH 203: Real Analysis I" },
          { id: "mth205", title: "MTH 205: Abstract Algebra I" },
          { id: "mth207", title: "MTH 207: Vector and Tensor Analysis" },
          { id: "sta201", title: "STA 201: Probability Theory I" },
          { id: "gst201", title: "GST 201: Entrepreneurship Skills I" },
        ],
      },
      "300": {
        courses: [
          { id: "mth301", title: "MTH 301: Numerical Analysis I" },
          { id: "mth303", title: "MTH 303: Complex Analysis" },
          { id: "mth305", title: "MTH 305: Differential Equations I" },
          { id: "mth307", title: "MTH 307: Topology I" },
          { id: "sta301", title: "STA 301: Statistical Inference I" },
        ],
      },
      "400": {
        courses: [
          { id: "mth401", title: "MTH 401: Functional Analysis" },
          { id: "mth403", title: "MTH 403: Operations Research" },
          { id: "mth405", title: "MTH 405: Mathematical Modelling" },
          { id: "mth407", title: "MTH 407: Fluid Mechanics" },
          { id: "mth499", title: "MTH 499: Research Project" },
        ],
      },
    },
  
    "Microbiology": {
      "100": {
        courses: [
          { id: "bio101", title: "BIO 101: General Biology I" },
          { id: "bio103", title: "BIO 103: General Biology II" },
          { id: "chm101", title: "CHM 101: General Chemistry I" },
          { id: "mth101", title: "MTH 101: Elementary Mathematics I" },
          { id: "phy101", title: "PHY 101: General Physics I" },
          { id: "gst111", title: "GST 111: Communication in English" },
          { id: "gst121", title: "GST 121: Character in Leadership I" },
        ],
      },
      "200": {
        courses: [
          { id: "mcb201", title: "MCB 201: General Microbiology I" },
          { id: "mcb203", title: "MCB 203: Microbiology Practical I" },
          { id: "bio201", title: "BIO 201: Cell Biology" },
          { id: "chm201", title: "CHM 201: Organic Chemistry I" },
          { id: "mcb205", title: "MCB 205: Introductory Parasitology" },
          { id: "gst201", title: "GST 201: Entrepreneurship Skills I" },
        ],
      },
      "300": {
        courses: [
          { id: "mcb301", title: "MCB 301: Medical Microbiology I" },
          { id: "mcb303", title: "MCB 303: Virology" },
          { id: "mcb305", title: "MCB 305: Food Microbiology" },
          { id: "mcb307", title: "MCB 307: Immunology" },
          { id: "mcb309", title: "MCB 309: Environmental Microbiology" },
        ],
      },
      "400": {
        courses: [
          { id: "mcb401", title: "MCB 401: Industrial Microbiology" },
          { id: "mcb403", title: "MCB 403: Molecular Microbiology" },
          { id: "mcb405", title: "MCB 405: Public Health Microbiology" },
          { id: "mcb499", title: "MCB 499: Research Project" },
        ],
      },
    },
  
    "Microbiology and Industrial Biotechnology": {
      "100": {
        courses: [
          { id: "bio101", title: "BIO 101: General Biology I" },
          { id: "chm101", title: "CHM 101: General Chemistry I" },
          { id: "mth101", title: "MTH 101: Elementary Mathematics I" },
          { id: "phy101", title: "PHY 101: General Physics I" },
          { id: "gst111", title: "GST 111: Communication in English" },
          { id: "gst121", title: "GST 121: Character in Leadership I" },
          { id: "mib101", title: "MIB 101: Introduction to Biotechnology" },
        ],
      },
      "200": {
        courses: [
          { id: "mib201", title: "MIB 201: General Microbiology I" },
          { id: "mib203", title: "MIB 203: Principles of Fermentation" },
          { id: "mib205", title: "MIB 205: Biochemistry for Biotechnologists" },
          { id: "mib207", title: "MIB 207: Genetics I" },
          { id: "gst201", title: "GST 201: Entrepreneurship Skills I" },
        ],
      },
      "300": {
        courses: [
          { id: "mib301", title: "MIB 301: Industrial Fermentation Technology" },
          { id: "mib303", title: "MIB 303: Genetic Engineering I" },
          { id: "mib305", title: "MIB 305: Enzyme Technology" },
          { id: "mib307", title: "MIB 307: Bioprocess Engineering" },
          { id: "mib309", title: "MIB 309: Food Biotechnology" },
        ],
      },
      "400": {
        courses: [
          { id: "mib401", title: "MIB 401: Advanced Genetic Engineering" },
          { id: "mib403", title: "MIB 403: Bioremediation" },
          { id: "mib405", title: "MIB 405: Pharmaceutical Biotechnology" },
          { id: "mib499", title: "MIB 499: Research Project" },
        ],
      },
    },
  
    "Physics": {
      "100": {
        courses: [
          { id: "phy101", title: "PHY 101: General Physics I" },
          { id: "phy103", title: "PHY 103: General Physics II" },
          { id: "phy107", title: "PHY 107: General Practical Physics I" },
          { id: "mth101", title: "MTH 101: Elementary Mathematics I" },
          { id: "chm101", title: "CHM 101: General Chemistry I" },
          { id: "gst111", title: "GST 111: Communication in English" },
          { id: "gst121", title: "GST 121: Character in Leadership I" },
        ],
      },
      "200": {
        courses: [
          { id: "phy201", title: "PHY 201: Classical Mechanics I" },
          { id: "phy203", title: "PHY 203: Electromagnetism I" },
          { id: "phy205", title: "PHY 205: Waves and Optics" },
          { id: "phy207", title: "PHY 207: Modern Physics" },
          { id: "mth201", title: "MTH 201: Mathematical Methods I" },
          { id: "gst201", title: "GST 201: Entrepreneurship Skills I" },
        ],
      },
      "300": {
        courses: [
          { id: "phy301", title: "PHY 301: Quantum Mechanics I" },
          { id: "phy303", title: "PHY 303: Thermodynamics and Statistical Physics" },
          { id: "phy305", title: "PHY 305: Solid State Physics I" },
          { id: "phy307", title: "PHY 307: Electronics I" },
          { id: "mth301", title: "MTH 301: Numerical Analysis I" },
        ],
      },
      "400": {
        courses: [
          { id: "phy401", title: "PHY 401: Nuclear Physics" },
          { id: "phy403", title: "PHY 403: Advanced Quantum Mechanics" },
          { id: "phy405", title: "PHY 405: Atmospheric Physics" },
          { id: "phy407", title: "PHY 407: Laser and Applied Optics" },
          { id: "phy499", title: "PHY 499: Research Project" },
        ],
      },
    },
  
    "Physics with Computational Modeling": {
      "100": {
        courses: [
          { id: "phy101", title: "PHY 101: General Physics I" },
          { id: "phy107", title: "PHY 107: General Practical Physics I" },
          { id: "cos101", title: "COS 101: Introduction to Computing Sciences" },
          { id: "mth101", title: "MTH 101: Elementary Mathematics I" },
          { id: "gst111", title: "GST 111: Communication in English" },
          { id: "gst121", title: "GST 121: Character in Leadership I" },
          { id: "sta111", title: "STA 111: Descriptive Statistics" },
        ],
      },
      "200": {
        courses: [
          { id: "pcm201", title: "PCM 201: Classical Mechanics I" },
          { id: "pcm203", title: "PCM 203: Computational Methods in Physics" },
          { id: "pcm205", title: "PCM 205: Scientific Programming (Python)" },
          { id: "mth201", title: "MTH 201: Mathematical Methods I" },
          { id: "phy205", title: "PHY 205: Electromagnetism I" },
          { id: "gst201", title: "GST 201: Entrepreneurship Skills I" },
        ],
      },
      "300": {
        courses: [
          { id: "pcm301", title: "PCM 301: Quantum Mechanics I" },
          { id: "pcm303", title: "PCM 303: Numerical Methods for Physicists" },
          { id: "pcm305", title: "PCM 305: Simulation and Modelling" },
          { id: "pcm307", title: "PCM 307: Data Analysis and Visualization" },
          { id: "pcm309", title: "PCM 309: Thermodynamics" },
        ],
      },
      "400": {
        courses: [
          { id: "pcm401", title: "PCM 401: Computational Fluid Dynamics" },
          { id: "pcm403", title: "PCM 403: Machine Learning for Scientists" },
          { id: "pcm405", title: "PCM 405: Advanced Modelling Techniques" },
          { id: "pcm499", title: "PCM 499: Research Project" },
        ],
      },
    },
  
    "Plant Science and Biotechnology": {
      "100": {
        courses: [
          { id: "bio101", title: "BIO 101: General Biology I" },
          { id: "bio103", title: "BIO 103: General Biology II" },
          { id: "chm101", title: "CHM 101: General Chemistry I" },
          { id: "mth101", title: "MTH 101: Elementary Mathematics I" },
          { id: "gst111", title: "GST 111: Communication in English" },
          { id: "gst121", title: "GST 121: Character in Leadership I" },
          { id: "psb101", title: "PSB 101: Introduction to Plant Science" },
        ],
      },
      "200": {
        courses: [
          { id: "psb201", title: "PSB 201: Plant Anatomy and Morphology" },
          { id: "psb203", title: "PSB 203: Plant Physiology I" },
          { id: "psb205", title: "PSB 205: Genetics and Heredity" },
          { id: "psb207", title: "PSB 207: Introduction to Plant Biotechnology" },
          { id: "chm201", title: "CHM 201: Organic Chemistry I" },
          { id: "gst201", title: "GST 201: Entrepreneurship Skills I" },
        ],
      },
      "300": {
        courses: [
          { id: "psb301", title: "PSB 301: Plant Pathology" },
          { id: "psb303", title: "PSB 303: Plant Breeding" },
          { id: "psb305", title: "PSB 305: Tissue Culture Technology" },
          { id: "psb307", title: "PSB 307: Agricultural Biotechnology" },
          { id: "psb309", title: "PSB 309: Ecology and Environment" },
        ],
      },
      "400": {
        courses: [
          { id: "psb401", title: "PSB 401: Molecular Plant Biology" },
          { id: "psb403", title: "PSB 403: Ethnobotany and Natural Products" },
          { id: "psb405", title: "PSB 405: Bioinformatics" },
          { id: "psb499", title: "PSB 499: Research Project" },
        ],
      },
    },
  
    "Statistics": {
      "100": {
        courses: [
          { id: "sta101", title: "STA 101: Introduction to Statistics" },
          { id: "sta111", title: "STA 111: Descriptive Statistics" },
          { id: "mth101", title: "MTH 101: Elementary Mathematics I" },
          { id: "mth103", title: "MTH 103: Elementary Mathematics II" },
          { id: "cos101", title: "COS 101: Introduction to Computing Sciences" },
          { id: "gst111", title: "GST 111: Communication in English" },
          { id: "gst121", title: "GST 121: Character in Leadership I" },
        ],
      },
      "200": {
        courses: [
          { id: "sta201", title: "STA 201: Probability Theory I" },
          { id: "sta203", title: "STA 203: Statistical Computing" },
          { id: "sta205", title: "STA 205: Survey Methods" },
          { id: "mth201", title: "MTH 201: Mathematical Methods I" },
          { id: "sta207", title: "STA 207: Regression Analysis I" },
          { id: "gst201", title: "GST 201: Entrepreneurship Skills I" },
        ],
      },
      "300": {
        courses: [
          { id: "sta301", title: "STA 301: Statistical Inference I" },
          { id: "sta303", title: "STA 303: Design of Experiments" },
          { id: "sta305", title: "STA 305: Time Series Analysis" },
          { id: "sta307", title: "STA 307: Multivariate Analysis" },
          { id: "sta309", title: "STA 309: Operations Research I" },
        ],
      },
      "400": {
        courses: [
          { id: "sta401", title: "STA 401: Bayesian Statistics" },
          { id: "sta403", title: "STA 403: Stochastic Processes" },
          { id: "sta405", title: "STA 405: Econometrics" },
          { id: "sta407", title: "STA 407: Quality Control" },
          { id: "sta499", title: "STA 499: Research Project" },
        ],
      },
    },
  
    "Zoology and Aquaculture": {
      "100": {
        courses: [
          { id: "bio101", title: "BIO 101: General Biology I" },
          { id: "bio103", title: "BIO 103: General Biology II" },
          { id: "chm101", title: "CHM 101: General Chemistry I" },
          { id: "mth101", title: "MTH 101: Elementary Mathematics I" },
          { id: "gst111", title: "GST 111: Communication in English" },
          { id: "gst121", title: "GST 121: Character in Leadership I" },
          { id: "zoa101", title: "ZOA 101: Introduction to Zoology" },
        ],
      },
      "200": {
        courses: [
          { id: "zoa201", title: "ZOA 201: Invertebrate Zoology" },
          { id: "zoa203", title: "ZOA 203: Vertebrate Zoology" },
          { id: "zoa205", title: "ZOA 205: Introduction to Aquaculture" },
          { id: "zoa207", title: "ZOA 207: Animal Physiology I" },
          { id: "bio201", title: "BIO 201: Cell Biology" },
          { id: "gst201", title: "GST 201: Entrepreneurship Skills I" },
        ],
      },
      "300": {
        courses: [
          { id: "zoa301", title: "ZOA 301: Fish Biology and Fisheries" },
          { id: "zoa303", title: "ZOA 303: Aquaculture Technology" },
          { id: "zoa305", title: "ZOA 305: Parasitology" },
          { id: "zoa307", title: "ZOA 307: Ecology of Aquatic Systems" },
          { id: "zoa309", title: "ZOA 309: Entomology" },
        ],
      },
      "400": {
        courses: [
          { id: "zoa401", title: "ZOA 401: Advanced Aquaculture" },
          { id: "zoa403", title: "ZOA 403: Wildlife Management" },
          { id: "zoa405", title: "ZOA 405: Toxicology" },
          { id: "zoa499", title: "ZOA 499: Research Project" },
        ],
      },
    },
  
    // ═══════════════════════════════════════════════════════════════════════════
    // COLLEGE OF SOCIAL AND MANAGEMENT SCIENCES (COSMAS)
    // ═══════════════════════════════════════════════════════════════════════════
  
    "Accounting": {
      "100": {
        courses: [
          { id: "acc101", title: "ACC 101: Elements of Accounting I" },
          { id: "acc103", title: "ACC 103: Elements of Accounting II" },
          { id: "eco101", title: "ECO 101: Principles of Economics I" },
          { id: "baf101", title: "BAF 101: Introduction to Business Finance" },
          { id: "mth101", title: "MTH 101: Elementary Mathematics I" },
          { id: "gst111", title: "GST 111: Communication in English" },
          { id: "gst121", title: "GST 121: Character in Leadership I" },
        ],
      },
      "200": {
        courses: [
          { id: "acc201", title: "ACC 201: Financial Accounting I" },
          { id: "acc203", title: "ACC 203: Cost Accounting" },
          { id: "acc205", title: "ACC 205: Principles of Taxation" },
          { id: "eco201", title: "ECO 201: Microeconomics" },
          { id: "baf201", title: "BAF 201: Business Law" },
          { id: "gst201", title: "GST 201: Entrepreneurship Skills I" },
        ],
      },
      "300": {
        courses: [
          { id: "acc301", title: "ACC 301: Advanced Financial Accounting" },
          { id: "acc303", title: "ACC 303: Taxation I" },
          { id: "acc305", title: "ACC 305: Management Accounting" },
          { id: "acc307", title: "ACC 307: Public Sector Accounting" },
          { id: "acc309", title: "ACC 309: Financial Reporting" },
        ],
      },
      "400": {
        courses: [
          { id: "acc401", title: "ACC 401: Auditing and Investigation" },
          { id: "acc403", title: "ACC 403: Advanced Taxation" },
          { id: "acc405", title: "ACC 405: Corporate Governance" },
          { id: "acc407", title: "ACC 407: Accounting Information Systems" },
          { id: "acc499", title: "ACC 499: Research Project" },
        ],
      },
    },
  
    "Banking and Finance": {
      "100": {
        courses: [
          { id: "baf101", title: "BAF 101: Introduction to Banking and Finance" },
          { id: "eco101", title: "ECO 101: Principles of Economics I" },
          { id: "acc101", title: "ACC 101: Elements of Accounting I" },
          { id: "mth101", title: "MTH 101: Elementary Mathematics I" },
          { id: "gst111", title: "GST 111: Communication in English" },
          { id: "gst121", title: "GST 121: Character in Leadership I" },
          { id: "cos101", title: "COS 101: Introduction to Computing Sciences" },
        ],
      },
      "200": {
        courses: [
          { id: "baf201", title: "BAF 201: Principles of Banking" },
          { id: "baf203", title: "BAF 203: Money and Capital Markets" },
          { id: "baf205", title: "BAF 205: Financial Mathematics" },
          { id: "eco201", title: "ECO 201: Microeconomics" },
          { id: "acc201", title: "ACC 201: Financial Accounting I" },
          { id: "gst201", title: "GST 201: Entrepreneurship Skills I" },
        ],
      },
      "300": {
        courses: [
          { id: "baf301", title: "BAF 301: Commercial Banking" },
          { id: "baf303", title: "BAF 303: Investment Analysis" },
          { id: "baf305", title: "BAF 305: Financial Institutions Management" },
          { id: "baf307", title: "BAF 307: Corporate Finance I" },
          { id: "eco301", title: "ECO 301: Macroeconomics" },
        ],
      },
      "400": {
        courses: [
          { id: "baf401", title: "BAF 401: International Finance" },
          { id: "baf403", title: "BAF 403: Risk Management and Insurance" },
          { id: "baf405", title: "BAF 405: Central Banking and Monetary Policy" },
          { id: "baf407", title: "BAF 407: Financial Derivatives" },
          { id: "baf499", title: "BAF 499: Research Project" },
        ],
      },
    },
  
    "Business Administration": {
      "100": {
        courses: [
          { id: "bus101", title: "BUS 101: Introduction to Business" },
          { id: "eco101", title: "ECO 101: Principles of Economics I" },
          { id: "acc101", title: "ACC 101: Elements of Accounting I" },
          { id: "mth101", title: "MTH 101: Elementary Mathematics I" },
          { id: "gst111", title: "GST 111: Communication in English" },
          { id: "gst121", title: "GST 121: Character in Leadership I" },
          { id: "cos101", title: "COS 101: Introduction to Computing Sciences" },
        ],
      },
      "200": {
        courses: [
          { id: "bus201", title: "BUS 201: Principles of Management" },
          { id: "bus203", title: "BUS 203: Business Communication" },
          { id: "bus205", title: "BUS 205: Organizational Behaviour" },
          { id: "eco201", title: "ECO 201: Microeconomics" },
          { id: "bus207", title: "BUS 207: Introduction to Marketing" },
          { id: "gst201", title: "GST 201: Entrepreneurship Skills I" },
        ],
      },
      "300": {
        courses: [
          { id: "bus301", title: "BUS 301: Human Resource Management" },
          { id: "bus303", title: "BUS 303: Production and Operations Management" },
          { id: "bus305", title: "BUS 305: Entrepreneurship" },
          { id: "bus307", title: "BUS 307: Strategic Management I" },
          { id: "bus309", title: "BUS 309: Business Research Methods" },
        ],
      },
      "400": {
        courses: [
          { id: "bus401", title: "BUS 401: Business Policy and Strategy" },
          { id: "bus403", title: "BUS 403: International Business" },
          { id: "bus405", title: "BUS 405: Small Business Management" },
          { id: "bus407", title: "BUS 407: Corporate Governance" },
          { id: "bus499", title: "BUS 499: Research Project" },
        ],
      },
    },
  
    "Criminology": {
      "100": {
        courses: [
          { id: "crm101", title: "CRM 101: Introduction to Criminology" },
          { id: "soc101", title: "SOC 101: Introduction to Sociology" },
          { id: "psc101", title: "PSC 101: Introduction to Political Science" },
          { id: "gst111", title: "GST 111: Communication in English" },
          { id: "gst121", title: "GST 121: Character in Leadership I" },
          { id: "psy101", title: "PSY 101: Introduction to Psychology" },
          { id: "cos101", title: "COS 101: Introduction to Computing Sciences" },
        ],
      },
      "200": {
        courses: [
          { id: "crm201", title: "CRM 201: Theories of Crime" },
          { id: "crm203", title: "CRM 203: Criminal Justice Administration" },
          { id: "crm205", title: "CRM 205: Introduction to Forensic Science" },
          { id: "law201", title: "LAW 201: Elements of Law" },
          { id: "psy201", title: "PSY 201: Social Psychology" },
          { id: "gst201", title: "GST 201: Entrepreneurship Skills I" },
        ],
      },
      "300": {
        courses: [
          { id: "crm301", title: "CRM 301: Penology and Corrections" },
          { id: "crm303", title: "CRM 303: Police Science" },
          { id: "crm305", title: "CRM 305: Cybercrime and Digital Forensics" },
          { id: "crm307", title: "CRM 307: Victimology" },
          { id: "crm309", title: "CRM 309: Drug Abuse and Society" },
        ],
      },
      "400": {
        courses: [
          { id: "crm401", title: "CRM 401: Counter-terrorism and Security" },
          { id: "crm403", title: "CRM 403: Crime Prevention Strategies" },
          { id: "crm405", title: "CRM 405: Juvenile Delinquency" },
          { id: "crm407", title: "CRM 407: White Collar Crime" },
          { id: "crm499", title: "CRM 499: Research Project" },
        ],
      },
    },
  
    "Economics": {
      "100": {
        courses: [
          { id: "eco101", title: "ECO 101: Principles of Economics I" },
          { id: "eco103", title: "ECO 103: Principles of Economics II" },
          { id: "mth101", title: "MTH 101: Elementary Mathematics I" },
          { id: "sta111", title: "STA 111: Descriptive Statistics" },
          { id: "gst111", title: "GST 111: Communication in English" },
          { id: "gst121", title: "GST 121: Character in Leadership I" },
          { id: "cos101", title: "COS 101: Introduction to Computing Sciences" },
        ],
      },
      "200": {
        courses: [
          { id: "eco201", title: "ECO 201: Microeconomic Theory I" },
          { id: "eco203", title: "ECO 203: Macroeconomic Theory I" },
          { id: "eco205", title: "ECO 205: Statistics for Economists" },
          { id: "eco207", title: "ECO 207: History of Economic Thought" },
          { id: "mth201", title: "MTH 201: Mathematical Methods I" },
          { id: "gst201", title: "GST 201: Entrepreneurship Skills I" },
        ],
      },
      "300": {
        courses: [
          { id: "eco301", title: "ECO 301: Advanced Microeconomics" },
          { id: "eco303", title: "ECO 303: Development Economics I" },
          { id: "eco305", title: "ECO 305: Public Finance" },
          { id: "eco307", title: "ECO 307: Econometrics I" },
          { id: "eco309", title: "ECO 309: Nigerian Economic History" },
        ],
      },
      "400": {
        courses: [
          { id: "eco401", title: "ECO 401: International Economics" },
          { id: "eco403", title: "ECO 403: Monetary Economics" },
          { id: "eco405", title: "ECO 405: Labour Economics" },
          { id: "eco407", title: "ECO 407: Environmental Economics" },
          { id: "eco499", title: "ECO 499: Research Project" },
        ],
      },
    },
  
    "Mass Communication": {
      "100": {
        courses: [
          { id: "mac101", title: "MAC 101: Introduction to Mass Communication" },
          { id: "mac103", title: "MAC 103: History of Nigerian Media" },
          { id: "eng101", title: "ENG 101: English Language I" },
          { id: "gst111", title: "GST 111: Communication in English" },
          { id: "gst121", title: "GST 121: Character in Leadership I" },
          { id: "cos101", title: "COS 101: Introduction to Computing Sciences" },
          { id: "soc101", title: "SOC 101: Introduction to Sociology" },
        ],
      },
      "200": {
        courses: [
          { id: "mac201", title: "MAC 201: News Writing and Reporting" },
          { id: "mac203", title: "MAC 203: Introduction to Broadcasting" },
          { id: "mac205", title: "MAC 205: Photojournalism" },
          { id: "mac207", title: "MAC 207: Media Economics" },
          { id: "mac209", title: "MAC 209: Communication Theory" },
          { id: "gst201", title: "GST 201: Entrepreneurship Skills I" },
        ],
      },
      "300": {
        courses: [
          { id: "mac301", title: "MAC 301: Advanced Reporting and Editing" },
          { id: "mac303", title: "MAC 303: Public Relations Practices" },
          { id: "mac305", title: "MAC 305: Advertising" },
          { id: "mac307", title: "MAC 307: Digital Media Production" },
          { id: "mac309", title: "MAC 309: Development Communication" },
        ],
      },
      "400": {
        courses: [
          { id: "mac401", title: "MAC 401: Media Law and Ethics" },
          { id: "mac403", title: "MAC 403: International Communication" },
          { id: "mac405", title: "MAC 405: Broadcast Journalism" },
          { id: "mac407", title: "MAC 407: Social Media and New Media" },
          { id: "mac499", title: "MAC 499: Research Project" },
        ],
      },
    },
  
    "Peace Studies and Conflict Resolution": {
      "100": {
        courses: [
          { id: "pcr101", title: "PCR 101: Introduction to Peace Studies" },
          { id: "psc101", title: "PSC 101: Introduction to Political Science" },
          { id: "soc101", title: "SOC 101: Introduction to Sociology" },
          { id: "gst111", title: "GST 111: Communication in English" },
          { id: "gst121", title: "GST 121: Character in Leadership I" },
          { id: "his101", title: "HIS 101: History of Africa I" },
          { id: "cos101", title: "COS 101: Introduction to Computing Sciences" },
        ],
      },
      "200": {
        courses: [
          { id: "pcr201", title: "PCR 201: Theories of Conflict" },
          { id: "pcr203", title: "PCR 203: Negotiation and Mediation" },
          { id: "pcr205", title: "PCR 205: Human Rights and International Law" },
          { id: "psc201", title: "PSC 201: Comparative Politics" },
          { id: "gst201", title: "GST 201: Entrepreneurship Skills I" },
        ],
      },
      "300": {
        courses: [
          { id: "pcr301", title: "PCR 301: Post-Conflict Reconstruction" },
          { id: "pcr303", title: "PCR 303: Peacekeeping Operations" },
          { id: "pcr305", title: "PCR 305: Ethnic and Religious Conflicts" },
          { id: "pcr307", title: "PCR 307: Diplomacy and International Relations" },
          { id: "pcr309", title: "PCR 309: Security Studies" },
        ],
      },
      "400": {
        courses: [
          { id: "pcr401", title: "PCR 401: Transitional Justice" },
          { id: "pcr403", title: "PCR 403: African Peace and Security Architecture" },
          { id: "pcr405", title: "PCR 405: Terrorism and Counter-terrorism" },
          { id: "pcr499", title: "PCR 499: Research Project" },
        ],
      },
    },
  
    "Political Science": {
      "100": {
        courses: [
          { id: "psc101", title: "PSC 101: Introduction to Political Science" },
          { id: "psc103", title: "PSC 103: Introduction to Nigerian Government" },
          { id: "his101", title: "HIS 101: History of Africa I" },
          { id: "gst111", title: "GST 111: Communication in English" },
          { id: "gst121", title: "GST 121: Character in Leadership I" },
          { id: "eco101", title: "ECO 101: Principles of Economics I" },
          { id: "cos101", title: "COS 101: Introduction to Computing Sciences" },
        ],
      },
      "200": {
        courses: [
          { id: "psc201", title: "PSC 201: Comparative Politics" },
          { id: "psc203", title: "PSC 203: Introduction to International Relations" },
          { id: "psc205", title: "PSC 205: Public Administration I" },
          { id: "psc207", title: "PSC 207: Political Thought I" },
          { id: "gst201", title: "GST 201: Entrepreneurship Skills I" },
        ],
      },
      "300": {
        courses: [
          { id: "psc301", title: "PSC 301: Nigerian Government and Politics" },
          { id: "psc303", title: "PSC 303: African Politics" },
          { id: "psc305", title: "PSC 305: International Law" },
          { id: "psc307", title: "PSC 307: Political Economy" },
          { id: "psc309", title: "PSC 309: Research Methods in Social Science" },
        ],
      },
      "400": {
        courses: [
          { id: "psc401", title: "PSC 401: Democracy and Governance" },
          { id: "psc403", title: "PSC 403: Foreign Policy Analysis" },
          { id: "psc405", title: "PSC 405: Elections and Electoral Systems" },
          { id: "psc407", title: "PSC 407: Civil Society and NGOs" },
          { id: "psc499", title: "PSC 499: Research Project" },
        ],
      },
    },
  
    "Psychology": {
      "100": {
        courses: [
          { id: "psy101", title: "PSY 101: Introduction to Psychology" },
          { id: "bio101", title: "BIO 101: General Biology I" },
          { id: "soc101", title: "SOC 101: Introduction to Sociology" },
          { id: "sta111", title: "STA 111: Descriptive Statistics" },
          { id: "gst111", title: "GST 111: Communication in English" },
          { id: "gst121", title: "GST 121: Character in Leadership I" },
          { id: "cos101", title: "COS 101: Introduction to Computing Sciences" },
        ],
      },
      "200": {
        courses: [
          { id: "psy201", title: "PSY 201: Social Psychology" },
          { id: "psy203", title: "PSY 203: Developmental Psychology" },
          { id: "psy205", title: "PSY 205: Physiological Psychology" },
          { id: "psy207", title: "PSY 207: Research Methods in Psychology" },
          { id: "sta201", title: "STA 201: Probability Theory I" },
          { id: "gst201", title: "GST 201: Entrepreneurship Skills I" },
        ],
      },
      "300": {
        courses: [
          { id: "psy301", title: "PSY 301: Abnormal Psychology" },
          { id: "psy303", title: "PSY 303: Industrial and Organizational Psychology" },
          { id: "psy305", title: "PSY 305: Educational Psychology" },
          { id: "psy307", title: "PSY 307: Health Psychology" },
          { id: "psy309", title: "PSY 309: Counselling Psychology I" },
        ],
      },
      "400": {
        courses: [
          { id: "psy401", title: "PSY 401: Clinical Psychology" },
          { id: "psy403", title: "PSY 403: Neuropsychology" },
          { id: "psy405", title: "PSY 405: Forensic Psychology" },
          { id: "psy407", title: "PSY 407: Community Psychology" },
          { id: "psy499", title: "PSY 499: Research Project" },
        ],
      },
    },
  
    "Taxation": {
      "100": {
        courses: [
          { id: "tax101", title: "TAX 101: Introduction to Taxation" },
          { id: "acc101", title: "ACC 101: Elements of Accounting I" },
          { id: "eco101", title: "ECO 101: Principles of Economics I" },
          { id: "law101", title: "LAW 101: Elements of Nigerian Law" },
          { id: "mth101", title: "MTH 101: Elementary Mathematics I" },
          { id: "gst111", title: "GST 111: Communication in English" },
          { id: "gst121", title: "GST 121: Character in Leadership I" },
        ],
      },
      "200": {
        courses: [
          { id: "tax201", title: "TAX 201: Principles of Income Tax" },
          { id: "tax203", title: "TAX 203: Company Taxation I" },
          { id: "acc201", title: "ACC 201: Financial Accounting I" },
          { id: "tax205", title: "TAX 205: Tax Law and Administration" },
          { id: "gst201", title: "GST 201: Entrepreneurship Skills I" },
        ],
      },
      "300": {
        courses: [
          { id: "tax301", title: "TAX 301: Advanced Income Tax" },
          { id: "tax303", title: "TAX 303: Value Added Tax" },
          { id: "tax305", title: "TAX 305: International Taxation" },
          { id: "tax307", title: "TAX 307: Tax Planning and Management" },
          { id: "acc301", title: "ACC 301: Advanced Financial Accounting" },
        ],
      },
      "400": {
        courses: [
          { id: "tax401", title: "TAX 401: Petroleum Profits Tax" },
          { id: "tax403", title: "TAX 403: Tax Audit and Investigation" },
          { id: "tax405", title: "TAX 405: Estate Duty and Capital Gains Tax" },
          { id: "tax407", title: "TAX 407: Comparative Tax Systems" },
          { id: "tax499", title: "TAX 499: Research Project" },
        ],
      },
    },
  
    // ═══════════════════════════════════════════════════════════════════════════
    // COLLEGE OF ENVIRONMENTAL SCIENCES AND MANAGEMENT (COLENVIT)
    // ═══════════════════════════════════════════════════════════════════════════
  
    "Architecture": {
      "100": {
        courses: [
          { id: "arc101", title: "ARC 101: Introduction to Architecture" },
          { id: "arc103", title: "ARC 103: Architectural Graphics I" },
          { id: "arc105", title: "ARC 105: History of Architecture I" },
          { id: "mth101", title: "MTH 101: Elementary Mathematics I" },
          { id: "phy101", title: "PHY 101: General Physics I" },
          { id: "gst111", title: "GST 111: Communication in English" },
          { id: "gst121", title: "GST 121: Character in Leadership I" },
        ],
      },
      "200": {
        courses: [
          { id: "arc201", title: "ARC 201: Architectural Design I" },
          { id: "arc203", title: "ARC 203: History of Architecture II" },
          { id: "arc205", title: "ARC 205: Structures I" },
          { id: "arc207", title: "ARC 207: Building Technology I" },
          { id: "arc209", title: "ARC 209: Environmental Science for Architects" },
          { id: "gst201", title: "GST 201: Entrepreneurship Skills I" },
        ],
      },
      "300": {
        courses: [
          { id: "arc301", title: "ARC 301: Architectural Design III" },
          { id: "arc303", title: "ARC 303: Urban Design and Planning" },
          { id: "arc305", title: "ARC 305: Building Construction Technology" },
          { id: "arc307", title: "ARC 307: Professional Practice I" },
          { id: "arc309", title: "ARC 309: Structural Systems" },
        ],
      },
      "400": {
        courses: [
          { id: "arc401", title: "ARC 401: Advanced Architectural Design" },
          { id: "arc403", title: "ARC 403: Sustainable Architecture" },
          { id: "arc405", title: "ARC 405: Housing and Community Development" },
          { id: "arc407", title: "ARC 407: Architectural Acoustics and Lighting" },
          { id: "arc499", title: "ARC 499: Design Thesis" },
        ],
      },
    },
  
    "Building": {
      "100": {
        courses: [
          { id: "bld101", title: "BLD 101: Introduction to Building Technology" },
          { id: "arc103", title: "ARC 103: Architectural Graphics I" },
          { id: "phy101", title: "PHY 101: General Physics I" },
          { id: "mth101", title: "MTH 101: Elementary Mathematics I" },
          { id: "gst111", title: "GST 111: Communication in English" },
          { id: "gst121", title: "GST 121: Character in Leadership I" },
          { id: "chm101", title: "CHM 101: General Chemistry I" },
        ],
      },
      "200": {
        courses: [
          { id: "bld201", title: "BLD 201: Building Materials" },
          { id: "bld203", title: "BLD 203: Structural Mechanics" },
          { id: "bld205", title: "BLD 205: Site Surveying" },
          { id: "bld207", title: "BLD 207: Construction Technology I" },
          { id: "gst201", title: "GST 201: Entrepreneurship Skills I" },
        ],
      },
      "300": {
        courses: [
          { id: "bld301", title: "BLD 301: Advanced Construction Technology" },
          { id: "bld303", title: "BLD 303: Building Services" },
          { id: "bld305", title: "BLD 305: Project Management I" },
          { id: "bld307", title: "BLD 307: Reinforced Concrete Design" },
          { id: "bld309", title: "BLD 309: Building Law and Contracts" },
        ],
      },
      "400": {
        courses: [
          { id: "bld401", title: "BLD 401: High-Rise Construction" },
          { id: "bld403", title: "BLD 403: Building Maintenance Management" },
          { id: "bld405", title: "BLD 405: Sustainable Building Practices" },
          { id: "bld499", title: "BLD 499: Research Project" },
        ],
      },
    },
  
    "Environmental Management and Toxicology": {
      "100": {
        courses: [
          { id: "emt101", title: "EMT 101: Introduction to Environmental Science" },
          { id: "bio101", title: "BIO 101: General Biology I" },
          { id: "chm101", title: "CHM 101: General Chemistry I" },
          { id: "gst111", title: "GST 111: Communication in English" },
          { id: "gst121", title: "GST 121: Character in Leadership I" },
          { id: "mth101", title: "MTH 101: Elementary Mathematics I" },
          { id: "phy101", title: "PHY 101: General Physics I" },
        ],
      },
      "200": {
        courses: [
          { id: "emt201", title: "EMT 201: Environmental Chemistry" },
          { id: "emt203", title: "EMT 203: Introduction to Toxicology" },
          { id: "emt205", title: "EMT 205: Ecology and Environmental Systems" },
          { id: "emt207", title: "EMT 207: Environmental Law and Policy" },
          { id: "gst201", title: "GST 201: Entrepreneurship Skills I" },
        ],
      },
      "300": {
        courses: [
          { id: "emt301", title: "EMT 301: Industrial Toxicology" },
          { id: "emt303", title: "EMT 303: Environmental Impact Assessment" },
          { id: "emt305", title: "EMT 305: Waste Management" },
          { id: "emt307", title: "EMT 307: Water Resource Management" },
          { id: "emt309", title: "EMT 309: Air and Noise Pollution" },
        ],
      },
      "400": {
        courses: [
          { id: "emt401", title: "EMT 401: Ecotoxicology" },
          { id: "emt403", title: "EMT 403: Remediation Technologies" },
          { id: "emt405", title: "EMT 405: Climate Change and Adaptation" },
          { id: "emt499", title: "EMT 499: Research Project" },
        ],
      },
    },
  
    "Estate Management": {
      "100": {
        courses: [
          { id: "esm101", title: "ESM 101: Introduction to Estate Management" },
          { id: "eco101", title: "ECO 101: Principles of Economics I" },
          { id: "law101", title: "LAW 101: Elements of Nigerian Law" },
          { id: "mth101", title: "MTH 101: Elementary Mathematics I" },
          { id: "gst111", title: "GST 111: Communication in English" },
          { id: "gst121", title: "GST 121: Character in Leadership I" },
          { id: "arc103", title: "ARC 103: Architectural Graphics I" },
        ],
      },
      "200": {
        courses: [
          { id: "esm201", title: "ESM 201: Land Law and Tenure" },
          { id: "esm203", title: "ESM 203: Building Technology for Estate Managers" },
          { id: "esm205", title: "ESM 205: Property Valuation I" },
          { id: "esm207", title: "ESM 207: Urban and Regional Planning" },
          { id: "gst201", title: "GST 201: Entrepreneurship Skills I" },
        ],
      },
      "300": {
        courses: [
          { id: "esm301", title: "ESM 301: Property Management" },
          { id: "esm303", title: "ESM 303: Advanced Valuation" },
          { id: "esm305", title: "ESM 305: Real Estate Investment" },
          { id: "esm307", title: "ESM 307: Estate Agency and Brokerage" },
          { id: "esm309", title: "ESM 309: Nigerian Land Law" },
        ],
      },
      "400": {
        courses: [
          { id: "esm401", title: "ESM 401: Compulsory Acquisition and Compensation" },
          { id: "esm403", title: "ESM 403: Real Estate Finance" },
          { id: "esm405", title: "ESM 405: Housing Economics" },
          { id: "esm499", title: "ESM 499: Research Project" },
        ],
      },
    },
  
    "Quantity Surveying": {
      "100": {
        courses: [
          { id: "qus101", title: "QUS 101: Introduction to Quantity Surveying" },
          { id: "arc103", title: "ARC 103: Architectural Graphics I" },
          { id: "mth101", title: "MTH 101: Elementary Mathematics I" },
          { id: "eco101", title: "ECO 101: Principles of Economics I" },
          { id: "gst111", title: "GST 111: Communication in English" },
          { id: "gst121", title: "GST 121: Character in Leadership I" },
          { id: "phy101", title: "PHY 101: General Physics I" },
        ],
      },
      "200": {
        courses: [
          { id: "qus201", title: "QUS 201: Measurement of Building Works I" },
          { id: "qus203", title: "QUS 203: Building Technology for QS" },
          { id: "qus205", title: "QUS 205: Construction Economics I" },
          { id: "qus207", title: "QUS 207: Site and Services Management" },
          { id: "gst201", title: "GST 201: Entrepreneurship Skills I" },
        ],
      },
      "300": {
        courses: [
          { id: "qus301", title: "QUS 301: Measurement of Civil Engineering Works" },
          { id: "qus303", title: "QUS 303: Contract Administration" },
          { id: "qus305", title: "QUS 305: Project Cost Management" },
          { id: "qus307", title: "QUS 307: Procurement and Tendering" },
          { id: "qus309", title: "QUS 309: Dispute Resolution in Construction" },
        ],
      },
      "400": {
        courses: [
          { id: "qus401", title: "QUS 401: Life Cycle Costing" },
          { id: "qus403", title: "QUS 403: Value Engineering" },
          { id: "qus405", title: "QUS 405: Facilities Management" },
          { id: "qus499", title: "QUS 499: Research Project" },
        ],
      },
    },
  
    // ═══════════════════════════════════════════════════════════════════════════
    // COLLEGE OF ARTS, DESIGN AND MANAGEMENT (COLADM)
    // ═══════════════════════════════════════════════════════════════════════════
  
    "Christian Religious Studies": {
      "100": {
        courses: [
          { id: "crs101", title: "CRS 101: Introduction to Christian Religious Studies" },
          { id: "crs103", title: "CRS 103: Old Testament Studies I" },
          { id: "crs105", title: "CRS 105: Introduction to Biblical Hebrew" },
          { id: "phi101", title: "PHI 101: Introduction to Philosophy" },
          { id: "gst111", title: "GST 111: Communication in English" },
          { id: "gst121", title: "GST 121: Character in Leadership I" },
          { id: "his101", title: "HIS 101: History of Africa I" },
        ],
      },
      "200": {
        courses: [
          { id: "crs201", title: "CRS 201: New Testament Studies I" },
          { id: "crs203", title: "CRS 203: Church History I" },
          { id: "crs205", title: "CRS 205: Christian Ethics" },
          { id: "crs207", title: "CRS 207: Comparative Religion" },
          { id: "gst201", title: "GST 201: Entrepreneurship Skills I" },
        ],
      },
      "300": {
        courses: [
          { id: "crs301", title: "CRS 301: Theology I" },
          { id: "crs303", title: "CRS 303: Biblical Hermeneutics" },
          { id: "crs305", title: "CRS 305: African Christianity" },
          { id: "crs307", title: "CRS 307: Christian Missions" },
          { id: "crs309", title: "CRS 309: Pentecostalism in Africa" },
        ],
      },
      "400": {
        courses: [
          { id: "crs401", title: "CRS 401: Contemporary Christian Issues" },
          { id: "crs403", title: "CRS 403: Christian Education" },
          { id: "crs405", title: "CRS 405: Christianity and Society" },
          { id: "crs499", title: "CRS 499: Research Project" },
        ],
      },
    },
  
    "English and Literary Studies": {
      "100": {
        courses: [
          { id: "eng101", title: "ENG 101: English Language I" },
          { id: "eng103", title: "ENG 103: Introduction to Literature" },
          { id: "eng105", title: "ENG 105: Introduction to Linguistics" },
          { id: "his101", title: "HIS 101: History of Africa I" },
          { id: "gst111", title: "GST 111: Communication in English" },
          { id: "gst121", title: "GST 121: Character in Leadership I" },
          { id: "cos101", title: "COS 101: Introduction to Computing Sciences" },
        ],
      },
      "200": {
        courses: [
          { id: "eng201", title: "ENG 201: Advanced English Composition" },
          { id: "eng203", title: "ENG 203: African Literature I" },
          { id: "eng205", title: "ENG 205: Introduction to Drama" },
          { id: "eng207", title: "ENG 207: Morphology and Syntax" },
          { id: "gst201", title: "GST 201: Entrepreneurship Skills I" },
        ],
      },
      "300": {
        courses: [
          { id: "eng301", title: "ENG 301: Phonology of English" },
          { id: "eng303", title: "ENG 303: Prose Fiction" },
          { id: "eng305", title: "ENG 305: Literary Theory and Criticism" },
          { id: "eng307", title: "ENG 307: Nigerian Literature" },
          { id: "eng309", title: "ENG 309: Creative Writing" },
        ],
      },
      "400": {
        courses: [
          { id: "eng401", title: "ENG 401: Semantics" },
          { id: "eng403", title: "ENG 403: Post-Colonial Literature" },
          { id: "eng405", title: "ENG 405: Discourse Analysis" },
          { id: "eng407", title: "ENG 407: Applied Linguistics" },
          { id: "eng499", title: "ENG 499: Research Project" },
        ],
      },
    },
  
    "History and Diplomatic Studies": {
      "100": {
        courses: [
          { id: "his101", title: "HIS 101: History of Africa I" },
          { id: "his103", title: "HIS 103: Introduction to World History" },
          { id: "psc101", title: "PSC 101: Introduction to Political Science" },
          { id: "eng101", title: "ENG 101: English Language I" },
          { id: "gst111", title: "GST 111: Communication in English" },
          { id: "gst121", title: "GST 121: Character in Leadership I" },
          { id: "cos101", title: "COS 101: Introduction to Computing Sciences" },
        ],
      },
      "200": {
        courses: [
          { id: "his201", title: "HIS 201: Nigerian History I" },
          { id: "his203", title: "HIS 203: Diplomatic History I" },
          { id: "his205", title: "HIS 205: Pre-Colonial African History" },
          { id: "psc203", title: "PSC 203: Introduction to International Relations" },
          { id: "gst201", title: "GST 201: Entrepreneurship Skills I" },
        ],
      },
      "300": {
        courses: [
          { id: "his301", title: "HIS 301: Colonial Nigeria" },
          { id: "his303", title: "HIS 303: History of West Africa" },
          { id: "his305", title: "HIS 305: Nigerian Foreign Policy" },
          { id: "his307", title: "HIS 307: Diplomacy and Statecraft" },
          { id: "his309", title: "HIS 309: Archival and Historical Methods" },
        ],
      },
      "400": {
        courses: [
          { id: "his401", title: "HIS 401: Post-Independence Nigeria" },
          { id: "his403", title: "HIS 403: International Organizations" },
          { id: "his405", title: "HIS 405: Contemporary African Affairs" },
          { id: "his499", title: "HIS 499: Research Project" },
        ],
      },
    },
  
    "Philosophy": {
      "100": {
        courses: [
          { id: "phi101", title: "PHI 101: Introduction to Philosophy" },
          { id: "phi103", title: "PHI 103: Introduction to Logic" },
          { id: "eng101", title: "ENG 101: English Language I" },
          { id: "his101", title: "HIS 101: History of Africa I" },
          { id: "gst111", title: "GST 111: Communication in English" },
          { id: "gst121", title: "GST 121: Character in Leadership I" },
          { id: "cos101", title: "COS 101: Introduction to Computing Sciences" },
        ],
      },
      "200": {
        courses: [
          { id: "phi201", title: "PHI 201: Ethics I" },
          { id: "phi203", title: "PHI 203: Epistemology" },
          { id: "phi205", title: "PHI 205: Metaphysics" },
          { id: "phi207", title: "PHI 207: History of Philosophy I" },
          { id: "gst201", title: "GST 201: Entrepreneurship Skills I" },
        ],
      },
      "300": {
        courses: [
          { id: "phi301", title: "PHI 301: African Philosophy" },
          { id: "phi303", title: "PHI 303: Philosophy of Religion" },
          { id: "phi305", title: "PHI 305: Political Philosophy" },
          { id: "phi307", title: "PHI 307: Philosophy of Mind" },
          { id: "phi309", title: "PHI 309: Philosophy of Science" },
        ],
      },
      "400": {
        courses: [
          { id: "phi401", title: "PHI 401: Contemporary Issues in Ethics" },
          { id: "phi403", title: "PHI 403: Philosophy of Language" },
          { id: "phi405", title: "PHI 405: Applied Philosophy" },
          { id: "phi499", title: "PHI 499: Research Project" },
        ],
      },
    },
  
    // ═══════════════════════════════════════════════════════════════════════════
    // COLLEGE OF LAW (COLAW)
    // ═══════════════════════════════════════════════════════════════════════════
  
    "Law": {
      "100": {
        courses: [
          { id: "law101", title: "LAW 101: Legal Method I" },
          { id: "law103", title: "LAW 103: Nigerian Legal System" },
          { id: "law105", title: "LAW 105: Introduction to Law of Contract" },
          { id: "gst111", title: "GST 111: Communication in English" },
          { id: "gst121", title: "GST 121: Character in Leadership I" },
          { id: "his101", title: "HIS 101: History of Africa I" },
          { id: "cos101", title: "COS 101: Introduction to Computing Sciences" },
        ],
      },
      "200": {
        courses: [
          { id: "law201", title: "LAW 201: Law of Contract I" },
          { id: "law203", title: "LAW 203: Constitutional Law I" },
          { id: "law205", title: "LAW 205: Criminal Law I" },
          { id: "law207", title: "LAW 207: Law of Torts I" },
          { id: "gst201", title: "GST 201: Entrepreneurship Skills I" },
        ],
      },
      "300": {
        courses: [
          { id: "law301", title: "LAW 301: Criminal Law II" },
          { id: "law303", title: "LAW 303: Commercial Law I" },
          { id: "law305", title: "LAW 305: Land Law I" },
          { id: "law307", title: "LAW 307: Family Law" },
          { id: "law309", title: "LAW 309: Jurisprudence" },
        ],
      },
      "400": {
        courses: [
          { id: "law401", title: "LAW 401: Law of Evidence I" },
          { id: "law403", title: "LAW 403: Company Law I" },
          { id: "law405", title: "LAW 405: Equity and Trusts I" },
          { id: "law407", title: "LAW 407: International Law" },
          { id: "law409", title: "LAW 409: Clinical Legal Education" },
        ],
      },
    },
  
    // ═══════════════════════════════════════════════════════════════════════════
    // COLLEGE OF HEALTH SCIENCES
    // ═══════════════════════════════════════════════════════════════════════════
  
    "Nursing Science": {
      "100": {
        courses: [
          { id: "nsc101", title: "NSC 101: Introduction to Nursing" },
          { id: "bio101", title: "BIO 101: General Biology I" },
          { id: "chm101", title: "CHM 101: General Chemistry I" },
          { id: "phy101", title: "PHY 101: General Physics I" },
          { id: "gst111", title: "GST 111: Communication in English" },
          { id: "gst121", title: "GST 121: Character in Leadership I" },
          { id: "nsc103", title: "NSC 103: Anatomy and Physiology I" },
        ],
      },
      "200": {
        courses: [
          { id: "nsc201", title: "NSC 201: Fundamentals of Nursing Practice" },
          { id: "nsc203", title: "NSC 203: Anatomy and Physiology II" },
          { id: "nsc205", title: "NSC 205: Microbiology for Nurses" },
          { id: "nsc207", title: "NSC 207: Pharmacology I" },
          { id: "nsc209", title: "NSC 209: Nutrition and Dietetics" },
          { id: "gst201", title: "GST 201: Entrepreneurship Skills I" },
        ],
      },
      "300": {
        courses: [
          { id: "nsc301", title: "NSC 301: Medical-Surgical Nursing I" },
          { id: "nsc303", title: "NSC 303: Paediatric Nursing" },
          { id: "nsc305", title: "NSC 305: Mental Health Nursing" },
          { id: "nsc307", title: "NSC 307: Obstetric and Gynaecological Nursing" },
          { id: "nsc309", title: "NSC 309: Community Health Nursing" },
        ],
      },
      "400": {
        courses: [
          { id: "nsc401", title: "NSC 401: Critical Care Nursing" },
          { id: "nsc403", title: "NSC 403: Nursing Administration and Management" },
          { id: "nsc405", title: "NSC 405: Research in Nursing" },
          { id: "nsc407", title: "NSC 407: Nursing Ethics and Law" },
          { id: "nsc499", title: "NSC 499: Research Project" },
        ],
      },
    },
  };
  
  // ─── AUTO-GENERATE SCHEDULES ──────────────────────────────────────────────────
  // Runs once at module load time. Attaches a `.schedule` array to every level.
  
  Object.keys(universityData).forEach((dept) => {
    Object.keys(universityData[dept]).forEach((level) => {
      universityData[dept][level].schedule = generateSchedule(
        universityData[dept][level].courses
      );
    });
  });