// JavaScript Programming Notes Website - Main Script

// Character mapping for URL-safe filenames
const charMap = {
    ' ': '%20', // space to encoded space
};

function sanitizeFilePath(filePath) {
    let sanitizedPath = filePath;
    // Replace the UTF-8 encoding of en-dash and em-dash with actual characters
    // These often appear as â€“ and â€” in JavaScript strings when there's an encoding mismatch
    sanitizedPath = sanitizedPath.replace(/â€“/g, '–'); // UTF-8 en-dash to actual en-dash
    sanitizedPath = sanitizedPath.replace(/â€”/g, '—'); // UTF-8 em-dash to actual em-dash
    
    // Apply character mapping
    for (const [char, replacement] of Object.entries(charMap)) {
        sanitizedPath = sanitizedPath.split(char).join(replacement);
    }
    return sanitizedPath;
}

// Theme management
let currentTheme = localStorage.getItem('theme') || 'dark';

// Font size settings
let currentFontSize = parseInt(localStorage.getItem('fontSize') || '16');

// Current file and path tracking
let currentFile = null;
let currentPath = [];

// Navigation state
const navState = {};

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadTheme(currentTheme);
    applyFontSize(currentFontSize);
    buildNavigation();
    setupEventListeners();
    showWelcomeMessage();
}

function setupEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', handleSearch);
    
    // Navigation controls
    document.getElementById('expandAll').addEventListener('click', () => toggleAllNavItems(true));
    document.getElementById('collapseAll').addEventListener('click', () => toggleAllNavItems(false));
    
    // Font size controls
    document.getElementById('fontSizeDecrease').addEventListener('click', () => adjustFontSize(-1));
    document.getElementById('fontSizeIncrease').addEventListener('click', () => adjustFontSize(1));
    
    // Focus mode
    document.getElementById('focusMode').addEventListener('click', toggleFocusMode);
    
    // Copy content
    document.getElementById('copyContent').addEventListener('click', copyContent);
}

function loadTheme(themeName) {
    document.body.classList.remove('light-theme', 'kindle-theme');
    
    switch(themeName) {
        case 'light':
            document.body.classList.add('light-theme');
            document.querySelector('#themeToggle i').className = 'fas fa-sun';
            break;
        case 'kindle':
            document.body.classList.add('kindle-theme');
            document.querySelector('#themeToggle i').className = 'fas fa-book';
            break;
        default:
            document.body.classList.add('dark-theme');
            document.querySelector('#themeToggle i').className = 'fas fa-moon';
            currentTheme = 'dark';
    }
    
    localStorage.setItem('theme', currentTheme);
}

function toggleTheme() {
    switch(currentTheme) {
        case 'dark':
            currentTheme = 'light';
            break;
        case 'light':
            currentTheme = 'kindle';
            break;
        case 'kindle':
        default:
            currentTheme = 'dark';
    }
    
    loadTheme(currentTheme);
}

function applyFontSize(fontSize) {
    document.documentElement.style.setProperty('--font-size', fontSize + 'px');
    document.body.style.fontSize = fontSize + 'px';
    localStorage.setItem('fontSize', fontSize.toString());
}

function adjustFontSize(change) {
    const newFontSize = Math.max(12, Math.min(24, currentFontSize + change));
    if (newFontSize !== currentFontSize) {
        currentFontSize = newFontSize;
        applyFontSize(currentFontSize);
    }
}

function toggleFocusMode() {
    document.body.classList.toggle('focus-mode');
}

function copyContent() {
    const contentArea = document.getElementById('contentArea');
    const text = contentArea.innerText || contentArea.textContent;
    
    navigator.clipboard.writeText(text)
        .then(() => {
            showNotification('Content copied to clipboard!');
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
            showNotification('Failed to copy content.');
        });
}

function showNotification(message) {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(note => note.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--accent-primary);
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        z-index: 1000;
        animation: fadeInOut 3s ease-out forwards;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function buildNavigation() {
    const navList = document.getElementById('navList');
    navList.innerHTML = '';
    
    // Build navigation tree from directory structure
    const navItems = [
        { name: 'JAVASCRIPT COURSE – INDEX.txt', path: 'JAVASCRIPT COURSE – INDEX.txt', type: 'file' },
        { name: 'JavaScript Review.txt', path: 'JavaScript Review.txt', type: 'file' },
        { name: 'Variables and Strings', path: 'Variables_and_Strings', type: 'folder', children: [
            { name: 'Introduction to JavaScript', path: 'Variables_and_Strings/Introduction_to_JavaScript', type: 'folder', children: [
                { name: 'How Do You Embed JavaScript in HTML_.txt', path: 'Variables_and_Strings/Introduction_to_JavaScript/How Do You Embed JavaScript in HTML_.txt', type: 'file' },
                { name: 'How Do You Use Console.log() to Output Information_.txt', path: 'Variables_and_Strings/Introduction_to_JavaScript/How Do You Use Console.log() to Output Information_.txt', type: 'file' },
                { name: 'What Are Comments in JavaScript_.txt', path: 'Variables_and_Strings/Introduction_to_JavaScript/What Are Comments in JavaScript_.txt', type: 'file' },
                { name: 'What Is the Difference Between Script Tags and External Files_.txt', path: 'Variables_and_Strings/Introduction_to_JavaScript/What Is the Difference Between Script Tags and External Files_.txt', type: 'file' }
            ]},
            { name: 'Introduction to Strings', path: 'Variables_and_Strings/Introduction_to_Strings', type: 'folder', children: [
                { name: 'How Do You Create and Manipulate String Values_.txt', path: 'Variables_and_Strings/Introduction_to_Strings/How Do You Create and Manipulate String Values_.txt', type: 'file' },
                { name: 'How Do You Concatenate Strings in JavaScript_.txt', path: 'Variables_and_Strings/Introduction_to_Strings/How Do You Concatenate Strings in JavaScript_.txt', type: 'file' },
                { name: 'What Are Template Literals, and How Do They Work_.txt', path: 'Variables_and_Strings/Introduction_to_Strings/What Are Template Literals, and How Do They Work_.txt', type: 'file' }
            ]},
            { name: 'Understanding Code Clarity', path: 'Variables_and_Strings/Understanding_Code_Clarity', type: 'folder', children: [
                { name: 'How Do You Write Readable and Maintainable Code_.txt', path: 'Variables_and_Strings/Understanding_Code_Clarity/How Do You Write Readable and Maintainable Code_.txt', type: 'file' },
                { name: 'What Are Best Practices for Code Documentation_.txt', path: 'Variables_and_Strings/Understanding_Code_Clarity/What Are Best Practices for Code Documentation_.txt', type: 'file' }
            ]},
            { name: 'Working with Data Types', path: 'Variables_and_Strings/Working_with_Data_Types', type: 'folder', children: [
                { name: 'What Are the Different Data Types in JavaScript_.txt', path: 'Variables_and_Strings/Working_with_Data_Types/What Are the Different Data Types in JavaScript_.txt', type: 'file' },
                { name: 'How Do You Check the Type of a Value_.txt', path: 'Variables_and_Strings/Working_with_Data_Types/How Do You Check the Type of a Value_.txt', type: 'file' }
            ]},
            { name: 'Working with String Character Methods', path: 'Variables_and_Strings/Working_with_String_Character_Methods', type: 'folder', children: [
                { name: 'What Are Common String Methods.txt', path: 'Variables_and_Strings/Working_with_String_Character_Methods/What Are Common String Methods.txt', type: 'file' }
            ]},
            { name: 'Working with String Formatting Methods', path: 'Variables_and_Strings/Working_with_String_Formatting_Methods', type: 'folder', children: [
                { name: 'What Are String Formatting Methods.txt', path: 'Variables_and_Strings/Working_with_String_Formatting_Methods/What Are String Formatting Methods.txt', type: 'file' }
            ]},
            { name: 'Working with String Modification Methods', path: 'Variables_and_Strings/Working_with_String_Modification_Methods', type: 'folder', children: [
                { name: 'What Are String Modification Methods.txt', path: 'Variables_and_Strings/Working_with_String_Modification_Methods/What Are String Modification Methods.txt', type: 'file' }
            ]},
            { name: 'Working with String Search and Slice Methods', path: 'Variables_and_Strings/Working_with_String_Search_and_Slice_Methods', type: 'folder', children: [
                { name: 'What Are String Search and Slice Methods.txt', path: 'Variables_and_Strings/Working_with_String_Search_and_Slice_Methods/What Are String Search and Slice Methods.txt', type: 'file' }
            ]},
            { name: 'Working with Strings in JavaScript', path: 'Variables_and_Strings/Working_with_Strings_in_JavaScript', type: 'folder', children: [
                { name: 'How Do You Work with Strings in JavaScript.txt', path: 'Variables_and_Strings/Working_with_Strings_in_JavaScript/How Do You Work with Strings in JavaScript.txt', type: 'file' },
                { name: 'What Are String Immutability.txt', path: 'Variables_and_Strings/Working_with_Strings_in_JavaScript/What Are String Immutability.txt', type: 'file' }
            ]},
            { name: 'JavaScript Strings Review.txt', path: 'Variables_and_Strings/JavaScript Strings Review.txt', type: 'file' },
            { name: 'JavaScript Variables and Data Types Review.txt', path: 'Variables_and_Strings/JavaScript Variables and Data Types Review.txt', type: 'file' }
        ]},
        { name: 'Booleans_and_Numbers', path: 'Booleans_and_Numbers', type: 'folder', children: [
            { name: 'Understanding_Comparisons_and_Conditionals', path: 'Booleans_and_Numbers/Understanding_Comparisons_and_Conditionals', type: 'folder', children: [
                { name: 'How Do Comparisons Work with Null and Undefined Data Types_.txt', path: 'Booleans_and_Numbers/Understanding_Comparisons_and_Conditionals/How Do Comparisons Work with Null and Undefined Data Types_.txt', type: 'file' },
                { name: 'What Are Switch Statements and How Do They Differ from If_Else Chains_.txt', path: 'Booleans_and_Numbers/Understanding_Comparisons_and_Conditionals/What Are Switch Statements and How Do They Differ from If_Else Chains_.txt', type: 'file' }
            ]},
            { name: 'Working_with_Comparison_and_Boolean_Operators', path: 'Booleans_and_Numbers/Working_with_Comparison_and_Boolean_Operators', type: 'folder', children: [
                { name: 'What Are Booleans, and How Do They Work with Equality and Inequality Operators_.txt', path: 'Booleans_and_Numbers/Working_with_Comparison_and_Boolean_Operators/What Are Booleans, and How Do They Work with Equality and Inequality Operators_.txt', type: 'file' },
                { name: 'What Are Comparison Operators, and How Does They Work_.txt', path: 'Booleans_and_Numbers/Working_with_Comparison_and_Boolean_Operators/What Are Comparison Operators, and How Does They Work_.txt', type: 'file' }
            ]},
            { name: 'Working_with_Conditional_Logic_and_Math_Methods', path: 'Booleans_and_Numbers/Working_with_Conditional_Logic_and_Math_Methods', type: 'folder', children: [
                { name: 'What Are Binary Logical Operators, and How Do They Work_.txt', path: 'Booleans_and_Numbers/Working_with_Conditional_Logic_and_Math_Methods/What Are Binary Logical Operators, and How Do They Work_.txt', type: 'file' },
                { name: 'What Are Conditional Statements, and How Do If_Else If_Else Statements Work_.txt', path: 'Booleans_and_Numbers/Working_with_Conditional_Logic_and_Math_Methods/What Are Conditional Statements, and How Do If_Else If_Else Statements Work_.txt', type: 'file' },
                { name: 'What Is the Math Object in JavaScript, and What Are Some Common Methods_.txt', path: 'Booleans_and_Numbers/Working_with_Conditional_Logic_and_Math_Methods/What Is the Math Object in JavaScript, and What Are Some Common Methods_.txt', type: 'file' }
            ]},
            { name: 'Working_with_Numbers_and_Arithmetic_Operators', path: 'Booleans_and_Numbers/Working_with_Numbers_and_Arithmetic_Operators', type: 'folder', children: [
                { name: 'What Are the Different Arithmetic Operators in JavaScript_.txt', path: 'Booleans_and_Numbers/Working_with_Numbers_and_Arithmetic_Operators/What Are the Different Arithmetic Operators in JavaScript_.txt', type: 'file' },
                { name: 'What Happens When You Try to Do Calculations with Numbers and Strings_.txt', path: 'Booleans_and_Numbers/Working_with_Numbers_and_Arithmetic_Operators/What Happens When You Try to Do Calculations with Numbers and Strings_.txt', type: 'file' },
                { name: 'What Is the Number Type in JavaScript, and What Are the Different Types of Numbers Available_.txt', path: 'Booleans_and_Numbers/Working_with_Numbers_and_Arithmetic_Operators/What Is the Number Type in JavaScript, and What Are the Different Types of Numbers Available_.txt', type: 'file' }
            ]},
            { name: 'Working_with_Numbers_and_Common_Number_Methods', path: 'Booleans_and_Numbers/Working_with_Numbers_and_Common_Number_Methods', type: 'folder', children: [
                { name: 'How Do the parseFloat() and parseInt() Methods Work_.txt', path: 'Booleans_and_Numbers/Working_with_Numbers_and_Common_Number_Methods/How Do the parseFloat() and parseInt() Methods Work_.txt', type: 'file' },
                { name: 'How Does isNaN Work_.txt', path: 'Booleans_and_Numbers/Working_with_Numbers_and_Common_Number_Methods/How Does isNaN Work_.txt', type: 'file' },
                { name: 'What Is the toFixed() Method, and How Does It Work_.txt', path: 'Booleans_and_Numbers/Working_with_Numbers_and_Common_Number_Methods/What Is the toFixed() Method, and How Does It Work_.txt', type: 'file' }
            ]},
            { name: 'Working_with_Operator_Behavior', path: 'Booleans_and_Numbers/Working_with_Operator_Behavior', type: 'folder', children: [
                { name: 'How Do the Increment and Decrement Operators Work_.txt', path: 'Booleans_and_Numbers/Working_with_Operator_Behavior/How Do the Increment and Decrement Operators Work_.txt', type: 'file' },
                { name: 'How Does Operator Precedence Work_.txt', path: 'Booleans_and_Numbers/Working_with_Operator_Behavior/How Does Operator Precedence Work_.txt', type: 'file' },
                { name: 'What Are Compound Assignment Operators in JavaScript, and How Do They Work_.txt', path: 'Booleans_and_Numbers/Working_with_Operator_Behavior/What Are Compound Assignment Operators in JavaScript, and How Do They Work_.txt', type: 'file' }
            ]},
            { name: 'Working_with_Unary_and_Bitwise_Operators', path: 'Booleans_and_Numbers/Working_with_Unary_and_Bitwise_Operators', type: 'folder', children: [
                { name: 'What Are Bitwise Operators, and How Do They Work_.txt', path: 'Booleans_and_Numbers/Working_with_Unary_and_Bitwise_Operators/What Are Bitwise Operators, and How Do They Work_.txt', type: 'file' },
                { name: 'What Are Unary Operators, and How Do They Work_.txt', path: 'Booleans_and_Numbers/Working_with_Unary_and_Bitwise_Operators/What Are Unary Operators, and How Do They Work_.txt', type: 'file' }
            ]},
            { name: 'JavaScript Comparisons and Conditionals Review.txt', path: 'Booleans_and_Numbers/JavaScript Comparisons and Conditionals Review.txt', type: 'file' },
            { name: 'JavaScript Math Review.txt', path: 'Booleans_and_Numbers/JavaScript Math Review.txt', type: 'file' }
        ]},
        { name: 'Functions', path: 'Functions', type: 'folder', children: [
            { name: 'Working with Functions', path: 'Functions/Working_with_Functions', type: 'folder', children: [
                { name: 'How Do You Define and Call Functions in JavaScript_.txt', path: 'Functions/Working_with_Functions/How Do You Define and Call Functions in JavaScript_.txt', type: 'file' },
                { name: 'What Are Arrow Functions, and How Do They Differ from Regular Functions_.txt', path: 'Functions/Working_with_Functions/What Are Arrow Functions, and How Do They Differ from Regular Functions_.txt', type: 'file' },
                { name: 'What Are Function Parameters and Arguments_.txt', path: 'Functions/Working_with_Functions/What Are Function Parameters and Arguments_.txt', type: 'file' }
            ]},
            { name: 'JavaScript Functions Review.txt', path: 'Functions/JavaScript Functions Review.txt', type: 'file' }
        ]},
        { name: 'Arrays', path: 'Arrays', type: 'folder', children: [
            { name: 'Working_with_Arrays', path: 'Arrays/Working_with_Arrays', type: 'folder', children: [
                { name: 'How Can You Use String and Array Methods to Reverse a String_.txt', path: 'Arrays/Working_with_Arrays/How Can You Use String and Array Methods to Reverse a String_.txt', type: 'file' },
                { name: 'How Do You Access and Update Elements in an Array_.txt', path: 'Arrays/Working_with_Arrays/How Do You Access and Update Elements in an Array_.txt', type: 'file' },
                { name: 'How Do You Add and Remove Elements from the Beginning and End of an Array_.txt', path: 'Arrays/Working_with_Arrays/How Do You Add and Remove Elements from the Beginning and End of an Array_.txt', type: 'file' },
                { name: 'What Are the Key Characteristics of JavaScript Arrays_.txt', path: 'Arrays/Working_with_Arrays/What Are the Key Characteristics of JavaScript Arrays_.txt', type: 'file' },
                { name: 'What Is Array Destructuring, and How Does It Work_.txt', path: 'Arrays/Working_with_Arrays/What Is Array Destructuring, and How Does It Work_.txt', type: 'file' },
                { name: 'What Is the Difference Between One-Dimensional and Two-Dimensional Arrays_.txt', path: 'Arrays/Working_with_Arrays/What Is the Difference Between One-Dimensional and Two-Dimensional Arrays_.txt', type: 'file' }
            ]},
            { name: 'Working_with_Common_Array_Methods', path: 'Arrays/Working_with_Common_Array_Methods', type: 'folder', children: [
                { name: 'How Can You Check if an Array Contains a Certain Value_.txt', path: 'Arrays/Working_with_Common_Array_Methods/How Can You Check if an Array Contains a Certain Value_.txt', type: 'file' },
                { name: 'How Do You Add and Remove Elements from the Middle of an Array_.txt', path: 'Arrays/Working_with_Common_Array_Methods/How Do You Add and Remove Elements from the Middle of an Array_.txt', type: 'file' },
                { name: 'How Do You Get the Index for an Element in an Array Using the indexOf Method_.txt', path: 'Arrays/Working_with_Common_Array_Methods/How Do You Get the Index for an Element in an Array Using the indexOf Method_.txt', type: 'file' },
                { name: 'What Is a Shallow Copy of an Array, and What Are Some Ways to Create These Copies_.txt', path: 'Arrays/Working_with_Common_Array_Methods/What Is a Shallow Copy of an Array, and What Are Some Ways to Create These Copies_.txt', type: 'file' }
            ]},
            { name: 'JavaScript Arrays Review.txt', path: 'Arrays/JavaScript Arrays Review.txt', type: 'file' }
        ]},
        { name: 'Objects', path: 'Objects', type: 'folder', children: [
            { name: 'Introduction to JavaScript Objects and Their Properties', path: 'Objects/Introduction_to_JavaScript_Objects_and_Their_Properties', type: 'folder', children: [
                { name: 'How Do You Create and Manipulate Objects in JavaScript_.txt', path: 'Objects/Introduction_to_JavaScript_Objects_and_Their_Properties/How Do You Create and Manipulate Objects in JavaScript_.txt', type: 'file' },
                { name: 'How Do You Access Object Properties Using Different Methods_.txt', path: 'Objects/Introduction_to_JavaScript_Objects_and_Their_Properties/How Do You Access Object Properties Using Different Methods_.txt', type: 'file' },
                { name: 'How Do You Iterate Over Object Properties_.txt', path: 'Objects/Introduction_to_JavaScript_Objects_and_Their_Properties/How Do You Iterate Over Object Properties_.txt', type: 'file' },
                { name: 'What Are Constructor Functions, and How Do They Work_.txt', path: 'Objects/Introduction_to_JavaScript_Objects_and_Their_Properties/What Are Constructor Functions, and How Do They Work_.txt', type: 'file' },
                { name: 'What Are Factory Functions, and How Do They Work_.txt', path: 'Objects/Introduction_to_JavaScript_Objects_and_Their_Properties/What Are Factory Functions, and How Do They Work_.txt', type: 'file' },
                { name: 'What Are Getter and Setter Methods in JavaScript Objects_.txt', path: 'Objects/Introduction_to_JavaScript_Objects_and_Their_Properties/What Are Getter and Setter Methods in JavaScript Objects_.txt', type: 'file' },
                { name: 'What Is Prototypal Inheritance in JavaScript_.txt', path: 'Objects/Introduction_to_JavaScript_Objects_and_Their_Properties/What Is Prototypal Inheritance in JavaScript_.txt', type: 'file' }
            ]},
            { name: 'Working with JSON', path: 'Objects/Working_with_JSON', type: 'folder', children: [
                { name: 'How Do You Parse and Stringify JSON Data_.txt', path: 'Objects/Working_with_JSON/How Do You Parse and Stringify JSON Data_.txt', type: 'file' },
                { name: 'What Are Common Patterns for Working with JSON_.txt', path: 'Objects/Working_with_JSON/What Are Common Patterns for Working with JSON_.txt', type: 'file' }
            ]},
            { name: 'Working with Optional Chaining and Object Destructuring', path: 'Objects/Working_with_Optional_Chaining_and_Object_Destructuring', type: 'folder', children: [
                { name: 'How Does Optional Chaining Work in JavaScript_.txt', path: 'Objects/Working_with_Optional_Chaining_and_Object_Destructuring/How Does Optional Chaining Work in JavaScript_.txt', type: 'file' },
                { name: 'What Is Object Destructuring, and How Does It Work_.txt', path: 'Objects/Working_with_Optional_Chaining_and_Object_Destructuring/What Is Object Destructuring, and How Does It Work_.txt', type: 'file' }
            ]},
            { name: 'JavaScript Objects Review.txt', path: 'Objects/JavaScript Objects Review.txt', type: 'file' }
        ]},
        { name: 'Classes', path: 'Classes', type: 'folder', children: [
            { name: 'Understanding_How_to_Work_with_Classes_in_JavaScript', path: 'Classes/Understanding_How_to_Work_with_Classes_in_JavaScript', type: 'folder', children: [
                { name: 'How Does the This Keyword Work_.txt', path: 'Classes/Understanding_How_to_Work_with_Classes_in_JavaScript/How Does the This Keyword Work_.txt', type: 'file' },
                { name: 'What Are Classes, and How Do They Work in JavaScript_.txt', path: 'Classes/Understanding_How_to_Work_with_Classes_in_JavaScript/What Are Classes, and How Do They Work in JavaScript_.txt', type: 'file' },
                { name: 'What Are Static Properties and Methods in Classes_.txt', path: 'Classes/Understanding_How_to_Work_with_Classes_in_JavaScript/What Are Static Properties and Methods in Classes_.txt', type: 'file' },
                { name: 'What Is Class Inheritance, and How Does It Work_.txt', path: 'Classes/Understanding_How_to_Work_with_Classes_in_JavaScript/What Is Class Inheritance, and How Does It Work_.txt', type: 'file' }
            ]},
            { name: 'JavaScript Classes Review.txt', path: 'Classes/JavaScript Classes Review.txt', type: 'file' }
        ]},
        { name: 'Loops', path: 'Loops', type: 'folder', children: [
            { name: 'Working with Loops', path: 'Loops/Working_with_Loops', type: 'folder', children: [
                { name: 'How Do For Loops Work in JavaScript_.txt', path: 'Loops/Working_with_Loops/How Do For Loops Work in JavaScript_.txt', type: 'file' },
                { name: 'How Do While and Do-While Loops Work in JavaScript_.txt', path: 'Loops/Working_with_Loops/How Do While and Do-While Loops Work in JavaScript_.txt', type: 'file' },
                { name: 'How Do You Iterate Over Arrays Using Different Loop Types_.txt', path: 'Loops/Working_with_Loops/How Do You Iterate Over Arrays Using Different Loop Types_.txt', type: 'file' },
                { name: 'What Are For-In and For-Of Loops, and How Do They Work_.txt', path: 'Loops/Working_with_Loops/What Are For-In and For-Of Loops, and How Do They Work_.txt', type: 'file' },
                { name: 'What Is the Difference Between Break and Continue Statements_.txt', path: 'Loops/Working_with_Loops/What Is the Difference Between Break and Continue Statements_.txt', type: 'file' }
            ]},
            { name: 'JavaScript Loops Review.txt', path: 'Loops/JavaScript Loops Review.txt', type: 'file' }
        ]},
        { name: 'Maps and Sets', path: 'Maps_and_Sets', type: 'folder', children: [
            { name: 'Working with Maps and Sets', path: 'Maps_and_Sets/Working_with_Maps_and_Sets', type: 'folder', children: [
                { name: 'What Are Maps, and How Do They Differ from Objects_.txt', path: 'Maps_and_Sets/Working_with_Maps_and_Sets/What Are Maps, and How Do They Differ from Objects_.txt', type: 'file' },
                { name: 'What Are Sets, and How Do They Work_.txt', path: 'Maps_and_Sets/Working_with_Maps_and_Sets/What Are Sets, and How Do They Work_.txt', type: 'file' }
            ]},
            { name: 'JavaScript Maps and Sets Review.txt', path: 'Maps_and_Sets/JavaScript Maps and Sets Review.txt', type: 'file' }
        ]},
        { name: 'Dates', path: 'Dates', type: 'folder', children: [
            { name: 'Working with Dates', path: 'Dates/Working_with_Dates', type: 'folder', children: [
                { name: 'How Do You Create and Manipulate Date Objects in JavaScript_.txt', path: 'Dates/Working_with_Dates/How Do You Create and Manipulate Date Objects in JavaScript_.txt', type: 'file' },
                { name: 'What Are Some Common Methods for Formatting and Parsing Dates_.txt', path: 'Dates/Working_with_Dates/What Are Some Common Methods for Formatting and Parsing Dates_.txt', type: 'file' }
            ]},
            { name: 'JavaScript Dates Review.txt', path: 'Dates/JavaScript Dates Review.txt', type: 'file' }
        ]},
        { name: 'Basic Regex', path: 'Basic_Regex', type: 'folder', children: [
            { name: 'Working with Regular Expressions', path: 'Basic_Regex/Working_with_Regular_Expressions', type: 'folder', children: [
                { name: 'How Can You Match and Replace All Occurrences in a String_.txt', path: 'Basic_Regex/Working_with_Regular_Expressions/How Can You Match and Replace All Occurrences in a String_.txt', type: 'file' },
                { name: 'What Are Capturing Groups and Backreferences, and How Do They Work_.txt', path: 'Basic_Regex/Working_with_Regular_Expressions/What Are Capturing Groups and Backreferences, and How Do They Work_.txt', type: 'file' },
                { name: 'What Are Character Classes, and What Are Some Common Examples_.txt', path: 'Basic_Regex/Working_with_Regular_Expressions/What Are Character Classes, and What Are Some Common Examples_.txt', type: 'file' },
                { name: 'What Are Lookahead and Lookbehind Assertions, and How Do They Work_.txt', path: 'Basic_Regex/Working_with_Regular_Expressions/What Are Lookahead and Lookbehind Assertions, and How Do They Work_.txt', type: 'file' },
                { name: 'What Are Regex Quantifiers, and How Do They Work_.txt', path: 'Basic_Regex/Working_with_Regular_Expressions/What Are Regex Quantifiers, and How Do They Work_.txt', type: 'file' },
                { name: 'What Are Regular Expressions, and What Are Some Common Methods_.txt', path: 'Basic_Regex/Working_with_Regular_Expressions/What Are Regular Expressions, and What Are Some Common Methods_.txt', type: 'file' },
                { name: 'What Are Some Common Regular Expression Modifiers Used for Searching_.txt', path: 'Basic_Regex/Working_with_Regular_Expressions/What Are Some Common Regular Expression Modifiers Used for Searching_.txt', type: 'file' }
            ]},
            { name: 'JavaScript Regular Expressions Review.txt', path: 'Basic_Regex/JavaScript Regular Expressions Review.txt', type: 'file' }
        ]},
        { name: 'DOM Manipulation and Events', path: 'DOM_Manipulation_and_Events', type: 'folder', children: [
            { name: 'Understanding the Event Object and Event Delegation', path: 'DOM_Manipulation_and_Events/Understanding_the_Event_Object_and_Event_Delegation', type: 'folder', children: [
                { name: 'How Do Event Bubbling, and Event Delegation Work_.txt', path: 'DOM_Manipulation_and_Events/Understanding_the_Event_Object_and_Event_Delegation/How Do Event Bubbling, and Event Delegation Work_.txt', type: 'file' },
                { name: 'What Is the Change Event, and How Does It Work_.txt', path: 'DOM_Manipulation_and_Events/Understanding_the_Event_Object_and_Event_Delegation/What Is the Change Event, and How Does It Work_.txt', type: 'file' }
            ]},
            { name: 'Working with the DOM Click Events and Web APIs', path: 'DOM_Manipulation_and_Events/Working_with_the_DOM_Click_Events_and_Web_APIs', type: 'folder', children: [
                { name: 'How Can You Use the addEventListener() Method to Listen for Click Events_.txt', path: 'DOM_Manipulation_and_Events/Working_with_the_DOM_Click_Events_and_Web_APIs/How Can You Use the addEventListener() Method to Listen for Click Events_.txt', type: 'file' },
                { name: 'What Is the DOM, and How Does It Work_.txt', path: 'DOM_Manipulation_and_Events/Working_with_the_DOM_Click_Events_and_Web_APIs/What Is the DOM, and How Does It Work_.txt', type: 'file' }
            ]},
            { name: 'DOM Manipulation and Click Events with JavaScript Review.txt', path: 'DOM_Manipulation_and_Events/DOM Manipulation and Click Events with JavaScript Review.txt', type: 'file' }
        ]},
        { name: 'Asynchronous JavaScript', path: 'Asynchronous_JavaScript', type: 'folder', children: [
            { name: 'Understanding Asynchronous Programming', path: 'Asynchronous_JavaScript/Understanding_Asynchronous_Programming', type: 'folder', children: [
                { name: 'How Does the Async Attribute Work Inside Script Elements, and How Does It Differ from the Defer Attribute_.txt', path: 'Asynchronous_JavaScript/Understanding_Asynchronous_Programming/How Does the Async Attribute Work Inside Script Elements, and How Does It Differ from the Defer Attribute_.txt', type: 'file' },
                { name: 'How Does the Fetch API Work with Common HTTP Methods and res.json()_.txt', path: 'Asynchronous_JavaScript/Understanding_Asynchronous_Programming/How Does the Fetch API Work with Common HTTP Methods and res.json()_.txt', type: 'file' },
                { name: 'What Are Promises, and How Does Promise Chaining Work_.txt', path: 'Asynchronous_JavaScript/Understanding_Asynchronous_Programming/What Are Promises, and How Does Promise Chaining Work_.txt', type: 'file' },
                { name: 'What Is Async or Await, and How Does It Work_.txt', path: 'Asynchronous_JavaScript/Understanding_Asynchronous_Programming/What Is Async or Await, and How Does It Work_.txt', type: 'file' },
                { name: 'What Is Async or How Does the JavaScript Engine Work, and What Is a JavaScript Runtime_.txt', path: 'Asynchronous_JavaScript/Understanding_Asynchronous_Programming/What Is Async or How Does the JavaScript Engine Work, and What Is a JavaScript Runtime_.txt', type: 'file' },
                { name: 'What Is Asynchronous JavaScript, and How Does It Differ from Synchronous JavaScript_.txt', path: 'Asynchronous_JavaScript/Understanding_Asynchronous_Programming/What Is Asynchronous JavaScript, and How Does It Differ from Synchronous JavaScript_.txt', type: 'file' },
                { name: 'What Is the Fetch API, and What Are Common Types of Resources That Are Fetched from the Network_.txt', path: 'Asynchronous_JavaScript/Understanding_Asynchronous_Programming/What Is the Fetch API, and What Are Common Types of Resources That Are Fetched from the Network_.txt', type: 'file' }
            ]},
            { name: 'Asynchronous JavaScript Review.txt', path: 'Asynchronous_JavaScript/Asynchronous JavaScript Review.txt', type: 'file' }
        ]},
        { name: 'Audio and Video Events', path: 'Audio_and_Video_Events', type: 'folder', children: [
            { name: 'Working with Audio and Video', path: 'Audio_and_Video_Events/Working_with_Audio_and_Video', type: 'folder', children: [
                { name: 'How Can You Work with the Media Streams to Capture Video and Audio from a Local Device_.txt', path: 'Audio_and_Video_Events/Working_with_Audio_and_Video/How Can You Work with the Media Streams to Capture Video and Audio from a Local Device_.txt', type: 'file' },
                { name: 'How Does the Audio Constructor Work, and What Are Some Common Methods_.txt', path: 'Audio_and_Video_Events/Working_with_Audio_and_Video/How Does the Audio Constructor Work, and What Are Some Common Methods_.txt', type: 'file' },
                { name: 'What Are Codecs and How Do They Work_.txt', path: 'Audio_and_Video_Events/Working_with_Audio_and_Video/What Are Codecs and How Do They Work_.txt', type: 'file' },
                { name: 'What Are Some Other Examples of Video and Audio APIs_.txt', path: 'Audio_and_Video_Events/Working_with_Audio_and_Video/What Are Some Other Examples of Video and Audio APIs_.txt', type: 'file' },
                { name: 'What Are the Different Types of Video and Audio Formats_.txt', path: 'Audio_and_Video_Events/Working_with_Audio_and_Video/What Are the Different Types of Video and Audio Formats_.txt', type: 'file' },
                { name: 'What Is the HTMLMediaElement API and How Does It Work_.txt', path: 'Audio_and_Video_Events/Working_with_Audio_and_Video/What Is the HTMLMediaElement API and How Does It Work_.txt', type: 'file' }
            ]},
            { name: 'JavaScript Audio and Video Review.txt', path: 'Audio_and_Video_Events/JavaScript Audio and Video Review.txt', type: 'file' }
        ]},
        { name: 'Form Validation', path: 'Form_Validation', type: 'folder', children: [
            { name: 'Understanding Form Validation', path: 'Form_Validation/Understanding_Form_Validation', type: 'folder', children: [
                { name: 'How Can You Validate Form Input Using JavaScript_.txt', path: 'Form_Validation/Understanding_Form_Validation/How Can You Validate Form Input Using JavaScript_.txt', type: 'file' },
                { name: 'How Do You Prevent Form Submission Based on Validation Results_.txt', path: 'Form_Validation/Understanding_Form_Validation/How Do You Prevent Form Submission Based on Validation Results_.txt', type: 'file' },
                { name: 'What Are Some Common Patterns for Client-Side Form Validation_.txt', path: 'Form_Validation/Understanding_Form_Validation/What Are Some Common Patterns for Client-Side Form Validation_.txt', type: 'file' }
            ]},
            { name: 'Form Validation with JavaScript Review.txt', path: 'Form_Validation/Form Validation with JavaScript Review.txt', type: 'file' }
        ]},
        { name: 'Functional Programming', path: 'Functional_Programming', type: 'folder', children: [
            { name: 'Understanding Functional Programming', path: 'Functional_Programming/Understanding_Functional_Programming', type: 'folder', children: [
                { name: 'What Are Higher-Order Functions, and How Do They Work_.txt', path: 'Functional_Programming/Understanding_Functional_Programming/What Are Higher-Order Functions, and How Do They Work_.txt', type: 'file' },
                { name: 'What Is Immutability, and Why Is It Important in Functional Programming_.txt', path: 'Functional_Programming/Understanding_Functional_Programming/What Is Immutability, and Why Is It Important in Functional Programming_.txt', type: 'file' }
            ]},
            { name: 'JavaScript Functional Programming Review.txt', path: 'Functional_Programming/JavaScript Functional Programming Review.txt', type: 'file' }
        ]},
        { name: 'Recursion', path: 'Recursion', type: 'folder', children: [
            { name: 'Understanding Recursion and the Call Stack', path: 'Recursion/Understanding_Recursion_and_the_Call_Stack', type: 'folder', children: [
                { name: 'What Is Recursion, and How Does It Work_.txt', path: 'Recursion/Understanding_Recursion_and_the_Call_Stack/What Is Recursion, and How Does It Work_.txt', type: 'file' }
            ]},
            { name: 'Recursion Review.txt', path: 'Recursion/Recursion Review.txt', type: 'file' }
        ]},
        { name: 'Debugging', path: 'Debugging', type: 'folder', children: [
            { name: 'Debugging Techniques', path: 'Debugging/Debugging_Techniques', type: 'folder', children: [
                { name: 'How Do You Use Console Methods for Debugging_.txt', path: 'Debugging/Debugging_Techniques/How Do You Use Console Methods for Debugging_.txt', type: 'file' },
                { name: 'How Do You Use Breakpoints in Browser Developer Tools_.txt', path: 'Debugging/Debugging_Techniques/How Do You Use Breakpoints in Browser Developer Tools_.txt', type: 'file' },
                { name: 'What Are Common Error Types in JavaScript_.txt', path: 'Debugging/Debugging_Techniques/What Are Common Error Types in JavaScript_.txt', type: 'file' },
                { name: 'What Are Some Best Practices for Debugging JavaScript Code_.txt', path: 'Debugging/Debugging_Techniques/What Are Some Best Practices for Debugging JavaScript Code_.txt', type: 'file' },
                { name: 'What Is the Process for Identifying and Fixing Bugs in JavaScript Code_.txt', path: 'Debugging/Debugging_Techniques/What Is the Process for Identifying and Fixing Bugs in JavaScript Code_.txt', type: 'file' }
            ]},
            { name: 'Debugging JavaScript Review.txt', path: 'Debugging/Debugging JavaScript Review.txt', type: 'file' }
        ]},
        { name: 'JavaScript Fundamentals Review', path: 'JavaScript_Fundamentals_Review', type: 'folder', children: [
            { name: 'Higher Order Functions and Callbacks', path: 'JavaScript_Fundamentals_Review/Higher_Order_Functions_and_Callbacks', type: 'folder', children: [
                { name: 'What Are Callback Functions, and How Do They Work_.txt', path: 'JavaScript_Fundamentals_Review/Higher_Order_Functions_and_Callbacks/What Are Callback Functions, and How Do They Work_.txt', type: 'file' }
            ]},
            { name: 'The var Keyword and Hoisting', path: 'JavaScript_Fundamentals_Review/The_var_Keyword_and_Hoisting', type: 'folder', children: [
                { name: 'What Is Hoisting in JavaScript_.txt', path: 'JavaScript_Fundamentals_Review/The_var_Keyword_and_Hoisting/What Is Hoisting in JavaScript_.txt', type: 'file' },
                { name: 'What Is the Difference Between var, let, and const_.txt', path: 'JavaScript_Fundamentals_Review/The_var_Keyword_and_Hoisting/What Is the Difference Between var, let, and const_.txt', type: 'file' }
            ]},
            { name: 'Understanding Modules, Imports and Exports', path: 'JavaScript_Fundamentals_Review/Understanding_Modules,_Imports_and_Exports', type: 'folder', children: [
                { name: 'What Are JavaScript Modules, and How Do Import and Export Work_.txt', path: 'JavaScript_Fundamentals_Review/Understanding_Modules,_Imports_and_Exports/What Are JavaScript Modules, and How Do Import and Export Work_.txt', type: 'file' }
            ]},
            { name: 'Working With the Arguments Object and Rest Parameters', path: 'JavaScript_Fundamentals_Review/Working_With_the_Arguments_Object_and_Rest_Parameters', type: 'folder', children: [
                { name: 'What Is the Arguments Object, and How Does It Work_.txt', path: 'JavaScript_Fundamentals_Review/Working_With_the_Arguments_Object_and_Rest_Parameters/What Is the Arguments Object, and How Does It Work_.txt', type: 'file' },
                { name: 'What Are Rest Parameters, and How Do They Work_.txt', path: 'JavaScript_Fundamentals_Review/Working_With_the_Arguments_Object_and_Rest_Parameters/What Are Rest Parameters, and How Do They Work_.txt', type: 'file' }
            ]},
            { name: 'Working with Arrays Variables and Naming Practices', path: 'JavaScript_Fundamentals_Review/Working_with_Arrays_Variables_and_Naming_Practices', type: 'folder', children: [
                { name: 'What Are JavaScript Naming Conventions and Best Practices_.txt', path: 'JavaScript_Fundamentals_Review/Working_with_Arrays_Variables_and_Naming_Practices/What Are JavaScript Naming Conventions and Best Practices_.txt', type: 'file' }
            ]},
            { name: 'Working with Code Quality and Execution Concepts', path: 'JavaScript_Fundamentals_Review/Working_with_Code_Quality_and_Execution_Concepts', type: 'folder', children: [
                { name: 'What Are Best Practices for Writing Clean JavaScript Code_.txt', path: 'JavaScript_Fundamentals_Review/Working_with_Code_Quality_and_Execution_Concepts/What Are Best Practices for Writing Clean JavaScript Code_.txt', type: 'file' },
                { name: 'What Is the Execution Context and Scope Chain in JavaScript_.txt', path: 'JavaScript_Fundamentals_Review/Working_with_Code_Quality_and_Execution_Concepts/What Is the Execution Context and Scope Chain in JavaScript_.txt', type: 'file' },
                { name: 'What Is Strict Mode in JavaScript_.txt', path: 'JavaScript_Fundamentals_Review/Working_with_Code_Quality_and_Execution_Concepts/What Is Strict Mode in JavaScript_.txt', type: 'file' }
            ]},
            { name: 'Working with Types and Objects', path: 'JavaScript_Fundamentals_Review/Working_with_Types_and_Objects', type: 'folder', children: [
                { name: 'What Are Primitive and Reference Data Types in JavaScript_.txt', path: 'JavaScript_Fundamentals_Review/Working_with_Types_and_Objects/What Are Primitive and Reference Data Types in JavaScript_.txt', type: 'file' },
                { name: 'What Is Type Coercion, and How Does It Work_.txt', path: 'JavaScript_Fundamentals_Review/Working_with_Types_and_Objects/What Is Type Coercion, and How Does It Work_.txt', type: 'file' },
                { name: 'What Is the Difference Between null and undefined_.txt', path: 'JavaScript_Fundamentals_Review/Working_with_Types_and_Objects/What Is the Difference Between null and undefined_.txt', type: 'file' }
            ]},
            { name: 'JavaScript Fundamentals Review.txt', path: 'JavaScript_Fundamentals_Review/JavaScript Fundamentals Review.txt', type: 'file' }
        ]},
        { name: 'JavaScript and Accessibility', path: 'JavaScript_and_Accessibility', type: 'folder', children: [
            { name: 'Understanding aria expanded aria live and Common ARIA States', path: 'JavaScript_and_Accessibility/Understanding_aria_expanded_aria_live_and_Common_ARIA_States', type: 'folder', children: [
                { name: 'How Can You Improve Accessibility with ARIA Attributes_.txt', path: 'JavaScript_and_Accessibility/Understanding_aria_expanded_aria_live_and_Common_ARIA_States/How Can You Improve Accessibility with ARIA Attributes_.txt', type: 'file' },
                { name: 'How Do You Work with aria-expanded and aria-live Attributes_.txt', path: 'JavaScript_and_Accessibility/Understanding_aria_expanded_aria_live_and_Common_ARIA_States/How Do You Work with aria-expanded and aria-live Attributes_.txt', type: 'file' },
                { name: 'What Are Common ARIA States and Roles_.txt', path: 'JavaScript_and_Accessibility/Understanding_aria_expanded_aria_live_and_Common_ARIA_States/What Are Common ARIA States and Roles_.txt', type: 'file' },
                { name: 'What Is the Role of Semantic HTML in Accessibility_.txt', path: 'JavaScript_and_Accessibility/Understanding_aria_expanded_aria_live_and_Common_ARIA_States/What Is the Role of Semantic HTML in Accessibility_.txt', type: 'file' },
                { name: 'What Is the Relationship Between JavaScript and Accessibility_.txt', path: 'JavaScript_and_Accessibility/Understanding_aria_expanded_aria_live_and_Common_ARIA_States/What Is the Relationship Between JavaScript and Accessibility_.txt', type: 'file' }
            ]},
            { name: 'JavaScript and Accessibility Review.txt', path: 'JavaScript_and_Accessibility/JavaScript and Accessibility Review.txt', type: 'file' }
        ]},
        { name: 'localStorage and CRUD Operations', path: 'localStorage_and_CRUD_Operations', type: 'folder', children: [
            { name: 'Working with Client-Side Storage and CRUD Operations', path: 'localStorage_and_CRUD_Operations/Working_with_Client-Side_Storage_and_CRUD_Operations', type: 'folder', children: [
                { name: 'How Do You Use the localStorage API_.txt', path: 'localStorage_and_CRUD_Operations/Working_with_Client-Side_Storage_and_CRUD_Operations/How Do You Use the localStorage API_.txt', type: 'file' },
                { name: 'How Do You Perform CRUD Operations with localStorage_.txt', path: 'localStorage_and_CRUD_Operations/Working_with_Client-Side_Storage_and_CRUD_Operations/How Do You Perform CRUD Operations with localStorage_.txt', type: 'file' },
                { name: 'What Are Common Patterns for Client-Side Data Storage_.txt', path: 'localStorage_and_CRUD_Operations/Working_with_Client-Side_Storage_and_CRUD_Operations/What Are Common Patterns for Client-Side Data Storage_.txt', type: 'file' }
            ]},
            { name: 'Local Storage and CRUD Review.txt', path: 'localStorage_and_CRUD_Operations/Local Storage and CRUD Review.txt', type: 'file' }
        ]},
        { name: 'JavaScript Review.txt', path: 'JavaScript Review.txt', type: 'file' }
    ];
    
    // Recursive function to build navigation items
    function buildNavItem(item, level = 0) {
        const li = document.createElement('li');
        
        if (item.type === 'folder') {
            const folderDiv = document.createElement('div');
            folderDiv.className = `nav-item folder level-${level}`;
            folderDiv.innerHTML = `<i class="fas fa-folder"></i> ${item.name} <i class="fas fa-chevron-down chevron"></i>`;
            
            const childUl = document.createElement('ul');
            childUl.style.display = 'none';
            
            if (item.children) {
                item.children.forEach(child => {
                    childUl.appendChild(buildNavItem(child, level + 1));
                });
            }
            
            folderDiv.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleFolder(folderDiv, childUl);
            });
            
            li.appendChild(folderDiv);
            li.appendChild(childUl);
        } else {
            const fileLink = document.createElement('a');
            fileLink.href = '#';
            fileLink.className = 'nav-item file';
            fileLink.dataset.path = item.path;
            fileLink.innerHTML = `<i class="fas fa-file"></i> ${item.name}`;
            
            fileLink.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all links
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Add active class to clicked link
                this.classList.add('active');
                
                // Update breadcrumb
                updateBreadcrumb(item.path);
                
                // Load content
                loadFileContent(item.path);
            });
            
            li.appendChild(fileLink);
        }
        
        return li;
    }
    
    navItems.forEach(item => {
        navList.appendChild(buildNavItem(item));
    });
}

function toggleFolder(folderElement, contentElement) {
    if (contentElement.style.display === 'none') {
        contentElement.style.display = 'block';
        folderElement.querySelector('.chevron').classList.add('rotated');
    } else {
        contentElement.style.display = 'none';
        folderElement.querySelector('.chevron').classList.remove('rotated');
    }
}

function toggleAllNavItems(expand) {
    const allFolders = document.querySelectorAll('.nav-item.folder');
    const allUls = document.querySelectorAll('.navigation ul');
    
    allUls.forEach(ul => {
        ul.style.display = expand ? 'block' : 'none';
    });
    
    const chevrons = document.querySelectorAll('.chevron');
    chevrons.forEach(chevron => {
        if (expand) {
            chevron.classList.add('rotated');
        } else {
            chevron.classList.remove('rotated');
        }
    });
}

function updateBreadcrumb(path) {
    const breadcrumbEl = document.getElementById('breadcrumb');
    const parts = path.split('/');
    let breadcrumbHTML = '<span>Home</span>';
    
    parts.forEach((part, index) => {
        breadcrumbHTML += ` <span>&gt;</span> <span>${part}</span>`;
    });
    
    breadcrumbEl.innerHTML = breadcrumbHTML;
}

async function loadFileContent(filePath) {
    try {
        // Sanitize the file path
        const sanitizedPath = sanitizeFilePath(filePath);
        
        // Attempt to fetch the file
        const response = await fetch(sanitizedPath);
        
        if (!response.ok) {
            throw new Error(`File not found: ${sanitizedPath}`);
        }
        
        const content = await response.text();
        displayContent(content, filePath);
    } catch (error) {
        console.error('Error loading file:', error);
        
        // Show error message in content area
        const contentArea = document.getElementById('contentArea');
        contentArea.innerHTML = `
            <div class="error-message">
                <h3>Error Loading Content</h3>
                <p>Could not load content for: ${filePath}</p>
                <p>Attempted path: ${sanitizeFilePath(filePath)}</p>
                <p>Error: ${error.message}</p>
            </div>
        `;
    }
}

// Display content with metadata
function displayContent(content, filePath) {
    // Calculate metadata
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    const readingTime = Math.ceil(wordCount / 200); // Average reading speed
    
    // Convert content to HTML with basic formatting
    let formattedContent = content
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^- (.*$)/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
    
    // Replace newlines with paragraphs where appropriate
    formattedContent = formattedContent
        .split('\n\n')
        .map(paragraph => paragraph.trim() !== '' && !paragraph.startsWith('<') && !paragraph.endsWith('>') 
            ? `<p>${paragraph.replace(/\n/g, '<br>')}</p>` 
            : paragraph)
        .join('');
    
    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = `
        <div class="note-content">
            <div class="metadata">
                <div><i class="fas fa-file-word"></i> Words: ${wordCount}</div>
                <div><i class="fas fa-clock"></i> Reading Time: ~${readingTime} min</div>
                <div><i class="fas fa-database"></i> Size: ${(content.length / 1024).toFixed(2)} KB</div>
            </div>
            <div class="file-content">${formattedContent}</div>
        </div>
    `;
}

function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const navItems = document.querySelectorAll('.nav-item');
    
    if (!searchTerm) {
        // Reset all items to visible
        navItems.forEach(item => {
            item.style.display = 'flex';
            item.parentElement.style.display = 'block';
        });
        return;
    }
    
    // Hide all items initially
    navItems.forEach(item => {
        item.style.display = 'none';
    });
    
    // Show items that match the search term
    navItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            item.style.display = 'flex';
            
            // Show parent containers
            let parent = item.parentElement;
            while (parent && parent !== document.querySelector('.navigation')) {
                if (parent.tagName === 'UL') {
                    parent.style.display = 'block';
                    
                    // Rotate chevron if present
                    const chevronParent = parent.previousElementSibling;
                    if (chevronParent && chevronParent.querySelector('.chevron')) {
                        chevronParent.querySelector('.chevron').classList.add('rotated');
                    }
                }
                parent = parent.parentElement;
            }
        }
    });
}

function showWelcomeMessage() {
    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = `
        <div id="welcome-message">
            <h1>Welcome to JavaScript Programming Notes</h1>
            <p>Select a topic from the sidebar to begin studying.</p>
            <p>Choose from comprehensive notes covering everything from JavaScript basics to advanced algorithms.</p>
        </div>
    `;
}