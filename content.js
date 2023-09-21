//Schema.org structured data approach, 
//if the site follows schema.org conventions then this will extract the recipe data and display it in a new window

//detect and extract JSON-LD scripts
const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');

let parsedJson = JSON.parse(jsonLdScripts[0].textContent);




recipeData = null;

//extract the recipe from the script
try {
    let parsedJson = JSON.parse(jsonLdScripts[0].textContent)[0];
    if (parsedJson['@type'].includes('Recipe')) {
        recipeData = parsedJson;
        //console.log(recipeData);
    }
        
    }
catch (error) {
    console.error("Failed to parse JSON-LD script", error);

}


console.log(recipeData.name);
console.log(recipeData.recipeIngredient);
console.log(recipeData.recipeInstructions);


// extract information relevant to recipe
let title, ingredients, instructions;
if (recipeData) {
    title = recipeData.name;
    ingredients = recipeData.recipeIngredient;
    instructions = recipeData.recipeInstructions;
}


//display the extracted data in a new window
let recipeWindow = window.open('', 'Recipe Simplifier', 'width=600,height=800,scrollbars=1,resizable=1');

let content = '<html><head><title>Recipe Simplified</title></head><body>';

if (recipeData) {
    content += `<h2>${title}</h2>`;
    content += `<h3>Ingredients:</h3>`;
    content += `<ul>`;
    ingredients.forEach(ingredient => {
        content += `<li>${ingredient}</li>`;
    });
    content += `</ul>`;
    content += `<h3>Instructions:</h3>`;
    content += `<ol>`;
    instructions.forEach(instruction => {
        content += `<li>${instruction.text || instruction}</li>`; // instruction could be an object or a string
    });
    content += `</ol>`;
}

content += '</body></html>';

recipeWindow.document.write(content);
recipeWindow.document.close();
