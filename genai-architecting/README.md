## Functional Requirements

The company aims to own and operate their own AI infrastructure, prioritizing data privacy and long-term cost control over reliance on external managed GenAI services.

- **Data Privacy & Security:** User data must remain on-premises to address privacy concerns. All AI processing, including model inference and data storage, should be handled within the company’s infrastructure, minimizing exposure to external networks.
- **Cost Management:** The company anticipates that managed GenAI services will become increasingly expensive. By investing in their own hardware, they seek to avoid unpredictable operational costs and maintain control over their AI expenditure.
- **Hardware Investment:** The company plans to purchase a high-performance AI PC or workstation, with a budget of $10,000–$15,000. This system should be capable of running modern large language models (LLMs) and supporting GPU-accelerated workloads.
- **User Base:** The system must support approximately 300 active students, all located within the city of Nagasaki. The infrastructure should be sized to handle concurrent usage and provide low-latency responses.
- **System Architecture:** 
    - The solution will include a local database for storing user data and activity logs.
    - The AI PC will host the LLM and serve as the primary inference engine.
    - Input and output guardrails will be implemented to ensure safe and appropriate interactions with the AI model.
    - The system will be designed to operate primarily within a local network, with optional, controlled access to the internet for updates or external data retrieval.
- **User Interaction:** Students will interact with the system through a user interface that communicates with the local AI model. All requests and responses will be processed internally, with guardrails in place to filter inappropriate content and ensure compliance with privacy policies.
- **Scalability & Maintainability:** The infrastructure should be modular, allowing for future upgrades (e.g., additional GPUs, storage, or network enhancements) as the user base or AI workload grows.

These requirements are informed by the system architecture diagram, which highlights the flow of data between users, the local AI model, guardrails, and the database, ensuring a secure and efficient on-premises GenAI solution.
