/* migrate.js */
const { createClient } = require('@supabase/supabase-js');

// REPLACE THESE WITH YOUR SUPABASE CREDENTIALS (Settings -> API)
const SUPABASE_URL = 'https://outdecjeezousqqvaidt.supabase.co';
const SUPABASE_KEY = 'sb_publishable_UmX_3Txnuats0CAyScuhog_54rsxKq1'; // Use Service Role Key for writing data
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- PASTE YOUR FULL 2025 ARRAYS HERE (from source 235 and 248) ---
let unitList = [ 
    // Paste the full content of unitList from 2025 file here...
      [
        [0,0,3,5,8,10,22,26,36,57,85,98], /*2021*/
        [13,30,37,48,63,86,105,113,126,136,154,165], /*2022*/
        [33,71,110,170,183,197,211,229,238,258,314,346], /*2023*/
        [98,135,175,196,239,270,286,301,320,329,365,399], /*2024*/
        [98,188,277,341,380,417,450,491,518,530,552,581], /*2025*/
        [266,356,342,477,504,546,576,623,650,664,677,702], /*IS*/
        [401,401,401,411,411,411,427,427,427,417,417,417], /*RV*/
        [534,534,534,534,534,534,534,534,534,534,534,534], /*Goal*/
        "Estaca Cárdenas México"
      ],
      [
        [0,0,0,0,0,0,3,3,3,3,5,6],
        [1,3,5,8,11,15,18,19,20,21,27,27],
        [6,17,26,36,38,41,44,44,45,46,54,62],
        [15,31,35,36,48,53,57,59,60,60,62,66],
        [4,23,42,47,48,58,62,76,79,79,83,91],
        [19,50,52,54,59,68,74,78,81,82,83,91],
        [61,61,61,60,60,60,56,56,56,56,56,56], 
        [80,80,80,80,80,80,80,80,80,80,80,80],      
        "Barrio Cañales"
    ],
    [
        [0,0,0,0,1,1,2,2,5,7,8,8],
        [1,1,1,2,3,3,8,9,9,9,11,11],
        [1,2,5,9,10,10,12,12,13,16,26,28],
        [10,10,11,12,15,15,16,17,18,19,26,32],
        [10,16,18,18,26,28,29,33,34,33,35,45],
        [30,31,33,34,38,38,59,62,65,64,65,69],
        [48,48,48,52,52,52,50,50,50,44,44,44],
        [28,28,28,28,28,28,28,28,28,28,28,28],        
        "Barrio Comalcalco"
    ],
    [
        [0,0,3,4,5,5,12,13,13,14,14,21],
        [8,10,11,11,12,21,22,22,26,27,28,29],
        [5,17,21,29,30,30,30,37,39,42,48,48],
        [12,17,31,37,47,50,52,54,55,55,58,62],
        [7,17,20,40,46,46,49,55,61,63,66,72],
        [30,39,53,55,67,67,71,72,86,86,88,100],
        [71,71,71,72,72,72,76,76,76,69,69,69],
        [80,80,80,80,80,80,80,80,80,80,80,80],          
        "Barrio Cunduacán"
    ],
    [
        [0,0,0,0,0,1,1,1,3,3,4,4],
        [0,0,0,0,0,1,2,3,3,3,5,3],
        [0,1,7,17,18,19,18,21,21,21,22,23],
        [11,12,14,15,18,27,27,30,31,31,38,40],
        [10,12,21,29,36,36,40,42,43,44,44,45],
        [24,22,23,26,31,32,40,46,47,47,53,51],
        [37,37,37,36,36,36,39,39,39,36,36,36], 
        [40,40,40,40,40,40,40,40,40,40,40,40],         
        "Barrio Cárdenas"
    ],
    [
        [0,0,0,0,0,0,1,1,1,3,3,3],
        [1,1,1,1,1,1,4,4,4,10,10,10],
        [2,2,4,7,9,12,15,15,15,15,19,20],
        [4,4,6,7,9,9,10,10,13,15,17,20],
        [4,12,21,25,30,32,34,36,37,38,41,39],
        [15,14,17,25,30,36,38,41,41,43,46,44],
        [13,13,13,13,13,13,10,10,10,9,9,9],  
        [40,40,40,40,40,40,40,40,40,40,40,40],       
        "Rama Huimanguillo"
    ],
    [
        [0,0,0,0,0,0,0,2,2,3,7,8],
        [0,5,6,11,13,17,20,20,19,20,21,22],
        [0,4,13,19,20,20,20,24,25,26,35,35],
        [10,13,16,19,25,27,28,32,36,37,42,43],
        [17,27,35,38,40,40,50,55,55,56,58,60],
        [21,23,27,37,47,50,55,62,62,63,64,66],
        [15,15,15,20,20,20,21,21,21,24,24,24],   
        [60,60,60,60,60,60,60,60,60,60,60,60],        
        "Barrio Los Reyes"
    ],
    [
        [0,0,0,1,1,1,1,2,2,15,32,32],
        [2,6,9,9,10,12,15,16,22,21,24,29],
        [13,15,19,33,38,42,46,47,49,59,65,70],
        [24,29,30,33,38,42,46,47,49,52,56,59],
        [18,30,48,57,62,62,62,62,68,70,74,77],
        [63,60,66,79,82,84,84,86,84,97,100,103],
        [56,56,56,56,56,56,59,59,59,67,67,67], 
        [80,80,80,80,80,80,80,80,80,80,80,80],         
        "Barrio Morelos"
    ],
    [
        [0,0,0,0,0,2,2,2,7,8,10,11],
        [1,3,3,5,12,13,13,16,19,21,22,23],
        [4,11,12,16,17,17,17,19,20,21,28,34],
        [4,11,24,27,30,33,37,39,41,43,46,53],
        [28,37,57,69,73,84,92,98,105,110,111,111],
        [48,36,45,68,100,102,110,119,126,132,131,131],
        [63,63,63,66,66,66,76,76,76,70,70,70], 
        [81,81,81,81,81,81,81,81,81,81,81,81],          
        "Barrio Paraíso"
    ],
    [
        [0,0,0,0,0,0,0,0,0,1,2,5],
        [0,1,1,1,1,3,3,4,4,4,5,10],
        [1,1,2,3,3,4,7,8,8,10,15,15],
        [7,7,7,7,12,13,14,15,15,16,17,18],
        [5,12,13,15,16,25,25,26,27,28,31,31],
        [13,19,20,20,29,33,40,37,37,38,40,38],
        [33,33,33,32,32,32,32,32,32,29,29,29], 
        [30,30,30,30,30,30,30,30,30,30,30,30],          
        "Barrio Petrolera"
    ],
    [
        [0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,1,1],
        [1,1,1,1,1,2,2,2,2,2,2,2],
        [1,1,1,1,1,1,1,1,1,1,1,5],
        [1,2,2,3,3,6,7,8,9,9,9,10],
        [3,6,6,6,8,9,10,11,9,12,12.5,13],
        [4,4,4,4,4,4,8,8,8,13,13,13],  
        [15,15,15,15,15,15,15,15,15,15,15,15],        
        "Rama Sánchez Magallanes"
    ]                                

];
// It seems migrate.js just consider migrate from unitGroupList only data for 2025, 

let unitGroupList = [
    // Paste the full content of unitGroupList from 2025 file here...
];

// But we need data of each year (2022, 2023, 2024, 2025) to calculate legacy_total for each month of those years
// So rewrite migrate.js and make changes to manageUnits.js or index.html if needed.
// ------------------------------------------------------------------

const mapUnitNameToId = async (name) => {
    const { data, error } = await supabase.from('units').select('id').eq('name', name).single();
    if (error || !data) {
        console.error(`Unit not found: ${name}`);
        return null;
    }
    return data.id;
};

const upsertReport = async (unitId, year, month, payload) => {
    const { error } = await supabase
        .from('monthly_reports')
        .upsert({ 
            unit_id: unitId, 
            year: year, 
            month: month, 
            ...payload 
        }, { onConflict: 'unit_id, year, month' });

    if (error) console.error(`Error upserting ${year}/${month}:`, error.message);
};

const migrateData = async () => {
    console.log("Starting Migration...");
    
    // Note: unitList[i][8] contains the name in the 2025 file structure [cite: 235]
    for (let i = 0; i < unitList.length; i++) {
        const unitData = unitList[i];
        const unitName = unitData[8]; 
        const unitId = await mapUnitNameToId(unitName);
        
        if (!unitId) continue;
        console.log(`Processing ${unitName}...`);
        
        // 1. Process Historical Years (2021-2024) - Indexes 0 to 3 in unitList [cite: 236]
        const years = [2021, 2022, 2023, 2024];
        for (let y = 0; y < years.length; y++) {
            const yearData = unitData[y]; // Array of 12 months
            const currentYear = years[y];

            for (let m = 0; m < 12; m++) {
                if (yearData[m] !== null && yearData[m] !== undefined) {
                    await upsertReport(unitId, currentYear, m, {
                        legacy_total: yearData[m] // Store as legacy total
                    });
                }
            }
        }

        // 2. Process Current Year (2025) 
        // We use unitGroupList[i] which has the detailed breakdown [cite: 248]
        // And unitList[i][5], [6], [7] for IS, RV, Goal [cite: 236]
        
        const groupData = unitGroupList[i]; // 12 arrays (one per month)
        const isArray = unitData[5];
        const rvArray = unitData[6];
        const goalArray = unitData[7];

        for (let m = 0; m < 12; m++) {
            const monthBreakdown = groupData[m]; // [Total, Adults, Youth, New, YSA]
            
            // Only insert if we have data (Total > 0 or existing record)
            if (monthBreakdown && monthBreakdown[0] > 0) {
                 await upsertReport(unitId, 2025, m, {
                    adults: monthBreakdown[1],
                    youth: monthBreakdown[2],
                    new_members: monthBreakdown[3],
                    ysa: monthBreakdown[4],
                    family_search_sign_ins: isArray[m] || 0,
                    valid_recommendations: rvArray[m] || 0,
                    monthly_goal: goalArray[m] || 0
                });
            }
        }
    }
    console.log("Migration Complete.");
};

migrateData();