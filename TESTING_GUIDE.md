# Testing Guide: Performance & Security

This guide provides a set of strategies and tools to test the performance and security of your Hospital Doctor Appointment System.

---

## 1. Performance Testing

Performance testing helps ensure your application is fast, responsive, and can handle a given workload.

### a. Frontend Performance Analysis

This focuses on the user's browser experience, including load times and interactivity.

**Tool: Lighthouse (in Chrome DevTools)**

Lighthouse is an open-source, automated tool for improving the quality of web pages. It's the easiest way to get a comprehensive performance audit.

**Steps:**

1.  Run your `frontend` application locally (`npm run dev`).
2.  Open the application in a Google Chrome incognito window (to avoid interference from browser extensions).
3.  Open Chrome DevTools (`F12` or `Ctrl+Shift+I`).
4.  Navigate to the **Lighthouse** tab.
5.  Select the **Performance** category (and any others you're interested in).
6.  Click **"Analyze page load"**.

**What to Look For:**

-   **First Contentful Paint (FCP):** Measures how long it takes the browser to render the first piece of DOM content.
-   **Largest Contentful Paint (LCP):** Measures when the largest content element in the viewport becomes visible. Aim for under 2.5 seconds.
-   **Time to Interactive (TTI):** Measures how long it takes for the page to become fully interactive.
-   **Opportunities Section:** Lighthouse will provide specific recommendations, such as "Reduce initial server response time," "Eliminate render-blocking resources," or "Properly size images."

### b. Backend Load Testing

This tests how well your backend server performs under heavy traffic.

**Tool: `k6` by Grafana**

`k6` is a modern, open-source load testing tool that uses JavaScript to write tests. It's developer-friendly and powerful.

**Steps:**

1.  **Install k6:** Follow the official installation guide for your operating system from [k6.io](https://k6.io/docs/getting-started/installation/).

2.  **Create a Test Script:** Create a file named `load-test.js` in your `backend` folder with the following content:

    ```javascript
    import http from 'k6/http';
    import { check, sleep } from 'k6';

    export const options = {
      // Simulate 10 virtual users for 30 seconds.
      vus: 10,
      duration: '30s',
    };

    // The function that each virtual user will run.
    export default function () {
      // Test the public endpoint to get all doctors.
      const res = http.get('http://localhost:4000/api/doctor/list');

      // Check if the request was successful (HTTP 200).
      check(res, { 'status was 200': (r) => r.status == 200 });

      // Wait for 1 second before the next request.
      sleep(1);
    }
    ```

3.  **Run the Test:**
    -   Make sure your backend server is running (`npm run server`).
    -   Open a new terminal in the `backend` folder and run the following command:
        ```bash
        k6 run load-test.js
        ```

**What to Look For in the `k6` Output:**

-   `http_req_duration`: The average, p95, and p99 response times. A high p95 value means that 5% of your users are experiencing significant delays.
-   `http_req_failed`: The percentage of requests that failed. This should be 0%.
-   `http_reqs`: The total number of requests per second your server handled.

---

## 2. Security Testing

Security testing helps identify and fix vulnerabilities that could be exploited by attackers.

### a. Dependency Vulnerability Scanning

This checks your project's `npm` packages for known security vulnerabilities.

**Tool: `npm audit`**

This is a built-in `npm` command that scans your project for vulnerabilities.

**Steps:**

1.  Navigate to your `frontend`, `admin`, and `backend` directories.
2.  In each directory, run the following command:
    ```bash
    npm audit
    ```
3.  If vulnerabilities are found, `npm` will provide a report. To fix them automatically, run:
    ```bash
    npm audit fix
    ```
    *Note: Some vulnerabilities may require a manual update or have no available fix.*

### b. Static Application Security Testing (SAST)

SAST tools analyze your source code for potential security flaws without running the application.

**Tool: ESLint with Security Plugins**

You can enhance your existing ESLint configuration to catch security issues.

**Steps:**

1.  Install the ESLint security plugin in your `frontend` and `admin` projects:
    ```bash
    npm install eslint-plugin-security --save-dev
    ```
2.  Update your `eslint.config.js` file to include the plugin:
    ```javascript
    import security from 'eslint-plugin-security';

    export default [
      // ... your existing configuration
      {
        plugins: { security },
        rules: {
          ...security.configs.recommended.rules,
        },
      }
    ];
    ```
3.  Run your linter. It will now flag potential security risks, such as the use of `eval()` or insecure regular expressions.

### c. Dynamic Application Security Testing (DAST)

DAST tools test your *running* application for vulnerabilities by simulating real-world attacks.

**Tool: OWASP ZAP (Zed Attack Proxy)**

OWASP ZAP is a free, open-source security tool that is excellent for finding common web app vulnerabilities.

**Key Vulnerabilities to Test Manually:**

1.  **Broken Access Control (Most Critical for This App):**
    -   **Goal:** Ensure a regular user cannot access admin or doctor functionality.
    -   **Test:**
        1.  Log in as a regular **user** on the frontend and get the JWT from your browser's local storage.
        2.  Use a tool like Postman or `curl` to make a request to an admin-only endpoint, like `GET /api/admin/dashboard`.
        3.  Include the **user's** JWT in the `Authorization` header.
        4.  **Expected Result:** The API should return a `403 Forbidden` error. If it returns a `200 OK` with data, you have a critical access control vulnerability.
        5.  Repeat the process by logging in as a doctor and trying to access an admin endpoint.

2.  **Injection:**
    -   **Goal:** Ensure user input is not insecurely processed by the database.
    -   **Test:** In your registration or login forms, try entering NoSQL injection payloads in the email and password fields. For example:
        -   Email: `{$ne: "user@example.com"}`
    -   **Expected Result:** The server should either reject the input as invalid or treat it as a literal string. It should **not** crash or return unexpected data. Your use of Mongoose provides a good layer of protection against this.

3.  **Cross-Site Scripting (XSS):**
    -   **Goal:** Ensure user-supplied data is properly sanitized before being displayed.
    -   **Test:**
        1.  Update a user's profile (or a doctor's profile) and set the name to a script, like `<script>alert('XSS')</script>`.
        2.  View the profile page where the name is displayed.
    -   **Expected Result:** The page should display the literal text `<script>alert('XSS')</script>`. If a browser alert box pops up, your application is vulnerable to XSS. React automatically escapes JSX content, which provides strong protection, but it's always good to verify.
