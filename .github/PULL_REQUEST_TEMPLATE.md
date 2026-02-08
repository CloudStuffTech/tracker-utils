## 🛡️ Security Checklist
*Review and check all that apply before requesting a review.*

- [ ] **Secrets:** I have verified that no API keys, passwords, or certificates are hardcoded.
- [ ] **Dependencies:** I have checked for known vulnerabilities in any new libraries added.
- [ ] **Data Handling:** Sensitive data (PII) is encrypted or masked in logs.
- [ ] **Input Validation:** All user-provided input is sanitized to prevent SQLi or XSS.
- [ ] **Permissions:** New endpoints or features follow the Principle of Least Privilege.

## ⚙️ Backend & Performance
- [ ] **Database:** I have checked for N+1 query issues and verified index usage.
- [ ] **Migrations:** Database migrations are reversible (where applicable) and tested.
- [ ] **Error Handling:** Errors are caught and returned with appropriate HTTP status codes.
- [ ] **Scalability:** Large datasets are handled via pagination, not loaded entirely into memory.
- [ ] **Async:** Long-running tasks are moved to background workers (if applicable).

## 🧪 Testing & Quality
- [ ] **Unit Tests:** Added/updated tests for the core logic.
- [ ] **Integration:** Verified that API contracts haven't broken for downstream services.
- [ ] **Observability:** Added logs or metrics to track the success/failure of this feature.
- [ ] **Documentation:** Updated Swagger/OpenAPI specs or internal READMEs.

## ✍️ Sign-off
- [ ] I confirm that I have performed a self-review of this code from a security perspective.

**Reviewer Sign-off:** *(To be completed by the reviewer)*
- [ ] Security standards verified.