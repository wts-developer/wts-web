
    const CONFIG = {
      programs: {
        MATS: {
          name: "MATS",
          credits: 36,
          matchType: "fixedCap",
          fixedCap: 5000,
          termSystem: "online",
          theme: { accent: "#56575a", accentDark: "#3f4042", accentSoft: "#ececed" },
          description: "dollar-for-dollar match up to $5,000"
        },
        MAC: {
          name: "MAC",
          credits: 61,
          matchType: "percentCap",
          percentCap: 0.25,
          termSystem: "online",
          theme: { accent: "#02434d", accentDark: "#01343c", accentSoft: "#e4ece9" },
          description: "dollar-for-dollar match up to 25% of total tuition"
        },
        MDiv: {
          name: "MDiv",
          credits: 111,
          matchType: "estimatedCourseCount",
          estimatedCourses: 43,
          termSystem: "residential",
          theme: { accent: "#8c2233", accentDark: "#6e1726", accentSoft: "#f5e9eb" },
          description: "dollar-for-dollar match estimated at one credit per course across about 43 courses"
        },
        MAR: {
          name: "MAR",
          credits: 74,
          matchType: "estimatedCourseCount",
          estimatedCourses: 23,
          termSystem: "residential",
          theme: { accent: "#bd8b41", accentDark: "#8e662f", accentSoft: "#f7efe3" },
          description: "dollar-for-dollar match estimated at one credit per course across about 23 courses"
        }
      },
      currentRate: 675,
      futureRate: 675,
      futureRateStart: "2027-06",
      termCycle: ["06", "09", "01", "03"],
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

    const $ = id => document.getElementById(id);
    const els = {
      matsBtn: $("matsBtn"), macBtn: $("macBtn"), mdivBtn: $("mdivBtn"), marBtn: $("marBtn"),
      fundsRaised: $("fundsRaised"), startTerm: $("startTerm"),
      creditsPerTerm: $("creditsPerTerm"), customCreditsField: $("customCreditsField"),
      customCredits: $("customCredits"),
      sbcScholarshipBlock: $("sbcScholarshipBlock"), sbcScholarshipYes: $("sbcScholarshipYes"), sbcScholarshipNo: $("sbcScholarshipNo"),
      sbcDetails: $("sbcDetails"), sbcCourseList: $("sbcCourseList"), sbcSelectionNote: $("sbcSelectionNote"), sbcCoverage: $("sbcCoverage"), sbcCoverageLabel: $("sbcCoverageLabel"), sbcFeeNote: $("sbcFeeNote"),
      netPrice: $("netPrice"), resultCaption: $("resultCaption"),
      miniMatch: $("miniMatch"), miniRemaining: $("miniRemaining"), miniRemainingCard: $("miniRemainingCard"), miniGross: $("miniGross"),
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

    function nextTerm(key) {
      let { year, month } = parseTerm(key);
      const monthText = String(month).padStart(2, "0");
      const idx = CONFIG.termCycle.indexOf(monthText);
      const nextMonth = CONFIG.termCycle[(idx + 1) % CONFIG.termCycle.length];
      if (month === 9 && nextMonth === "01") year += 1;
      return termKey(year, Number(nextMonth));
    }

    function termLabel(key, termSystem = "online") {
      const [year, month] = key.split("-").map(Number);
      const names = termSystem === "residential"
        ? { 1: "Winter", 3: "Spring", 6: "Summer", 9: "Fall" }
        : { 1: "January", 3: "March", 6: "June", 9: "September" };
      return `${names[month]} ${year}`;
    }

    function rateForTerm(key) {
      return CONFIG.currentRate;
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
        term = nextTerm(term);
      }
      return rows;
    }

    function capFor(program, gross, startTerm, creditsPerTerm = 3, rows = []) {
      if (program.matchType === "fixedCap") return program.fixedCap;
      if (program.matchType === "percentCap") return gross * program.percentCap;
      if (program.matchType === "estimatedCourseCount") {
        return estimatedCourseCountMatchCap(program, rows, startTerm);
      }
      return 0;
    }

    function estimatedCourseCountMatchCap(program, rows, startTerm) {
      const estimatedCourses = Number(program.estimatedCourses || 0);
      if (!estimatedCourses) return 0;

      const totalCredits = rows.reduce((sum, row) => sum + Number(row.credits || 0), 0);
      if (!totalCredits) return estimatedCourses * rateForTerm(startTerm);

      return rows.reduce((sum, row) => {
        const estimatedCoursesInTerm = estimatedCourses * (Number(row.credits || 0) / totalCredits);
        return sum + (estimatedCoursesInTerm * rateForTerm(row.term));
      }, 0);
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
      let angle = 0;

      values.forEach(item => {
        const pct = item.value / total;
        const start = angle;
        const end = angle + pct * 360;
        item.path.setAttribute("d", item.value > 0 ? describeSlice(110, 110, 100, start, end) : "");
        positionPieLabel(item.label, pct * 100, start, end);
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

    function calculate() {
      updateMacOnlyVisibility();
      const program = CONFIG.programs[selectedProgram];
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

      const fundsApplied = Math.min(fundsRaisedRequested, gross);
      const matchCap = capFor(program, gross, startTerm, creditsPerTerm, rows);
      const standardMatch = scholarshipIncluded ? Math.min(fundsApplied, matchCap, Math.max(0, gross - fundsApplied)) : 0;
      const totalWtsAid = scholarshipIncluded ? Math.min(standardMatch + additionalAid, Math.max(0, gross - fundsApplied)) : 0;
      const studentPaid = Math.max(0, gross - fundsApplied - totalWtsAid);
      const totalOutOfPocket = studentPaid + sbcRecognitionFeeStudentPaid;
      const remainingEligibleMatch = scholarshipIncluded ? Math.max(0, matchCap - standardMatch) : 0;

      const pieStudentPaid = totalOutOfPocket;
      const pieWtsScholarshipSupport = totalWtsAid + sbcRecognitionScholarship;
      const pieTotal = gross + sbcRecognitionFee;

      updatePieChart(pieStudentPaid, fundsApplied, pieWtsScholarshipSupport, pieTotal);

      els.netPrice.textContent = money(totalOutOfPocket);
      els.resultCaption.textContent = selectedProgram === "MAC" && sbcCourses > 0
        ? `For the ${program.name} program after outside support, automatic WTS match, and selected SBC course recognition assumptions.`
        : `For the ${program.name} program after outside support and automatic WTS matching support.`;
      els.miniMatch.textContent = money(totalWtsAid);
      els.miniRemaining.textContent = scholarshipIncluded ? money(remainingEligibleMatch) : "$0";
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
      els.miniRemainingCard.classList.toggle("match-opportunity", showMatchOpportunity);
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

    function selectProgram(key) {
      selectedProgram = key;
      setTheme(key);

      document.body.classList.remove("program-mats", "program-mac", "program-mdiv", "program-mar");
      document.body.classList.add(`program-${key.toLowerCase()}`);

      els.matsBtn.setAttribute("aria-pressed", key === "MATS");
      els.macBtn.setAttribute("aria-pressed", key === "MAC");
      els.mdivBtn.setAttribute("aria-pressed", key === "MDiv");
      els.marBtn.setAttribute("aria-pressed", key === "MAR");

      els.matsBtn.classList.toggle("active", key === "MATS");
      els.macBtn.classList.toggle("active", key === "MAC");
      els.mdivBtn.classList.toggle("active", key === "MDiv");
      els.marBtn.classList.toggle("active", key === "MAR");

      updateMacOnlyVisibility();
      calculate();
    }

    els.matsBtn.addEventListener("click", () => selectProgram("MATS"));
    els.macBtn.addEventListener("click", () => selectProgram("MAC"));
    els.mdivBtn.addEventListener("click", () => selectProgram("MDiv"));
    els.marBtn.addEventListener("click", () => selectProgram("MAR"));
    els.sbcScholarshipYes.addEventListener("click", () => selectSbcScholarship(true));
    els.sbcScholarshipNo.addEventListener("click", () => selectSbcScholarship(false));

    document.querySelectorAll(".quick-amount").forEach(button => {
      button.addEventListener("click", () => {
        els.fundsRaised.value = button.dataset.amount;
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


    document.querySelectorAll(".sbc-course").forEach(input => {
      input.addEventListener("change", () => {
        updateSbcCourseAvailability(input);
        calculate();
      });
    });

    document.body.classList.add(`program-${selectedProgram.toLowerCase()}`);
    setTheme(selectedProgram);
    updateMacOnlyVisibility();
    calculate();
    preparePrint();
  