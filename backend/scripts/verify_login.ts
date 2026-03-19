
async function main() {
    const baseURL = 'http://localhost:3002/api';
    const credentials = {
        username: "Yoel",
        password: "123456"
    };

    console.log("1. Attempting Login...");
    try {
        const loginRes = await fetch(`${baseURL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        if (loginRes.status === 401 || loginRes.status === 404 || loginRes.status === 400) {
            console.log(`Login failed with status ${loginRes.status}. Attempting Registration...`);
            const regRes = await fetch(`${baseURL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });

            if (!regRes.ok) {
                console.error("Registration failed:", await regRes.text());

            } else {
                console.log("Registration successful.");
            }


            console.log("Retrying Login...");
            const loginRetry = await fetch(`${baseURL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });

            if (!loginRetry.ok) {
                console.error("Login retry failed:", await loginRetry.text());
                return;
            }
            processResponse(loginRetry);
        } else if (!loginRes.ok) {
            console.error("Login failed unexpectedly:", await loginRes.text());
            return;
        } else {
            console.log("Login successful.");
            await processResponse(loginRes);
        }

    } catch (error) {
        console.error("Network error or server down:", error);
    }
}

async function processResponse(res: Response) {
    const data = await res.json();
    const token = data.token;
    console.log("Token obtained:", token ? "YES" : "NO");

    if (!token) {
        console.error("No token in response:", data);
        return;
    }

    console.log("2. Fetching Vacations...");
    const vacRes = await fetch('http://localhost:3002/api/vacations', {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!vacRes.ok) {
        console.error("Failed to fetch vacations:", vacRes.status, await vacRes.text());
    } else {
        const vacations = await vacRes.json();
        console.log(`Success! Fetched ${vacations.length} vacations.`);

    }
}

main();
