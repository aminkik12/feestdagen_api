console.log("Script loaded");

const holidayName = document.querySelector("#holidayName");
const holidayDate = document.querySelector("#holidayDate");
const upcomingHolidays = document.querySelector("#upcomingHolidays");

holidayName.innerHTML = "⏳ Laden...";
holidayDate.innerHTML = "";
upcomingHolidays.innerHTML = "<p>Feestdagen laden...</p>";

function formatDate(dateString)
{
    const date = new Date(dateString);
    return date.toLocaleDateString("nl-NL");
}

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

Promise.all([
    fetch("https://date.nager.at/api/v3/PublicHolidays/2026/NL").then(response => response.json()),
    fetch("https://date.nager.at/api/v3/PublicHolidays/2027/NL").then(response => response.json())
])
.then(function(results)
{
    const data = [...results[0], ...results[1]];

    const today = new Date();

    const futureHolidays = data.filter(function(holiday)
    {
        return new Date(holiday.date) >= today;
    });

    holidayName.innerHTML =
        `${getEmoji(futureHolidays[0].localName)} ${futureHolidays[0].localName}`;

    holidayDate.innerHTML =
        formatDate(futureHolidays[0].date);

    upcomingHolidays.innerHTML = "";

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
.catch(function(error)
{
    console.error("API Error:", error);

    holidayName.innerHTML = "❌ Kan feestdagen niet laden";
    holidayDate.innerHTML = "";

    upcomingHolidays.innerHTML = `
        <p>Probeer het later opnieuw.</p>
    `;
});