# 🏗️ AI-Powered Construction Payments
A transformative Django REST Framework application designed to automate and enhance progress payment verification and management in the construction industry using Artificial Intelligence.

## 🌟 Features
- Automated Progress Verification (AI): Object detection models (e.g., YOLO) to automatically identify and quantify completed construction elements from site images/videos.

- Intelligent Payment Triggers: Link AI-verified progress to payment milestones for objective, data-driven payment processing.

- Secure User Authentication: Robust token-based authentication (Django REST Framework Token Authentication) for secure API access.

- Comprehensive Payment Management API: Endpoints for creating, listing, and retrieving payment requests and transactions.

- Detailed Transaction Tracking: APIs to record and manage all financial transactions associated with payments.

- Browsable API & Documentation: Integrated Django REST Framework browsable API and interactive OpenAPI (Swagger UI/Redoc) documentation for easy development and testing.

- Scalable Backend: Built with Django and designed for future integration with PostgreSQL and Stripe API for production-ready performance.

- Admin Interface: Django's powerful admin panel for easy management of users, payments, transactions, and uploaded construction images.

- Media Handling: Support for secure storage and retrieval of uploaded construction site images.

## 🚀 Quick Start
Follow these steps to get the project up and running on your local machine.

1. Clone the Repository:

```bash
git clone https://github.com/Seek-Techs/payment_platform.git
cd construction_payments
```
2. Set Up Python Environment:
Ensure you have Python 3.8+ installed. You can download it from [python.org](https://www.python.org/downloads/).

3. Set up the Python Virtual Environment:

```bash
"C:\Users\Admin\AppData\Local\Microsoft\WindowsApps\PythonSoftwareFoundation.Python.3.13_qbz5n2kfra8p0\python.exe" -m venv venv
.\venv\Scripts\activate
```
(This uses the explicit path to your Python executable. Adjust if your Python installation path differs.)

4. Install Dependencies:

```bash
pip install Django djangorestframework drf-yasg
```
(Alternatively, create a requirements.txt after installing them and then use pip install -r requirements.txt)

5. Database Migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```
6. Create Superuser (for admin access and API testing):

```bash
python manage.py createsuperuser
```
(Follow the prompts to create your admin account.)

7. Run the Development Server:

```bash
python manage.py runserver
```
## 💡 Usage (API Endpoints)
Once the server is running, you can access the following API endpoints:

- Admin Panel: http://127.0.0.1:8000/admin/

    - Manage users, payments, transactions, and uploaded images.

- API Root: http://127.0.0.1:8000/api/

    - Provides links to main API resources.

- API Documentation (Swagger UI): http://127.0.0.1:8000/swagger/

    - Interactive documentation to explore and test API endpoints.

- API Documentation (Redoc): http://127.0.0.1:8000/redoc/

    - Alternative documentation view.

- User Registration: POST to http://127.0.0.1:8000/api/register/

    - Required fields: username, password, password2, (optional: email).

- User Login (Obtain Token): POST to http://127.0.0.1:8000/api/login/

    - Required fields: username, password. Returns an authentication token.

- Payments List/Create: GET/POST to http://127.0.0.1:8000/api/payments/

    - GET requires authentication. POST requires authentication to create payments for the logged-in user.

- Payment Detail: GET to http://127.0.0.1:8000/api/payments/<id>/

Requires authentication.

    - Transactions List: GET to http://127.0.0.1:8000/api/transactions/

Requires authentication.

- Construction Image Upload/List: GET/POST to http://127.0.0.1:8000/api/progress/images/

    - POST to upload an image. AI analysis is simulated upon upload. GET requires authentication.

(For POST requests and authentication for GET requests, use the Swagger UI or tools like Postman/Insomnia.)

## 🔧 Configuration
Key configuration points are in construction_payments/settings.py:

- DEBUG: Set to False in production.

- ALLOWED_HOSTS: Configure your production domain(s) here.

- DATABASES: Default is SQLite for development. Switch to PostgreSQL for production.

- REST_FRAMEWORK: Adjust default permission and authentication classes as needed for granular control.

- MEDIA_ROOT / MEDIA_URL: Configured for storing user-uploaded images.

- Stripe API Keys (Future): Placeholder for future integration, will be configured as environment variables.

- AI Model Paths (Future): Paths to trained AI models for actual inference.

## 🤝 Contributing
We actively encourage and welcome contributions to this project! Your input can help us make this platform even more impactful.

1. Fork the repository: Create a copy of the project in your GitHub account.

2. Clone your fork: Get the code onto your local machine.

3. Create a new branch: For each feature or bug fix.

4. Make your changes: Code, documentation, tests.

5. Test your changes: Ensure functionality and no regressions.

6. Commit with clear messages: Describe your work.

7. Push to your branch.

8. Open a Pull Request: Explain your changes and their benefits.

Please refer to our dedicated CONTRIBUTING.md for detailed guidelines.

## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments
- Django: The powerful web framework underpinning our backend.

- Django REST Framework: For simplifying API development.

- DRF-YASG: For fantastic interactive API documentation.

- Python Software Foundation: For the incredible Python language.

- Future AI Models: (e.g., Ultralytics YOLO) for enabling automated progress verification.

- Our dedicated team for their collaborative spirit and expertise!