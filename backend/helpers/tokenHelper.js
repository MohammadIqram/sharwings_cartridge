
export const validateCloudflareCaptcha = async(token) => {
    const result = {
        valid: false,
        error: 'invalid session',
    };
    if (!token) {
        return result;
    }

    try {
        const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                secret: process.env.TURNSTILE_SECRET_KEY,
                response: token,
            }),
        })
        const data = await response.json();
        if (!data.success) {
            result.error = `Bot detected / ${data["error-codes"]}`;
        }
        return result;
    } catch (error) {
        console.log('this is a error', error);
        result.error = error.message;
        return result;
    }
}