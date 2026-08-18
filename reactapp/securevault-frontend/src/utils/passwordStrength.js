export function checkPasswordStrength(password) {

    let score = 0;

    if (password.length >= 8) score++;

    if (/[A-Z]/.test(password)) score++;

    if (/[a-z]/.test(password)) score++;

    if (/[0-9]/.test(password)) score++;

    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1)
        return { text: "Very Weak", color: "#ef4444", width: "20%" };

    if (score === 2)
        return { text: "Weak", color: "#f97316", width: "40%" };

    if (score === 3)
        return { text: "Medium", color: "#eab308", width: "60%" };

    if (score === 4)
        return { text: "Strong", color: "#22c55e", width: "80%" };

    return { text: "Very Strong", color: "#16a34a", width: "100%" };

}