const API_BASE_URL = "http://salonsapi.prooktatas.hu/api";

async function getHairdressers() {
    try {
        const response = await fetch(`${API_BASE_URL}/hairdressers`);

        if (!response.ok) {
            throw new Error("Nem sikerült lekérni a fodrászokat.");
        }

        const hairdressers = await response.json();
        return hairdressers;
    } catch (error) {
        console.error("API hiba:", error);
        return [];
    }
}