let allAppointments = [];
let allHairdressers = [];

async function initAdmin() {
    allAppointments = await getAppointments();

    allAppointments.sort((a, b) =>
        new Date(a.appointment_date) - new Date(b.appointment_date)
    );

    allHairdressers = await getHairdressers();

    renderHairdresserFilter(allHairdressers);
    renderAppointments(allAppointments, allHairdressers);
}



function renderHairdresserFilter(hairdressers) {
    const filter = document.getElementById("hairdresser-filter");

    hairdressers.forEach(hairdresser => {
        const option = document.createElement("option");
        option.value = hairdresser.id;
        option.textContent = hairdresser.name;
        filter.appendChild(option);
    });

    filter.addEventListener("change", function () {
        const selectedId = filter.value;

        if (selectedId === "") {
            renderAppointments(allAppointments, allHairdressers);
            return;
        }

        const filteredAppointments = allAppointments.filter(appointment => {
            return Number(appointment.hairdresser_id) === Number(selectedId);
        });

        renderAppointments(filteredAppointments, allHairdressers);
    });
}

function renderAppointments(appointments, hairdressers) {
    const appointmentsList = document.getElementById("appointments-list");

    appointmentsList.innerHTML = "";

    if (appointments.length === 0) {
        appointmentsList.innerHTML = "<p>Nincs megjeleníthető foglalás.</p>";
        return;
    }

    appointments.forEach(appointment => {
        const hairdresser = hairdressers.find(h => Number(h.id) === Number(appointment.hairdresser_id));

        const card = document.createElement("div");
        card.classList.add("hairdresser-card");

        card.innerHTML = `
            <h3>${appointment.customer_name}</h3>
            <p><strong>Telefonszám:</strong> ${appointment.customer_phone}</p>
            <p><strong>Fodrász:</strong> ${hairdresser ? hairdresser.name : "Ismeretlen fodrász"}</p>
            <p><strong>Időpont:</strong> ${appointment.appointment_date}</p>
            <p><strong>Szolgáltatás:</strong> ${appointment.service}</p>
        `;

        appointmentsList.appendChild(card);
    });
}

initAdmin();