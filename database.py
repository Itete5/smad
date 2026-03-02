import os
from sqlalchemy import create_engine, Column, Integer, String, Float, Text
from sqlalchemy.orm import declarative_base, sessionmaker

Base = declarative_base()

class Material(Base):
    __tablename__ = "materials"
    id = Column(Integer, primary_key=True)
    mp_id = Column(String, unique=True)
    formula = Column(String)
    space_group = Column(String)
    band_gap = Column(Float)
    energy_per_atom = Column(Float)
    structure_file = Column(Text)

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///smad.db")
engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(bind=engine)

def init_db():
    Base.metadata.create_all(engine)

if __name__ == "__main__":
    init_db()
    print("Database created successfully!")
