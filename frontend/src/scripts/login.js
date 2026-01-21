function showError(message) {
        const errorDiv = document.getElementById('errorMessage');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }

    function showSuccess(message) {
        const successDiv = document.getElementById('successMessage');
        successDiv.textContent = message;
        successDiv.style.display = 'block';
    }

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const loginBtn = document.getElementById('loginBtn');

        if (!username || !password) {
            showError('Please enter both username and password');
            return;
        }

        loginBtn.disabled = true;
        loginBtn.classList.add('loading');
        loginBtn.textContent = 'Logging in...';

        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (res.ok && data.requiresOTP) {
                sessionStorage.setItem('pendingUserId', data.userId);
                sessionStorage.setItem('pendingUserEmail', data.email);
                
                showSuccess('OTP sent to your email. Redirecting...');
                setTimeout(() => {
                    window.location.href = `otp-verify.html?userId=${data.userId}`;
                }, 1500);
            } else if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.role);
                showSuccess(`Welcome ${data.role}!`);
                setTimeout(() => {
                    window.location.href = 'public/index.html';
                }, 1500);
            } else {
                showError(data.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            showError('Error connecting to server. Please check your connection.');
            console.error('Login error:', error);
        } finally {
            loginBtn.disabled = false;
            loginBtn.classList.remove('loading');
            loginBtn.textContent = 'LOGIN';
        }
    });

    // Clear messages when user starts typing
    document.getElementById('username').addEventListener('focus', () => {
        document.getElementById('errorMessage').style.display = 'none';
    });

    document.getElementById('password').addEventListener('focus', () => {
        document.getElementById('errorMessage').style.display = 'none';
    });