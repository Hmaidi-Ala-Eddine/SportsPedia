import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LayoutV1 from '@/components/layouts/LayoutV1';
import { toast } from 'react-toastify';
import authService from '@/services/authService';

// Dropdown options
const POSITIONS = ['Forward', 'Midfielder', 'Defender', 'Goalkeeper', 'Striker', 'Winger', 'Center', 'Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward'];
const COACHING_STYLES = ['Attacking', 'Defensive', 'Possession-based', 'Counter-attacking', 'High-pressing', 'Tactical', 'Motivational'];
const ACHIEVEMENT_TYPES = ['Ballon d\'Or', 'Champions League', 'World Cup', 'Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Golden Boot', 'MVP', 'NBA Championship', 'NBA Finals MVP'];
const RECORD_TYPES = ['Most Goals', 'Most Assists', 'Most Appearances', 'Most Titles', 'Fastest Goal', 'Longest Goal', 'Most Goals in Season', 'Most Points', 'Most Championships'];

const AdminPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('athletes');
    const [loading, setLoading] = useState(false);
    
    // Data states
    const [athletes, setAthletes] = useState([]);
    const [coaches, setCoaches] = useState([]);
    const [achievements, setAchievements] = useState([]);
    const [records, setRecords] = useState([]);
    const [referees, setReferees] = useState([]);
    const [teams, setTeams] = useState([]);
    const [competitions, setCompetitions] = useState([]);
    const [organizations, setOrganizations] = useState([]);
    const [venues, setVenues] = useState([]);
    const [media, setMedia] = useState([]);
    const [sports, setSports] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [sponsorships, setSponsorships] = useState([]);
    
    // Form states
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({});
    
    // AI Search states
    const [aiSearchQuery, setAiSearchQuery] = useState('');
    const [aiSearchActive, setAiSearchActive] = useState(false);
    const [sparqlQuery, setSparqlQuery] = useState('');
    const [showSparql, setShowSparql] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    
    // Local search state for filtering current tab data
    const [localSearchQuery, setLocalSearchQuery] = useState('');

    useEffect(() => {
        checkAdminAccess();
        if (!aiSearchActive) {
            fetchData();
        }
        // Clear local search when switching tabs
        setLocalSearchQuery('');
    }, [activeTab, aiSearchActive]);

    const checkAdminAccess = async () => {
        try {
            const profile = await authService.getProfile();
            if (!profile.is_admin) {
                toast.error('Admin access required');
                navigate('/');
            }
        } catch (error) {
            navigate('/login');
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'athletes') {
                const res = await fetch('http://localhost:8000/api/persons/athletes?limit=100');
                const data = await res.json();
                setAthletes(data.athletes || []);
            } else if (activeTab === 'coaches') {
                const res = await fetch('http://localhost:8000/api/persons/coaches?limit=100');
                const data = await res.json();
                setCoaches(data.coaches || []);
            } else if (activeTab === 'achievements') {
                const res = await fetch('http://localhost:8000/api/performances/achievements?limit=100');
                const data = await res.json();
                setAchievements(data.achievements || []);
            } else if (activeTab === 'records') {
                const res = await fetch('http://localhost:8000/api/performances/records?limit=100');
                const data = await res.json();
                setRecords(data.records || []);
            } else if (activeTab === 'referees') {
                const res = await fetch('http://localhost:8000/api/persons/referees?limit=100');
                const data = await res.json();
                setReferees(data.referees || []);
            } else if (activeTab === 'teams') {
                const res = await fetch('http://localhost:8000/api/teams?limit=100');
                const data = await res.json();
                setTeams(data.teams || []);
            } else if (activeTab === 'competitions') {
                const res = await fetch('http://localhost:8000/api/competitions?limit=100');
                const data = await res.json();
                setCompetitions(data.competitions || []);
            } else if (activeTab === 'organizations') {
                const res = await fetch('http://localhost:8000/api/organizations?limit=100');
                const data = await res.json();
                setOrganizations(data.organizations || []);
            } else if (activeTab === 'venues') {
                const res = await fetch('http://localhost:8000/api/venues?limit=100');
                const data = await res.json();
                setVenues(data.venues || []);
            } else if (activeTab === 'media') {
                const res = await fetch('http://localhost:8000/api/media?limit=100');
                const data = await res.json();
                setMedia(data.media || []);
            } else if (activeTab === 'sports') {
                const res = await fetch('http://localhost:8000/api/sports?limit=100');
                const data = await res.json();
                setSports(data.sports || []);
            } else if (activeTab === 'equipment') {
                const res = await fetch('http://localhost:8000/api/equipment?limit=100');
                const data = await res.json();
                setEquipment(data.equipment || []);
            } else if (activeTab === 'sponsorships') {
                const res = await fetch('http://localhost:8000/api/sponsorships?limit=100');
                const data = await res.json();
                setSponsorships(data.sponsorships || []);
            }
        } catch (error) {
            toast.error('Error fetching data');
        }
        setLoading(false);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            
            // Determine correct endpoint
            const useAdminRoute = ['athletes', 'coaches', 'referees', 'achievements', 'records'].includes(activeTab);
            const endpoint = useAdminRoute 
                ? `http://localhost:8000/api/admin/${activeTab}`
                : `http://localhost:8000/api/${activeTab}`;
            
            // Auto-generate ID for new classes if not provided
            let dataWithId = {...formData};
            if (['venues', 'media', 'sports', 'equipment', 'sponsorships'].includes(activeTab) && !dataWithId.id) {
                // Generate ID from name field
                const nameField = activeTab === 'venues' ? 'venueName' :
                                 activeTab === 'media' ? 'mediaName' :
                                 activeTab === 'sports' ? 'sportName' :
                                 activeTab === 'equipment' ? 'equipmentName' :
                                 activeTab === 'sponsorships' ? 'sponsorName' : '';
                
                if (dataWithId[nameField]) {
                    dataWithId.id = dataWithId[nameField].replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
                }
            }
            
            // Clean and prepare data
            const cleanData = {};
            Object.keys(dataWithId).forEach(key => {
                const value = dataWithId[key];
                if (value !== null && value !== undefined && value !== '') {
                    // Convert number fields to integers
                    if (['jerseyNumber', 'goalsScored', 'assists', 'matchesPlayed', 'experienceYears', 'titlesWon', 'year', 'matchesOfficiated', 'capacity', 'openedYear', 'audience', 'launchYear', 'globalParticipants', 'price', 'dealValue', 'contractDuration'].includes(key)) {
                        cleanData[key] = parseInt(value);
                    } else {
                        cleanData[key] = value;
                    }
                }
            });
            
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(cleanData)
            });
            
            if (res.ok) {
                toast.success('Created successfully!');
                setShowForm(false);
                setFormData({});
                fetchData();
            } else {
                const errorData = await res.json().catch(() => ({}));
                toast.error(errorData.detail || 'Creation failed');
                console.error('Create error:', errorData);
            }
        } catch (error) {
            toast.error('Error creating item: ' + error.message);
            console.error('Create error:', error);
        }
        setLoading(false);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const useAdminRoute = ['athletes', 'coaches', 'referees', 'achievements', 'records'].includes(activeTab);
            const endpoint = useAdminRoute
                ? `http://localhost:8000/api/admin/${activeTab}/${editingItem.id}`
                : `http://localhost:8000/api/${activeTab}/${editingItem.id}`;
            
            // Clean and prepare data
            const cleanData = {};
            Object.keys(formData).forEach(key => {
                const value = formData[key];
                if (value !== null && value !== undefined && value !== '') {
                    // Convert number fields to integers
                    if (['jerseyNumber', 'goalsScored', 'assists', 'matchesPlayed', 'experienceYears', 'titlesWon', 'year', 'matchesOfficiated', 'capacity', 'openedYear', 'audience', 'launchYear', 'globalParticipants', 'price', 'dealValue', 'contractDuration'].includes(key)) {
                        cleanData[key] = parseInt(value);
                    } else {
                        cleanData[key] = value;
                    }
                }
            });
            
            const res = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(cleanData)
            });
            
            if (res.ok) {
                toast.success('Updated successfully!');
                setEditingItem(null);
                setFormData({});
                setShowForm(false);
                fetchData();
            } else {
                const errorData = await res.json().catch(() => ({}));
                toast.error(errorData.detail || 'Update failed');
                console.error('Update error:', errorData);
            }
        } catch (error) {
            toast.error('Error updating item: ' + error.message);
            console.error('Update error:', error);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item? This will modify the RDF file!')) return;
        
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const useAdminRoute = ['athletes', 'coaches', 'referees', 'achievements', 'records'].includes(activeTab);
            const endpoint = useAdminRoute
                ? `http://localhost:8000/api/admin/${activeTab}/${id}`
                : `http://localhost:8000/api/${activeTab}/${id}`;
            const res = await fetch(endpoint, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (res.ok) {
                toast.success('Deleted successfully!');
                if (aiSearchActive) {
                    handleAISearch();
                } else {
                    fetchData();
                }
            } else {
                toast.error('Delete failed');
            }
        } catch (error) {
            toast.error('Error deleting item');
        }
        setLoading(false);
    };

    const handleAISearch = async (e) => {
        if (e) e.preventDefault();
        
        if (!aiSearchQuery.trim()) {
            setAiSearchActive(false);
            setSearchResults([]);
            setSparqlQuery('');
            fetchData();
            return;
        }

        setLoading(true);
        setAiSearchActive(true);
        try {
            const response = await fetch(`http://localhost:8000/api/nl-search/search?q=${encodeURIComponent(aiSearchQuery)}`);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
                throw new Error(errorData.detail || 'Search request failed');
            }
            
            const data = await response.json();
            console.log('AI Search Response:', data);
            
            // Get SPARQL from various possible locations
            const sparqlQuery = data.sparql_query || data.sparql || (data.metadata && data.metadata.sparql) || '';
            setSparqlQuery(sparqlQuery);
            
            // Parse results and categorize by type
            const results = data.results || [];
            console.log('Raw results:', results);
            
            const categorizedResults = {
                athletes: [],
                coaches: [],
                achievements: [],
                records: [],
                referees: [],
                teams: [],
                competitions: [],
                organizations: [],
                venues: [],
                media: [],
                sports: [],
                equipment: [],
                sponsorships: []
            };
            
            results.forEach(result => {
                console.log('Processing result:', result);
                
                // Extract ID from entity URI if needed
                const extractId = (entity) => {
                    // Try result.id first
                    if (result.id) return result.id;
                    
                    // Try to extract from entity URI
                    if (entity && typeof entity === 'string') {
                        if (entity.includes('#')) {
                            return entity.split('#')[1];
                        }
                        if (entity.includes('/')) {
                            const parts = entity.split('/');
                            return parts[parts.length - 1];
                        }
                        return entity;
                    }
                    
                    // Fallback
                    return 'unknown_' + Math.random().toString(36).substr(2, 9);
                };
                
                const entityId = extractId(result.entity);
                console.log('Extracted ID:', entityId, 'from entity:', result.entity, 'Type:', result.type);
                
                // Use the type field to categorize (PRIORITY)
                if (result.type === 'Athlete') {
                    categorizedResults.athletes.push({
                        id: entityId,
                        firstName: result.firstName,
                        lastName: result.lastName,
                        nationality: result.nationality,
                        position: result.position,
                        goalsScored: result.goalsScored || result.goals || 0
                    });
                }
                else if (result.type === 'Coach') {
                    categorizedResults.coaches.push({
                        id: entityId,
                        firstName: result.firstName,
                        lastName: result.lastName,
                        nationality: result.nationality,
                        experienceYears: result.experienceYears || result.yearsExperience || 0,
                        titlesWon: result.titlesWon || 0
                    });
                }
                else if (result.type === 'Referee') {
                    categorizedResults.referees.push({
                        id: entityId,
                        firstName: result.firstName,
                        lastName: result.lastName,
                        nationality: result.nationality,
                        experienceYears: result.experienceYears || 0,
                        matchesOfficiated: result.matchesOfficiated || 0
                    });
                }
                else if (result.type === 'Team') {
                    categorizedResults.teams.push({
                        id: entityId,
                        name: result.teamName || result.name || 'Unknown Team',
                        teamName: result.teamName || result.name,
                        team_type: result.team_type || '-',
                        country: result.country || '-',
                        foundedYear: result.foundedYear || '-',
                        city: result.city || '-',
                        budget: result.budget || '-',
                        currentRanking: result.currentRanking || '-',
                        wins: result.wins || '-'
                    });
                }
                else if (result.type === 'Competition') {
                    categorizedResults.competitions.push({
                        id: entityId,
                        name: result.competitionName || result.name || 'Unknown Competition',
                        competitionName: result.competitionName || result.name,
                        type: result.compType || '-',
                        season: result.season || '-',
                        startDate: result.startDate || '-',
                        country: result.country || '-',
                        numberOfTeams: result.numberOfTeams || '-',
                        prizeMoney: result.prizeMoney || '-'
                    });
                }
                else if (result.type === 'Organization') {
                    categorizedResults.organizations.push({
                        id: entityId,
                        name: result.organizationName || result.name || 'Unknown Organization',
                        organizationName: result.organizationName || result.name,
                        type: result.orgType || '-',
                        headquarters: result.headquarters || '-',
                        establishedYear: result.establishedYear || result.foundedYear || '-',
                        president: result.president || '-',
                        memberCount: result.memberCount || '-'
                    });
                }
                else if (result.type === 'Venue') {
                    categorizedResults.venues.push({
                        id: entityId,
                        name: result.venueName || result.name || 'Unknown Venue',
                        venueName: result.venueName || result.name,
                        city: result.city || '-',
                        country: result.country || '-',
                        capacity: result.capacity || '-',
                        openedYear: result.openedYear || '-',
                        surfaceType: result.surfaceType || '-'
                    });
                }
                else if (result.type === 'Media') {
                    categorizedResults.media.push({
                        id: entityId,
                        name: result.mediaName || result.name || 'Unknown Media',
                        mediaName: result.mediaName || result.name,
                        type: result.mediaType || 'Media',
                        audience: result.audience || '-',
                        launchYear: result.launchYear || '-',
                        covers: result.covers || '-'
                    });
                }
                else if (result.type === 'Sport') {
                    categorizedResults.sports.push({
                        id: entityId,
                        name: result.sportName || result.name || 'Unknown Sport',
                        sportName: result.sportName || result.name,
                        isOlympic: result.isOlympic || false,
                        originCountry: result.originCountry || '-',
                        globalParticipants: result.globalParticipants || '-',
                        category: result.category || '-'
                    });
                }
                else if (result.type === 'Equipment') {
                    categorizedResults.equipment.push({
                        id: entityId,
                        name: result.equipmentName || result.name || 'Unknown Equipment',
                        equipmentName: result.equipmentName || result.name,
                        brand: result.brand || '-',
                        model: result.model || '-',
                        sport: result.sport || '-',
                        price: result.price || '-',
                        material: result.material || '-'
                    });
                }
                else if (result.type === 'Sponsorship') {
                    categorizedResults.sponsorships.push({
                        id: entityId,
                        sponsorName: result.sponsorName || 'Unknown Sponsor',
                        dealValue: result.dealValue || '-',
                        industry: result.industry || '-',
                        sponsors: result.sponsors || '-',
                        endorses: result.endorses || '-',
                        amount: result.dealValue || '-',
                        sponsee: result.sponsors || '-',
                        startDate: result.startDate || '-',
                        endDate: result.endDate || '-'
                    });
                }
                // Fallback for legacy results without type field
                else if (result.achievementType) {
                    categorizedResults.achievements.push({
                        id: entityId,
                        achievementType: result.achievementType,
                        year: result.year,
                        achievedBy: result.athleteName || result.fullName || '-'
                    });
                }
                else if (result.recordType) {
                    categorizedResults.records.push({
                        id: entityId,
                        recordType: result.recordType,
                        recordValue: result.recordValue || result.value || result.performanceValue,
                        setBy: result.athleteName || result.fullName || '-'
                    });
                }
            });
            
            console.log('Categorized results:', categorizedResults);
            setSearchResults(categorizedResults);
            
            const totalFound = results.length;
            if (totalFound > 0) {
                toast.success(`Found ${totalFound} result${totalFound > 1 ? 's' : ''}`);
            } else {
                toast.info('No results found for your query');
            }
        } catch (error) {
            console.error('AI search error:', error);
            toast.error(`AI search failed: ${error.message}`);
            setAiSearchActive(false);
        }
        setLoading(false);
    };

    const openCreateForm = () => {
        setFormData({});
        setEditingItem(null);
        setShowForm(true);
    };

    const openEditForm = (item) => {
        // Map athleteId to achievedBy/setBy for achievements and records
        const mappedData = { ...item };
        
        if (activeTab === 'achievements' && item.athleteId) {
            mappedData.achievedBy = item.athleteId;
        }
        
        if (activeTab === 'records' && item.athleteId) {
            mappedData.setBy = item.athleteId;
        }
        
        setFormData(mappedData);
        setEditingItem(item);
        setShowForm(true);
    };

    const tabs = [
        { id: 'athletes', label: '🏃 Athletes', icon: 'fa-running', color: '#2563eb' },
        { id: 'coaches', label: '📋 Coaches', icon: 'fa-clipboard', color: '#16a34a' },
        { id: 'achievements', label: '🏆 Achievements', icon: 'fa-trophy', color: '#f59e0b' },
        { id: 'records', label: '🥇 Records', icon: 'fa-medal', color: '#a855f7' },
        { id: 'referees', label: '🔷 Referees', icon: 'fa-whistle', color: '#ec4899' },
        { id: 'teams', label: '⚽ Teams', icon: 'fa-users', color: '#0891b2' },
        { id: 'competitions', label: '🏆 Competitions', icon: 'fa-trophy', color: '#dc2626' },
        { id: 'organizations', label: '🏢 Organizations', icon: 'fa-building', color: '#7c3aed' },
        { id: 'venues', label: '🏟️ Venues', icon: 'fa-map-marker-alt', color: '#10b981' },
        { id: 'media', label: '📺 Media', icon: 'fa-broadcast-tower', color: '#ec4899' },
        { id: 'sports', label: '⚽ Sports', icon: 'fa-futbol', color: '#fb923c' },
        { id: 'equipment', label: '🏀 Equipment', icon: 'fa-basketball-ball', color: '#0ea5e9' },
        { id: 'sponsorships', label: '🤝 Sponsorships', icon: 'fa-handshake', color: '#a855f7' }
    ];

    const getCurrentData = () => {
        if (aiSearchActive && searchResults) {
            if (activeTab === 'athletes') return searchResults.athletes || [];
            if (activeTab === 'coaches') return searchResults.coaches || [];
            if (activeTab === 'achievements') return searchResults.achievements || [];
            if (activeTab === 'records') return searchResults.records || [];
            if (activeTab === 'referees') return searchResults.referees || [];
            if (activeTab === 'teams') return searchResults.teams || [];
            if (activeTab === 'competitions') return searchResults.competitions || [];
            if (activeTab === 'organizations') return searchResults.organizations || [];
            if (activeTab === 'venues') return searchResults.venues || [];
            if (activeTab === 'media') return searchResults.media || [];
            if (activeTab === 'sports') return searchResults.sports || [];
            if (activeTab === 'equipment') return searchResults.equipment || [];
            if (activeTab === 'sponsorships') return searchResults.sponsorships || [];
        }
        
        if (activeTab === 'athletes') return athletes;
        if (activeTab === 'coaches') return coaches;
        if (activeTab === 'achievements') return achievements;
        if (activeTab === 'records') return records;
        if (activeTab === 'referees') return referees;
        if (activeTab === 'teams') return teams;
        if (activeTab === 'competitions') return competitions;
        if (activeTab === 'organizations') return organizations;
        if (activeTab === 'venues') return venues;
        if (activeTab === 'media') return media;
        if (activeTab === 'sports') return sports;
        if (activeTab === 'equipment') return equipment;
        if (activeTab === 'sponsorships') return sponsorships;
        return [];
    };

    const getFilteredData = () => {
        const currentData = getCurrentData();
        
        if (!localSearchQuery.trim()) {
            return currentData;
        }
        
        const searchTerm = localSearchQuery.toLowerCase();
        
        return currentData.filter(item => {
            // Convert all item values to searchable string
            const searchableFields = [];
            
            // Common fields
            if (item.id) searchableFields.push(item.id.toLowerCase());
            if (item.firstName) searchableFields.push(item.firstName.toLowerCase());
            if (item.lastName) searchableFields.push(item.lastName.toLowerCase());
            if (item.nationality) searchableFields.push(item.nationality.toLowerCase());
            
            // Tab-specific fields
            if (activeTab === 'athletes') {
                if (item.position) searchableFields.push(item.position.toLowerCase());
                if (item.goalsScored) searchableFields.push(item.goalsScored.toString());
            }
            
            if (activeTab === 'coaches') {
                if (item.coachingStyle) searchableFields.push(item.coachingStyle.toLowerCase());
                if (item.experienceYears) searchableFields.push(item.experienceYears.toString());
            }
            
            if (activeTab === 'achievements') {
                if (item.achievementType) searchableFields.push(item.achievementType.toLowerCase());
                if (item.year) searchableFields.push(item.year.toString());
                if (item.achievedBy) searchableFields.push(item.achievedBy.toLowerCase());
            }
            
            if (activeTab === 'records') {
                if (item.recordType) searchableFields.push(item.recordType.toLowerCase());
                if (item.recordValue) searchableFields.push(item.recordValue.toString().toLowerCase());
                if (item.setBy) searchableFields.push(item.setBy.toLowerCase());
            }
            
            if (activeTab === 'referees') {
                if (item.experienceYears) searchableFields.push(item.experienceYears.toString());
                if (item.matchesOfficiated) searchableFields.push(item.matchesOfficiated.toString());
            }
            
            if (activeTab === 'teams') {
                if (item.name) searchableFields.push(item.name.toLowerCase());
                if (item.teamName) searchableFields.push(item.teamName.toLowerCase());
                if (item.team_type) searchableFields.push(item.team_type.toLowerCase());
                if (item.type) searchableFields.push(item.type.toLowerCase());
                if (item.country) searchableFields.push(item.country.toLowerCase());
                if (item.city) searchableFields.push(item.city.toLowerCase());
            }
            
            if (activeTab === 'competitions') {
                if (item.name) searchableFields.push(item.name.toLowerCase());
                if (item.competitionName) searchableFields.push(item.competitionName.toLowerCase());
                if (item.type) searchableFields.push(item.type.toLowerCase());
                if (item.season) searchableFields.push(item.season.toLowerCase());
                if (item.country) searchableFields.push(item.country.toLowerCase());
            }
            
            if (activeTab === 'organizations') {
                if (item.name) searchableFields.push(item.name.toLowerCase());
                if (item.organizationName) searchableFields.push(item.organizationName.toLowerCase());
                if (item.type) searchableFields.push(item.type.toLowerCase());
                if (item.headquarters) searchableFields.push(item.headquarters.toLowerCase());
                if (item.president) searchableFields.push(item.president.toLowerCase());
            }
            
            if (activeTab === 'venues') {
                if (item.name) searchableFields.push(item.name.toLowerCase());
                if (item.venueName) searchableFields.push(item.venueName.toLowerCase());
                if (item.city) searchableFields.push(item.city.toLowerCase());
                if (item.country) searchableFields.push(item.country.toLowerCase());
                if (item.surfaceType) searchableFields.push(item.surfaceType.toLowerCase());
            }
            
            if (activeTab === 'media') {
                if (item.name) searchableFields.push(item.name.toLowerCase());
                if (item.mediaName) searchableFields.push(item.mediaName.toLowerCase());
                if (item.type) searchableFields.push(item.type.toLowerCase());
                if (item.covers) searchableFields.push(item.covers.toLowerCase());
            }
            
            if (activeTab === 'sports') {
                if (item.name) searchableFields.push(item.name.toLowerCase());
                if (item.sportName) searchableFields.push(item.sportName.toLowerCase());
                if (item.originCountry) searchableFields.push(item.originCountry.toLowerCase());
            }
            
            if (activeTab === 'equipment') {
                if (item.name) searchableFields.push(item.name.toLowerCase());
                if (item.equipmentName) searchableFields.push(item.equipmentName.toLowerCase());
                if (item.brand) searchableFields.push(item.brand.toLowerCase());
                if (item.model) searchableFields.push(item.model.toLowerCase());
                if (item.sport) searchableFields.push(item.sport.toLowerCase());
            }
            
            if (activeTab === 'sponsorships') {
                if (item.sponsorName) searchableFields.push(item.sponsorName.toLowerCase());
                if (item.industry) searchableFields.push(item.industry.toLowerCase());
                if (item.sponsors) searchableFields.push(item.sponsors.toLowerCase());
                if (item.endorses) searchableFields.push(item.endorses.toLowerCase());
            }
            
            // Check if any field contains the search term
            return searchableFields.some(field => field.includes(searchTerm));
        });
    };

    const renderForm = () => {
        if (!showForm && !editingItem) return null;

        const isEditing = !!editingItem;

        return (
            <div style={{ 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0, 
                background: 'rgba(0,0,0,0.5)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                zIndex: 1000,
                padding: '20px'
            }}>
                <div style={{ 
                    background: 'white', 
                    borderRadius: '20px', 
                    padding: '40px', 
                    maxWidth: '600px', 
                    width: '100%', 
                    maxHeight: '90vh', 
                    overflowY: 'auto' 
                }}>
                    <h2 style={{ marginBottom: '30px', color: '#1e293b' }}>
                        {isEditing ? 'Edit' : 'Create'} {activeTab.slice(0, -1)}
                    </h2>
                    <form onSubmit={isEditing ? handleUpdate : handleCreate}>
                        {activeTab === 'athletes' && (
                            <>
                                <FormField label="First Name *" name="firstName" value={formData.firstName || ''} onChange={(e) => setFormData({...formData, firstName: e.target.value})} required />
                                <FormField label="Last Name *" name="lastName" value={formData.lastName || ''} onChange={(e) => setFormData({...formData, lastName: e.target.value})} required />
                                <FormField label="Birth Date" name="birthDate" type="date" value={formData.birthDate || ''} onChange={(e) => setFormData({...formData, birthDate: e.target.value})} />
                                <FormField label="Nationality" name="nationality" value={formData.nationality || ''} onChange={(e) => setFormData({...formData, nationality: e.target.value})} />
                                <SelectField label="Position" name="position" value={formData.position || ''} onChange={(e) => setFormData({...formData, position: e.target.value})} options={POSITIONS} />
                                <FormField label="Jersey Number" name="jerseyNumber" type="number" value={formData.jerseyNumber || ''} onChange={(e) => setFormData({...formData, jerseyNumber: e.target.value})} />
                                <FormField label="Goals Scored" name="goalsScored" type="number" value={formData.goalsScored || ''} onChange={(e) => setFormData({...formData, goalsScored: e.target.value})} />
                                <FormField label="Assists" name="assists" type="number" value={formData.assists || ''} onChange={(e) => setFormData({...formData, assists: e.target.value})} />
                                <FormField label="Matches Played" name="matchesPlayed" type="number" value={formData.matchesPlayed || ''} onChange={(e) => setFormData({...formData, matchesPlayed: e.target.value})} />
                            </>
                        )}

                        {activeTab === 'coaches' && (
                            <>
                                <FormField label="First Name *" name="firstName" value={formData.firstName || ''} onChange={(e) => setFormData({...formData, firstName: e.target.value})} required />
                                <FormField label="Last Name *" name="lastName" value={formData.lastName || ''} onChange={(e) => setFormData({...formData, lastName: e.target.value})} required />
                                <FormField label="Birth Date" name="birthDate" type="date" value={formData.birthDate || ''} onChange={(e) => setFormData({...formData, birthDate: e.target.value})} />
                                <FormField label="Nationality" name="nationality" value={formData.nationality || ''} onChange={(e) => setFormData({...formData, nationality: e.target.value})} />
                                <FormField label="Experience Years" name="experienceYears" type="number" value={formData.experienceYears || ''} onChange={(e) => setFormData({...formData, experienceYears: e.target.value})} />
                                <FormField label="Titles Won" name="titlesWon" type="number" value={formData.titlesWon || ''} onChange={(e) => setFormData({...formData, titlesWon: e.target.value})} />
                                <SelectField label="Coaching Style" name="coachingStyle" value={formData.coachingStyle || ''} onChange={(e) => setFormData({...formData, coachingStyle: e.target.value})} options={COACHING_STYLES} />
                            </>
                        )}

                        {activeTab === 'achievements' && (
                            <>
                                <SelectField label="Achievement Type *" name="achievementType" value={formData.achievementType || ''} onChange={(e) => setFormData({...formData, achievementType: e.target.value})} options={ACHIEVEMENT_TYPES} required />
                                <FormField label="Year" name="year" type="number" value={formData.year || ''} onChange={(e) => setFormData({...formData, year: e.target.value})} />
                                <FormField label="Performance Value" name="performanceValue" value={formData.performanceValue || ''} onChange={(e) => setFormData({...formData, performanceValue: e.target.value})} />
                                <FormField label="Unit" name="unit" value={formData.unit || ''} onChange={(e) => setFormData({...formData, unit: e.target.value})} />
                                <AthleteSelectField label="Achieved By (Athlete)" name="achievedBy" value={formData.achievedBy || ''} onChange={(e) => setFormData({...formData, achievedBy: e.target.value})} athletes={athletes} />
                            </>
                        )}

                        {activeTab === 'records' && (
                            <>
                                <SelectField label="Record Type *" name="recordType" value={formData.recordType || ''} onChange={(e) => setFormData({...formData, recordType: e.target.value})} options={RECORD_TYPES} required />
                                <FormField label="Record Value *" name="recordValue" value={formData.recordValue || ''} onChange={(e) => setFormData({...formData, recordValue: e.target.value})} required />
                                <FormField label="Set On" name="setOn" type="date" value={formData.setOn || ''} onChange={(e) => setFormData({...formData, setOn: e.target.value})} />
                                <AthleteSelectField label="Set By (Athlete)" name="setBy" value={formData.setBy || ''} onChange={(e) => setFormData({...formData, setBy: e.target.value})} athletes={athletes} />
                            </>
                        )}

                        {activeTab === 'referees' && (
                            <>
                                <FormField label="First Name *" name="firstName" value={formData.firstName || ''} onChange={(e) => setFormData({...formData, firstName: e.target.value})} required />
                                <FormField label="Last Name *" name="lastName" value={formData.lastName || ''} onChange={(e) => setFormData({...formData, lastName: e.target.value})} required />
                                <FormField label="Birth Date" name="birthDate" type="date" value={formData.birthDate || ''} onChange={(e) => setFormData({...formData, birthDate: e.target.value})} />
                                <FormField label="Nationality" name="nationality" value={formData.nationality || ''} onChange={(e) => setFormData({...formData, nationality: e.target.value})} />
                                <FormField label="Experience Years" name="experienceYears" type="number" value={formData.experienceYears || ''} onChange={(e) => setFormData({...formData, experienceYears: e.target.value})} />
                                <FormField label="Matches Officiated" name="matchesOfficiated" type="number" value={formData.matchesOfficiated || ''} onChange={(e) => setFormData({...formData, matchesOfficiated: e.target.value})} />
                            </>
                        )}

                        {activeTab === 'teams' && (
                            <>
                                <FormField label="Team Name *" name="teamName" value={formData.teamName || ''} onChange={(e) => setFormData({...formData, teamName: e.target.value})} required />
                                <SelectField 
                                    label="Team Type *" 
                                    name="team_type" 
                                    value={formData.team_type || ''} 
                                    onChange={(e) => setFormData({...formData, team_type: e.target.value})} 
                                    options={['ProfessionalTeam', 'NationalTeam', 'AmateurTeam', 'YouthTeam', 'WomenTeam']} 
                                    required 
                                />
                                <FormField label="City" name="city" value={formData.city || ''} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                                <FormField label="Country *" name="country" value={formData.country || ''} onChange={(e) => setFormData({...formData, country: e.target.value})} required />
                                <FormField label="Founded Year" name="foundedYear" type="number" value={formData.foundedYear || ''} onChange={(e) => setFormData({...formData, foundedYear: e.target.value})} />
                                <FormField label="Budget (in millions)" name="budget" type="number" value={formData.budget || ''} onChange={(e) => setFormData({...formData, budget: e.target.value})} />
                                <FormField label="Current Ranking" name="currentRanking" type="number" value={formData.currentRanking || ''} onChange={(e) => setFormData({...formData, currentRanking: e.target.value})} />
                                <FormField label="Wins" name="wins" type="number" value={formData.wins || ''} onChange={(e) => setFormData({...formData, wins: e.target.value})} />
                                <FormField label="Draws" name="draws" type="number" value={formData.draws || ''} onChange={(e) => setFormData({...formData, draws: e.target.value})} />
                                <FormField label="Losses" name="losses" type="number" value={formData.losses || ''} onChange={(e) => setFormData({...formData, losses: e.target.value})} />
                                <FormField label="Primary Color" name="primaryColor" type="color" value={formData.primaryColor || '#000000'} onChange={(e) => setFormData({...formData, primaryColor: e.target.value})} />
                                <FormField label="Secondary Color" name="secondaryColor" type="color" value={formData.secondaryColor || '#ffffff'} onChange={(e) => setFormData({...formData, secondaryColor: e.target.value})} />
                            </>
                        )}

                        {activeTab === 'competitions' && (
                            <>
                                <FormField label="Competition Name *" name="competitionName" value={formData.competitionName || ''} onChange={(e) => setFormData({...formData, competitionName: e.target.value})} required />
                                <SelectField 
                                    label="Competition Type *" 
                                    name="competition_type" 
                                    value={formData.competition_type || ''} 
                                    onChange={(e) => setFormData({...formData, competition_type: e.target.value})} 
                                    options={['League', 'Tournament', 'Championship', 'WorldCup', 'Olympics']} 
                                    required 
                                />
                                <FormField label="Season" name="season" value={formData.season || ''} onChange={(e) => setFormData({...formData, season: e.target.value})} placeholder="e.g., 2024/2025" />
                                <FormField label="Start Date" name="startDate" type="date" value={formData.startDate || ''} onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
                                <FormField label="End Date" name="endDate" type="date" value={formData.endDate || ''} onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
                                <FormField label="Country" name="country" value={formData.country || ''} onChange={(e) => setFormData({...formData, country: e.target.value})} />
                                <FormField label="Number of Teams" name="numberOfTeams" type="number" value={formData.numberOfTeams || ''} onChange={(e) => setFormData({...formData, numberOfTeams: e.target.value})} />
                                <FormField label="Prize Money (in millions)" name="prizeMoney" type="number" value={formData.prizeMoney || ''} onChange={(e) => setFormData({...formData, prizeMoney: e.target.value})} />
                                <FormField label="Competition Format" name="competitionFormat" value={formData.competitionFormat || ''} onChange={(e) => setFormData({...formData, competitionFormat: e.target.value})} placeholder="e.g., Round-robin, Knockout" />
                                <FormField label="Description" name="description" value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} multiline rows={4} />
                            </>
                        )}

                        {activeTab === 'organizations' && (
                            <>
                                <FormField label="Organization Name *" name="organizationName" value={formData.organizationName || ''} onChange={(e) => setFormData({...formData, organizationName: e.target.value})} required />
                                <SelectField 
                                    label="Organization Type *" 
                                    name="organization_type" 
                                    value={formData.organization_type || ''} 
                                    onChange={(e) => setFormData({...formData, organization_type: e.target.value})} 
                                    options={['Federation', 'Club', 'League_Org', 'SportsAgency', 'AntiDoping']} 
                                    required 
                                />
                                <FormField label="Headquarters *" name="headquarters" value={formData.headquarters || ''} onChange={(e) => setFormData({...formData, headquarters: e.target.value})} required placeholder="e.g., Zurich, Switzerland" />
                                <FormField label="Established Year" name="establishedYear" type="number" value={formData.establishedYear || ''} onChange={(e) => setFormData({...formData, establishedYear: e.target.value})} />
                                <FormField label="President" name="president" value={formData.president || ''} onChange={(e) => setFormData({...formData, president: e.target.value})} />
                                <FormField label="Member Count" name="memberCount" type="number" value={formData.memberCount || ''} onChange={(e) => setFormData({...formData, memberCount: e.target.value})} />
                                <FormField label="Annual Revenue (in millions)" name="annualRevenue" type="number" value={formData.annualRevenue || ''} onChange={(e) => setFormData({...formData, annualRevenue: e.target.value})} />
                                <FormField label="Website" name="website" value={formData.website || ''} onChange={(e) => setFormData({...formData, website: e.target.value})} placeholder="https://example.com" />
                                <FormField label="Description" name="description" value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} multiline rows={4} />
                            </>
                        )}

                        {activeTab === 'venues' && (
                            <>
                                <FormField label="Venue Name *" name="venueName" value={formData.venueName || ''} onChange={(e) => setFormData({...formData, venueName: e.target.value})} required />
                                <FormField label="City" name="city" value={formData.city || ''} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                                <FormField label="Country" name="country" value={formData.country || ''} onChange={(e) => setFormData({...formData, country: e.target.value})} />
                                <FormField label="Capacity" name="capacity" type="number" value={formData.capacity || ''} onChange={(e) => setFormData({...formData, capacity: e.target.value})} />
                                <FormField label="Opened Year" name="openedYear" type="number" value={formData.openedYear || ''} onChange={(e) => setFormData({...formData, openedYear: e.target.value})} />
                                <FormField label="Surface Type" name="surfaceType" value={formData.surfaceType || ''} onChange={(e) => setFormData({...formData, surfaceType: e.target.value})} placeholder="e.g., Grass, Artificial Turf, Hardwood" />
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                        <input 
                                            type="checkbox" 
                                            name="isIndoor" 
                                            checked={formData.isIndoor || false} 
                                            onChange={(e) => setFormData({...formData, isIndoor: e.target.checked})}
                                            style={{ marginRight: '8px', width: '18px', height: '18px', cursor: 'pointer' }}
                                        />
                                        <span style={{ color: '#1e293b', fontSize: '14px', fontWeight: '600' }}>Is Indoor</span>
                                    </label>
                                </div>
                            </>
                        )}

                        {activeTab === 'media' && (
                            <>
                                <FormField label="Media Name *" name="mediaName" value={formData.mediaName || ''} onChange={(e) => setFormData({...formData, mediaName: e.target.value})} required />
                                <FormField label="Audience" name="audience" type="number" value={formData.audience || ''} onChange={(e) => setFormData({...formData, audience: e.target.value})} placeholder="Number of viewers/readers" />
                                <FormField label="Launch Year" name="launchYear" type="number" value={formData.launchYear || ''} onChange={(e) => setFormData({...formData, launchYear: e.target.value})} />
                                <FormField label="Website" name="website" value={formData.website || ''} onChange={(e) => setFormData({...formData, website: e.target.value})} placeholder="https://example.com" />
                                <FormField label="Covers" name="covers" value={formData.covers || ''} onChange={(e) => setFormData({...formData, covers: e.target.value})} placeholder="Sports covered (e.g., Football, Basketball)" />
                            </>
                        )}

                        {activeTab === 'sports' && (
                            <>
                                <FormField label="Sport Name *" name="sportName" value={formData.sportName || ''} onChange={(e) => setFormData({...formData, sportName: e.target.value})} required />
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                        <input 
                                            type="checkbox" 
                                            name="isOlympic" 
                                            checked={formData.isOlympic || false} 
                                            onChange={(e) => setFormData({...formData, isOlympic: e.target.checked})}
                                            style={{ marginRight: '8px', width: '18px', height: '18px', cursor: 'pointer' }}
                                        />
                                        <span style={{ color: '#1e293b', fontSize: '14px', fontWeight: '600' }}>Is Olympic</span>
                                    </label>
                                </div>
                                <FormField label="Origin Country" name="originCountry" value={formData.originCountry || ''} onChange={(e) => setFormData({...formData, originCountry: e.target.value})} />
                                <FormField label="Global Participants" name="globalParticipants" type="number" value={formData.globalParticipants || ''} onChange={(e) => setFormData({...formData, globalParticipants: e.target.value})} placeholder="Estimated number of players worldwide" />
                            </>
                        )}

                        {activeTab === 'equipment' && (
                            <>
                                <FormField label="Equipment Name *" name="equipmentName" value={formData.equipmentName || ''} onChange={(e) => setFormData({...formData, equipmentName: e.target.value})} required />
                                <FormField label="Brand" name="brand" value={formData.brand || ''} onChange={(e) => setFormData({...formData, brand: e.target.value})} />
                                <FormField label="Model" name="model" value={formData.model || ''} onChange={(e) => setFormData({...formData, model: e.target.value})} />
                                <FormField label="Price" name="price" type="number" value={formData.price || ''} onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder="Price in USD" />
                                <FormField label="Color" name="color" value={formData.color || ''} onChange={(e) => setFormData({...formData, color: e.target.value})} />
                                <FormField label="Size" name="size" value={formData.size || ''} onChange={(e) => setFormData({...formData, size: e.target.value})} />
                                <FormField label="Material" name="material" value={formData.material || ''} onChange={(e) => setFormData({...formData, material: e.target.value})} />
                                <FormField label="Required For" name="requiredFor" value={formData.requiredFor || ''} onChange={(e) => setFormData({...formData, requiredFor: e.target.value})} placeholder="Sport or activity" />
                            </>
                        )}

                        {activeTab === 'sponsorships' && (
                            <>
                                <FormField label="Sponsor Name *" name="sponsorName" value={formData.sponsorName || ''} onChange={(e) => setFormData({...formData, sponsorName: e.target.value})} required />
                                <FormField label="Deal Value" name="dealValue" type="number" value={formData.dealValue || ''} onChange={(e) => setFormData({...formData, dealValue: e.target.value})} placeholder="Value in millions" />
                                <FormField label="Contract Duration (years)" name="contractDuration" type="number" value={formData.contractDuration || ''} onChange={(e) => setFormData({...formData, contractDuration: e.target.value})} />
                                <FormField label="Industry" name="industry" value={formData.industry || ''} onChange={(e) => setFormData({...formData, industry: e.target.value})} placeholder="e.g., Technology, Sportswear, Finance" />
                                <FormField label="Sponsors" name="sponsors" value={formData.sponsors || ''} onChange={(e) => setFormData({...formData, sponsors: e.target.value})} placeholder="Entity being sponsored" />
                                <FormField label="Endorses" name="endorses" value={formData.endorses || ''} onChange={(e) => setFormData({...formData, endorses: e.target.value})} placeholder="Person or team endorsing" />
                            </>
                        )}

                        <div style={{ marginTop: '30px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button type="button" onClick={() => { setShowForm(false); setEditingItem(null); setFormData({}); }} style={{ padding: '12px 24px', background: '#94a3b8', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>
                                Cancel
                            </button>
                            <button type="submit" disabled={loading} style={{ padding: '12px 24px', background: loading ? '#94a3b8' : '#2563eb', color: 'white', border: 'none', borderRadius: '10px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '600' }}>
                                {loading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <LayoutV1>
            <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)', minHeight: '100vh', paddingTop: '120px', paddingBottom: '60px' }}>
                <div className="container">
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <h1 style={{ fontSize: '48px', fontWeight: '900', color: '#1e293b', marginBottom: '15px' }}>
                            <i className="fas fa-shield-alt" style={{ marginRight: '15px', color: '#2563eb' }}></i>
                            Admin Panel
                        </h1>
                        <p style={{ fontSize: '18px', color: '#64748b', fontWeight: '500' }}>
                            Manage your RDF knowledge graph in real-time
                        </p>
                    </div>

                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    padding: '15px 30px',
                                    background: activeTab === tab.id ? tab.color : 'white',
                                    color: activeTab === tab.id ? 'white' : '#64748b',
                                    border: `2px solid ${activeTab === tab.id ? tab.color : '#e2e8f0'}`,
                                    borderRadius: '15px',
                                    fontSize: '16px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    boxShadow: activeTab === tab.id ? `0 8px 25px ${tab.color}40` : 'none'
                                }}
                            >
                                <i className={`fas ${tab.icon}`} style={{ marginRight: '10px' }}></i>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* AI Search */}
                    <div style={{ marginBottom: '30px' }}>
                        <div style={{ background: 'white', borderRadius: '20px', padding: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
                            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <i className="fas fa-robot" style={{ color: '#8b5cf6' }}></i>
                                AI-Powered Search
                                <span style={{ fontSize: '14px', fontWeight: '500', color: '#64748b', marginLeft: '10px' }}>Search across all classes using Ollama</span>
                            </h2>
                            <form onSubmit={handleAISearch} style={{ display: 'flex', gap: '15px', marginBottom: showSparql ? '20px' : '0' }}>
                                <input
                                    type="text"
                                    value={aiSearchQuery}
                                    onChange={(e) => setAiSearchQuery(e.target.value)}
                                    placeholder="Try: 'Spanish athletes', 'coaches with most titles', 'world cup winners', 'NBA records'..."
                                    style={{
                                        flex: 1,
                                        padding: '15px 20px',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '12px',
                                        fontSize: '15px',
                                        outline: 'none',
                                        transition: 'all 0.3s'
                                    }}
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        padding: '15px 30px',
                                        background: loading ? '#94a3b8' : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontSize: '16px',
                                        fontWeight: '700',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        boxShadow: '0 8px 25px rgba(139,92,246,0.3)',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    <i className="fas fa-search" style={{ marginRight: '10px' }}></i>
                                    {loading ? 'Searching...' : 'Search'}
                                </button>
                                {sparqlQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setShowSparql(!showSparql)}
                                        style={{
                                            padding: '15px 30px',
                                            background: showSparql ? '#3b82f6' : 'white',
                                            color: showSparql ? 'white' : '#3b82f6',
                                            border: '2px solid #3b82f6',
                                            borderRadius: '12px',
                                            fontSize: '16px',
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        <i className="fas fa-code" style={{ marginRight: '10px' }}></i>
                                        {showSparql ? 'Hide' : 'Show'} SPARQL
                                    </button>
                                )}
                            </form>
                            
                            {showSparql && sparqlQuery && (
                                <div style={{
                                    background: '#0f172a',
                                    padding: '25px',
                                    borderRadius: '15px',
                                    marginTop: '20px',
                                    maxHeight: '400px',
                                    overflowY: 'auto',
                                    border: '2px solid #1e40af',
                                    boxShadow: '0 8px 30px rgba(30, 64, 175, 0.3)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '15px', borderBottom: '2px solid #1e40af' }}>
                                        <span style={{ color: '#10b981', fontWeight: '800', fontSize: '16px', letterSpacing: '0.5px' }}>
                                            <i className="fas fa-code" style={{ marginRight: '10px' }}></i>
                                            Generated SPARQL Query
                                        </span>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(sparqlQuery);
                                                toast.success('SPARQL copied to clipboard!');
                                            }}
                                            style={{
                                                padding: '6px 14px',
                                                background: '#1e40af',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s'
                                            }}
                                        >
                                            <i className="fas fa-copy" style={{ marginRight: '6px' }}></i>
                                            Copy
                                        </button>
                                    </div>
                                    <pre style={{
                                        color: '#000000',
                                        fontSize: '14px',
                                        lineHeight: '1.8',
                                        margin: 0,
                                        fontFamily: '"Fira Code", Monaco, Consolas, monospace',
                                        whiteSpace: 'pre-wrap',
                                        wordWrap: 'break-word',
                                        fontWeight: '600',
                                        background: 'white',
                                        padding: '20px',
                                        borderRadius: '10px'
                                    }}>
                                        {sparqlQuery}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Create Button and Local Search */}
                    <div style={{ marginBottom: '30px', display: 'flex', gap: '15px', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ flex: 1, maxWidth: '400px' }}>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    value={localSearchQuery}
                                    onChange={(e) => setLocalSearchQuery(e.target.value)}
                                    placeholder={`Filter ${activeTab}...`}
                                    style={{
                                        width: '100%',
                                        padding: '12px 40px 12px 15px',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '12px',
                                        fontSize: '15px',
                                        outline: 'none',
                                        transition: 'all 0.3s'
                                    }}
                                />
                                <i className="fas fa-filter" style={{
                                    position: 'absolute',
                                    right: '15px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#64748b',
                                    fontSize: '16px'
                                }}></i>
                            </div>
                            {localSearchQuery && (
                                <div style={{ marginTop: '8px', fontSize: '13px', color: '#64748b', fontWeight: '600' }}>
                                    <i className="fas fa-info-circle" style={{ marginRight: '5px' }}></i>
                                    Showing {getFilteredData().length} of {getCurrentData().length} results
                                </div>
                            )}
                        </div>
                        <button
                            onClick={openCreateForm}
                            style={{
                                padding: '15px 30px',
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '16px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                boxShadow: '0 8px 25px rgba(16,185,129,0.3)',
                                transition: 'all 0.3s',
                                whiteSpace: 'nowrap'
                            }}
                            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                        >
                            <i className="fas fa-plus" style={{ marginRight: '10px' }}></i>
                            Create New
                        </button>
                    </div>

                    {/* Data Table */}
                    <div style={{ background: 'white', borderRadius: '20px', padding: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
                        {loading && <div style={{ textAlign: 'center', padding: '40px' }}><i className="fas fa-spinner fa-spin" style={{ fontSize: '36px', color: '#2563eb' }}></i></div>}
                        
                        {!loading && getFilteredData().length === 0 && getCurrentData().length === 0 && (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                                No {activeTab} found. Create your first one!
                            </div>
                        )}

                        {!loading && getFilteredData().length === 0 && getCurrentData().length > 0 && (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                                <i className="fas fa-search" style={{ fontSize: '48px', marginBottom: '15px', color: '#cbd5e1' }}></i>
                                <p style={{ fontSize: '18px', fontWeight: '600' }}>No results match your search</p>
                                <p style={{ fontSize: '14px', marginTop: '8px' }}>Try adjusting your search query</p>
                            </div>
                        )}

                        {!loading && getFilteredData().length > 0 && (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                            {activeTab === 'athletes' && <><th style={thStyle}>ID</th><th style={thStyle}>Name</th><th style={thStyle}>Nationality</th><th style={thStyle}>Position</th><th style={thStyle}>Goals</th><th style={thStyle}>Actions</th></>}
                                            {activeTab === 'coaches' && <><th style={thStyle}>ID</th><th style={thStyle}>Name</th><th style={thStyle}>Nationality</th><th style={thStyle}>Experience</th><th style={thStyle}>Titles</th><th style={thStyle}>Actions</th></>}
                                            {activeTab === 'achievements' && <><th style={thStyle}>ID</th><th style={thStyle}>Type</th><th style={thStyle}>Year</th><th style={thStyle}>Achieved By</th><th style={thStyle}>Actions</th></>}
                                            {activeTab === 'records' && <><th style={thStyle}>ID</th><th style={thStyle}>Type</th><th style={thStyle}>Value</th><th style={thStyle}>Set By</th><th style={thStyle}>Actions</th></>}
                                            {activeTab === 'referees' && <><th style={thStyle}>ID</th><th style={thStyle}>Name</th><th style={thStyle}>Nationality</th><th style={thStyle}>Experience</th><th style={thStyle}>Matches</th><th style={thStyle}>Actions</th></>}
                                            {activeTab === 'teams' && <><th style={thStyle}>ID</th><th style={thStyle}>Name</th><th style={thStyle}>Type</th><th style={thStyle}>Country</th><th style={thStyle}>Founded</th><th style={thStyle}>Actions</th></>}
                                            {activeTab === 'competitions' && <><th style={thStyle}>ID</th><th style={thStyle}>Name</th><th style={thStyle}>Type</th><th style={thStyle}>Season</th><th style={thStyle}>Start Date</th><th style={thStyle}>Actions</th></>}
                                            {activeTab === 'organizations' && <><th style={thStyle}>ID</th><th style={thStyle}>Name</th><th style={thStyle}>Type</th><th style={thStyle}>Headquarters</th><th style={thStyle}>Founded</th><th style={thStyle}>Actions</th></>}
                                            {activeTab === 'venues' && <><th style={thStyle}>ID</th><th style={thStyle}>Name</th><th style={thStyle}>City</th><th style={thStyle}>Country</th><th style={thStyle}>Capacity</th><th style={thStyle}>Actions</th></>}
                                            {activeTab === 'media' && <><th style={thStyle}>ID</th><th style={thStyle}>Name</th><th style={thStyle}>Type</th><th style={thStyle}>Launch Year</th><th style={thStyle}>Audience</th><th style={thStyle}>Actions</th></>}
                                            {activeTab === 'sports' && <><th style={thStyle}>ID</th><th style={thStyle}>Name</th><th style={thStyle}>Olympic</th><th style={thStyle}>Origin</th><th style={thStyle}>Participants</th><th style={thStyle}>Actions</th></>}
                                            {activeTab === 'equipment' && <><th style={thStyle}>ID</th><th style={thStyle}>Name</th><th style={thStyle}>Brand</th><th style={thStyle}>Sport</th><th style={thStyle}>Price</th><th style={thStyle}>Actions</th></>}
                                            {activeTab === 'sponsorships' && <><th style={thStyle}>ID</th><th style={thStyle}>Sponsor</th><th style={thStyle}>Sponsee</th><th style={thStyle}>Industry</th><th style={thStyle}>Amount</th><th style={thStyle}>Actions</th></>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getFilteredData().map(item => (
                                            <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                {activeTab === 'athletes' && (
                                                    <>
                                                        <td style={tdStyle}>{item.id}</td>
                                                        <td style={tdStyle}>{item.firstName} {item.lastName}</td>
                                                        <td style={tdStyle}>{item.nationality || '-'}</td>
                                                        <td style={tdStyle}>{item.position || '-'}</td>
                                                        <td style={tdStyle}>{item.goalsScored || 0}</td>
                                                        <td style={tdStyle}><ActionButtons item={item} onEdit={openEditForm} onDelete={handleDelete} /></td>
                                                    </>
                                                )}
                                                {activeTab === 'coaches' && (
                                                    <>
                                                        <td style={tdStyle}>{item.id}</td>
                                                        <td style={tdStyle}>{item.firstName} {item.lastName}</td>
                                                        <td style={tdStyle}>{item.nationality || '-'}</td>
                                                        <td style={tdStyle}>{item.experienceYears || 0} years</td>
                                                        <td style={tdStyle}>{item.titlesWon || 0}</td>
                                                        <td style={tdStyle}><ActionButtons item={item} onEdit={openEditForm} onDelete={handleDelete} /></td>
                                                    </>
                                                )}
                                                {activeTab === 'achievements' && (
                                                    <>
                                                        <td style={tdStyle}>{item.id}</td>
                                                        <td style={tdStyle}>{item.achievementType}</td>
                                                        <td style={tdStyle}>{item.year || '-'}</td>
                                                        <td style={tdStyle}>{item.achievedBy || '-'}</td>
                                                        <td style={tdStyle}><ActionButtons item={item} onEdit={openEditForm} onDelete={handleDelete} /></td>
                                                    </>
                                                )}
                                                {activeTab === 'records' && (
                                                    <>
                                                        <td style={tdStyle}>{item.id}</td>
                                                        <td style={tdStyle}>{item.recordType}</td>
                                                        <td style={tdStyle}>{item.recordValue || item.performanceValue}</td>
                                                        <td style={tdStyle}>{item.setBy || '-'}</td>
                                                        <td style={tdStyle}><ActionButtons item={item} onEdit={openEditForm} onDelete={handleDelete} /></td>
                                                    </>
                                                )}
                                                {activeTab === 'referees' && (
                                                    <>
                                                        <td style={tdStyle}>{item.id}</td>
                                                        <td style={tdStyle}>{item.firstName} {item.lastName}</td>
                                                        <td style={tdStyle}>{item.nationality || '-'}</td>
                                                        <td style={tdStyle}>{item.experienceYears || 0} years</td>
                                                        <td style={tdStyle}>{item.matchesOfficiated || 0}</td>
                                                        <td style={tdStyle}><ActionButtons item={item} onEdit={openEditForm} onDelete={handleDelete} /></td>
                                                    </>
                                                )}
                                                {activeTab === 'teams' && (
                                                    <>
                                                        <td style={tdStyle}>{item.id}</td>
                                                        <td style={tdStyle}>{item.name || item.teamName}</td>
                                                        <td style={tdStyle}>{item.team_type || item.type || '-'}</td>
                                                        <td style={tdStyle}>{item.country || '-'}</td>
                                                        <td style={tdStyle}>{item.foundedYear || '-'}</td>
                                                        <td style={tdStyle}><ActionButtons item={item} onEdit={openEditForm} onDelete={handleDelete} /></td>
                                                    </>
                                                )}
                                                {activeTab === 'competitions' && (
                                                    <>
                                                        <td style={tdStyle}>{item.id}</td>
                                                        <td style={tdStyle}>{item.name || item.competitionName}</td>
                                                        <td style={tdStyle}>{item.type || '-'}</td>
                                                        <td style={tdStyle}>{item.season || '-'}</td>
                                                        <td style={tdStyle}>{item.startDate || '-'}</td>
                                                        <td style={tdStyle}><ActionButtons item={item} onEdit={openEditForm} onDelete={handleDelete} /></td>
                                                    </>
                                                )}
                                                {activeTab === 'organizations' && (
                                                    <>
                                                        <td style={tdStyle}>{item.id}</td>
                                                        <td style={tdStyle}>{item.name || item.organizationName}</td>
                                                        <td style={tdStyle}>{item.type || '-'}</td>
                                                        <td style={tdStyle}>{item.headquarters || '-'}</td>
                                                        <td style={tdStyle}>{item.establishedYear || item.foundedYear || '-'}</td>
                                                        <td style={tdStyle}><ActionButtons item={item} onEdit={openEditForm} onDelete={handleDelete} /></td>
                                                    </>
                                                )}
                                                {activeTab === 'venues' && (
                                                    <>
                                                        <td style={tdStyle}>{item.id}</td>
                                                        <td style={tdStyle}>{item.name}</td>
                                                        <td style={tdStyle}>{item.city || '-'}</td>
                                                        <td style={tdStyle}>{item.country || '-'}</td>
                                                        <td style={tdStyle}>{item.capacity ? item.capacity.toLocaleString() : '-'}</td>
                                                        <td style={tdStyle}><ActionButtons item={item} onEdit={openEditForm} onDelete={handleDelete} /></td>
                                                    </>
                                                )}
                                                {activeTab === 'media' && (
                                                    <>
                                                        <td style={tdStyle}>{item.id}</td>
                                                        <td style={tdStyle}>{item.name}</td>
                                                        <td style={tdStyle}>{item.type || 'Media'}</td>
                                                        <td style={tdStyle}>{item.launchYear || '-'}</td>
                                                        <td style={tdStyle}>{item.audience ? item.audience.toLocaleString() : '-'}</td>
                                                        <td style={tdStyle}><ActionButtons item={item} onEdit={openEditForm} onDelete={handleDelete} /></td>
                                                    </>
                                                )}
                                                {activeTab === 'sports' && (
                                                    <>
                                                        <td style={tdStyle}>{item.id}</td>
                                                        <td style={tdStyle}>{item.name}</td>
                                                        <td style={tdStyle}>{item.isOlympic ? '✓ Yes' : '✗ No'}</td>
                                                        <td style={tdStyle}>{item.originCountry || '-'}</td>
                                                        <td style={tdStyle}>{item.globalParticipants ? item.globalParticipants.toLocaleString() : '-'}</td>
                                                        <td style={tdStyle}><ActionButtons item={item} onEdit={openEditForm} onDelete={handleDelete} /></td>
                                                    </>
                                                )}
                                                {activeTab === 'equipment' && (
                                                    <>
                                                        <td style={tdStyle}>{item.id}</td>
                                                        <td style={tdStyle}>{item.name}</td>
                                                        <td style={tdStyle}>{item.brand || '-'}</td>
                                                        <td style={tdStyle}>{item.sport || '-'}</td>
                                                        <td style={tdStyle}>{item.price ? `$${item.price}` : '-'}</td>
                                                        <td style={tdStyle}><ActionButtons item={item} onEdit={openEditForm} onDelete={handleDelete} /></td>
                                                    </>
                                                )}
                                                {activeTab === 'sponsorships' && (
                                                    <>
                                                        <td style={tdStyle}>{item.id}</td>
                                                        <td style={tdStyle}>{item.sponsorName || '-'}</td>
                                                        <td style={tdStyle}>{item.sponsee || '-'}</td>
                                                        <td style={tdStyle}>{item.industry || '-'}</td>
                                                        <td style={tdStyle}>{item.amount ? `$${item.amount.toLocaleString()}M` : '-'}</td>
                                                        <td style={tdStyle}><ActionButtons item={item} onEdit={openEditForm} onDelete={handleDelete} /></td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {renderForm()}
        </LayoutV1>
    );
};

const FormField = ({ label, name, type = 'text', value, onChange, required, placeholder, multiline, rows = 3 }) => (
    <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', color: '#1e293b', fontSize: '14px', fontWeight: '600' }}>
            {label}
        </label>
        {multiline ? (
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                rows={rows}
                style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.3s',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                }}
            />
        ) : (
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.3s'
                }}
            />
        )}
    </div>
);

const SelectField = ({ label, name, value, onChange, options, required }) => (
    <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', color: '#1e293b', fontSize: '14px', fontWeight: '600' }}>
            {label}
        </label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '15px',
                outline: 'none',
                transition: 'all 0.3s',
                backgroundColor: 'white',
                cursor: 'pointer'
            }}
        >
            <option value="">-- Select {label} --</option>
            {options.map(option => (
                <option key={option} value={option}>{option}</option>
            ))}
        </select>
    </div>
);

const AthleteSelectField = ({ label, name, value, onChange, athletes }) => (
    <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', color: '#1e293b', fontSize: '14px', fontWeight: '600' }}>
            {label}
        </label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '15px',
                outline: 'none',
                transition: 'all 0.3s',
                backgroundColor: 'white',
                cursor: 'pointer'
            }}
        >
            <option value="">-- Select Athlete --</option>
            {athletes.map(athlete => (
                <option key={athlete.id} value={athlete.id}>
                    {athlete.firstName} {athlete.lastName} ({athlete.id})
                </option>
            ))}
        </select>
    </div>
);

const ActionButtons = ({ item, onEdit, onDelete, editDisabled }) => (
    <div style={{ display: 'flex', gap: '10px' }}>
        {!editDisabled && (
            <button onClick={() => onEdit(item)} style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
                <i className="fas fa-edit"></i>
            </button>
        )}
        <button onClick={() => onDelete(item.id)} style={{ padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
            <i className="fas fa-trash"></i>
        </button>
    </div>
);

const thStyle = { padding: '15px', textAlign: 'left', fontSize: '14px', fontWeight: '700', color: '#475569' };
const tdStyle = { padding: '15px', fontSize: '14px', color: '#1e293b' };

export default AdminPage;
