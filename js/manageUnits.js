// 1. Initialize Supabase
const { URL: ProjectURL, ANON_KEY } = window.SUPABASE_CONFIG;
const supabaseClient = window.supabase.createClient(ProjectURL, ANON_KEY);

const MONTHS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

// Elements
const unitSelect = document.getElementById('unitSelect');
const yearSelect = document.getElementById('yearSelect');
const loadingIndicator = document.getElementById('loading');

// Menu Elements
const adminMenuContainer = document.getElementById('adminMenuContainer');
const menuButton = document.getElementById('menuButton');
const menuDropdown = document.getElementById('menuDropdown');
const btnUpload = document.getElementById('btnUpload');
const btnPrint = document.getElementById('btnPrint');

// Data Store for Unit IDs and Names
let unitsIdNames = [];

// 2. Initialize Application
async function init() {
    loadingIndicator.style.display = 'block';

    // A. Populate Year Dropdown Dynamically
    populateYearDropdown();

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
        
        // Store ID and Name
        unitsIdNames.push({ id: unit.id, name: unit.name });

        unitSelect.appendChild(option);
    });
    
    console.log(unitsIdNames);

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
    const currentYear = new Date().getFullYear();

// --- UPDATED MENU LOGIC ---
    
    // 1. Always show the Hamburger Menu Container (so Print is always available)
    adminMenuContainer.classList.remove('hidden');

    // 2. Conditionally show/hide ONLY the "Upload" button
    if (selectedYear === currentYear) {
        // Current Year: Show Upload Option
        btnUpload.classList.remove('hidden');
    } else {
        // Past Years: Hide Upload Option (Keep Print only)
        btnUpload.classList.add('hidden');
    }

    // Close the dropdown if it happens to be open when switching years
    menuDropdown.classList.add('hidden');

// --- END MENU LOGIC ---

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
    const systemYear = new Date().getFullYear();
    const yearsInDb = [...new Set(reports.map(r => r.year))].sort();
    
    const dataByYear = {};
    const metaData = { IS: Array(12).fill(null), RV: Array(12).fill(null), Goal: Array(12).fill(null) };
    
    yearsInDb.forEach(y => dataByYear[y] = Array(12).fill(null));

    reports.forEach(r => {
        const total = r.legacy_total > 0 ? r.legacy_total : (r.adults + r.youth);
        
        if (dataByYear[r.year]) {
            dataByYear[r.year][r.month] = total > 0 ? total : null;
        }
        
        if (r.year === selectedYear) {
            metaData.IS[r.month] = r.family_search_sign_ins;
            metaData.RV[r.month] = r.valid_recommendations;
            metaData.Goal[r.month] = r.monthly_goal;
        }
    });

    const traces = [];
    
    yearsInDb.forEach(year => {
        traces.push({
            x: MONTHS,
            y: dataByYear[year],
            name: year.toString(),
            mode: 'lines+markers',
            line: { color: year === selectedYear ? '#4ad27f' : '#bebebe' } 
        });
    });

    traces.push({ x: MONTHS, y: metaData.IS, name: 'IS', mode: 'lines+markers+text', line: { color: 'orange' } });
    traces.push({ x: MONTHS, y: metaData.RV, name: 'RV', mode: 'lines+markers', line: { color: '#559aef' } });
    traces.push({ x: MONTHS, y: metaData.Goal, name: 'Meta', mode: 'lines+markers', line: { dash: 'dot', color: 'red' } });

    const layout = {
        title: `Enviadores de nombres (${selectedYear})`, 
        xaxis: { title: "Meses" },
        yaxis: { title: "Cantidad" },
        margin: { t: 50, b: 50, l: 40, r: 10 },
        legend: { orientation: "h", y: -0.2 } 
    };

    const config = { responsive: true };
    Plotly.newPlot("myPlot", traces, layout, config);
}

// 6. Render Table
function renderTable(reports, selectedYear) {
    const container = document.getElementById("dynamictable");
    const yearReports = reports.filter(r => r.year === selectedYear);
    const map = {};
    yearReports.forEach(r => map[r.month] = r);

    const tableClasses = "min-w-full divide-y divide-gray-200";
    const headClasses = "bg-latterday text-white";
    const thClasses = "px-4 py-3 text-center text-xs font-medium uppercase tracking-wider";
    const tdClasses = "px-4 py-3 whitespace-nowrap text-sm text-center text-gray-600 border-b border-gray-100";
    const totalColClasses = "font-bold text-latterday bg-latterdayLight"; 

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

// --- MENU HANDLERS ---

// Toggle dropdown
menuButton.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent document click from closing it immediately
    menuDropdown.classList.toggle('hidden');
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!menuButton.contains(e.target) && !menuDropdown.contains(e.target)) {
        menuDropdown.classList.add('hidden');
    }
});

// Action: Print
btnPrint.addEventListener('click', (e) => {
    e.preventDefault();
    menuDropdown.classList.add('hidden');
    window.print();
});

// Action: Upload (Placeholder)
btnUpload.addEventListener('click', (e) => {
    e.preventDefault();
    menuDropdown.classList.add('hidden');
    alert("Función para subir datos: Próximamente");
    // Logic to open upload modal goes here
});


// Event Listeners
document.addEventListener('DOMContentLoaded', init);

unitSelect.addEventListener('change', (e) => loadUnitData(e.target.value));

yearSelect.addEventListener('change', () => {
    loadUnitData(unitSelect.value);
});