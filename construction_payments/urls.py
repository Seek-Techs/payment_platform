"""
URL configuration for construction_payments project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path # Import re_path for drf-yasg
from django.views.generic.base import RedirectView

# Imports for drf-yasg
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# NEW: Import views for user registration and token obtain
from payments import views as payments_views # Import custom views from payments app
from rest_framework.authtoken.views import obtain_auth_token # DRF's built-in view for getting tokens


# Schema view for API documentation
schema_view = get_schema_view(
    openapi.Info(
        title="Construction Payments API",
        default_version='v1',
        description="API for managing construction progress payments.",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@yourproject.local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,), # Allow anyone to view docs
)


urlpatterns = [
    # Redirect root URL to /api/
    path('', RedirectView.as_view(url='api/', permanent=False), name='api-root-redirect'),

    # Admin site URLs
    path('admin/', admin.site.urls),

    # API Endpoints:
    path('api/', include('payments.urls')),

    # Django REST Framework's browsable API login/logout URLs.
    path('api-auth/', include('rest_framework.urls')),

    # NEW: User Authentication API Endpoints
    path('api/register/', payments_views.UserRegistrationAPIView.as_view(), name='register'), # <--- Our custom registration view
    path('api/login/', obtain_auth_token, name='login'), # <--- DRF's built-in token obtain view
    
    # DRF-YASG (Swagger/OpenAPI) Documentation URLs
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]




