// Verify doctors were inserted
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ldptefnpiudquipdsezr.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkcHRlZm5waXVkcXVpcGRzZXpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA1ODkwNiwiZXhwIjoyMDgyNjM0OTA2fQ.SZsmyTHZu0myqjJBcmE8zQFm34HWJLKUpn2BHXp5uYc';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function verifyDoctors() {
    try {
        console.log('🔍 Checking doctors in database...\n');

        const { data, error, count } = await supabase
            .from('providers')
            .select('display_name, city, address', { count: 'exact' })
            .eq('type', 'doctor')
            .order('city')
            .order('display_name');

        if (error) {
            console.error('❌ Error:', error);
            process.exit(1);
        }

        console.log(`✅ Total doctors in database: ${count}\n`);
        console.log('📋 Doctors by city:\n');

        // Group by city
        const byCity = {};
        data.forEach(doc => {
            if (!byCity[doc.city]) byCity[doc.city] = [];
            byCity[doc.city].push(doc);
        });

        Object.keys(byCity).sort().forEach(city => {
            console.log(`\n🏙️  ${city} (${byCity[city].length} doctors):`);
            byCity[city].forEach(doc => {
                console.log(`   • ${doc.display_name}`);
                if (doc.address) console.log(`     📍 ${doc.address}`);
            });
        });

    } catch (err) {
        console.error('❌ Exception:', err);
        process.exit(1);
    }
}

verifyDoctors();
