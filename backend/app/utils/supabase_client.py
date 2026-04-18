from supabase import create_client, Client
from app.config import settings
from typing import Optional, List, Dict, Any

class SupabaseClient:
    _instance: Optional[Client] = None
    
    @classmethod
    def get_client(cls) -> Client:
        """Get or create Supabase client singleton"""
        if cls._instance is None:
            cls._instance = create_client(
                settings.SUPABASE_URL,
                settings.SUPABASE_KEY
            )
        return cls._instance
    
    @classmethod
    def init_database(cls):
        """Initialize database schema on application startup"""
        client = cls.get_client()
        try:
            # Tables are created via migration or manual SQL
            # This is just for verification
            print("✓ Supabase client initialized")
        except Exception as e:
            print(f"✗ Error initializing Supabase: {e}")

# Singleton instance
supabase_client = SupabaseClient.get_client()
