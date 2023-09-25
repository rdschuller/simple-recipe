//Schema.org structured data approach, 
//if the site follows schema.org conventions then this will extract the recipe data and display it in a new window

//detect and extract JSON-LD scripts
const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
// console.log(jsonLdScripts);
// console.log(jsonLdScripts.length);

recipeData = null;

// T0-DO --- check if the parsed scrip (original script because some are longer than 1) is an array of objects or the object itself, this is where we are running into issues
//remember to re add index of 0 for seriouseats success to the original parsedJson

//extract the recipe from the script
for(let script of jsonLdScripts) {  
    try {
        let parsedJson = JSON.parse(script.textContent);

        //check for common format of schema object, and parse it as necessary
        if (Object.keys(parsedJson).includes('0')) {
            parsedJson = parsedJson[0];
        }
        
        //check if the parsed script contains the type of 'Recipe'
        if (parsedJson.hasOwnProperty('@type')) {
            if (parsedJson['@type'].includes('Recipe')) {
                recipeData = parsedJson;
                break;
            }  
        }
        // check if object includes graph and if so if that graph includes the @type of 'Recipe'
        else if(Object.keys(parsedJson).includes('@graph')) {
            console.log('check passed');
            for(let graph of parsedJson['@graph']) {
                if (graph['@type'].includes('Recipe')) {
                    recipeData = graph;
                    break;
                }
            }
        }
            
        }
    catch (error) {
        console.error("Failed to parse JSON-LD script", error);
    
      }

}

console.log(recipeData.name);
console.log(recipeData.recipeIngredient);
console.log(recipeData.recipeInstructions);
console.log(recipeData);


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
