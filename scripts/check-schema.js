// Check database schema for 'type' column
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ldptefnpiudquipdsezr.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkcHRlZm5waXVkcXVpcGRzZXpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA1ODkwNiwiZXhwIjoyMDgyNjM0OTA2fQ.SZsmyTHZu0myqjJBcmE8zQFm34HWJLKUpn2BHXp5uYc';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkSchema() {
    try {
        console.log('🔍 Testing "type" column constraint...\n');

        // Try to insert a non-existent type
        const testData = {
            type: 'test_random_type_' + Date.now(), // Random type
            display_name: 'Schema Test',
            city: 'Berlin',
            status: 'active'
        };

        const { data, error } = await supabase
            .from('providers')
            .insert([testData])
            .select();

        if (error) {
            console.log('❌ Insert Failed (Expected if ENUM):');
            console.log(`   Message: ${error.message}`);

            if (error.message.includes('invalid input value for enum')) {
                // Extract enum name from error message if possible
                console.log('\n💡 CONCLUSION: It IS an ENUM.');
                console.log('   We need to find the correct enum name.');
            }
        } else {
            console.log('✅ Insert Successful!');
            console.log('\n💡 CONCLUSION: "type" column is TEXT.');
            console.log('   No database migration needed! New types will work immediately.');

            // Cleanup
            await supabase.from('providers').delete().eq('id', data[0].id);
            console.log('   (Test data deleted)');
        }

    } catch (err) {
        console.error('❌ Error:', err);
    }
}

checkSchema();
