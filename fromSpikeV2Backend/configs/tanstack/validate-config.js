/**
 * Configuration Validation Script
 * Validates the step-based TanStack configuration structure and compatibility
 */

const fs = require('fs');
const path = require('path');

// Load the step-based configuration
let stepConfig;
try {
    stepConfig = require('./user-registration-steps.js');
} catch (error) {
    console.log('⚠️  Could not load config file directly due to dependencies. Reading as text...');
    
    // Read and parse 

// Validation results
const validationResults = {
    structureValid: true,
    compatibilityValid: true,
    errors: [],
    warnings: [],
    summary: {}
};

/**
 * Validate the module.exports structure
 */
function validateModuleStructure() {
    console.log('🔍 Validating module.exports structure...');
    
    // Check if config has required top-level properties
    const requiredProps = ['version', 'form'];
    const optionalProps = ['validationPatterns', 'customValidationRules'];
    
    requiredProps.forEach(prop => {
        if (!stepConfig.hasOwnProperty(prop)) {
            validationResults.errors.push(`Missing required property: ${prop}`);
            validationResults.structureValid = false;
        }
    });
    
    // Check version property
    if (stepConfig.version !== 1) {
        validationResults.errors.push(`Version should be 1, found: ${stepConfig.version}`);
    }
    
    // Check form structure
    if (stepConfig.form) {
        const formRequiredProps = ['title', 'description', 'submitButtonText', 'resetButtonText', 'steps'];
        formRequiredProps.forEach(prop => {
            if (!stepConfig.form.hasOwnProperty(prop)) {
                validationResults.errors.push(`Missing required form property: ${prop}`);
                validationResults.structureValid = false;
            }
        });
        
        // Check steps array
        if (!Array.isArray(stepConfig.form.steps)) {
            validationResults.errors.push('Form steps must be an array');
            validationResults.structureValid = false;
        }
    }
    
    console.log('✅ Module structure validation complete');
}

/**
 * Validate step structure
 */
function validateStepStructure() {
    console.log('🔍 Validating step structure...');
    
    if (!stepConfig.form || !Array.isArray(stepConfig.form.steps)) {
        return;
    }
    
    stepConfig.form.steps.forEach((step, index) => {
        // Check required step properties
        const requiredStepProps = ['label', 'id', 'fields'];
        requiredStepProps.forEach(prop => {
            if (!step.hasOwnProperty(prop)) {
                validationResults.errors.push(`Step ${index}: Missing required property: ${prop}`);
                validationResults.structureValid = false;
            }
        });
        
        // Check fields array
        if (!Array.isArray(step.fields)) {
            validationResults.errors.push(`Step ${index}: Fields must be an array`);
            validationResults.structureValid = false;
        }
    });
    
    console.log('✅ Step structure validation complete');
}

/**
 * Validate field properties
 */
function validateFieldProperties() {
    console.log('🔍 Validating field properties...');
    
    if (!stepConfig.form || !Array.isArray(stepConfig.form.steps)) {
        return;
    }
    
    let totalFields = 0;
    const fieldNames = new Set();
    
    stepConfig.form.steps.forEach((step, stepIndex) => {
        if (!Array.isArray(step.fields)) return;
        
        step.fields.forEach((field, fieldIndex) => {
            totalFields++;
            
            // Check required field properties
            const requiredFieldProps = ['name', 'type', 'label'];
            requiredFieldProps.forEach(prop => {
                if (!field.hasOwnProperty(prop)) {
                    validationResults.errors.push(`Step ${stepIndex}, Field ${fieldIndex}: Missing required property: ${prop}`);
                    validationResults.structureValid = false;
                }
            });
            
            // Check for duplicate field names
            if (field.name) {
                if (fieldNames.has(field.name)) {
                    validationResults.warnings.push(`Duplicate field name found: ${field.name}`);
                }
                fieldNames.add(field.name);
            }
            
            // Validate field types
            const validTypes = ['text', 'email', 'number', 'radio', 'checkbox', 'dropdown', 'date', 'password', 'multi', 'label', 'hidden'];
            if (field.type && !validTypes.includes(field.type)) {
                validationResults.warnings.push(`Step ${stepIndex}, Field ${fieldIndex}: Unknown field type: ${field.type}`);
            }
            
            // Check validation structure
            if (field.validation && typeof field.validation !== 'object') {
                validationResults.errors.push(`Step ${stepIndex}, Field ${fieldIndex}: Validation must be an object`);
                validationResults.structureValid = false;
            }
            
            // Check conditions structure (JSONLogic format)
            if (field.conditions && !Array.isArray(field.conditions)) {
                validationResults.errors.push(`Step ${stepIndex}, Field ${fieldIndex}: Conditions must be an array`);
                validationResults.structureValid = false;
            }
        });
    });
    
    validationResults.summary.totalFields = totalFields;
    validationResults.summary.uniqueFields = fieldNames.size;
    validationResults.summary.totalSteps = stepConfig.form.steps.length;
    
    console.log('✅ Field properties validation complete');
}

/**
 * Validate compatibility with TanStack form requirements
 */
function validateTanStackCompatibility() {
    console.log('🔍 Validating TanStack compatibility...');
    
    // Check for TanStack-specific field properties
    const tanstackProps = ['name', 'type', 'label', 'validation', 'defaultValue', 'placeholder'];
    let compatibleFields = 0;
    
    if (stepConfig.form && Array.isArray(stepConfig.form.steps)) {
        stepConfig.form.steps.forEach(step => {
            if (Array.isArray(step.fields)) {
                step.fields.forEach(field => {
                    const hasRequiredProps = tanstackProps.slice(0, 3).every(prop => field.hasOwnProperty(prop));
                    if (hasRequiredProps) {
                        compatibleFields++;
                    }
                });
            }
        });
    }
    
    validationResults.summary.compatibleFields = compatibleFields;
    
    // Check for validation patterns
    if (stepConfig.validationPatterns) {
        const expectedPatterns = ['PHONE_VALIDATION_REGEX', 'SSN_VALIDATION_REGEX', 'ZIP_VALIDATION_REGEX'];
        expectedPatterns.forEach(pattern => {
            if (!stepConfig.validationPatterns[pattern]) {
                validationResults.warnings.push(`Missing validation pattern: ${pattern}`);
            }
        });
    }
    
    // Check for custom validation rules
    if (stepConfig.customValidationRules) {
        const expectedRules = ['notEqualToPhone', 'notEqualToEmail', 'notEqualToSSN'];
        expectedRules.forEach(rule => {
            if (!stepConfig.customValidationRules[rule]) {
                validationResults.warnings.push(`Missing custom validation rule: ${rule}`);
            }
        });
    }
    
    console.log('✅ TanStack compatibility validation complete');
}

/**
 * Validate conditional logic structure
 */
function validateConditionalLogic() {
    console.log('🔍 Validating conditional logic...');
    
    if (!stepConfig.form || !Array.isArray(stepConfig.form.steps)) {
        return;
    }
    
    let conditionalFields = 0;
    
    stepConfig.form.steps.forEach((step, stepIndex) => {
        if (!Array.isArray(step.fields)) return;
        
        step.fields.forEach((field, fieldIndex) => {
            if (field.conditions) {
                conditionalFields++;
                
                // Validate JSONLogic structure
                if (Array.isArray(field.conditions)) {
                    field.conditions.forEach((condition, condIndex) => {
                        if (typeof condition !== 'object') {
                            validationResults.errors.push(`Step ${stepIndex}, Field ${fieldIndex}, Condition ${condIndex}: Must be an object`);
                            validationResults.compatibilityValid = false;
                        }
                        
                        // Check for valid JSONLogic operators
                        const validOperators = ['===', 'or', 'and', 'contains', 'var'];
                        const hasValidOperator = Object.keys(condition).some(key => validOperators.includes(key));
                        
                        if (!hasValidOperator) {
                            validationResults.warnings.push(`Step ${stepIndex}, Field ${fieldIndex}: Condition may use unsupported operator`);
                        }
                    });
                }
            }
        });
    });
    
    validationResults.summary.conditionalFields = conditionalFields;
    
    console.log('✅ Conditional logic validation complete');
}

/**
 * Run all validations
 */
function runValidation() {
    console.log('🚀 Starting configuration validation...\n');
    
    validateModuleStructure();
    validateStepStructure();
    validateFieldProperties();
    validateTanStackCompatibility();
    validateConditionalLogic();
    
    // Generate report
    console.log('\n📊 VALIDATION REPORT');
    console.log('='.repeat(50));
    
    console.log(`\n📈 Summary:`);
    console.log(`  • Total Steps: ${validationResults.summary.totalSteps || 0}`);
    console.log(`  • Total Fields: ${validationResults.summary.totalFields || 0}`);
    console.log(`  • Unique Fields: ${validationResults.summary.uniqueFields || 0}`);
    console.log(`  • Compatible Fields: ${validationResults.summary.compatibleFields || 0}`);
    console.log(`  • Conditional Fields: ${validationResults.summary.conditionalFields || 0}`);
    
    if (validationResults.errors.length > 0) {
        console.log(`\n❌ Errors (${validationResults.errors.length}):`);
        validationResults.errors.forEach(error => console.log(`  • ${error}`));
    }
    
    if (validationResults.warnings.length > 0) {
        console.log(`\n⚠️  Warnings (${validationResults.warnings.length}):`);
        validationResults.warnings.forEach(warning => console.log(`  • ${warning}`));
    }
    
    const overallValid = validationResults.structureValid && validationResults.compatibilityValid;
    
    console.log(`\n${overallValid ? '✅' : '❌'} Overall Status: ${overallValid ? 'VALID' : 'INVALID'}`);
    
    if (overallValid) {
        console.log('\n🎉 Configuration is valid and compatible with TanStack forms!');
    } else {
        console.log('\n🔧 Configuration needs fixes before it can be used.');
    }
    
    return overallValid;
}

// Run validation if called directly
if (require.main === module) {
    const isValid = runValidation();
    process.exit(isValid ? 0 : 1);
}

module.exports = {
    runValidation,
    validationResults
};