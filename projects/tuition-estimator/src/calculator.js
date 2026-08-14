
    // Online programs share one static theme; the theme only shifts when an
    // on-campus (100% funded) program is selected, so modality stands out.
    const ONLINE_THEME = { accent: "#56575a", accentDark: "#3f4042", accentSoft: "#ececed" };
    const CAMPUS_THEME = { accent: "#8c2233", accentDark: "#6e1726", accentSoft: "#f5e9eb" };

    const CONFIG = {
      programs: {
        MATS: {
          name: "MATS",
          fullName: "Master of Arts in Theological Studies",
          credits: 36,
          matchType: "fixedCap",
          fixedCap: 5000,
          bucket: "online",
          termSystem: "online",
          theme: ONLINE_THEME,
          description: "dollar-for-dollar match up to $5,000"
        },
        MAC: {
          name: "MAC",
          fullName: "Master of Arts in Counseling",
          credits: 61,
          // Westminster matches outside support dollar-for-dollar up to
          // 25% of tuition, so a fully matched student reduces tuition
          // by up to 50% (25% raised + 25% matched).
          matchType: "percentCap",
          percentCap: 0.25,
          bucket: "online",
          termSystem: "online",
          theme: ONLINE_THEME,
          description: "dollar-for-dollar match up to 25% of tuition, combined reduction up to 50%"
        },
        MDiv: {
          name: "MDiv",
          fullName: "Master of Divinity",
          credits: 111,
          bucket: "online",
          // Online-program matching scholarship: $675 per term through the
          // March 2027 term; beginning with the June 2027 term (AY27-28)
          // Westminster instead matches outside support dollar-for-dollar
          // up to 25% of tuition. Modeled per term, like the rate increase.
          matchType: "onlineHybrid",
          perTermMatch: 675,
          percentAfter: 0.25,
          termSystem: "residential",
          theme: ONLINE_THEME,
          description: "dollar-for-dollar match, $675 per term now, up to 25% of tuition from Summer 2027 (AY27-28)"
        },
        MAR: {
          name: "MAR",
          fullName: "Master of Arts in Religion",
          credits: 74,
          bucket: "online",
          matchType: "onlineHybrid",
          perTermMatch: 675,
          percentAfter: 0.25,
          termSystem: "residential",
          theme: ONLINE_THEME,
          description: "dollar-for-dollar match, $675 per term now, up to 25% of tuition from Summer 2027 (AY27-28)"
        },
        MDivCampus: {
          name: "MDiv",
          fullName: "Master of Divinity, General Ministries",
          displayTitle: "Master of Divinity (MDiv), General Ministries",
          credits: 111,
          bucket: "campus",
          funded: true,
          // 2026-2027 academic catalog: full-time residential tuition is
          // $53,000 per academic year. The scholarship value is the
          // annual rate times the program length, per admissions, with
          // no per-credit price shown or used.
          annualRate: 53000,
          years: 4,
          termSystem: "residential",
          theme: CAMPUS_THEME,
          description: "tuition 100% funded for admitted students"
        },
        MDivFellows: {
          name: "MDiv",
          fullName: "Master of Divinity, Pastoral Fellows",
          displayTitle: "Master of Divinity (MDiv), Pastoral Fellows",
          credits: 111,
          bucket: "campus",
          funded: true,
          // 2026-2027 academic catalog: Pastoral Fellows tuition is
          // $61,000 per academic year.
          annualRate: 61000,
          years: 4,
          termSystem: "residential",
          theme: CAMPUS_THEME,
          description: "tuition 100% funded for admitted students"
        },
        MARCampus: {
          name: "MAR",
          fullName: "Master of Arts in Religion",
          credits: 74,
          bucket: "campus",
          funded: true,
          // 2026-2027 academic catalog: $53,000 per academic year.
          annualRate: 53000,
          years: 3,
          termSystem: "residential",
          theme: CAMPUS_THEME,
          description: "tuition 100% funded for admitted students"
        },
        // Course-priced postgraduate programs (per-course tuition rather
        // than per-credit; the start-term rate increase does not apply).
        ThM: {
          name: "ThM",
          fullName: "Master of Theology",
          bucket: "advanced",
          coursePriced: true,
          courses: 6,
          courseRate: 4350,
          matchPct: 0.20,
          modality: "both",
          theme: ONLINE_THEME,
          description: "20% matching grant for full-time students, any modality"
        },
        DMin: {
          name: "DMin",
          fullName: "Doctor of Ministry",
          bucket: "advanced",
          coursePriced: true,
          // Best current cost estimate per admissions: coursework
          // (8 courses x $3,650 = $29,200) + one year of the $1,750
          // continuation fee + the $2,600 thesis fee = $33,550. Students
          // finishing over more years pay the continuation fee again, so
          // many land at $35,300 or $37,050; the estimate assumes one
          // continuation year. Up to 20% baseline scholarship and up to
          // a 20% Ministry Partnership Match on ministry partner
          // payments.
          trueCost: 33550,
          baselinePct: 0.20,
          matchPct: 0.20,
          modality: "campus",
          theme: CAMPUS_THEME,
          description: "20% baseline scholarship plus a 20% ministry partnership match"
        },
        PhD: {
          name: "PhD",
          fullName: "Doctor of Philosophy",
          bucket: "advanced",
          coursePriced: true,
          courses: 10,
          courseRate: 5000,
          matchPct: 0,
          modality: "campus",
          theme: CAMPUS_THEME,
          description: "scholarships determined individually by the committee"
        },
        // Certificates: 9 credits each at the online per-credit rate, no
        // Westminster scholarships currently. Theological Studies
        // certificates follow the four-term calendar; the registrar groups
        // the Biblical Languages certificates with the semester calendar
        // (rate increase effective Summer 2027 for them).
        CertTSC: {
          name: "TSC",
          fullName: "Theological Studies Certificate",
          credits: 9,
          bucket: "online",
          certificate: true,
          stackable: true,
          matchType: "none",
          termSystem: "online",
          theme: ONLINE_THEME,
          description: "certificate program, no scholarships currently apply"
        },
        CertBLC: {
          name: "BLC",
          fullName: "Biblical Languages Certificate",
          credits: 9,
          bucket: "online",
          certificate: true,
          matchType: "none",
          termSystem: "residential",
          theme: ONLINE_THEME,
          description: "certificate program, no scholarships currently apply"
        }
      },
      currentRate: 675,
      futureRate: 750,
      futureRateStart: "2027-06",
      termCycle: ["06", "09", "01", "03"],
      // The $100 application fee is deliberately excluded everywhere: it
      // is a pre-program admin expense, not program cost (it would not
      // appear on a 1098-T). Hedwig excludes it too. The enrollment
      // deposit ($500 online) and Commitment Fee ($1,000 residential
      // MDiv/MAR) are surfaced as notes: the deposit is applied toward
      // tuition and the Commitment Fee covers the first four terms of
      // the $250 per-term residential Community Life Fee.
      // Advanced-degree deposits are still unconfirmed and omitted.
      onlineEnrollmentDeposit: 500,
      residentialCommitmentFee: 1000,
      residentialTermFee: 250,
      sbcRecognitionFeePerCourse: 1300,
      sbcMaxCredits: 15
    };


    const MARKET_COMPARISONS = {
      mdiv: [
        { institution: "Reformed Theological Seminary", program: "MDiv", credits: 106, rate: 654, feeModel: "rtsGlobal", note: "Includes the $60-per-credit Global technology fee. Hybrid MDiv includes residential requirements.", sourceUrl: "https://rts.edu/admissions/tuition/" },
        { institution: "Dallas Theological Seminary", program: "ThM", credits: 120, rate: 720, feeModel: "dts", note: "Includes published general, technology, and spiritual-formation fees. Mostly online except preaching requirements.", sourceUrl: "https://www.dts.edu/start-your-journey/tuition-aid/2026-27-tuition-fees" },
        { institution: "Covenant Theological Seminary", program: "MDiv", credits: 99, rate: 645, feeModel: "covenant", oneTimeFee: 350, note: "Includes $120 enrollment and $190 technology fees per term, plus the one-time $350 Logos license.", sourceUrl: "https://www.covenantseminary.edu/tuition-scholarships" },
        { institution: "Southern Baptist Theological Seminary", program: "MDiv, non-SBC online rate", credits: 84, rate: 573, feeModel: "sbts", note: "Includes the $200 online enrollment fee per semester and $100 technology fee per online term.", sourceUrl: "https://www.sbts.edu/financial-aid/tuition/" },
        { institution: "Gordon-Conwell Theological Seminary", program: "MDiv", credits: 90, rate: 675, feeModel: "gcts", note: "Includes published service and technology fees using the latest available student expense worksheet. Tuition uses the published 2026–2027 net rate after Trustee Scholarship.", sourceUrl: "https://www.gordonconwell.edu/admissions/tuition-financial-aid/" }
      ],
      counseling: [
        {
          institution: "Dallas Theological Seminary",
          program: "MA in Counseling Ministries",
          credits: 66,
          rate: 720,
          feeModel: "dts",
          note: "Online nonclinical counseling-ministry degree. Includes published general, technology, and spiritual-formation fees.",
          sourceUrl: "https://www.dts.edu/academics/degrees-programs/master-of-arts-in-counseling-ministries"
        },
        {
          institution: "Southern Baptist Theological Seminary",
          program: "MA in Biblical Counseling and Practical Theology",
          credits: 60,
          rate: 573,
          feeModel: "sbts",
          note: "Fully online, non-licensure biblical counseling degree using the non-SBC online tuition rate. Includes online enrollment and technology fees.",
          sourceUrl: "https://www.sbts.edu/degree-programs/master-of-arts/master-of-arts-in-biblical-counseling/"
        },
        {
          institution: "Covenant Theological Seminary",
          program: "MA in Counseling",
          credits: 75,
          rate: 645,
          feeModel: "covenant",
          oneTimeFee: 525,
          note: "CACREP-accredited 75-credit counseling degree. Covenant lists this program as residential rather than online; included here for market context. Includes recurring enrollment and technology fees plus the published $525 MAC licensure fee.",
          sourceUrl: "https://www.covenantseminary.edu/mac"
        },

        {
          institution: "Gordon-Conwell Theological Seminary",
          program: "MA in Christian Counseling",
          credits: 66,
          rate: 675,
          feeModel: "gcts",
          note: "Primarily online CACREP-accredited clinical counseling degree with annual in-person residency requirements. Includes published service and technology fees.",
          sourceUrl: "https://www.gordonconwell.edu/degrees/counseling/macc/"
        }
      ],
      ma: [
        { institution: "Reformed Theological Seminary", program: "MATS", credits: 66, rate: 654, feeModel: "rtsGlobal", note: "Includes the $60-per-credit Global technology fee. Fully online through RTS Global Education.", sourceUrl: "https://rts.edu/admissions/tuition/" },
        { institution: "Dallas Theological Seminary", program: "MBTS", credits: 36, rate: 720, feeModel: "dts", note: "Includes published general, technology, and spiritual-formation fees. Fully online.", sourceUrl: "https://www.dts.edu/start-your-journey/tuition-aid/2026-27-tuition-fees" },
        { institution: "Dallas Theological Seminary", program: "MACS", credits: 63, rate: 720, feeModel: "dts", note: "Includes published general, technology, and spiritual-formation fees. Online MA comparison.", sourceUrl: "https://www.dts.edu/start-your-journey/tuition-aid/2026-27-tuition-fees" },
        { institution: "Covenant Theological Seminary", program: "MATS", credits: 54, rate: 645, feeModel: "covenant", note: "Includes $120 enrollment and $190 technology fees per enrolled term. Fully online.", sourceUrl: "https://www.covenantseminary.edu/tuition-scholarships" },
        { institution: "Covenant Theological Seminary", program: "MABTS", credits: 66, rate: 645, feeModel: "covenant", oneTimeFee: 350, note: "Includes $120 enrollment and $190 technology fees per term, plus the one-time $350 Logos license. Fully online.", sourceUrl: "https://www.covenantseminary.edu/tuition-scholarships" },
        { institution: "Southern Baptist Theological Seminary", program: "MA", credits: "48–62", creditRange: [48, 62], rate: 573, feeModel: "sbts", note: "Includes the $200 online enrollment fee per semester and $100 technology fee per online term. Uses the non-SBC online rate.", sourceUrl: "https://www.sbts.edu/financial-aid/tuition/" },
        { institution: "Gordon-Conwell Theological Seminary", program: "MATS", credits: 60, rate: 675, feeModel: "gcts", note: "Includes published service and technology fees using the latest available student expense worksheet. Tuition uses the published 2026–2027 net rate after Trustee Scholarship.", sourceUrl: "https://www.gordonconwell.edu/admissions/tuition-financial-aid/" }
      ]
    };


    let selectedProgram = "MATS";
    const scholarshipIncluded = true;
    let sbcScholarshipIncluded = false;

    // Westminster scholarship support shown in the reference dropdown,
    // filtered to the selected program. Not exhaustive; sourced from the
    // matching rules above and the scholarships published on wts.edu.
    // Entries with a `calc` are selectable in the scholarship picker (one
    // scholarship at a time); entries without stay informational notes.
    // calc.type "match" uses the program's matching rules; "percentTuition"
    // is an automatic tuition scholarship with no outside-support match.
    const SCHOLARSHIPS = {
      MATS: [
        { id: "match", calc: { type: "match" }, name: "Matching Scholarship", detail: "Dollar-for-dollar match on your additional outside support, up to $5,000." },
        { id: "awm", calc: { type: "percentTuition", pct: 0.25 }, name: "Advancing Women's Ministry Scholarship", detail: "25% tuition coverage for qualifying students." }
      ],
      MAC: [
        { id: "match", calc: { type: "match" }, name: "Matching Scholarship", detail: "Dollar-for-dollar match on your additional outside support, up to 25% of tuition. Fully matched, it reduces your tuition by up to 50%." },
        { name: "SBC Recognition Fee Scholarship", detail: "May cover part or all of SBC course recognition fees ($1,300 per course)." },
        { name: "International Leader Scholarship", detail: "A 50% tuition award for distinguished international leaders who demonstrate a vision for advancing biblical counseling in their local communities, churches, regions, or countries." }
      ],
      MDiv: [
        { id: "match", calc: { type: "match" }, name: "Matching Scholarship", detail: "Dollar-for-dollar match on your additional outside support: up to $675 per term through the Spring 2027 term, then up to 25% of tuition beginning with the Summer 2027 term (AY27-28). Requires a minimum of 4 credits per term and a 3.0 GPA." },
        { name: "International Match", detail: "Up to a 50% match for qualifying international students. Very limited availability." }
      ],
      MAR: [
        { id: "match", calc: { type: "match" }, name: "Matching Scholarship", detail: "Dollar-for-dollar match on your additional outside support: up to $675 per term through the Spring 2027 term, then up to 25% of tuition beginning with the Summer 2027 term (AY27-28). Requires a minimum of 4 credits per term and a 3.0 GPA." },
        { name: "International Match", detail: "Up to a 50% match for qualifying international students. Very limited availability." }
      ],
      MDivCampus: [
        { name: "Full Tuition Funding", detail: "Tuition is 100% funded for admitted full-time students, thanks to the generosity of Westminster's donor community. At $53,000/year, the scholarship is worth $212,000 over four years." }
      ],
      MDivFellows: [
        { name: "Full Tuition Funding", detail: "Tuition is 100% funded for admitted full-time students, thanks to the generosity of Westminster's donor community. At $61,000/year, the scholarship is worth $244,000 over four years." }
      ],
      MARCampus: [
        { name: "Full Tuition Funding", detail: "Tuition is 100% funded for admitted full-time students, thanks to the generosity of Westminster's donor community. At $53,000/year, the scholarship is worth $159,000 over three years." }
      ],
      ThM: [
        { name: "Matching Grant", detail: "Dollar-for-dollar match on your additional outside support for full-time ThM students, up to 20% of total tuition, in any modality." }
      ],
      DMin: [
        { name: "Baseline Scholarship", detail: "Up to $6,800 (20% of the total program cost), applied automatically." },
        { name: "Ministry Partnership Match", detail: "Dollar-for-dollar match on ministry partner (e.g. church) payments, up to $6,710 (20% of the total program cost)." }
      ],
      PhD: [
        { name: "Committee Scholarships", detail: "PhD scholarships are determined individually by the committee and are not included in this estimate." }
      ],
      CertTSC: [
        { name: "Certificate Programs", detail: "No Westminster scholarships currently apply to certificate programs. Outside support you raise still reduces your cost." }
      ],
      CertBLC: [
        { name: "Certificate Programs", detail: "No Westminster scholarships currently apply to certificate programs. Outside support you raise still reduces your cost." }
      ]
    };

    const $ = id => document.getElementById(id);
    const els = {
      matsBtn: $("matsBtn"), macBtn: $("macBtn"), mdivBtn: $("mdivBtn"), marBtn: $("marBtn"),
      mdivCampusBtn: $("mdivCampusBtn"), mdivFellowsBtn: $("mdivFellowsBtn"), marCampusBtn: $("marCampusBtn"),
      thmBtn: $("thmBtn"), dminBtn: $("dminBtn"), phdBtn: $("phdBtn"),
      certTSCBtn: $("certTSCBtn"), certBLCBtn: $("certBLCBtn"),
      fundsRaisedLabel: $("fundsRaisedLabel"), resultsStepLabel: $("resultsStepLabel"),
      rateIncreaseNote: $("rateIncreaseNote"), scholarshipAnnotation: $("scholarshipAnnotation"), scholarshipSelectNote: $("scholarshipSelectNote"), scholarshipMatchNote: $("scholarshipMatchNote"), matchEligibilityNote: $("matchEligibilityNote"),
      mixTitle: $("mixTitle"), mixProgram: $("mixProgram"), resultFootnote: $("resultFootnote"), miniRemainingLabel: $("miniRemainingLabel"),
      maxMatchBtn: $("maxMatchBtn"),
      scholarshipList: $("scholarshipList"),
      fundsRaised: $("fundsRaised"), startTerm: $("startTerm"),
      creditsPerTerm: $("creditsPerTerm"), customCreditsField: $("customCreditsField"),
      customCredits: $("customCredits"),
      sbcScholarshipBlock: $("sbcScholarshipBlock"), sbcScholarshipYes: $("sbcScholarshipYes"), sbcScholarshipNo: $("sbcScholarshipNo"),
      sbcDetails: $("sbcDetails"), sbcCourseList: $("sbcCourseList"), sbcSelectionNote: $("sbcSelectionNote"), sbcCoverage: $("sbcCoverage"), sbcCoverageLabel: $("sbcCoverageLabel"), sbcFeeNote: $("sbcFeeNote"),
      netPrice: $("netPrice"),
      miniMatch: $("miniMatch"), miniRemaining: $("miniRemaining"), miniRemainingCard: $("miniRemainingCard"), miniGross: $("miniGross"), miniGrossLabel: $("miniGrossLabel"),
      miniCreditsCard: $("miniCreditsCard"), miniCreditsRemaining: $("miniCreditsRemaining"),
      miniSbcCard: $("miniSbcCard"), miniSbcScholarship: $("miniSbcScholarship"),
      summaryModeLabel: $("summaryModeLabel"),
      summaryCreditsRecognizedRow: $("summaryCreditsRecognizedRow"), summaryCreditsRemainingRow: $("summaryCreditsRemainingRow"),
      summaryCreditsRecognized: $("summaryCreditsRecognized"), summaryCreditsRemaining: $("summaryCreditsRemaining"),
      summaryGross: $("summaryGross"), summaryRaised: $("summaryRaised"),
      summaryMatch: $("summaryMatch"), summaryRemainingMatch: $("summaryRemainingMatch"), summaryRemainingMatchRow: $("summaryRemainingMatchRow"),
      summarySbcFeeRow: $("summarySbcFeeRow"), summarySbcScholarshipRow: $("summarySbcScholarshipRow"),
      summarySbcFee: $("summarySbcFee"), summarySbcScholarship: $("summarySbcScholarship"), summaryNet: $("summaryNet"),
      legendStudent: $("legendStudent"), legendRaised: $("legendRaised"), legendMatch: $("legendMatch"),
      comparisonSubtitle: $("comparisonSubtitle"), comparisonTypeLabel: $("comparisonTypeLabel"), comparisonCallout: $("comparisonCallout"), comparisonTable: $("comparisonTable"),
      termCountLabel: $("termCountLabel"), termTable: $("termTable"), emailLink: $("emailLink"),
      sliceStudent: $("sliceStudent"), sliceRaised: $("sliceRaised"), sliceMatch: $("sliceMatch"),
      labelStudent: $("labelStudent"), labelRaised: $("labelRaised"), labelMatch: $("labelMatch"),
      printProgram: $("printProgram"), printCredits: $("printCredits"), printStartTerm: $("printStartTerm"),
      printCompletionTerm: $("printCompletionTerm"), printPace: $("printPace"), printDate: $("printDate")
    };

    function money(value, cents = false) {
      return new Intl.NumberFormat("en-US", {
        style: "currency", currency: "USD",
        minimumFractionDigits: cents ? 2 : 0,
        maximumFractionDigits: cents ? 2 : 0
      }).format(value);
    }

    function num(value) {
      return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(value);
    }

    function termKey(year, month) {
      return `${year}-${String(month).padStart(2, "0")}`;
    }

    function parseTerm(term) {
      const [year, month] = term.split("-").map(Number);
      return { year, month };
    }

    // MAC and MATS run four terms per year (January, March, June,
    // September); MDiv and MAR, online and residential alike, run three
    // semesters (Spring, Summer, Fall). termSystem picks the calendar.
    function cycleFor(termSystem) {
      return termSystem === "residential"
        ? ["06", "09", "01"]
        : ["06", "09", "01", "03"];
    }

    function nextTerm(key, termSystem = "online") {
      let { year, month } = parseTerm(key);
      const cycle = cycleFor(termSystem);
      const monthText = String(month).padStart(2, "0");
      const idx = cycle.indexOf(monthText);
      const nextMonth = cycle[(idx + 1) % cycle.length];
      if (Number(nextMonth) < month) year += 1;
      return termKey(year, Number(nextMonth));
    }

    function termLabel(key, termSystem = "online") {
      const [year, month] = key.split("-").map(Number);
      const names = termSystem === "residential"
        ? { 1: "Spring", 6: "Summer", 9: "Fall" }
        : { 1: "January", 3: "March", 6: "June", 9: "September" };
      return `${names[month]} ${year}`;
    }

    function rateForTerm(key) {
      // Term keys are zero-padded "YYYY-MM" strings, so lexicographic
      // comparison is chronological.
      return key >= CONFIG.futureRateStart ? CONFIG.futureRate : CONFIG.currentRate;
    }

    function buildTerms(totalCredits, creditsPerTerm, startTerm, termSystem = "online") {
      let remaining = totalCredits;
      let term = startTerm;
      const rows = [];
      while (remaining > 0) {
        const credits = Math.min(remaining, creditsPerTerm);
        const rate = rateForTerm(term);
        rows.push({ term, label: termLabel(term, termSystem), credits, rate, tuition: credits * rate });
        remaining -= credits;
        term = nextTerm(term, termSystem);
      }
      return rows;
    }

    // The start-term choices depend on the program's calendar: no March
    // term exists for MDiv/MAR, and their terms carry semester names.
    const START_TERM_KEYS = ["2026-09", "2027-01", "2027-03", "2027-06", "2027-09"];

    function refreshStartTermOptions(program) {
      if (!els.startTerm) return;
      const cycle = cycleFor(program.termSystem);
      const current = els.startTerm.value;
      const valid = START_TERM_KEYS.filter(k => cycle.includes(k.split("-")[1]));
      els.startTerm.innerHTML = valid
        .map(k => `<option value="${k}">${termLabel(k, program.termSystem)}</option>`)
        .join("");
      els.startTerm.value = valid.includes(current) ? current : valid[0];
      if (els.rateIncreaseNote) {
        const boundary = program.termSystem === "residential" ? "Summer 2027" : "June 2027";
        els.rateIncreaseNote.textContent = `Tuition increases from $675 to $750/credit beginning in the ${boundary} term.`;
      }
    }

    function capFor(program, gross, startTerm, creditsPerTerm = 3, rows = []) {
      if (program.matchType === "fixedCap") return program.fixedCap;
      if (program.matchType === "percentCap") return gross * program.percentCap;
      if (program.matchType === "perTerm") return rows.length * program.perTermMatch;
      if (program.matchType === "onlineHybrid") {
        // $675 per term through March 2027, then 25% of each term's
        // tuition from the June 2027 term (AY27-28) onward.
        return rows.reduce((sum, row) => sum + (
          row.term >= CONFIG.futureRateStart
            ? row.tuition * program.percentAfter
            : program.perTermMatch
        ), 0);
      }
      return 0;
    }

    function setTheme(programKey) {
      const t = CONFIG.programs[programKey].theme;
      document.documentElement.style.setProperty("--accent", t.accent);
      document.documentElement.style.setProperty("--accent-dark", t.accentDark);
      document.documentElement.style.setProperty("--accent-soft", t.accentSoft);
      document.documentElement.style.setProperty("--chart-match", "#bd8b41");
    }

    function polarToCartesian(cx, cy, r, angleDeg) {
      const angleRad = (angleDeg - 90) * Math.PI / 180;
      return { x: cx + (r * Math.cos(angleRad)), y: cy + (r * Math.sin(angleRad)) };
    }

    function describeSlice(cx, cy, r, startAngle, endAngle) {
      
      
      if (endAngle - startAngle >= 359.999) {
        endAngle = startAngle + 359.99;
      }
      const start = polarToCartesian(cx, cy, r, endAngle);
      const end = polarToCartesian(cx, cy, r, startAngle);
      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
      return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
    }

    function positionPieLabel(el, percentage, startAngle, endAngle, radius = 65) {
      if (!el) return;
      if (percentage < 4) {
        el.classList.add("hidden");
        return;
      }
      el.classList.remove("hidden");
      const mid = startAngle + ((endAngle - startAngle) / 2);
      const p = polarToCartesian(110, 110, radius, mid);
      el.setAttribute("x", p.x);
      el.setAttribute("y", p.y);
      el.textContent = `${Math.round(percentage)}%`;
    }

    function updatePieChart(studentPaid, fundsApplied, totalWtsAid, gross) {
      const values = [
        { value: Math.max(0, studentPaid), path: els.sliceStudent, label: els.labelStudent },
        { value: Math.max(0, fundsApplied), path: els.sliceRaised, label: els.labelRaised },
        { value: Math.max(0, totalWtsAid), path: els.sliceMatch, label: els.labelMatch }
      ];

      const total = Math.max(gross, 1);

      // Label percentages must sum to 100: round the two support slices,
      // then the student slice absorbs the rounding remainder. Rounding
      // each slice independently produced pies like 25/25/49, and equal
      // support amounts must keep equal labels.
      const pcts = values.map(item => Math.round(item.value / total * 100));
      if (values[0].value > 0) {
        pcts[0] = Math.max(0, 100 - pcts[1] - pcts[2]);
      }

      // Slices are drawn from the same rounded percentages the labels
      // show (max distortion about half a point, imperceptible), so a
      // slice labeled 50% is exactly half the pie and equal labels are
      // equal wedges. Drawing from raw values made the fully matched
      // MDiv read 25/25/50 over a 49.2% gold slice, which looked wrong.
      let angle = 0;
      values.forEach((item, idx) => {
        const start = angle;
        const end = angle + (pcts[idx] / 100) * 360;
        item.path.setAttribute("d", item.value > 0 && pcts[idx] > 0 ? describeSlice(110, 110, 100, start, end) : "");
        positionPieLabel(item.label, pcts[idx], start, end);
        angle = end;
      });
    }


    function updateMacOnlyVisibility() {
      const isMac = selectedProgram === "MAC";
      [els.sbcScholarshipBlock, els.miniSbcCard, els.miniCreditsCard, els.summaryCreditsRecognizedRow, els.summaryCreditsRemainingRow, els.summarySbcFeeRow, els.summarySbcScholarshipRow].forEach(el => {
        if (el) el.hidden = !isMac;
      });
      if (!isMac) {
        sbcScholarshipIncluded = false;
      }
      if (els.sbcDetails) {
        els.sbcDetails.hidden = !(isMac && sbcScholarshipIncluded);
      }
      if (els.sbcScholarshipYes && els.sbcScholarshipNo) {
        els.sbcScholarshipYes.setAttribute("aria-pressed", isMac && sbcScholarshipIncluded);
        els.sbcScholarshipNo.setAttribute("aria-pressed", !(isMac && sbcScholarshipIncluded));
      }
    }

    function selectSbcScholarship(value) {
      sbcScholarshipIncluded = value;
      updateMacOnlyVisibility();
      calculate();
    }


    function getSelectedSbcCourses() {
      return Array.from(document.querySelectorAll(".sbc-course:checked")).map(input => ({
        code: input.value,
        title: input.dataset.title,
        credits: Number(input.dataset.credits || 0)
      }));
    }

    function getSelectedSbcCredits() {
      return getSelectedSbcCourses().reduce((sum, course) => sum + course.credits, 0);
    }

    function updateSbcCourseAvailability(changedInput = null) {
      const selectedCredits = getSelectedSbcCredits();

      if (selectedCredits > CONFIG.sbcMaxCredits && changedInput) {
        changedInput.checked = false;
      }

      const currentCredits = getSelectedSbcCredits();
      document.querySelectorAll(".sbc-course").forEach(input => {
        const credits = Number(input.dataset.credits || 0);
        const wouldExceed = !input.checked && currentCredits + credits > CONFIG.sbcMaxCredits;
        input.disabled = wouldExceed;
        input.closest(".course-option")?.classList.toggle("disabled", wouldExceed);
      });

      const selectedCourses = getSelectedSbcCourses();
      if (els.sbcSelectionNote) {
        els.sbcSelectionNote.textContent = `Selected: ${num(currentCredits)} credits across ${selectedCourses.length} ${selectedCourses.length === 1 ? "course" : "courses"}. Up to 15 credits may be recognized.`;
      }
    }


    function comparisonGroupForProgram(programKey) {
      if (programKey === "MDiv") return "mdiv";
      if (programKey === "MAC") return "counseling";
      if (programKey === "MAR" || programKey === "MATS") return "ma";
      return "ma";
    }

    function formatCredits(value) {
      return typeof value === "number" ? num(value) : value;
    }

    function buildComparisonTerms(totalCredits, creditsPerTerm, startTerm) {
      const terms = [];
      let remaining = totalCredits;
      let term = startTerm;
      while (remaining > 0) {
        const credits = Math.min(remaining, creditsPerTerm);
        terms.push({ term, credits });
        remaining -= credits;
        term = nextTerm(term);
      }
      return terms;
    }

    function mandatoryFeesForItem(item, totalCredits, creditsPerTerm, startTerm) {
      const terms = buildComparisonTerms(totalCredits, creditsPerTerm, startTerm);

      if (item.feeModel === "rtsGlobal") return totalCredits * 60;
      if (item.feeModel === "covenant") return terms.length * 310 + Number(item.oneTimeFee || 0);

      if (item.feeModel === "dts") {
        return terms.reduce((sum, row) => {
          const month = Number(row.term.split("-")[1]);
          const fallOrSpring = month === 9 || month === 3;
          const generalAndTech = fallOrSpring ? 350 : row.credits * 55;
          return sum + generalAndTech + 100;
        }, 0);
      }

      if (item.feeModel === "sbts") {
        const technologyFees = terms.length * 100;
        const semesterKeys = new Set(terms.map(row => {
          const [year, month] = row.term.split("-").map(Number);
          if (month === 9 || month === 1) return `${month === 1 ? year - 1 : year}-fall`;
          if (month === 3) return `${year}-spring`;
          return `${year}-summer`;
        }));
        return technologyFees + semesterKeys.size * 200;
      }

      if (item.feeModel === "gcts") {
        return terms.reduce((sum, row) => {
          const month = Number(row.term.split("-")[1]);
          return sum + (month === 1 ? 100 : 350);
        }, 0);
      }

      return Number(item.oneTimeFee || 0);
    }

    function marketTotalForCredits(item, totalCredits, creditsPerTerm, startTerm) {
      const fees = mandatoryFeesForItem(item, totalCredits, creditsPerTerm, startTerm);
      const tuition = totalCredits * item.rate;
      const total = tuition + fees;
      const effectiveRate = totalCredits > 0 ? total / totalCredits : 0;
      return { tuition, fees, total, effectiveRate };
    }

    function formatMarketTotal(item, creditsPerTerm, startTerm) {
      if (item.creditRange) {
        const low = marketTotalForCredits(item, item.creditRange[0], creditsPerTerm, startTerm);
        const high = marketTotalForCredits(item, item.creditRange[1], creditsPerTerm, startTerm);
        return {
          display: `${money(low.total)}–${money(high.total)}`,
          effectiveRateDisplay: `${money(low.effectiveRate)}–${money(high.effectiveRate)} / cr`,
          feeDisplay: `${money(low.fees)}–${money(high.fees)} fees included`
        };
      }

      const result = marketTotalForCredits(item, Number(item.credits), creditsPerTerm, startTerm);
      return {
        display: money(result.total),
        effectiveRateDisplay: `${money(result.effectiveRate)} / cr`,
        feeDisplay: `${money(result.fees)} fees included`
      };
    }

    function renderMarketComparison(wtsGross, wtsNet, program, selectedProgram, wtsCreditsRemaining, creditsPerTerm, startTerm) {
      if (!els.comparisonTable) return;

      const group = comparisonGroupForProgram(selectedProgram);
      const rows = MARKET_COMPARISONS[group] || [];

      const selectedLabel = group === "mdiv"
        ? "MDiv / pastoral ministry comparison"
        : group === "counseling"
          ? "Counseling program comparison"
          : "MA / theological studies comparison";
      els.comparisonTypeLabel.textContent = selectedLabel;

      const subtitle = group === "counseling"
        ? "Comparable online or mostly online counseling programs using an effective all-in per-credit charge."
        : group === "mdiv"
          ? "Comparable online or mostly online MDiv and pastoral ministry programs using an effective all-in per-credit charge."
          : "Comparable online or mostly online theological studies programs using an effective all-in per-credit charge.";
      els.comparisonSubtitle.textContent = subtitle;

      els.comparisonCallout.textContent = `Programs are ranked from lowest to highest estimated tuition and mandatory fees for the full program. Your WTS ${program.name} position updates automatically based on the personalized estimate above.`;

      const entries = [
        {
          isWts: true,
          institution: "Westminster Theological Seminary",
          program: program.name,
          creditsDisplay: num(wtsCreditsRemaining),
          effectiveRateDisplay: `${money(CONFIG.currentRate)} / cr`,
          totalDisplay: money(wtsNet),
          sortTotal: wtsNet,
          rateNote: "No recurring term fees",
          totalNote: "Personalized estimate",
          note: "Online or mostly online WTS pathway, after entered support and WTS match. WTS charges no recurring term fees.",
          sourceUrl: null
        },
        ...rows.map(item => {
          const total = formatMarketTotal(item, creditsPerTerm, startTerm);

          let sortTotal;
          if (item.creditRange) {
            const low = marketTotalForCredits(item, item.creditRange[0], creditsPerTerm, startTerm);
            const high = marketTotalForCredits(item, item.creditRange[1], creditsPerTerm, startTerm);
            sortTotal = (low.total + high.total) / 2;
          } else {
            sortTotal = marketTotalForCredits(item, Number(item.credits), creditsPerTerm, startTerm).total;
          }

          return {
            isWts: false,
            institution: item.institution,
            program: item.program,
            creditsDisplay: formatCredits(item.credits),
            effectiveRateDisplay: total.effectiveRateDisplay,
            totalDisplay: total.display,
            sortTotal,
            rateNote: "Tuition + recurring fees",
            totalNote: total.feeDisplay,
            note: item.note,
            sourceUrl: item.sourceUrl
          };
        })
      ];

      entries.sort((a, b) => {
        if (a.sortTotal !== b.sortTotal) return a.sortTotal - b.sortTotal;
        return a.institution.localeCompare(b.institution);
      });

      els.comparisonTable.innerHTML = entries.map((entry, index) => `
        <tr class="${entry.isWts ? "comparison-row-current" : ""}">
          <td class="money"><strong>${index + 1}</strong></td>
          <td>${entry.institution}</td>
          <td>
            ${entry.program}
            <div class="comparison-program-note">
              ${entry.isWts
                ? "Your current estimate in this tool"
                : `<a class="comparison-source-link" href="${entry.sourceUrl}" target="_blank" rel="noopener">Source</a>`}
            </div>
          </td>
          <td class="money">${entry.creditsDisplay}</td>
          <td class="money">
            <strong>${entry.effectiveRateDisplay}</strong>
            <div class="comparison-program-note">${entry.rateNote}</div>
          </td>
          <td class="money">
            <strong>${entry.totalDisplay}</strong>
            <div class="comparison-program-note">${entry.totalNote}</div>
          </td>
          <td>${entry.note}</td>
        </tr>
      `).join("");
    }

    const MATCH_FOOTNOTE = "*Westminster only matches support from churches, ministry partners, employers, family, and friends. Funds from the GI Bill, denominational scholarships, and other sources still lower your estimated cost but do not count toward the match.";

    function setResultFootnote(parts) {
      const text = parts.filter(Boolean).join(" ");
      els.resultFootnote.textContent = text;
      els.resultFootnote.hidden = !text;
    }

    // Whether the Outside Support tile carries the asterisk pointing at the
    // match footnote.
    function setOutsideSupportAsterisk(hasMatch) {
      els.miniRemainingLabel.textContent = hasMatch ? "Outside Support*" : "Outside Support";
      // The match-eligibility sentence in the step 2 note and the
      // applies-automatically sentence in the scholarship annotation only
      // apply while a matching scholarship is in play.
      if (els.matchEligibilityNote) els.matchEligibilityNote.hidden = !hasMatch;
      if (els.scholarshipMatchNote) els.scholarshipMatchNote.hidden = !hasMatch;
    }

    // The maximum outside support the current matching scholarship will
    // fully match; 0 when no match applies. Drives the max-match preset.
    let lastMatchCap = 0;

    function updateMaxMatchButton() {
      if (!els.maxMatchBtn) return;
      const cap = Math.round(lastMatchCap);
      els.maxMatchBtn.hidden = cap <= 0;
      els.maxMatchBtn.textContent = `Maximum Matching Scholarship amount: ${money(cap)}`;
    }

    function calculate() {
      updateMacOnlyVisibility();
      const program = CONFIG.programs[selectedProgram];
      // DMin's tuition figure is itself an estimate (coursework +
      // continuation + thesis fees), so its tile carries an asterisk
      // pointing at the footnote that unpacks it.
      if (els.miniGrossLabel) {
        els.miniGrossLabel.textContent = selectedProgram === "DMin"
          ? "Tuition Before Support*" : "Tuition Before Support";
      }
      if (els.mixProgram) {
        const badge = kind => kind === "campus"
          ? '<span class="online-badge campus">On Campus</span>'
          : '<span class="online-badge">Online</span>';
        const badges = program.funded || program.modality === "campus" ? badge("campus")
          : program.modality === "both" ? `${badge("online")} ${badge("campus")}`
          : badge("online");
        els.mixProgram.innerHTML = `<span class="mix-program-name">${program.displayTitle || `${program.fullName} (${program.name})`}</span> ${badges}`;
      }

      if (program.funded) {
        // On-campus MDiv and MAR: tuition is 100% funded for admitted
        // students, so there is nothing to estimate. The scholarship
        // value is the annual rate times the program length (per
        // admissions: no per-credit price), and the cost is $0.
        const gross = program.annualRate * program.years;
        const fundedNet = 0;
        lastMatchCap = 0;
        updateMaxMatchButton();
        updatePieChart(fundedNet, 0, gross, gross + fundedNet);
        els.netPrice.textContent = money(fundedNet);
        const yearsWord = { 3: "three", 4: "four" }[program.years] || String(program.years);
        setResultFootnote([
          `Tuition for the on-campus ${program.displayTitle || program.fullName} is 100% funded for admitted full-time students, thanks to the generosity of Westminster's donor community. At ${money(program.annualRate)}/year, the scholarship is worth ${money(gross)} over ${yearsWord} years.`,
          `A ${money(CONFIG.residentialCommitmentFee)} Commitment Fee is due at admission and covers the first four terms of the ${money(CONFIG.residentialTermFee)} per-term Community Life Fee; plan for that fee in the remaining terms.`
        ]);
        els.miniMatch.textContent = money(gross);
        els.miniRemainingCard.hidden = true;
        els.miniRemaining.textContent = "$0"; // no outside support for funded programs
        els.miniRemainingCard.classList.remove("match-opportunity");
        els.miniGross.textContent = money(gross);
        els.legendStudent.textContent = money(fundedNet);
        els.legendRaised.textContent = "$0";
        els.legendMatch.textContent = money(gross);
        els.summaryModeLabel.textContent = "Tuition 100% funded";
        els.summaryGross.textContent = money(gross);
        els.summaryRaised.textContent = "-$0";
        els.summaryMatch.textContent = `-${money(gross)}`;
        els.summaryRemainingMatch.textContent = "$0";
        els.summaryRemainingMatchRow.classList.remove("match-opportunity");
        els.summaryNet.textContent = "$0";
        els.termCountLabel.textContent = "Tuition 100% funded";
        els.termTable.innerHTML = `
          <tr>
            <td colspan="6">Tuition for the on-campus ${program.name} is 100% funded for admitted students, so there is no term-by-term cost to plan for.</td>
          </tr>
        `;
        els.emailLink.href = `mailto:?subject=${encodeURIComponent(`WTS on-campus ${program.name} tuition`)}&body=${encodeURIComponent(`Tuition for the on-campus ${program.fullName} (${program.name}) is 100% funded for admitted students. There is no out-of-pocket tuition.`)}`;
        return;
      }

      if (program.coursePriced) {
        // ThM, DMin, PhD: per-course pricing, no term-by-term rate schedule.
        // DMin follows its published program card: total true cost, an
        // automatic baseline scholarship, then ministry partner payments
        // matched dollar-for-dollar up to the partnership match cap.
        const fundsRaisedRequested = Math.max(0, Number(els.fundsRaised.value || 0));
        const gross = program.trueCost || program.courses * program.courseRate;
        const baseline = program.baselinePct ? gross * program.baselinePct : 0;
        const fundsApplied = Math.min(fundsRaisedRequested, Math.max(0, gross - baseline));
        const matchCap = program.matchPct ? gross * program.matchPct : 0;
        lastMatchCap = matchCap;
        updateMaxMatchButton();
        const match = Math.min(fundsApplied, matchCap, Math.max(0, gross - baseline - fundsApplied));
        const totalWtsAid = baseline + match;
        const totalOutOfPocket = Math.max(0, gross - fundsApplied - totalWtsAid);
        const remainingEligibleMatch = Math.max(0, matchCap - match);

        updatePieChart(totalOutOfPocket, fundsApplied, totalWtsAid, gross);

        els.netPrice.textContent = money(totalOutOfPocket);
        const communityFeeSentence = `Residential students also pay a ${money(CONFIG.residentialTermFee)} per-term Community Life Fee, not included in this estimate.`;
        const footnotes = {
          ThM: [MATCH_FOOTNOTE, `The estimate excludes other program fees, such as the $750 matriculation fee and the $1,550 thesis fee for thesis-track students. ${communityFeeSentence}`],
          DMin: [`*Tuition reflects coursework (8 courses at $3,650 each), one year of the $1,750 continuation fee, and the $2,600 thesis fee, for $33,550 total. Students who take longer to finish pay the continuation fee for each additional year. The Ministry Partnership Match applies dollar-for-dollar to ministry partner (e.g. church) payments, up to 20% of the total program cost. The baseline scholarship is applied automatically.`],
          PhD: [`PhD scholarships are determined individually by the committee and are not included in this estimate. The estimate excludes other program fees, such as the $1,400 matriculation fee and the $3,600 dissertation fee. ${communityFeeSentence}`]
        };
        setResultFootnote(footnotes[selectedProgram] || []);
        setOutsideSupportAsterisk(matchCap > 0);
        els.miniMatch.textContent = money(totalWtsAid);
        els.miniGross.textContent = money(gross);
        els.miniRemainingCard.hidden = false;
        els.miniRemaining.textContent = money(fundsApplied);
        els.miniRemainingCard.classList.remove("match-opportunity");
        els.legendStudent.textContent = money(totalOutOfPocket);
        els.legendRaised.textContent = money(fundsApplied);
        els.legendMatch.textContent = money(totalWtsAid);
        return;
      }

      els.miniRemainingCard.hidden = false;
      const creditsPerTerm = els.creditsPerTerm.value === "custom"
        ? Math.max(1, Number(els.customCredits.value || 3))
        : Number(els.creditsPerTerm.value);

      const startTerm = els.startTerm.value;
      const fundsRaisedRequested = Math.max(0, Number(els.fundsRaised.value || 0));
      const additionalAid = 0;
      const selectedSbcCourses = selectedProgram === "MAC" ? getSelectedSbcCourses() : [];
      const sbcCourses = selectedSbcCourses.length;
      const sbcCoveragePct = selectedProgram === "MAC" ? Math.min(100, Math.max(0, Number(els.sbcCoverage?.value || 100))) : 0;
      const sbcRecognitionFee = sbcCourses * CONFIG.sbcRecognitionFeePerCourse;
      const sbcCreditsRecognized = selectedProgram === "MAC" ? selectedSbcCourses.reduce((sum, course) => sum + course.credits, 0) : 0;
      const wtsCreditsRemaining = Math.max(0, program.credits - sbcCreditsRecognized);
      const sbcRecognitionScholarship = selectedProgram === "MAC" && sbcScholarshipIncluded ? sbcRecognitionFee * (sbcCoveragePct / 100) : 0;
      const sbcRecognitionFeeStudentPaid = Math.max(0, sbcRecognitionFee - sbcRecognitionScholarship);
      const rows = buildTerms(wtsCreditsRemaining, creditsPerTerm, startTerm, program.termSystem);
      const gross = rows.reduce((sum, row) => sum + row.tuition, 0);

      // One scholarship at a time: a percent-tuition scholarship (e.g. the
      // Advancing Women's Ministry Scholarship) replaces the matching
      // scholarship entirely, so outside support still reduces the cost but
      // draws no match. Outside support above a match cap also still counts:
      // every raised dollar is applied, only the match itself is capped.
      const scholarship = activeScholarship();
      const isPercentScholarship = !!(scholarship && scholarship.calc.type === "percentTuition");
      const scholarshipAid = isPercentScholarship ? gross * scholarship.calc.pct : 0;
      const fundsApplied = Math.min(fundsRaisedRequested, Math.max(0, gross - scholarshipAid));
      const matchCap = isPercentScholarship ? 0 : capFor(program, gross, startTerm, creditsPerTerm, rows);
      lastMatchCap = matchCap;
      updateMaxMatchButton();
      const standardMatch = scholarshipIncluded && !isPercentScholarship
        ? Math.min(fundsApplied, matchCap, Math.max(0, gross - fundsApplied))
        : 0;
      const totalWtsAid = scholarshipIncluded
        ? Math.min(scholarshipAid + standardMatch + additionalAid, Math.max(0, gross - fundsApplied))
        : 0;
      const studentPaid = Math.max(0, gross - fundsApplied - totalWtsAid);
      const totalOutOfPocket = studentPaid + sbcRecognitionFeeStudentPaid;
      const remainingEligibleMatch = scholarshipIncluded ? Math.max(0, matchCap - standardMatch) : 0;

      const pieStudentPaid = totalOutOfPocket;
      const pieWtsScholarshipSupport = totalWtsAid + sbcRecognitionScholarship;
      const pieTotal = gross + sbcRecognitionFee;

      updatePieChart(pieStudentPaid, fundsApplied, pieWtsScholarshipSupport, pieTotal);

      els.netPrice.textContent = money(totalOutOfPocket);
      // The match-source footnote only applies while a matching scholarship
      // is the selected scholarship.
      const hasMatch = !isPercentScholarship && matchCap > 0;
      const footnoteParts = [hasMatch ? MATCH_FOOTNOTE : ""];
      if (program.certificate) {
        if (program.stackable) {
          footnoteParts.push("The three Theological Studies Certificate emphases plus three electives stack into a full MATS.");
        }
      } else {
        footnoteParts.push(`A ${money(CONFIG.onlineEnrollmentDeposit)} enrollment deposit is due when you enroll and is applied toward tuition.`);
      }
      setResultFootnote(footnoteParts);
      setOutsideSupportAsterisk(hasMatch);
      els.miniMatch.textContent = money(totalWtsAid);
      els.miniRemaining.textContent = money(fundsApplied);
      els.miniGross.textContent = money(gross);
      els.miniCreditsRemaining.textContent = num(wtsCreditsRemaining);
      els.miniSbcScholarship.textContent = money(sbcRecognitionScholarship);
      els.sbcCoverageLabel.textContent = `${sbcCoveragePct}%`;
      els.sbcFeeNote.textContent = `Recognition fee: ${money(sbcRecognitionFee)} for ${sbcCourses} selected ${sbcCourses === 1 ? "course" : "courses"}. Estimated possible recognition fee scholarship: ${money(sbcRecognitionScholarship)}.`;
      updateSbcCourseAvailability();

      els.summaryModeLabel.textContent = "Matching scholarship applied automatically";
      els.summaryCreditsRecognized.textContent = num(sbcCreditsRecognized);
      els.summaryCreditsRemaining.textContent = num(wtsCreditsRemaining);
      els.summaryGross.textContent = money(gross);
      els.summaryRaised.textContent = `-${money(fundsApplied)}`;
      els.summaryMatch.textContent = `-${money(totalWtsAid)}`;
      els.summaryRemainingMatch.textContent = scholarshipIncluded ? money(remainingEligibleMatch) : "$0";
      const showMatchOpportunity = scholarshipIncluded && remainingEligibleMatch > 0;
      els.miniRemainingCard.classList.remove("match-opportunity");
      els.summaryRemainingMatchRow.classList.toggle("match-opportunity", showMatchOpportunity);
      els.summarySbcFee.textContent = money(sbcRecognitionFee);
      els.summarySbcScholarship.textContent = `-${money(sbcRecognitionScholarship)}`;
      els.summaryNet.textContent = money(totalOutOfPocket);
      renderMarketComparison(gross, totalOutOfPocket, program, selectedProgram, wtsCreditsRemaining, creditsPerTerm, startTerm);

      els.legendStudent.textContent = money(pieStudentPaid);
      els.legendRaised.textContent = money(fundsApplied);
      els.legendMatch.textContent = money(pieWtsScholarshipSupport);

      els.termCountLabel.textContent = `${rows.length} ${rows.length === 1 ? "term" : "terms"}`;

      const raisedRatio = gross > 0 ? fundsApplied / gross : 0;
      const matchRatio = gross > 0 ? totalWtsAid / gross : 0;

      els.termTable.innerHTML = rows.map(row => {
        const raised = row.tuition * raisedRatio;
        const match = row.tuition * matchRatio;
        const net = Math.max(0, row.tuition - raised - match);
        return `
          <tr>
            <td>${row.label || termLabel(row.term, program.termSystem)}</td>
            <td class="money">${num(row.credits)}</td>
            <td class="money">${money(row.tuition)}</td>
            <td class="money">${money(raised)}</td>
            <td class="money">${money(match)}</td>
            <td class="money"><strong>${money(net)}</strong></td>
          </tr>
        `;
      }).join("");

      const subject = encodeURIComponent(`WTS ${program.name} tuition estimate`);
      const body = encodeURIComponent(
        `WTS ${program.name} Tuition Estimate\n\n` +
        `Program: ${program.name}\n` +
        `Program credits: ${program.credits}\n` +
        `SBC courses selected: ${selectedSbcCourses.map(course => `${course.code} (${course.credits} credits)`).join(", ") || "None"}\n` +
        `SBC credits recognized: ${num(sbcCreditsRecognized)}\n` +
        `WTS credits remaining: ${num(wtsCreditsRemaining)}\n` +
        `WTS tuition remaining: ${money(gross)}\n` +
        `SBC recognition fee: ${money(sbcRecognitionFee)}\n` +
        `Possible SBC recognition fee scholarship: ${money(sbcRecognitionScholarship)}\n` +
        `Support raised: ${money(fundsApplied)}\n` +
        `WTS matching scholarship: Automatically applied to eligible support\n` +
        `WTS matching scholarship: ${money(totalWtsAid)}\n` +
        `Estimated cost after support: ${money(totalOutOfPocket)}\n\n` +
        `This estimate is for planning purposes only and is not a final scholarship award, financial aid offer, or bill. Matching scholarships and SBC recognition fee scholarships are limited, require application or review, and are not guaranteed.`
      );
      els.emailLink.href = `mailto:?subject=${subject}&body=${body}`;
    }

    function preparePrint() {
      const program = CONFIG.programs[selectedProgram];
      const selectedSbcCredits = selectedProgram === "MAC" ? getSelectedSbcCredits() : 0;
      const creditsRemaining = Math.max(0, program.credits - selectedSbcCredits);
      const paceOption = els.creditsPerTerm.options[els.creditsPerTerm.selectedIndex];

      const creditsPerTerm = els.creditsPerTerm.value === "custom"
        ? Math.max(1, Number(els.customCredits.value || 3))
        : Number(els.creditsPerTerm.value);
      const completionRows = buildTerms(
        creditsRemaining,
        creditsPerTerm,
        els.startTerm.value,
        program.termSystem
      );
      const completionTerm = completionRows.length
        ? completionRows[completionRows.length - 1].term
        : els.startTerm.value;

      if (els.printProgram) els.printProgram.textContent = program.name;
      if (els.printCredits) els.printCredits.textContent = num(creditsRemaining);
      if (els.printStartTerm) els.printStartTerm.textContent = termLabel(els.startTerm.value, program.termSystem);
      if (els.printCompletionTerm) els.printCompletionTerm.textContent = termLabel(completionTerm, program.termSystem);
      if (els.printPace) {
        els.printPace.textContent = els.creditsPerTerm.value === "custom"
          ? `${num(creditsPerTerm)} credits per term`
          : paceOption.textContent.split(" / ")[0];
      }
      if (els.printDate) {
        els.printDate.textContent = new Intl.DateTimeFormat("en-US", {
          month: "long", day: "numeric", year: "numeric"
        }).format(new Date());
      }

      document.title = `WTS ${program.name} Cost Estimate`;
    }

    window.addEventListener("beforeprint", preparePrint);

    const programButtons = {
      MATS: els.matsBtn, MAC: els.macBtn, MDiv: els.mdivBtn, MAR: els.marBtn,
      CertTSC: els.certTSCBtn, CertBLC: els.certBLCBtn,
      ThM: els.thmBtn, MDivCampus: els.mdivCampusBtn, MDivFellows: els.mdivFellowsBtn,
      MARCampus: els.marCampusBtn, DMin: els.dminBtn, PhD: els.phdBtn
    };

    // Program category tabs, mirroring the live page's
    // On-Campus / Online / Advanced Degree Programs split.
    let selectedBucket = "online";

    function selectBucket(bucket) {
      selectedBucket = bucket;
      document.querySelectorAll(".bucket-tab").forEach(tab => {
        tab.setAttribute("aria-pressed", String(tab.dataset.bucket === bucket));
      });
      Object.entries(programButtons).forEach(([key, btn]) => {
        if (btn) btn.hidden = CONFIG.programs[key].bucket !== bucket;
      });
      if (CONFIG.programs[selectedProgram].bucket !== bucket) {
        const first = Object.keys(CONFIG.programs)
          .find(k => CONFIG.programs[k].bucket === bucket);
        selectProgram(first);
      }
    }

    // Analytics: push structured interaction events for the site's
    // Google Tag Manager (ingested by GA4/WebFX). Event schema is
    // documented in webflow/ANALYTICS_EVENTS.md. A silent no-op when
    // GTM is absent (mockups, standalone page, local dev), and it must
    // never break the calculator.
    function track(action, params) {
      try {
        const dl = window.dataLayer;
        if (!dl || typeof dl.push !== "function") return;
        dl.push(Object.assign(
          { event: "wts_tuition_savings_calculator", estimator_action: action },
          params || {}
        ));
      } catch (e) { /* analytics failures are not the calculator's problem */ }
    }

    let selectedScholarshipId = null;

    function scholarshipOptions(key) {
      return (SCHOLARSHIPS[key] || []).filter(s => s.calc);
    }

    function activeScholarship() {
      const options = scholarshipOptions(selectedProgram);
      return options.find(s => s.id === selectedScholarshipId) || options[0] || null;
    }

    function renderScholarships(key) {
      if (!els.scholarshipList) return;
      const entries = SCHOLARSHIPS[key] || [];
      const options = entries.filter(s => s.calc);
      const notes = entries.filter(s => !s.calc);
      const chosen = options.find(s => s.id === selectedScholarshipId) || options[0] || null;
      selectedScholarshipId = chosen ? chosen.id : null;

      // Entries without radios read as notes, under a small label so they
      // are clearly informational rather than broken options.
      const noteHead = notes.length === 0 ? ""
        : key === "DMin" ? "Applied automatically:"
        : options.length ? "Also available:"
        : "";

      els.scholarshipList.innerHTML =
        options.map(s => `
          <li class="scholarship-option">
            <label>
              <input type="radio" name="scholarshipChoice" value="${s.id}"${s.id === selectedScholarshipId ? " checked" : ""}>
              <span><strong>${s.name}:</strong> ${s.detail}</span>
            </label>
          </li>`).join("") +
        (noteHead ? `<li class="scholarship-note-head">${noteHead}</li>` : "") +
        notes.map(s => `<li class="scholarship-note"><strong>${s.name}:</strong> ${s.detail}</li>`).join("");

      // Certificates have no Westminster scholarships, so the
      // select-a-scholarship guidance does not apply.
      if (els.scholarshipAnnotation) {
        els.scholarshipAnnotation.hidden = !!CONFIG.programs[key].certificate;
      }
      // "Select the Westminster scholarship..." only makes sense when
      // there are options to select (ThM, DMin, and PhD have none).
      if (els.scholarshipSelectNote) {
        els.scholarshipSelectNote.hidden = options.length === 0;
      }

      els.scholarshipList.querySelectorAll('input[name="scholarshipChoice"]').forEach(input => {
        input.addEventListener("change", () => {
          selectedScholarshipId = input.value;
          track("scholarship_select", { scholarship: input.value, program: selectedProgram });
          calculate();
        });
      });
    }

    function selectProgram(key) {
      selectedProgram = key;
      selectedScholarshipId = null; // back to the program's default scholarship
      setTheme(key);

      Object.keys(programButtons).forEach(k => document.body.classList.remove(`program-${k.toLowerCase()}`));
      document.body.classList.add(`program-${key.toLowerCase()}`);
      document.body.classList.toggle("funded-mode", !!CONFIG.programs[key].funded);
      // With the inputs panel hidden for funded programs, the results card
      // becomes step 2 rather than step 3.
      if (els.resultsStepLabel) {
        els.resultsStepLabel.textContent = CONFIG.programs[key].funded ? "Step 2" : "Step 3";
      }
      // Course-priced programs bill per course, so the per-credit start-term
      // rate increase and pace options do not apply.
      document.body.classList.toggle("course-priced-mode", !!CONFIG.programs[key].coursePriced);
      if (els.fundsRaisedLabel) {
        els.fundsRaisedLabel.textContent = key === "DMin"
          ? "Ministry partner (e.g. church) payments over full program*"
          : "Additional support from outside resources*";
      }

      Object.entries(programButtons).forEach(([k, btn]) => {
        if (!btn) return;
        btn.setAttribute("aria-pressed", k === key);
        btn.classList.toggle("active", k === key);
      });

      renderScholarships(key);
      refreshStartTermOptions(CONFIG.programs[key]);
      updateMacOnlyVisibility();
      calculate();
    }

    Object.entries(programButtons).forEach(([key, btn]) => {
      if (btn) btn.addEventListener("click", () => {
        track("program_select", { program: key, modality: CONFIG.programs[key].bucket });
        selectProgram(key);
      });
    });
    document.querySelectorAll(".bucket-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        track("modality_select", { modality: tab.dataset.bucket });
        selectBucket(tab.dataset.bucket);
      });
    });
    // "Also online" / "Also on campus" chips jump to the same degree in
    // the other modality, which lives on a different bucket tab.
    document.querySelectorAll(".alt-modality[data-jump]").forEach(chip => {
      chip.addEventListener("click", event => {
        event.stopPropagation();
        const key = chip.dataset.jump;
        track("program_select", { program: key, modality: CONFIG.programs[key].bucket, source: "modality_chip" });
        selectBucket(CONFIG.programs[key].bucket);
        selectProgram(key);
      });
    });
    selectBucket(selectedBucket);
    els.sbcScholarshipYes.addEventListener("click", () => selectSbcScholarship(true));
    els.sbcScholarshipNo.addEventListener("click", () => selectSbcScholarship(false));

    if (els.maxMatchBtn) {
      els.maxMatchBtn.addEventListener("click", () => {
        els.fundsRaised.value = Math.round(lastMatchCap);
        track("support_amount", { amount: Math.round(lastMatchCap), source: "max_match", program: selectedProgram });
        calculate();
      });
    }

    document.querySelectorAll(".quick-amount:not(.max-match)").forEach(button => {
      button.addEventListener("click", () => {
        els.fundsRaised.value = button.dataset.amount;
        track("support_amount", { amount: Number(button.dataset.amount), source: "quick", program: selectedProgram });
        calculate();
      });
    });

    [els.fundsRaised, els.startTerm, els.creditsPerTerm, els.customCredits, els.sbcCoverage].forEach(el => {
      if (!el) return;
      el.addEventListener("input", calculate);
      el.addEventListener("change", calculate);
    });

    els.creditsPerTerm.addEventListener("change", () => {
      els.customCreditsField.style.display = els.creditsPerTerm.value === "custom" ? "block" : "none";
      calculate();
    });

    els.fundsRaised.addEventListener("change", () => {
      track("support_amount", {
        amount: Math.max(0, Number(els.fundsRaised.value || 0)),
        source: "typed",
        program: selectedProgram
      });
    });

    els.startTerm.addEventListener("change", () => {
      track("start_term", { term: els.startTerm.value, program: selectedProgram });
    });

    const applyButton = document.querySelectorAll(".apply-cta .apply-button")[0];
    if (applyButton) {
      applyButton.addEventListener("click", () => {
        track("apply_click", {
          program: selectedProgram,
          estimated_net: Number(els.netPrice.textContent.replace(/[^0-9.-]/g, "")) || 0
        });
      });
    }


    document.querySelectorAll(".sbc-course").forEach(input => {
      input.addEventListener("change", () => {
        updateSbcCourseAvailability(input);
        calculate();
      });
    });

    document.body.classList.add(`program-${selectedProgram.toLowerCase()}`);
    setTheme(selectedProgram);
    renderScholarships(selectedProgram);
    updateMacOnlyVisibility();
    calculate();
    preparePrint();
  