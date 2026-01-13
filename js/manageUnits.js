// 1. Initialize Supabase
// We access the global config object defined in js/config.js
const { URL: ProjectURL, ANON_KEY } = window.SUPABASE_CONFIG;

// Create the client using the config variables
// Note: We use a distinct variable name 'supabaseClient' to avoid conflicts
const supabaseClient = window.supabase.createClient(ProjectURL, ANON_KEY);

const MONTHS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

// Elements
const unitSelect = document.getElementById('unitSelect');
const yearSelect = document.getElementById('yearSelect');
const loadingIndicator = document.getElementById('loading');

// 2. Initialize Application
async function init() {
    loadingIndicator.style.display = 'block';

    // A. Populate Year Dropdown Dynamically
    // This ensures that as soon as it is 2026, the option appears automatically.
    populateYearDropdown();
// it seems this part is not working as expected, How can I test it using the browser console?
    // B. Get units alphabetically
    const { data: units, error } = await supabaseClient.from('units').select('*').order('id');
    
    if (error) {
        console.error("Error loading units:", error);
        loadingIndicator.innerText = "Error al cargar unidades.";
        return;
    }

    // C. Populate Unit Dropdown
    units.forEach(unit => {
        const option = document.createElement('option');
        option.value = unit.id;
        option.textContent = unit.name;
        console.log("Adding unit to dropdown:", unit.name);
        unitSelect.appendChild(option);
    });
    
    loadingIndicator.style.display = 'none';

    // D. Load data for the first unit by default
    if (units.length > 0) {
        loadUnitData(units[0].id);
    }
}

// Helper: Generate years from 2021 up to Current Year
function populateYearDropdown() {
    const startYear = 2022; // The historical start of the project
    const currentYear = new Date().getFullYear();
    
    yearSelect.innerHTML = ''; // Clear existing
    
    // Loop backwards so the most recent year is at the top
    for (let y = currentYear; y >= startYear; y--) {
        const option = document.createElement('option');
        option.value = y;
        option.textContent = y;
        yearSelect.appendChild(option);
    }
    
    // Select current year by default
    yearSelect.value = currentYear;
}

// 4. Fetch Data
async function loadUnitData(unitId) {
    if (loadingIndicator) loadingIndicator.style.display = 'block';
    
    // Get the year currently selected by the user
    const selectedYear = parseInt(yearSelect.value);

    const { data: reports, error } = await supabaseClient
        .from('monthly_reports')
        .select('*')
        .eq('unit_id', unitId)
        .order('year', { ascending: true })
        .order('month', { ascending: true });

    if (error) {
        console.error(error);
        return;
    }

    // Pass the selectedYear to the chart function
    renderChart(reports, selectedYear);
    renderTable(reports, selectedYear);
    
    if (loadingIndicator) loadingIndicator.style.display = 'none';
}

// 5. Render Chart
function renderChart(reports, selectedYear) {
    // Determine the system's actual current year just for coloring the "current year" line green
    const systemYear = new Date().getFullYear();
    const yearsInDb = [...new Set(reports.map(r => r.year))].sort();
    
    const dataByYear = {};
    const metaData = { IS: Array(12).fill(null), RV: Array(12).fill(null), Goal: Array(12).fill(null) };
    
    // Initialize arrays for line years
    yearsInDb.forEach(y => dataByYear[y] = Array(12).fill(null));

    reports.forEach(r => {
        // 1. Calculate Total
        const total = r.legacy_total > 0 ? r.legacy_total : (r.adults + r.youth);
        
        if (dataByYear[r.year]) {
            dataByYear[r.year][r.month] = total > 0 ? total : null;
        }
        
        // 2. Capture Metadata STRICTLY for the selected year
        if (r.year === selectedYear) {
            // We use the raw value. If it's null in DB, it stays null in the chart (gap).
            // If it is 0, it plots as 0.
            metaData.IS[r.month] = r.family_search_sign_ins;
            metaData.RV[r.month] = r.valid_recommendations;
            metaData.Goal[r.month] = r.monthly_goal;
        }
    });

    // 3. Build Traces
    const traces = [];
    
    // Year Lines
    yearsInDb.forEach(year => {
        traces.push({
            x: MONTHS,
            y: dataByYear[year],
            name: year.toString(),
            mode: 'lines+markers',
            // Green if it matches the selected year, otherwise gray
            line: { color: year === selectedYear ? '#4ad27f' : '#bebebe' } 
        });
    });

    // Metadata Lines (IS, RV, Goal) - These will be empty (nulls) if no data exists for selectedYear
    traces.push({ x: MONTHS, y: metaData.IS, name: 'IS', mode: 'lines+markers+text', line: { color: 'orange' } });
    traces.push({ x: MONTHS, y: metaData.RV, name: 'RV', mode: 'lines+markers', line: { color: '#559aef' } });
    traces.push({ x: MONTHS, y: metaData.Goal, name: 'Meta', mode: 'lines+markers', line: { dash: 'dot', color: 'red' } });

    const layout = {
        title: `Enviadores de nombres (${selectedYear})`, // Updated title to reflect selection
        xaxis: { title: "Meses" },
        yaxis: { title: "Cantidad" },
        margin: { t: 50, b: 50, l: 40, r: 10 },
        legend: { orientation: "h", y: -0.2 } 
    };

    const config = { responsive: true };
    Plotly.newPlot("myPlot", traces, layout, config);
}

// 6. Render Table (Tailwind Styled)
function renderTable(reports, selectedYear) {
    const container = document.getElementById("dynamictable");
    const yearReports = reports.filter(r => r.year === selectedYear);
    const map = {};
    yearReports.forEach(r => map[r.month] = r);

    // Tailwind classes for styling
    const tableClasses = "min-w-full divide-y divide-gray-200";
    const headClasses = "bg-latterday text-white";
    const thClasses = "px-4 py-3 text-center text-xs font-medium uppercase tracking-wider";
    const tdClasses = "px-4 py-3 whitespace-nowrap text-sm text-center text-gray-600 border-b border-gray-100";
    const totalColClasses = "font-bold text-latterday bg-latterdayLight"; // Highlight total column

    let html = `<table class="${tableClasses}">
        <thead class="${headClasses}">
            <tr>
                <th class="${thClasses}">Mes</th>
                <th class="${thClasses}">Total</th>
                <th class="${thClasses}">Adultos</th>
                <th class="${thClasses}">Jóvenes</th>
                <th class="${thClasses}">Nuevos</th>
                <th class="${thClasses}">JAS</th>
            </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">`;

    MONTHS.forEach((monthName, index) => {
        const r = map[index] || { adults: 0, youth: 0, new_members: 0, ysa: 0, legacy_total: 0 };
        const total = r.legacy_total > 0 ? r.legacy_total : (r.adults + r.youth);
        const displayTotal = total === 0 ? '-' : total;
        
        // Add zebra striping for rows
        const rowClass = index % 2 === 0 ? "bg-white hover:bg-gray-50" : "bg-gray-50 hover:bg-gray-100";

        html += `<tr class="${rowClass}">
            <td class="${tdClasses} font-medium text-gray-800">${monthName}</td>
            <td class="${tdClasses} ${totalColClasses}">${displayTotal}</td>
            <td class="${tdClasses}">${r.adults || '-'}</td>
            <td class="${tdClasses}">${r.youth || '-'}</td>
            <td class="${tdClasses}">${r.new_members || '-'}</td>
            <td class="${tdClasses}">${r.ysa || '-'}</td>
        </tr>`;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', init);

unitSelect.addEventListener('change', (e) => loadUnitData(e.target.value));

yearSelect.addEventListener('change', () => {
    // Reload only the table filtering
    loadUnitData(unitSelect.value);
});