// Shows a message in the console.
    // Is used to check if the JavaScript file is loaded correctly.

console.log("Script loaded");

// Variables that store the HTML elements.
  // We use querySelector so JavaScript can change the webpage.
const holidayName = document.querySelector("#holidayName");
const holidayDate = document.querySelector("#holidayDate");
const upcomingHolidays = document.querySelector("#upcomingHolidays");

//  This shows a loading message while waiting for the API.
  // This improves the user experience because the page isn't empty

holidayName.innerHTML = "⏳ Laden...";
holidayDate.innerHTML = "";
upcomingHolidays.innerHTML = "<p>Feestdagen laden...</p>";

// Function that formats the API date.
  // We use a function because we need the same code multiple times.

function formatDate(dateString)
{
    const date = new Date(dateString);
    return date.toLocaleDateString("nl-NL");
}

// Function that returns an emoji for each holiday.
  // Makes the website more visual without repeating code.

function getEmoji(name)
{
    name = name.toLowerCase();

    if (name.includes("kerst")) return "🎄";
    if (name.includes("nieuw")) return "🎆";
    if (name.includes("pasen")) return "🐣";
    if (name.includes("koning")) return "👑";
    if (name.includes("bevrijd")) return "🇳🇱";

    return "🎉";
}


// Promise.all waits until BOTH API requests are finished.
   // This is better than making two separate requests one after another.

Promise.all([
    fetch("https://date.nager.at/api/v3/PublicHolidays/2026/NL").then(response => response.json()),
    fetch("https://date.nager.at/api/v3/PublicHolidays/2027/NL").then(response => response.json())
])

// Runs after both API requests are successful.

.then(function(results)
{

 // Combines both arrays into one array.
    // Makes it easier to work with all holidays together.

    const data = [...results[0], ...results[1]];

// Stores today's date.
    // Used to check which holidays are still coming.

    const today = new Date();

// Filter keeps only holidays that are today or later.
    // Old holidays are removed.

    const futureHolidays = data.filter(function(holiday)
    {
        return new Date(holiday.date) >= today;
    });

 // Displays the next upcoming holiday.
    holidayName.innerHTML =
        `${getEmoji(futureHolidays[0].localName)} ${futureHolidays[0].localName}`;

    holidayDate.innerHTML =
        formatDate(futureHolidays[0].date);

   // Clears the loading text before adding holiday cards.     
    upcomingHolidays.innerHTML = "";

    // Loop that creates the next three holiday cards.
    // We use a loop so we don't have to write the same HTML three times.
    for (let i = 1; i <= 3; i++)
    {
        upcomingHolidays.innerHTML += `
            <div class="holidayCard">
                <h4>${getEmoji(futureHolidays[i].localName)} ${futureHolidays[i].localName}</h4>
                <p>${formatDate(futureHolidays[i].date)}</p>
            </div>
        `;
    }
})

// Runs only when something goes wrong with the API.
   // Prevents the page from breaking and shows a friendly message.
.catch(function(error)
{
    console.error("API Error:", error);

    holidayName.innerHTML = "❌ Kan feestdagen niet laden";
    holidayDate.innerHTML = "";

    upcomingHolidays.innerHTML = `
        <p>Probeer het later opnieuw.</p>
    `;
});