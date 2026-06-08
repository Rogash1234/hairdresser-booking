const API_BASE_URL = "https://salonsapi.prooktatas.hu/api";

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

const API_KEY = "test123";

async function createAppointment(appointmentData) {
    console.log("Küldött adat:", appointmentData);

    try {
        const response = await fetch(
            `${API_BASE_URL}/appointments?api_key=${appointmentData.api_key}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(appointmentData)
            }
        );

        const responseText = await response.text();
        console.log("API státusz:", response.status);
        console.log("API válasz:", responseText);

        if (!response.ok) {
            throw new Error("Nem sikerült létrehozni a foglalást.");
        }

        return responseText ? JSON.parse(responseText) : {};
    } catch (error) {
        console.error("Foglalási hiba:", error);
        return null;
    }
}

async function getAppointments() {
    try {
        const response = await fetch(`${API_BASE_URL}/appointments?api_key=${API_KEY}`);

        if (!response.ok) {
            throw new Error("Nem sikerült lekérni a foglalásokat.");
        }

        return await response.json();
    } catch (error) {
        console.error("Foglalások lekérési hiba:", error);
        return [];
    }
}