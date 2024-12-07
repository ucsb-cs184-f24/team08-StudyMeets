import React, { createContext, useContext, useState, useEffect } from 'react';

const API_KEY = '4N67Suy0261kD1AWSVvBOP0jdMS7E1PY';
const BASE_URL = 'https://api.ucsb.edu/academics/curriculums/v3';

const SubjectsClassesContext = createContext();

export const SubjectsClassesProvider = ({ children }) => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  const SubjectsList = [
    "ANTH", "ART", "ARTHI", "ARTST", "AS AM", "ASTRO", "BIOE", "BIOL",
    "BL ST", "CH E", "CHEM", "CH ST", "CHIN", "CLASS", "COMM", "C LIT",
    "CMPSC", "CMPTG", "CNCSP", "DANCE", "DYNS", "EARTH", "EACS", "EEMB",
    "ECON", "ED", "ECE", "ENGR", "ENGL", "EDS", "ESM", "ENV S", "ESS", "ES",
    "FEMST", "FAMST", "FR", "GEN S", "GEOG", "GER", "GPS", "GLOBL", "GRAD",
    "GREEK", "HEB", "HIST", "IQB", "INT", "ITAL", "JAPAN", "KOR", "LATIN",
    "LAIS", "LING", "LIT", "MARSC", "MARIN", "MATRL", "MATH", "ME", "MAT",
    "ME ST", "MES", "MS", "MCDB", "MUS", "MUS A", "PHIL", "PHYS", "POL S",
    "PORT", "PSY", "RG ST", "RENST", "RUSS", "SLAV", "SOC", "SPAN", "SHS",
    "PSTAT", "TMO", "THTR", "WRIT", "W&L"
  ];

  useEffect(() => {
    const fetchAllClasses = async () => {
      setLoading(true);
      try {
        const allClasses = [];
        for (const subject of SubjectsList) {
          const url = `${BASE_URL}/classes/search?quarter=20244&subjectCode=${encodeURIComponent(subject)}&pageSize=500`;
          try {
            const response = await fetch(url, {
              headers: {
                'ucsb-api-key': API_KEY,
              },
            });

            if (response.ok) {
              const classData = await response.json();
              const filteredClasses = classData.classes.map((cls) => cls.courseId);
              allClasses.push(...filteredClasses);
            } else {
              console.warn(`Skipping subject ${subject} due to fetch error.`);
            }
          } catch (error) {
            console.error(`Error fetching classes for subject ${subject}:`, error);
          }
        }
        setClasses(allClasses);
      } catch (error) {
        console.error('Failed to fetch all classes:', error.message);
      } finally {
        setLoading(false);
      }
    };

    setSubjects(SubjectsList);
    fetchAllClasses();
  }, []);

  return (
    <SubjectsClassesContext.Provider value={{ subjects, selectedSubjects, classes, setSelectedSubjects, loading }}>
      {children}
    </SubjectsClassesContext.Provider>
  );
};

export const useSubjectsClasses = () => useContext(SubjectsClassesContext);
