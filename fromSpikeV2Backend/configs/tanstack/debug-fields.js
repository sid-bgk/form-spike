/**
 * Debug script to find fields missing labels
 */

const stepConfig = require('./user-registration-steps.js');

console.log('Checking for fields missing labels...\n');

if (stepConfig.form && Array.isArray(stepConfig.form.steps)) {
    stepConfig.form.steps.forEach((step, stepIndex) => {
        console.log(`Step ${stepIndex}: ${step.label}`);
        
        if (Array.isArray(step.fields)) {
            step.fields.forEach((field, fieldIndex) => {
                if (!field.label) {
                    console.log(`  ❌ Field ${fieldIndex}: Missing label`);
                    console.log(`     Name: ${field.name}`);
                    console.log(`     Type: ${field.type}`);
                    console.log(`     Properties: ${Object.keys(field).join(', ')}`);
                    console.log('');
                } else {
                    console.log(`  ✅ Field ${fieldIndex}: ${field.label}`);
                }
            });
        }
        console.log('');
    });
}