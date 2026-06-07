async function initApp() {
    const hairdressers = await getHairdressers();
    renderHairdressers(hairdressers);
}

initApp();