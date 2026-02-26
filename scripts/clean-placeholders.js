// Remove placeholder doctors and lawyers, keep only real Dortmund doctors
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ldptefnpiudquipdsezr.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkcHRlZm5waXVkcXVpcGRzZXpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA1ODkwNiwiZXhwIjoyMDgyNjM0OTA2fQ.SZsmyTHZu0myqjJBcmE8zQFm34HWJLKUpn2BHXp5uYc';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Placeholder cities (not Dortmund area)
const PLACEHOLDER_CITIES = [
    'Berlin', 'Hamburg', 'München', 'Frankfurt', 'Köln',
    'Stuttgart', 'Düsseldorf'
];

async function cleanPlaceholders() {
    try {
        console.log('🔍 Fetching all providers...\n');

        // Get all providers
        const { data: allProviders, error: fetchError } = await supabase
            .from('providers')
            .select('id, type, display_name, city, created_at')
            .order('created_at', { ascending: true });

        if (fetchError) throw fetchError;

        console.log(`📊 Total providers in database: ${allProviders.length}\n`);

        // Identify placeholders (in placeholder cities)
        const placeholders = allProviders.filter(p =>
            PLACEHOLDER_CITIES.includes(p.city)
        );

        // Identify real doctors (Dortmund area)
        const realDoctors = allProviders.filter(p =>
            !PLACEHOLDER_CITIES.includes(p.city)
        );

        console.log('🗑️  Placeholders to DELETE:');
        placeholders.forEach(p => {
            console.log(`   ❌ [${p.type}] ${p.display_name} (${p.city})`);
        });

        console.log(`\n✅ Real doctors to KEEP:`);
        realDoctors.forEach(p => {
            console.log(`   ✓ [${p.type}] ${p.display_name} (${p.city})`);
        });

        console.log(`\n📊 Summary:`);
        console.log(`   - Deleting: ${placeholders.length} placeholders`);
        console.log(`   - Keeping: ${realDoctors.length} real doctors\n`);

        if (placeholders.length > 0) {
            // Delete placeholders
            const placeholderIds = placeholders.map(p => p.id);

            const { error: deleteError } = await supabase
                .from('providers')
                .delete()
                .in('id', placeholderIds);

            if (deleteError) throw deleteError;

            console.log('✅ Successfully deleted all placeholders!');
            console.log(`\n🎯 Database now has ${realDoctors.length} real doctors only!\n`);
        } else {
            console.log('✅ No placeholders found - database is already clean!\n');
        }

    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

cleanPlaceholders();
