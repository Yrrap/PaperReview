const categories = [
    { label: "Computer Science", subcategories: [
        { label: "Artificial Intelligence", value: "cs.AI" },
        { label: "Hardware Architecture", value: "cs.AR" },
        { label: "Computational Complexity", value: "cs.CC" },
        { label: "Computational Engineering, Finance, and Science", value: "cs.CE" },
        { label: "Computational Geometry", value: "cs.CG" },
        { label: "Computation and Language", value: "cs.CL" },
        { label: "Cryptography and Security", value: "cs.CR" },
        { label: "Computer Vision and Pattern Recognition", value: "cs.CV" },
        { label: "Computers and Society", value: "cs.CY" },
        { label: "Databases", value: "cs.DB" },
        { label: "Distributed, Parallel, and Cluster Computing", value: "cs.DC" },
        { label: "Digital Libraries", value: "cs.DL" },
        { label: "Discrete Mathematics", value: "cs.DM" },
        { label: "Data Structures and Algorithms", value: "cs.DS" },
        { label: "Emerging Technologies", value: "cs.ET" },
        { label: "Formal Languages and Automata Theory", value: "cs.FL" },
        { label: "General Literature", value: "cs.GL" },
        { label: "Graphics", value: "cs.GR" },
        { label: "Computer Science and Game Theory", value: "cs.GT" },
        { label: "Human-Computer Interaction", value: "cs.HC" },
        { label: "Information Retrieval", value: "cs.IR" },
        { label: "Information Theory", value: "cs.IT" },
        { label: "Logic in Computer Science", value: "cs.LO" },
        { label: "Machine Learning", value: "cs.LG" },
        { label: "Multiagent Systems", value: "cs.MA" },
        { label: "Mobile Computing and Networking", value: "cs.MC" },
        { label: "Mathematical Software", value: "cs.MS" },
        { label: "Multimedia", value: "cs.MM" },
        { label: "Modeling and Simulation", value: "cs.MA" },
        { label: "Mathematics of Computing", value: "cs.MA" },
        { label: "Neural and Evolutionary Computing", value: "cs.NE" },
        { label: "Numerical Analysis", value: "cs.NA" },
        { label: "Networking and Internet Architecture", value: "cs.NI" },
        { label: "Other Computer Science", value: "cs.OH" },
        { label: "Operating Systems", value: "cs.OS" },
        { label: "Performance", value: "cs.PF" },
        { label: "Programming Languages", value: "cs.PL" },
        { label: "Robotics", value: "cs.RO" },
        { label: "Symbolic Computation", value: "cs.SC" },
        { label: "Sound", value: "cs.SD" },
        { label: "Software Engineering", value: "cs.SE" },
        { label: "Social and Information Networks", value: "cs.SI" },
        { label: "Systems and Control", value: "cs.SY" },
    ] },
    { label: "Economics", subcategories: [
        { label: "Econometrics", value: "econ.EM" },
        { label: "General Economics", value: "econ.GN" },
        { label: "Theoretical Economics", value: "econ.TH" },
    ]},
    { label: "Electrical Engineering and Systems Science", subcategories: [
        { label: "Audio and Speech Processing", value: "eess.AS" },
        { label: "Image and Video Processing", value: "eess.IV" },
        { label: "Signal Processing", value: "eess.SP" },
        { label: "Systems and Control", value: "eess.SY" },
    ]},
    { label: "Mathematics", subcategories: [
        { label: "Commutative Algebra", value: "math.AC" },
        { label: "Algebraic Geometry", value: "math.AG" },
        { label: "Analysis of PDEs", value: "math.AP" },
        { label: "Algebraic Topology", value: "math.AT" },
        { label: "Classical Analysis and ODEs", value: "math.CA" },
        { label: "Combinatorics", value: "math.CO" },
        { label: "Category Theory", value: "math.CT" },
        { label: "Complex Variables", value: "math.CV" },
        { label: "Differential Geometry", value: "math.DG" },
        { label: "Dynamical Systems", value: "math.DS" },
        { label: "Functional Analysis", value: "math.FA" },
        { label: "General Mathematics", value: "math.GM" },
        { label: "General Topology", value: "math.GN" },
        { label: "Group Theory", value: "math.GR" },
        { label: "Geometric Topology", value: "math.GT" },
        { label: "History and Overview", value: "math.HO" },
        { label: "Information Theory", value: "math.IT" },
        { label: "K-Theory and Homology", value: "math.KT" },
        { label: "Logic", value: "math.LO" },
        { label: "Metric Geometry", value: "math.MG" },
        { label: "Mathematical Physics", value: "math.MP" },,
        { label: "Numerical Analysis", value: "math.NA" },
        { label: "Number Theory", value: "math.NT" },
        { label: "Operator Algebras", value: "math.OA" },
        { label: "Optimization and Control", value: "math.OC" },
        { label: "Probability", value: "math.PR" },
        { label: "Quantum Algebra", value: "math.QA" },
        { label: "Rings and Algebras", value: "math.RA" },
        { label: "Representation Theory", value: "math.RT" },
        { label: "Symplectic Geometry", value: "math.SG" },
        { label: "Spectral Theory", value: "math.SP" },
        { label: "Statistics Theory", value: "math.ST" },
    ]},
    { label: "Physics", subcategories: [
        { label: "Astrophysics", subcategories: [
            { label: "Cosmology and Nongalactic Astrophysics", value: "astro-ph.CO" },
            { label: "Earth and Planetary Astrophysics", value: "astro-ph.EP" },
            { label: "Astrophysics of Galaxies", value: "astro-ph.GA" },
            { label: "High Energy Astrophysical Phenomena", value: "astro-ph.HE" },
            { label: "Instrumentation and Methods for Astrophysics", value: "astro-ph.IM" },
            { label: "Solar and Stellar Astrophysics", value: "astro-ph.SR" },
        ]},
        { label: "Condensed Matter", subcategories: [
            { label: "Disordered Systems and Neural Networks", value: "cond-mat.dis-nn" },
            { label: "Materials Science", value: "cond-mat.mtrl-sci" },
            { label: "Mesoscale and Nanoscale Physics", value: "cond-mat.mes-hall" },
            { label: "Other Condensed Matter", value: "cond-mat.other" },
            { label: "Quantum Gases", value: "cond-mat.quant-gas" },
            { label: "Soft Condensed Matter", value: "cond-mat.soft" },
            { label: "Statistical Mechanics", value: "cond-mat.stat-mech" },
            { label: "Strongly Correlated Electrons", value: "cond-mat.str-el" },
            { label: "Superconductivity", value: "cond-mat.supr-con" },
        ]},
        { label: "General Relativity and Quantum Cosmology", value: "gr-qc" },
        { label: "High Energy Physics", subcategories: [
            { label: "Experiment", value: "hep-ex" },
            { label: "Lattice", value: "hep-lat" },
            { label: "Phenomenology", value: "hep-ph" },
            { label: "Theory", value: "hep-th" },
        ]},
        { label: "Mathematical Physics", value: "math-ph" },
        { label: "Nonlinear Sciences", subcategories: [
            { label: "Adaptation and Self-Organizing Systems", value: "nlin.AO" },
            { label: "Chaotic Dynamics", value: "nlin.CD" },
            { label: "Cellular Automata and Lattice Gases", value: "nlin.CG" },
            { label: "Pattern Formation and Solitons", value: "nlin.PS" },
            { label: "Exactly Solvable and Integrable Systems", value: "nlin.SI" },
        ]},
        { label: "Nuclear Experiment", value: "nucl-ex" },
        { label: "Nuclear Theory", value: "nucl-th" },
        { label: "Physics", subcategories: [
            { label: "Accelerator Physics", value: "physics.acc-ph" },
            { label: "Atmospheric and Oceanic Physics", value: "physics.ao-ph" },
            { label: "Applied Physics", value: "physics.app-ph" },
            { label: "Atomic and Molecular Clusters", value: "physics.atm-clus" },
            { label: "Atomic Physics", value: "physics.atom-ph" },
            { label: "Biological Physics", value: "physics.bio-ph" },
            { label: "Chemical Physics", value: "physics.chem-ph" },
            { label: "Classical Physics", value: "physics.class-ph" },
            { label: "Computational Physics", value: "physics.comp-ph" },
            { label: "Data Analysis, Statistics and Probability", value: "physics.data-an" },
            { label: "Physics Education", value: "physics.ed-ph" },
            { label: "Fluid Dynamics", value: "physics.flu-dyn" },
            { label: "General Physics", value: "physics.gen-ph" },
            { label: "Geophysics", value: "physics.geo-ph" },
            { label: "History and Philosophy of Physics", value: "physics.hist-ph" },
            { label: "Instrumentation and Detectors", value: "physics.ins-det" },
            { label: "Medical Physics", value: "physics.med-ph" },
            { label: "Optics", value: "physics.optics" },
            { label: "Plasma Physics", value: "physics.plasm-ph" },
            { label: "Popular Physics", value: "physics.pop-ph" },
            { label: "Physics and Society", value: "physics.soc-ph" },
            { label: "Space Physics", value: "physics.space-ph" },
        ]},
        { label: "Quantum Physics", value: "quant-ph" },
    ]},
    { label: "Quantitative Biology", subcategories: [
        { label: "Biomolecules", value: "q-bio.BM" },
        { label: "Cell Behavior", value: "q-bio.CB" },
        { label: "Genomics", value: "q-bio.GN" },
        { label: "Molecular Networks", value: "q-bio.MN" },
        { label: "Neurons and Cognition", value: "q-bio.NC" },
        { label: "Other Quantitative Biology", value: "q-bio.OT" },
        { label: "Populations and Evolution", value: "q-bio.PE" },
        { label: "Quantitative Methods", value: "q-bio.QM" },
        { label: "Subcellular Processes", value: "q-bio.SC" },
        { label: "Tissues and Organs", value: "q-bio.TO" },
    ]},
    { label: "Quantitative Finance", subcategories: [
        { label: "Computational Finance", value: "q-fin.CP" },
        { label: "Economics", value: "q-fin.EC" },
        { label: "General Finance", value: "q-fin.GN" },
        { label: "Mathematical Finance", value: "q-fin.MF" },
        { label: "Portfolio Management", value: "q-fin.PM" },
        { label: "Pricing of Securities", value: "q-fin.PR" },
        { label: "Risk Management", value: "q-fin.RM" },
        { label: "Statistical Finance", value: "q-fin.ST" },
        { label: "Trading and Market Microstructure", value: "q-fin.TR" },
    ]},
    { label: "Statistics", subcategories: [
        { label: "Applications", value: "stat.AP" },
        { label: "Computation", value: "stat.CO" },
        { label: "Machine Learning", value: "stat.ML" },
        { label: "Methodology", value: "stat.ME" },
        { label: "Other Statistics", value: "stat.OT" },
        { label: "Statistics Theory", value: "stat.TH" },
    ]},
  ];

const Dropdown = ({ onChange, value }) => {
    const [category, setCategory] = useState(null);
    const [subcategory, setSubcategory] = useState(null);
    
    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        setSubcategory(null);
        onChange(e.target.value);
    };
    
    const handleSubcategoryChange = (e) => {
        setSubcategory(e.target.value);
        onChange(e.target.value);
    };
    
    return (
        <div className="dropdown">
        <select value={category} onChange={handleCategoryChange}>
            <option value="">Select a category</option>
            {categories.map((category) => (
            <option key={category.label} value={category.label}>
                {category.label}
            </option>
            ))}
        </select>
        {category && (
            <select value={subcategory} onChange={handleSubcategoryChange}>
            <option value="">Select a subcategory</option>
            {categories.find((c) => c.label === category).subcategories.map((subcategory) => (
                <option key={subcategory.label} value={subcategory.value}>
                {subcategory.label}
                </option>
            ))}
            </select>
        )}
        </div>
    );
};

export default Dropdown;