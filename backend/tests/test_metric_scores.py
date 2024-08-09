import unittest
import metrics
import models.company_models as company_models
class TestMetricCalculations(unittest.TestCase):
    def test_100(self):
        year_indicators = {
            "WOMENMANAGERS": company_models.CompanyData(
                company_name="Company A",
                perm_id="12345",
                disclosure=None,
                indicator_name="WOMENMANAGERS",
                indicator_value=100.0,
                indicator_year=None,
                nb_points_of_observations=100,
                indicator_period="Annual",
                provider_name="Provider A",
                reported_date=None,
                indicator_year_int=2023
            ),
            "WOMENEMPLOYEES": company_models.CompanyData(
                company_name="Company A",
                perm_id="12345",
                disclosure=None,
                indicator_name="WOMENEMPLOYEES",
                indicator_value=100.0,
                indicator_year=None,
                nb_points_of_observations=100,
                indicator_period="Annual",
                provider_name="Provider A",
                reported_date=None,
                indicator_year_int=2023
            )
        }
        weights = {
            "WOMENMANAGERS": 0.4,
            "WOMENEMPLOYEES": 0.6
        }
        score = metrics.calculate_metric(year_indicators, weights)
        self.assertEqual(score, 100)
    def test_0(self):
        year_indicators = {
            "WOMENMANAGERS": company_models.CompanyData(
                company_name="Company A",
                perm_id="12345",
                disclosure=None,
                indicator_name="WOMENMANAGERS",
                indicator_value=0,
                indicator_year=None,
                nb_points_of_observations=100,
                indicator_period="Annual",
                provider_name="Provider A",
                reported_date=None,
                indicator_year_int=2023
            ),
            "WOMENEMPLOYEES": company_models.CompanyData(
                company_name="Company A",
                perm_id="12345",
                disclosure=None,
                indicator_name="WOMENEMPLOYEES",
                indicator_value=0,
                indicator_year=None,
                nb_points_of_observations=100,
                indicator_period="Annual",
                provider_name="Provider A",
                reported_date=None,
                indicator_year_int=2023
            )
        }
        weights = {
            "WOMENMANAGERS": 0.4,
            "WOMENEMPLOYEES": 0.6
        }
        score = metrics.calculate_metric(year_indicators, weights)
        self.assertEqual(score, 12)
    def test_negatives(self):
        year_indicators = {
            "AIRPOLLUTANTS_DIRECT": company_models.CompanyData(
                company_name="Company A",
                perm_id="12345",
                disclosure=None,
                indicator_name="AIRPOLLUTANTS_DIRECT",
                indicator_value=10000000000000,
                indicator_year=None,
                nb_points_of_observations=100,
                indicator_period="Annual",
                provider_name="Provider A",
                reported_date=None,
                indicator_year_int=2023
            ),
            "ENERGYPURCHASEDDIRECT": company_models.CompanyData(
                company_name="Company A",
                perm_id="12345",
                disclosure=None,
                indicator_name="ENERGYPURCHASEDDIRECT",
                indicator_value=10000000000000,
                indicator_year=None,
                nb_points_of_observations=100,
                indicator_period="Annual",
                provider_name="Provider A",
                reported_date=None,
                indicator_year_int=2023
            )
        }
        weights = {
            "AIRPOLLUTANTS_DIRECT": 0.4,
            "ENERGYPURCHASEDDIRECT": 0.6
        }
        score = metrics.calculate_metric(year_indicators, weights)
        self.assertEqual(score, 0)
    
    def test_1_zscore(self):
        year_indicators = {
            "WOMENMANAGERS": company_models.CompanyData(
                company_name="Company A",
                perm_id="12345",
                disclosure=None,
                indicator_name="WOMENMANAGERS",
                indicator_value=43.85,
                indicator_year=None,
                nb_points_of_observations=100,
                indicator_period="Annual",
                provider_name="Provider A",
                reported_date=None,
                indicator_year_int=2023
            ),
            "WOMENEMPLOYEES": company_models.CompanyData(
                company_name="Company A",
                perm_id="12345",
                disclosure=None,
                indicator_name="WOMENEMPLOYEES",
                indicator_value=54.0,
                indicator_year=None,
                nb_points_of_observations=100,
                indicator_period="Annual",
                provider_name="Provider A",
                reported_date=None,
                indicator_year_int=2023
            )
        }
        weights = {
            "WOMENMANAGERS": 0.4,
            "WOMENEMPLOYEES": 0.6
        }
        score = metrics.calculate_metric(year_indicators, weights)
        self.assertEqual(score, 70)
    
        
if __name__ == '__main__':
    unittest.main()