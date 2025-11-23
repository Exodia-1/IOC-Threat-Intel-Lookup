from motor.motor_asyncio import AsyncIOMotorClient
from .settings import settings
import ssl

class Database:
    client: AsyncIOMotorClient = None
    
    @classmethod
    def get_client(cls) -> AsyncIOMotorClient:
        if cls.client is None:
            # Configure SSL/TLS for MongoDB Atlas
            try:
                cls.client = AsyncIOMotorClient(
                    settings.MONGO_URL,
                    tls=True,
                    tlsAllowInvalidCertificates=False,
                    serverSelectionTimeoutMS=5000,
                    connectTimeoutMS=10000,
                    retryWrites=True,
                    w='majority'
                )
            except Exception as e:
                print(f"Error connecting to MongoDB: {e}")
                raise
        return cls.client
    
    @classmethod
    def get_db(cls):
        return cls.get_client()[settings.DB_NAME]
    
    @classmethod
    async def close(cls):
        if cls.client:
            cls.client.close()

db = Database.get_db()
