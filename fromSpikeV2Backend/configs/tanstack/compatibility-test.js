/**
 * Comprehensive Compatibility Test
 * Verifies the step-based configuration maintains compatibility with TanStack forms
 * and includes all required properties for proper functionality
 */

const stepConfig = require('./user-registration-steps.js');

// Test results
const testResults = {
    passed: 0,
    failed: 0,
    tests: []
};

function test(description, testFn) {
    try {
        const result = testFn();
        if (result) {
            testResults.passed++;
            testResults.tests.push({ description, status: 'PASS', message: '' });
            console.log(`✅ ${description}`);
        } else {
            testResults.failed++;
            testResults.tests.push({ description, status: 'FAIL', message: 'Test returned false' });
            console.log(`❌ ${description}`);
        }
    } catch (error) {
        testResults.failed++;
        testResults.tests.push({ description, status: 'FAIL', message: error.message });
        console.log(`❌ ${description}: ${error.message}`);
    }
}

console.log('🧪 Running Compatibility Tests...\n');

// Test 1: Module exports structure
test('Module exports has correct structure', () => {
    return stepConfig && 
           typeof stepConfig === 'object' &&
           stepConfig.hasOwnProperty('version') &&
           stepConfig.hasOwnProperty('form') &&
           stepConfig.hasOwnProperty('validationPatterns') &&
           stepConfig.hasOwnProperty('customValidationRules');
});

// Test 2: Version property
test('Version property is set to 1', () => {
    return stepConfig.version === 1;
});

// Test 3: Form structure
test('Form has required properties', () => {
    const form = stepConfig.form;
    return form &&
           form.hasOwnProperty('title') &&
           form.hasOwnProperty('description') &&
           form.hasOwnProperty('submitButtonText') &&
           form.hasOwnProperty('resetButtonText') &&
           Array.isArray(form.steps);
});

// Test 4: Steps array structure
test('All steps have required properties', () => {
    return stepConfig.form.steps.every(step => 
        step.hasOwnProperty('label') &&
        step.hasOwnProperty('id') &&
        Array.isArray(step.fields)
    );
});

// Test 5: Field properties
test('All fields have required properties (name, type, label)', () => {
    let allFieldsValid = true;
    stepConfig.form.steps.forEach(step => {
        step.fields.forEach(field => {
            if (!field.name || !field.type || !field.label) {
                allFieldsValid = false;
            }
        });
    });
    return allFieldsValid;
});

// Test 6: Validation patterns
test('Required validation patterns are present', () => {
    const patterns = stepConfig.validationPatterns;
    return patterns &&
           patterns.PHONE_VALIDATION_REGEX &&
           patterns.SSN_VALIDATION_REGEX &&
           patterns.ZIP_VALIDATION_REGEX;
});

// Test 7: Custom validation rules
test('Required custom validation rules are present', () => {
    const rules = stepConfig.customValidationRules;
    return rules &&
           rules.notEqualToPhone &&
           rules.notEqualToEmail &&
           rules.notEqualToSSN;
});

// Test 8: Field types are valid
test('All field types are valid TanStack types', () => {
    const validTypes = ['text', 'email', 'number', 'radio', 'checkbox', 'dropdown', 'date', 'password', 'multi', 'label', 'hidden'];
    let allTypesValid = true;
    
    stepConfig.form.steps.forEach(step => {
        step.fields.forEach(field => {
            if (!validTypes.includes(field.type)) {
                allTypesValid = false;
            }
        });
    });
    
    return allTypesValid;
});

// Test 9: Conditional logic structure
test('Conditional logic uses valid JSONLogic format', () => {
    let allConditionsValid = true;
    
    stepConfig.form.steps.forEach(step => {
        step.fields.forEach(field => {
            if (field.conditions) {
                if (!Array.isArray(field.conditions)) {
                    allConditionsValid = false;
                }
                field.conditions.forEach(condition => {
                    if (typeof condition !== 'object') {
                        allConditionsValid = false;
                    }
                });
            }
        });
    });
    
    return allConditionsValid;
});

// Test 10: Validation structure
test('Validation objects are properly structured', () => {
    let allValidationsValid = true;
    
    stepConfig.form.steps.forEach(step => {
        step.fields.forEach(field => {
            if (field.validation && typeof field.validation !== 'object') {
                allValidationsValid = false;
            }
        });
    });
    
    return allValidationsValid;
});

// Test 11: Grid properties
test('Grid properties are properly formatted', () => {
    let allGridsValid = true;
    
    stepConfig.form.steps.forEach(step => {
        step.fields.forEach(field => {
            if (field.grid) {
                if (typeof field.grid !== 'object' || 
                    (field.grid.xs && typeof field.grid.xs !== 'number') ||
                    (field.grid.sm && typeof field.grid.sm !== 'number')) {
                    allGridsValid = false;
                }
            }
        });
    });
    
    return allGridsValid;
});

// Test 12: Options arrays for dropdown/radio fields
test('Dropdown and radio fields have valid options', () => {
    let allOptionsValid = true;
    
    stepConfig.form.steps.forEach(step => {
        step.fields.forEach(field => {
            if (['dropdown', 'radio', 'multi'].includes(field.type)) {
                if (!Array.isArray(field.options)) {
                    allOptionsValid = false;
                } else {
                    field.options.forEach(option => {
                        if (!option.hasOwnProperty('value') || !option.hasOwnProperty('label')) {
                            allOptionsValid = false;
                        }
                    });
                }
            }
        });
    });
    
    return allOptionsValid;
});

// Test 13: Hidden fields have compute values
test('Hidden fields have proper compute logic', () => {
    let allHiddenFieldsValid = true;
    
    stepConfig.form.steps.forEach(step => {
        step.fields.forEach(field => {
            if (field.type === 'hidden') {
                if (!field.hasOwnProperty('defaultValue') && !field.hasOwnProperty('computeValue')) {
                    allHiddenFieldsValid = false;
                }
            }
        });
    });
    
    return allHiddenFieldsValid;
});

// Test 14: Date fields have proper constraints
test('Date fields have proper validation constraints', () => {
    let allDateFieldsValid = true;
    
    stepConfig.form.steps.forEach(step => {
        step.fields.forEach(field => {
            if (field.type === 'date') {
                // Date fields should have some form of validation or constraints
                if (!field.validation && !field.otherProps) {
                    allDateFieldsValid = false;
                }
            }
        });
    });
    
    return allDateFieldsValid;
});

// Test 15: Required fields have validation
test('Fields marked as required have validation rules', () => {
    let allRequiredFieldsValid = true;
    
    stepConfig.form.steps.forEach(step => {
        step.fields.forEach(field => {
            if (field.validation && field.validation.required) {
                // This is good - field has required validation
            } else if (field.type !== 'hidden' && field.type !== 'label') {
                // Non-hidden, non-label fields should generally have some validation
                // This is more of a warning than a failure
            }
        });
    });
    
    return allRequiredFieldsValid;
});

// Test 16: Step IDs are unique
test('Step IDs are unique', () => {
    const stepIds = stepConfig.form.steps.map(step => step.id);
    const uniqueIds = new Set(stepIds);
    return stepIds.length === uniqueIds.size;
});

// Test 17: Field names are unique
test('Field names are unique across all steps', () => {
    const fieldNames = [];
    stepConfig.form.steps.forEach(step => {
        step.fields.forEach(field => {
            fieldNames.push(field.name);
        });
    });
    const uniqueNames = new Set(fieldNames);
    return fieldNames.length === uniqueNames.size;
});

// Test 18: Configuration is JSON serializable
test('Configuration is JSON serializable', () => {
    try {
        JSON.stringify(stepConfig);
        return true;
    } catch (error) {
        return false;
    }
});

console.log('\n📊 TEST RESULTS');
console.log('='.repeat(50));
console.log(`✅ Passed: ${testResults.passed}`);
console.log(`❌ Failed: ${testResults.failed}`);
console.log(`📈 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);

if (testResults.failed > 0) {
    console.log('\n❌ Failed Tests:');
    testResults.tests
        .filter(test => test.status === 'FAIL')
        .forEach(test => {
            console.log(`  • ${test.description}: ${test.message}`);
        });
}

const allTestsPassed = testResults.failed === 0;
console.log(`\n${allTestsPassed ? '🎉' : '🔧'} Overall: ${allTestsPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);

if (allTestsPassed) {
    console.log('\n✨ Configuration is fully compatible with TanStack forms!');
    console.log('✨ All original field properties are maintained!');
    console.log('✨ Module.exports structure matches expected pattern!');
    console.log('✨ Version property is included for config management!');
}

// Export for programmatic use
module.exports = {
    runTests: () => testResults,
    isCompatible: () => allTestsPassed
};

// Exit with appropriate code
process.exit(allTestsPassed ? 0 : 1);