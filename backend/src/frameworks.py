from typing import Literal
from models import framework_models
from sqlalchemy.orm import Session

Category = Literal["E", "S", "G"]

def get_framework_metrics_by_category(framework_id: int, category: Category, session: Session):
    metrics = session.query(framework_models.CustomMetrics).filter_by(framework_id=framework_id,
                                                                      category=category).all() 

    # if no metrics found, no custom metric weights have been set for official framework 
    if len(metrics) == 0:
        metrics = session.query(framework_models.OfficialFrameworkMetrics).filter_by(framework_id=framework_id,
                                                                                      category=category).all()

    return metrics