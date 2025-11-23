from motor.motor_asyncio import AsyncIOMotorClient
from .settings import settings

class Database:
    client: AsyncIOMotorClient = None
    
    @classmethod
    def get_client(cls) -> AsyncIOMotorClient:
        if cls.client is None:
            cls.client = AsyncIOMotorClient(settings.MONGO_URL)
        return cls.client
    
    @classmethod
    def get_db(cls):
        return cls.get_client()[settings.DB_NAME]
    
    @classmethod
    async def close(cls):
        if cls.client:
            cls.client.close()

db = Database.get_db()
