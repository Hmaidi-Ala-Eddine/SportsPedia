"""
RDF CRUD Service - Real-time modification of RDF file
Handles Create, Read, Update, Delete operations on the RDF knowledge graph
"""

import xml.etree.ElementTree as ET
from typing import Dict, Optional
import logging
import subprocess
from pathlib import Path

logger = logging.getLogger(__name__)

class RDFCrudService:
    """Service for CRUD operations on RDF file."""
    
    def __init__(self):
        self.rdf_file_path = Path("/app/data/sportspedia_final.rdf")
        self.namespace = "http://example.org/sports-ontology#"
        self.rdf_ns = "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
        self.fuseki_url = "http://localhost:3030/sportspedia"
        
        # Register namespaces for XML
        ET.register_namespace('rdf', self.rdf_ns)
        ET.register_namespace('sport', self.namespace)
        ET.register_namespace('rdfs', 'http://www.w3.org/2000/01/rdf-schema#')
        ET.register_namespace('owl', 'http://www.w3.org/2002/07/owl#')
    
    def _load_rdf(self) -> ET.ElementTree:
        """Load RDF file."""
        try:
            tree = ET.parse(self.rdf_file_path)
            return tree
        except Exception as e:
            logger.error(f"Error loading RDF file: {e}")
            raise
    
    def _save_rdf(self, tree: ET.ElementTree):
        """Save RDF file and reload into Fuseki."""
        try:
            # Save the RDF file
            tree.write(self.rdf_file_path, encoding='utf-8', xml_declaration=True)
            logger.info(f"RDF file saved successfully")
            
            # Reload into Fuseki
            self._reload_fuseki()
            
        except Exception as e:
            logger.error(f"Error saving RDF file: {e}")
            raise
    
    def _reload_fuseki(self):
        """Reload RDF data into Fuseki."""
        try:
            logger.info("Reloading Fuseki with updated RDF data...")
            
            # Delete existing data
            delete_result = subprocess.run([
                'curl', '-X', 'DELETE',
                '-u', 'admin:admin123',
                'http://fuseki:3030/sportspedia/data?default'
            ], check=True, capture_output=True, text=True)
            logger.info(f"Deleted existing data: {delete_result.stdout}")
            
            # Upload new data
            upload_result = subprocess.run([
                'curl', '-X', 'POST',
                '-u', 'admin:admin123',
                '-H', 'Content-Type: application/rdf+xml',
                '--data-binary', f'@{self.rdf_file_path}',
                'http://fuseki:3030/sportspedia/data?default'
            ], check=True, capture_output=True, text=True)
            logger.info(f"Uploaded new data: {upload_result.stdout}")
            
            logger.info("Fuseki reloaded successfully!")
            
        except subprocess.CalledProcessError as e:
            logger.error(f"Error reloading Fuseki: {e.stderr}")
            raise
        except Exception as e:
            logger.error(f"Error reloading Fuseki: {e}")
            raise
    
    # ==================== ATHLETE CRUD ====================
    
    def create_athlete(self, data: Dict) -> str:
        """Create a new athlete in RDF."""
        try:
            tree = self._load_rdf()
            root = tree.getroot()
            
            # Create athlete element
            athlete_id = data.get('id', f"{data['firstName']}{data['lastName']}".replace(' ', ''))
            athlete = ET.SubElement(root, f'{{{self.namespace}}}Athlete')
            athlete.set(f'{{{self.rdf_ns}}}about', f'#{athlete_id}')
            
            # Add properties
            if 'firstName' in data:
                first_name = ET.SubElement(athlete, f'{{{self.namespace}}}firstName')
                first_name.text = data['firstName']
            
            if 'lastName' in data:
                last_name = ET.SubElement(athlete, f'{{{self.namespace}}}lastName')
                last_name.text = data['lastName']
            
            if 'birthDate' in data:
                birth_date = ET.SubElement(athlete, f'{{{self.namespace}}}birthDate')
                birth_date.set(f'{{{self.rdf_ns}}}datatype', 'http://www.w3.org/2001/XMLSchema#date')
                birth_date.text = data['birthDate']
            
            if 'nationality' in data:
                nationality = ET.SubElement(athlete, f'{{{self.namespace}}}nationality')
                nationality.text = data['nationality']
            
            if 'position' in data:
                position = ET.SubElement(athlete, f'{{{self.namespace}}}position')
                position.text = data['position']
            
            if 'jerseyNumber' in data:
                jersey = ET.SubElement(athlete, f'{{{self.namespace}}}jerseyNumber')
                jersey.set(f'{{{self.rdf_ns}}}datatype', 'http://www.w3.org/2001/XMLSchema#integer')
                jersey.text = str(data['jerseyNumber'])
            
            if 'goalsScored' in data:
                goals = ET.SubElement(athlete, f'{{{self.namespace}}}goalsScored')
                goals.set(f'{{{self.rdf_ns}}}datatype', 'http://www.w3.org/2001/XMLSchema#integer')
                goals.text = str(data['goalsScored'])
            
            if 'assists' in data:
                assists = ET.SubElement(athlete, f'{{{self.namespace}}}assists')
                assists.set(f'{{{self.rdf_ns}}}datatype', 'http://www.w3.org/2001/XMLSchema#integer')
                assists.text = str(data['assists'])
            
            if 'matchesPlayed' in data:
                matches = ET.SubElement(athlete, f'{{{self.namespace}}}matchesPlayed')
                matches.set(f'{{{self.rdf_ns}}}datatype', 'http://www.w3.org/2001/XMLSchema#integer')
                matches.text = str(data['matchesPlayed'])
            
            if 'isCaptain' in data and data['isCaptain']:
                captain = ET.SubElement(athlete, f'{{{self.namespace}}}isCaptain')
                captain.set(f'{{{self.rdf_ns}}}datatype', 'http://www.w3.org/2001/XMLSchema#boolean')
                captain.text = 'true'
            
            self._save_rdf(tree)
            return athlete_id
            
        except Exception as e:
            logger.error(f"Error creating athlete: {e}")
            raise
    
    def update_athlete(self, athlete_id: str, data: Dict):
        """Update an existing athlete in RDF."""
        try:
            logger.info(f"Updating athlete {athlete_id} with data: {data}")
            tree = self._load_rdf()
            root = tree.getroot()
            
            # Find athlete
            athlete = root.find(f".//{{{self.namespace}}}Athlete[@{{{self.rdf_ns}}}about='#{athlete_id}']")
            if athlete is None:
                logger.error(f"Athlete {athlete_id} not found in RDF")
                raise ValueError(f"Athlete {athlete_id} not found")
            
            logger.info(f"Found athlete {athlete_id}, updating {len(data)} fields")
            
            # Update properties
            for key, value in data.items():
                if key == 'id':
                    continue
                
                # Remove old element if exists
                old_elem = athlete.find(f'{{{self.namespace}}}{key}')
                if old_elem is not None:
                    athlete.remove(old_elem)
                
                # Add new element
                if value is not None and value != '':
                    new_elem = ET.SubElement(athlete, f'{{{self.namespace}}}{key}')
                    
                    if key in ['jerseyNumber', 'goalsScored', 'assists', 'matchesPlayed']:
                        new_elem.set(f'{{{self.rdf_ns}}}datatype', 'http://www.w3.org/2001/XMLSchema#integer')
                        new_elem.text = str(int(value))
                    elif key == 'birthDate':
                        new_elem.set(f'{{{self.rdf_ns}}}datatype', 'http://www.w3.org/2001/XMLSchema#date')
                        new_elem.text = str(value)
                    elif key == 'isCaptain':
                        new_elem.set(f'{{{self.rdf_ns}}}datatype', 'http://www.w3.org/2001/XMLSchema#boolean')
                        new_elem.text = 'true' if value else 'false'
                    else:
                        new_elem.text = str(value)
                    
                    logger.info(f"Updated field {key} = {value}")
            
            self._save_rdf(tree)
            logger.info(f"Successfully updated athlete {athlete_id}")
            
        except Exception as e:
            logger.error(f"Error updating athlete {athlete_id}: {str(e)}", exc_info=True)
            raise
    
    def delete_athlete(self, athlete_id: str):
        """Delete an athlete from RDF."""
        try:
            tree = self._load_rdf()
            root = tree.getroot()
            
            # Find and remove athlete
            athlete = root.find(f".//{{{self.namespace}}}Athlete[@{{{self.rdf_ns}}}about='#{athlete_id}']")
            if athlete is None:
                raise ValueError(f"Athlete {athlete_id} not found")
            
            root.remove(athlete)
            self._save_rdf(tree)
            
        except Exception as e:
            logger.error(f"Error deleting athlete: {e}")
            raise
    
    # ==================== COACH CRUD ====================
    
    def create_coach(self, data: Dict) -> str:
        """Create a new coach in RDF."""
        try:
            tree = self._load_rdf()
            root = tree.getroot()
            
            coach_id = data.get('id', f"{data['firstName']}{data['lastName']}".replace(' ', ''))
            coach = ET.SubElement(root, f'{{{self.namespace}}}Coach')
            coach.set(f'{{{self.rdf_ns}}}about', f'#{coach_id}')
            
            if 'firstName' in data:
                first_name = ET.SubElement(coach, f'{{{self.namespace}}}firstName')
                first_name.text = data['firstName']
            
            if 'lastName' in data:
                last_name = ET.SubElement(coach, f'{{{self.namespace}}}lastName')
                last_name.text = data['lastName']
            
            if 'birthDate' in data:
                birth_date = ET.SubElement(coach, f'{{{self.namespace}}}birthDate')
                birth_date.set(f'{{{self.rdf_ns}}}datatype', 'http://www.w3.org/2001/XMLSchema#date')
                birth_date.text = data['birthDate']
            
            if 'nationality' in data:
                nationality = ET.SubElement(coach, f'{{{self.namespace}}}nationality')
                nationality.text = data['nationality']
            
            if 'experienceYears' in data:
                exp = ET.SubElement(coach, f'{{{self.namespace}}}experienceYears')
                exp.set(f'{{{self.rdf_ns}}}datatype', 'http://www.w3.org/2001/XMLSchema#integer')
                exp.text = str(data['experienceYears'])
            
            if 'titlesWon' in data:
                titles = ET.SubElement(coach, f'{{{self.namespace}}}titlesWon')
                titles.set(f'{{{self.rdf_ns}}}datatype', 'http://www.w3.org/2001/XMLSchema#integer')
                titles.text = str(data['titlesWon'])
            
            if 'coachingStyle' in data:
                style = ET.SubElement(coach, f'{{{self.namespace}}}coachingStyle')
                style.text = data['coachingStyle']
            
            self._save_rdf(tree)
            return coach_id
            
        except Exception as e:
            logger.error(f"Error creating coach: {e}")
            raise
    
    def update_coach(self, coach_id: str, data: Dict):
        """Update an existing coach in RDF."""
        try:
            tree = self._load_rdf()
            root = tree.getroot()
            
            coach = root.find(f".//{{{self.namespace}}}Coach[@{{{self.rdf_ns}}}about='#{coach_id}']")
            if coach is None:
                raise ValueError(f"Coach {coach_id} not found")
            
            for key, value in data.items():
                if key == 'id':
                    continue
                
                old_elem = coach.find(f'{{{self.namespace}}}{key}')
                if old_elem is not None:
                    coach.remove(old_elem)
                
                if value is not None and value != '':
                    new_elem = ET.SubElement(coach, f'{{{self.namespace}}}{key}')
                    
                    if key in ['experienceYears', 'titlesWon']:
                        new_elem.set(f'{{{self.rdf_ns}}}datatype', 'http://www.w3.org/2001/XMLSchema#integer')
                        new_elem.text = str(value)
                    elif key == 'birthDate':
                        new_elem.set(f'{{{self.rdf_ns}}}datatype', 'http://www.w3.org/2001/XMLSchema#date')
                        new_elem.text = value
                    else:
                        new_elem.text = str(value)
            
            self._save_rdf(tree)
            
        except Exception as e:
            logger.error(f"Error updating coach: {e}")
            raise
    
    def delete_coach(self, coach_id: str):
        """Delete a coach from RDF."""
        try:
            tree = self._load_rdf()
            root = tree.getroot()
            
            coach = root.find(f".//{{{self.namespace}}}Coach[@{{{self.rdf_ns}}}about='#{coach_id}']")
            if coach is None:
                raise ValueError(f"Coach {coach_id} not found")
            
            root.remove(coach)
            self._save_rdf(tree)
            
        except Exception as e:
            logger.error(f"Error deleting coach: {e}")
            raise
    
    # ==================== ACHIEVEMENT CRUD ====================
    
    def create_achievement(self, data: Dict) -> str:
        """Create a new achievement in RDF."""
        try:
            tree = self._load_rdf()
            root = tree.getroot()
            
            achievement_id = data.get('id', f"Achievement{data.get('achievementType', 'New').replace(' ', '')}")
            achievement = ET.SubElement(root, f'{{{self.namespace}}}Achievement')
            achievement.set(f'{{{self.rdf_ns}}}about', f'#{achievement_id}')
            
            if 'achievementType' in data:
                ach_type = ET.SubElement(achievement, f'{{{self.namespace}}}achievementType')
                ach_type.text = data['achievementType']
            
            if 'year' in data:
                year = ET.SubElement(achievement, f'{{{self.namespace}}}year')
                year.set(f'{{{self.rdf_ns}}}datatype', 'http://www.w3.org/2001/XMLSchema#int')
                year.text = str(data['year'])
            
            if 'performanceValue' in data:
                perf = ET.SubElement(achievement, f'{{{self.namespace}}}performanceValue')
                perf.text = data['performanceValue']
            
            if 'unit' in data:
                unit = ET.SubElement(achievement, f'{{{self.namespace}}}unit')
                unit.text = data['unit']
            
            if 'achievedBy' in data:
                achieved_by = ET.SubElement(achievement, f'{{{self.namespace}}}achievedBy')
                achieved_by.set(f'{{{self.rdf_ns}}}resource', f'#{data["achievedBy"]}')
            
            self._save_rdf(tree)
            return achievement_id
            
        except Exception as e:
            logger.error(f"Error creating achievement: {e}")
            raise
    
    def update_achievement(self, achievement_id: str, data: Dict):
        """Update an existing achievement in RDF."""
        try:
            logger.info(f"Updating achievement {achievement_id} with data: {data}")
            tree = self._load_rdf()
            root = tree.getroot()
            
            achievement = root.find(f".//{{{self.namespace}}}Achievement[@{{{self.rdf_ns}}}about='#{achievement_id}']")
            if achievement is None:
                logger.error(f"Achievement {achievement_id} not found in RDF")
                raise ValueError(f"Achievement {achievement_id} not found")
            
            logger.info(f"Found achievement {achievement_id}, updating {len(data)} fields")
            
            for key, value in data.items():
                if key == 'id':
                    continue
                
                old_elem = achievement.find(f'{{{self.namespace}}}{key}')
                if old_elem is not None:
                    achievement.remove(old_elem)
                
                if value is not None and value != '':
                    new_elem = ET.SubElement(achievement, f'{{{self.namespace}}}{key}')
                    
                    if key == 'year':
                        new_elem.set(f'{{{self.rdf_ns}}}datatype', 'http://www.w3.org/2001/XMLSchema#int')
                        new_elem.text = str(int(value))
                    elif key in ['achievedBy', 'setBy']:
                        new_elem.set(f'{{{self.rdf_ns}}}resource', f'#{value}')
                    else:
                        new_elem.text = str(value)
                    
                    logger.info(f"Updated field {key} = {value}")
            
            self._save_rdf(tree)
            logger.info(f"Successfully updated achievement {achievement_id}")
            
        except Exception as e:
            logger.error(f"Error updating achievement {achievement_id}: {str(e)}", exc_info=True)
            raise
    
    def delete_achievement(self, achievement_id: str):
        """Delete an achievement from RDF."""
        try:
            tree = self._load_rdf()
            root = tree.getroot()
            
            achievement = root.find(f".//{{{self.namespace}}}Achievement[@{{{self.rdf_ns}}}about='#{achievement_id}']")
            if achievement is None:
                raise ValueError(f"Achievement {achievement_id} not found")
            
            root.remove(achievement)
            self._save_rdf(tree)
            
        except Exception as e:
            logger.error(f"Error deleting achievement: {e}")
            raise
    
    # ==================== RECORD CRUD ====================
    
    def create_record(self, data: Dict) -> str:
        """Create a new record in RDF."""
        try:
            tree = self._load_rdf()
            root = tree.getroot()
            
            record_id = data.get('id', f"Record{data.get('recordType', 'New').replace(' ', '')}")
            record = ET.SubElement(root, f'{{{self.namespace}}}Record')
            record.set(f'{{{self.rdf_ns}}}about', f'#{record_id}')
            
            if 'recordType' in data:
                rec_type = ET.SubElement(record, f'{{{self.namespace}}}recordType')
                rec_type.text = data['recordType']
            
            if 'recordValue' in data:
                rec_val = ET.SubElement(record, f'{{{self.namespace}}}recordValue')
                rec_val.text = data['recordValue']
            
            if 'setOn' in data:
                set_on = ET.SubElement(record, f'{{{self.namespace}}}setOn')
                set_on.set(f'{{{self.rdf_ns}}}datatype', 'http://www.w3.org/2001/XMLSchema#date')
                set_on.text = data['setOn']
            
            if 'setBy' in data:
                set_by = ET.SubElement(record, f'{{{self.namespace}}}setBy')
                set_by.set(f'{{{self.rdf_ns}}}resource', f'#{data["setBy"]}')
            
            self._save_rdf(tree)
            return record_id
            
        except Exception as e:
            logger.error(f"Error creating record: {e}")
            raise
    
    def update_record(self, record_id: str, data: Dict):
        """Update an existing record in RDF."""
        try:
            logger.info(f"Updating record {record_id} with data: {data}")
            tree = self._load_rdf()
            root = tree.getroot()
            
            record = root.find(f".//{{{self.namespace}}}Record[@{{{self.rdf_ns}}}about='#{record_id}']")
            if record is None:
                logger.error(f"Record {record_id} not found in RDF")
                raise ValueError(f"Record {record_id} not found")
            
            logger.info(f"Found record {record_id}, updating {len(data)} fields")
            
            for key, value in data.items():
                if key == 'id':
                    continue
                
                old_elem = record.find(f'{{{self.namespace}}}{key}')
                if old_elem is not None:
                    record.remove(old_elem)
                
                if value is not None and value != '':
                    new_elem = ET.SubElement(record, f'{{{self.namespace}}}{key}')
                    
                    if key == 'setOn':
                        new_elem.set(f'{{{self.rdf_ns}}}datatype', 'http://www.w3.org/2001/XMLSchema#date')
                        new_elem.text = str(value)
                    elif key in ['achievedBy', 'setBy']:
                        new_elem.set(f'{{{self.rdf_ns}}}resource', f'#{value}')
                    else:
                        new_elem.text = str(value)
                    
                    logger.info(f"Updated field {key} = {value}")
            
            self._save_rdf(tree)
            logger.info(f"Successfully updated record {record_id}")
            
        except Exception as e:
            logger.error(f"Error updating record {record_id}: {str(e)}", exc_info=True)
            raise
    
    def delete_record(self, record_id: str):
        """Delete a record from RDF."""
        try:
            tree = self._load_rdf()
            root = tree.getroot()
            
            record = root.find(f".//{{{self.namespace}}}Record[@{{{self.rdf_ns}}}about='#{record_id}']")
            if record is None:
                raise ValueError(f"Record {record_id} not found")
            
            root.remove(record)
            self._save_rdf(tree)
            
        except Exception as e:
            logger.error(f"Error deleting record: {e}")
            raise
    
    # ==================== REFEREE CRUD ====================
    
    def create_referee(self, data: Dict) -> str:
        """Create a new referee in RDF."""
        try:
            tree = self._load_rdf()
            root = tree.getroot()
            
            # Generate referee ID
            referee_id = data.get('id', f"{data.get('firstName', '')}{data.get('lastName', '')}Ref")
            
            referee = ET.SubElement(root, f'{{{self.namespace}}}Referee')
            referee.set(f'{{{self.rdf_ns}}}about', f'#{referee_id}')
            
            # Add properties
            if 'firstName' in data:
                first_name = ET.SubElement(referee, f'{{{self.namespace}}}firstName')
                first_name.text = data['firstName']
            
            if 'lastName' in data:
                last_name = ET.SubElement(referee, f'{{{self.namespace}}}lastName')
                last_name.text = data['lastName']
            
            if 'birthDate' in data:
                birth_date = ET.SubElement(referee, f'{{{self.namespace}}}birthDate')
                birth_date.set(f'{{{self.rdf_ns}}}datatype', 'http://www.w3.org/2001/XMLSchema#date')
                birth_date.text = data['birthDate']
            
            if 'nationality' in data:
                nationality = ET.SubElement(referee, f'{{{self.namespace}}}nationality')
                nationality.text = data['nationality']
            
            if 'experienceYears' in data:
                exp = ET.SubElement(referee, f'{{{self.namespace}}}experienceYears')
                exp.set(f'{{{self.rdf_ns}}}datatype', 'http://www.w3.org/2001/XMLSchema#integer')
                exp.text = str(data['experienceYears'])
            
            if 'matchesOfficiated' in data:
                matches = ET.SubElement(referee, f'{{{self.namespace}}}matchesOfficiated')
                matches.set(f'{{{self.rdf_ns}}}datatype', 'http://www.w3.org/2001/XMLSchema#integer')
                matches.text = str(data['matchesOfficiated'])
            
            self._save_rdf(tree)
            return referee_id
            
        except Exception as e:
            logger.error(f"Error creating referee: {e}")
            raise
    
    def update_referee(self, referee_id: str, data: Dict):
        """Update an existing referee in RDF."""
        try:
            logger.info(f"Updating referee {referee_id} with data: {data}")
            tree = self._load_rdf()
            root = tree.getroot()
            
            referee = root.find(f".//{{{self.namespace}}}Referee[@{{{self.rdf_ns}}}about='#{referee_id}']")
            if referee is None:
                logger.error(f"Referee {referee_id} not found in RDF")
                raise ValueError(f"Referee {referee_id} not found")
            
            logger.info(f"Found referee {referee_id}, updating {len(data)} fields")
            
            for key, value in data.items():
                if key == 'id':
                    continue
                
                old_elem = referee.find(f'{{{self.namespace}}}{key}')
                if old_elem is not None:
                    referee.remove(old_elem)
                
                if value is not None and value != '':
                    new_elem = ET.SubElement(referee, f'{{{self.namespace}}}{key}')
                    
                    if key in ['experienceYears', 'matchesOfficiated']:
                        new_elem.set(f'{{{self.rdf_ns}}}datatype', 'http://www.w3.org/2001/XMLSchema#integer')
                        new_elem.text = str(int(value))
                    elif key == 'birthDate':
                        new_elem.set(f'{{{self.rdf_ns}}}datatype', 'http://www.w3.org/2001/XMLSchema#date')
                        new_elem.text = str(value)
                    else:
                        new_elem.text = str(value)
                    
                    logger.info(f"Updated field {key} = {value}")
            
            self._save_rdf(tree)
            logger.info(f"Successfully updated referee {referee_id}")
            
        except Exception as e:
            logger.error(f"Error updating referee {referee_id}: {str(e)}", exc_info=True)
            raise
    
    def delete_referee(self, referee_id: str):
        """Delete a referee from RDF."""
        try:
            tree = self._load_rdf()
            root = tree.getroot()
            
            referee = root.find(f".//{{{self.namespace}}}Referee[@{{{self.rdf_ns}}}about='#{referee_id}']")
            if referee is None:
                raise ValueError(f"Referee {referee_id} not found")
            
            root.remove(referee)
            self._save_rdf(tree)
            
        except Exception as e:
            logger.error(f"Error deleting referee: {e}")
            raise


# Global service instance
rdf_crud_service = RDFCrudService()
